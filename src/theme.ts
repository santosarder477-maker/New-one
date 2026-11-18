import { Easing } from "remotion";
export { display, serif, sans } from "./fonts";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 15 * FPS; // 450 frames

// Scene timing (frames). Scenes overlap slightly so transitions blend.
export const SCENES = {
  hook: { from: 0, duration: 96 }, // 0–3.2 s
  kinetic: { from: 84, duration: 132 }, // 2.8–7.2 s
  progress: { from: 204, duration: 156 }, // 6.8–12.0 s
  close: { from: 354, duration: 96 }, // 11.8–15 s
};

// Teal-and-amber cinematic grade.
export const colors = {
  bgDeep: "#05070b",
  bgMid: "#0b1520",
  teal: "#1d4b5a",
  ivory: "#f4efe6",
  muted: "#8a97a3",
  amber: "#f2a541",
  ember: "#e2552e",
  gold1: "#f8e3b0",
  gold2: "#d9a441",
};

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-ish out
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};
