---
"blume": patch
---

The default display font is now Inter, matching the body font — default sites download one text family instead of two (Inter Tight's files alone were ~190 KB per page). To keep the tightened display look, headings now get `letter-spacing: -0.025em` from the theme itself, which also means any font you configure for `display` reads correctly at heading sizes instead of depending on tracking built into the font. Inter Tight remains available as the `inter-tight` slug.
