import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import { C, FONT, GRAD } from "./theme";
import { LATIN } from "./fonts";
import { Card, CardRow } from "./components/Card";
import { GradientText, Kicker, Reveal, Stamp } from "./components/ui";
import { HandIcon, PokerTable } from "./components/parts";

type SP = { dur: number };
const EO = Easing.out(Easing.cubic);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// 一度きりのイージング補間（frame a→b を 0→1）
const ramp = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: EO });

const Stage: React.FC<{ children: React.ReactNode; justify?: string; gap?: number }> = ({
  children, justify = "center", gap = 46,
}) => (
  <AbsoluteFill style={{ fontFamily: FONT, color: C.ink, padding: "72px 100px 220px", display: "flex", flexDirection: "column", justifyContent: justify, gap }}>
    {children}
  </AbsoluteFill>
);
const TopKicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", top: 72, left: 100 }}><Kicker delay={2}>{children}</Kicker></div>
);
const Chip: React.FC<{ size?: number; gold?: boolean; style?: React.CSSProperties }> = ({ size = 54, gold = false, style }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: gold ? "radial-gradient(circle at 40% 32%, #f0d79a, #c8a96b 72%)" : "radial-gradient(circle at 42% 32%, #2c2c2e, #0f0f11 72%)", border: `2px solid ${gold ? C.goldSoft : C.gold}`, boxShadow: "0 4px 10px rgba(0,0,0,0.55)", ...style }} />
);
const Stack: React.FC<{ n?: number; size?: number; gold?: boolean }> = ({ n = 5, size = 88, gold }) => (
  <div style={{ position: "relative", width: size, height: size + (n - 1) * size * 0.22 }}>
    {Array.from({ length: n }).map((_, k) => <div key={k} style={{ position: "absolute", bottom: k * size * 0.22, left: 0 }}><Chip size={size} gold={gold} /></div>)}
  </div>
);

/* ============ 01 タイトル ============ */
export const S01Title: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const cards = ["As", "Kh", "Qd", "Jc", "Ts"];
  const gleam = ramp(frame, F(0.55), F(0.85));
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage gap={32}>
        <Reveal delay={2}><div style={{ display: "inline-block", fontFamily: LATIN, padding: "10px 34px", border: `1px solid ${C.gold}`, color: C.gold, borderRadius: 999, fontSize: 30, fontWeight: 600, letterSpacing: "0.26em" }}>POKER GTO STRATEGY</div></Reveal>
        <GradientText gradient={GRAD.ink} fontSize={152} weight={700} delay={8}>GTOとは何か？</GradientText>
        <GradientText gradient={GRAD.gold} fontSize={108} weight={700} delay={20}>ポーカー戦略の全体像</GradientText>
      </Stage>
      <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {cards.map((c, i) => <div key={i} style={{ transform: `rotate(${(i - 2) * 9}deg) translateY(${Math.abs(i - 2) * 26}px)`, margin: "0 -26px" }}><Card card={c} w={158} frame={frame} delay={30 + i * 6} rise={160} float={false} /></div>)}
        {/* 一度きりの光の帯 */}
        <div style={{ position: "absolute", top: -40, left: `${interpolate(gleam, [0, 1], [-10, 110])}%`, width: "16%", height: 420, background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.18), transparent)", transform: "skewX(-16deg)", opacity: gleam > 0 && gleam < 1 ? 1 : 0 }} />
      </div>
    </AbsoluteFill>
  );
};

