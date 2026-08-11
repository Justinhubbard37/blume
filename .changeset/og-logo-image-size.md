---
"blume": patch
---

Measure the OG-card brand mark's aspect ratio with `image-size` (already a dependency) instead of a viewBox regex. Legitimate SVG spellings the regex missed — `viewBox = "…"` with spaces, newline-separated values, explicit width/height attributes without a viewBox — no longer silently render a squashed square mark.
