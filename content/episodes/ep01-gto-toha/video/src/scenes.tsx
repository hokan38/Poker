import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { C, FONT, GRAD } from "./theme";
import { LATIN } from "./fonts";
import { Card, CardRow } from "./components/Card";
import { GradientText, Kicker, Reveal, Stamp } from "./components/ui";
import { HandIcon, PokerTable } from "./components/parts";

type SP = { dur: number };
const osc = (f: number, sp: number, ph = 0) => Math.sin(f * sp + ph);
const pulse = (f: number, sp: number, ph = 0) => 0.5 + 0.5 * Math.sin(f * sp + ph);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* コンテンツ帯：上=キッカー、下=字幕 を避ける安全域 */
const Stage: React.FC<{ children: React.ReactNode; justify?: string; gap?: number }> = ({
  children, justify = "center", gap = 46,
}) => (
  <AbsoluteFill style={{ fontFamily: FONT, color: C.ink, padding: "70px 96px 205px", display: "flex", flexDirection: "column", justifyContent: justify, gap }}>
    {children}
  </AbsoluteFill>
);
const Chip: React.FC<{ size?: number; gold?: boolean; style?: React.CSSProperties }> = ({ size = 54, gold = false, style }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: gold ? "radial-gradient(circle at 40% 32%, #f0d79a, #c8a96b 72%)" : "radial-gradient(circle at 42% 32%, #2c2c2e, #0f0f11 72%)", border: `2px solid ${gold ? C.goldSoft : C.gold}`, boxShadow: "0 4px 10px rgba(0,0,0,0.55)", ...style }} />
);
const Stack: React.FC<{ n?: number; size?: number; gold?: boolean }> = ({ n = 5, size = 88, gold }) => (
  <div style={{ position: "relative", width: size, height: size + (n - 1) * size * 0.22 }}>
    {Array.from({ length: n }).map((_, k) => <div key={k} style={{ position: "absolute", bottom: k * size * 0.22, left: 0 }}><Chip size={size} gold={gold} /></div>)}
  </div>
);
// 背景に舞う小チップ（各シーンの副アニメ）
const FloatChips: React.FC<{ n?: number }> = ({ n = 5 }) => {
  const f = useCurrentFrame();
  return (<>{Array.from({ length: n }).map((_, k) => {
    const p = ((f + k * 40) % 200) / 200;
    return <div key={k} style={{ position: "absolute", left: `${(k * 137.5) % 92 + 4}%`, top: interpolate(p, [0, 1], [960, -80]), opacity: interpolate(p, [0, 0.15, 0.85, 1], [0, 0.5, 0.5, 0]) }}><Chip size={26 + (k % 3) * 8} gold={k % 2 === 0} /></div>;
  })}</>);
};

/* ============ 01 タイトル ============ */
export const S01Title: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const cards = ["As", "Kh", "Qd", "Jc", "Ts"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <FloatChips n={6} />
      <Stage gap={30}>
        <Reveal delay={2}><div style={{ display: "inline-block", fontFamily: LATIN, padding: "10px 34px", border: `1px solid ${C.gold}`, color: C.gold, borderRadius: 999, fontSize: 30, fontWeight: 600, letterSpacing: "0.26em" }}>POKER GTO STRATEGY</div></Reveal>
        <div style={{ transform: `translateY(${osc(frame, 0.03) * 5}px)` }}><GradientText gradient={GRAD.ink} fontSize={150} weight={700} delay={8}>GTOとは何か？</GradientText></div>
        <GradientText gradient={GRAD.gold} fontSize={108} weight={700} delay={16} shine>ポーカー戦略の全体像</GradientText>
      </Stage>
      <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {cards.map((c, i) => <div key={i} style={{ transform: `rotate(${(i - 2) * 9}deg) translateY(${Math.abs(i - 2) * 26}px)`, margin: "0 -26px" }}><Card card={c} w={158} frame={frame} delay={30 + i * 5} rise={150} /></div>)}
      </div>
    </AbsoluteFill>
  );
};

