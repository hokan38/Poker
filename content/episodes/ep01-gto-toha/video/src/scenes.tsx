import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./theme";
import { Card, CardRow } from "./components/Card";
import { Bar, ChipStack, Donut, Kicker, Panel, Reveal, Stamp } from "./components/ui";

const Stage: React.FC<{ children: React.ReactNode; justify?: string; gap?: number }> = ({
  children, justify = "center", gap = 34,
}) => (
  <AbsoluteFill style={{ fontFamily: FONT, color: C.ink, padding: "84px 110px", display: "flex", flexDirection: "column", justifyContent: justify, gap }}>
    {children}
  </AbsoluteFill>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "inline-block", padding: "10px 30px", border: `1px solid ${C.gold}`, color: C.gold, borderRadius: 999, fontSize: 30, fontWeight: 700, letterSpacing: "0.1em" }}>
    {children}
  </div>
);

/* ---------- 01 タイトル ---------- */
export const S01Title: React.FC = () => {
  const frame = useCurrentFrame();
  const cards = ["As", "Kh", "Qd", "Jc", "Ts"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage gap={30}>
        <Reveal delay={2}><Pill>ポーカー GTO 解説　・　全30回シリーズ</Pill></Reveal>
        <Reveal delay={8}>
          <div style={{ fontSize: 118, fontWeight: 900, lineHeight: 1.08 }}>
            <span style={{ color: C.ink }}>GTO</span>
            <span style={{ color: C.ink }}>とは何か？</span>
          </div>
        </Reveal>
        <Reveal delay={16}>
          <div style={{ fontSize: 96, fontWeight: 900, color: C.gold, lineHeight: 1.1 }}>ポーカー戦略の全体像</div>
        </Reveal>
        <Reveal delay={26}>
          <div style={{ fontSize: 42, color: C.muted }}>第1回 ｜ 本格的なポーカー戦略を、わかりやすく。</div>
        </Reveal>
      </Stage>
      <div style={{ position: "absolute", bottom: -30, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {cards.map((c, i) => (
          <div key={i} style={{ transform: `rotate(${(i - 2) * 9}deg) translateY(${Math.abs(i - 2) * 26}px)`, margin: "0 -26px" }}>
            <Card card={c} w={150} frame={frame} delay={34 + i * 5} rise={140} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 02 フック ---------- */
export const S02Hook: React.FC = () => (
  <Stage>
    <Kicker delay={2}>なぜ、あの人は勝ち続けるのか？</Kicker>
    <Reveal delay={12}>
      <div style={{ fontSize: 130, fontWeight: 900, display: "flex", alignItems: "center", gap: 40 }}>
        <span style={{ color: C.muted }}>運？</span>
        <span style={{ color: C.gold, fontSize: 70 }}>→</span>
        <span style={{ color: C.green }}>戦略</span>
      </div>
    </Reveal>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 60, marginTop: 10 }}>
      <Reveal delay={26} style={{ maxWidth: 1050 }}>
        <div style={{ fontSize: 46, lineHeight: 1.5, color: C.ink }}>
          同じカード、同じテーブル。<br />長い目で見て勝つ人は、<span style={{ color: C.green, fontWeight: 800 }}>戦略</span>で勝っている。<br />その土台が、<span style={{ color: C.gold, fontWeight: 800 }}>GTO</span>。
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
      <div style={{ fontSize: 104, fontWeight: 900 }}>
        <span style={{ color: C.gold }}>G</span>ame <span style={{ color: C.gold }}>T</span>heory <span style={{ color: C.gold }}>O</span>ptimal
      </div>
    </Reveal>
    <Reveal delay={20}>
      <div style={{ fontSize: 52, color: C.ink }}>＝ ゲーム理論的に<span style={{ color: C.green, fontWeight: 800 }}>最適</span>な戦略</div>
    </Reveal>
    <div style={{ marginTop: 24 }}>
      <Stamp delay={40} color={C.green} fontSize={62}>＝ 搾取されない戦略</Stamp>
    </div>
  </Stage>
);

/* ---------- 04 じゃんけん ---------- */
export const S04Janken: React.FC = () => {
  const rows = [
    { c: C.green, t: "グー　1/3" },
    { c: C.gold, t: "チョキ 1/3" },
    { c: C.exploit, t: "パー　1/3" },
  ];
  return (
    <Stage gap={30}>
      <Kicker delay={2}>直感例①　じゃんけん</Kicker>
      <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
        <Donut size={360} delay={8} label={"1/3\nずつ"} colors={[C.green, C.gold, C.exploit]} />
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {rows.map((r, i) => (
            <Reveal key={i} delay={16 + i * 6}>
              <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 46, fontWeight: 700 }}>
                <span style={{ width: 40, height: 40, borderRadius: 8, background: r.c }} />
                {r.t}
              </div>
            </Reveal>
          ))}
          <Reveal delay={40}>
            <div style={{ fontSize: 40, color: C.muted, marginTop: 10, lineHeight: 1.45 }}>
              ランダムに1/3ずつ出せば、<br />相手は何をしても<span style={{ color: C.green, fontWeight: 800 }}>勝率五分</span>。<br />これが「均衡」＝GTO。
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal delay={380} style={{ marginTop: 10 }}>
        <Panel accent="rgba(229,138,85,0.4)" style={{ background: "rgba(229,138,85,0.08)" }}>
          <div style={{ fontSize: 48, fontWeight: 800, display: "flex", gap: 26, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: C.exploit }}>グーを多めに</span>
            <span style={{ color: C.gold }}>→</span>
            <span style={{ color: C.green }}>相手はパーを増やす</span>
            <span style={{ color: C.gold }}>→</span>
            <span style={{ color: C.exploit }}>搾取される</span>
          </div>
          <div style={{ fontSize: 36, color: C.muted, marginTop: 14 }}>偏り＝つけ込む隙。均衡に近づくほど、搾取されない。</div>
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
    <Stage gap={26}>
      <Kicker delay={2}>直感例②　リバー（最後のカード）</Kicker>
      <div>
        <Reveal delay={6}><div style={{ fontSize: 34, color: C.muted, marginBottom: 12 }}>ボード</div></Reveal>
        <CardRow cards={board} w={150} frame={frame} startDelay={10} stagger={7} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 70, marginTop: 6 }}>
        <div>
          <Reveal delay={60}><div style={{ fontSize: 34, color: C.gold, marginBottom: 12, fontWeight: 700 }}>あなた（ブラフキャッチャー）</div></Reveal>
          <CardRow cards={hero} w={150} frame={frame} startDelay={64} stagger={7} glow={C.gold} />
        </div>
        <Reveal delay={300} style={{ flex: 1 }}>
          <Panel accent="rgba(232,193,90,0.4)" style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <ChipStack n={5} delay={306} color={C.gold} />
            <div style={{ fontSize: 40, lineHeight: 1.4 }}>
              相手が<span style={{ color: C.gold, fontWeight: 800 }}>ポットと同額</span>をベット<br />
              <span style={{ color: C.muted, fontSize: 34 }}>（ポット100 → 100ベット）</span>
            </div>
          </Panel>
        </Reveal>
      </div>
      <Reveal delay={560}>
        <div style={{ fontSize: 56, fontWeight: 900, marginTop: 8 }}>
          <span style={{ color: C.green }}>コール？</span>　それとも　<span style={{ color: C.exploit }}>降りる？</span>
        </div>
      </Reveal>
    </Stage>
  );
};

/* ---------- 06 比率 2:1 と 無差別 ---------- */
const Combo: React.FC<{ cards: string[]; frame: number; delay: number; tint: string; caption: string }> = ({
  cards, frame, delay, tint, caption,
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: `${tint}22`, border: `1px solid ${tint}`, borderRadius: 16, padding: "18px 20px" }}>
    <div style={{ display: "flex", gap: 8 }}>
      {cards.map((c, i) => <Card key={i} card={c} w={88} frame={frame} delay={delay + i * 4} rise={50} />)}
    </div>
    <div style={{ fontSize: 26, color: tint, fontWeight: 800 }}>{caption}</div>
  </div>
);

