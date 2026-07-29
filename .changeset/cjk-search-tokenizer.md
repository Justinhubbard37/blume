---
"blume": patch
---

Match CJK and Thai content in the default Orama search provider. With `i18n.defaultLocale` set to a language written without spaces (Japanese, Chinese, Korean, Thai), the search index now uses a word-segmenting tokenizer built on `Intl.Segmenter` — previously every query in those scripts silently returned zero results because the default tokenizer collapsed the text to no tokens. The fix covers the search dialog, the MCP server's `search_docs` tool, and Ask AI grounding, and keeps Latin terms matching case-insensitively on mixed-language sites.
