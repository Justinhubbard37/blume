---
"blume": patch
---

Drop empty table header rows. GFM requires a header row, so a table that doesn't want one is authored with blank header cells (`| | |`) — that used to render as a dead band above the body; the empty `<thead>` is now removed. A header cell containing any non-text content (an image, an icon) still counts as non-empty.
