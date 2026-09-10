import { describe, expect, it, vi, afterEach } from "vitest";
import { normalizeOrganicResults } from "../src/normalizeResults.js";

describe("normalizeOrganicResults", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates the expected structured output", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-10T17:00:00.000Z"));

    const payload = {
      organic_results: [
        {
          position: 1,
          title: "Example One",
          link: "https://example.com/one",
          snippet: "First result"
        },
        {
          position: 2,
          title: "Example Two",
          link: "https://example.com/two",
          snippet: "Second result"
        }
      ]
    };

    expect(normalizeOrganicResults(payload, "webdesign Praha")).toEqual({
      query: "webdesign Praha",
      retrievedAt: "2026-09-10T17:00:00.000Z",
      results: [
        {
          position: 1,
          title: "Example One",
          url: "https://example.com/one",
          description: "First result"
        },
        {
          position: 2,
          title: "Example Two",
          url: "https://example.com/two",
          description: "Second result"
        }
      ]
    });
  });

  it("returns an empty result list when organic results are missing", () => {
    const output = normalizeOrganicResults({}, "test");

    expect(output.query).toBe("test");
    expect(output.results).toEqual([]);
    expect(typeof output.retrievedAt).toBe("string");
  });

  it("uses safe fallback values for incomplete result items", () => {
    const payload = {
      organic_results: [{ title: "Only title" }]
    };

    const output = normalizeOrganicResults(payload, "test");

    expect(output.results).toEqual([
      {
        position: 1,
        title: "Only title",
        url: "",
        description: ""
      }
    ]);
  });
});
