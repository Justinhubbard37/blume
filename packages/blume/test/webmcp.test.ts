import { describe, expect, it } from "bun:test";

import type { WebMcpTool } from "../src/components/islands/webmcp.ts";
import {
  buildWebMcpTools,
  registerWebMcpTools,
} from "../src/components/islands/webmcp.ts";
import type { SearchFn } from "../src/components/layout/search/types.ts";

const noSearch: () => Promise<SearchFn> = () =>
  Promise.reject(new Error("unused"));

const toolsWith = (
  overrides: Partial<Parameters<typeof buildWebMcpTools>[0]> = {}
): WebMcpTool[] =>
  buildWebMcpTools({
    base: "/base/",
    llms: true,
    loadSearch: noSearch,
    search: true,
    ...overrides,
  });

const tool = (tools: WebMcpTool[], name: string): WebMcpTool => {
  const found = tools.find((entry) => entry.name === name);
  if (!found) {
    throw new Error(`no tool ${name}`);
  }
  return found;
};

const okResponse = (body: string): Response =>
  new Response(body, { status: 200 });

const hitSearch: SearchFn = () =>
  Promise.resolve({
    hits: [
      {
        excerpt: "Install <mark>Blume</mark> quickly.",
        title: "<mark>Install</mark>",
        url: "/quickstart",
      },
    ],
    sections: [],
  });

describe("buildWebMcpTools", () => {
  it("offers the read-only tool set, gated by the config flags", () => {
    expect(toolsWith().map((entry) => entry.name)).toEqual([
      "search_docs",
      "get_page",
      "list_pages",
    ]);
    expect(
      toolsWith({ llms: false, search: false }).map((entry) => entry.name)
    ).toEqual(["get_page"]);
    for (const entry of toolsWith()) {
      expect(entry.annotations).toEqual({
        openWorldHint: false,
        readOnlyHint: true,
      });
      expect(entry.description.length).toBeGreaterThan(20);
      expect(entry.inputSchema.type).toBe("object");
    }
  });

  it("search_docs strips markup, prefixes URLs, and retries a failed loader", async () => {
    let loads = 0;
    const search = tool(
      toolsWith({
        loadSearch: () => {
          loads += 1;
          return loads === 1
            ? Promise.reject(new Error("index offline"))
            : Promise.resolve(hitSearch);
        },
      }),
      "search_docs"
    );

    const blank = await search.execute({ query: "  " });
    expect(blank.isError).toBe(true);
    const failed = await search.execute({ query: "install" });
    expect(failed.isError).toBe(true);
    // The loader failure did not latch: the next call loads and succeeds.
    const result = await search.execute({ query: "install" });
    expect(result.isError).toBeUndefined();
    expect(result.content[0]?.text).toBe(
      "Install — /base/quickstart\nInstall Blume quickly."
    );
    const empty = await search.execute({ query: "zzz-no-hit" });
    // A working search with no matches is an answer, not an error.
    expect(empty.isError).toBeUndefined();
    expect(loads).toBe(2);
  });

  it("get_page fetches the based .md mirror and maps the home route", async () => {
    const fetched: string[] = [];
    const fetchFn = ((url: string) => {
      fetched.push(url);
      return Promise.resolve(okResponse(`# page at ${url}\n`));
    }) as unknown as typeof fetch;
    const getPage = tool(toolsWith({ fetchFn }), "get_page");

    const page = await getPage.execute({ route: "/quickstart/" });
    expect(page.content[0]?.text).toContain("/base/quickstart.md");
    await getPage.execute({ route: "/" });
    expect(fetched).toEqual(["/base/quickstart.md", "/base/index.md"]);

    const relative = await getPage.execute({ route: "quickstart" });
    expect(relative.isError).toBe(true);
    const missing = tool(
      toolsWith({
        fetchFn: (() =>
          Promise.resolve(
            new Response("nope", { status: 404 })
          )) as unknown as typeof fetch,
      }),
      "get_page"
    );
    const gone = await missing.execute({ route: "/gone" });
    expect(gone.isError).toBe(true);
    const offline = tool(
      toolsWith({
        fetchFn: (() =>
          Promise.reject(new Error("offline"))) as unknown as typeof fetch,
      }),
      "get_page"
    );
    const down = await offline.execute({ route: "/x" });
    expect(down.isError).toBe(true);
  });

  it("list_pages returns llms.txt from the deployment base", async () => {
    const fetched: string[] = [];
    const fetchFn = ((url: string) => {
      fetched.push(url);
      return Promise.resolve(okResponse("# Docs\n- [A](/a)\n"));
    }) as unknown as typeof fetch;
    const list = tool(toolsWith({ fetchFn }), "list_pages");
    const result = await list.execute({});
    expect(fetched).toEqual(["/base/llms.txt"]);
    expect(result.content[0]?.text).toContain("- [A](/a)");

    const missing = tool(
      toolsWith({
        fetchFn: (() =>
          Promise.resolve(
            new Response("", { status: 404 })
          )) as unknown as typeof fetch,
      }),
      "list_pages"
    );
    const gone = await missing.execute({});
    expect(gone.isError).toBe(true);
    const offline = tool(
      toolsWith({
        fetchFn: (() =>
          Promise.reject(new Error("offline"))) as unknown as typeof fetch,
      }),
      "list_pages"
    );
    const down = await offline.execute({});
    expect(down.isError).toBe(true);
  });
});

describe("registerWebMcpTools", () => {
  const tools = toolsWith({ llms: false, search: false });

  it("prefers provideContext and falls back to registerTool", () => {
    const provided: unknown[] = [];
    expect(
      registerWebMcpTools(tools, {
        provideContext: (context) => provided.push(context),
      })
    ).toBe(true);
    expect(provided).toEqual([{ tools }]);

    const registered: unknown[] = [];
    expect(
      registerWebMcpTools(tools, {
        registerTool: (entry) => registered.push(entry),
      })
    ).toBe(true);
    expect(registered).toEqual(tools);
  });

  it("reports false when no model context surface exists", () => {
    expect(registerWebMcpTools(tools, null)).toBe(false);
    expect(registerWebMcpTools(tools)).toBe(false);
    expect(registerWebMcpTools(tools, {})).toBe(false);
  });
});
