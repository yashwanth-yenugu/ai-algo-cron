interface Env {}

// Global variable to store API response and timing
let lastApiData: {
	response: any;
	responseTimeMs: number;
	timestamp: string;
} | null = null;

export default {
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext,
	) {
		// Run every 15 minutes
		if (controller.cron === "*/15 * * * *") {
			const url = "https://ai-algo-om07.onrender.com/";
			const start = Date.now();
			let response, responseBody;
			try {
				response = await fetch(url);
				responseBody = await response.text();
			} catch (err) {
				responseBody = `Error: ${err}`;
			}
			const end = Date.now();
			lastApiData = {
				response: responseBody,
				responseTimeMs: end - start,
				timestamp: new Date().toISOString(),
			};
			console.log("API called, data stored", lastApiData);
		}
	},

	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Endpoint to return last API data
		if (new URL(request.url).pathname === "/last-api-data") {
			return new Response(JSON.stringify(lastApiData), {
				headers: { "Content-Type": "application/json" },
			});
		}
		return new Response("Not found", { status: 404 });
	},
};
