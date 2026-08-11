---
"blume": patch
---

Count audit prose words with `Intl.Segmenter` seeded by the page's `lang`. The whitespace split it replaces counted a fully written Japanese or Chinese page as a handful of "words", tripping `BLUME_AUDIT_LOW_WORD_COUNT` on every page of a CJK site.
