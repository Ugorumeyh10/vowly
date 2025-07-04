/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const method = request.method;

		if (url.pathname === '/guests' && method === 'POST') {
			const body = await request.json() as { name: string; email: string };
			// Save guest data (mock implementation for now)
			const guest = { name: body.name, email: body.email };

			return new Response(
				JSON.stringify({ message: 'Guest added successfully!', guest }),
				{ headers: { 'Content-Type': 'application/json' } },
			);
		}

		if (url.pathname === '/guests' && method === 'GET') {
			// Return mock guest list
			return new Response(
				JSON.stringify([{ name: 'John Doe', email: 'john@example.com' }]),
				{ headers: { 'Content-Type': 'application/json' } },
			);
		}

		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
