---
"blume": patch
---

Hand the CLI's `.env`/`.env.local` cascade to `dotenv.config({ path })` instead of a hand-rolled apply loop. The walk up to the repo root stays; the first-wins ordering, never-clobber-`process.env` semantics, and best-effort file handling now come from dotenv itself.
