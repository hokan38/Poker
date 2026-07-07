import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";

export type Suit = "s" | "h" | "d" | "c";
export type CardT = { rank: string; suit: Suit };

const SUIT_CHAR: Record<Suit, string> = { s: "♠", h: "♥", d: "♦", c: "♣" };
const rankLabel = (r: string) => (r === "T" ? "10" : r);

export const parseCard = (code: string): CardT => ({
  rank: code.slice(0, code.length - 1),
  suit: code.slice(-1) as Suit,
});

/** モノクロ・アイボリーのトランプ。3Dフリップで配られ、着地後わずかに浮遊。 */
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
  const color = C.cardInk;

  let opacity = 1, translateY = 0, scale = 1, rotY = 0, idle = 0;
  if (frame !== undefined) {
    const local = frame - delay;
    const s = spring({ frame: local, fps, config: { damping: 200, mass: 0.8 } });
    opacity = interpolate(s, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
    translateY = interpolate(s, [0, 1], [rise, 0]);
    scale = interpolate(s, [0, 1], [0.92, 1]);
    rotY = interpolate(s, [0, 1], [-88, 0]);
    if (float) idle = Math.sin(local / 28) * 3 * interpolate(s, [0.7, 1], [0, 1], { extrapolateLeft: "clamp" });
  }

  const shadow = ring
    ? `0 0 0 1.5px ${ring}, 0 14px 34px rgba(0,0,0,0.55)`
    : "0 12px 30px rgba(0,0,0,0.5)";

  return (
    <div style={{ perspective: 1100, flex: "none" }}>
      <div style={{
        position: "relative", width: w, height: h, borderRadius: w * 0.09,
        background: `linear-gradient(158deg,#ffffff 0%,${C.cardBg} 62%,#e7e1d2 100%)`,
        boxShadow: shadow, opacity: (dim ? 0.42 : 1) * opacity,
        transform: `translateY(${translateY + idle}px) scale(${scale}) rotate(${rotate}deg) rotateY(${rotY}deg)`,
        transformStyle: "preserve-3d", border: "1px solid rgba(0,0,0,0.10)",
      }}>
        <div style={{ position: "absolute", top: h * 0.05, left: w * 0.09, textAlign: "center", lineHeight: 1 }}>
          <div style={{ fontSize: w * 0.27, fontWeight: 700, color }}>{rankLabel(cc.rank)}</div>
          <div style={{ fontSize: w * 0.2, color, marginTop: w * 0.01 }}>{SUIT_CHAR[cc.suit]}</div>
        </div>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: w * 0.56, color }}>
          {SUIT_CHAR[cc.suit]}
        </div>
        <div style={{ position: "absolute", bottom: h * 0.05, right: w * 0.09, textAlign: "center", lineHeight: 1, transform: "rotate(180deg)" }}>
          <div style={{ fontSize: w * 0.27, fontWeight: 700, color }}>{rankLabel(cc.rank)}</div>
          <div style={{ fontSize: w * 0.2, color, marginTop: w * 0.01 }}>{SUIT_CHAR[cc.suit]}</div>
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: w * 0.09, background: "linear-gradient(158deg, rgba(255,255,255,0.6), transparent 38%)", pointerEvents: "none" }} />
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
