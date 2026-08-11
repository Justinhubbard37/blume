---
"blume": patch
---

Strip all markup except bare `<mark>` highlights from Pagefind excerpts before rendering them in the search dialog and preview pane, so a compromised or tampered search index can't inject HTML into reader pages. The other providers already escape their excerpts.
