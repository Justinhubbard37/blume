---
"blume": patch
---

Hash staged source content and asset filenames with SHA-256 (64-bit prefix) instead of a 31-bit DJB2 hash. The old hash named downloaded CMS assets, where a collision — plausible from ~46k items — silently served the wrong file. The first build after upgrading re-downloads remote source assets once under the new names.
