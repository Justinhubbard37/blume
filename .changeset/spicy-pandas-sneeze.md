---
"blume": patch
---

Harden two code-scanning findings: the WebMCP search tool now strips search-hit markup so no `<` fragment (such as a dangling `<script`) can survive mangled highlighting, and the API catalog trims the configured site origin with the linear `trimEnd` helper instead of a quadratic trailing-slash regex.
