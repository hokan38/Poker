import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";

/** frame基準でフェード＋上スライド表示するラッパー。 */
export const Reveal: React.FC<{
  delay?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, y = 28, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.6 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const translateY = interpolate(s, [0, 1], [y, 0]);
  return <div style={{ opacity, transform: `translateY(${translateY}px)`, ...style }}>{children}</div>;
};

export const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <Reveal delay={delay}>
    <div style={{ color: C.gold, fontWeight: 800, letterSpacing: "0.16em", fontSize: 34, fontFamily: FONT }}>
      {children}
    </div>
  </Reveal>
);

/** ポップイン強調スタンプ。 */
export const Stamp: React.FC<{ delay?: number; color?: string; children: React.ReactNode; fontSize?: number }> = ({
  delay = 0, color = C.gold, children, fontSize = 64,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12, mass: 0.8, stiffness: 140 } });
  const scale = interpolate(s, [0, 1], [0.4, 1]);
  const opacity = interpolate(frame - delay, [0, 6], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <div style={{
      display: "inline-block", transform: `scale(${scale})`, opacity,
      color: "#04120c", background: color, fontWeight: 900, fontSize, fontFamily: FONT,
      padding: "14px 40px", borderRadius: 18, boxShadow: "0 14px 34px rgba(0,0,0,0.4)",
    }}>
      {children}
    </div>
  );
};

/** 3等分ドーナツ（じゃんけんの均衡表現）。segments は色の配列。progressで手前から出現。 */
export const Donut: React.FC<{ size?: number; delay?: number; label?: string; colors: string[] }> = ({
  size = 340, delay = 0, label, colors,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const sweep = interpolate(s, [0, 1], [0, 360]);
  const seg = 360 / colors.length;
  const stops = colors
    .map((col, i) => {
      const a = i * seg, b = (i + 1) * seg;
      return `${col} ${a}deg ${b}deg`;
    })
    .join(", ");
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `conic-gradient(${stops})`,
        WebkitMaskImage: `conic-gradient(#000 ${sweep}deg, transparent ${sweep}deg)`,
        maskImage: `conic-gradient(#000 ${sweep}deg, transparent ${sweep}deg)`,
        boxShadow: "0 0 0 10px rgba(255,255,255,0.05), 0 20px 50px rgba(0,0,0,0.4)",
      }} />
      <div style={{
        position: "absolute", inset: "26%", borderRadius: "50%", background: C.felt,
        display: "grid", placeItems: "center", textAlign: "center", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
        color: C.ink, fontWeight: 800, fontSize: size * 0.1, fontFamily: FONT, opacity: interpolate(s, [0.6, 1], [0, 1], { extrapolateLeft: "clamp" }),
      }}>
        {label}
      </div>
    </div>
  );
};

/** 横バー（割合表示）。value 0..1。 */
export const Bar: React.FC<{
  label: string; value: number; color: string; delay?: number; suffix?: string; width?: number;
}> = ({ label, value, color, delay = 0, suffix = "", width = 720 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const w = interpolate(s, [0, 1], [0, value]) * width;
  const pct = Math.round(interpolate(s, [0, 1], [0, value]) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: FONT, opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateLeft: "clamp" }) }}>
      <div style={{ width: 300, fontSize: 34, color: C.ink, textAlign: "right", fontWeight: 700 }}>{label}</div>
      <div style={{ width, height: 46, background: "rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.line}` }}>
        <div style={{ width: w, height: "100%", background: color, borderRadius: 10 }} />
      </div>
      <div style={{ width: 160, fontSize: 36, fontWeight: 800, color }}>{pct}{suffix || "%"}</div>
    </div>
  );
};

/** カジノチップの簡易表現（スタック）。 */
export const ChipStack: React.FC<{ n?: number; delay?: number; color?: string; label?: string }> = ({
  n = 5, delay = 0, color = C.gold, label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative", width: 120, height: 60 + n * 16, fontFamily: FONT }}>
      {Array.from({ length: n }).map((_, i) => {
        const s = spring({ frame: frame - delay - i * 4, fps, config: { damping: 14, stiffness: 120 } });
        const op = interpolate(s, [0, 1], [0, 1]);
        const ty = interpolate(s, [0, 1], [-40, 0]);
        return (
          <div key={i} style={{
            position: "absolute", bottom: i * 16, left: 0, width: 120, height: 34, borderRadius: "50%",
            background: color, border: "4px dashed rgba(255,255,255,0.55)", boxShadow: "0 6px 12px rgba(0,0,0,0.35)",
            opacity: op, transform: `translateY(${ty}px)`,
          }} />
        );
      })}
      {label ? <div style={{ position: "absolute", bottom: -46, width: 120, textAlign: "center", color: C.ink, fontWeight: 800, fontSize: 30 }}>{label}</div> : null}
    </div>
  );
};

export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; accent?: string }> = ({
  children, style, accent = C.line,
}) => (
  <div style={{
    background: C.panel, border: `1px solid ${accent}`, borderRadius: 22, padding: "34px 40px", fontFamily: FONT,
    ...style,
  }}>
    {children}
  </div>
);
