---
"blume": patch
---

Consolidate the six hand-rolled clipboard + "Copied" flashes (code blocks, page actions, color swatches, prompts, API panels, Ask AI) into one shared helper. Every copy affordance now announces success to a screen-reader live region (previously only code blocks did), never confirms a failed write, and holds its confirmation through rapid repeat clicks instead of reverting early.
