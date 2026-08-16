---
"blume": patch
---

Redirect trailing-slash URLs to their slashless twins on Vercel with a 308. `/docs/` and `/docs` previously both served 200 as duplicate URLs; the routing config now collapses the slashed form onto the canonical slashless one (the root `/` is untouched).
