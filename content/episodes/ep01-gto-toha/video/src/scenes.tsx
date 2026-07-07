import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, GRAD } from "./theme";
import { LATIN } from "./fonts";
import { Card, CardRow } from "./components/Card";
import { GradientText, Kicker, Reveal, Stamp } from "./components/ui";

type SP = { dur: number };

/* ============ 共通 ============ */
const Stage: React.FC<{ children: React.ReactNode; justify?: string; gap?: number }> = ({
  children, justify = "center", gap = 44,
}) => (
  <AbsoluteFill style={{ fontFamily: FONT, color: C.ink, padding: "88px 120px 200px", display: "flex", flexDirection: "column", justifyContent: justify, gap }}>
    {children}
  </AbsoluteFill>
);
const osc = (f: number, sp: number, ph = 0) => Math.sin(f * sp + ph);
const pulse = (f: number, sp: number, ph = 0) => 0.5 + 0.5 * Math.sin(f * sp + ph);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Chip: React.FC<{ size?: number; gold?: boolean; style?: React.CSSProperties }> = ({ size = 54, gold = false, style }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: gold ? "radial-gradient(circle at 40% 32%, #f0d79a, #c8a96b 72%)" : "radial-gradient(circle at 42% 32%, #2c2c2e, #0f0f11 72%)",
    border: `2px solid ${gold ? C.goldSoft : C.gold}`, boxShadow: "0 4px 10px rgba(0,0,0,0.55)", ...style,
  }} />
);
const ChipStack: React.FC<{ n?: number; size?: number; gold?: boolean }> = ({ n = 5, size = 88, gold }) => (
  <div style={{ position: "relative", width: size, height: size * 0.55 + (n - 1) * size * 0.22 }}>
    {Array.from({ length: n }).map((_, k) => (
      <div key={k} style={{ position: "absolute", bottom: k * size * 0.22, left: 0 }}><Chip size={size} gold={gold} /></div>
    ))}
  </div>
);

