---
"blume": patch
---

Remove single-call delegation wrappers left over from the library migrations: the remote source's glob-matcher factory, the search dialog's `escapeHtml`, the XML escaper module, the directive label's text collector, and the env-file `parseEnv` export now call picomatch, html-escaper, mdast-util-to-string, and dotenv directly. Wrappers that carry real behavior (the atomic-write helper's mkdir/fsync policy, the audit image sizer's null-on-unknown contract, the OpenAPI sampler's error guard) are unchanged. If you deep-imported the undocumented `escapeHtml` from `blume/components/layout/search/types`, import `escape` from html-escaper instead.
