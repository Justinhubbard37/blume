---
"blume": minor
---

Register WebMCP tools on every page. Agentic browsers with a model context (`navigator.modelContext` or `document.modelContext`, `provideContext` or `registerTool`) get the docs' read-only surface as in-page tools: `search_docs` (lazy-loads the configured search client on first call), `get_page` (a page's raw-Markdown mirror), and `list_pages` (the llms.txt index). The script is tiny and no-ops in browsers without the API. On by default; set `ai.webmcp: false` to opt out.