/* ============ 01 タイトル ============ */
export const S01Title: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const cards = ["As", "Kh", "Qd", "Jc", "Ts"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage gap={30}>
        <Reveal delay={2}>
          <div style={{ display: "inline-block", fontFamily: LATIN, padding: "9px 30px", border: `1px solid ${C.gold}`, color: C.gold, borderRadius: 999, fontSize: 27, fontWeight: 600, letterSpacing: "0.26em" }}>POKER GTO STRATEGY</div>
        </Reveal>
        <div style={{ transform: `translateY(${osc(frame, 0.03) * 4}px)` }}>
          <GradientText gradient={GRAD.ink} fontSize={128} weight={700} delay={8}>GTOとは何か？</GradientText>
        </div>
        <GradientText gradient={GRAD.gold} fontSize={92} weight={700} delay={16} shine>ポーカー戦略の全体像</GradientText>
      </Stage>
      <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {cards.map((c, i) => (
          <div key={i} style={{ transform: `rotate(${(i - 2) * 8}deg) translateY(${Math.abs(i - 2) * 22}px)`, margin: "0 -22px" }}>
            <Card card={c} w={138} frame={frame} delay={30 + i * 5} rise={140} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ============ 02 フック ============ */
export const S02Hook: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const grown = interpolate(frame, [F(0.12), F(0.7)], [2, 9], clamp);
  const n = Math.max(2, Math.floor(grown));
  return (
    <Stage gap={54}>
      <Kicker delay={2}>なぜ、あの人は勝ち続けるのか</Kicker>
      <div style={{ display: "flex", alignItems: "center", gap: 40, fontSize: 118, fontWeight: 700 }}>
        <Reveal delay={10}><span style={{ color: C.muted }}>運</span></Reveal>
        <Reveal delay={20}><span style={{ fontFamily: LATIN, color: C.gold, fontWeight: 300, fontSize: 70 }}>→</span></Reveal>
        <GradientText gradient={GRAD.gold} fontSize={128} weight={700} delay={26} shine>戦略</GradientText>
      </div>
      <div style={{ position: "relative", height: 240, width: 560, marginTop: 8 }}>
        <div style={{ position: "absolute", left: 60, bottom: 0 }}>
          {Array.from({ length: n }).map((_, k) => (
            <div key={k} style={{ position: "absolute", bottom: k * 20 }}><Chip size={92} gold /></div>
          ))}
          <div style={{ position: "absolute", bottom: -52, width: 92, textAlign: "center", color: C.gold, fontWeight: 600, fontSize: 28 }}>勝ち続ける</div>
        </div>
        {[0, 1, 2, 3].map((k) => {
          const p = ((frame + k * 30) % 120) / 120;
          return <div key={k} style={{ position: "absolute", left: interpolate(p, [0, 1], [500, 108]), top: interpolate(p, [0, 1], [-80, 150]), opacity: interpolate(p, [0, 0.12, 0.88, 1], [0, 1, 1, 0]) }}><Chip size={44} gold /></div>;
        })}
      </div>
    </Stage>
  );
};

/* ============ 03 シリーズ（積み上げ） ============ */
export const S03Series: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  return (
    <Stage gap={50}>
      <Kicker delay={2}>基礎から、一段ずつ</Kicker>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 320 }}>
        {[0, 1, 2, 3, 4].map((k) => {
          const s = spring({ frame: frame - F(0.08 + k * 0.14), fps: 30, config: { damping: 16, stiffness: 120 } });
          const h = 100 + k * 46;
          return (
            <div key={k} style={{ width: 150, height: h * interpolate(s, [0, 1], [0.15, 1]), borderRadius: 12, background: k === 4 ? GRAD.gold : "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))", border: `1px solid ${k === 4 ? C.gold : C.line}`, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${osc(frame, 0.05, k) * 4}px)`, display: "grid", placeItems: "end center", paddingBottom: 14 }}>
              <span style={{ fontFamily: LATIN, fontSize: 34, fontWeight: 600, color: k === 4 ? "#12100a" : C.muted }}>{`0${k + 1}`}</span>
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
    <Stage gap={40}>
      <Kicker delay={2}>GTO とは</Kicker>
      <div style={{ fontFamily: LATIN, fontSize: 120, fontWeight: 600, letterSpacing: "0.02em" }}>
        {"Game Theory Optimal".split(" ").map((w, i) => (
          <Reveal key={i} delay={F(0.05) + i * 10} style={{ display: "inline-block", marginRight: 26 }}>
            <span style={{ color: gto.includes(w[0]) ? C.gold : C.ink, transform: `scale(${1 + 0.03 * pulse(frame, 0.14, i)})`, display: "inline-block" }}>{w}</span>
          </Reveal>
        ))}
      </div>
      <div style={{ marginTop: 16 }}><Stamp delay={F(0.5)} fontSize={66}>＝ 搾取されない戦略</Stamp></div>
    </Stage>
  );
};

/* ============ 05 盾（搾取されない） ============ */
export const S05Shield: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const R = 470;
  const attackers = Array.from({ length: 8 });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Kicker delay={2}>ナッシュ均衡 ・ 搾取されない</Kicker>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 2 * R, height: 2 * R }}>
          {attackers.map((_, k) => {
            const ang = (k / attackers.length) * Math.PI * 2 + frame * 0.004;
            const period = 46; const p = ((frame + k * 6) % period) / period;
            const dist = interpolate(p, [0, 0.44, 0.5, 1], [R, 175, 175, R]);
            const op = interpolate(p, [0, 0.08, 0.5, 0.9, 1], [0, 1, 1, 0.6, 0]);
            const x = R + Math.cos(ang) * dist, y = R + Math.sin(ang) * dist;
            return <div key={k} style={{ position: "absolute", left: x - 22, top: y - 22, opacity: op }}><Chip size={44} /></div>;
          })}
          <div style={{ position: "absolute", left: R - 150, top: R - 150, width: 300, height: 300, borderRadius: "50%", transform: `scale(${1 + 0.04 * pulse(frame, 0.18)})`, background: "radial-gradient(circle at 50% 40%, rgba(200,169,107,0.16), rgba(0,0,0,0.2) 70%)", border: `2px solid ${C.gold}`, boxShadow: `0 0 60px rgba(200,169,107,${0.3 + 0.2 * pulse(frame, 0.18)})`, display: "grid", placeItems: "center" }}>
            <span style={{ fontFamily: LATIN, fontSize: 92, fontWeight: 600, color: C.goldSoft }}>GTO</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============ 06 じゃんけん（激しく循環） ============ */
export const S06Janken: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const hands = ["グー", "チョキ", "パー"];
  const cur = Math.floor(frame / 7) % 3;
  const cols = [C.ink, C.gold, C.silver];
  const seg = 120;
  return (
    <Stage gap={40}>
      <Kicker delay={2}>直感例 I ・ じゃんけん</Kicker>
      <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
        <div style={{ position: "relative", width: 340, height: 340 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(${C.ink} 0 ${seg}deg, ${C.gold} ${seg}deg ${2 * seg}deg, ${C.silver} ${2 * seg}deg 360deg)`, transform: `rotate(${frame * 0.4}deg)`, boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }} />
          <div style={{ position: "absolute", inset: "28%", borderRadius: "50%", background: C.bg, display: "grid", placeItems: "center", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }}>
            <span style={{ fontSize: 44, fontWeight: 700, color: cols[cur], transform: `scale(${1 + 0.08 * pulse(frame, 0.9)})` }}>{hands[cur]}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {hands.map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 46, fontWeight: 600, opacity: cur === i ? 1 : 0.4 }}>
              <span style={{ width: 32, height: 32, borderRadius: 6, background: cols[i] }} />
              {h}<span style={{ fontFamily: LATIN, color: C.muted, marginLeft: 8 }}>1/3</span>
            </div>
          ))}
        </div>
      </div>
      <Reveal delay={20}><div style={{ fontSize: 44, fontWeight: 600 }}>均衡 <span style={{ color: C.muted, fontSize: 34 }}>＝ 誰にも打ち負かされない</span></div></Reveal>
    </Stage>
  );
};

