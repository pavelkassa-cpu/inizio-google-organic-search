import { describe, expect, it } from "vitest";
import { searchGoogleOrganic } from "../src/searchGoogle.js";

describe("searchGoogleOrganic", () => {
  it("returns only the normalized organic results from the API response", async () => {
    const fakeFetch = async () => ({
      ok: true,
      json: async () => ({
        ads: [
          {
            title: "Paid result",
            link: "https://ads.example.com"
          }
        ],
        organic_results: [
          {
            position: 1,
            title: "Organic result",
            link: "https://example.com",
            snippet: "Organic snippet"
          }
        ]
      })
    });

    const output = await searchGoogleOrganic(
      "webdesign Praha",
      "fake-api-key",
      fakeFetch
    );

    expect(output.results).toHaveLength(1);
    expect(output.results[0]).toMatchObject({
      position: 1,
      title: "Organic result",
      url: "https://example.com",
      description: "Organic snippet"
    });
  });

  it("throws when the search provider returns an HTTP error", async () => {
    const fakeFetch = async () => ({
      ok: false,
      status: 500
    });

    await expect(
      searchGoogleOrganic("test", "fake-api-key", fakeFetch)
    ).rejects.toThrow("SerpApi request failed with status 500");
  });
});
