# INIZIO – Google Organic Search

Jednoduchá webová aplikace vytvořená jako praktický test.

## Funkce

- jeden vstup pro klíčové slovní spojení
- načtení organických výsledků z první stránky Google
- zobrazení výsledků v jednoduchém rozhraní
- export výsledků do JSON
- unit testy správnosti výstupu
- Docker Compose pro lokální vývoj

## Technologie

- Node.js 20+
- Express
- vanilla HTML / CSS / JavaScript
- SerpApi
- Vitest

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

```bash
npm test
```

## Docker Compose

Nejprve vytvořte `.env` se `SERPAPI_KEY`, potom:

```bash
docker compose up --build
```

Aplikace poběží na:

```text
http://localhost:3000
```

## Struktura výstupu

```json
{
  "query": "webdesign Praha",
  "retrievedAt": "2026-09-10T17:00:00.000Z",
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

Aplikace nezískává výsledky přímým scrapováním HTML stránky Google.
Vyhledávací požadavek probíhá na backendu přes SerpApi.

Důvody:

- API klíč není vystaven ve frontendovém kódu
- výstup je stabilní a strukturovaný
- organické výsledky lze jednoznačně oddělit od reklam
- frontend není závislý na HTML struktuře Google

Frontend komunikuje pouze s vlastním endpointem `/api/search`.
