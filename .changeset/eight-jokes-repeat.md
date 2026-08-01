---
"blume": minor
---

Publish a Web Bot Auth signature directory from `ai.webBotAuth.keys`. The configured public JWKs are served at `/.well-known/http-message-signatures-directory` with the registered media type on every build surface (static hosts via `_headers`, Vercel server builds via a Build Output content-type override), advertised in `agent-readability.json`, and validated to be public-key-only — a JWK containing private material is rejected at config time.
