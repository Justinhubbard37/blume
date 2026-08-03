---
"blume": patch
---

Negotiate `Accept: text/markdown` on the homepage even when it's a landing page. A user-authored home page has no Markdown source, so agent requests for a markdown homepage previously fell through to HTML; the homepage's mirror now falls back to the `llms.txt` index — the machine-readable map of the site — served at `/index.md` and wired into the dev server, the Vercel routing config, and the homepage `Link` header's `rel="alternate"` entry.
