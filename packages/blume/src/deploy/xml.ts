import { escape } from "html-escaper";

/**
 * Escape a string for safe inclusion in XML text or attribute content.
 * html-escaper's five-entity table is XML-safe: `'` becomes the numeric
 * `&#39;` reference rather than `&apos;`, which XML accepts equally.
 */
export const escapeXml = (value: string): string => escape(value);
