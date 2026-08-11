---
"blume": patch
---

Deduplicate the `escapeRawHtml`/`unwrapParagraph` helpers that were copied verbatim into `<Prompt>`, `<Frame>`, and `<Tooltip>` into one shared module. No behavior change.