/* ============ 02 フック：運→戦略（× 消し・置換・上昇チャート・積み上げ） ============ */
export const S02Hook: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const un = interpolate(frame, [F(0.34), F(0.46)], [1, 0.18], clamp);
  const strike = ramp(frame, F(0.28), F(0.42)) * 100;
  const senS = spring({ frame: frame - F(0.46), fps: 30, config: { damping: 13, stiffness: 130 } });
  const draw = ramp(frame, F(0.5), F(0.96));      // 上昇チャートの描画
  const stackN = Math.floor(interpolate(frame, [F(0.52), F(0.96)], [0, 9], clamp));
  const LEN = 660;
  return (
    <Stage gap={40}>
      <Kicker delay={2}>なぜ、あの人は勝ち続けるのか</Kicker>
      <div style={{ display: "flex", alignItems: "center", gap: 60, fontSize: 150, fontWeight: 700, height: 200 }}>
        <div style={{ position: "relative", opacity: un }}>
          <span style={{ color: C.muted }}>運</span>
          <div style={{ position: "absolute", top: "52%", left: 0, width: `${strike}%`, height: 8, background: "#c25b4e", borderRadius: 4 }} />
        </div>
        <span style={{ fontFamily: LATIN, color: C.gold, fontWeight: 300, fontSize: 90, opacity: interpolate(senS, [0, 0.4], [0, 1], clamp) }}>→</span>
        <div style={{ opacity: interpolate(senS, [0, 0.5], [0, 1], clamp), transform: `scale(${interpolate(senS, [0, 1], [0.6, 1])})` }}>
          <GradientText gradient={GRAD.gold} fontSize={168} weight={700} delay={F(0.46)}>戦略</GradientText>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 120, height: 300, marginTop: 10 }}>
        {/* 上昇する収益ライン（一度きりの描画） */}
        <svg width={560} height={260} viewBox="0 0 560 260">
          <line x1="10" y1="10" x2="10" y2="240" stroke={C.line} strokeWidth="2" />
          <line x1="10" y1="240" x2="550" y2="240" stroke={C.line} strokeWidth="2" />
          <polyline points="10,225 110,195 200,210 300,130 400,140 550,25" fill="none" stroke="url(#gg)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - draw)} />
          <defs><linearGradient id="gg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#a37f3c" /><stop offset="1" stopColor="#ecd6a6" /></linearGradient></defs>
        </svg>
        {/* 積み上がる勝ち分（一度きり） */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", width: 130, height: 112 + 8 * 22 }}>
            {Array.from({ length: stackN }).map((_, k) => <div key={k} style={{ position: "absolute", bottom: k * 22, left: 9 }}><Chip size={112} gold /></div>)}
          </div>
          <div style={{ whiteSpace: "nowrap", color: C.gold, fontWeight: 600, fontSize: 30 }}>勝ち続ける</div>
        </div>
      </div>
    </Stage>
  );
};

