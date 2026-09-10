import { searchGoogleOrganic } from "./searchGoogle.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/search" && request.method === "POST") {
      try {
        const body = await request.json();

        const query =
          typeof body?.query === "string"
            ? body.query.trim()
            : "";

        if (!query) {
          return Response.json(
            { error: "Zadejte klíčové slovní spojení." },
            { status: 400 }
          );
        }

        if (!env.SERPAPI_KEY) {
          return Response.json(
            { error: "Na serveru není nastaven SERPAPI_KEY." },
            { status: 500 }
          );
        }

        const data = await searchGoogleOrganic(
          query,
          env.SERPAPI_KEY
        );

        return Response.json(data);
      } catch (error) {
        console.error(error);

        return Response.json(
          { error: "Výsledky vyhledávání se nepodařilo načíst." },
          { status: 502 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
