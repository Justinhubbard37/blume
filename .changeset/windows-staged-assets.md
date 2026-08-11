---
"blume": patch
---

Fix the `/blume-assets` endpoint's traversal guard on Windows: it compared a forward-slash directory against `path.resolve` output (backslashes there), which 404'd every staged remote-source asset. The guard now uses `path.relative`, which also closes the sibling-directory-name edge a bare prefix test admits.
