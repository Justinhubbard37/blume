"use client";

import { Easing, interpolate, useCurrentFrame } from "remotion";

export interface SharedAxisYProps {
  fromText: string;
  toText: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  className?: string;
}

interface Segment {
  text: string;
  /** Whether a word gap follows — spaced text staggers by word with 0.25em
   * margins; spaceless text (CJK) staggers per character, flush. */
  spaced: boolean;
}

// Spaced text animates word by word, exactly as before. A line with no spaces
// (Japanese, Chinese) would otherwise be a single "word" that pops in as one
// block, so it segments per character instead — on a tighter stagger, below,
// so long lines still land inside a swap beat.
const segment = (text: string): Segment[] =>
  text.includes(" ")
    ? text.split(" ").map((word) => ({ spaced: true, text: word }))
    : Array.from(text).map((char) => ({ spaced: false, text: char }));

export function SharedAxisY({
  fromText,
  toText,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  className,
}: SharedAxisYProps) {
  const frame = useCurrentFrame() * speed;

  const fromWords = segment(fromText);
  const toWords = segment(toText);

  const enterDur = 5;
  const exitDur = 4;
  const enterStagger = toWords[0]?.spaced === false ? 1 : 2;
  const exitStagger = fromWords[0]?.spaced === false ? 1 : 2;
  const overlapF = 0;
  const microDelayF = 1;

  const exitTotal = exitDur + (fromWords.length - 1) * exitStagger;
  const newStart = Math.max(0, exitTotal - overlapF + microDelayF);

  const fontStack =
    "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        background: "transparent",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight,
            color,
            letterSpacing: "-0.03em",
            fontFamily: fontStack,
          }}
        >
          {fromWords.map((word, i) => {
            const local = frame - i * exitStagger;
            const opacity = interpolate(local, [0, exitDur], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.step1,
            });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: word.spaced ? "0.25em" : 0,
                  opacity,
                }}
              >
                {word.text}
              </span>
            );
          })}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight,
            color,
            letterSpacing: "-0.03em",
            fontFamily: fontStack,
          }}
        >
          {toWords.map((word, j) => {
            const local = frame - newStart - j * enterStagger;
            const opacity = interpolate(local, [0, enterDur], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.step1,
            });
            return (
              <span
                key={j}
                style={{
                  display: "inline-block",
                  marginRight: word.spaced ? "0.25em" : 0,
                  opacity,
                }}
              >
                {word.text}
              </span>
            );
          })}
        </span>
      </div>
    </div>
  );
}
