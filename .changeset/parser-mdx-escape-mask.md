---
"blume": patch
---

Locate code regions in OpenAPI descriptions with a CommonMark parse instead of fence-emulating regexes when escaping MDX-special characters. The parser is the authority on backtick pairing, tilde closers, unclosed fences, and fences nested in blockquotes (which the regexes mis-handled by escaping entities into the quoted code). Indented blocks keep escaping as prose — MDX has no indented code form.
