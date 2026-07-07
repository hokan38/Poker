// ハイクラス・モノトーン基調（黒 × 白 × シャンパンゴールド）
export const C = {
  bg: "#0a0a0c",
  bg2: "#17171b",
  edge: "#050506",
  ink: "#f4f1ea",      // 温かみのある白（アイボリー）
  inkSoft: "#d9d6cd",
  muted: "#8f8c84",
  faint: "#5c5a55",
  line: "rgba(255,255,255,0.12)",
  hair: "rgba(255,255,255,0.30)",
  gold: "#c8a96b",      // シャンパンゴールド（唯一の差し色）
  goldSoft: "#e0c896",
  silver: "#a9afb3",    // プラチナ／シルバー（対比色）
  silverSoft: "#d0d5d7",
  cardBg: "#f2eee4",    // アイボリーのカード
  cardInk: "#191510",   // 墨（全スート共通＝モノクロデッキ）
  panel: "rgba(255,255,255,0.035)",
};

// 見出し・本文は明朝（上質・エディトリアル）、ラテン/数字は Cormorant。
export const FONT = '"Shippori Mincho","Hiragino Mincho ProN","Yu Mincho",serif';
export const LATIN = '"Cormorant Garamond","Shippori Mincho",serif';

export const GRAD = {
  ink: "linear-gradient(120deg,#ffffff 0%,#ece8de 100%)",
  gold: "linear-gradient(120deg,#ecd6a6 0%,#c8a96b 52%,#a37f3c 100%)",
  silver: "linear-gradient(120deg,#eceff0 0%,#a9afb3 55%,#83898c 100%)",
};

export const bg =
  `radial-gradient(120% 100% at 50% 30%, ${C.bg2} 0%, ${C.bg} 55%, ${C.edge} 100%)`;
