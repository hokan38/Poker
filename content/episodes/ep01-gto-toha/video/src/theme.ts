export const C = {
  felt: "#071a12",
  felt2: "#0d2c1f",
  feltEdge: "#04120c",
  ink: "#f4f1e8",
  muted: "#a9bcb0",
  gold: "#e8c15a",
  green: "#3fbf7f",
  exploit: "#e58a55",
  cardWhite: "#f7f4ea",
  cardRed: "#cf3f3f",
  cardBlack: "#1a2b22",
  line: "rgba(255,255,255,0.12)",
  panel: "rgba(255,255,255,0.05)",
};

export const FONT =
  '"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic","Meiryo",system-ui,sans-serif';

// 共通の背景（フェルトのラジアルグラデ）
export const feltBackground =
  `radial-gradient(120% 100% at 50% -8%, ${C.felt2}, ${C.felt} 60%, ${C.feltEdge})`;
