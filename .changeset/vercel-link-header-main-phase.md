---
"blume": patch
---

Fix the homepage `Link` header and `Vary: Accept` never being sent on Vercel deploys. The injected header routes sat after `handle: "filesystem"` in the Build Output config — the miss phase, which prerendered static responses never reach — so agent-readiness checkers saw no `Link` header on `GET /`. Both header routes now ride in the main phase, ahead of static-file matching.
