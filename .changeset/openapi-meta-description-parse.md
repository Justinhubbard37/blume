---
"blume": patch
---

Flatten OpenAPI descriptions into meta descriptions with a real markdown parse (`mdast-util-to-string`) instead of regex stripping. Literal punctuation in spec prose survives — `snake_case` no longer becomes `snakecase`, `C#` no longer becomes `C` — in the `seo.description` tags of generated reference pages.
