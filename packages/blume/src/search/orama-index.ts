import { create, insertMultiple, search } from "@orama/orama";
import type { AnyOrama, Tokenizer } from "@orama/orama";

/**
 * The minimal document shape both the client-side search dialog and the
 * server-side MCP `search_docs` tool index. Mirrors the `blume-search.json`
 * entries built by `buildSearchDocuments`.
 */
export interface OramaDoc {
  content: string;
  description: string;
  route: string;
  title: string;
  /** Locale code; indexed as an enum so queries can filter to one language. */
  locale?: string;
  /** Carried through for the search dialog's breadcrumb + filter pills. Stored
   * but not indexed, so they ride along on the returned document untouched. */
  breadcrumb?: string[];
  section?: string;
}

const SCHEMA = {
  content: "string",
  description: "string",
  // Enum (not full-text "string") so `where` does an exact-match filter.
  locale: "enum",
  route: "string",
  title: "string",
} as const;

/** Title and description outrank body text, matching the search dialog. */
const BOOST = { description: 2, title: 3 };

/**
 * Scripts written without spaces between words. Orama's default tokenizer
 * splits on a Latin-centric delimiter class, so text in these languages
 * collapses to zero tokens and every query silently returns no hits. Keyed by
 * the primary language subtag of `i18n.defaultLocale`.
 */
const SEGMENTED_LANGUAGES = new Set(["ja", "ko", "th", "zh"]);

/**
 * A word-segmenting tokenizer for languages the default splitter can't handle,
 * built on `Intl.Segmenter` (the same engine `@orama/tokenizers` wraps).
 * Input is lowercased before segmenting — unlike the upstream tokenizers —
 * so Latin terms ("GDPR", English pages on a mixed-locale site) still match
 * case-insensitively. Returns `undefined` for languages the default tokenizer
 * already serves, and on runtimes without `Intl.Segmenter`, where the caller
 * falls back to Orama's default.
 */
const segmentingTokenizer = (locale?: string): Tokenizer | undefined => {
  const language = locale?.toLowerCase().split(/[-_]/u)[0] ?? "";
  if (!SEGMENTED_LANGUAGES.has(language)) {
    return;
  }
  if (typeof Intl.Segmenter !== "function") {
    return;
  }
  const segmenter = new Intl.Segmenter(language, { granularity: "word" });
  return {
    language,
    normalizationCache: new Map(),
    tokenize: (raw: string): string[] => {
      const tokens = new Set<string>();
      for (const segment of segmenter.segment(raw.toLowerCase())) {
        if (segment.isWordLike) {
          tokens.add(segment.segment);
        }
      }
      return [...tokens];
    },
  };
};

/**
 * Build an in-memory Orama full-text index from search documents. Shared by the
 * Orama client loader (browser), the MCP server, and Ask AI grounding (Node),
 * so ranking is identical wherever docs are queried. `locale` — the site's
 * `i18n.defaultLocale` — swaps in a word-segmenting tokenizer for languages
 * written without spaces (Japanese, Chinese, Korean, Thai); the tokenizer
 * belongs to the database, so on a mixed-locale site it applies to every
 * document, which is safe because Latin words survive segmentation intact.
 */
export const buildOramaIndex = async (
  documents: OramaDoc[],
  locale?: string
): Promise<AnyOrama> => {
  const tokenizer = segmentingTokenizer(locale);
  const db = create({
    schema: SCHEMA,
    ...(tokenizer ? { components: { tokenizer } } : {}),
  });
  await insertMultiple(db, documents);
  return db;
};

/**
 * Query the index, returning the matching documents (highest-ranked first).
 * When `locale` is given, results are filtered to that language via an exact
 * `where` match on the `locale` enum.
 */
export const queryOramaIndex = async (
  db: AnyOrama,
  term: string,
  limit: number,
  locale?: string
): Promise<OramaDoc[]> => {
  const found = await search(db, {
    boost: BOOST,
    limit,
    properties: ["title", "description", "content"],
    term,
    ...(locale ? { where: { locale: { eq: locale } } } : {}),
  });
  return found.hits.map((hit) => hit.document as unknown as OramaDoc);
};