/* ============ 02 フック ============ */
export const S02Hook: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const n = Math.max(2, Math.floor(interpolate(frame, [F(0.12), F(0.72)], [2, 12], clamp)));
  return (
    <Stage gap={64}>
      <Kicker delay={2}>なぜ、あの人は勝ち続けるのか</Kicker>
      <div style={{ display: "flex", alignItems: "center", gap: 56, fontSize: 150, fontWeight: 700 }}>
        <Reveal delay={10}><span style={{ color: C.muted }}>運</span></Reveal>
        <Reveal delay={20}><span style={{ fontFamily: LATIN, color: C.gold, fontWeight: 300, fontSize: 90 }}>→</span></Reveal>
        <GradientText gradient={GRAD.gold} fontSize={168} weight={700} delay={26} shine>戦略</GradientText>
      </div>
      <div style={{ position: "relative", height: 300, width: 900 }}>
        <div style={{ position: "absolute", left: 120, bottom: 0 }}>
          {Array.from({ length: n }).map((_, k) => <div key={k} style={{ position: "absolute", bottom: k * 22 }}><Chip size={110} gold /></div>)}
          <div style={{ position: "absolute", bottom: -56, width: 110, textAlign: "center", color: C.gold, fontWeight: 600, fontSize: 30 }}>勝ち続ける</div>
        </div>
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const p = ((frame + k * 22) % 110) / 110;
          return <div key={k} style={{ position: "absolute", left: interpolate(p, [0, 1], [820, 168]), top: interpolate(p, [0, 1], [-70, 200]), opacity: interpolate(p, [0, 0.12, 0.88, 1], [0, 1, 1, 0]) }}><Chip size={52} gold /></div>;
        })}
      </div>
    </Stage>
  );
};

