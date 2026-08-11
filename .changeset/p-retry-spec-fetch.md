---
"blume": patch
---

Drive remote OpenAPI spec fetch retries through `p-retry` instead of a hand-rolled loop. The behavior is unchanged — three attempts, exponential backoff capped at 10s, non-retryable statuses abort immediately, and a sane `Retry-After` replaces the backoff rather than stacking on it (now covered by a test).
