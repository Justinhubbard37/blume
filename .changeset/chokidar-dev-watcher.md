---
"blume": patch
---

Watch project inputs in `blume dev` with chokidar. Raw `fs.watch` required two documented platform workarounds — watching single files through their parent directory so rename-replace saves (vim and most atomic-save editors) don't orphan the watcher, and `recursive` handling for directories. chokidar (the watcher Vite itself uses) owns both, and one watcher now covers the pages directory, config, theme, and component override files.
