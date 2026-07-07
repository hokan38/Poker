import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";

export type Suit = "s" | "h" | "d" | "c";
export type CardT = { rank: string; suit: Suit };

const SUIT_CHAR: Record<Suit, string> = { s: "♠", h: "♥", d: "♦", c: "♣" };
const isRed = (s: Suit) => s === "h" || s === "d";
const rankLabel = (r: string) => (r === "T" ? "10" : r);

export const parseCard = (code: string): CardT => ({
  rank: code.slice(0, code.length - 1),
  suit: code.slice(-1) as Suit,
});

/** 1枚のトランプ。deal>0 のとき配られるアニメ（frame基準）。 */
export const Card: React.FC<{
  card: CardT | string;
  w?: number;
  frame?: number;
  delay?: number;
  rise?: number;
  rotate?: number;
  faceDown?: boolean;
  dim?: boolean;
  glow?: string;
}> = ({ card, w = 150, frame, delay = 0, rise = 90, rotate = 0, faceDown = false, dim = false, glow }) => {
  const { fps } = useVideoConfig();
  const cc = typeof card === "string" ? parseCard(card) : card;
  const h = w * 1.42;
  const color = isRed(cc.suit) ? C.cardRed : C.cardBlack;

  let opacity = 1;
  let translateY = 0;
  let scale = 1;
  if (frame !== undefined) {
    const s = spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.7 } });
    opacity = interpolate(s, [0, 1], [0, 1]);
    translateY = interpolate(s, [0, 1], [rise, 0]);
    scale = interpolate(s, [0, 1], [0.86, 1]);
  }

  const face = (
    <>
      <div style={{ position: "absolute", top: h * 0.06, left: w * 0.09, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontSize: w * 0.28, fontWeight: 800, color }}>{rankLabel(cc.rank)}</div>
        <div style={{ fontSize: w * 0.22, color, marginTop: w * 0.02 }}>{SUIT_CHAR[cc.suit]}</div>
      </div>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: w * 0.62, color }}>
        {SUIT_CHAR[cc.suit]}
      </div>
      <div style={{ position: "absolute", bottom: h * 0.06, right: w * 0.09, textAlign: "center", lineHeight: 1, transform: "rotate(180deg)" }}>
        <div style={{ fontSize: w * 0.28, fontWeight: 800, color }}>{rankLabel(cc.rank)}</div>
        <div style={{ fontSize: w * 0.22, color, marginTop: w * 0.02 }}>{SUIT_CHAR[cc.suit]}</div>
      </div>
    </>
  );

  const back = (
    <div style={{ position: "absolute", inset: w * 0.06, borderRadius: w * 0.08, background: "repeating-linear-gradient(45deg,#123c2a,#123c2a 10px,#0e2f21 10px,#0e2f21 20px)", border: `2px solid ${C.gold}` }} />
  );

  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        borderRadius: w * 0.1,
        background: faceDown ? "#0e2f21" : C.cardWhite,
        boxShadow: glow
          ? `0 0 0 4px ${glow}, 0 18px 40px rgba(0,0,0,0.45)`
          : "0 14px 34px rgba(0,0,0,0.45)",
        opacity: (dim ? 0.4 : 1) * opacity,
        transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
        transformOrigin: "center bottom",
        flex: "none",
      }}
    >
      {faceDown ? back : face}
    </div>
  );
};

/** 横並びのカード列（ボードやハンド）。 */
export const CardRow: React.FC<{
  cards: string[];
  w?: number;
  gap?: number;
  frame?: number;
  startDelay?: number;
  stagger?: number;
  glow?: string;
}> = ({ cards, w = 150, gap = 18, frame, startDelay = 0, stagger = 6, glow }) => (
  <div style={{ display: "flex", gap, alignItems: "flex-end" }}>
    {cards.map((c, i) => (
      <Card key={i} card={c} w={w} frame={frame} delay={startDelay + i * stagger} glow={glow} />
    ))}
  </div>
);
