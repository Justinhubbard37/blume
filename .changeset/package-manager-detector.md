---
"blume": patch
---

Render `package-install` command tabs through `package-manager-detector` (the engine behind `ni`), with the yarn tab pinned to Berry. Previously the yarn tab mixed Berry-only commands (`yarn dlx`, `--immutable`) with Classic-only ones (`yarn global add`), so no single yarn version could run every rendered command; global installs on the yarn tab now render npm's form, since Berry removed `yarn global`. `blume eject` also detects the project's package manager from its lockfile instead of only the invoking user agent, which was absent (silently defaulting to npm) whenever the CLI was run directly.
