---
"blume": patch
---

Locate Ask AI grounding excerpts for queries in languages written without word spaces. Query terms are now segmented with `Intl.Segmenter` (with a Unicode-aware regex fallback) instead of a Latin-only pattern, so Japanese, Chinese, Korean, and Thai questions center the injected excerpt on the matching section instead of always sending the head of the page. Content and query are NFC-normalized so decomposed text still matches.