/* ============ 07 偏り→搾取 ============ */
export const S07Bias: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const you = interpolate(frame, [F(0.05), F(0.4)], [0.33, 0.62], clamp);
  const opp = interpolate(frame, [F(0.3), F(0.7)], [0.33, 0.72], clamp);
  return (
    <Stage gap={40}>
      <Kicker delay={2}>偏りは搾取される</Kicker>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 120, height: 340, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 150, height: 300 * you, background: GRAD.gold, borderRadius: 12 }} />
          <div style={{ fontSize: 34, color: C.gold, fontWeight: 600 }}>あなた（グー多め）</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 150, height: 300 * opp, background: GRAD.silver, borderRadius: 12 }} />
          <div style={{ fontSize: 34, color: C.silver, fontWeight: 600 }}>相手（パー増）</div>
        </div>
        {[0, 1, 2, 3, 4].map((k) => {
          const p = ((frame + k * 18) % 90) / 90;
          return <div key={k} style={{ position: "absolute", left: interpolate(p, [0, 1], [150, 470]), top: interpolate(p, [0, 0.5, 1], [-40, -90, -40]), opacity: interpolate(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) }}><Chip size={40} gold /></div>;
        })}
      </div>
      <Reveal delay={10}><div style={{ fontSize: 64, fontWeight: 700 }}><span style={{ color: C.gold }}>偏り</span> <span style={{ color: C.muted, fontFamily: LATIN }}>→</span> <span style={{ color: C.silver }}>搾取される</span></div></Reveal>
    </Stage>
  );
};

/* ============ 08 リバー ============ */
export const S08River: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const board = ["Ks", "9s", "4d", "7h", "2d"];
  const hero = ["Kh", "Qc"];
  const betS = spring({ frame: frame - F(0.45), fps: 30, config: { damping: 200 } });
  return (
    <Stage gap={30}>
      <Kicker delay={2}>直感例 II ・ リバー</Kicker>
      <div><div style={{ fontSize: 28, color: C.muted, letterSpacing: "0.18em", marginBottom: 12 }}>BOARD</div>
        <CardRow cards={board} w={150} frame={frame} startDelay={F(0.04)} stagger={6} /></div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
        <div><div style={{ fontSize: 28, color: C.gold, letterSpacing: "0.12em", marginBottom: 12, fontWeight: 600 }}>あなた ・ ブラフキャッチャー</div>
          <CardRow cards={hero} w={150} frame={frame} startDelay={F(0.28)} stagger={6} ring={C.gold} /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: interpolate(betS, [0, 1], [0, 1]), transform: `translateY(${interpolate(betS, [0, 1], [30, 0]) + osc(frame, 0.06) * 4}px)` }}>
          <ChipStack n={5} size={88} gold />
          <div style={{ fontSize: 34, color: C.inkSoft }}><span style={{ color: C.gold, fontWeight: 700 }}>ポットと同額</span>ベット</div>
        </div>
      </div>
      <Reveal delay={F(0.78)}><div style={{ fontSize: 58, fontWeight: 700 }}><span style={{ color: C.gold }}>コール？</span> <span style={{ color: C.muted }}>／</span> <span style={{ color: C.silver }}>降りる？</span></div></Reveal>
    </Stage>
  );
};

