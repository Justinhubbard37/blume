import { describe, expect, it } from "bun:test";

import {
  ACCEPT_MARKDOWN_HEADER_VALUE,
  buildNegotiationRoutes,
  injectNegotiationRoutes,
} from "../src/deploy/vercel-negotiation.ts";

// The router's matching semantics aren't contractual — exercise the pattern
// both as a substring match and wrapped as a full-string match, since it must
// behave identically either way.
const partial = new RegExp(ACCEPT_MARKDOWN_HEADER_VALUE, "u");
const full = new RegExp(`^(?:${ACCEPT_MARKDOWN_HEADER_VALUE})$`, "u");

const matchesBoth = (accept: string): boolean => {
  const a = partial.test(accept);
  const b = full.test(accept);
  expect(a).toBe(b);
  return a;
};

describe("accept-header pattern", () => {
  it("matches Markdown accept headers under both matching semantics", () => {
    expect(matchesBoth("text/markdown")).toBe(true);
    expect(matchesBoth("text/x-markdown")).toBe(true);
    expect(matchesBoth("text/markdown;q=0.9")).toBe(true);
    expect(matchesBoth("text/markdown, */*")).toBe(true);
    expect(matchesBoth("text/html, text/markdown;q=0.9")).toBe(true);
    expect(matchesBoth("application/json,text/markdown")).toBe(true);
  });

  it("rejects browser and non-Markdown accept headers", () => {
    expect(matchesBoth("text/html")).toBe(false);
    expect(
      matchesBoth("text/html,application/xhtml+xml,application/xml;q=0.9,*/*")
    ).toBe(false);
    expect(matchesBoth("*/*")).toBe(false);
    expect(matchesBoth("application/json")).toBe(false);
    // A longer media type must not match on its `text/markdown` prefix.
    expect(matchesBoth("text/markdownx")).toBe(false);
  });
});

describe("buildNegotiationRoutes", () => {
  it("builds a conditional rewrite and a Vary route over the content routes", () => {
    const { headerRoutes, rewriteRoutes } = buildNegotiationRoutes([
      "/docs/a",
      "/docs/b",
    ]);
    expect(rewriteRoutes).toStrictEqual([
      {
        dest: "$1.md",
        has: [
          {
            key: "accept",
            type: "header",
            value: ACCEPT_MARKDOWN_HEADER_VALUE,
          },
        ],
        headers: { vary: "Accept" },
        src: "^(/docs/a|/docs/b)/?$",
      },
    ]);
    expect(headerRoutes).toStrictEqual([
      {
        continue: true,
        headers: { vary: "Accept" },
        src: "^(?:/docs/a|/docs/b)/?$",
      },
    ]);
  });

  it("rewrites a matched page URL to its .md mirror, trailing slash included", () => {
    const { rewriteRoutes } = buildNegotiationRoutes(["/docs/a", "/docs/b"]);
    const [route] = rewriteRoutes;
    const src = new RegExp(route?.src ?? "", "u");
    expect("/docs/b/".replace(src, route?.dest ?? "")).toBe("/docs/b.md");
    expect("/docs/a".replace(src, route?.dest ?? "")).toBe("/docs/a.md");
    expect(src.test("/docs/ab")).toBe(false);
    expect(src.test("/logo.png")).toBe(false);
  });

  it("maps the home page to /index.md via a dedicated route", () => {
    const { headerRoutes, rewriteRoutes } = buildNegotiationRoutes([
      "/",
      "/guide",
    ]);
    expect(rewriteRoutes[0]).toMatchObject({
      dest: "/index.md",
      src: "^/$",
    });
    expect(rewriteRoutes[1]?.src).toBe("^(/guide)/?$");
    // The Vary route covers the home page alongside the rest.
    const vary = new RegExp(headerRoutes[0]?.src ?? "", "u");
    expect(vary.test("/")).toBe(true);
    expect(vary.test("/guide")).toBe(true);
  });

  it("percent-encodes and regex-escapes route paths", () => {
    const { rewriteRoutes } = buildNegotiationRoutes([
      "/ja/はじめに",
      "/docs/c++ (v2)",
    ]);
    const src = rewriteRoutes[0]?.src ?? "";
    expect(src).toContain(encodeURI("/ja/はじめに"));
    expect(src).toContain("/docs/c\\+\\+%20\\(v2\\)");
    const pattern = new RegExp(src, "u");
    expect(pattern.test(encodeURI("/ja/はじめに"))).toBe(true);
    expect(pattern.test("/docs/cxx (v2)")).toBe(false);
  });

  it("splits large route sets across entries under the src length limit", () => {
    const routes = Array.from(
      { length: 300 },
      (_, index) => `/docs/section-${index}/some-fairly-long-page-slug-${index}`
    );
    const { headerRoutes, rewriteRoutes } = buildNegotiationRoutes(routes);
    expect(rewriteRoutes.length).toBeGreaterThan(1);
    for (const route of [...rewriteRoutes, ...headerRoutes]) {
      expect((route.src ?? "").length).toBeLessThan(4096);
    }
    // Every route is matched by exactly one rewrite entry.
    for (const path of routes) {
      const matches = rewriteRoutes.filter((route) =>
        new RegExp(route.src ?? "", "u").test(path)
      );
      expect(matches).toHaveLength(1);
    }
  });
});

const baseConfig = {
  routes: [
    { handle: "filesystem" },
    {
      continue: true,
      headers: { "cache-control": "public, max-age=31536000, immutable" },
      src: "^/_astro/(.*)$",
    },
    { dest: "_render", src: "^/api/ask/?$" },
    { dest: "/404.html", src: "^/.*$", status: 404 },
  ],
  version: 3,
};

