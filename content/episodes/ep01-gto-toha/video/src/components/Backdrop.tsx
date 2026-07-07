import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

// 動くグロー塊（ラジアルグラデなのでフィルタ不要＝軽量）
const Blob: React.FC<{ x: number; y: number; r: number; color: string; ax: number; ay: number; sp: number; phase: number }> = ({
  x, y, r, color, ax, ay, sp, phase,
}) => {
  const frame = useCurrentFrame();
  const t = frame * sp + phase;
  const dx = Math.sin(t) * ax;
  const dy = Math.cos(t * 0.8) * ay;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: r, height: r,
      transform: `translate(${dx}px, ${dy}px) translate(-50%,-50%)`,
      background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
      pointerEvents: "none",
    }} />
  );
};

const SUITS = ["♠", "♥", "♦", "♣"];
// 漂うスートのパーティクル（薄く、上へゆっくり流れる）
const Particle: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const suit = SUITS[i % 4];
  const x = (i * 137.5) % 100;
  const size = 26 + ((i * 29) % 40);
  const speed = 0.18 + ((i * 7) % 10) / 40;
  const baseY = (i * 53) % 100;
  const yPct = ((baseY - frame * speed * 0.05) % 120 + 120) % 120;
  const y = (yPct / 100) * height - height * 0.1;
  const rot = frame * (0.12 + (i % 3) * 0.05) + i * 40;
  const red = suit === "♥" || suit === "♦";
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: y, fontSize: size,
      color: red ? "rgba(216,67,63,0.10)" : "rgba(255,255,255,0.06)",
      transform: `rotate(${rot}deg)`, pointerEvents: "none", userSelect: "none",
    }}>{suit}</div>
  );
};

export const Backdrop: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* グロー塊 */}
      <Blob x={22} y={18} r={1100} color="rgba(63,191,127,0.16)" ax={60} ay={40} sp={0.010} phase={0} />
      <Blob x={82} y={30} r={950} color="rgba(232,193,90,0.12)" ax={70} ay={50} sp={0.008} phase={2} />
      <Blob x={60} y={92} r={1200} color="rgba(47,120,90,0.18)" ax={80} ay={30} sp={0.006} phase={4} />
      {/* パーティクル */}
      {Array.from({ length: 16 }).map((_, i) => <Particle key={i} i={i} />)}
      {/* ヴィネット */}
      <AbsoluteFill style={{
        background: "radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(0,0,0,0.42) 100%)",
        pointerEvents: "none",
      }} />
      {/* 上部の淡い光 */}
      <div style={{
        position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 1600, height: 500, background: `radial-gradient(ellipse, rgba(232,193,90,0.10), transparent 70%)`,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
