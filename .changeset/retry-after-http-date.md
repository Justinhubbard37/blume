---
"blume": patch
---

Honor the HTTP-date form of `Retry-After` (RFC 9110's `Wed, 21 Oct 2015 07:28:00 GMT` spelling) when retrying remote OpenAPI spec fetches. Previously only delta-seconds were parsed and date values were silently ignored.
