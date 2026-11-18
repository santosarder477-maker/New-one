import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { clamp, prog, velocity } from "../anim";
import { MotionBlur } from "../components/MotionBlur";
import { colors, display, ease, sans } from "../theme";

/** Rising embers concentrated behind the final message. */
const Embers: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(36).fill(0).map((_, i) => {
        const start = random(`es${i}`) * 40;
        const life = 50 + random(`el${i}`) * 40;
        const t = (f - start) / life;
        if (t < 0 || t > 1) return null;
        const x = 540 + (random(`ex${i}`) - 0.5) * 900 + Math.sin(f / 9 + i) * 18;
        const y = 1250 - t * (500 + random(`ey${i}`) * 500);
        const s = 3 + random(`ez${i}`) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: "50%",
              background: colors.amber,
              opacity: Math.sin(t * Math.PI) * 0.8,
              boxShadow: `0 0 ${s * 4}px ${colors.ember}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** 12–15 s: "MAKE TODAY COUNT". */
export const Close: React.FC = () => {
  const f = useCurrentFrame();
  const makeP = prog(f, 10, 18);
  const todayP = prog(f, 14, 16);
  const todayV = velocity(f, 14, 16);
  const countP = prog(f, 22, 16);
  const countV = velocity(f, 22, 16);
  const lineP = prog(f, 32, 26, ease.inOut);
  const sweep = interpolate(f, [30, 70], [-60, 160], clamp);
  const halo = interpolate(f, [10, 40], [0, 1], clamp);
  const fadeOut = interpolate(f, [88, 96], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
      <AbsoluteFill
        style={{
          opacity: halo,
          background: "radial-gradient(45% 25% at 50% 50%, rgba(242,165,65,0.22) 0%, rgba(242,165,65,0) 70%)",
        }}
      />
      <Embers />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -30 }}>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 300,
            fontSize: 70,
            letterSpacing: interpolate(makeP, [0, 1], [90, 46]),
            marginRight: -46,
            color: colors.ivory,
            opacity: makeP,
          }}
        >
          MAKE
        </div>
        <MotionBlur y={todayV * 300}>
          <div
            style={{
              fontFamily: display,
              fontSize: 420,
              lineHeight: 0.9,
              letterSpacing: 8,
              transform: `translateY(${(1 - todayP) * 140}px) scale(${interpolate(todayP, [0, 1], [1.15, 1])})`,
              opacity: todayP,
              backgroundImage: `linear-gradient(105deg, ${colors.gold2} 0%, ${colors.gold1} ${sweep - 20}%, #ffffff ${sweep}%, ${colors.gold1} ${sweep + 20}%, ${colors.gold2} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 10px 50px rgba(242,165,65,0.35))",
            }}
          >
            TODAY
          </div>
        </MotionBlur>
        <MotionBlur y={countV * 300}>
          <div
            style={{
              fontFamily: display,
              fontSize: 420,
              lineHeight: 0.9,
              letterSpacing: 8,
              color: colors.ivory,
              transform: `translateY(${(1 - countP) * 140}px) scale(${interpolate(countP, [0, 1], [1.15, 1])})`,
              opacity: countP,
            }}
          >
            COUNT
          </div>
        </MotionBlur>
        <div
          style={{
            marginTop: 30,
            width: 640 * lineP,
            height: 3,
            background: `linear-gradient(90deg, rgba(242,165,65,0), ${colors.amber}, rgba(242,165,65,0))`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
