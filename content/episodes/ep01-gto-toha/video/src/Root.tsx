import React from "react";
import { Composition } from "remotion";
import { Episode1 } from "./Episode1";
import manifest from "./manifest.json";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Episode1"
      component={Episode1}
      durationInFrames={manifest.totalFrames}
      fps={manifest.fps}
      width={1920}
      height={1080}
    />
  );
};
