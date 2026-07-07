import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, GRAD } from "./theme";
import { LATIN } from "./fonts";
import { Card, CardRow } from "./components/Card";
import { Bar, ChipStack, Donut, GradientText, Kicker, LightSweep, Panel, Reveal, Stamp } from "./components/ui";

const Stage: React.FC<{ children: React.ReactNode; justify?: string; gap?: number }> = ({
  children, justify = "center", gap = 40,
}) => (
  <AbsoluteFill style={{ fontFamily: FONT, color: C.ink, padding: "96px 128px", display: "flex", flexDirection: "column", justifyContent: justify, gap }}>
    {children}
  </AbsoluteFill>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "inline-block", fontFamily: LATIN, padding: "10px 32px", border: `1px solid ${C.gold}`, color: C.gold, borderRadius: 999, fontSize: 28, fontWeight: 600, letterSpacing: "0.24em" }}>
    {children}
  </div>
);

/* ---------- 01 タイトル ---------- */
export const S01Title: React.FC = () => {
  const frame = useCurrentFrame();
  const cards = ["As", "Kh", "Qd", "Jc", "Ts"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage gap={34}>
        <Reveal delay={2}><Pill>POKER GTO ・ 全30回シリーズ</Pill></Reveal>
        <LightSweep delay={28} duration={52}>
          <GradientText gradient={GRAD.ink} fontSize={126} weight={700} delay={8}>GTOとは何か？</GradientText>
        </LightSweep>
        <GradientText gradient={GRAD.gold} fontSize={96} weight={700} delay={16} shine>ポーカー戦略の全体像</GradientText>
        <Reveal delay={30}>
          <div style={{ fontSize: 40, color: C.muted, letterSpacing: "0.08em" }}>第1回 ｜ 本格的なポーカー戦略を、美しく、わかりやすく。</div>
        </Reveal>
      </Stage>
      <div style={{ position: "absolute", bottom: -36, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {cards.map((c, i) => (
          <div key={i} style={{ transform: `rotate(${(i - 2) * 8}deg) translateY(${Math.abs(i - 2) * 24}px)`, margin: "0 -22px" }}>
            <Card card={c} w={148} frame={frame} delay={36 + i * 5} rise={130} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 02 フック ---------- */
export const S02Hook: React.FC = () => (
  <Stage>
    <Kicker delay={2}>なぜ、あの人は勝ち続けるのか</Kicker>
    <Reveal delay={12}>
      <div style={{ fontSize: 128, fontWeight: 700, display: "flex", alignItems: "center", gap: 44 }}>
        <span style={{ color: C.muted }}>運？</span>
        <span style={{ color: C.gold, fontSize: 64, fontWeight: 300 }}>—</span>
        <GradientText gradient={GRAD.gold} fontSize={138} weight={700} delay={16} shine>戦略</GradientText>
      </div>
    </Reveal>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 70, marginTop: 12 }}>
      <Reveal delay={26} style={{ maxWidth: 1080 }}>
        <div style={{ fontSize: 46, lineHeight: 1.6, color: C.inkSoft, fontWeight: 400 }}>
          同じカード、同じテーブル。長い目で見て勝つ人は、<span style={{ color: C.gold, fontWeight: 600 }}>戦略</span>で勝っている。<br />その土台が、<span style={{ color: C.gold, fontWeight: 600 }}>GTO</span>。
        </div>
      </Reveal>
      <ChipStack n={6} delay={40} label="勝ち続ける" />
    </div>
  </Stage>
);

/* ---------- 03 定義 ---------- */
export const S03Def: React.FC = () => (
  <Stage>
    <Kicker delay={2}>GTO とは</Kicker>
    <Reveal delay={10}>
      <div style={{ fontFamily: LATIN, fontSize: 120, fontWeight: 600, letterSpacing: "0.02em" }}>
        <span style={{ color: C.gold }}>G</span>ame <span style={{ color: C.gold }}>T</span>heory <span style={{ color: C.gold }}>O</span>ptimal
      </div>
    </Reveal>
    <Reveal delay={20}>
      <div style={{ fontSize: 50, color: C.inkSoft, fontWeight: 400 }}>＝ ゲーム理論的に<span style={{ color: C.gold, fontWeight: 600 }}>最適</span>な戦略</div>
    </Reveal>
    <div style={{ marginTop: 28 }}>
      <Stamp delay={40} fontSize={64}>＝ 相手に搾取されない戦略</Stamp>
    </div>
  </Stage>
);

/* ---------- 04 じゃんけん ---------- */
export const S04Janken: React.FC = () => {
  const rows = [
    { c: C.ink, t: "グー　1/3" },
    { c: C.gold, t: "チョキ 1/3" },
    { c: C.silver, t: "パー　1/3" },
  ];
  return (
    <Stage gap={34}>
      <Kicker delay={2}>直感例 I ・ じゃんけん</Kicker>
      <div style={{ display: "flex", alignItems: "center", gap: 96 }}>
        <Donut size={356} delay={8} label={"1/3\nずつ"} colors={[C.ink, C.gold, C.silver]} />
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {rows.map((r, i) => (
            <Reveal key={i} delay={16 + i * 6}>
              <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 44, fontWeight: 500 }}>
                <span style={{ width: 34, height: 34, borderRadius: 6, background: r.c }} />
                {r.t}
              </div>
            </Reveal>
          ))}
          <Reveal delay={40}>
            <div style={{ fontSize: 38, color: C.muted, marginTop: 12, lineHeight: 1.5 }}>
              ランダムに1/3ずつ出せば、<br />相手は何をしても<span style={{ color: C.ink, fontWeight: 600 }}>勝率五分</span>。<br />これが「均衡」＝GTO。
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal delay={380} style={{ marginTop: 12 }}>
        <Panel accent="rgba(200,169,107,0.35)">
          <div style={{ fontSize: 46, fontWeight: 600, display: "flex", gap: 26, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: C.gold }}>グーを多めに</span>
            <span style={{ color: C.muted, fontWeight: 300 }}>—</span>
            <span style={{ color: C.silver }}>相手はパーを増やす</span>
            <span style={{ color: C.muted, fontWeight: 300 }}>—</span>
            <span style={{ color: C.gold }}>搾取される</span>
          </div>
          <div style={{ fontSize: 34, color: C.muted, marginTop: 14 }}>偏り＝つけ込む隙。均衡に近づくほど、搾取されない。</div>
        </Panel>
      </Reveal>
    </Stage>
  );
};

/* ---------- 05 リバー（実カード） ---------- */
export const S05River: React.FC = () => {
  const frame = useCurrentFrame();
  const board = ["Ks", "9s", "4d", "7h", "2d"];
  const hero = ["Kh", "Qc"];
  return (
    <Stage gap={30}>
      <Kicker delay={2}>直感例 II ・ リバー（最後のカード）</Kicker>
      <div>
        <Reveal delay={6}><div style={{ fontSize: 30, color: C.muted, marginBottom: 14, letterSpacing: "0.18em" }}>BOARD</div></Reveal>
        <CardRow cards={board} w={148} frame={frame} startDelay={10} stagger={7} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 74, marginTop: 6 }}>
        <div>
          <Reveal delay={60}><div style={{ fontSize: 30, color: C.gold, marginBottom: 14, letterSpacing: "0.14em", fontWeight: 600 }}>あなた ・ ブラフキャッチャー</div></Reveal>
          <CardRow cards={hero} w={148} frame={frame} startDelay={64} stagger={7} ring={C.gold} />
        </div>
        <Reveal delay={300} style={{ flex: 1 }}>
          <Panel accent="rgba(200,169,107,0.32)" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <ChipStack n={5} delay={306} />
            <div style={{ fontSize: 40, lineHeight: 1.45, color: C.inkSoft }}>
              相手が<span style={{ color: C.gold, fontWeight: 700 }}>ポットと同額</span>をベット<br />
              <span style={{ color: C.muted, fontSize: 32 }}>ポット 100 → 100 ベット</span>
            </div>
          </Panel>
        </Reveal>
      </div>
      <Reveal delay={560}>
        <div style={{ fontSize: 54, fontWeight: 700, marginTop: 10 }}>
          <span style={{ color: C.gold }}>コール？</span>　<span style={{ color: C.muted, fontWeight: 300 }}>それとも</span>　<span style={{ color: C.silver }}>降りる？</span>
        </div>
      </Reveal>
    </Stage>
  );
};

/* ---------- 06 比率 2:1 と 無差別 ---------- */
const Combo: React.FC<{ cards: string[]; frame: number; delay: number; tint: string; caption: string }> = ({
  cards, frame, delay, tint, caption,
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${tint}`, borderRadius: 14, padding: "18px 20px" }}>
    <div style={{ display: "flex", gap: 8 }}>
      {cards.map((c, i) => <Card key={i} card={c} w={86} frame={frame} delay={delay + i * 4} rise={44} />)}
    </div>
    <div style={{ fontSize: 25, color: tint, fontWeight: 600, letterSpacing: "0.06em" }}>{caption}</div>
  </div>
);

export const S06Ratio: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Stage gap={28}>
      <Kicker delay={2}>理論上の正解</Kicker>
      <Reveal delay={8}>
        <div style={{ fontSize: 96, fontWeight: 700, display: "flex", alignItems: "center" }}>
          <GradientText gradient={GRAD.gold} fontSize={96} weight={700} delay={10}>バリュー 2</GradientText>
          <span style={{ color: C.muted, margin: "0 30px", fontWeight: 300 }}>:</span>
          <GradientText gradient={GRAD.silver} fontSize={96} weight={700} delay={16}>ブラフ 1</GradientText>
        </div>
      </Reveal>
      <div style={{ display: "flex", gap: 44, alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <Combo cards={["Kd", "Kc"]} frame={frame} delay={26} tint={C.gold} caption="セット" />
          <Combo cards={["9h", "9d"]} frame={frame} delay={34} tint={C.gold} caption="セット" />
          <Combo cards={["As", "Js"]} frame={frame} delay={42} tint={C.silver} caption="空振りドロー" />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, paddingTop: 6 }}>
          <Bar label="相手の必要勝率" value={0.33} gradient={GRAD.silver} color={C.silver} delay={120} width={520} />
          <Bar label="あなたのバリュー" value={0.66} gradient={GRAD.gold} color={C.gold} delay={150} width={520} />
          <Bar label="あなたのブラフ" value={0.34} gradient={GRAD.silver} color={C.silver} delay={180} width={520} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 8 }}>
        <Stamp delay={560} fontSize={52}>無差別 ・ インディファレンス</Stamp>
        <Reveal delay={600}>
          <div style={{ fontSize: 36, color: C.muted, maxWidth: 700, lineHeight: 1.45 }}>
            相手はコールしても・降りても<span style={{ color: C.ink, fontWeight: 600 }}>期待値が同じ</span>。利益を絞り取れない。
          </div>
        </Reveal>
      </div>
    </Stage>
  );
};

/* ---------- 07 GTO vs エクスプロイト ---------- */
const SlideIn: React.FC<{ from: "left" | "right"; delay: number; children: React.ReactNode; accent: string }> = ({
  from, delay, children, accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const x = interpolate(s, [0, 1], [from === "left" ? -110 : 110, 0]);
  return (
    <div style={{ flex: 1, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateX(${x}px)`, background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012))", border: `1px solid ${accent}`, borderRadius: 18, padding: "38px 42px", backdropFilter: "blur(3px)" }}>
      {children}
    </div>
  );
};

