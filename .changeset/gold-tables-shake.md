---
"blume": minor
---

Publish Agent Skills for discovery from `ai.skills`. Point the new config field at a directory of skills (each subdirectory holding a `SKILL.md`) and the build publishes them per the Agent Skills Discovery RFC v0.2.0: single-file skills verbatim at `/.well-known/agent-skills/<name>/SKILL.md`, skills with supporting resources as deterministic `.tar.gz` archives (execute bits preserved), and a discovery index at `/.well-known/agent-skills/index.json` with the v0.2.0 `$schema` and per-skill SHA-256 digests. Artifacts get explicit media types on static hosts, the index is advertised in `agent-readability.json`, and spec-invalid skills are skipped with a build warning.
