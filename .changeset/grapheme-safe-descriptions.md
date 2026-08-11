---
"blume": patch
---

Cut GitHub Releases meta descriptions on grapheme boundaries. The UTF-16 slice could split a surrogate pair at the 160-character cap, emitting invalid Unicode (a lone surrogate) into `seo.description`.
