---
"blume": minor
---

Add `blume eval`, a test suite for your docs. An AI agent — Claude Code by default, Codex with `--agent codex`, spawned from your own installation with no API keys held by Blume — answers the questions in `evals.yaml` using ONLY the documentation, served over a private MCP stdio bridge to an agent locked out of its file, shell, and web tools; a judge pass then grades each answer against the expected facts you listed. Any question the docs can't answer fails CI (relax with `--threshold`), each failure is anchored to the source page that should answer it, `--json` emits the validate/audit-compatible machine report, `--fix` hands the failing report to the agent to edit the docs interactively, and `blume eval init` drafts a starter evals file from your existing docs. No build or deployment is needed — the docs snapshot is computed from the content tree.