describe("injectNegotiationRoutes", () => {
  it("splices rewrites before handle:filesystem and Vary routes after it", () => {
    const injected = injectNegotiationRoutes(JSON.stringify(baseConfig), [
      "/docs/a",
    ]);
    expect(injected).not.toBeNull();
    const config = JSON.parse(injected ?? "");
    expect(config.version).toBe(3);
    expect(config.routes.map((route: { src?: string }) => route.src)).toEqual([
      "^(/docs/a)/?$",
      undefined,
      "^(?:/docs/a)/?$",
      "^/_astro/(.*)$",
      "^/api/ask/?$",
      "^/.*$",
    ]);
    expect(config.routes[1]).toStrictEqual({ handle: "filesystem" });
    expect(config.routes[0].dest).toBe("$1.md");
    expect(config.routes[2].continue).toBe(true);
  });

  it("is idempotent across re-injection", () => {
    const once = injectNegotiationRoutes(JSON.stringify(baseConfig), [
      "/docs/a",
      "/docs/b",
    ]);
    const twice = injectNegotiationRoutes(once ?? "", ["/docs/a", "/docs/b"]);
    expect(twice).toBe(once ?? "");
  });

  it("emits tab-indented JSON with a trailing newline", () => {
    const injected = injectNegotiationRoutes(JSON.stringify(baseConfig), [
      "/docs/a",
    ]);
    expect(injected?.endsWith("}\n")).toBe(true);
    expect(injected).toContain('\n\t"routes"');
  });

  it("splices a homepage Link route after handle:filesystem when given", () => {
    const link = '</llms.txt>; rel="describedby"; type="text/plain"';
    const injected = injectNegotiationRoutes(
      JSON.stringify(baseConfig),
      ["/docs/a"],
      link
    );
    const config = JSON.parse(injected ?? "");
    const filesystemIndex = config.routes.findIndex(
      (route: { handle?: string }) => route.handle === "filesystem"
    );
    const linkRoute = config.routes.find(
      (route: { headers?: Record<string, string> }) => route.headers?.link
    );
    expect(linkRoute).toStrictEqual({
      continue: true,
      headers: { link },
      src: "^/$",
    });
    expect(config.routes.indexOf(linkRoute)).toBeGreaterThan(filesystemIndex);
  });

  it("injects only the Link route when there are no content routes", () => {
    const link = '</llms.txt>; rel="describedby"; type="text/plain"';
    const injected = injectNegotiationRoutes(
      JSON.stringify(baseConfig),
      [],
      link
    );
    const config = JSON.parse(injected ?? "");
    expect(
      config.routes.filter(
        (route: { has?: unknown; headers?: Record<string, string> }) =>
          route.has || route.headers?.vary
      )
    ).toHaveLength(0);
    expect(
      config.routes.filter(
        (route: { headers?: Record<string, string> }) => route.headers?.link
      )
    ).toHaveLength(1);
  });

  it("replaces a previously injected Link route instead of duplicating it", () => {
    const once = injectNegotiationRoutes(
      JSON.stringify(baseConfig),
      ["/docs/a"],
      "old"
    );
    const twice = injectNegotiationRoutes(once ?? "", ["/docs/a"], "new");
    const config = JSON.parse(twice ?? "");
    const linkRoutes = config.routes.filter(
      (route: { headers?: Record<string, string> }) => route.headers?.link
    );
    expect(linkRoutes).toHaveLength(1);
    expect(linkRoutes[0].headers.link).toBe("new");
    expect(injectNegotiationRoutes(twice ?? "", ["/docs/a"], "new")).toBe(
      twice ?? ""
    );
  });

  it("adds content-type overrides for extensionless well-known files", () => {
    const overrides = {
      ".well-known/http-message-signatures-directory":
        "application/http-message-signatures-directory+json",
    };
    const once = injectNegotiationRoutes(
      JSON.stringify({
        ...baseConfig,
        overrides: { "kept.html": { path: "kept" } },
      }),
      ["/docs/a"],
      null,
      overrides
    );
    const config = JSON.parse(once ?? "");
    expect(config.overrides).toStrictEqual({
      ".well-known/http-message-signatures-directory": {
        contentType: "application/http-message-signatures-directory+json",
      },
      "kept.html": { path: "kept" },
    });
    // Re-injection replaces the keyed entry instead of duplicating anything.
    expect(
      injectNegotiationRoutes(once ?? "", ["/docs/a"], null, overrides)
    ).toBe(once ?? "");
    // Overrides alone are enough to warrant an injection.
    const alone = injectNegotiationRoutes(
      JSON.stringify(baseConfig),
      [],
      null,
      overrides
    );
    expect(JSON.parse(alone ?? "").overrides).toBeDefined();
  });

  it("returns null when there is nothing to do or nowhere to splice", () => {
    const text = JSON.stringify(baseConfig);
    expect(injectNegotiationRoutes(text, [])).toBeNull();
    expect(injectNegotiationRoutes(text, [], null)).toBeNull();
    expect(injectNegotiationRoutes(text, [], null, {})).toBeNull();
    expect(injectNegotiationRoutes("not json", ["/docs/a"])).toBeNull();
    expect(injectNegotiationRoutes("{}", ["/docs/a"])).toBeNull();
    expect(
      injectNegotiationRoutes(JSON.stringify({ routes: [{ src: "^/x$" }] }), [
        "/docs/a",
      ])
    ).toBeNull();
  });
});