/* ============ 03 シリーズ：階段を積み上げ ============ */
export const S03Series: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const climb = interpolate(frame, [F(0.15), F(0.9)], [0, 4.9], clamp);
  return (
    <Stage gap={54}>
      <Kicker delay={2}>基礎から、一段ずつ</Kicker>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 30, height: 480, justifyContent: "center" }}>
        {[0, 1, 2, 3, 4].map((k) => {
          const s = spring({ frame: frame - F(0.08 + k * 0.16), fps: 30, config: { damping: 15, stiffness: 120 } });
          const on = climb >= k - 0.2;
          return (
            <div key={k} style={{ width: 210, height: (150 + k * 68) * interpolate(s, [0, 1], [0.1, 1]), borderRadius: 16, background: on ? GRAD.gold : "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))", border: `1px solid ${on ? C.gold : C.line}`, opacity: interpolate(s, [0, 1], [0, 1]), display: "grid", placeItems: "end center", paddingBottom: 18, boxShadow: on ? "0 0 44px rgba(200,169,107,0.28)" : "none" }}>
              <span style={{ fontFamily: LATIN, fontSize: 46, fontWeight: 600, color: on ? "#12100a" : C.muted }}>{`0${k + 1}`}</span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

/* ============ 04 定義：文字が集合＋下線ドロー＋スタンプ ============ */
export const S04Def: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const words = ["Game", "Theory", "Optimal"];
  const scatter = [[-260, -120], [0, 160], [280, -140]];
  const under = ramp(frame, F(0.42), F(0.62)) * 100;
  return (
    <Stage gap={48}>
      <Kicker delay={2}>GTO とは</Kicker>
      <div style={{ position: "relative", fontFamily: LATIN, fontSize: 150, fontWeight: 600, letterSpacing: "0.02em", display: "flex", gap: 30 }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - F(0.05 + i * 0.12), fps: 30, config: { damping: 15 } });
          return (
            <span key={i} style={{ display: "inline-block", color: i < 3 ? C.gold : C.ink, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translate(${scatter[i][0] * (1 - s)}px, ${scatter[i][1] * (1 - s)}px) rotate(${(1 - s) * (i - 1) * 8}deg)` }}>
              <span style={{ color: C.gold }}>{w[0]}</span><span style={{ color: C.ink }}>{w.slice(1)}</span>
            </span>
          );
        })}
        <div style={{ position: "absolute", bottom: -18, left: 0, width: `${under}%`, height: 4, background: C.gold }} />
      </div>
      <div style={{ marginTop: 20 }}><Stamp delay={F(0.66)} fontSize={80}>＝ 搾取されない戦略</Stamp></div>
    </Stage>
  );
};

/* ============ 05 盾：連続する一度きりの攻撃（ループしない） ============ */
export const S05Shield: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const cx = 960, cy = 480, R = 430;
  const form = spring({ frame: frame - F(0.06), fps: 30, config: { damping: 16 } });
  const N = 20;
  // 各攻撃は別々の時刻・角度・速度で一度だけ飛来（複数が同時に飛ぶが繰り返さない）
  const attacks = Array.from({ length: N }).map((_, k) => {
    const start = F(0.08 + k * (0.86 / N));
    const ang = (k * 2.399) % (Math.PI * 2);   // 黄金角で毎回ばらける
    const life = 78 + (k % 5) * 9;
    return { start, ang, life, size: 40 + (k % 3) * 10 };
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <TopKicker>ナッシュ均衡 ・ 搾取されない</TopKicker>
      {attacks.map((a, k) => {
        const local = frame - a.start;
        if (local < 0 || local > a.life) return null;
        const p = local / a.life;
        const dist = interpolate(p, [0, 0.5, 0.62, 1], [R, 172, 172, R * 0.8]);
        const op = interpolate(p, [0, 0.12, 0.55, 0.85, 1], [0, 1, 1, 0.4, 0]);
        const hit = p > 0.48 && p < 0.66;
        return (
          <React.Fragment key={k}>
            <div style={{ position: "absolute", left: cx + Math.cos(a.ang) * dist - a.size / 2, top: cy + Math.sin(a.ang) * dist - a.size / 2, opacity: op }}><Chip size={a.size} /></div>
            {hit && <div style={{ position: "absolute", left: cx - 165, top: cy - 165, width: 330, height: 330, borderRadius: "50%", border: `2px solid rgba(200,169,107,${interpolate(p, [0.48, 0.66], [0.5, 0])})`, transform: `scale(${interpolate(p, [0.48, 0.66], [1, 1.4])})` }} />}
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: cx - 158, top: cy - 158, width: 316, height: 316, borderRadius: "50%", opacity: interpolate(form, [0, 1], [0, 1]), transform: `scale(${interpolate(form, [0, 1], [0.4, 1])})`, background: "radial-gradient(circle at 50% 40%, rgba(200,169,107,0.18), rgba(0,0,0,0.2) 70%)", border: `2px solid ${C.gold}`, boxShadow: "0 0 70px rgba(200,169,107,0.35)", display: "grid", placeItems: "center" }}>
        <span style={{ fontFamily: LATIN, fontSize: 100, fontWeight: 600, color: C.goldSoft }}>GTO</span>
      </div>
    </AbsoluteFill>
  );
};

/* ============ 06 じゃんけん：減速して止まるルーレット ============ */
export const S06Janken: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const kinds: ("rock" | "scissors" | "paper")[] = ["rock", "scissors", "paper"];
  const labels = ["グー", "チョキ", "パー"];
  const cols = [C.ink, C.gold, C.silver];
  // 回転量：速く回って減速し止まる（ループしない）
  const spin = interpolate(frame, [F(0.18), F(0.72)], [0, 26], { ...clamp, easing: Easing.out(Easing.poly(4)) });
  const sel = Math.floor(spin) % 3;
  const seg = 120;
  return (
    <Stage gap={40}>
      <Kicker delay={2}>直感例 I ・ じゃんけん</Kicker>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
        <div style={{ position: "relative", width: 360, height: 360 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(${C.ink} 0 ${seg}deg, ${C.gold} ${seg}deg ${2 * seg}deg, ${C.silver} ${2 * seg}deg 360deg)`, boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }} />
          <div style={{ position: "absolute", inset: "24%", borderRadius: "50%", background: C.bg, display: "grid", placeItems: "center", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }}>
            <HandIcon kind={kinds[sel]} size={150} color={cols[sel]} />
          </div>
          {/* 止まり位置を指すポインタ */}
          <div style={{ position: "absolute", top: -6, left: "50%", width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: `26px solid ${C.gold}`, transform: "translateX(-50%)" }} />
        </div>
        <div style={{ display: "flex", gap: 44 }}>
          {kinds.map((k, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(spring({ frame: frame - F(0.04) - i * 6, fps: 30, config: { damping: 200 } }), [0, 1], [0.35, 1]) }}>
              <HandIcon kind={k} size={140} color={cols[i]} />
              <div style={{ fontSize: 40, fontWeight: 600, color: cols[i] }}>{labels[i]}</div>
              <div style={{ fontFamily: LATIN, fontSize: 34, color: C.muted }}>1/3</div>
            </div>
          ))}
        </div>
      </div>
      <Reveal delay={F(0.8)}><div style={{ fontSize: 48, fontWeight: 600, textAlign: "center" }}>均衡 <span style={{ color: C.muted, fontSize: 36 }}>＝ 誰にも打ち負かされない</span></div></Reveal>
    </Stage>
  );
};

/* ============ 07 偏り→搾取：バー成長＋一度きりのチップ流出 ============ */
export const S07Bias: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const you = interpolate(frame, [F(0.06), F(0.42)], [0.33, 0.66], { ...clamp, easing: EO });
  const opp = interpolate(frame, [F(0.34), F(0.72)], [0.33, 0.76], { ...clamp, easing: EO });
  const flow = Array.from({ length: 6 }).map((_, k) => F(0.4 + k * 0.05));
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
      <div style={{ display: "flex", alignItems: "flex-end", gap: 220, height: 470, position: "relative", justifyContent: "center" }}>
        {col("あなた（グー多め）", you, GRAD.gold, C.gold, "rock")}
        {col("相手（パー増）", opp, GRAD.silver, C.silver, "paper")}
        {flow.map((st, k) => {
          const local = frame - st; if (local < 0 || local > 30) return null;
          const p = local / 30;
          return <div key={k} style={{ position: "absolute", left: interpolate(p, [0, 1], [660, 1160]), top: interpolate(p, [0, 0.5, 1], [130, 60, 130]), opacity: interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0]) }}><Chip size={44} gold /></div>;
        })}
      </div>
      <Reveal delay={F(0.5)}><div style={{ fontSize: 72, fontWeight: 700, textAlign: "center" }}><span style={{ color: C.gold }}>偏り</span> <span style={{ color: C.muted, fontFamily: LATIN }}>→</span> <span style={{ color: C.silver }}>搾取される</span></div></Reveal>
    </Stage>
  );
};

