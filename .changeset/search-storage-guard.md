---
"blume": patch
---

Guard the search dialog's localStorage reads and writes so blocked storage (Safari "Block All Cookies", sandboxed webviews) degrades to session-default preferences instead of throwing during setup and leaving search unable to open.
