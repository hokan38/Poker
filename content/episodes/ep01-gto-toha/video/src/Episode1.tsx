import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { C, feltBackground, FONT, GRAD, glow } from "./theme";
import { Backdrop } from "./components/Backdrop";
import { SCENES } from "./scenes";
import manifest from "./manifest.json";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// 生きた背景の上でコンテンツをクロスフェード（黒幕なし＝背景が透けて滑らかに繋がる）。
const SceneBox: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: EASE });
  const exit = interpolate(frame, [duration - 16, duration], [1, 0], { extrapolateLeft: "clamp", easing: EASE });
  const opacity = enter * exit;
  const y = (1 - enter) * 26 - (1 - exit) * 20;
  const scale = 0.985 + 0.015 * enter - 0.02 * (1 - exit);
  const blurAmt = (1 - enter) * 9 + (1 - exit) * 7;
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
      <div style={{ position: "absolute", left: 46, bottom: 40, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: GRAD.gold, boxShadow: glow("rgba(232,193,90,0.5)", 14) }} />
        <span style={{ color: C.gold, fontWeight: 800, fontSize: 28, letterSpacing: "0.05em", opacity: 0.92 }}>ポーカー GTO 解説 ｜ Ep.1</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", background: GRAD.gold, boxShadow: glow("rgba(232,193,90,0.6)", 12) }} />
      </div>
    </>
  );
};

export const Episode1: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: feltBackground, fontFamily: FONT }}>
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