/* ============ 08 リバー（ポーカーテーブル） ============ */
export const S08River: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <TopKicker>直感例 II ・ リバー（実戦の場面）</TopKicker>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 30, paddingBottom: 130 }}>
        <div style={{ transform: "scale(0.92)" }}>
          <PokerTable board={["Ks", "9s", "4d", "7h", "2d"]} hero={["Kh", "Qc"]} frame={frame} boardDelay={F(0.08)} heroDelay={F(0.36)} potDelay={F(0.56)} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 150, right: 120, fontSize: 34, color: C.gold, fontWeight: 600, opacity: ramp(frame, F(0.36), F(0.46)) }}>あなた ＝ ブラフキャッチャー</div>
    </AbsoluteFill>
  );
};

/* ============ 09 ポットオッズ（計算・bb） ============ */
export const S09PotOdds: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const t = [F(0.12), F(0.26), F(0.44)];
  const count = t.filter((tt) => frame >= tt).length;
  const total = count * 100;
  const fEq = spring({ frame: frame - F(0.6), fps: 30, config: { damping: 200 } });
  const fPct = spring({ frame: frame - F(0.78), fps: 30, config: { damping: 200 } });
  const labels = ["ポット 100", "相手 100", "あなた 100"];
  return (
    <Stage gap={30}>
      <Kicker delay={2}>コールすべき？ ・ ポットオッズ</Kicker>
      <div style={{ display: "flex", alignItems: "center", gap: 90, justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
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
        <div style={{ opacity: interpolate(fEq, [0, 1], [0, 1]), transform: `translateX(${interpolate(fEq, [0, 1], [40, 0])}px)` }}>
          <div style={{ fontSize: 40, color: C.inkSoft, marginBottom: 14 }}>必要勝率</div>
          <div style={{ fontFamily: LATIN, fontSize: 76, fontWeight: 600, display: "flex", alignItems: "center", gap: 18 }}>
            <span>100</span><span style={{ color: C.muted }}>/</span><span>300</span><span style={{ color: C.muted }}>=</span><span style={{ color: C.gold }}>1/3</span>
          </div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 20, opacity: interpolate(fPct, [0, 1], [0, 1]) }}>
            <span style={{ fontSize: 40, color: C.inkSoft }}>≒</span>
            <GradientText gradient={GRAD.gold} fontSize={104} weight={700} delay={F(0.78)}>33%</GradientText>
          </div>
          <div style={{ marginTop: 22, display: "flex", gap: 14, alignItems: "center", opacity: interpolate(fPct, [0, 1], [0, 1]) }}>
            {[0, 1, 2].map((k) => <div key={k} style={{ width: 40, height: 40, borderRadius: "50%", background: k === 0 ? C.gold : "transparent", border: `2px solid ${C.gold}` }} />)}
            <span style={{ fontSize: 30, color: C.muted, marginLeft: 10 }}>3回に1回でトントン</span>
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
  const barS = ramp(frame, F(0.6), F(0.85));
  const link = ramp(frame, F(0.78), F(0.92));
  return (
    <Stage gap={40}>
      <Kicker delay={2}>相手はどう打つべきか</Kicker>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 56, fontSize: 100, fontWeight: 700 }}>
        <GradientText gradient={GRAD.gold} fontSize={100} weight={700} delay={F(0.06)}>バリュー 2</GradientText>
        <span style={{ color: C.muted, fontFamily: LATIN }}>:</span>
        <GradientText gradient={GRAD.silver} fontSize={100} weight={700} delay={F(0.16)}>ブラフ 1</GradientText>
      </div>
      <div style={{ display: "flex", gap: 70, alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 34 }}>
            <div style={{ display: "flex", gap: 10 }}>{["Kd", "Kc"].map((c, i) => <Card key={i} card={c} w={120} frame={frame} delay={F(0.24) + i * 5} rise={40} float={false} />)}</div>
            <div style={{ display: "flex", gap: 10 }}>{["9h", "9d"].map((c, i) => <Card key={i} card={c} w={120} frame={frame} delay={F(0.36) + i * 5} rise={40} float={false} />)}</div>
          </div>
          <div style={{ fontSize: 32, color: C.gold, fontWeight: 600, letterSpacing: "0.08em" }}>バリュー（本物）</div>
        </div>
        <div style={{ width: 1, alignSelf: "stretch", background: C.line }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 10 }}>{["As", "Js"].map((c, i) => <Card key={i} card={c} w={120} frame={frame} delay={F(0.5) + i * 5} rise={40} float={false} />)}</div>
          <div style={{ fontSize: 32, color: C.silver, fontWeight: 600, letterSpacing: "0.08em" }}>ブラフ</div>
        </div>
      </div>
      <div style={{ display: "flex", width: 1000, height: 30, borderRadius: 15, overflow: "hidden", border: `1px solid ${C.line}`, margin: "0 auto" }}>
        <div style={{ width: `${barS * 66.6}%`, background: GRAD.gold }} />
        <div style={{ flex: 1, background: GRAD.silver }} />
      </div>
      <div style={{ textAlign: "center", opacity: link, transform: `translateY(${(1 - link) * 14}px)`, fontSize: 42, fontWeight: 600 }}>
        あなたが勝てるのは <span style={{ color: C.silver }}>3回に1回</span> <span style={{ color: C.muted }}>＝</span> <span style={{ color: C.gold }}>あの33%と同じ</span>
      </div>
    </Stage>
  );
};

