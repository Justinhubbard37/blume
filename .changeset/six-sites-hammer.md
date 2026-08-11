---
"blume": patch
---

Keep Unicode letters in OpenAPI tag slugs, and label tag sidebar groups with the spec's own tag names. Slugs derived from OpenAPI tag names and reference-source labels now keep Unicode letters and numbers (with NFC normalization) instead of stripping them to hyphens, and tag sidebar groups take their label directly from the spec's `tags[].name` (overridable with a `meta.ts` title), so authored casing like `OAuth2` or `Größe` renders verbatim. Note that operation-page URLs change for specs whose tag names, operation ids, or source labels contain non-ASCII characters — if such URLs are already deployed, add entries under `redirects` in `blume.config` to forward the old routes.
