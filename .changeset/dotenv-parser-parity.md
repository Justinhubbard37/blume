---
"blume": patch
---

Parse `.env` files with dotenv — the same parser Vite applies to these files at build time. The previous line-based parser silently truncated multi-line double-quoted values at the first newline, corrupting PEM-style credentials (`-----BEGIN PRIVATE KEY-----` blocks) before the content scan could use them, and its escape handling diverged from what the rest of the toolchain sees in the same file. The `.env.local`/`.env` cascade from the working directory up to the repository root is unchanged, and shell/CI values still win.
