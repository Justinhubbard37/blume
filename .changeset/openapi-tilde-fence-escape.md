---
"blume": patch
---

Leave tilde-fenced code blocks in OpenAPI spec descriptions verbatim when escaping MDX-special characters, matching how backtick fences are already handled. Braces inside a `~~~` fence no longer ship as literal `&#123;` entities on rendered reference pages.
