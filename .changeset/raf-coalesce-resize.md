---
"blume": patch
---

Coalesce the page-actions menu and `<Component>` preview-pane resize handlers to one layout pass per animation frame. Both previously re-read layout on every resize event, causing needless main-thread churn during a live resize drag.
