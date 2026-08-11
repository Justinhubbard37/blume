---
"blume": patch
---

Consolidate four divergent route normalizers (OpenAPI references, Ask AI retrieval, the MCP server, and the Scalar page generator) onto one shared `normalizeRoute` in core, and retire the last quadratic edge-trimming regexes in favor of the linear `trim` helpers.
