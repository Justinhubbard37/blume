---
"blume": patch
---

Replace three hand-rolled concurrency pools with `p-limit`/`p-map`: the Notion source's request semaphore, the link-audit probe pool, and the translate runner's worker lanes and ledger-flush mutex. Behavior is unchanged — bounds, FIFO ordering, and the flush-before-next-item guarantee all carry over — with ~100 fewer lines to maintain.
