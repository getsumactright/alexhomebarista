import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Demo C · a rosetta poured into crema, seen from above. Square; the page masks it to a circle.
// Loop: crema at rest → milk blooms at the base → leaves stack bottom-to-top while the pitcher wiggles
// → pull-through → settle → the pattern dissolves back into crema.

const MILK = "#f7efe4";
const C = 540;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

// leaves: thick U-shaped strokes with round ends, widest at the base, shrinking toward the tip.
// The gaps between them are the crema; the round ends scallop the edge.
const LEAVES = 11;
const leaf = (i: number) => {
  const t = i / (LEAVES - 1);
  const y = 772 - t * 420;
  const w = interpolate(t, [0, 0.18, 0.38, 0.65, 1], [196, 238, 236, 176, 44], {
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });
  const sag = 24 + w * 0.34;
  const stroke = interpolate(t, [0, 1], [32, 18]); // crescent thickness at its center
  return { y, w, sag, stroke, start: 58 + i * 6 };
};

export const Rosetta: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const end = durationInFrames;

  // pour wiggle while the leaves are laid down
  const wiggleAmt = interpolate(frame, [56, 66, 116, 126], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#5b3118" }}>
      <svg viewBox="0 0 1080 1080" width="1080" height="1080">
        <defs>
          <radialGradient id="crema" cx="50%" cy="48%" r="62%">
            <stop offset="0%" stopColor="#c38a54" />
            <stop offset="45%" stopColor="#9c6036" />
            <stop offset="80%" stopColor="#6e3d1f" />
            <stop offset="100%" stopColor="#4a2612" />
          </radialGradient>
          <radialGradient id="wall" cx="50%" cy="50%" r="50%">
            <stop offset="78%" stopColor="rgba(30,14,4,0)" />
            <stop offset="100%" stopColor="rgba(30,14,4,0.5)" />
          </radialGradient>
          <linearGradient id="milkShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffaf3" />
            <stop offset="100%" stopColor="#efe2d0" />
          </linearGradient>
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="7"
            />
            <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.13  0 0 0 0 0.05  0 0 0 0.55 0" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
          <filter id="soft">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          {/* milk edges settle into the crema rather than sitting on it */}
          <filter id="feather" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        {/* crema, slowly turning */}
        <g
          style={{
            transformOrigin: "540px 540px",
            rotate: `${interpolate(frame, [0, end], [0, 24])}deg`,
          }}
        >
          <rect
            x="-200"
            y="-200"
            width="1480"
            height="1480"
            fill="url(#crema)"
          />
          <circle
            cx="540"
            cy="540"
            r="700"
            fill="#000"
            filter="url(#grain)"
            opacity="0.35"
          />
        </g>

        {/* the pour */}
        <g
          filter="url(#soft)"
          style={{
            opacity: interpolate(frame, [end - 32, end - 4], [1, 0], {
              ...clamp,
              easing: Easing.bezier(0.65, 0, 0.35, 1),
            }),
            transformOrigin: "540px 600px",
            scale: interpolate(frame, [end - 32, end - 4], [1, 1.07], clamp),
          }}
        >
          {/* milk breaks the surface at the base */}
          <ellipse
            cx="540"
            cy="790"
            rx="150"
            ry="34"
            fill="url(#milkShade)"
            style={{
              transformOrigin: "540px 790px",
              scale: interpolate(frame, [14, 58], [0, 1], {
                ...clamp,
                easing: out,
              }),
              opacity: interpolate(frame, [58, 84], [1, 0], clamp),
            }}
          />

          {/* leaves, laid bottom to top while the pitcher wiggles */}
          <g
            style={{
              translate: `${Math.sin(frame * 0.85) * 6 * wiggleAmt}px 0px`,
            }}
          >
            {Array.from({ length: LEAVES }).map((_, i) => {
              const { y, w, sag, stroke, start } = leaf(i);
              return (
                // a filled crescent: thick at the center, tapering to a point at each tip, like poured milk
                <path
                  key={i}
                  d={`M ${C - w} ${y - sag * 0.75} Q ${C} ${y + sag} ${C + w} ${y - sag * 0.75} Q ${C} ${y + sag - stroke * 2.3} ${C - w} ${y - sag * 0.75} Z`}
                  fill="url(#milkShade)"
                  filter="url(#feather)"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    rotate: `${i < 3 ? 0 : (i % 2 ? 1 : -1) * 0.9}deg`,
                    opacity: interpolate(
                      frame,
                      [start, start + 6],
                      [0, 1],
                      clamp,
                    ),
                    scale: `${interpolate(frame, [start, start + 18], [0.15, 1], { ...clamp, easing: out })} 1`,
                  }}
                />
              );
            })}
            {/* the small heart at the tip */}
            <ellipse
              cx="540"
              cy="326"
              rx="26"
              ry="20"
              fill={MILK}
              style={{
                transformOrigin: "540px 326px",
                scale: interpolate(frame, [118, 130], [0, 1], {
                  ...clamp,
                  easing: out,
                }),
              }}
            />
          </g>

          {/* the pull-through: a thin line of milk drawn from the tip down through every leaf */}
          <path
            d="M540 312 L540 830"
            stroke={MILK}
            strokeWidth="6"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            style={{
              strokeDashoffset: interpolate(frame, [126, 150], [1, 0], {
                ...clamp,
                easing: Easing.bezier(0.33, 0, 0.2, 1),
              }),
            }}
          />
        </g>

        {/* the cup wall's shadow on the surface */}
        <rect width="1080" height="1080" fill="url(#wall)" />
      </svg>
    </AbsoluteFill>
  );
};