export const S07Exploit: React.FC = () => (
  <Stage gap={34}>
    <Kicker delay={2}>2つの戦略の関係</Kicker>
    <div style={{ display: "flex", gap: 44 }}>
      <SlideIn from="left" delay={8} accent="rgba(200,169,107,0.4)">
        <div style={{ fontSize: 52, fontWeight: 700, color: C.gold, marginBottom: 22, letterSpacing: "0.02em" }}>GTO ・ 守り</div>
        {["相手にどう動かれても搾取されない", "正しい「真ん中」＝基準", "相手が下手でも均衡を守るだけ"].map((t, i) => (
          <div key={i} style={{ fontSize: 37, color: C.inkSoft, marginBottom: 16, fontWeight: 400 }}>— {t}</div>
        ))}
      </SlideIn>
      <SlideIn from="right" delay={20} accent="rgba(169,175,179,0.4)">
        <div style={{ fontSize: 52, fontWeight: 700, color: C.silver, marginBottom: 22, letterSpacing: "0.02em" }}>エクスプロイト ・ 攻め</div>
        {["相手のミスを最大限とがめる", "ブラフ過多→コール増／降り過多→ブラフ増", "偏る＝自分にも隙が生まれる"].map((t, i) => (
          <div key={i} style={{ fontSize: 37, color: C.inkSoft, marginBottom: 16, fontWeight: 400 }}>— {t}</div>
        ))}
      </SlideIn>
    </div>
    <Reveal delay={420}>
      <div style={{ fontSize: 46, fontWeight: 500, textAlign: "center", color: C.inkSoft }}>
        <span style={{ color: C.gold, fontWeight: 700 }}>まずGTOを土台に。</span>　そのうえで相手に応じて意図的にズラす。
      </div>
    </Reveal>
  </Stage>
);

