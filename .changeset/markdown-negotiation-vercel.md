---
"blume": minor
---

Serve Markdown to agents through `Accept: text/markdown` content negotiation on Vercel server builds. The build splices header-conditional rewrite rules into the Vercel routing config, so a content-page request that prefers `text/markdown` gets the page's raw-Markdown mirror at the same URL — with `Vary: Accept` on both variants — and `agent-readability.json` now advertises `contentNegotiation` only on deployments that honor the header.
