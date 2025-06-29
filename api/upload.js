import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import formidable from 'formidable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const file = files.file?.[0];
  const fileName = fields.fileName?.[0];

  if (!file || !fileName) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    const fileBuffer = require('fs').readFileSync(file.filepath);
    await s3Client.send(new PutObjectCommand({
      Bucket: 'wedding-uploads',
      Key: `public/${fileName}`,
      Body: fileBuffer,
      ContentType: file.mimetype,
    }));

    const fileUrl = `https://pub-<YOUR_PUBLIC_BUCKET_ID>.r2.dev/${fileName}`;
    return res.status(200).json({ message: 'File uploaded successfully', url: fileUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};