/* ---------- 08 ロードマップ ---------- */
export const S08Roadmap: React.FC = () => {
  const steps = [
    ["01", "基礎理論", "EV・エクイティ・ポジション・レンジ"],
    ["02", "プリフロップGTO", "オープン／3ベット／ディフェンス"],
    ["03", "フロップ", "Cベット・ボード・レンジ優位"],
    ["04", "ターン・リバー", "バレル・バリュー・無差別の深掘り"],
    ["05", "応用", "エクスプロイト・ICM・上達法"],
  ];
  return (
    <Stage gap={24}>
      <Kicker delay={2}>シリーズ・ロードマップ ・ 全30回</Kicker>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {steps.map((s, i) => (
          <Reveal key={i} delay={10 + i * 12}>
            <div style={{ display: "flex", alignItems: "center", gap: 34, padding: "20px 8px", borderBottom: `1px solid ${C.line}` }}>
              <div style={{ fontFamily: LATIN, color: C.gold, fontWeight: 600, fontSize: 52, width: 96, letterSpacing: "0.02em" }}>{s[0]}</div>
              <div style={{ fontSize: 42, fontWeight: 600 }}>{s[1]}</div>
              <div style={{ fontSize: 30, color: C.muted, marginLeft: "auto" }}>{s[2]}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Stage>
  );
};

/* ---------- 09 まとめ＋次回 ---------- */
export const S09Summary: React.FC = () => {
  const points = [
    ["GTO＝", "相手に搾取されない、均衡の戦略"],
    ["均衡は", "バリュー:ブラフ比率に現れ、相手を無差別に"],
    ["GTOは土台", "その上にエクスプロイト（応用）を乗せる"],
  ];
  return (
    <Stage gap={28}>
      <Kicker delay={2}>今日のまとめ</Kicker>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {points.map((p, i) => (
          <Reveal key={i} delay={10 + i * 12}>
            <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 42 }}>
              <span style={{ width: 58, height: 58, borderRadius: "50%", border: `1.5px solid ${C.gold}`, color: C.gold, fontFamily: LATIN, fontWeight: 600, display: "grid", placeItems: "center", fontSize: 34, flex: "none" }}>{i + 1}</span>
              <span style={{ color: C.inkSoft }}><span style={{ color: C.gold, fontWeight: 700 }}>{p[0]}</span>{p[1]}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={300} style={{ marginTop: 16 }}>
        <div style={{ fontSize: 46, fontWeight: 500, color: C.inkSoft }}>次回　—　第2回「<span style={{ color: C.gold, fontWeight: 700 }}>期待値（EV）</span>」</div>
      </Reveal>
      <div style={{ marginTop: 6 }}>
        <Stamp delay={360} fontSize={46} color={C.gold}>チャンネル登録をお願いします</Stamp>
      </div>
    </Stage>
  );
};

export const SCENES: Record<string, React.FC> = {
  title: S01Title,
  hook: S02Hook,
  def: S03Def,
  janken: S04Janken,
  river: S05River,
  ratio: S06Ratio,
  exploit: S07Exploit,
  roadmap: S08Roadmap,
  summary: S09Summary,
};
