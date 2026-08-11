---
"blume": patch
---

Strip `:` and control characters from filename-derived route segments, so files like `Guide: Architecture.md` build instead of crashing route generation with "The URL must be of scheme file".
