---
"blume": patch
---

Fix `blume check` failing on the generated MCP endpoint when `ai.mcp` is enabled. JSON imports widen literal types, so `mcp-data.json` could never satisfy `McpData`'s discriminated navigation nodes; the generated endpoint now asserts the snapshot back to `McpData` at the JSON boundary.
