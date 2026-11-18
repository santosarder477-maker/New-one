import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { colors, DURATION } from "../theme";

/** Deep teal/black gradient with slowly drifting warm and cool light pools. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / DURATION;
  const warmX = 30 + Math.sin(frame / 70) * 12;
  const warmY = 70 - t * 25;
  const coolX = 75 + Math.cos(frame / 90) * 10;
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(60% 40% at ${warmX}% ${warmY}%, rgba(242,165,65,0.16) 0%, rgba(242,165,65,0) 70%),
          radial-gradient(55% 35% at ${coolX}% 22%, rgba(29,75,90,0.55) 0%, rgba(29,75,90,0) 70%),
          radial-gradient(120% 80% at 50% 50%, ${colors.bgMid} 0%, ${colors.bgDeep} 70%)
        `,
      }}
    />
  );
};

/** Floating dust / ember particles with deterministic randomness. */
export const Dust: React.FC<{ count?: number; warm?: number }> = ({ count = 46, warm = 0.4 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`x${i}`) * 1080;
        const speed = 0.4 + random(`s${i}`) * 1.4;
        const y = (((random(`y${i}`) * 2100 - frame * speed) % 2100) + 2100) % 2100 - 90;
        const size = 2 + random(`r${i}`) * 5;
        const flicker = 0.35 + 0.65 * Math.abs(Math.sin(frame / (12 + random(`f${i}`) * 20) + i));
        const isWarm = random(`w${i}`) < warm;
        const sway = Math.sin(frame / 40 + i) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: isWarm ? colors.amber : colors.ivory,
              opacity: 0.22 * flicker,
              boxShadow: `0 0 ${size * 3}px ${isWarm ? colors.amber : colors.ivory}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Animated film grain using SVG turbulence; seed changes every 2 frames. */
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 50;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(85% 60% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.85) 100%)",
    }}
  />
);

/** Letterbox-style subtle colour grade: lifted teal shadows + warm highlights. */
export const ColorGrade: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "rgba(20,60,75,0.10)", mixBlendMode: "soft-light", pointerEvents: "none" }} />
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, rgba(242,165,65,0.06) 0%, rgba(0,0,0,0) 40%, rgba(29,75,90,0.10) 100%)",
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  </>
);

/** A soft amber light sweep used to glue scene transitions together. */
export const LightLeak: React.FC<{ at: number; duration?: number; strength?: number }> = ({
  at,
  duration = 24,
  strength = 0.55,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at - duration / 2, at + duration / 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (p <= 0 || p >= 1) return null;
  const intensity = Math.sin(p * Math.PI) * strength;
  const x = interpolate(p, [0, 1], [-30, 130]);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: intensity,
        background: `radial-gradient(45% 70% at ${x}% 45%, rgba(255,190,110,0.9) 0%, rgba(226,85,46,0.35) 40%, rgba(0,0,0,0) 70%)`,
      }}
    />
  );
};
