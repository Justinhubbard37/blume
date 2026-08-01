---
"blume": minor
---

Check DNS-AID agent discovery in `blume audit`. When `deployment.site` is set, the network tier (`--url`) queries `_index._agents.<host>` for ServiceMode SVCB/HTTPS records over DNS-over-HTTPS and reports the exact record to publish when none exist, plus whether the answers are DNSSEC-authenticated. Set `BLUME_DOH_URL` to use your own resolver.
