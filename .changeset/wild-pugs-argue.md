---
"blume": minor
---

Align the MCP server card with the SEP-2127 Server Card extension schema. `/.well-known/mcp/server-card.json` now declares the published `$schema`, a reverse-DNS `name` derived from the site host, `title`, `websiteUrl`, and `remotes` transport endpoints (absolute, so present once the site URL is known), alongside initialize-shaped compat fields (`serverInfo`, `capabilities`, `transports`) for scanners built against the proposal's earlier revision. The advertised tool set and existing `transport`/`url` fields are unchanged.
