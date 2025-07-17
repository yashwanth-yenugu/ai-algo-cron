interface Env {
  API_DATA: KVNamespace;
}

interface ApiData {
  response: any;
  responseTimeMs: number;
  timestamp: string;
}

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ) {
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
    const apiData: ApiData = {
      response: responseBody,
      responseTimeMs: end - start,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };
    await env.API_DATA.put("last-api-data", JSON.stringify(apiData));
    console.log("API called, data stored", apiData);
  },

  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Endpoint to return last API data
    if (new URL(request.url).pathname === "/last-api-data") {
      const data = await env.API_DATA.get("last-api-data");
      if (!data) {
        return new Response("No Data", {
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(data, {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Not found", { status: 404 });
  },
};
