---
"blume": patch
---

Escape HTML through one complete entity table. Four call sites each hand-rolled their own escape map with different coverage: the search popular-links icon markup escaped only `&` and `"` while building an `src` attribute, the fallback code-block renderer escaped only `&`, `<`, and `>`, and the search dialog and XML feeds carried their own full tables. All four now use html-escaper's five-entity escape (the same one Astro uses internally), so every site covers `&`, `<`, `>`, `"`, and `'` consistently.
