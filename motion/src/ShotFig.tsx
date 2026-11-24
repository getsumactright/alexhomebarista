import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/OldStandardTT";
import { loadFont as loadMono } from "@remotion/google-fonts/RedHatMono";
import { loadFont as loadSans } from "@remotion/google-fonts/Archivo";

// Demo D · FIG. 2, a shot pulled as a patent drawing. India ink on white bond, one carmine ink for what is live.
// Loop: outlines trace → puck hatched, dose called out → stream runs, cup fills, timer ticks to 0:28 → yield called out → hold → fade to paper.

const { fontFamily: serif } = loadSerif("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
const { fontFamily: mono } = loadMono("normal", {
  weights: ["500"],
  subsets: ["latin"],
});
const { fontFamily: sans } = loadSans("normal", {
  weights: ["500"],
  subsets: ["latin"],
});

const INK = "#151515";
const PAPER = "#fbfbf8";
const CARMINE = "#b3261e";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const draw = Easing.bezier(0.45, 0, 0.2, 1);

// outlines, traced in order
const PARTS: { d: string; at: number }[] = [
  { d: "M440 70 H760 V150 H440 Z", at: 0 }, // group head
  {
    d: "M470 150 V168 M730 150 V168 M600 70 V40 M520 70 V52 M680 70 V52",
    at: 6,
  }, // bolts & neck
  {
    d: "M462 168 H738 V200 C738 232 712 248 680 248 H520 C488 248 462 232 462 200 Z",
    at: 12,
  }, // basket
  {
    d: "M738 186 L1020 206 C1034 207 1040 216 1038 226 C1036 236 1028 240 1016 239 L738 224",
    at: 20,
  }, // handle
  {
    d: "M560 248 L566 272 H590 L596 248 M604 248 L610 272 H634 L640 248",
    at: 28,
  }, // spouts
  {
    d: "M492 520 L512 812 C513 824 520 830 532 830 H668 C680 830 687 824 688 812 L708 520",
    at: 34,
  }, // cup outer
  {
    d: "M504 532 L522 806 C523 814 527 818 535 818 H665 C673 818 677 814 678 806 L696 532",
    at: 40,
  }, // cup inner
  { d: "M380 830 H820", at: 46 }, // counter line
];

export const ShotFig: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const end = durationInFrames;

  const pour = [104, 196];
  const level = interpolate(frame, pour, [818, 650], {
    ...clamp,
    easing: Easing.bezier(0.3, 0, 0.4, 1),
  });
  const seconds = Math.round(interpolate(frame, pour, [0, 28], clamp));
  const streaming = frame >= pour[0] && frame <= pour[1] + 6;

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [end - 20, end - 2], [1, 0], {
            ...clamp,
            easing: Easing.bezier(0.65, 0, 0.35, 1),
          }),
        }}
      >
        <svg viewBox="0 0 1200 900" width="1200" height="900">
          <defs>
            <pattern
              id="hatch"
              width="9"
              height="9"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="9"
                stroke={INK}
                strokeWidth="1.6"
              />
            </pattern>
            <pattern
              id="cross"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke={INK}
                strokeWidth="1.5"
              />
              <line
                x1="0"
                y1="0"
                x2="8"
                y2="0"
                stroke={INK}
                strokeWidth="1.5"
              />
            </pattern>
            <clipPath id="cupClip">
              <path d="M504 532 L522 806 C523 814 527 818 535 818 H665 C673 818 677 814 678 806 L696 532 Z" />
            </clipPath>
            <clipPath id="basketClip">
              <path d="M466 172 H734 V200 C734 228 710 244 680 244 H520 C490 244 466 228 466 200 Z" />
            </clipPath>
          </defs>

          {/* sheet border */}
          <rect
            x="24"
            y="24"
            width="1152"
            height="852"
            fill="none"
            stroke={INK}
            strokeWidth="2"
          />

          {/* the apparatus, traced */}
          {PARTS.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={INK}
              strokeWidth="2.6"
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              style={{
                strokeDashoffset: interpolate(
                  frame,
                  [p.at, p.at + 34],
                  [1, 0],
                  { ...clamp, easing: draw },
                ),
              }}
            />
          ))}

          {/* the puck, in section */}
          <rect
            x="462"
            y="196"
            width="276"
            height="52"
            fill="url(#hatch)"
            clipPath="url(#basketClip)"
            style={{ opacity: interpolate(frame, [58, 76], [0, 1], clamp) }}
          />

          {/* the stream: two threads from the spouts, moving */}
          {[578, 622].map((x) => (
            <line
              key={x}
              x1={x}
              y1="272"
              x2={x + (x < 600 ? 10 : -10)}
              y2={level}
              stroke={INK}
              strokeWidth="2.2"
              strokeDasharray="14 8"
              strokeLinecap="round"
              style={{
                strokeDashoffset: -frame * 4,
                opacity: streaming
                  ? interpolate(
                      frame,
                      [pour[0], pour[0] + 6, pour[1], pour[1] + 6],
                      [0, 1, 1, 0],
                      clamp,
                    )
                  : 0,
              }}
            />
          ))}

          {/* the shot in the cup: espresso cross-hatched, a band of crema single-hatched */}
          <g clipPath="url(#cupClip)">
            <rect
              x="490"
              y={level + 14}
              width="220"
              height="830"
              fill="url(#cross)"
            />
            <rect
              x="490"
              y={level}
              width="220"
              height="14"
              fill="url(#hatch)"
            />
            <line
              x1="490"
              y1={level}
              x2="710"
              y2={level}
              stroke={INK}
              strokeWidth="2"
              style={{ opacity: frame >= pour[0] ? 1 : 0 }}
            />
          </g>

          {/* reference: dose */}
          <path
            d="M452 214 C 400 214, 360 240, 300 240"
            fill="none"
            stroke={INK}
            strokeWidth="1.8"
            pathLength={1}
            strokeDasharray="1 1"
            style={{
              strokeDashoffset: interpolate(frame, [66, 90], [1, 0], {
                ...clamp,
                easing: draw,
              }),
            }}
          />
          <g style={{ opacity: interpolate(frame, [82, 96], [0, 1], clamp) }}>
            <text
              x="286"
              y="254"
              textAnchor="end"
              fontFamily={mono}
              fontSize="56"
              fill={INK}
            >
              18 g
            </text>
            <text
              x="286"
              y="292"
              textAnchor="end"
              fontFamily={sans}
              fontSize="22"
              letterSpacing="6"
              fill={INK}
            >
              DOSE
            </text>
          </g>

          {/* reference: yield */}
          <path
            d="M716 700 C 780 700, 820 680, 880 680"
            fill="none"
            stroke={INK}
            strokeWidth="1.8"
            pathLength={1}
            strokeDasharray="1 1"
            style={{
              strokeDashoffset: interpolate(frame, [196, 214], [1, 0], {
                ...clamp,
                easing: draw,
              }),
            }}
          />
          <g style={{ opacity: interpolate(frame, [206, 218], [0, 1], clamp) }}>
            <text x="896" y="696" fontFamily={mono} fontSize="56" fill={INK}>
              36 g
            </text>
            <text
              x="898"
              y="734"
              fontFamily={sans}
              fontSize="22"
              letterSpacing="6"
              fill={INK}
            >
              YIELD
            </text>
          </g>

          {/* the timer: the one thing live, in carmine */}
          <g style={{ opacity: interpolate(frame, [96, 106], [0, 1], clamp) }}>
            <text
              x="880"
              y="370"
              fontFamily={mono}
              fontSize="88"
              fill={frame <= pour[1] ? CARMINE : INK}
            >
              0:{String(seconds).padStart(2, "0")}
            </text>
            <text
              x="882"
              y="410"
              fontFamily={sans}
              fontSize="22"
              letterSpacing="6"
              fill={INK}
            >
              TIME
            </text>
          </g>

          {/* caption */}
          <g style={{ opacity: interpolate(frame, [30, 50], [0, 1], clamp) }}>
            <text x="120" y="770" fontFamily={serif} fontSize="96" fill={INK}>
              FIG. 2
            </text>
            <text
              x="124"
              y="814"
              fontFamily={sans}
              fontSize="24"
              letterSpacing="7"
              fill={INK}
            >
              A SHOT, DIALED IN
            </text>
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
