---
"blume": patch
---

Generate OpenAPI request examples with openapi-sampler, the generator behind Redoc. Two visible improvements over the hand-rolled sampler: `readOnly` fields no longer appear in request-body samples (they are server-generated and were previously included even though the schema declared them read-only), and format-aware placeholders replace generic ones — `email`, `uuid`, `uri`, and friends produce realistic values instead of `"<format>"`. Declared `example`/`const`/`default`/`enum` values keep their precedence, and circular `$ref` chains still terminate safely.
