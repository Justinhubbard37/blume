---
"blume": minor
---

Custom fonts: `theme.fonts` roles now accept any Google/Fontsource/Bunny/Fontshare family by name (`{ name, provider?, weights?, fallback? }`) and local font files (`{ name, variants: [{ src, weight?, style? }] }`) alongside the curated slugs — all self-hosted and optimized through Astro's Fonts API. `seo.og.fonts` gains a matching local form (`{ name, src, weight?, style? }`), and when a config sets `theme.fonts` explicitly, the generated Open Graph cards now render in the theme's display and body fonts automatically (explicit `og.fonts` still wins; `og.fonts: []` opts out). Sites that never touched `theme.fonts` are unaffected.