/* ============ 11 無差別：傾いた天秤が水平に settle（一度きり） ============ */
export const S11Indiff: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  // -12度に傾いた状態から水平へ、少しオーバーシュートして止まる
  const s = spring({ frame: frame - F(0.15), fps: 30, config: { damping: 9, stiffness: 60 } });
  const ang = interpolate(s, [0, 1], [-12, 0]);
  const CX = 960;
  const pan = (label: string, side: number) => (
    <div style={{ position: "absolute", left: CX + side * 300 - 110, top: 300 + side * ang * 4.2, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 3, height: 80, background: C.line }} />
      <div style={{ width: 220, height: 90, borderRadius: "0 0 110px 110px", border: `2px solid ${C.gold}`, borderTop: "none", background: "rgba(200,169,107,0.08)", display: "grid", placeItems: "center", color: C.ink, fontSize: 40, fontWeight: 600 }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <TopKicker>均衡点 ・ インディファレンス</TopKicker>
      <div style={{ position: "absolute", top: 172, left: 0, right: 0, textAlign: "center", fontSize: 40, color: C.inkSoft, fontWeight: 500, opacity: ramp(frame, F(0.08), F(0.24)) }}>
        勝てるのは <span style={{ color: C.gold, fontWeight: 700 }}>3回に1回</span> <span style={{ color: C.muted, fontFamily: LATIN }}>→</span> コールはちょうど<span style={{ color: C.gold, fontWeight: 700 }}>トントン</span>
      </div>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, height: 340 }}>
        <div style={{ position: "absolute", left: CX - 5, top: 60, width: 10, height: 220, background: C.line }} />
        <div style={{ position: "absolute", left: CX - 80, top: 278, width: 160, height: 18, borderRadius: 8, background: C.line }} />
        <div style={{ position: "absolute", left: CX - 300, top: 96, width: 600, height: 10, background: GRAD.gold, borderRadius: 5, transform: `rotate(${ang}deg)`, transformOrigin: "center" }} />
        {pan("コール", -1)}
        {pan("降りる", 1)}
      </div>
      <div style={{ position: "absolute", bottom: 200, left: 0, right: 0, textAlign: "center" }}><Stamp delay={F(0.55)} fontSize={70}>無差別 ・ EV は同じ</Stamp></div>
    </AbsoluteFill>
  );
};

