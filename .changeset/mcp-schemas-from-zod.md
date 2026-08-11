---
"blume": patch
---

Define each MCP tool's input once in zod and derive both the runtime argument parsing and the JSON Schema advertised by `tools/list` from that single definition, so the two can no longer drift. The lenient agent-friendly coercions are preserved: a bare string is accepted for an array field, `[]`/`{}` mean "no filter", and out-of-range limits clamp instead of rejecting.
