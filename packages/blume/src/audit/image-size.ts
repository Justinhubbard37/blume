import { imageSize as measureImage } from "image-size";

/**
 * Pixel dimensions read from an image header via the image-size package,
 * which covers the formats a modern pipeline actually emits — WebP and AVIF
 * included, where the previous hand parser (PNG/JPEG/GIF only) went silent
 * and the dimension checks never ran. An unrecognized or truncated buffer
 * yields null and its checks simply don't run.
 */
export interface ImageSize {
  width: number;
  height: number;
}

/** The image's pixel dimensions, or null when the format isn't recognized. */
export const imageSize = (bytes: Buffer): ImageSize | null => {
  try {
    const { width, height } = measureImage(bytes);
    return width > 0 && height > 0 ? { height, width } : null;
  } catch {
    return null;
  }
};