/* ============ 12 レンジ：1枚→扇に展開 ============ */
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
          <Card card="Kh" w={150} frame={frame} delay={F(0.08)} rise={40} dim float={false} />
        </div>
        <div style={{ fontFamily: LATIN, fontSize: 90, color: C.muted, opacity: ramp(frame, F(0.24), F(0.34)) }}>→</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ fontSize: 36, color: C.gold, fontWeight: 600 }}>ありえる「範囲」</div>
          <div style={{ display: "flex" }}>
            {range.map((c, i) => <div key={i} style={{ margin: "0 -20px", transform: `rotate(${(i - 3.5) * 7}deg)` }}><Card card={c} w={130} frame={frame} delay={F(0.36) + i * 7} rise={90} float={false} /></div>)}
          </div>
        </div>
      </div>
    </Stage>
  );
};

/* ============ 13 GTO vs エクスプロイト：左右スライド＋積層の説明 ============ */
export const S13Exploit: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const panel = (delay: number, from: number, title: string, sub: string, col: string, kind: "rock" | "scissors") => {
    const s = spring({ frame: frame - delay, fps: 30, config: { damping: 16 } });
    return (
      <div style={{ flex: 1, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateX(${from * (1 - s)}px)`, background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012))", border: `1px solid ${col}66`, borderRadius: 20, padding: "44px 48px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><HandIcon kind={kind} size={100} color={col} /></div>
        <div style={{ fontSize: 56, fontWeight: 700, color: col, marginBottom: 12 }}>{title}</div>
        <div style={{ fontSize: 38, color: C.muted }}>{sub}</div>
      </div>
    );
  };
  return (
    <Stage gap={40}>
      <Kicker delay={2}>2つの戦略</Kicker>
      <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
        {panel(F(0.1), -140, "GTO ・ 守り", "搾取されない基準", C.gold, "rock")}
        <div style={{ fontFamily: LATIN, fontSize: 60, color: C.muted, opacity: ramp(frame, F(0.4), F(0.5)) }}>＋</div>
        {panel(F(0.28), 140, "エクスプロイト ・ 攻め", "相手のミスを突く", C.silver, "scissors")}
      </div>
      <Reveal delay={F(0.62)}><div style={{ fontSize: 46, fontWeight: 500, textAlign: "center", color: C.inkSoft }}><span style={{ color: C.gold, fontWeight: 700 }}>土台</span>の上に<span style={{ color: C.silver, fontWeight: 700 }}>応用</span>を乗せる</div></Reveal>
    </Stage>
  );
};

/* ============ 14 土台と応用：ブロックが落ちて積まれる ============ */
export const S14Foundation: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const base = spring({ frame: frame - F(0.12), fps: 30, config: { damping: 16 } });
  const drop = spring({ frame: frame - F(0.45), fps: 30, config: { damping: 11, stiffness: 110 } });
  return (
    <Stage justify="center" gap={22}>
      <Kicker delay={2}>順番が大切</Kicker>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, marginTop: 10 }}>
        <div style={{ width: 900, padding: "34px", borderRadius: 16, background: "linear-gradient(180deg, rgba(169,175,179,0.14), rgba(169,175,179,0.04))", border: `1px solid ${C.silver}66`, textAlign: "center", opacity: interpolate(drop, [0, 1], [0, 1]), transform: `translateY(${interpolate(drop, [0, 1], [-200, 0])}px)` }}>
          <span style={{ fontSize: 56, fontWeight: 700, color: C.silver }}>エクスプロイト ・ 応用</span>
        </div>
        <div style={{ width: 1300, padding: "44px", borderRadius: 16, background: "linear-gradient(180deg, rgba(200,169,107,0.16), rgba(200,169,107,0.05))", border: `1px solid ${C.gold}`, textAlign: "center", opacity: interpolate(base, [0, 1], [0, 1]), transform: `scale(${interpolate(base, [0, 1], [0.9, 1])})` }}>
          <span style={{ fontSize: 66, fontWeight: 700, color: C.gold }}>GTO ・ 土台</span>
        </div>
      </div>
    </Stage>
  );
};

/* ============ 15 なぜ今：年表が順に ============ */
export const S15Solved: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const rows = [["2015", "Cepheus"], ["2017", "Libratus"], ["2019", "Pluribus"]];
  return (
    <Stage gap={34}>
      <Kicker delay={2}>なぜ今 ・ GTOは共通言語</Kicker>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1500, margin: "0 auto", width: "100%" }}>
        {rows.map((r, i) => {
          const s = spring({ frame: frame - F(0.1 + i * 0.2), fps: 30, config: { damping: 18 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 40, padding: "18px 20px", borderBottom: `1px solid ${C.line}`, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateX(${interpolate(s, [0, 1], [-80, 0])}px)` }}>
              <span style={{ fontFamily: LATIN, fontSize: 72, fontWeight: 600, color: C.gold, width: 180 }}>{r[0]}</span>
              <span style={{ fontFamily: LATIN, fontSize: 54, fontWeight: 600, width: 300 }}>{r[1]}</span>
              <span style={{ fontSize: 46, fontWeight: 700, color: C.silver }}>AI</span>
              <span style={{ fontFamily: LATIN, fontSize: 46, color: C.gold }}>▶</span>
              <span style={{ fontSize: 38, color: C.muted }}>トッププロに勝利</span>
            </div>
          );
        })}
      </div>
      <Reveal delay={F(0.74)}><div style={{ fontSize: 64, fontWeight: 700, textAlign: "center" }}>GTO <span style={{ color: C.muted, fontSize: 44 }}>＝</span> <span style={{ color: C.gold }}>現代の共通言語</span></div></Reveal>
    </Stage>
  );
};

