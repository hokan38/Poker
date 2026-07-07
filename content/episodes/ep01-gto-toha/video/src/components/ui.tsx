import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, GRAD } from "../theme";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const Reveal: React.FC<{
  delay?: number; y?: number; blur?: number; scale?: number;
  children: React.ReactNode; style?: React.CSSProperties;
}> = ({ delay = 0, y = 26, blur = 8, scale = 0.99, children, style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const b = (1 - t) * blur;
  return (
    <div style={{
      opacity: t, transform: `translateY(${(1 - t) * y}px) scale(${scale + (1 - scale) * t})`,
      filter: b > 0.15 ? `blur(${b}px)` : "none", ...style,
    }}>{children}</div>
  );
};

/** グラデーション文字。金・銀・白の金属質。 */
export const GradientText: React.FC<{
  children: React.ReactNode; gradient?: string; fontSize?: number; weight?: number;
  delay?: number; shine?: boolean; ls?: string;
}> = ({ children, gradient = GRAD.ink, fontSize = 100, weight = 700, delay = 0, shine = false, ls = "0.01em" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const pos = shine ? interpolate((frame - delay) % 180, [0, 180], [0, 200]) : 0;
  return (
    <span style={{
      display: "inline-block", fontFamily: FONT, fontWeight: weight, fontSize, lineHeight: 1.12, letterSpacing: ls,
      backgroundImage: gradient, backgroundSize: shine ? "200% 100%" : "100% 100%", backgroundPosition: `${pos}% 0`,
      WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
      opacity: t, transform: `translateY(${(1 - t) * 20}px)`,
    }}>{children}</span>
  );
};

/** 白い光が一度だけ横切る（控えめ）。 */
export const LightSweep: React.FC<{ delay?: number; duration?: number; children: React.ReactNode }> = ({
  delay = 0, duration = 46, children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, duration], [-30, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const on = frame - delay >= 0 && frame - delay <= duration;
  return (
    <div style={{ position: "relative", display: "inline-block", overflow: "hidden" }}>
      {children}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: `${p}%`, width: "20%",
        background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.4), transparent)",
        transform: "skewX(-18deg)", pointerEvents: "none", opacity: on ? 1 : 0,
      }} />
    </div>
  );
};

/** 細いゴールドの罫 + 字間を空けたラベル（エディトリアルな見出し）。 */
export const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - delay, [0, 24], [0, 54], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <Reveal delay={delay} y={14} blur={4}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: FONT }}>
        <span style={{ width: w, height: 1.5, background: C.gold }} />
        <span style={{ color: C.gold, fontWeight: 600, letterSpacing: "0.34em", fontSize: 27 }}>{children}</span>
      </div>
    </Reveal>
  );
};

/** 細いゴールド下線が引かれる上品な強調。 */
export const Stamp: React.FC<{ delay?: number; children: React.ReactNode; fontSize?: number; color?: string }> = ({
  delay = 0, children, fontSize = 56, color = C.ink,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.7 } });
  const opacity = interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const uw = interpolate(frame - delay, [8, 34], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <div style={{ display: "inline-block", opacity, transform: `translateY(${(1 - s) * 14}px)`, fontFamily: FONT }}>
      <div style={{ fontSize, fontWeight: 700, color, letterSpacing: "0.04em", padding: "2px 6px 12px" }}>{children}</div>
      <div style={{ height: 2, width: `${uw}%`, background: C.gold, marginTop: -6 }} />
    </div>
  );
};

/** 3等分ドーナツ（白・金・銀のモノトーン）。 */
export const Donut: React.FC<{ size?: number; delay?: number; label?: string; colors: string[] }> = ({
  size = 340, delay = 0, label, colors,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const sweep = interpolate(s, [0, 1], [0, 360]);
  const seg = 360 / colors.length;
  const stops = colors.map((col, i) => `${col} ${i * seg}deg ${(i + 1) * seg}deg`).join(", ");
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{
        width: size, height: size, borderRadius: "50%", background: `conic-gradient(${stops})`,
        WebkitMaskImage: `conic-gradient(#000 ${sweep}deg, transparent ${sweep}deg)`,
        maskImage: `conic-gradient(#000 ${sweep}deg, transparent ${sweep}deg)`,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.12), 0 24px 60px rgba(0,0,0,0.5)",
      }} />
      <div style={{
        position: "absolute", inset: "30%", borderRadius: "50%", background: C.bg,
        display: "grid", placeItems: "center", textAlign: "center", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
        color: C.ink, fontWeight: 600, fontSize: size * 0.095, fontFamily: FONT, letterSpacing: "0.04em",
        opacity: interpolate(s, [0.6, 1], [0, 1], { extrapolateLeft: "clamp" }),
      }}>{label}</div>
    </div>
  );
};

/** 細い割合バー（金・銀）＋数値カウントアップ。 */
export const Bar: React.FC<{
  label: string; value: number; gradient?: string; color?: string; delay?: number; suffix?: string; width?: number;
}> = ({ label, value, gradient = GRAD.gold, color = C.gold, delay = 0, suffix = "%", width = 620 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const w = t * value * width;
  const pct = Math.round(t * value * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, opacity: interpolate(frame - delay, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <div style={{ width: 300, fontSize: 32, color: C.inkSoft, textAlign: "right", fontWeight: 500 }}>{label}</div>
      <div style={{ width, height: 12, background: "rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ width: w, height: "100%", background: gradient, borderRadius: 8 }} />
      </div>
      <div style={{ width: 150, fontSize: 34, fontWeight: 700, color }}>{pct}{suffix}</div>
    </div>
  );
};

/** ポットのチップ（黒地＋ゴールドの縁）。 */
export const ChipStack: React.FC<{ n?: number; delay?: number; label?: string }> = ({
  n = 5, delay = 0, label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative", width: 116, height: 56 + n * 15, fontFamily: FONT }}>
      {Array.from({ length: n }).map((_, i) => {
        const s = spring({ frame: frame - delay - i * 4, fps, config: { damping: 14, stiffness: 130 } });
        const op = interpolate(s, [0, 1], [0, 1]);
        const ty = interpolate(s, [0, 1], [-42, 0]);
        return (
          <div key={i} style={{
            position: "absolute", bottom: i * 15, left: 0, width: 116, height: 32, borderRadius: "50%",
            background: "radial-gradient(circle at 42% 32%, #2a2a2c, #101012 70%)",
            border: `2px solid ${C.gold}`, boxShadow: "0 5px 12px rgba(0,0,0,0.5)",
            opacity: op, transform: `translateY(${ty}px)`,
          }} />
        );
      })}
      {label ? <div style={{ position: "absolute", bottom: -44, width: 116, textAlign: "center", color: C.inkSoft, fontWeight: 600, fontSize: 28 }}>{label}</div> : null}
    </div>
  );
};

export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; accent?: string }> = ({
  children, style, accent = C.line,
}) => (
  <div style={{
    background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
    border: `1px solid ${accent}`, borderRadius: 18, padding: "32px 38px", fontFamily: FONT,
    backdropFilter: "blur(3px)", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", ...style,
  }}>
    {children}
  </div>
);

/** 細い水平罫（区切り）。 */
export const Rule: React.FC<{ delay?: number; width?: number; color?: string }> = ({ delay = 0, width = 200, color = C.line }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - delay, [0, 26], [0, width], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return <div style={{ height: 1, width: w, background: color }} />;
};
