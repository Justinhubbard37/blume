---
"blume": patch
---

Derive changelog meta descriptions by parsing release notes as GitHub-flavored markdown (mdast) instead of chaining strip regexes. The regex chain mis-handled real release-note shapes: tilde fences and fences of more than three backticks leaked their code into the description, an image followed by a link containing `)` truncated wrong, and prose like `a * b` or `x > y` lost characters to a blanket punctuation strip. The parsed tree drops headings, code, and raw HTML; keeps link text and inline-code content; and the word-boundary truncation is unchanged.
