import { describe, expect, it } from "bun:test";

import type { ResolvedConfig } from "../src/core/schema.ts";
import { buildNetlifyHeaders } from "../src/deploy/headers.ts";

const configWith = (
  overrides: Partial<{
    base?: string;
    basePath: string;
    webBotAuthKeys: Record<string, unknown>[];
  }>
): ResolvedConfig =>
  ({
    ai: { webBotAuth: { keys: overrides.webBotAuthKeys ?? [] } },
    basePath: overrides.basePath ?? "",
    deployment: { base: overrides.base },
  }) as ResolvedConfig;

describe("buildNetlifyHeaders", () => {
  it("pins a UTF-8 Content-Type onto each raw endpoint extension", () => {
    expect(buildNetlifyHeaders(configWith({}))).toBe(
      [
        "/*.md",
        "  Content-Type: text/markdown; charset=utf-8",
        "/*.mdx",
        "  Content-Type: text/markdown; charset=utf-8",
        "/*.txt",
        "  Content-Type: text/plain; charset=utf-8",
        "",
      ].join("\n")
    );
  });

  it("prefixes globs with the composed deployment.base + basePath stack", () => {
    const out = buildNetlifyHeaders(
      configWith({ base: "/base", basePath: "/docs" })
    );
    expect(out).toContain("/base/docs/*.md");
    expect(out).toContain("/base/docs/*.mdx");
    // llms.txt / llms-full.txt live at the dist root, not under basePath.
    expect(out).toContain("/base/*.txt");
    expect(out).not.toContain("/base/docs/*.txt");
  });

  it("normalizes a trailing slash on deployment.base", () => {
    expect(buildNetlifyHeaders(configWith({ base: "/docs/" }))).toContain(
      "/docs/*.md"
    );
  });

  it("keeps the .txt rule at the root when only basePath is set", () => {
    const out = buildNetlifyHeaders(configWith({ basePath: "/docs" }));
    expect(out).toContain("/docs/*.md");
    expect(out).toContain("/*.txt");
    expect(out).not.toContain("/docs/*.txt");
  });

  it("appends a homepage Link rule when a link header is provided", () => {
    const link = '</llms.txt>; rel="describedby"; type="text/plain"';
    expect(buildNetlifyHeaders(configWith({}), link)).toEndWith(
      `/\n  Link: ${link}\n`
    );
    // The homepage rule sits at the deployment base, not under basePath.
    const based = buildNetlifyHeaders(
      configWith({ base: "/base", basePath: "/docs" }),
      link
    );
    expect(based).toContain(`/base/\n  Link: ${link}`);
  });

  it("emits no Link rule without a link header", () => {
    expect(buildNetlifyHeaders(configWith({}))).not.toContain("Link:");
    expect(buildNetlifyHeaders(configWith({}), null)).not.toContain("Link:");
  });

  it("pins the Web Bot Auth directory media type when keys are configured", () => {
    const out = buildNetlifyHeaders(
      configWith({ base: "/base", webBotAuthKeys: [{ kty: "OKP" }] })
    );
    expect(out).toContain(
      "/base/.well-known/http-message-signatures-directory\n  Content-Type: application/http-message-signatures-directory+json"
    );
    expect(buildNetlifyHeaders(configWith({}))).not.toContain(
      "http-message-signatures-directory"
    );
  });
});
