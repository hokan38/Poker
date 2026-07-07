import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { bg, C, FONT, GRAD } from "./theme";
import { Backdrop } from "./components/Backdrop";
import { SCENES } from "./scenes";
import manifest from "./manifest.json";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// 生きた背景の上でコンテンツをクロスフェード（黒幕なし＝背景が透けて滑らかに繋がる）。
const SceneBox: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp", easing: EASE });
  const exit = interpolate(frame, [duration - 18, duration], [1, 0], { extrapolateLeft: "clamp", easing: EASE });
  const opacity = enter * exit;
  const y = (1 - enter) * 24 - (1 - exit) * 18;
  const scale = 0.99 + 0.01 * enter - 0.015 * (1 - exit);
  const blurAmt = (1 - enter) * 8 + (1 - exit) * 6;
  return (
    <AbsoluteFill style={{ opacity, transform: `translateY(${y}px) scale(${scale})`, filter: blurAmt > 0.15 ? `blur(${blurAmt}px)` : "none" }}>
      {children}
    </AbsoluteFill>
  );
};

const HUD: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, manifest.totalFrames], [0, 1]);
  return (
    <>
      <div style={{ position: "absolute", left: 60, bottom: 46, display: "flex", alignItems: "center", gap: 16, fontFamily: FONT }}>
        <span style={{ width: 26, height: 1.5, background: C.gold }} />
        <span style={{ color: C.inkSoft, fontWeight: 500, fontSize: 25, letterSpacing: "0.22em" }}>POKER GTO ｜ EP.1</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", background: GRAD.gold }} />
      </div>
    </>
  );
};

export const Episode1: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: bg, fontFamily: FONT }}>
      <Backdrop />
      <Series>
        {manifest.scenes.map((s) => {
          const Scene = SCENES[s.id];
          return (
            <Series.Sequence key={s.id} durationInFrames={s.durationInFrames}>
              <SceneBox duration={s.durationInFrames}>{Scene ? <Scene /> : null}</SceneBox>
              <Sequence from={s.leadInFrames}>
                <Audio src={staticFile("narration/" + s.file)} />
              </Sequence>
            </Series.Sequence>
          );
        })}
      </Series>
      <HUD />
    </AbsoluteFill>
  );
};
