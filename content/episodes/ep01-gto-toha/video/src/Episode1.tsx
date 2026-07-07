import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { C, feltBackground, FONT } from "./theme";
import { SCENES } from "./scenes";
import manifest from "./manifest.json";

// シーン境界をなめらかにする短いフェード（フェルト色へ）。
const SceneBox: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 7], [1, 0], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [duration - 7, duration], [0, 1], { extrapolateLeft: "clamp" });
  const cover = Math.max(fadeIn, fadeOut);
  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ background: C.feltEdge, opacity: cover, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const Episode1: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: feltBackground, fontFamily: FONT }}>
      <Series>
        {manifest.scenes.map((s) => {
          const Scene = SCENES[s.id];
          return (
            <Series.Sequence key={s.id} durationInFrames={s.durationInFrames}>
              <SceneBox duration={s.durationInFrames}>
                {Scene ? <Scene /> : null}
              </SceneBox>
              <Sequence from={s.leadInFrames}>
                <Audio src={staticFile("narration/" + s.file)} />
              </Sequence>
            </Series.Sequence>
          );
        })}
      </Series>

      {/* 常時表示のブランドフッター */}
      <div style={{ position: "absolute", left: 46, bottom: 34, color: C.gold, fontWeight: 800, fontSize: 30, letterSpacing: "0.05em", opacity: 0.9 }}>
        ポーカー GTO 解説　｜　Ep.1
      </div>
    </AbsoluteFill>
  );
};