/* ============ 09 ポットオッズ（3つの100が集まり→1/3=33%） ============ */
export const S09PotOdds: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const t = [F(0.1), F(0.3), F(0.5)];               // ポット/ベット/コール が現れる
  const count = t.filter((tt) => frame >= tt).length;
  const total = count * 100;
  const hi = interpolate(frame, [F(0.62), F(0.72)], [0, 1], clamp);        // 1/3 を強調
  const pct = spring({ frame: frame - F(0.72), fps: 30, config: { damping: 200 } });
  const labels = ["ポット 100", "＋ ベット 100", "＋ コール 100"];
  return (
    <Stage gap={26}>
      <Kicker delay={2}>なぜ「1/3」なのか ・ ポットオッズ</Kicker>
      <div style={{ height: 60 }}>
        {count > 0 && <div style={{ fontFamily: LATIN, fontSize: 64, fontWeight: 600, color: C.gold }}>= {total}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 70, height: 260 }}>
        {[0, 1, 2].map((k) => {
          const s = spring({ frame: frame - t[k], fps: 30, config: { damping: 14, stiffness: 120 } });
          const highlight = k === 0 && hi > 0.2;
          return (
            <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` }}>
              <ChipStack n={5} size={82} gold={highlight} />
              <div style={{ fontSize: 26, color: highlight ? C.gold : C.muted, fontWeight: 600 }}>{highlight ? "これが 1/3" : labels[k]}</div>
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginLeft: 40, opacity: interpolate(pct, [0, 1], [0, 1]), transform: `scale(${interpolate(pct, [0, 1], [0.7, 1])})` }}>
          <span style={{ fontSize: 40, color: C.inkSoft }}>必要勝率</span>
          <GradientText gradient={GRAD.gold} fontSize={96} weight={700} delay={F(0.72)}>33%</GradientText>
        </div>
      </div>
    </Stage>
  );
};

/* ============ 10 比率（2:1に仕分け） ============ */
export const S10Ratio: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const barS = spring({ frame: frame - F(0.62), fps: 30, config: { damping: 200 } });
  return (
    <Stage gap={40}>
      <Kicker delay={2}>理論上の正解</Kicker>
      <div style={{ display: "flex", alignItems: "center", gap: 50, fontSize: 90, fontWeight: 700 }}>
        <GradientText gradient={GRAD.gold} fontSize={90} weight={700} delay={F(0.06)}>バリュー 2</GradientText>
        <span style={{ color: C.muted, fontFamily: LATIN }}>:</span>
        <GradientText gradient={GRAD.silver} fontSize={90} weight={700} delay={F(0.14)}>ブラフ 1</GradientText>
      </div>
      <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 30 }}>
            <div style={{ display: "flex", gap: 10 }}>{["Kd", "Kc"].map((c, i) => <Card key={i} card={c} w={104} frame={frame} delay={F(0.2) + i * 4} rise={40} />)}</div>
            <div style={{ display: "flex", gap: 10 }}>{["9h", "9d"].map((c, i) => <Card key={i} card={c} w={104} frame={frame} delay={F(0.32) + i * 4} rise={40} />)}</div>
          </div>
          <div style={{ fontSize: 30, color: C.gold, fontWeight: 600, letterSpacing: "0.08em" }}>バリュー（本物）</div>
        </div>
        <div style={{ width: 1, alignSelf: "stretch", background: C.line }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>{["As", "Js"].map((c, i) => <Card key={i} card={c} w={104} frame={frame} delay={F(0.46) + i * 4} rise={40} />)}</div>
          <div style={{ fontSize: 30, color: C.silver, fontWeight: 600, letterSpacing: "0.08em" }}>ブラフ</div>
        </div>
      </div>
      <div style={{ display: "flex", width: 900, height: 26, borderRadius: 13, overflow: "hidden", border: `1px solid ${C.line}` }}>
        <div style={{ width: `${interpolate(barS, [0, 1], [0, 66.6])}%`, background: GRAD.gold }} />
        <div style={{ flex: 1, background: GRAD.silver }} />
      </div>
    </Stage>
  );
};

/* ============ 11 無差別（天秤） ============ */
export const S11Indiff: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const settle = Math.max(0, 1 - frame / F(0.45));
  const ang = osc(frame, 0.06) * 6 * settle + osc(frame, 0.03) * 1.2; // 揺れて水平へ、以後わずかに
  const pan = (label: string, side: number) => (
    <div style={{ position: "absolute", left: 450 + side * 250 - 90, top: 100 + side * ang * 3.2, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 3, height: 64, background: C.line }} />
      <div style={{ width: 180, height: 74, borderRadius: "0 0 90px 90px", border: `2px solid ${C.gold}`, borderTop: "none", background: "rgba(200,169,107,0.08)", display: "grid", placeItems: "center", color: C.ink, fontSize: 34, fontWeight: 600 }}>{label}</div>
    </div>
  );
  return (
    <Stage gap={30}>
      <Kicker delay={2}>均衡点 ・ インディファレンス</Kicker>
      <div style={{ position: "relative", width: 900, height: 300, margin: "10px auto 0" }}>
        <div style={{ position: "absolute", left: 450 - 4, top: 54, width: 8, height: 190, background: C.line }} />
        <div style={{ position: "absolute", left: 450 - 70, bottom: 10, width: 140, height: 16, borderRadius: 6, background: C.line }} />
        <div style={{ position: "absolute", left: 450 - 250, top: 90, width: 500, height: 8, background: GRAD.gold, borderRadius: 4, transform: `rotate(${ang}deg)`, transformOrigin: "center" }} />
        {pan("コール", -1)}
        {pan("降りる", 1)}
      </div>
      <div style={{ textAlign: "center" }}><Stamp delay={F(0.2)} fontSize={58}>無差別 ・ EV は同じ</Stamp></div>
    </Stage>
  );
};

/* ============ 12 レンジ ============ */
export const S12Ranges: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const range = ["Ah", "Ks", "Qd", "Jc", "Ts", "9h"];
  return (
    <Stage gap={44}>
      <Kicker delay={2}>GTOの思考法 ・ レンジで考える</Kicker>
      <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 30, color: C.silver }}>1つに決めつけ</div>
          <Card card="Kh" w={128} frame={frame} delay={F(0.08)} rise={40} dim />
        </div>
        <div style={{ fontFamily: LATIN, fontSize: 74, color: C.muted, transform: `translateX(${osc(frame, 0.1) * 6}px)` }}>→</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 32, color: C.gold, fontWeight: 600 }}>ありえる「範囲」</div>
          <div style={{ display: "flex" }}>
            {range.map((c, i) => (
              <div key={i} style={{ margin: "0 -16px", transform: `rotate(${(i - 2.5) * 7}deg) translateY(${osc(frame, 0.06, i) * 4}px)` }}>
                <Card card={c} w={116} frame={frame} delay={F(0.35) + i * 6} rise={70} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
};

/* ============ 13 GTO vs エクスプロイト（振り子） ============ */
export const S13Exploit: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const sw = osc(frame, 0.05) * 26;
  const panel = (title: string, sub: string, col: string) => (
    <div style={{ flex: 1, background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012))", border: `1px solid ${col}66`, borderRadius: 18, padding: "34px 40px", textAlign: "center" }}>
      <div style={{ fontSize: 50, fontWeight: 700, color: col, marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 34, color: C.muted }}>{sub}</div>
    </div>
  );
  return (
    <Stage gap={30}>
      <Kicker delay={2}>2つの戦略</Kicker>
      <div style={{ position: "relative", height: 90 }}>
        <div style={{ position: "absolute", left: "50%", top: 0, width: 2, height: 40, background: C.line, transform: `translateX(-50%) rotate(${sw}deg)`, transformOrigin: "top center" }} />
        <div style={{ position: "absolute", left: `calc(50% + ${Math.sin((sw * Math.PI) / 180) * 40}px)`, top: 34, transform: "translateX(-50%)" }}><Chip size={40} gold /></div>
      </div>
      <div style={{ display: "flex", gap: 44 }}>
        <Reveal delay={8} style={{ flex: 1 }}>{panel("GTO ・ 守り", "搾取されない基準", C.gold)}</Reveal>
        <Reveal delay={16} style={{ flex: 1 }}>{panel("エクスプロイト ・ 攻め", "相手のミスを突く", C.silver)}</Reveal>
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
    <Stage justify="center" gap={20}>
      <Kicker delay={2}>順番が大切</Kicker>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 20, transform: `translateY(${osc(frame, 0.05) * 4}px)` }}>
        <div style={{ width: 760, padding: "24px", borderRadius: 14, background: "linear-gradient(180deg, rgba(169,175,179,0.14), rgba(169,175,179,0.04))", border: `1px solid ${C.silver}66`, textAlign: "center", opacity: interpolate(drop, [0, 1], [0, 1]), transform: `translateY(${interpolate(drop, [0, 1], [-120, 0])}px)` }}>
          <span style={{ fontSize: 46, fontWeight: 700, color: C.silver }}>エクスプロイト ・ 応用</span>
        </div>
        <div style={{ width: 1080, padding: "30px", borderRadius: 14, background: "linear-gradient(180deg, rgba(200,169,107,0.16), rgba(200,169,107,0.05))", border: `1px solid ${C.gold}`, textAlign: "center" }}>
          <span style={{ fontSize: 52, fontWeight: 700, color: C.gold }}>GTO ・ 土台</span>
        </div>
      </div>
    </Stage>
  );
};

/* ============ 15 なぜ今（AI ▶ PRO） ============ */
export const S15Solved: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const rows = [["2015", "Cepheus"], ["2017", "Libratus"], ["2019", "Pluribus"]];
  return (
    <Stage gap={26}>
      <Kicker delay={2}>なぜ今 ・ GTOは共通言語</Kicker>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r, i) => {
          const s = spring({ frame: frame - F(0.12 + i * 0.18), fps: 30, config: { damping: 18 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateX(${interpolate(s, [0, 1], [-60, 0])}px)` }}>
              <span style={{ fontFamily: LATIN, fontSize: 58, fontWeight: 600, color: C.gold, width: 150 }}>{r[0]}</span>
              <span style={{ fontFamily: LATIN, fontSize: 44, fontWeight: 600, width: 240 }}>{r[1]}</span>
              <span style={{ fontSize: 40, fontWeight: 700, color: C.silver }}>AI</span>
              <span style={{ fontFamily: LATIN, fontSize: 40, color: C.gold, transform: `scale(${1 + 0.15 * pulse(frame, 0.3, i)})` }}>▶</span>
              <span style={{ fontSize: 34, color: C.muted }}>トッププロに勝利</span>
            </div>
          );
        })}
      </div>
      <Reveal delay={F(0.7)}><div style={{ fontSize: 56, fontWeight: 700 }}>GTO <span style={{ color: C.muted, fontSize: 40 }}>＝</span> <span style={{ color: C.gold }}>現代の共通言語</span></div></Reveal>
    </Stage>
  );
};

