# 第1作 動画（Remotion で MP4 自動生成）

第1回「GTOとは何か？」を、**アニメーション＋日本語ナレーション付きのMP4**としてコードから自動生成するプロジェクトです。
具体例（リバーの場面）は、実際のトランプ（ボード・ハンド）で視覚的に見せています。

- 映像：React / [Remotion](https://remotion.dev)（`src/`）
- 音声：オフライン日本語TTS **Open JTalk**（`pyopenjtalk`）でナレーションを合成（`scripts/generate_narration.py`）
- 出力：`out/ep01-gto-toha.mp4`（1920×1080 / 30fps / 音声込み・約3分）

## 構成

```
video/
├── package.json            Remotion 依存
├── remotion.config.ts      レンダリング設定
├── narration/lines.json    ナレーション原稿（TTS用の読み最適化テキスト）
├── scripts/generate_narration.py   TTS生成 → public/narration/*.mp3 と src/manifest.json
├── src/
│   ├── index.ts            registerRoot
│   ├── Root.tsx            Composition 定義（尺は manifest から）
│   ├── Episode1.tsx        全シーンを Series で連結＋各シーンの音声を配置
│   ├── scenes.tsx          9シーンのアニメーション本体
│   ├── theme.ts            配色・フォント
│   ├── components/Card.tsx トランプ描画（ボード/ハンド）
│   ├── components/ui.tsx   Donut / Bar / ChipStack / Stamp など
│   └── manifest.json       各シーンの尺（generate_narration.py が生成）
└── public/narration/*.mp3  合成済みナレーション（コミット対象・軽量）
```

## 音声とアニメの同期の仕組み

1. `narration/lines.json` にシーンごとの原稿（`id` + `text`）を用意。
2. `generate_narration.py` が各原稿を合成し、長さを測って
   `src/manifest.json` に `durationInFrames`（＝リードイン + 音声 + テール）を書き出す。
3. `Root.tsx` は manifest の合計フレーム数を尺に採用。
   `Episode1.tsx` が各シーンを `Series.Sequence` で並べ、`leadInFrames` だけ遅らせて音声を鳴らす。

→ 原稿を書き換えて `generate_narration.py` を実行すれば、尺が自動で合い直します。

## 再生成の手順

### 1. ナレーション（音声を作り直す場合のみ）
```bash
pip install pyopenjtalk soundfile numpy imageio-ffmpeg
# Open JTalk 辞書（SourceForge 配布）を取得・展開
curl -L -o dic.tar.gz \
  "https://downloads.sourceforge.net/project/open-jtalk/Dictionary/open_jtalk_dic-1.11/open_jtalk_dic_utf_8-1.11.tar.gz"
tar xzf dic.tar.gz
OPEN_JTALK_DICT_DIR="$PWD/open_jtalk_dic_utf_8-1.11" python3 scripts/generate_narration.py
```
> 生成済みの `public/narration/*.mp3` はコミットしてあるので、映像だけ作り直すならこの手順は不要です。

### 2. 映像（MP4レンダリング）
```bash
npm install
# 通常環境（Remotion が Chrome Headless Shell を自動取得）
npx remotion render Episode1 out/ep01-gto-toha.mp4
```
プレビューは `npx remotion studio`。

## この環境（Claude Code on the web）での注意

- フルの Chrome はレンダリングに使えません（旧ヘッドレスモード廃止のため）。
  同梱の **chrome-headless-shell** を指定します：
  ```bash
  npx remotion render Episode1 out/ep01-gto-toha.mp4 \
    --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
  ```
- ネットワークは PyPI / npm / GitHub 等に限定。オンラインTTS（Google/Microsoft）は不可のため、
  ナレーションはオフラインの Open JTalk を採用しています。

## ナレーション音声について

Open JTalk（HTS）は完全オフラインで動く機械音声です。明瞭ですが抑揚は合成的です。
より自然な声にしたい場合は、`public/narration/*.mp3` を
お好みのTTS（VOICEVOX、各種クラウドTTS、実収録など）で差し替えるだけで、映像側は変更不要です。
