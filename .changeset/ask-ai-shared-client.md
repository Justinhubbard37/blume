---
"blume": patch
---

The built-in Ask AI panel now streams through the public `useAskAI` hook instead of carrying its own near-identical copy of the client — one implementation now owns request shaping, the optimistic assistant bubble, stale-stream and abort guards, and the error-body-is-not-an-answer rule. `useAskAI` gains an optional `errorMessage` option so custom UIs (and the built-in panel, which passes its localized dictionary string) can control the failure notice shown in the transcript.
