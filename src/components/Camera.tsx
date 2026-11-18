import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * Virtual camera: slow push-in, gentle handheld-style drift and optional
 * decaying impact shakes (frames given in absolute composition time).
 */
export const Camera: React.FC<{ children: React.ReactNode; impacts?: number[] }> = ({
  children,
  impacts = [],
}) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 450], [1.0, 1.07]);
  let shakeX = 0;
  let shakeY = 0;
  for (const at of impacts) {
    const d = frame - at;
    if (d >= 0 && d < 18) {
      const amp = 22 * Math.exp(-d / 4);
      shakeX += Math.sin(d * 2.7) * amp;
      shakeY += Math.cos(d * 3.1) * amp * 0.7;
    }
  }
  const driftX = Math.sin(frame / 55) * 9 + shakeX;
  const driftY = Math.cos(frame / 70) * 12 + shakeY;
  const rot = Math.sin(frame / 95) * 0.45;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${driftX}px, ${driftY}px) scale(${push}) rotate(${rot}deg)`,
        transformOrigin: "50% 50%",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
