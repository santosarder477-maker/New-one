import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../anim";
import { ease } from "../theme";

/**
 * Wraps a scene with a "push-through" transition: the scene arrives from
 * slightly behind the camera (scale down + de-blur) and leaves by rushing
 * past it (scale up + blur + fade). Overlapping scenes cross-blend.
 */
export const SceneShell: React.FC<{
  duration: number;
  enter?: number;
  exit?: number;
  children: React.ReactNode;
}> = ({ duration, enter = 12, exit = 12, children }) => {
  const f = useCurrentFrame();
  const inP = enter > 0 ? interpolate(f, [0, enter], [0, 1], { ...clamp, easing: ease.out }) : 1;
  const outP = exit > 0 ? interpolate(f, [duration - exit, duration], [0, 1], { ...clamp, easing: ease.inOut }) : 0;
  const scale = interpolate(inP, [0, 1], [0.86, 1]) * interpolate(outP, [0, 1], [1, 1.35]);
  const blur = (1 - inP) * 14 + outP * 18;
  const opacity = inP * (1 - outP);
  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
