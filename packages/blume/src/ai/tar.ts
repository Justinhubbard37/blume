import { gzipSync } from "node:zlib";

/**
 * Minimal, dependency-free `.tar.gz` writer for agent-skill archives (POSIX
 * ustar). Deterministic by construction — fixed mtime/uid/gid, caller-ordered
 * entries, and Node's gzip header carries no timestamp — so a skill's archive
 * digest only changes when its content does.
 */

/** One regular file to archive. Paths are `/`-separated, relative, no `..`. */
export interface TarEntry {
  /** Raw file bytes. */
  content: Uint8Array;
  /** Preserve the owner-execute bit (e.g. a skill's scripts). */
  executable?: boolean;
  /** Archive-relative path, e.g. `SKILL.md` or `references/FORMS.md`. */
  path: string;
}

const BLOCK = 512;
/** ustar `name` field capacity; skill layouts are shallow, so no `prefix`. */
const NAME_MAX = 100;

const encoder = new TextEncoder();

/** Write an octal field: zero-padded digits followed by a NUL terminator. */
const octal = (
  header: Uint8Array,
  offset: number,
  length: number,
  value: number
): void => {
  const text = value.toString(8).padStart(length - 1, "0");
  header.set(encoder.encode(text), offset);
  header[offset + length - 1] = 0;
};

const text = (header: Uint8Array, offset: number, value: string): void => {
  header.set(encoder.encode(value), offset);
};

const fileHeader = (entry: TarEntry): Uint8Array => {
  const header = new Uint8Array(BLOCK);
  text(header, 0, entry.path);
  octal(header, 100, 8, entry.executable ? 0o755 : 0o644);
  // uid and gid: root-owned, fixed for determinism.
  octal(header, 108, 8, 0);
  octal(header, 116, 8, 0);
  octal(header, 124, 12, entry.content.byteLength);
  // mtime: fixed at the epoch for determinism.
  octal(header, 136, 12, 0);
  // typeflag "0": regular file.
  text(header, 156, "0");
  text(header, 257, "ustar");
  header[262] = 0;
  text(header, 263, "00");
  // devmajor and devminor.
  octal(header, 329, 8, 0);
  octal(header, 337, 8, 0);
  // Checksum: computed with the checksum field treated as eight spaces, then
  // written as six octal digits, NUL, space (the historical ustar format).
  header.fill(0x20, 148, 156);
  let sum = 0;
  for (const byte of header) {
    sum += byte;
  }
  text(header, 148, sum.toString(8).padStart(6, "0"));
  header[154] = 0;
  header[155] = 0x20;
  return header;
};

/**
 * Build a gzipped ustar archive of the given files, in the given order. Paths
 * longer than the ustar `name` field or escaping the archive root are the
 * caller's responsibility to filter — this throws to surface a programming
 * error rather than emitting a corrupt archive.
 */
export const buildTarGz = (entries: readonly TarEntry[]): Uint8Array => {
  const blocks: Uint8Array[] = [];
  for (const entry of entries) {
    if (encoder.encode(entry.path).byteLength > NAME_MAX) {
      throw new Error(`tar path exceeds ${NAME_MAX} bytes: ${entry.path}`);
    }
    if (entry.path.startsWith("/") || entry.path.split("/").includes("..")) {
      throw new Error(`tar path must be archive-relative: ${entry.path}`);
    }
    blocks.push(fileHeader(entry), entry.content);
    const overhang = entry.content.byteLength % BLOCK;
    if (overhang > 0) {
      blocks.push(new Uint8Array(BLOCK - overhang));
    }
  }
  // End-of-archive marker: two zero blocks.
  blocks.push(new Uint8Array(BLOCK * 2));
  const total = blocks.reduce((sum, block) => sum + block.byteLength, 0);
  const tar = new Uint8Array(total);
  let offset = 0;
  for (const block of blocks) {
    tar.set(block, offset);
    offset += block.byteLength;
  }
  return new Uint8Array(gzipSync(tar, { level: 9 }));
};
