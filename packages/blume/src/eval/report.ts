import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";

import { join, relative } from "pathe";

import { AGENTS } from "../audit/agent.ts";
import { countBySeverity } from "../core/diagnostics.ts";
import type { EvalResult, QuestionResult, QuestionStatus } from "./run.ts";

const ESC = String.fromCodePoint(27);
const COLORS = {
  bold: `${ESC}[1m`,
  cyan: `${ESC}[36m`,
  dim: `${ESC}[2m`,
  green: `${ESC}[32m`,
  red: `${ESC}[31m`,
  reset: `${ESC}[0m`,
  yellow: `${ESC}[33m`,
};

const GLYPH: Record<QuestionStatus, string> = {
  error: "!",
  fail: "✖",
  pass: "✔",
  skip: "⊘",
};

const STATUS_COLOR: Record<QuestionStatus, string> = {
  error: COLORS.yellow,
  fail: COLORS.red,
  pass: COLORS.green,
  skip: COLORS.dim,
};

/** Longest id gets the room; everything shorter aligns to it. */
const ID_PAD = 28;

const seconds = (ms: number): string => `${(ms / 1000).toFixed(1)}s`;

const money = (cost: number | undefined): string =>
  cost === undefined ? "" : `$${cost.toFixed(2)}`;

const duration = (ms: number): string => {
  if (ms < 60_000) {
    return seconds(ms);
  }
  const minutes = Math.floor(ms / 60_000);
  const rest = Math.round((ms % 60_000) / 1000);
  return `${minutes}m ${rest}s`;
};

/** One question's progress/report line: glyph, id, status, score, time, cost. */
export const questionLine = (result: QuestionResult): string => {
  const color = STATUS_COLOR[result.status];
  const glyph = `${color}${GLYPH[result.status]}${COLORS.reset}`;
  const id = result.id.padEnd(ID_PAD);
  if (result.status === "skip") {
    return `  ${glyph} ${id} ${COLORS.dim}skipped${COLORS.reset}`;
  }
  const score = result.score === undefined ? "" : result.score.toFixed(2);
  const cells = [
    `${color}${result.status}${COLORS.reset}`,
    score,
    `${COLORS.dim}${seconds(result.durationMs)}${COLORS.reset}`,
    `${COLORS.dim}${money(result.costUsd)}${COLORS.reset}`,
  ]
    .filter((cell) => cell !== "")
    .join("  ");
  return `  ${glyph} ${id} ${cells}`;
};

const detailLines = (result: QuestionResult, verbose: boolean): string[] => {
  const lines: string[] = [];
  if (result.status === "fail") {
    for (const fact of result.missing) {
      lines.push(`      ${COLORS.dim}missing: ${fact}${COLORS.reset}`);
    }
  }
  if (result.status === "error" && result.detail) {
    lines.push(`      ${COLORS.dim}${result.detail}${COLORS.reset}`);
  }
  if (verbose && result.answer && result.status !== "pass") {
    lines.push(
      ...result.answer
        .split("\n")
        .map((line) => `      ${COLORS.dim}> ${line}${COLORS.reset}`)
    );
  }
  return lines;
};

/** The one-line totals: `9 passed · 2 failed · 1 skipped · 1m 42s · $0.71`. */
export const summaryLine = (result: EvalResult): string => {
  const { counts } = result;
  const parts = [
    `${counts.pass} passed`,
    counts.fail > 0 ? `${counts.fail} failed` : "",
    counts.error > 0 ? `${counts.error} errored` : "",
    counts.skip > 0 ? `${counts.skip} skipped` : "",
    duration(result.durationMs),
    money(result.costUsd),
  ].filter((part) => part !== "");
  return parts.join(" · ");
};

/** The human report, written to stderr by the command. */
export const formatEvalReport = (
  result: EvalResult,
  root: string,
  options: { verbose?: boolean } = {}
): string => {
  const lines: string[] = [];
  const agent = AGENTS[result.agent];
  const total = result.results.length;
  lines.push(
    `${COLORS.bold}blume eval${COLORS.reset}  ${total} question(s) · ${agent.name}`,
    ""
  );

  for (const question of result.results) {
    lines.push(
      questionLine(question),
      ...detailLines(question, Boolean(options.verbose))
    );
  }
  lines.push("");

  // The finding tells the author which file fixes which failure.
  const failures = result.diagnostics.filter(
    (diagnostic) => diagnostic.code !== "BLUME_EVAL_ROUTE_UNKNOWN"
  );
  for (const finding of failures) {
    const site = finding.file
      ? `${relative(root, finding.file)}${finding.line ? `:${finding.line}` : ""}`
      : "";
    lines.push(
      `  ${COLORS.cyan}fix:${COLORS.reset} ${site} ${COLORS.dim}${finding.message}${COLORS.reset}`
    );
  }
  if (failures.length > 0) {
    lines.push("");
  }

  lines.push(`  ${summaryLine(result)}`, "");
  return lines.join("\n");
};

/**
 * The machine-readable report. The `diagnostics` + `summary` shape matches
 * `blume validate --json` and `blume audit --json` exactly — anything parsing
 * those keeps working — with the eval run's own results alongside.
 */
export const evalReportJson = (
  result: EvalResult,
  root: string,
  threshold: number
): string => {
  const diagnostics = result.diagnostics.map((diagnostic) =>
    diagnostic.file
      ? { ...diagnostic, file: relative(root, diagnostic.file) }
      : diagnostic
  );
  return `${JSON.stringify(
    {
      diagnostics,
      eval: {
        agent: result.agent,
        costUsd: result.costUsd,
        counts: result.counts,
        durationMs: result.durationMs,
        results: result.results,
        threshold,
      },
      summary: countBySeverity(result.diagnostics),
    },
    null,
    2
  )}\n`;
};

/**
 * Write the full JSON report where a `--fix` agent can read it — a file
 * rather than inline prompt text, because a long run's answers would exceed
 * the platform's argv limit.
 */
export const writeEvalReport = async (
  result: EvalResult,
  root: string,
  threshold: number
): Promise<string> => {
  const dir = await mkdtemp(join(tmpdir(), "blume-eval-"));
  const path = join(dir, "report.json");
  await writeFile(path, evalReportJson(result, root, threshold));
  return path;
};
