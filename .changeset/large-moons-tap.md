---
"blume": minor
---

Generate an RFC 9727 API catalog at `/.well-known/api-catalog`. The linkset is derived from the site's configured APIs — each OpenAPI/AsyncAPI reference (anchored at its docs route, with `service-doc` and, for remote specs, `service-desc` relations) and the hosted MCP server (with its discovery document as the service description). Served as `application/linkset+json` on every build surface, advertised via a `rel="api-catalog"` homepage Link header and in `agent-readability.json`. Sites with no APIs emit no catalog.
