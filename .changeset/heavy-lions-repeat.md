---
"blume": patch
---

Keep `blume dev` from tearing down React islands built from project components. The generated runtime is the Vite root, so user pages, islands, and alias-reachable components were invisible to the dep optimizer's startup scan — and the Babel-injected `react/compiler-runtime` import can never be scanned — so their dependencies were only discovered mid-session. That re-optimization served a second React copy to islands hydrating at that moment, crashing them with "Invalid hook call". The generated config now points the optimizer's startup scan at user pages, the `islands/` directory, and tsconfig-alias directories, and force-includes the compiler runtime, so every dependency hydration can reach is part of the first optimization run.
