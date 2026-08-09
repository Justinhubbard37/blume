---
"blume": patch
---

Advertise agent discovery in every page's head, not just the homepage header

An agent that enters the site on a deep page — a search result, a shared link — never sees the homepage-only `Link` response header, so it had no path to `agent-readability.json`. Every rendered page now carries the discovery links in its HTML head: `describedby` links to `agent-readability.json` and `llms.txt`, plus a `text/markdown` `alternate` pointing at the page's own raw-Markdown mirror. Because the links travel with the prerendered HTML, they also work on hosts where Blume can't set response headers at all (GitHub Pages, S3).
