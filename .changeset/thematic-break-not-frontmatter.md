---
"blume": patch
---

Treat a document-leading `---` followed by a blank line, or one with no closing fence, as a thematic break instead of front matter, so bodies that open with a divider (e.g. a Notion page whose first block is one) build instead of crashing with a YAML parse error.