/* ============ 03 シリーズ ============ */
export const S03Series: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const lit = Math.floor(interpolate(frame, [F(0.1), F(0.85)], [0, 5.99], clamp));
  return (
    <Stage gap={54}>
      <Kicker delay={2}>基礎から、一段ずつ</Kicker>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 30, height: 460, justifyContent: "center" }}>
        {[0, 1, 2, 3, 4].map((k) => {
          const s = spring({ frame: frame - F(0.08 + k * 0.15), fps: 30, config: { damping: 16, stiffness: 120 } });
          const on = k <= lit;
          return (
            <div key={k} style={{ width: 210, height: (150 + k * 66) * interpolate(s, [0, 1], [0.12, 1]), borderRadius: 16, background: on ? GRAD.gold : "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))", border: `1px solid ${on ? C.gold : C.line}`, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${osc(frame, 0.05, k) * 5}px)`, display: "grid", placeItems: "end center", paddingBottom: 18, boxShadow: on ? "0 0 40px rgba(200,169,107,0.25)" : "none" }}>
              <span style={{ fontFamily: LATIN, fontSize: 46, fontWeight: 600, color: on ? "#12100a" : C.muted }}>{`0${k + 1}`}</span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

/* ============ 04 定義 ============ */
export const S04Def: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const gto = ["G", "T", "O"];
  return (
    <Stage gap={54}>
      <Kicker delay={2}>GTO とは</Kicker>
      <div style={{ fontFamily: LATIN, fontSize: 150, fontWeight: 600, letterSpacing: "0.02em" }}>
        {"Game Theory Optimal".split(" ").map((w, i) => (
          <Reveal key={i} delay={F(0.05) + i * 10} style={{ display: "inline-block", marginRight: 30 }}>
            <span style={{ color: gto.includes(w[0]) ? C.gold : C.ink, transform: `scale(${1 + 0.04 * pulse(frame, 0.14, i)})`, display: "inline-block" }}>{w}</span>
          </Reveal>
        ))}
      </div>
      <div style={{ marginTop: 10 }}><Stamp delay={F(0.5)} fontSize={80}>＝ 搾取されない戦略</Stamp></div>
    </Stage>
  );
};

/* ============ 05 盾 ============ */
export const S05Shield: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const cx = 960, cy = 470, R = 380;
  const attackers = Array.from({ length: 12 });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 70, left: 96 }}><Kicker delay={2}>ナッシュ均衡 ・ 搾取されない</Kicker></div>
      {attackers.map((_, k) => {
        const ang = (k / attackers.length) * Math.PI * 2 + frame * 0.003;
        const period = 44; const p = ((frame + k * 4) % period) / period;
        const dist = interpolate(p, [0, 0.44, 0.5, 1], [R, 165, 165, R]);
        const op = interpolate(p, [0, 0.08, 0.5, 0.9, 1], [0, 1, 1, 0.5, 0]);
        return <div key={k} style={{ position: "absolute", left: cx + Math.cos(ang) * dist - 24, top: cy + Math.sin(ang) * dist - 24, opacity: op }}><Chip size={48} /></div>;
      })}
      {/* リング */}
      {[0, 1, 2].map((k) => {
        const rp = ((frame + k * 20) % 60) / 60;
        return <div key={k} style={{ position: "absolute", left: cx - 150 - rp * 60, top: cy - 150 - rp * 60, width: 300 + rp * 120, height: 300 + rp * 120, borderRadius: "50%", border: `1px solid rgba(200,169,107,${0.25 * (1 - rp)})` }} />;
      })}
      <div style={{ position: "absolute", left: cx - 155, top: cy - 155, width: 310, height: 310, borderRadius: "50%", transform: `scale(${1 + 0.04 * pulse(frame, 0.18)})`, background: "radial-gradient(circle at 50% 40%, rgba(200,169,107,0.18), rgba(0,0,0,0.2) 70%)", border: `2px solid ${C.gold}`, boxShadow: `0 0 70px rgba(200,169,107,${0.3 + 0.2 * pulse(frame, 0.18)})`, display: "grid", placeItems: "center" }}>
        <span style={{ fontFamily: LATIN, fontSize: 96, fontWeight: 600, color: C.goldSoft }}>GTO</span>
      </div>
    </AbsoluteFill>
  );
};

/* ============ 06 じゃんけん（手のアニメ追加） ============ */
export const S06Janken: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const kinds: ("rock" | "scissors" | "paper")[] = ["rock", "scissors", "paper"];
  const labels = ["グー", "チョキ", "パー"];
  const cols = [C.ink, C.gold, C.silver];
  const cur = Math.floor(frame / 7) % 3;   // 中央が高速に循環
  const seg = 120;
  return (
    <Stage gap={40}>
      <Kicker delay={2}>直感例 I ・ じゃんけん</Kicker>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
        {/* 高速循環する中央の手 */}
        <div style={{ position: "relative", width: 360, height: 360 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(${C.ink} 0 ${seg}deg, ${C.gold} ${seg}deg ${2 * seg}deg, ${C.silver} ${2 * seg}deg 360deg)`, transform: `rotate(${frame * 0.5}deg)`, boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }} />
          <div style={{ position: "absolute", inset: "24%", borderRadius: "50%", background: C.bg, display: "grid", placeItems: "center", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }}>
            <div style={{ transform: `scale(${1 + 0.1 * pulse(frame, 0.9)})` }}><HandIcon kind={kinds[cur]} size={150} color={cols[cur]} /></div>
          </div>
        </div>
        {/* 3つの手 = 1/3ずつ */}
        <div style={{ display: "flex", gap: 44 }}>
          {kinds.map((k, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: cur === i ? 1 : 0.5, transform: `translateY(${cur === i ? -10 : 0}px) scale(${cur === i ? 1.08 : 1})` }}>
              <HandIcon kind={k} size={150} color={cols[i]} />
              <div style={{ fontSize: 40, fontWeight: 600, color: cols[i] }}>{labels[i]}</div>
              <div style={{ fontFamily: LATIN, fontSize: 34, color: C.muted }}>1/3</div>
            </div>
          ))}
        </div>
      </div>
      <Reveal delay={20}><div style={{ fontSize: 48, fontWeight: 600, textAlign: "center" }}>均衡 <span style={{ color: C.muted, fontSize: 36 }}>＝ 誰にも打ち負かされない</span></div></Reveal>
    </Stage>
  );
};

