---
"blume": patch
---

Declare `p-retry` and `nanotar` as dependencies. Both were imported by `openapi/parse.ts` and `ai/tar.ts` but only declared in the monorepo root, so installs of the published package could fail to resolve them.
