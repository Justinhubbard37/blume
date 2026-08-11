---
"blume": patch
---

Render Ask AI answers through a dedicated `Marked` instance instead of mutating the shared `marked` singleton, so other components importing `marked` no longer inherit the panel's `breaks` option and citation link rewriting.
