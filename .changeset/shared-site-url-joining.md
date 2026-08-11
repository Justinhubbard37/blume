---
"blume": patch
---

Join `deployment.site` with emitted paths through one shared helper built on `ufo`'s `joinURL`. Eight emitters (sitemap, RSS, robots, llms.txt, the MCP server and discovery documents, the API catalog, agent-readability) had drifted across three different trailing-slash treatments; they now agree, and a site configured with extra trailing slashes can no longer produce double-slash URLs.
