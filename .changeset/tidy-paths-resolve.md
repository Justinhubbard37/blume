---
"blume": patch
---

Resolve the bundled docs path from the installed `blume` package instead of a bare `node_modules/blume/docs`. The `blume` and `blume-migrate` skills now tell agents to locate the package from the workspace that depends on it (via `require.resolve('blume/package.json')`), so the docs lookup works in pnpm workspace monorepos where the package is not installed at the repository root.
