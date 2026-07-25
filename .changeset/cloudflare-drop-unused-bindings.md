---
"blume": patch
---

Stop Cloudflare server builds from declaring unused `SESSION` KV and `IMAGES` bindings in the generated wrangler config. Without a configured session driver, `@astrojs/cloudflare` force-enables KV-backed sessions — making `wrangler deploy` demand a real KV namespace nothing reads — and defaults images to the runtime Cloudflare Images binding. Blume never reads `Astro.session` and every HTML route prerenders, so the generated Astro config now sets an inert in-memory session driver and `imageService: "compile"`, which pre-optimizes images at build time with sharp.
