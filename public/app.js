const form = document.querySelector("#search-form");
const queryInput = document.querySelector("#query");
const searchButton = document.querySelector("#search-button");
const status = document.querySelector("#status");
const resultsSection = document.querySelector("#results-section");
const resultsTitle = document.querySelector("#results-title");
const resultsList = document.querySelector("#results-list");
const downloadButton = document.querySelector("#download-button");

let latestData = null;

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function renderResults(data) {
  resultsList.innerHTML = "";

  for (const result of data.results) {
    const item = document.createElement("li");
    item.className = "result";

    const title = document.createElement("a");
    title.className = "result-title";
    title.href = result.url;
    title.target = "_blank";
    title.rel = "noopener noreferrer";
    title.textContent = result.title || result.url || "Výsledek";

    const url = document.createElement("p");
    url.className = "result-url";
    url.textContent = result.url;

    const description = document.createElement("p");
    description.className = "result-description";
    description.textContent = result.description || "Bez popisu.";

    item.append(title, url, description);
    resultsList.append(item);
  }

  resultsTitle.textContent = `Výsledky pro „${data.query}“`;
  resultsSection.hidden = false;
}

function safeFilename(query) {
  const slug = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `google-results-${slug || "search"}.json`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = queryInput.value.trim();

  if (!query) {
    setStatus("Zadejte klíčové slovní spojení.", true);
    return;
  }

  latestData = null;
  resultsSection.hidden = true;
  searchButton.disabled = true;
  setStatus("Načítám organické výsledky…");

  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Vyhledávání se nepodařilo.");
    }

    latestData = data;
    renderResults(data);

    setStatus(
      data.results.length
        ? `Nalezeno ${data.results.length} organických výsledků.`
        : "Google nevrátil žádné organické výsledky."
    );
  } catch (error) {
    setStatus(error.message || "Vyhledávání se nepodařilo.", true);
  } finally {
    searchButton.disabled = false;
  }
});

downloadButton.addEventListener("click", () => {
  if (!latestData) return;

  const blob = new Blob(
    [JSON.stringify(latestData, null, 2)],
    { type: "application/json;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = safeFilename(latestData.query);
  document.body.append(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
});