/* ============ 07 偏り→搾取（手＋バー＋流出チップ） ============ */
export const S07Bias: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const you = interpolate(frame, [F(0.05), F(0.4)], [0.33, 0.66], clamp);
  const opp = interpolate(frame, [F(0.3), F(0.7)], [0.33, 0.75], clamp);
  const col = (label: string, h: number, grad: string, color: string, kind: "rock" | "paper") => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <HandIcon kind={kind} size={100} color={color} />
      <div style={{ width: 170, height: 340 * h, background: grad, borderRadius: 14 }} />
      <div style={{ fontSize: 34, color, fontWeight: 600 }}>{label}</div>
    </div>
  );
  return (
    <Stage gap={40}>
      <Kicker delay={2}>偏りは搾取される</Kicker>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 220, height: 480, position: "relative", justifyContent: "center" }}>
        {col("あなた（グー多め）", you, GRAD.gold, C.gold, "rock")}
        {col("相手（パー増）", opp, GRAD.silver, C.silver, "paper")}
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const p = ((frame + k * 16) % 84) / 84;
          return <div key={k} style={{ position: "absolute", left: interpolate(p, [0, 1], [660, 1160]), top: interpolate(p, [0, 0.5, 1], [120, 60, 120]), opacity: interpolate(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) }}><Chip size={44} gold /></div>;
        })}
      </div>
      <Reveal delay={10}><div style={{ fontSize: 72, fontWeight: 700, textAlign: "center" }}><span style={{ color: C.gold }}>偏り</span> <span style={{ color: C.muted, fontFamily: LATIN }}>→</span> <span style={{ color: C.silver }}>搾取される</span></div></Reveal>
    </Stage>
  );
};

/* ============ 08 リバー（ポーカーテーブル） ============ */
export const S08River: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 70, left: 96 }}><Kicker delay={2}>直感例 II ・ リバー（実戦の場面）</Kicker></div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 40, paddingBottom: 120 }}>
        <div style={{ transform: "scale(0.94)" }}>
          <PokerTable board={["Ks", "9s", "4d", "7h", "2d"]} hero={["Kh", "Qc"]} frame={frame} boardDelay={F(0.06)} heroDelay={F(0.34)} potDelay={F(0.5)} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 150, right: 110, fontSize: 34, color: C.gold, fontWeight: 600, opacity: interpolate(spring({ frame: frame - F(0.34), fps: 30, config: { damping: 200 } }), [0, 1], [0, 1]) }}>あなた ＝ ブラフキャッチャー</div>
    </AbsoluteFill>
  );
};

/* ============ 09 ポットオッズ（計算をはっきり／bb） ============ */
export const S09PotOdds: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const t = [F(0.12), F(0.24), F(0.42)];   // ポット / 相手 / あなた
  const count = t.filter((tt) => frame >= tt).length;
  const total = count * 100;
  const fEq = spring({ frame: frame - F(0.6), fps: 30, config: { damping: 200 } });
  const fPct = spring({ frame: frame - F(0.78), fps: 30, config: { damping: 200 } });
  const labels = ["ポット 100", "相手 100", "あなた 100"];
  return (
    <Stage gap={30}>
      <Kicker delay={2}>なぜ「1/3」なのか ・ ポットオッズ</Kicker>
      <div style={{ display: "flex", alignItems: "center", gap: 90, justifyContent: "center" }}>
        {/* 3つの100bb */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: LATIN, fontSize: 56, fontWeight: 600, color: C.gold, height: 64 }}>{count > 0 ? `= ${total}bb` : ""}</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 34 }}>
            {[0, 1, 2].map((k) => {
              const s = spring({ frame: frame - t[k], fps: 30, config: { damping: 14, stiffness: 120 } });
              const hi = k === 2 && fEq > 0.2;
              return (
                <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>
                  <Stack n={5} size={78} gold={hi} />
                  <div style={{ fontSize: 26, color: hi ? C.gold : C.muted, fontWeight: 600 }}>{hi ? "あなた＝1/3" : labels[k]}</div>
                </div>
              );
            })}
          </div>
        </div>
        {/* 計算式 */}
        <div style={{ opacity: interpolate(fEq, [0, 1], [0, 1]), transform: `translateX(${interpolate(fEq, [0, 1], [40, 0])}px)`, textAlign: "left" }}>
          <div style={{ fontSize: 40, color: C.inkSoft, marginBottom: 14 }}>必要勝率</div>
          <div style={{ fontFamily: LATIN, fontSize: 76, fontWeight: 600, display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ color: C.ink }}>100</span>
            <span style={{ color: C.muted }}>/</span>
            <span style={{ color: C.ink }}>300</span>
            <span style={{ color: C.muted }}>=</span>
            <span style={{ color: C.gold }}>1/3</span>
          </div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 20, opacity: interpolate(fPct, [0, 1], [0, 1]) }}>
            <span style={{ fontSize: 40, color: C.inkSoft }}>≒</span>
            <GradientText gradient={GRAD.gold} fontSize={104} weight={700} delay={F(0.78)}>33%</GradientText>
          </div>
          {/* 3回に1回 */}
          <div style={{ marginTop: 22, display: "flex", gap: 14, opacity: interpolate(fPct, [0, 1], [0, 1]) }}>
            {[0, 1, 2].map((k) => <div key={k} style={{ width: 40, height: 40, borderRadius: "50%", background: k === 0 ? C.gold : "transparent", border: `2px solid ${C.gold}` }} />)}
            <span style={{ fontSize: 30, color: C.muted, marginLeft: 10, alignSelf: "center" }}>3回に1回でトントン</span>
          </div>
        </div>
      </div>
    </Stage>
  );
};

