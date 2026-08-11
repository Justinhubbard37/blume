---
"blume": patch
---

Spawn agent CLIs (claude/codex handoffs, eval and translate runners) through `cross-spawn` instead of `shell: true` on Windows. cmd.exe no longer parses the argument list — codex's `-c` flags carry JSON that shell quoting could mangle, and the interactive handoff no longer hand-builds a quoted command line — and a missing executable now rejects with `ENOENT` on every platform instead of surfacing as cmd.exe's exit code 9009.