export const S06Ratio: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Stage gap={24}>
      <Kicker delay={2}>理論上の正解</Kicker>
      <Reveal delay={8}>
        <div style={{ fontSize: 84, fontWeight: 900 }}>
          <span style={{ color: C.green }}>バリュー 2</span>　：　<span style={{ color: C.exploit }}>ブラフ 1</span>
        </div>
      </Reveal>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
          <Combo cards={["Kd", "Kc"]} frame={frame} delay={26} tint={C.green} caption="セット" />
          <Combo cards={["9h", "9d"]} frame={frame} delay={34} tint={C.green} caption="セット" />
          <Combo cards={["As", "Js"]} frame={frame} delay={42} tint={C.exploit} caption="空振りドロー" />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, paddingTop: 4 }}>
          <Bar label="相手の必要勝率" value={0.33} color={C.gold} delay={120} width={560} />
          <Bar label="あなたのバリュー" value={0.66} color={C.green} delay={150} width={560} />
          <Bar label="あなたのブラフ" value={0.34} color={C.exploit} delay={180} width={560} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 6 }}>
        <Stamp delay={560} color={C.gold} fontSize={54}>無差別（インディファレンス）</Stamp>
        <Reveal delay={600}>
          <div style={{ fontSize: 38, color: C.muted, maxWidth: 720, lineHeight: 1.4 }}>
            相手はコールしても・降りても<span style={{ color: C.ink, fontWeight: 800 }}>期待値が同じ</span>。利益を絞り取れない。
          </div>
        </Reveal>
      </div>
    </Stage>
  );
};

