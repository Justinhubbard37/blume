---
"blume": patch
---

Parse sitemaps in the audit with fast-xml-parser instead of regex scanning. Sitemaps the audit reads can come from other generators (including remote ones during network audits), and three legal constructs were invisible to the regex scan: CDATA-wrapped `<loc>` values, numeric character references like `&#38;`, and namespace-prefixed elements (`<sm:loc>`). All three now parse; the shallow contract — the loc list, per-loc lastmod, and urlset-vs-index detection — is unchanged.