/* ============ 10 比率（2:1） ============ */
export const S10Ratio: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const barS = spring({ frame: frame - F(0.62), fps: 30, config: { damping: 200 } });
  return (
    <Stage gap={46}>
      <Kicker delay={2}>理論上の正解</Kicker>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 56, fontSize: 108, fontWeight: 700 }}>
        <GradientText gradient={GRAD.gold} fontSize={108} weight={700} delay={F(0.06)}>バリュー 2</GradientText>
        <span style={{ color: C.muted, fontFamily: LATIN }}>:</span>
        <GradientText gradient={GRAD.silver} fontSize={108} weight={700} delay={F(0.14)}>ブラフ 1</GradientText>
      </div>
      <div style={{ display: "flex", gap: 70, alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 34 }}>
            <div style={{ display: "flex", gap: 10 }}>{["Kd", "Kc"].map((c, i) => <Card key={i} card={c} w={120} frame={frame} delay={F(0.2) + i * 4} rise={40} />)}</div>
            <div style={{ display: "flex", gap: 10 }}>{["9h", "9d"].map((c, i) => <Card key={i} card={c} w={120} frame={frame} delay={F(0.32) + i * 4} rise={40} />)}</div>
          </div>
          <div style={{ fontSize: 32, color: C.gold, fontWeight: 600, letterSpacing: "0.08em" }}>バリュー（本物）</div>
        </div>
        <div style={{ width: 1, alignSelf: "stretch", background: C.line }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 10 }}>{["As", "Js"].map((c, i) => <Card key={i} card={c} w={120} frame={frame} delay={F(0.46) + i * 4} rise={40} />)}</div>
          <div style={{ fontSize: 32, color: C.silver, fontWeight: 600, letterSpacing: "0.08em" }}>ブラフ</div>
        </div>
      </div>
      <div style={{ display: "flex", width: 1000, height: 30, borderRadius: 15, overflow: "hidden", border: `1px solid ${C.line}`, margin: "0 auto" }}>
        <div style={{ width: `${interpolate(barS, [0, 1], [0, 66.6])}%`, background: GRAD.gold }} />
        <div style={{ flex: 1, background: GRAD.silver }} />
      </div>
    </Stage>
  );
};

/* ============ 11 無差別（天秤・大） ============ */
export const S11Indiff: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const settle = Math.max(0, 1 - frame / F(0.45));
  const ang = osc(frame, 0.06) * 7 * settle + osc(frame, 0.03) * 1.2;
  const CX = 960;
  const pan = (label: string, side: number) => (
    <div style={{ position: "absolute", left: CX + side * 300 - 110, top: 300 + side * ang * 3.6, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 3, height: 80, background: C.line }} />
      <div style={{ width: 220, height: 90, borderRadius: "0 0 110px 110px", border: `2px solid ${C.gold}`, borderTop: "none", background: "rgba(200,169,107,0.08)", display: "grid", placeItems: "center", color: C.ink, fontSize: 40, fontWeight: 600 }}>{label}</div>
      <div style={{ marginTop: 12 }}><Chip size={44} gold /></div>
    </div>
  );
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 70, left: 96 }}><Kicker delay={2}>均衡点 ・ インディファレンス</Kicker></div>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, height: 340 }}>
        <div style={{ position: "absolute", left: CX - 5, top: 60, width: 10, height: 220, background: C.line }} />
        <div style={{ position: "absolute", left: CX - 80, top: 278, width: 160, height: 18, borderRadius: 8, background: C.line }} />
        <div style={{ position: "absolute", left: CX - 300, top: 96, width: 600, height: 10, background: GRAD.gold, borderRadius: 5, transform: `rotate(${ang}deg)`, transformOrigin: "center" }} />
        {pan("コール", -1)}
        {pan("降りる", 1)}
      </div>
      <div style={{ position: "absolute", bottom: 210, left: 0, right: 0, textAlign: "center" }}><Stamp delay={F(0.2)} fontSize={70}>無差別 ・ EV は同じ</Stamp></div>
    </AbsoluteFill>
  );
};

