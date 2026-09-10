# INIZIO – Google Organic Search

Jednoduchá webová aplikace vytvořená jako praktický test pro INIZIO.

## Live demo

Aplikace je veřejně dostupná zde:

https://inizio-google-organic-search.pavel-kassa.workers.dev

## Funkce

- zadání klíčového slovního spojení
- načtení organických výsledků z první stránky Google
- zobrazení výsledků v jednoduchém webovém rozhraní
- zobrazení pozice, názvu, URL a popisu výsledku
- export výsledků do strojově čitelného formátu JSON
- automatické unit testy
- Docker Compose pro lokální spuštění

## Technologie

- Node.js 20+
- Express
- vanilla HTML / CSS / JavaScript
- SerpApi
- Vitest
- Docker / Docker Compose
- Cloudflare Workers

## Lokální spuštění

1. Nainstalujte závislosti:

```bash
npm install
```

2. Vytvořte `.env` podle `.env.example`:

```env
SERPAPI_KEY=your_key_here
PORT=3000
```

3. Spusťte aplikaci:

```bash
npm run dev
```

4. Otevřete:

```text
http://localhost:3000
```

## Testy

Automatické testy lze spustit příkazem:

```bash
npm test
```

Testy ověřují normalizaci organických výsledků a chování vyhledávací služby.

## Docker Compose

Nejprve vytvořte `.env` se `SERPAPI_KEY` a poté spusťte:

```bash
docker compose up --build
```

Aplikace bude dostupná na:

```text
http://localhost:3000
```

## Struktura výstupu

Výsledky lze stáhnout ve formátu JSON:

```json
{
  "query": "webdesign Praha",
  "retrievedAt": "2026-09-10T18:44:53.695Z",
  "results": [
    {
      "position": 1,
      "title": "Název výsledku",
      "url": "https://example.com",
      "description": "Popis výsledku"
    }
  ]
}
```

## Poznámka k řešení

Aplikace nezískává výsledky přímým scrapováním HTML stránky Google. Vyhledávací požadavek probíhá na backendu přes SerpApi.

Toto řešení jsem zvolil z několika důvodů:

- API klíč není vystaven ve frontendovém kódu
- výstup je stabilní a strukturovaný
- organické výsledky lze jednoznačně oddělit od reklam
- frontend není závislý na aktuální HTML struktuře Google

Frontend komunikuje pouze s vlastním endpointem `/api/search`.

## Nasazení

Produkční verze je nasazena na Cloudflare Workers.

Statické soubory jsou obsluhovány prostřednictvím Cloudflare Assets a backendový endpoint `/api/search` zpracovává Cloudflare Worker.

`SERPAPI_KEY` je uložen jako server-side secret a není součástí zdrojového kódu ani repozitáře.

## Struktura projektu

```text
public/                 frontend aplikace
src/
  normalizeResults.js   normalizace výsledků
  searchGoogle.js       komunikace se SerpApi
  server.js             lokální Node.js / Express server
  worker.js             Cloudflare Worker
tests/                  automatické testy
Dockerfile
docker-compose.yml
wrangler.jsonc
```
