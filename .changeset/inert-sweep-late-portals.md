---
"blume": patch
---

Keep the Ask AI overlay's inert sweep current while it is open. The sweep snapshotted `<body>`'s children at open time, so anything portaled in afterwards (an image-zoom backdrop, a mermaid render, another island) stayed tabbable behind the overlay; a MutationObserver now folds late arrivals into the sweep.
