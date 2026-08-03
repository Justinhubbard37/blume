---
"blume": minor
---

Stamp an `x-markdown-tokens` header (estimated token count, ~4 characters per token) on Markdown responses, following the Cloudflare Markdown for Agents convention: the raw-Markdown endpoints send it on dev and server-rendered responses, and the Vercel routing config carries it on the negotiated homepage.