/* ============ 12 レンジ（大きな扇） ============ */
export const S12Ranges: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const range = ["Ah", "Ks", "Qd", "Jc", "Ts", "9h", "8s", "7d"];
  return (
    <Stage gap={50}>
      <Kicker delay={2}>GTOの思考法 ・ レンジで考える</Kicker>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ fontSize: 34, color: C.silver }}>1つに決めつけ</div>
          <Card card="Kh" w={150} frame={frame} delay={F(0.08)} rise={40} dim />
        </div>
        <div style={{ fontFamily: LATIN, fontSize: 90, color: C.muted, transform: `translateX(${osc(frame, 0.1) * 7}px)` }}>→</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ fontSize: 36, color: C.gold, fontWeight: 600 }}>ありえる「範囲」</div>
          <div style={{ display: "flex" }}>
            {range.map((c, i) => <div key={i} style={{ margin: "0 -20px", transform: `rotate(${(i - 3.5) * 7}deg) translateY(${osc(frame, 0.06, i) * 5}px)` }}><Card card={c} w={130} frame={frame} delay={F(0.32) + i * 5} rise={80} /></div>)}
          </div>
        </div>
      </div>
    </Stage>
  );
};

/* ============ 13 GTO vs エクスプロイト（振り子・大） ============ */
export const S13Exploit: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const sw = osc(frame, 0.05) * 28;
  const panel = (title: string, sub: string, col: string, kind: "rock" | "scissors") => (
    <div style={{ flex: 1, background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012))", border: `1px solid ${col}66`, borderRadius: 20, padding: "44px 48px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><HandIcon kind={kind} size={100} color={col} /></div>
      <div style={{ fontSize: 56, fontWeight: 700, color: col, marginBottom: 12 }}>{title}</div>
      <div style={{ fontSize: 38, color: C.muted }}>{sub}</div>
    </div>
  );
  return (
    <Stage gap={36}>
      <Kicker delay={2}>2つの戦略</Kicker>
      <div style={{ position: "relative", height: 110 }}>
        <div style={{ position: "absolute", left: "50%", top: 0, width: 2, height: 54, background: C.line, transform: `translateX(-50%) rotate(${sw}deg)`, transformOrigin: "top center" }} />
        <div style={{ position: "absolute", left: `calc(50% + ${Math.sin((sw * Math.PI) / 180) * 54}px)`, top: 46, transform: "translateX(-50%)" }}><Chip size={48} gold /></div>
      </div>
      <div style={{ display: "flex", gap: 50 }}>
        <Reveal delay={8} style={{ flex: 1 }}>{panel("GTO ・ 守り", "搾取されない基準", C.gold, "rock")}</Reveal>
        <Reveal delay={16} style={{ flex: 1 }}>{panel("エクスプロイト ・ 攻め", "相手のミスを突く", C.silver, "scissors")}</Reveal>
      </div>
    </Stage>
  );
};

/* ============ 14 土台と応用 ============ */
export const S14Foundation: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const drop = spring({ frame: frame - F(0.4), fps: 30, config: { damping: 12, stiffness: 120 } });
  return (
    <Stage justify="center" gap={22}>
      <Kicker delay={2}>順番が大切</Kicker>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, marginTop: 10, transform: `translateY(${osc(frame, 0.05) * 5}px)` }}>
        <div style={{ width: 900, padding: "34px", borderRadius: 16, background: "linear-gradient(180deg, rgba(169,175,179,0.14), rgba(169,175,179,0.04))", border: `1px solid ${C.silver}66`, textAlign: "center", opacity: interpolate(drop, [0, 1], [0, 1]), transform: `translateY(${interpolate(drop, [0, 1], [-160, 0])}px)` }}>
          <span style={{ fontSize: 56, fontWeight: 700, color: C.silver }}>エクスプロイト ・ 応用</span>
        </div>
        <div style={{ width: 1300, padding: "44px", borderRadius: 16, background: "linear-gradient(180deg, rgba(200,169,107,0.16), rgba(200,169,107,0.05))", border: `1px solid ${C.gold}`, textAlign: "center" }}>
          <span style={{ fontSize: 66, fontWeight: 700, color: C.gold }}>GTO ・ 土台</span>
        </div>
      </div>
    </Stage>
  );
};

