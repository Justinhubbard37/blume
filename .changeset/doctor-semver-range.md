---
"blume": patch
---

Check the Node version in `blume doctor` against the package's full `engines.node` range with semver. The previous check stripped the range down to a bare version triple and compared segments numerically, so any real range expression (`^22.12.0 || >=24`, prerelease tags) degraded into comparisons against `NaN` and the check silently stopped working.
