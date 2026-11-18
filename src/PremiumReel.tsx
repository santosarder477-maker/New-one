import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Background, ColorGrade, Dust, FilmGrain, LightLeak, Vignette } from "./components/Atmosphere";
import { Camera } from "./components/Camera";
import { SceneShell } from "./components/SceneShell";
import { Close } from "./scenes/Close";
import { Hook } from "./scenes/Hook";
import { Kinetic } from "./scenes/Kinetic";
import { Progress } from "./scenes/Progress";
import { SCENES } from "./theme";

export const PremiumReel: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  const { hook, kinetic, progress, close } = SCENES;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <Background />
        <Dust />
        <Camera impacts={[0, 15, 28, close.from + 12]}>
          <Sequence from={hook.from} durationInFrames={hook.duration}>
            <SceneShell duration={hook.duration} enter={0}>
              <Hook />
            </SceneShell>
          </Sequence>
          <Sequence from={kinetic.from} durationInFrames={kinetic.duration}>
            <SceneShell duration={kinetic.duration}>
              <Kinetic />
            </SceneShell>
          </Sequence>
          <Sequence from={progress.from} durationInFrames={progress.duration}>
            <SceneShell duration={progress.duration}>
              <Progress />
            </SceneShell>
          </Sequence>
          <Sequence from={close.from} durationInFrames={close.duration}>
            <SceneShell duration={close.duration} exit={0}>
              <Close />
            </SceneShell>
          </Sequence>
        </Camera>
        <LightLeak at={90} />
        <LightLeak at={210} />
        <LightLeak at={360} strength={0.7} />
        <ColorGrade />
        <Vignette />
        <FilmGrain />
      </AbsoluteFill>
      <Audio src={staticFile("soundtrack.wav")} />
    </AbsoluteFill>
  );
};
