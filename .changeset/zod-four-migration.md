---
"blume": patch
---

Move Blume's own `zod` dependency from v3 to v4 (`^4.3.6`), the major Astro 7, Scalar, and the MCP SDK already use, so an install resolves one Zod major instead of a v3 copy hoisted beside nested v4 copies. That mixed tree is what made partially updated `node_modules` (a restored CI cache that a dependency bump left half-reconciled) resolve Scalar's schemas against a Zod without `z.function().optional`, failing builds with `TypeError: z.function(...).optional is not a function`. Resolved configs and frontmatter parse exactly as before: shorthand defaults that Zod 4's `.default()` would return unparsed — collapsing blocks like `theme` or `seo` to a bare `{}` instead of their fully-defaulted shape — now use `.prefault()`, which keeps Zod 3's parse-the-default semantics. `frontmatter.extend` schemas still go through the Standard Schema contract, so any Zod version (or Valibot, or ArkType) works there unchanged.
