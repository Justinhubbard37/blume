---
"blume": patch
---

Preload only the font weights above-the-fold text actually renders in (body 400/500, display 500/600, mono 400) instead of every configured face. On a default site this cuts the per-page font preloads from ten files (~260 KB) to a handful (~50 KB), bandwidth that was competing with the critical CSS and pushing out mobile LCP. All other faces still load on demand through their `@font-face` rules with `font-display: swap`.
