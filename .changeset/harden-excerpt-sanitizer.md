---
"blume": patch
---

Harden the search excerpt sanitizer: any `<` that does not begin a bare `<mark>` tag is now entity-escaped instead of passed through. A remote excerpt containing `<!--` could previously open an HTML comment inside the results list and swallow the rest of the excerpt, highlights included. Rendering of legitimate text is unchanged.
