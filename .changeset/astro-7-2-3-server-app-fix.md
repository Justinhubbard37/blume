---
"blume": patch
---

Require Astro 7.2.3+, which renames the dev SSR entry to `virtual:astro:server-app` so full reloads no longer re-request it with a spurious `.js` suffix — and drop the `serverAppResolvePlugin` shim that worked around the old id corrupting the dev server on content renames.
