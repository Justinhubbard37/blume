---
"blume": patch
---

Match remote source `include` globs with picomatch — the same engine the filesystem source already uses through tinyglobby. The remote MDX source previously compiled globs with a minimal hand-rolled translator, so the same `include` array meant different things depending on source type: negation patterns (`!drafts/**`), character classes (`[0-9]`), nested braces, and extglobs silently failed to match on remote sources. The matcher is now also compiled once per enumeration instead of once per file × pattern, which matters on large GitHub trees.
