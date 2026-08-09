---
"blume": patch
---

Parse the project's tsconfig with get-tsconfig when deriving `@/`-style Vite aliases. The hand-rolled JSONC parser could corrupt a config whose string values contained `", }"` (its trailing-comma strip ran over string contents), and its `extends` resolution accepted two forms real tsc rejects (relative paths naming a directory, bare specifiers resolved through a package `main`). get-tsconfig follows tsc's own semantics — JSONC, the full `extends` chain including TS 5.0 arrays, inherited-path rebasing, and `${configDir}` substitution, which now works in alias targets.
