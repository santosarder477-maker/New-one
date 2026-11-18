import React, { useId } from "react";

/**
 * Cheap directional motion blur. Uses an SVG feGaussianBlur with independent
 * X/Y deviations, which CSS `filter: blur()` cannot do. Far lighter than
 * multi-sample motion blur, so it renders quickly on free Colab CPUs.
 */
export const MotionBlur: React.FC<{
  x?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x = 0, y = 0, children, style }) => {
  const rawId = useId();
  const id = `mb${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const bx = Math.max(0, Math.round(Math.abs(x) * 10) / 10);
  const by = Math.max(0, Math.round(Math.abs(y) * 10) / 10);
  const active = bx > 0.2 || by > 0.2;
  return (
    <div style={{ ...style, filter: active ? `url(#${id})` : undefined }}>
      {active ? (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={`${bx} ${by}`} />
          </filter>
        </svg>
      ) : null}
      {children}
    </div>
  );
};
