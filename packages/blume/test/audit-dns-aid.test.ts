import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import {
  dnsAidChecks,
  dnsAidFindings,
  dnsAidHost,
  lookupDnsAid,
} from "../src/audit/checks/dns-aid.ts";
import { codes, context } from "./audit-support.ts";

/**
 * The DNS-AID check queries DoH resolvers, which a test must never do for
 * real — `BLUME_DOH_URL` points the module at this fixture, which answers
 * DoH-JSON per hostname scenario.
 */

const answer = (type: number) => ({
  data: `1 . alpn="h2"`,
  name: "_index._agents.test.",
  type,
});

const server = Bun.serve({
  fetch(request) {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") ?? "";
    const type = Number(url.searchParams.get("type"));
    if (name.includes("broken.example")) {
      return new Response("boom", { status: 500 });
    }
    if (name.includes("garbled.example")) {
      return new Response("not json", { status: 200 });
    }
    if (name.includes("signed.example")) {
      return Response.json({ AD: true, Answer: [answer(type)], Status: 0 });
    }
    if (name.includes("nodnssec.example")) {
      // Records only on the HTTPS query; the SVCB query answers empty — the
      // one signed empty response must not mask the unsigned found one.
      return Response.json(
        type === 65
          ? { AD: false, Answer: [answer(type)], Status: 0 }
          : { AD: true, Status: 0 }
      );
    }
    if (name.includes("cname.example")) {
      // A CNAME in the answer section is not a discovery record.
      return Response.json({ AD: false, Answer: [answer(5)], Status: 0 });
    }
    return Response.json({ AD: false, Status: 3 });
  },
  port: 0,
});

beforeAll(() => {
  process.env.BLUME_DOH_URL = `http://localhost:${server.port}/dns-query`;
});

afterAll(() => {
  Reflect.deleteProperty(process.env, "BLUME_DOH_URL");
  server.stop(true);
});

describe("lookupDnsAid", () => {
  it("finds authenticated records on a signed zone", async () => {
    expect(await lookupDnsAid("signed.example")).toEqual({
      authenticated: true,
      found: true,
    });
  });

  it("finds unauthenticated records on an unsigned zone", async () => {
    expect(await lookupDnsAid("nodnssec.example")).toEqual({
      authenticated: false,
      found: true,
    });
  });

  it("reports absence when the entrypoint has no SVCB/HTTPS records", async () => {
    expect(await lookupDnsAid("missing.example")).toEqual({
      authenticated: true,
      found: false,
    });
    expect(await lookupDnsAid("cname.example")).toEqual({
      authenticated: true,
      found: false,
    });
  });

  it("returns null when no resolver gives a usable answer", async () => {
    expect(await lookupDnsAid("broken.example")).toBeNull();
    expect(await lookupDnsAid("garbled.example")).toBeNull();
  });
});

describe("dnsAidFindings", () => {
  it("suggests the exact record to publish when none exist", () => {
    const [diagnostic] = dnsAidFindings("docs.example.com", {
      authenticated: false,
      found: false,
    });
    expect(diagnostic?.code).toBe("BLUME_AUDIT_DNS_AID_MISSING");
    expect(diagnostic?.message).toContain("_index._agents.docs.example.com");
    expect(diagnostic?.suggestion).toContain(
      "_index._agents.docs.example.com. 3600 IN HTTPS 1 docs.example.com."
    );
  });

  it("flags unsigned records, and nothing on a signed zone", () => {
    expect(
      codes(dnsAidFindings("x.dev", { authenticated: false, found: true }))
    ).toEqual(["DNS_AID_UNSIGNED"]);
    expect(
      dnsAidFindings("x.dev", { authenticated: true, found: true })
    ).toEqual([]);
  });
});

describe("dnsAidHost", () => {
  it("extracts the deployment.site hostname", () => {
    expect(dnsAidHost("https://docs.example.com/base")).toBe(
      "docs.example.com"
    );
  });

  it("rejects unset, malformed, and unqueryable hosts", () => {
    expect(dnsAidHost()).toBeNull();
    expect(dnsAidHost("not a url")).toBeNull();
    expect(dnsAidHost("http://localhost:3000")).toBeNull();
    expect(dnsAidHost("https://docs.local")).toBeNull();
    expect(dnsAidHost("http://intranet")).toBeNull();
  });
});

const run = async (options: {
  origin?: string | null;
  site?: string;
}): Promise<string[]> =>
  codes(
    await dnsAidChecks.run({
      ...context({ site: options.site }),
      origin: options.origin ?? null,
    })
  );

describe("dnsAidChecks", () => {
  it("reports missing records for the deployment.site host", async () => {
    expect(
      await run({
        origin: "http://localhost:4321",
        site: "https://missing.example",
      })
    ).toEqual(["DNS_AID_MISSING"]);
  });

  it("stays quiet on a signed, discoverable site", async () => {
    expect(
      await run({
        origin: "http://localhost:4321",
        site: "https://signed.example",
      })
    ).toEqual([]);
  });

  it("skips outside the network tier, without a site, and when DoH is unreachable", async () => {
    expect(await run({ site: "https://missing.example" })).toEqual([]);
    expect(await run({ origin: "http://localhost:4321" })).toEqual([]);
    expect(
      await run({
        origin: "http://localhost:4321",
        site: "https://broken.example",
      })
    ).toEqual([]);
  });
});
