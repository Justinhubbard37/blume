---
"blume": patch
---

Pace Notion source API requests through a bounded request pool (default 3 concurrent, configurable via `concurrency`) and jitter the 429 backoff, so large databases import within Notion's rate limits instead of failing the build with `BLUME_SOURCE_FETCH_FAILED`.
