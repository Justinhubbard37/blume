---
"blume": patch
---

Bound concurrent file reads during audit crawling, example/island discovery, and math detection with `p-map`. These previously fanned out one unbounded `fs` call per discovered file, which on large sites risked `EMFILE` and held every page's HTML in memory at once.
