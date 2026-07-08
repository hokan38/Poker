import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { LATIN } from "../fonts";

export type Suit = "s" | "h" | "d" | "c";
export type CardT = { rank: string; suit: Suit };

const rankLabel = (r: string) => (r === "T" ? "10" : r);
export const parseCard = (code: string): CardT => ({
  rank: code.slice(0, code.length - 1),
  suit: code.slice(-1) as Suit,
});

const PATHS: Record<"s" | "h" | "d", string> = {
  s: "M50 10 C44 30 14 40 14 62 C14 74 27 80 39 72 C38 80 34 86 27 92 L73 92 C66 86 62 80 61 72 C73 80 86 74 86 62 C86 40 56 30 50 10 Z",
  h: "M50 86 C24 66 14 50 14 35 C14 23 24 16 35 20 C43 23 48 29 50 34 C52 29 57 23 65 20 C76 16 86 23 86 35 C86 50 76 66 50 86 Z",
  d: "M50 10 C58 32 70 44 88 50 C70 56 58 68 50 90 C42 68 30 56 12 50 C30 44 42 32 50 10 Z",
};

// 4色デッキ：♠墨・♥赤・♦水色・♣緑。各スートに濃淡グラデ（金属質の陰影用）。
const SUIT_GRAD: Record<Suit, [string, string]> = {
  s: ["#2c2820", "#0e0b06"],
  h: ["#cf3a45", "#8f171f"],
  d: ["#33a6d8", "#136d99"],
  c: ["#34a866", "#166437"],
};
export const suitColor = (suit: Suit): string =>
  ({ s: C.cardInk, h: C.cardRed, d: C.cardBlue, c: C.cardGreen }[suit]);

/** SVGで描くスート（金属質のグラデ・陰影つき）。 */
export const Suit: React.FC<{ suit: Suit; size: number; id?: string }> = ({ suit, size, id = "s" }) => {
  const gid = `g-${suit}-${id}-${size}`;
  const [c0, c1] = SUIT_GRAD[suit];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.18))" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c0} />
          <stop offset="1" stopColor={c1} />
        </linearGradient>
      </defs>
      {suit === "c" ? (
        <g fill={`url(#${gid})`}>
          <circle cx="50" cy="30" r="18" />
          <circle cx="29" cy="53" r="18" />
          <circle cx="71" cy="53" r="18" />
          <path d="M43 52 C44 66 41 82 30 93 L70 93 C59 82 56 66 57 52 Z" />
        </g>
      ) : (
        <path d={PATHS[suit]} fill={`url(#${gid})`} />
      )}
    </svg>
  );
};

/** 額装風の上質なトランプ。3Dフリップで配られ、着地後わずかに浮遊。 */
export const Card: React.FC<{
  card: CardT | string;
  w?: number;
  frame?: number;
  delay?: number;
  rise?: number;
  rotate?: number;
  dim?: boolean;
  ring?: string;
  float?: boolean;
}> = ({ card, w = 150, frame, delay = 0, rise = 84, rotate = 0, dim = false, ring, float = true }) => {
  const { fps } = useVideoConfig();
  const cc = typeof card === "string" ? parseCard(card) : card;
  const h = w * 1.44;

  let opacity = 1, translateY = 0, scale = 1, rotY = 0, idle = 0;
  if (frame !== undefined) {
    const local = frame - delay;
    const s = spring({ frame: local, fps, config: { damping: 200, mass: 0.8 } });
    opacity = interpolate(s, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
    translateY = interpolate(s, [0, 1], [rise, 0]);
    scale = interpolate(s, [0, 1], [0.92, 1]);
    rotY = interpolate(s, [0, 1], [-84, 0]);
    if (float) idle = Math.sin(local / 28) * 3 * interpolate(s, [0.7, 1], [0, 1], { extrapolateLeft: "clamp" });
  }

  const shadow = ring
    ? `0 0 0 1.5px ${ring}, 0 16px 34px rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.4)`
    : "0 14px 30px rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.4)";

  const Corner: React.FC<{ flip?: boolean }> = ({ flip }) => (
    <div style={{
      position: "absolute", top: flip ? undefined : h * 0.055, bottom: flip ? h * 0.055 : undefined,
      left: flip ? undefined : w * 0.085, right: flip ? w * 0.085 : undefined,
      textAlign: "center", lineHeight: 0.98, transform: flip ? "rotate(180deg)" : undefined,
    }}>
      <div style={{ fontFamily: LATIN, fontSize: w * 0.26, fontWeight: 600, color: suitColor(cc.suit), letterSpacing: "-0.02em" }}>{rankLabel(cc.rank)}</div>
      <div style={{ marginTop: w * 0.015, display: "flex", justifyContent: "center" }}><Suit suit={cc.suit} size={w * 0.15} id="c" /></div>
    </div>
  );

  return (
    <div style={{ perspective: 1150, flex: "none" }}>
      <div style={{
        position: "relative", width: w, height: h, borderRadius: w * 0.085,
        background: `linear-gradient(150deg,#fffdf8 0%,${C.cardBg} 55%,#e6dfcf 100%)`,
        boxShadow: shadow, opacity: (dim ? 0.42 : 1) * opacity,
        transform: `translateY(${translateY + idle}px) scale(${scale}) rotate(${rotate}deg) rotateY(${rotY}deg)`,
        transformStyle: "preserve-3d", border: "1px solid rgba(0,0,0,0.14)",
      }}>
        {/* 内側の額縁（ヘアライン） */}
        <div style={{ position: "absolute", inset: w * 0.05, borderRadius: w * 0.05, border: "1px solid rgba(0,0,0,0.10)", pointerEvents: "none" }} />
        <Corner />
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <Suit suit={cc.suit} size={w * 0.46} id="ctr" />
        </div>
        <Corner flip />
        {/* 紙の艶 */}
        <div style={{ position: "absolute", inset: 0, borderRadius: w * 0.085, background: "linear-gradient(152deg, rgba(255,255,255,0.55), transparent 34%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
};

export const CardRow: React.FC<{
  cards: string[];
  w?: number;
  gap?: number;
  frame?: number;
  startDelay?: number;
  stagger?: number;
  ring?: string;
}> = ({ cards, w = 150, gap = 18, frame, startDelay = 0, stagger = 6, ring }) => (
  <div style={{ display: "flex", gap, alignItems: "flex-end" }}>
    {cards.map((c, i) => (
      <Card key={i} card={c} w={w} frame={frame} delay={startDelay + i * stagger} ring={ring} />
    ))}
  </div>
);
