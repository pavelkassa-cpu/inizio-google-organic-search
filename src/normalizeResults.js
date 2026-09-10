export function normalizeOrganicResults(payload, query) {
  const organic = Array.isArray(payload?.organic_results)
    ? payload.organic_results
    : [];

  return {
    query,
    retrievedAt: new Date().toISOString(),
    results: organic.map((item, index) => ({
      position: Number.isFinite(item?.position) ? item.position : index + 1,
      title: typeof item?.title === "string" ? item.title : "",
      url: typeof item?.link === "string" ? item.link : "",
      description: typeof item?.snippet === "string" ? item.snippet : ""
    }))
  };
}
