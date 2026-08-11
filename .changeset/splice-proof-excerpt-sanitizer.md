---
"blume": patch
---

Harden the search excerpt sanitizer against tag splicing: every `<` is now consumed by a single scan, so dropping a disallowed tag can no longer join the text around it into a fresh one.
