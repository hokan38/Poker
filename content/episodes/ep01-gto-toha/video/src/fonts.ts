import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

// 上質フォント（public/fonts の woff2）を読み込む。
type Face = { family: string; weight: string; file: string };

const FACES: Face[] = [
  ...[500, 600, 700, 800].flatMap((w) => [
    { family: "Shippori Mincho", weight: String(w), file: `shippori-mincho-japanese-${w}-normal.woff2` },
    { family: "Shippori Mincho", weight: String(w), file: `shippori-mincho-latin-${w}-normal.woff2` },
  ]),
  ...[500, 600, 700].map((w) => ({ family: "Cormorant Garamond", weight: String(w), file: `cormorant-garamond-latin-${w}-normal.woff2` })),
];

let loadPromise: Promise<void> | null = null;
function loadAllFonts(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = Promise.all(
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
  ).then(() => undefined);
  return loadPromise;
}

/** レンダリング前にフォント読み込みを待たせるフック（コンポーネント内で1回呼ぶ）。 */
export const useFonts = (): void => {
  const [handle] = useState(() => delayRender("load-fonts"));
  useEffect(() => {
    let alive = true;
    loadAllFonts().then(() => {
      if (alive) continueRender(handle);
    });
    return () => {
      alive = false;
    };
  }, [handle]);
};

export const MINCHO = '"Shippori Mincho", serif';
export const LATIN = '"Cormorant Garamond", "Shippori Mincho", serif';
