---
"blume": patch
---

Serve configured `redirects` from the generated Cloudflare Worker itself instead of carving them out of `assets.run_worker_first`. The wrapper Worker now bakes in a redirect table and answers any redirect a worker-first rule claims with its exact configured status, before delegating to the Astro Worker; redirects outside every worker-first rule still never invoke the Worker and are served by the static layer from `_redirects`, as before.

Unlike the negative-rule exemptions this replaces, a baked-in table costs nothing against Wrangler's caps of 100 rules and 100 characters — so a large or deeply nested redirect set can no longer push the rule set into the coarse fallback or cost the site its `Accept: text/markdown` negotiation, and redirects claimed by your own `run_worker_first` rules (including a bare `true`) are answered correctly without rewriting your configuration. A redirect at a content route's own path is still never honored — the page owns it — and non-ASCII destinations are percent-encoded into the `Location` header.