/* ============ 15 なぜ今 ============ */
export const S15Solved: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const rows = [["2015", "Cepheus"], ["2017", "Libratus"], ["2019", "Pluribus"]];
  return (
    <Stage gap={34}>
      <Kicker delay={2}>なぜ今 ・ GTOは共通言語</Kicker>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1500, margin: "0 auto", width: "100%" }}>
        {rows.map((r, i) => {
          const s = spring({ frame: frame - F(0.1 + i * 0.18), fps: 30, config: { damping: 18 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 40, padding: "18px 20px", borderBottom: `1px solid ${C.line}`, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateX(${interpolate(s, [0, 1], [-70, 0])}px)` }}>
              <span style={{ fontFamily: LATIN, fontSize: 72, fontWeight: 600, color: C.gold, width: 180 }}>{r[0]}</span>
              <span style={{ fontFamily: LATIN, fontSize: 54, fontWeight: 600, width: 300 }}>{r[1]}</span>
              <span style={{ fontSize: 46, fontWeight: 700, color: C.silver }}>AI</span>
              <span style={{ fontFamily: LATIN, fontSize: 46, color: C.gold, transform: `scale(${1 + 0.18 * pulse(frame, 0.3, i)})` }}>▶</span>
              <span style={{ fontSize: 38, color: C.muted }}>トッププロに勝利</span>
            </div>
          );
        })}
      </div>
      <Reveal delay={F(0.72)}><div style={{ fontSize: 64, fontWeight: 700, textAlign: "center" }}>GTO <span style={{ color: C.muted, fontSize: 44 }}>＝</span> <span style={{ color: C.gold }}>現代の共通言語</span></div></Reveal>
    </Stage>
  );
};

/* ============ 16 まとめ ============ */
export const S16Summary: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const items = [
    { k: "均衡", d: "搾取されない", col: C.ink },
    { k: "2 : 1", d: "バリュー:ブラフ", col: C.gold },
    { k: "土台", d: "その上に応用", col: C.silver },
  ];
  return (
    <Stage gap={54}>
      <Kicker delay={2}>今日のまとめ</Kicker>
      <div style={{ display: "flex", gap: 60, justifyContent: "center" }}>
        {items.map((it, i) => {
          const s = spring({ frame: frame - F(0.12 + i * 0.22), fps: 30, config: { damping: 12, stiffness: 130 } });
          return (
            <div key={i} style={{ flex: 1, textAlign: "center", opacity: interpolate(s, [0, 1], [0, 1]), transform: `scale(${interpolate(s, [0, 1], [0.7, 1])}) translateY(${osc(frame, 0.05, i) * 6}px)` }}>
              <div style={{ fontFamily: LATIN, fontSize: 104, fontWeight: 700, color: it.col }}>{i + 1}</div>
              <div style={{ fontSize: 76, fontWeight: 700, color: it.col, margin: "8px 0" }}>{it.k}</div>
              <div style={{ fontSize: 40, color: C.muted }}>{it.d}</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

/* ============ 17 次回（EVには触れない） ============ */
export const S17Next: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  return (
    <Stage justify="center" gap={44}>
      <FloatChips n={5} />
      <Kicker delay={2}>ご視聴ありがとうございました</Kicker>
      <GradientText gradient={GRAD.gold} fontSize={104} weight={700} delay={10}>また次回、お会いしましょう</GradientText>
      <div style={{ marginTop: 10 }}><Stamp delay={40} fontSize={56} color={C.gold}>チャンネル登録・高評価をお願いします</Stamp></div>
      <div style={{ transform: `translateY(${osc(frame, 0.05) * 5}px)`, marginTop: 8 }} />
    </Stage>
  );
};

export const SCENES: Record<string, React.FC<SP>> = {
  title: S01Title, hook: S02Hook, series: S03Series, def: S04Def, unexploitable: S05Shield,
  janken: S06Janken, jankenExploit: S07Bias, river: S08River, potodds: S09PotOdds, ratio: S10Ratio,
  indiff: S11Indiff, ranges: S12Ranges, exploit: S13Exploit, foundation: S14Foundation, solved: S15Solved,
  summary: S16Summary, next: S17Next,
};
