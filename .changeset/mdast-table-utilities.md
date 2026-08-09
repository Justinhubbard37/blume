---
"blume": patch
---

Use the unified ecosystem's own utilities for two hand-rolled markdown helpers: directive label text extraction now goes through `mdast-util-to-string`, and the `<TypeTable>` Markdown downlevel builds its GFM table with `markdown-table`, which owns delimiter-row and cell padding rules instead of string concatenation.
