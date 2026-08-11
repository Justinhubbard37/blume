---
"blume": patch
---

Keep Unicode letters in CMS/frontmatter slugs. The slugifier's ASCII-only keep-class deleted every non-ASCII character, so a Japanese/Chinese/Cyrillic `slug` collapsed to empty (forcing Sanity/Notion routes onto opaque document-id fallbacks) and accented slugs were mangled (`café` → `caf`). ASCII slugs are byte-identical; sites with non-ASCII CMS slugs get readable routes where the id fallback previously applied — set up redirects if those fallback URLs were shared.
