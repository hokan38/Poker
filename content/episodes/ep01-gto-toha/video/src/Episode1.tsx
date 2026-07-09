import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { bg, C, FONT, GRAD } from "./theme";
import { LATIN, useFonts } from "./fonts";
import { Backdrop } from "./components/Backdrop";
import { Subtitles } from "./components/ui";
import { SCENES } from "./scenes";
import manifest from "./manifest.json";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const BGM_VOL = 0.3; // ナレーションの下に敷くが、はっきり聞こえる音量

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
        <span style={{ fontFamily: LATIN, color: C.inkSoft, fontWeight: 600, fontSize: 27, letterSpacing: "0.28em" }}>POKER GTO</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", background: GRAD.gold }} />
      </div>
    </>
  );
};

export const Episode1: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: bg, fontFamily: FONT }}>
      <Backdrop />
      {/* BGM：全編ループ＋フェードイン/アウト。ナレーションの下に控えめに */}
      <Audio
        src={staticFile("bgm/bgm.mp3")}
        loop
        volume={(f) =>
          interpolate(
            f,
            [0, 45, manifest.totalFrames - 75, manifest.totalFrames],
            [0, BGM_VOL, BGM_VOL, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
      />
      <Series>
        {manifest.scenes.map((s) => {
          const Scene = SCENES[s.id];
          return (
            <Series.Sequence key={s.id} durationInFrames={s.durationInFrames}>
              <SceneBox duration={s.durationInFrames}>{Scene ? <Scene dur={s.durationInFrames} beats={(s as { beats?: Record<string, number> }).beats} /> : null}</SceneBox>
              <Subtitles captions={(s as { captions?: { t: string; from: number; to: number }[] }).captions} />
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