/* ---------- 07 GTO vs エクスプロイト ---------- */
const Slide: React.FC<{ from: "left" | "right"; delay: number; children: React.ReactNode; accent: string }> = ({
  from, delay, children, accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const x = interpolate(s, [0, 1], [from === "left" ? -120 : 120, 0]);
  return (
    <div style={{ flex: 1, opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateX(${x}px)`, background: `${accent}14`, border: `1px solid ${accent}66`, borderRadius: 22, padding: "36px 40px" }}>
      {children}
    </div>
  );
};

export const S07Exploit: React.FC = () => (
  <Stage gap={30}>
    <Kicker delay={2}>2つの戦略の関係</Kicker>
    <div style={{ display: "flex", gap: 40 }}>
      <Slide from="left" delay={8} accent={C.green}>
        <div style={{ fontSize: 54, fontWeight: 900, color: C.green, marginBottom: 20 }}>GTO（守り）</div>
        {["相手にどう動かれても搾取されない", "正しい「真ん中」＝基準", "相手が下手でも均衡を守るだけ"].map((t, i) => (
          <div key={i} style={{ fontSize: 38, color: C.ink, marginBottom: 14 }}>・{t}</div>
        ))}
      </Slide>
      <Slide from="right" delay={20} accent={C.exploit}>
        <div style={{ fontSize: 54, fontWeight: 900, color: C.exploit, marginBottom: 20 }}>エクスプロイト（攻め）</div>
        {["相手のミスを最大限とがめる", "ブラフ過多→コール増／降り過多→ブラフ増", "偏る＝自分にも隙が生まれる"].map((t, i) => (
          <div key={i} style={{ fontSize: 38, color: C.ink, marginBottom: 14 }}>・{t}</div>
        ))}
      </Slide>
    </div>
    <Reveal delay={420}>
      <div style={{ fontSize: 48, fontWeight: 800, textAlign: "center" }}>
        <span style={{ color: C.gold }}>まずGTOを土台に。</span>　そのうえで相手に応じて意図的にズラす。
      </div>
    </Reveal>
  </Stage>
);

/* ---------- 08 ロードマップ ---------- */
export const S08Roadmap: React.FC = () => {
  const steps = [
    ["1章", "基礎理論", "EV・エクイティ・ポジション・レンジ"],
    ["2章", "プリフロップGTO", "オープン／3ベット／ディフェンス"],
    ["3章", "フロップ", "Cベット・ボード・レンジ優位"],
    ["4章", "ターン・リバー", "バレル・バリュー・無差別の深掘り"],
    ["5章", "応用", "エクスプロイト・ICM・上達法"],
  ];
  return (
    <Stage gap={22}>
      <Kicker delay={2}>シリーズ・ロードマップ（全30回）</Kicker>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {steps.map((s, i) => (
          <Reveal key={i} delay={10 + i * 12}>
            <div style={{ display: "flex", alignItems: "center", gap: 30, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, padding: "20px 30px" }}>
              <div style={{ color: C.gold, fontWeight: 900, fontSize: 40, width: 90 }}>{s[0]}</div>
              <div style={{ fontSize: 42, fontWeight: 800 }}>{s[1]}</div>
              <div style={{ fontSize: 32, color: C.muted, marginLeft: "auto" }}>{s[2]}</div>
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
    <Stage gap={26}>
      <Kicker delay={2}>今日のまとめ</Kicker>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {points.map((p, i) => (
          <Reveal key={i} delay={10 + i * 12}>
            <div style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 42 }}>
              <span style={{ width: 60, height: 60, borderRadius: "50%", background: C.green, color: "#04120c", fontWeight: 900, display: "grid", placeItems: "center", fontSize: 34, flex: "none" }}>{i + 1}</span>
              <span><span style={{ color: C.gold, fontWeight: 800 }}>{p[0]}</span>{p[1]}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={300} style={{ marginTop: 14 }}>
        <div style={{ fontSize: 46, fontWeight: 800 }}>次回　▶　第2回「<span style={{ color: C.gold }}>期待値（EV）</span>」</div>
      </Reveal>
      <Reveal delay={360}>
        <Stamp delay={360} color={C.gold} fontSize={48}>チャンネル登録をお願いします</Stamp>
      </Reveal>
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
