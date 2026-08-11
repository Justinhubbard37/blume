---
"blume": patch
---

Measure header logo SVG dimensions with `image-size` instead of a hand-rolled attribute regex. This is the same parser the OG card already uses for the brand mark, so the two can no longer disagree about one logo, and spellings the regex missed (unquoted attributes, `em`/`pt` lengths, a `>` inside another attribute value) now measure correctly.
