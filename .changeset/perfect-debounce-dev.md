---
"blume": patch
---

Collapse the dev server's regeneration debounce and single-flight coalescer into `perfect-debounce`, whose contract covers both: watch bursts debounce at 80ms and a trigger during a running scan marks exactly one trailing rerun instead of starting an overlapping scan. The heap-exhaustion guarantee the old coalescer carried is pinned by a dedicated test against the library.
