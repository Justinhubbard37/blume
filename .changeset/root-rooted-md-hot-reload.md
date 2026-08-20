---
"blume": patch
---

Restore live Markdown hot reload in migrated `.`-rooted projects. Astro's content watcher now honors the docs collection's negated globs, so the generated dev config no longer hides Astro's cache dir from the watcher — the escape hatch that previously cost `.md` body edits a dev-server restart in that layout.
