import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// ごく淡い白のグロー（色は使わずモノトーンで奥行きだけ与える）
const Glow: React.FC<{ x: number; y: number; r: number; a: number; ax: number; sp: number; phase: number }> = ({
  x, y, r, a, ax, sp, phase,
}) => {
  const frame = useCurrentFrame();
  const t = frame * sp + phase;
  const dx = Math.sin(t) * ax;
  const dy = Math.cos(t * 0.8) * ax * 0.6;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: r, height: r,
      transform: `translate(${dx}px,${dy}px) translate(-50%,-50%)`,
      background: `radial-gradient(circle, rgba(255,255,255,${a}) 0%, transparent 68%)`,
      pointerEvents: "none",
    }} />
  );
};

const SUITS = ["♠", "♥", "♦", "♣"];
const Particle: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const suit = SUITS[i % 4];
  const x = (i * 137.5) % 100;
  const size = 22 + ((i * 29) % 34);
  const speed = 0.16 + ((i * 7) % 10) / 45;
  const baseY = (i * 53) % 100;
  const yPct = ((baseY - frame * speed * 0.05) % 120 + 120) % 120;
  const y = (yPct / 100) * height - height * 0.1;
  const rot = frame * (0.1 + (i % 3) * 0.04) + i * 40;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: y, fontSize: size,
      color: "rgba(255,255,255,0.035)", transform: `rotate(${rot}deg)`,
      pointerEvents: "none", userSelect: "none",
    }}>{suit}</div>
  );
};

// フィルムグレイン（静的・SVGノイズ）
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const Backdrop: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Glow x={28} y={22} r={1200} a={0.05} ax={50} sp={0.008} phase={0} />
      <Glow x={78} y={70} r={1000} a={0.035} ax={60} sp={0.006} phase={3} />
      {Array.from({ length: 14 }).map((_, i) => <Particle key={i} i={i} />)}
      {/* グレイン */}
      <AbsoluteFill style={{ backgroundImage: GRAIN, backgroundSize: "280px 280px", opacity: 0.05, mixBlendMode: "soft-light", pointerEvents: "none" }} />
      {/* ヴィネット */}
      <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 42%, transparent 52%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
