---
"blume": patch
---

Escape Markdown syntax in Portable Text prose spans. Span text is plain text by the Portable Text contract, but a literal `*`, `_`, `[`, backtick, `~`, or `<` typed in Sanity was interpreted as Markdown or raw HTML in the rendered page; those characters now render as themselves. Code-marked spans stay verbatim.
