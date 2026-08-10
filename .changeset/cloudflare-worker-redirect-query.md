---
"blume": patch
---

Preserve the request query string when the Cloudflare wrapper Worker answers a configured redirect. The baked-in redirect table now matches the static layer's `_redirects` semantics: the incoming query string is forwarded to the destination unless the destination specifies its own, so inbound links carrying UTM or ref parameters keep them across a retired URL.
