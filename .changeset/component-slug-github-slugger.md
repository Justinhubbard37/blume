---
"blume": patch
---

Slug Accordion, Tab, and Update ids through `github-slugger` via one shared helper instead of three identical per-component copies. Component ids now slug exactly like heading anchors: unicode letters are kept (`Español` → `español` instead of `espaol`) and underscores survive. Titles that relied on the old ASCII-only stripping get new ids, so hash deep-links to such components change once.
