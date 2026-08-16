---
"blume": patch
---

Tighten types across the package: `unknown`-typed parameters, returns, and open dictionaries are replaced with precise named types, and every remaining type assertion carries a documented invariant (adopting ultracite's anti-slop lint preset).
