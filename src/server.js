import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { searchGoogleOrganic } from "./searchGoogle.js";

const app = express();
const port = Number(process.env.PORT || 3000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

app.use(express.json());
app.use(express.static(publicDir));

app.post("/api/search", async (req, res) => {
  const query = typeof req.body?.query === "string"
    ? req.body.query.trim()
    : "";

  if (!query) {
    return res.status(400).json({ error: "Zadejte klíčové slovní spojení." });
  }

  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Na serveru není nastaven SERPAPI_KEY."
    });
  }

  try {
    const data = await searchGoogleOrganic(query, apiKey);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(502).json({
      error: "Výsledky vyhledávání se nepodařilo načíst."
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
