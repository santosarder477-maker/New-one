import { interpolate } from "remotion";
import { ease } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Eased 0→1 progress between start and start+duration. */
export const prog = (frame: number, start: number, duration: number, easing = ease.out) =>
  interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing });

/** Approximate velocity of an eased progress curve (per frame), for motion blur. */
export const velocity = (frame: number, start: number, duration: number, easing = ease.out) =>
  prog(frame + 0.5, start, duration, easing) - prog(frame - 0.5, start, duration, easing);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export { clamp };
