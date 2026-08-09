---
"blume": patch
---

Fix two false-positive sources in the audit's robots.txt check by matching rules with robots-parser. The hand-rolled matcher never read `Allow:` directives, so the common lockdown pattern (`Disallow: /` plus `Allow: /docs/`) flagged every sitemap URL as blocked; and it treated each `User-agent:` line independently, so consecutive agent lines heading one rule group (as the spec defines) dropped rules that do apply to `*`. robots-parser resolves Allow/Disallow by longest match and handles agent groups correctly; wildcard and `$`-anchor behavior is unchanged.
