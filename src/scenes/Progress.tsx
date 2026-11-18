import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, prog } from "../anim";
import { colors, display, ease, sans, serif } from "../theme";

const R = 330;
const CIRC = 2 * Math.PI * R;
const pad = (n: number) => String(n).padStart(2, "0");

const Bar: React.FC<{ label: string; value: number; at: number; override?: number }> = ({ label, value, at, override }) => {
  const f = useCurrentFrame();
  const appear = prog(f, at, 14);
  // `override` lets the day bar stay in sync with the ring countdown.
  const fill = override ?? prog(f, at + 4, 46, ease.inOut) * value;
  return (
    <div
      style={{
        width: 820,
        opacity: appear,
        transform: `translateX(${(1 - appear) * -60}px)`,
        marginBottom: 46,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 32,
          letterSpacing: 8,
          color: colors.muted,
          marginBottom: 16,
        }}
      >
        <span>{label}</span>
        <span style={{ color: colors.ivory, fontVariantNumeric: "tabular-nums" }}>{Math.round(fill)}% GONE</span>
      </div>
      <div style={{ height: 10, borderRadius: 10, background: "rgba(244,239,230,0.10)", overflow: "hidden" }}>
        <div
          style={{
            width: `${fill}%`,
            height: "100%",
            borderRadius: 10,
            background: `linear-gradient(90deg, ${colors.amber}, ${colors.ember})`,
            boxShadow: `0 0 24px ${colors.ember}`,
          }}
        />
      </div>
    </div>
  );
};

/** 7–12 s: depleting time ring, countdown and progress bars. */
export const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const deplete = prog(f, 12, 128, ease.inOut); // 0 → 1
  const remaining = interpolate(deplete, [0, 1], [1, 0.12]);
  const secondsLeft = Math.round(remaining * 86400);
  const hh = Math.floor(secondsLeft / 3600);
  const mm = Math.floor((secondsLeft % 3600) / 60);
  const ss = secondsLeft % 60;
  const ringIn = prog(f, 0, 22);
  const headAngle = remaining * 360 - 90;
  const headX = Math.cos((headAngle * Math.PI) / 180) * R;
  const headY = Math.sin((headAngle * Math.PI) / 180) * R;
  const pulse = 0.75 + 0.25 * Math.sin(f / 3);
  const warn = interpolate(remaining, [0.15, 0.4], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {/* Heading */}
      <div style={{ position: "absolute", top: 230, textAlign: "center" }}>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: 34,
            marginRight: -34,
            color: colors.amber,
            opacity: prog(f, 4, 14),
          }}
        >
          TODAY
        </div>
        <div
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 70,
            color: colors.ivory,
            opacity: 0.85 * prog(f, 10, 16),
            transform: `translateY(${(1 - prog(f, 10, 16)) * 30}px)`,
            marginTop: 10,
          }}
        >
          is already slipping away
        </div>
      </div>

      {/* Ring */}
      <svg
        width={900}
        height={900}
        viewBox="-450 -450 900 900"
        style={{ position: "absolute", top: 440, transform: `scale(${0.85 + 0.15 * ringIn}) rotate(${(1 - ringIn) * -40}deg)`, opacity: ringIn }}
      >
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.gold1} />
            <stop offset="55%" stopColor={colors.amber} />
            <stop offset="100%" stopColor={colors.ember} />
          </linearGradient>
        </defs>
        {new Array(60).fill(0).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const passed = i / 60 > remaining;
          const long = i % 5 === 0;
          return (
            <line
              key={i}
              x1={Math.sin(a) * (R + 40)}
              y1={-Math.cos(a) * (R + 40)}
              x2={Math.sin(a) * (R + (long ? 70 : 55))}
              y2={-Math.cos(a) * (R + (long ? 70 : 55))}
              stroke={passed ? "rgba(244,239,230,0.12)" : long ? colors.amber : "rgba(244,239,230,0.45)"}
              strokeWidth={long ? 4 : 2}
            />
          );
        })}
        <circle r={R} fill="none" stroke="rgba(244,239,230,0.08)" strokeWidth={18} />
        <circle
          r={R}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={18}
          strokeLinecap="round"
          strokeDasharray={`${CIRC * remaining} ${CIRC}`}
          transform="rotate(-90)"
          style={{ filter: `drop-shadow(0 0 ${18 + warn * 20}px rgba(226,85,46,0.7))` }}
        />
        <circle cx={headX} cy={headY} r={16 * pulse + 6} fill={colors.ivory} opacity={0.95} />
        <circle cx={headX} cy={headY} r={46 * pulse} fill={colors.ember} opacity={0.25} />
      </svg>

      {/* Countdown inside ring */}
      <div
        style={{
          position: "absolute",
          top: 440 + 450 - 120,
          width: 900,
          textAlign: "center",
          opacity: prog(f, 8, 16),
        }}
      >
        <div
          style={{
            fontFamily: display,
            fontSize: 190,
            lineHeight: 1,
            letterSpacing: 6,
            color: warn > 0.5 ? colors.amber : colors.ivory,
            fontVariantNumeric: "tabular-nums",
            textShadow: `0 0 ${30 * warn}px rgba(226,85,46,0.6)`,
          }}
        >
          {pad(hh)}:{pad(mm)}:{pad(ss)}
        </div>
        <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 30, letterSpacing: 14, color: colors.muted, marginTop: 6 }}>
          LEFT TODAY
        </div>
      </div>

      {/* Progress bars */}
      <div style={{ position: "absolute", top: 1350 }}>
        <Bar label="THIS DAY" value={88} at={30} override={(1 - remaining) * 100} />
        <Bar label="THIS WEEK" value={64} at={40} />
        <Bar label="THIS YEAR" value={91} at={50} />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 110,
          fontFamily: serif,
          fontStyle: "italic",
          fontSize: 56,
          color: colors.ivory,
          opacity: 0.8 * prog(f, 108, 18),
          transform: `translateY(${(1 - prog(f, 108, 18)) * 24}px)`,
        }}
      >
        The clock never pauses.
      </div>
    </AbsoluteFill>
  );
};
