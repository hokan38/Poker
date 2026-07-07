import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { LATIN } from "../fonts";
import { Card } from "./Card";

/* じゃんけんの手（SVG・簡易アイコン） */
export const HandIcon: React.FC<{ kind: "rock" | "scissors" | "paper"; size?: number; color?: string }> = ({
  kind, size = 120, color = C.ink,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
    <g fill={color}>
      {kind === "rock" && (
        <>
          <rect x="20" y="42" width="60" height="46" rx="16" />
          {[31, 45, 59, 73].map((cx) => <circle key={cx} cx={cx} cy="44" r="9" />)}
          <rect x="14" y="52" width="18" height="14" rx="7" />
        </>
      )}
      {kind === "scissors" && (
        <>
          {/* 拳 */}
          <rect x="30" y="50" width="44" height="38" rx="14" />
          {/* 折った指の関節 */}
          <circle cx="63" cy="52" r="8" />
          <circle cx="72" cy="55" r="6.5" />
          {/* 立てた2本指（V） */}
          <rect x="36" y="8" width="12" height="48" rx="6" transform="rotate(-16 42 52)" />
          <rect x="52" y="6" width="12" height="50" rx="6" transform="rotate(14 58 52)" />
          {/* 親指 */}
          <rect x="18" y="60" width="20" height="11" rx="5.5" transform="rotate(-22 28 65)" />
        </>
      )}
      {kind === "paper" && (
        <>
          <rect x="26" y="46" width="48" height="42" rx="12" />
          {[30, 42, 54, 66].map((x) => <rect key={x} x={x} y="14" width="9" height="38" rx="4.5" />)}
          <rect x="14" y="50" width="20" height="11" rx="5.5" transform="rotate(-18 24 55)" />
        </>
      )}
    </g>
  </svg>
);

/* ポーカーテーブル（フェルト＋金縁）にボード・ハンド・ポットを配置 */
export const PokerTable: React.FC<{
  board: string[]; hero: string[]; frame: number;
  boardDelay?: number; heroDelay?: number; potDelay?: number; cardW?: number;
}> = ({ board, hero, frame, boardDelay = 10, heroDelay = 70, potDelay = 200, cardW = 132 }) => {
  const potS = spring({ frame: frame - potDelay, fps: 30, config: { damping: 200 } });
  return (
    <div style={{ position: "relative", width: 1500, height: 620, margin: "0 auto" }}>
      {/* テーブル本体 */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "radial-gradient(120% 130% at 50% 35%, #164231 0%, #0e2c20 55%, #0a2118 100%)",
        border: `7px solid ${C.gold}`,
        boxShadow: "inset 0 0 80px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.5), 0 0 0 2px rgba(0,0,0,0.4)",
      }} />
      <div style={{ position: "absolute", inset: 22, borderRadius: "50%", border: "1px solid rgba(200,169,107,0.35)" }} />
      {/* 相手の席（カードは伏せず表示しない） */}
      <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center", fontFamily: LATIN, fontSize: 30, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)" }}>OPPONENT</div>
      {/* ポット */}
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: interpolate(potS, [0, 1], [0, 1]), transform: `translateY(${interpolate(potS, [0, 1], [20, 0])}px)` }}>
        <div style={{ position: "relative", width: 120, height: 60 }}>
          {[0, 1, 2, 3, 4].map((k) => (
            <div key={k} style={{ position: "absolute", left: (k % 2) * 40 + 20, bottom: Math.floor(k / 2) * 12, width: 60, height: 18, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%, #2a2a2c, #101012 70%)", border: `2px solid ${C.gold}` }} />
          ))}
          <div style={{ position: "absolute", top: -34, left: 0, width: 120, textAlign: "center", fontFamily: LATIN, fontSize: 26, letterSpacing: "0.16em", color: C.goldSoft }}>POT</div>
        </div>
      </div>
      {/* ボード（中央） */}
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
        {board.map((c, i) => <Card key={i} card={c} w={cardW} frame={frame} delay={boardDelay + i * 6} rise={70} />)}
      </div>
      {/* ヒーロー（手前） */}
      <div style={{ position: "absolute", bottom: -34, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 12 }}>
          {hero.map((c, i) => <Card key={i} card={c} w={cardW + 8} frame={frame} delay={heroDelay + i * 6} rise={70} ring={C.gold} />)}
        </div>
        <div style={{ fontFamily: LATIN, fontSize: 28, letterSpacing: "0.2em", color: C.goldSoft, background: "rgba(6,6,8,0.7)", padding: "4px 18px", borderRadius: 8 }}>YOU</div>
      </div>
    </div>
  );
};
