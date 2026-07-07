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

/** 1枚のトランプ。3Dフリップで配られ、着地後は微妙に浮遊。 */
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
  float?: boolean;
}> = ({ card, w = 150, frame, delay = 0, rise = 90, rotate = 0, faceDown = false, dim = false, glow, float = true }) => {
  const { fps } = useVideoConfig();
  const cc = typeof card === "string" ? parseCard(card) : card;
  const h = w * 1.42;
  const color = isRed(cc.suit) ? C.cardRed : C.cardBlack;

  let opacity = 1, translateY = 0, scale = 1, rotY = 0, idle = 0;
  if (frame !== undefined) {
    const local = frame - delay;
    const s = spring({ frame: local, fps, config: { damping: 200, mass: 0.7 } });
    opacity = interpolate(s, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
    translateY = interpolate(s, [0, 1], [rise, 0]);
    scale = interpolate(s, [0, 1], [0.9, 1]);
    rotY = interpolate(s, [0, 1], [-92, 0]); // フリップ
    if (float) idle = Math.sin((local) / 26) * 4 * interpolate(s, [0.7, 1], [0, 1], { extrapolateLeft: "clamp" });
  }

  const glowShadow = glow
    ? `0 0 22px 2px ${glow}, 0 0 0 3px ${glow}, 0 20px 42px rgba(0,0,0,0.5)`
    : "0 16px 38px rgba(0,0,0,0.5)";

  const face = (
    <>
      <div style={{ position: "absolute", top: h * 0.055, left: w * 0.09, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontSize: w * 0.28, fontWeight: 800, color }}>{rankLabel(cc.rank)}</div>
        <div style={{ fontSize: w * 0.22, color, marginTop: w * 0.01 }}>{SUIT_CHAR[cc.suit]}</div>
      </div>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: w * 0.6, color, textShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
        {SUIT_CHAR[cc.suit]}
      </div>
      <div style={{ position: "absolute", bottom: h * 0.055, right: w * 0.09, textAlign: "center", lineHeight: 1, transform: "rotate(180deg)" }}>
        <div style={{ fontSize: w * 0.28, fontWeight: 800, color }}>{rankLabel(cc.rank)}</div>
        <div style={{ fontSize: w * 0.22, color, marginTop: w * 0.01 }}>{SUIT_CHAR[cc.suit]}</div>
      </div>
    </>
  );

  const back = (
    <div style={{ position: "absolute", inset: w * 0.06, borderRadius: w * 0.08, background: "repeating-linear-gradient(45deg,#14432f,#14432f 10px,#0f3324 10px,#0f3324 20px)", border: `2px solid ${C.gold}` }} />
  );

  return (
    <div style={{ perspective: 1100, flex: "none" }}>
      <div
        style={{
          position: "relative", width: w, height: h, borderRadius: w * 0.1,
          background: faceDown
            ? "#0f3324"
            : `linear-gradient(160deg, #ffffff 0%, ${C.cardWhite} 60%, #eae4d3 100%)`,
          boxShadow: glowShadow,
          opacity: (dim ? 0.4 : 1) * opacity,
          transform: `translateY(${translateY + idle}px) scale(${scale}) rotate(${rotate}deg) rotateY(${rotY}deg)`,
          transformStyle: "preserve-3d",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {faceDown ? back : face}
        {/* 上部のハイライト */}
        {!faceDown && (
          <div style={{ position: "absolute", inset: 0, borderRadius: w * 0.1, background: "linear-gradient(160deg, rgba(255,255,255,0.55), transparent 40%)", pointerEvents: "none" }} />
        )}
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
  glow?: string;
}> = ({ cards, w = 150, gap = 18, frame, startDelay = 0, stagger = 6, glow }) => (
  <div style={{ display: "flex", gap, alignItems: "flex-end" }}>
    {cards.map((c, i) => (
      <Card key={i} card={c} w={w} frame={frame} delay={startDelay + i * stagger} glow={glow} />
    ))}
  </div>
);
