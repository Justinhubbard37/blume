---
"blume": patch
---

Replace the hand-rolled image lightbox with medium-zoom. The `markdown.imageZoom` behavior is unchanged — click to zoom, dismiss on click/scroll/Escape, opt out per image with `data-no-zoom`, images inside links stay plain — but the FLIP transform math, natural-size capping, and transition-teardown races now belong to a 2 kB library built for exactly this. The library is lazy-loaded only on pages that contain a zoomable image, and reduced-motion preferences disable the transitions as before.
