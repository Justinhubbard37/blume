---
"blume": patch
---

Make atomic file writes safe under concurrency. The translation runner, its ledger, and the runtime generator each wrote through a temp file named `<path>.<pid>.tmp` — a name that is not unique within a process, so two concurrent writers to the same target (translate lanes run up to 16-wide; staged content writes fan out in parallel) could interleave through a shared temp file. All three now write through npm's write-file-atomic, whose temp names are unique per call and which preserves file modes on overwrite.
