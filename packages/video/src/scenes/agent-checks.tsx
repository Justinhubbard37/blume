"use client";

import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";

import { SoftBlurIn } from "@/components/remocn/soft-blur-in";

// The agent-readiness checklist scene: a fixed headline over a stack of
// requirement cards — the standards an agent-ready docs site is expected to
// answer (each one an isitagentready.com check this release wires in) — that
// scrolls up through the frame on glass cards. The scroll is deliberately
// quick through the early cards — the point is the *pile*, not the prose —
// then settles so the last card rests before the cut.

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

const WHITE = "#ffffff";
const INK = "rgba(0,0,0,0.88)";
const MUTED = "rgba(0,20,40,0.6)";
const FAINT = "rgba(0,20,40,0.48)";
const PILL_BORDER = "rgba(255,255,255,0.65)";

interface Check {
  title: string;
  goal: string;
  pills: string[];
}

const CHECKS: Check[] = [
  {
    goal: "Include Link response headers for agent discovery",
    pills: ["RFC 8288", "IANA Link Relations"],
    title: "Link Response Headers",
  },
  {
    goal: "Publish an API catalog for automated API discovery",
    pills: ["RFC 9727", "RFC 9264"],
    title: "API Catalog",
  },
  {
    goal: "Publish an MCP Server Card for agent discovery",
    pills: ["SEP-2127", "MCP Specification"],
    title: "MCP Server Card",
  },
  {
    goal: "Publish an agent skills discovery index",
    pills: ["Discovery RFC v0.2.0", "agentskills.io"],
    title: "Agent Skills",
  },
  {
    goal: "Expose site tools to AI agents via the browser",
    pills: ["W3C Draft", "Chrome EPP"],
    title: "WebMCP",
  },
  {
    goal: "Identify your site’s agents with Web Bot Auth",
    pills: ["IETF webbotauth", "RFC 9421"],
    title: "Web Bot Auth",
  },
  {
    goal: "Publish DNS records for DNS-based agent discovery",
    pills: ["IETF Draft", "RFC 9460"],
    title: "DNS for AI Discovery (DNS-AID)",
  },
];

const CARD_W = 760;
const CARD_H = 132;
const CARD_GAP = 22;
const STACK_H = CHECKS.length * (CARD_H + CARD_GAP) - CARD_GAP;

// The stage the cards travel through (reference 1280×720), under the headline.
const REF_H = 720;
const MASK_TOP = 176;
// Where the final card comes to rest, and how long everything takes.
const REST_TOP = 362;
const SCROLL_START = 20;
const SCROLL_END = 145;
const TAIL_HOLD = 14;
export const AGENT_CHECKS_DURATION = SCROLL_END + TAIL_HOLD;

// Total travel: the stack starts fully below the frame and ends with the last
// card's top parked at REST_TOP.
const TRAVEL = REF_H + STACK_H - CARD_H - REST_TOP;

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// True glass, unlike the near-opaque terminal cards: the gradient reads
// through a heavier, saturated blur, with a bright edge doing the lifting.
const CheckCard = ({ check }: { check: Check }) => (
  <div
    style={{
      // oxlint-disable-next-line react-doctor/no-large-animated-blur -- intentional video visual — frosted-glass blur radius tuned for launch render
      WebkitBackdropFilter: "blur(28px) saturate(1.4)",
      // oxlint-disable-next-line react-doctor/no-large-animated-blur -- intentional video visual — frosted-glass blur radius tuned for launch render
      backdropFilter: "blur(28px) saturate(1.4)",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.44) 0%, rgba(255,255,255,0.26) 100%)",
      border: "1px solid rgba(255,255,255,0.6)",
      borderRadius: 16,
      boxShadow:
        "0 18px 44px rgba(30,40,60,0.14), inset 0 1px 0 rgba(255,255,255,0.75)",
      fontFamily: SANS,
      height: CARD_H,
      overflow: "hidden",
      padding: "18px 26px",
      width: CARD_W,
    }}
  >
    <div
      style={{
        color: INK,
        fontSize: 21,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        lineHeight: "26px",
      }}
    >
      {check.title}
    </div>
    <div
      style={{
        color: MUTED,
        fontSize: 14.5,
        lineHeight: "21px",
        marginTop: 8,
      }}
    >
      {check.goal}
    </div>
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      {check.pills.map((pill) => (
        <span
          key={pill}
          style={{
            background: "rgba(255,255,255,0.28)",
            border: `1px solid ${PILL_BORDER}`,
            borderRadius: 8,
            color: FAINT,
            fontSize: 12.5,
            fontWeight: 500,
            padding: "3px 10px",
          }}
        >
          {pill}
        </span>
      ))}
    </div>
  </div>
);

export const AgentChecks = () => {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [SCROLL_START, SCROLL_END], [0, TRAVEL], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* The card stack, masked so it slides in from the bottom and vanishes
          cleanly under the headline instead of colliding with it. */}
      <AbsoluteFill
        style={{
          WebkitMaskImage: `linear-gradient(to bottom, transparent ${MASK_TOP - 48}px, black ${MASK_TOP + 22}px, black 92%, transparent 100%)`,
          maskImage: `linear-gradient(to bottom, transparent ${MASK_TOP - 48}px, black ${MASK_TOP + 22}px, black 92%, transparent 100%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: CARD_GAP,
            left: "50%",
            position: "absolute",
            top: REF_H,
            transform: `translate(-50%, ${-scroll}px)`,
          }}
        >
          {CHECKS.map((check) => (
            <CheckCard check={check} key={check.title} />
          ))}
        </div>
      </AbsoluteFill>

      {/* Fixed two-line headline — rendered above the masked scroll, with the
          second line trailing by the house 8f beat. */}
      <Sequence layout="none">
        <div
          style={{
            inset: 0,
            position: "absolute",
            transform: "translateY(-302px)",
          }}
        >
          <SoftBlurIn
            text="Readable isn’t enough anymore."
            fontSize={44}
            color={WHITE}
          />
        </div>
      </Sequence>
      <Sequence from={8} layout="none">
        <div
          style={{
            inset: 0,
            position: "absolute",
            transform: "translateY(-252px)",
          }}
        >
          <SoftBlurIn
            text="Agent-ready is the new baseline."
            fontSize={44}
            color={WHITE}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
