// Generates an ORIGINAL procedural soundtrack (no samples, no third-party audio).
// Output: public/soundtrack.wav  (15 s, mono, 16-bit PCM)
// Run with: node scripts/generate-audio.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 32000;
const DURATION = 15;
const N = SR * DURATION;
const out = new Float32Array(N);

// Deterministic pseudo-random noise so the file is identical on every run.
let seed = 1337;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296 - 0.5;
};

const add = (startSec, durSec, fn) => {
  const s0 = Math.floor(startSec * SR);
  const len = Math.floor(durSec * SR);
  for (let i = 0; i < len && s0 + i < N; i++) {
    out[s0 + i] += fn(i / SR, i);
  }
};

// 1) Cinematic drone: two detuned low sines + fifth, slowly swelling.
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const swell = 0.55 + 0.45 * Math.min(1, t / 12);
  const fadeOut = t > 14.2 ? Math.max(0, (15 - t) / 0.8) : 1;
  const d =
    Math.sin(2 * Math.PI * 55 * t) * 0.16 +
    Math.sin(2 * Math.PI * 55.4 * t) * 0.12 +
    Math.sin(2 * Math.PI * 82.5 * t) * 0.06 * Math.min(1, t / 7);
  out[i] += d * swell * fadeOut;
}

// 2) Impact hit: pitched-down sine thump + short noise burst.
const impact = (at, gain) =>
  add(at, 1.6, (t) => {
    const f = 38 + 90 * Math.exp(-t * 18);
    const body = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 3.2);
    const crack = rand() * Math.exp(-t * 40) * 0.6;
    return (body + crack) * gain;
  });

// 3) Clock tick: very short filtered click with a woody resonance.
const tick = (at, gain, pitch = 2600) =>
  add(at, 0.06, (t) => {
    const env = Math.exp(-t * 140);
    return (Math.sin(2 * Math.PI * pitch * t) * 0.6 + rand() * 0.5) * env * gain;
  });

// 4) Whoosh: noise with a rising-then-falling envelope, simple one-pole low-pass sweep.
const whoosh = (at, dur, gain) => {
  let lp = 0;
  add(at - dur * 0.7, dur, (t) => {
    const p = t / dur;
    const env = Math.sin(Math.PI * p) ** 2;
    const cutoff = 0.02 + 0.25 * Math.sin(Math.PI * p);
    lp += cutoff * (rand() - lp);
    return lp * env * gain * 4;
  });
};

// 5) Shimmer pad for the finale: stacked major-ish harmonics with slow attack.
const pad = (at, dur, gain) =>
  add(at, dur, (t) => {
    const atk = Math.min(1, t / 0.9);
    const rel = Math.min(1, (dur - t) / 1.0);
    const env = Math.max(0, Math.min(atk, rel));
    const v =
      Math.sin(2 * Math.PI * 220 * t) * 0.35 +
      Math.sin(2 * Math.PI * 277.18 * t) * 0.25 +
      Math.sin(2 * Math.PI * 329.63 * t) * 0.25 +
      Math.sin(2 * Math.PI * 440 * t + Math.sin(2 * Math.PI * 5 * t) * 0.3) * 0.15;
    return v * env * gain;
  });

// ---- Timeline (seconds) -------------------------------------------------
impact(0.0, 0.9); // "STOP"
impact(0.5, 0.45); // "WASTING"
impact(1.0, 0.55); // "TIME"
for (let s = 1.5; s < 3; s += 0.5) tick(s, 0.35);

whoosh(3.0, 0.9, 0.5);
for (let s = 3.5; s < 7; s += 0.5) tick(s, 0.3, s % 1 === 0 ? 2600 : 2100);

whoosh(7.0, 0.9, 0.5);
// Ticks accelerate during the motion-graphics section (tension build).
let tt = 7.2;
let gap = 0.5;
while (tt < 11.8) {
  tick(tt, 0.32, 2400);
  tt += gap;
  gap = Math.max(0.12, gap * 0.9);
}
whoosh(12.0, 1.1, 0.6);
impact(12.0, 1.0); // "MAKE TODAY COUNT"
pad(12.0, 3.0, 0.16);

// ---- Normalise & write WAV ---------------------------------------------
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[i]));
const norm = peak > 0 ? 0.89 / peak : 1;

const buf = Buffer.alloc(44 + N * 2);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 2, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); // PCM
buf.writeUInt16LE(1, 22); // mono
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 2, 28);
buf.writeUInt16LE(2, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) {
  const v = Math.max(-1, Math.min(1, out[i] * norm));
  buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
}

const here = dirname(fileURLToPath(import.meta.url));
const target = join(here, "..", "public", "soundtrack.wav");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, buf);
console.log(`Wrote ${target} (${(buf.length / 1024).toFixed(0)} KB)`);