/* ============ 16 まとめ：順に現れる ============ */
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
          const s = spring({ frame: frame - F(0.12 + i * 0.24), fps: 30, config: { damping: 12, stiffness: 130 } });
          return (
            <div key={i} style={{ flex: 1, textAlign: "center", opacity: interpolate(s, [0, 1], [0, 1]), transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})` }}>
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

/* ============ 17 次回 ============ */
export const S17Next: React.FC<SP> = ({ dur }) => {
  const frame = useCurrentFrame();
  const F = (x: number) => Math.round(x * dur);
  const cards = ["Ah", "Ks", "Qh", "Js", "Td"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage justify="center" gap={44}>
        <Kicker delay={2}>ご視聴ありがとうございました</Kicker>
        <GradientText gradient={GRAD.gold} fontSize={104} weight={700} delay={10}>また次回、お会いしましょう</GradientText>
        <div style={{ marginTop: 10 }}><Stamp delay={40} fontSize={56} color={C.gold}>チャンネル登録・高評価をお願いします</Stamp></div>
      </Stage>
      <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {cards.map((c, i) => <div key={i} style={{ transform: `rotate(${(i - 2) * 9}deg) translateY(${Math.abs(i - 2) * 24}px)`, margin: "0 -24px" }}><Card card={c} w={132} frame={frame} delay={F(0.3) + i * 6} rise={140} float={false} /></div>)}
      </div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC<SP>> = {
  title: S01Title, hook: S02Hook, series: S03Series, def: S04Def, unexploitable: S05Shield,
  janken: S06Janken, jankenExploit: S07Bias, river: S08River, potodds: S09PotOdds, ratio: S10Ratio,
  indiff: S11Indiff, ranges: S12Ranges, exploit: S13Exploit, foundation: S14Foundation, solved: S15Solved,
  summary: S16Summary, next: S17Next,
};
