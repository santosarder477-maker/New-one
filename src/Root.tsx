import { Composition } from "remotion";
import { PremiumReel } from "./PremiumReel";
import { DURATION, FPS, HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PremiumReel"
      component={PremiumReel}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
