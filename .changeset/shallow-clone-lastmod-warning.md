---
"blume": patch
---

Warn when `lastModified` runs in a shallow git clone. CI platforms usually check out limited history, which silently dropped most git-derived dates — sitemap `<lastmod>` and "Last updated" stamps vanished in production while working locally. The build now emits a `BLUME_SHALLOW_GIT_HISTORY` warning pointing at the fix (`VERCEL_DEEP_CLONE=true` on Vercel, `fetch-depth: 0` for actions/checkout).
