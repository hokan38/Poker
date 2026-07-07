export const C = {
  felt: "#08201a",
  felt2: "#0e3327",
  feltEdge: "#03100b",
  ink: "#f5f2ea",
  muted: "#9fb7ab",
  gold: "#e8c15a",
  goldBright: "#f7dd8a",
  green: "#3fbf7f",
  greenNeon: "#5ef0a6",
  exploit: "#ef8a52",
  exploitNeon: "#ffb07a",
  cardWhite: "#f8f5ec",
  cardRed: "#d8433f",
  cardBlack: "#16241d",
  line: "rgba(255,255,255,0.12)",
  panel: "rgba(255,255,255,0.045)",
};

export const FONT =
  '"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic","Meiryo",system-ui,sans-serif';

export const GRAD = {
  gold: "linear-gradient(120deg,#f7dd8a 0%,#e8c15a 45%,#d79a35 100%)",
  green: "linear-gradient(120deg,#5ef0a6 0%,#3fbf7f 60%,#2c9d64 100%)",
  exploit: "linear-gradient(120deg,#ffb07a 0%,#ef8a52 60%,#d96a34 100%)",
  ink: "linear-gradient(120deg,#ffffff 0%,#dfeee6 100%)",
};

// フェルトのラジアル背景（Backdrop の下地）
export const feltBackground =
  `radial-gradient(130% 110% at 50% -12%, ${C.felt2} 0%, ${C.felt} 52%, ${C.feltEdge} 100%)`;

// glow 用ヘルパー
export const glow = (color: string, blur = 40, spread = 0) =>
  `0 0 ${blur}px ${spread}px ${color}`;
