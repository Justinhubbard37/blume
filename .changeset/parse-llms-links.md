---
"blume": patch
---

Parse `llms.txt` link targets with a real Markdown parse instead of a `](url)` regex in the audit crawler. Reference-style links and angle-bracket destinations now resolve, link titles no longer leak into URLs, and link-shaped strings inside fenced code blocks are no longer probed as claims.
