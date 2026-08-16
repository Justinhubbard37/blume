---
"blume": patch
---

Stop doubling the site title in the changelog index's document title. The page passed "{site title} {Changelog}" to a layout that suffixes "- {site title}" itself, producing titles like "Acme Changelog - Acme"; it now reads "Changelog - Acme".
