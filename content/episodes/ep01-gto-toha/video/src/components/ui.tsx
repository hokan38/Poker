import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, GRAD, glow } from "../theme";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** フェード＋上スライド＋ブラー＋スケールで洗練された登場。 */
export const Reveal: React.FC<{
  delay?: number; y?: number; blur?: number; scale?: number;
  children: React.ReactNode; style?: React.CSSProperties;
}> = ({ delay = 0, y = 30, blur = 10, scale = 0.98, children, style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const b = (1 - t) * blur;
  return (
    <div style={{
      opacity: t,
      transform: `translateY(${(1 - t) * y}px) scale(${scale + (1 - scale) * t})`,
      filter: b > 0.15 ? `blur(${b}px)` : "none",
      ...style,
    }}>{children}</div>
  );
};

/** グラデーション文字（背景クリップ）。shine=true で光沢が流れる。 */
export const GradientText: React.FC<{
  children: React.ReactNode; gradient?: string; fontSize?: number; weight?: number;
  delay?: number; shine?: boolean; glowColor?: string;
}> = ({ children, gradient = GRAD.gold, fontSize = 100, weight = 900, delay = 0, shine = true, glowColor }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const pos = shine ? interpolate((frame - delay) % 150, [0, 150], [0, 200]) : 0;
  return (
    <span style={{
      display: "inline-block", fontFamily: FONT, fontWeight: weight, fontSize, lineHeight: 1.1,
      backgroundImage: gradient, backgroundSize: shine ? "200% 100%" : "100% 100%",
      backgroundPosition: `${pos}% 0`,
      WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
      filter: glowColor ? `drop-shadow(0 0 24px ${glowColor})` : "none",
      opacity: t, transform: `translateY(${(1 - t) * 22}px)`,
    }}>{children}</span>
  );
};

/** 斜めの光が一度だけ横切るスイープ（タイトル用）。 */
export const LightSweep: React.FC<{ delay?: number; duration?: number; children: React.ReactNode }> = ({
  delay = 0, duration = 40, children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, duration], [-30, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <div style={{ position: "relative", display: "inline-block", overflow: "hidden" }}>
      {children}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: `${p}%`, width: "22%",
        background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.55), transparent)",
        transform: "skewX(-18deg)", pointerEvents: "none",
        opacity: frame - delay >= 0 && frame - delay <= duration ? 1 : 0,
      }} />
    </div>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <Reveal delay={delay} y={18} blur={6}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: FONT }}>
      <span style={{ width: 44, height: 6, borderRadius: 3, background: GRAD.gold, boxShadow: glow("rgba(232,193,90,0.6)", 14) }} />
      <span style={{ color: C.gold, fontWeight: 800, letterSpacing: "0.16em", fontSize: 34 }}>{children}</span>
    </div>
  </Reveal>
);

/** ポップイン＋グロー＋わずかな回転で決めるスタンプ。 */
export const Stamp: React.FC<{ delay?: number; color?: string; children: React.ReactNode; fontSize?: number; gradient?: string }> = ({
  delay = 0, color = C.gold, children, fontSize = 64, gradient = GRAD.gold,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 11, mass: 0.9, stiffness: 150 } });
  const scale = interpolate(s, [0, 1], [0.4, 1]);
  const rot = interpolate(s, [0, 1], [-4, 0]);
  const opacity = interpolate(frame - delay, [0, 6], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const pulse = 0.5 + 0.5 * Math.sin((frame - delay) / 16);
  return (
    <div style={{
      display: "inline-block", transform: `scale(${scale}) rotate(${rot}deg)`, opacity,
      color: "#05140d", backgroundImage: gradient, fontWeight: 900, fontSize, fontFamily: FONT,
      padding: "16px 42px", borderRadius: 18,
      boxShadow: `0 16px 38px rgba(0,0,0,0.45), ${glow(`rgba(232,193,90,${0.25 + pulse * 0.35})`, 30)}`,
    }}>
      {children}
    </div>
  );
};

/** 3等分ドーナツ＋外周グロー。 */
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
      <div style={{ position: "absolute", inset: -14, borderRadius: "50%", background: "radial-gradient(circle, rgba(63,191,127,0.25), transparent 70%)", opacity: interpolate(s, [0.5, 1], [0, 1], { extrapolateLeft: "clamp" }) }} />
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `conic-gradient(${stops})`,
        WebkitMaskImage: `conic-gradient(#000 ${sweep}deg, transparent ${sweep}deg)`,
        maskImage: `conic-gradient(#000 ${sweep}deg, transparent ${sweep}deg)`,
        boxShadow: "0 0 0 10px rgba(255,255,255,0.05), 0 24px 60px rgba(0,0,0,0.45)",
      }} />
      <div style={{
        position: "absolute", inset: "27%", borderRadius: "50%", background: C.felt,
        display: "grid", placeItems: "center", textAlign: "center", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
        color: C.ink, fontWeight: 800, fontSize: size * 0.1, fontFamily: FONT,
        opacity: interpolate(s, [0.6, 1], [0, 1], { extrapolateLeft: "clamp" }),
      }}>{label}</div>
    </div>
  );
};

/** 割合バー（イージング＋数値カウントアップ＋光沢）。 */
export const Bar: React.FC<{
  label: string; value: number; color: string; gradient?: string; delay?: number; suffix?: string; width?: number;
}> = ({ label, value, color, gradient, delay = 0, suffix = "%", width = 720 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const w = t * value * width;
  const pct = Math.round(t * value * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: FONT, opacity: interpolate(frame - delay, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <div style={{ width: 300, fontSize: 34, color: C.ink, textAlign: "right", fontWeight: 700 }}>{label}</div>
      <div style={{ width, height: 46, background: "rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.line}` }}>
        <div style={{ width: w, height: "100%", background: gradient || color, borderRadius: 12, boxShadow: glow(color, 18) }} />
      </div>
      <div style={{ width: 170, fontSize: 36, fontWeight: 800, color }}>{pct}{suffix}</div>
    </div>
  );
};

/** チップスタック（光沢つき）。 */
export const ChipStack: React.FC<{ n?: number; delay?: number; color?: string; label?: string }> = ({
  n = 5, delay = 0, color = C.gold, label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative", width: 120, height: 60 + n * 16, fontFamily: FONT }}>
      {Array.from({ length: n }).map((_, i) => {
        const s = spring({ frame: frame - delay - i * 4, fps, config: { damping: 13, stiffness: 130 } });
        const op = interpolate(s, [0, 1], [0, 1]);
        const ty = interpolate(s, [0, 1], [-44, 0]);
        return (
          <div key={i} style={{
            position: "absolute", bottom: i * 16, left: 0, width: 120, height: 34, borderRadius: "50%",
            background: `radial-gradient(circle at 40% 30%, #fff6, transparent 45%), ${color}`,
            border: "4px dashed rgba(255,255,255,0.6)", boxShadow: "0 6px 14px rgba(0,0,0,0.4)",
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
    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    border: `1px solid ${accent}`, borderRadius: 22, padding: "34px 40px", fontFamily: FONT,
    backdropFilter: "blur(4px)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
    ...style,
  }}>
    {children}
  </div>
);
