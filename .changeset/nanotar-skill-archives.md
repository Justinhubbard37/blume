---
"blume": patch
---

Build agent-skill `.tar.gz` archives with `nanotar` instead of a hand-rolled ustar writer, keeping the path validation, deterministic attributes, and sync gzip layer. The header byte layout changes once with this release, so each published skill's archive digest changes on the next build; digests remain stable from then on and are now pinned by a golden test.
