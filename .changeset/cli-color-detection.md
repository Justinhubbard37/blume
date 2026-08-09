---
"blume": patch
---

Respect `NO_COLOR`, `FORCE_COLOR`, and terminal detection in all CLI output. Diagnostics, the audit/eval/translate reports, and internal error reports previously emitted raw ANSI escape codes unconditionally, so piping a command to a file (`blume validate > report.txt`) or reading CI logs outside a color-capable terminal showed literal `[31m` sequences. All five hand-rolled palettes now go through consola's color utilities, which disable styling when the output is not a color-capable terminal and honor the standard `NO_COLOR`/`FORCE_COLOR` overrides.
