import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, prog, velocity } from "../anim";
import { MotionBlur } from "../components/MotionBlur";
import { colors, display, ease, sans, serif } from "../theme";

/** 0–3 s: "STOP WASTING TIME" — slam, rise, ignite. */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();

  // STOP: slams in from the camera.
  const stopP = prog(f, 0, 10);
  const stopScale = interpolate(stopP, [0, 1], [2.2, 1]);
  const stopBlur = (1 - stopP) * 26;

  // wasting: rises with a mask reveal.
  const wasteP = prog(f, 14, 16);
  const wasteV = velocity(f, 14, 16);

  // TIME: slams in, then glows.
  const timeP = prog(f, 28, 10);
  const timeScale = interpolate(timeP, [0, 1], [1.9, 1]);
  const glow = interpolate(f, [30, 45, 90], [0, 1, 0.55], clamp);

  // Underline and second-hand ring.
  const lineP = prog(f, 40, 22, ease.inOut);
  const ringIn = prog(f, 6, 30);
  const tickIndex = Math.floor(Math.max(0, f - 45) / 15);
  const tickFrac = prog((Math.max(0, f - 45)) % 15, 0, 6);
  const handAngle = (tickIndex + tickFrac) * 6 * 4;

  // White flash on first impact.
  const flash = interpolate(f, [0, 2, 7], [0.0, 0.55, 0], clamp);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Clock ring behind the type */}
      <svg
        width={1000}
        height={1000}
        viewBox="-500 -500 1000 1000"
        style={{ position: "absolute", opacity: 0.55 * ringIn, transform: `scale(${0.8 + ringIn * 0.2}) rotate(${f * 0.05}deg)` }}
      >
        <circle r={430} fill="none" stroke="rgba(244,239,230,0.12)" strokeWidth={2} />
        {new Array(60).fill(0).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const long = i % 5 === 0;
          const r1 = long ? 395 : 410;
          return (
            <line
              key={i}
              x1={Math.sin(a) * r1}
              y1={-Math.cos(a) * r1}
              x2={Math.sin(a) * 428}
              y2={-Math.cos(a) * 428}
              stroke={long ? "rgba(242,165,65,0.7)" : "rgba(244,239,230,0.25)"}
              strokeWidth={long ? 4 : 2}
            />
          );
        })}
        <line
          x1={0}
          y1={40}
          x2={0}
          y2={-380}
          stroke={colors.ember}
          strokeWidth={4}
          strokeLinecap="round"
          transform={`rotate(${handAngle})`}
          opacity={interpolate(f, [40, 50], [0, 0.9], clamp)}
        />
      </svg>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -40 }}>
        <MotionBlur y={stopBlur}>
          <div
            style={{
              fontFamily: display,
              fontSize: 430,
              lineHeight: 0.86,
              color: colors.ivory,
              letterSpacing: interpolate(stopP, [0, 1], [60, 8]),
              transform: `scale(${stopScale})`,
              opacity: stopP,
              textShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            STOP
          </div>
        </MotionBlur>

        <div style={{ overflow: "hidden", padding: "10px 30px", marginTop: -10 }}>
          <MotionBlur y={wasteV * 220}>
            <div
              style={{
                fontFamily: serif,
                fontStyle: "italic",
                fontSize: 150,
                lineHeight: 1.05,
                color: colors.ivory,
                opacity: 0.85 * wasteP,
                transform: `translateY(${(1 - wasteP) * 170}px)`,
              }}
            >
              wasting
            </div>
          </MotionBlur>
        </div>

        <MotionBlur y={(1 - timeP) * 24}>
          <div
            style={{
              fontFamily: display,
              fontSize: 470,
              lineHeight: 0.86,
              letterSpacing: 10,
              transform: `scale(${timeScale})`,
              opacity: timeP,
              backgroundImage: `linear-gradient(180deg, ${colors.gold1} 0%, ${colors.amber} 45%, ${colors.ember} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: `drop-shadow(0 0 ${40 * glow}px rgba(242,140,50,${0.55 * glow}))`,
            }}
          >
            TIME
          </div>
        </MotionBlur>

        <div
          style={{
            marginTop: 26,
            width: 520 * lineP,
            height: 3,
            background: `linear-gradient(90deg, rgba(242,165,65,0), ${colors.amber}, rgba(242,165,65,0))`,
          }}
        />
        <div
          style={{
            marginTop: 26,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: 14,
            color: colors.muted,
            opacity: prog(f, 50, 16),
            transform: `translateY(${(1 - prog(f, 50, 16)) * 20}px)`,
          }}
        >
          THE CLOCK IS RUNNING
        </div>
      </div>

      <AbsoluteFill style={{ background: colors.ivory, opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