/* ============ 16 まとめ（モンタージュ） ============ */
export const S16Summary: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const items = [
    { k: "均衡", d: "搾取されない", col: C.ink },
    { k: "2 : 1", d: "バリュー:ブラフ", col: C.gold },
    { k: "土台", d: "その上に応用", col: C.silver },
  ];
  return (
    <Stage gap={50}>
      <Kicker delay={2}>今日のまとめ</Kicker>
      <div style={{ display: "flex", gap: 50, justifyContent: "center" }}>
        {items.map((it, i) => {
          const s = spring({ frame: frame - F(0.12 + i * 0.22), fps: 30, config: { damping: 12, stiffness: 130 } });
          return (
            <div key={i} style={{ flex: 1, textAlign: "center", opacity: interpolate(s, [0, 1], [0, 1]), transform: `scale(${interpolate(s, [0, 1], [0.7, 1])}) translateY(${osc(frame, 0.05, i) * 5}px)` }}>
              <div style={{ fontFamily: LATIN, fontSize: 84, fontWeight: 700, color: it.col }}>{i + 1}</div>
              <div style={{ fontSize: 60, fontWeight: 700, color: it.col, margin: "6px 0" }}>{it.k}</div>
              <div style={{ fontSize: 34, color: C.muted }}>{it.d}</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

/* ============ 17 次回 ============ */
export const S17Next: React.FC<SP> = () => (
  <Stage justify="center" gap={40}>
    <Kicker delay={2}>次回</Kicker>
    <div style={{ fontSize: 56, fontWeight: 600, color: C.inkSoft }}>
      第2回　<GradientText gradient={GRAD.gold} fontSize={94} weight={700} delay={12}>期待値（EV）</GradientText>
    </div>
    <div style={{ marginTop: 10 }}><Stamp delay={60} fontSize={52} color={C.gold}>チャンネル登録をお願いします</Stamp></div>
  </Stage>
);

export const SCENES: Record<string, React.FC<SP>> = {
  title: S01Title, hook: S02Hook, series: S03Series, def: S04Def, unexploitable: S05Shield,
  janken: S06Janken, jankenExploit: S07Bias, river: S08River, potodds: S09PotOdds, ratio: S10Ratio,
  indiff: S11Indiff, ranges: S12Ranges, exploit: S13Exploit, foundation: S14Foundation, solved: S15Solved,
  summary: S16Summary, next: S17Next,
};
