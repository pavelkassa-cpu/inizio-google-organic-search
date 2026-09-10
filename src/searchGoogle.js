import { normalizeOrganicResults } from "./normalizeResults.js";

export async function searchGoogleOrganic(query, apiKey, fetchImpl = fetch) {
  const params = new URLSearchParams({
    engine: "google",
    q: query,
    google_domain: "google.cz",
    gl: "cz",
    hl: "cs",
    num: "10",
    api_key: apiKey
  });

  const response = await fetchImpl(`https://serpapi.com/search.json?${params}`);

  if (!response.ok) {
    throw new Error(`SerpApi request failed with status ${response.status}`);
  }

  const payload = await response.json();

  if (payload?.error) {
    throw new Error(payload.error);
  }

  return normalizeOrganicResults(payload, query);
}
