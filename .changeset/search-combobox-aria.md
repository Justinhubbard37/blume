---
"blume": patch
---

Give the search dialog proper combobox semantics: the input announces as `role="combobox"` with `aria-expanded`/`aria-controls`/`aria-autocomplete`, results render in a labeled `role="listbox"` with grouped `role="option"` rows, and the highlighted result is surfaced through `aria-activedescendant` and `aria-selected`. Screen readers previously heard nothing while arrowing through results.
