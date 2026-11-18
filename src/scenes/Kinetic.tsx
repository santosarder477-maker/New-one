import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, prog, velocity } from "../anim";
import { MotionBlur } from "../components/MotionBlur";
import { colors, display, ease, sans, serif } from "../theme";

/** A phrase group that pushes in from below and exits upward with motion blur. */
const Group: React.FC<{ start: number; end: number; children: React.ReactNode }> = ({ start, end, children }) => {
  const f = useCurrentFrame();
  if (f < start - 1 || f > end + 1) return null;
  const outP = prog(f, end - 9, 9, ease.in);
  const outV = velocity(f, end - 9, 9, ease.in);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - outP,
        transform: `translateY(${-outP * 260}px)`,
      }}
    >
      <MotionBlur y={outV * 260}>{children}</MotionBlur>
    </AbsoluteFill>
  );
};

/** Single word that slides in from a direction with directional blur. */
const Word: React.FC<{
  at: number;
  from: "left" | "right" | "up" | "down";
  children: React.ReactNode;
  style: React.CSSProperties;
  distance?: number;
}> = ({ at, from, children, style, distance = 420 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 14);
  const v = velocity(f, at, 14);
  const horizontal = from === "left" || from === "right";
  const sign = from === "left" || from === "up" ? -1 : 1;
  const offset = (1 - p) * distance * sign;
  return (
    <MotionBlur x={horizontal ? v * distance * 0.9 : 0} y={horizontal ? 0 : v * distance * 0.9}>
      <div
        style={{
          ...style,
          opacity: interpolate(p, [0, 0.35], [0, 1], clamp),
          transform: horizontal ? `translateX(${offset}px)` : `translateY(${offset}px)`,
        }}
      >
        {children}
      </div>
    </MotionBlur>
  );
};

/** Mask-reveal line: text rises from behind an invisible edge. */
const Rise: React.FC<{ at: number; children: React.ReactNode; style: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 14);
  const v = velocity(f, at, 14);
  return (
    <div style={{ overflow: "hidden", padding: "0 30px 18px" }}>
      <MotionBlur y={v * 200}>
        <div style={{ ...style, transform: `translateY(${(1 - p) * 110}%)` }}>{children}</div>
      </MotionBlur>
    </div>
  );
};

/** 3–7 s: kinetic typography. */
export const Kinetic: React.FC = () => {
  const f = useCurrentFrame();
  const counter = Math.round(interpolate(f, [8, 40], [1, 86400], { ...clamp, easing: ease.inOut }));

  return (
    <AbsoluteFill>
      {/* Phrase A — EVERY SECOND */}
      <Group start={0} end={42}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Word at={4} from="left" distance={300} style={{ fontFamily: sans, fontWeight: 300, fontSize: 64, letterSpacing: 40, color: colors.muted }}>
            EVERY
          </Word>
          <Word at={9} from="right" style={{ fontFamily: display, fontSize: 340, lineHeight: 0.9, color: colors.ivory, letterSpacing: 6 }}>
            SECOND
          </Word>
          <div
            style={{
              marginTop: 30,
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 40,
              letterSpacing: 6,
              color: colors.amber,
              fontVariantNumeric: "tabular-nums",
              opacity: prog(f, 10, 10),
            }}
          >
            {counter.toLocaleString("en-US")} <span style={{ color: colors.muted }}>/ 86,400 TODAY</span>
          </div>
        </div>
      </Group>

      {/* Phrase B — you scroll, you wait, you delay */}
      <Group start={40} end={80}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: -40 }}>
          {["you scroll,", "you wait,", "you delay…"].map((w, i) => (
            <Rise
              key={w}
              at={42 + i * 7}
              style={{
                fontFamily: serif,
                fontStyle: "italic",
                fontWeight: i === 2 ? 700 : 400,
                fontSize: 150,
                lineHeight: 1.0,
                color: i === 2 ? colors.amber : colors.ivory,
                opacity: i === 2 ? 1 : 0.8,
                marginLeft: i * 70,
              }}
            >
              {w}
            </Rise>
          ))}
        </div>
      </Group>

      {/* Phrase C — IT NEVER COMES BACK */}
      <Group start={78} end={118}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Word at={80} from="left" style={{ fontFamily: sans, fontWeight: 700, fontSize: 60, letterSpacing: 30, color: colors.muted }}>
            AND IT
          </Word>
          <Word at={84} from="right" style={{ fontFamily: display, fontSize: 300, lineHeight: 0.88, color: colors.ivory }}>
            NEVER
          </Word>
          <Word at={89} from="left" style={{ fontFamily: display, fontSize: 300, lineHeight: 0.88, color: colors.ivory }}>
            COMES
          </Word>
          <Word
            at={95}
            from="down"
            distance={300}
            style={{
              fontFamily: display,
              fontSize: 380,
              lineHeight: 0.88,
              backgroundImage: `linear-gradient(180deg, ${colors.gold1}, ${colors.amber} 50%, ${colors.ember})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            BACK
          </Word>
        </div>
      </Group>
    </AbsoluteFill>
  );
};
