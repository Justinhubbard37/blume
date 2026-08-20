---
"blume": patch
---

Fix fully unstyled frames during client-router navigations. Astro hoists the CSS of components rendered after the head has streamed (a page's MDX content, for one) into the body as stylesheet links, and the client router neither preloads nor persists body stylesheets — so swapping in a page painted a frame or two with no CSS applied before its sheet loaded. The layouts now load an incoming page's body stylesheets into the head and wait for them before the swap, and keep the loaded copy across it.
