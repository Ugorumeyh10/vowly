import { SignJWT, jwtVerify } from "jose";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getJwtSecret = (env) => new TextEncoder().encode(env.JWT_SECRET);

async function authMiddleware(request, env, corsHeaders) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Missing or invalid Authorization header", { status: 401, headers: corsHeaders });
  }
  const token = authHeader.substring(7);
  try {
    const { payload } = await jwtVerify(token, await getJwtSecret(env));
    request.user = payload; // Attach user payload to the request
    return null; // Indicates success
  } catch (err) {
    return new Response(err.message, { status: 401, headers: corsHeaders });
  }
}

async function sendMagicLink(email, token, env) {
  const magicLink = `${env.APP_URL}/callback?token=${token}`;
  const body = `
    Hello!
    
    Click the link below to log in to Vowly. This link is valid for 15 minutes.
    
    ${magicLink}
    
    If you did not request this, you can safely ignore this email.
  `;

  // We use MailChannels to send email for free from Cloudflare Workers.
  const send_request = new Request("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: "no-reply@vowly.com.ng", name: "Vowly" },
      subject: "Your Vowly Login Link",
      content: [{ type: "text/plain", value: body }],
    }),
  });

  const resp = await fetch(send_request);
  if (!resp.ok) {
    const errorText = await resp.text();
    console.error(`MailChannels error: ${errorText}`);
    throw new Error(`Email provider failed to send link. Please try again later. (MailChannels: ${resp.status})`);
  }
}

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      const url = new URL(request.url);
      const method = request.method;

      if (url.pathname === "/auth/login" && method === "POST") {
        const { email } = await request.json();
        if (!email) return new Response("Email is required", { status: 400, headers: corsHeaders });

        const loginToken = crypto.randomUUID();
        await env.LOGIN_TOKENS_KV.put(loginToken, email, { expirationTtl: 900 });

        await sendMagicLink(email, loginToken, env);

        return new Response(JSON.stringify({ success: true, message: "Login link sent to your email." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/auth/verify" && method === "POST") {
        const { token } = await request.json();
        if (!token) return new Response("Login token is required", { status: 400, headers: corsHeaders });

        const userEmail = await env.LOGIN_TOKENS_KV.get(token);
        if (!userEmail) return new Response("Invalid or expired login token", { status: 401, headers: corsHeaders });

        await env.LOGIN_TOKENS_KV.delete(token);

        const sessionToken = await new SignJWT({ email: userEmail, name: userEmail.split('@')[0] })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('30d')
          .sign(await getJwtSecret(env));

        return new Response(JSON.stringify({ token: sessionToken }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/upload-url" && method === "POST") {
        const authError = await authMiddleware(request, env, corsHeaders);
        if (authError) return authError;
        const { filename, contentType } = await request.json();
        const s3 = new S3Client({
          region: "auto",
          endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
          credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
        });
        const command = new PutObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: filename, ContentType: contentType });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return new Response(JSON.stringify({ url: signedUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/media" && method === "POST") {
        const authError = await authMiddleware(request, env, corsHeaders);
        if (authError) return authError;
        const { id, key, contentType } = await request.json();
        const metadata = { id, key, contentType, uploaderName: request.user.name, uploaderEmail: request.user.email, uploadedAt: new Date().toISOString() };
        await env.MEDIA_METADATA.put(id, JSON.stringify(metadata));
        return new Response(JSON.stringify({ success: true, metadata }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/media" && method === "GET") {
        // This endpoint is now public, no auth needed
        const list = await env.MEDIA_METADATA.list();
        const promises = list.keys.map((key) => env.MEDIA_METADATA.get(key.name, "json"));
        const mediaItems = (await Promise.all(promises)).filter(Boolean).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        return new Response(JSON.stringify(mediaItems), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const commentMatch = url.pathname.match(/^\/media\/([^/]+)\/comments$/);
      if (commentMatch) {
        const mediaId = commentMatch[1];
        if (method === "GET") {
          // This endpoint is now public, no auth needed
          const comments = (await env.MEDIA_COMMENTS.get(mediaId, "json")) || [];
          return new Response(JSON.stringify(comments), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        if (method === "POST") {
          // Posting a comment requires authentication
          const authError = await authMiddleware(request, env, corsHeaders);
          if (authError) return authError;
          const { text } = await request.json();
          const comments = (await env.MEDIA_COMMENTS.get(mediaId, "json")) || [];
          const newComment = { id: crypto.randomUUID(), author: request.user.name, text, timestamp: new Date().toISOString() };
          comments.push(newComment);
          await env.MEDIA_COMMENTS.put(mediaId, JSON.stringify(comments));
          return new Response(JSON.stringify(newComment), { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }

      const guestMatch = url.pathname.match(/^\/guests\/?([a-zA-Z0-9-]+)?$/);
      if (guestMatch) {
        const authError = await authMiddleware(request, env, corsHeaders);
        if (authError) return authError;
        const guestId = guestMatch[1];
        if (guestId && method === 'DELETE') {
          await env.GUESTS_KV.delete(guestId);
          return new Response(null, { status: 204, headers: corsHeaders });
        }
        if (!guestId && method === 'GET') {
          const list = await env.GUESTS_KV.list();
          const promises = list.keys.map(key => env.GUESTS_KV.get(key.name, "json"));
          const guests = (await Promise.all(promises)).filter(Boolean);
          return new Response(JSON.stringify(guests), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        if (guestId && method === 'PUT') {
            const { name, email } = await request.json();
            const existingGuest = await env.GUESTS_KV.get(guestId, "json");
            if (!existingGuest) return new Response("Guest not found", { status: 404, headers: corsHeaders });
            const updatedGuest = { ...existingGuest, name, email };
            await env.GUESTS_KV.put(guestId, JSON.stringify(updatedGuest));
            return new Response(JSON.stringify(updatedGuest), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        if (!guestId && method === 'POST') {
          const { name, email } = await request.json();
          const id = crypto.randomUUID();
          const newGuest = { id, name, email, addedAt: new Date().toISOString() };
          await env.GUESTS_KV.put(id, JSON.stringify(newGuest));
          return new Response(JSON.stringify(newGuest), { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (error) {
      // Log the full error stack for better debugging
      console.error("Worker error:", error.stack || error);
      return new Response(error.message || "Internal Server Error", {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }
  },
};