import { continueRender, delayRender, staticFile } from "remotion";

// 上質フォントを public/fonts から読み込み、読み込み完了までレンダリングを待たせる。
type Face = { family: string; weight: string; file: string };

const FACES: Face[] = [
  ...[500, 600, 700, 800].flatMap((w) => [
    { family: "Shippori Mincho", weight: String(w), file: `shippori-mincho-japanese-${w}-normal.woff2` },
    { family: "Shippori Mincho", weight: String(w), file: `shippori-mincho-latin-${w}-normal.woff2` },
  ]),
  ...[500, 600, 700].map((w) => ({ family: "Cormorant Garamond", weight: String(w), file: `cormorant-garamond-latin-${w}-normal.woff2` })),
];

if (typeof document !== "undefined") {
  const handle = delayRender("load-fonts");
  Promise.all(
    FACES.map(async (f) => {
      try {
        const ff = new FontFace(f.family, `url(${staticFile("fonts/" + f.file)}) format('woff2')`, {
          weight: f.weight, style: "normal", display: "block",
        });
        await ff.load();
        (document as unknown as { fonts: FontFaceSet }).fonts.add(ff);
      } catch (e) {
        // 個別失敗は無視（フォールバック表示）
      }
    })
  ).then(() => continueRender(handle)).catch(() => continueRender(handle));
}

export const MINCHO = '"Shippori Mincho", serif';
export const LATIN = '"Cormorant Garamond", "Shippori Mincho", serif';
