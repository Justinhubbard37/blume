---
"blume": patch
---

Extract search-index plain text by parsing Markdown (GFM included) and walking the tree instead of regex-stripping the source. Reference-style links, autolinks, setext headings, and table cells now index their text; literal `*`/`~`/`>` in prose are no longer blanked; and the inner prose of block-level JSX components stays indexed. Applies to the client index and every hosted-provider sync, so rankings may shift slightly on re-index.
