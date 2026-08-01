---
"blume": minor
---

Advertise the agent-facing surface with an RFC 8288 `Link` header on the homepage. The header points agents at `agent-readability.json` and `llms.txt` (`rel="describedby"`) and the homepage's raw-Markdown mirror (`rel="alternate"; type="text/markdown"`), and is emitted on every surface Blume controls: the dev server, the `_headers` file on static builds (Netlify/Cloudflare), and the routing config on Vercel server builds.
