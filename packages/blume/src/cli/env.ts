import { existsSync, readFileSync } from "node:fs";

import { parse } from "dotenv";
import { dirname, join, resolve } from "pathe";

// Blume's remote sources (GitHub Releases, mdx-remote, Sanity, Notion…) read
// their tokens from `process.env` during the content scan — which runs before
// Astro/Vite boots, so Vite's own `.env` loading is too late. This loader fills
// that gap: it cascades `.env`/`.env.local` from the working dir up to the repo
// root, so a monorepo can keep one `.env` at the root and every app picks it up.

/** Apply parsed vars without clobbering anything already in `process.env`. */
const applyEnv = (parsed: Record<string, string>): void => {
  for (const [key, value] of Object.entries(parsed)) {
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

const loadFile = (path: string): void => {
  try {
    if (existsSync(path)) {
      // dotenv is the same parser Vite runs over these files at build time,
      // so a value means the same thing to the pre-boot content scan and the
      // built site — including multi-line double-quoted values (PEM keys),
      // which a line-based parser silently truncates.
      applyEnv(parse(readFileSync(path, "utf-8")));
    }
  } catch {
    // Env files are best-effort; a read/parse failure must not abort a build.
  }
};

/**
 * Load `.env`/`.env.local`, cascading from `startDir` up to the repository root
 * (the first ancestor containing a `.git`) or the filesystem root. Nearer files
 * and existing `process.env` values win, so shell/CI overrides are never lost
 * and `.env.local` layers over `.env`.
 */
export const loadEnvFiles = (startDir: string): void => {
  let dir = resolve(startDir);
  let done = false;
  while (!done) {
    loadFile(join(dir, ".env.local"));
    loadFile(join(dir, ".env"));
    const parent = dirname(dir);
    // Stop at the repo root (nearest `.git`) or the filesystem root.
    done = existsSync(join(dir, ".git")) || parent === dir;
    dir = parent;
  }
};
