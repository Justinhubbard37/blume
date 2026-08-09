---
"blume": patch
---

Measure WebP and AVIF images in the audit's Open Graph checks. The hand-rolled header parser only understood PNG, JPEG, and GIF, so builds whose image pipeline emits modern formats — including Blume's own sharp-based optimization — silently skipped every OG image dimension check. Dimensions now come from the image-size package, which covers 25+ formats; unknown or truncated files still yield no finding.
