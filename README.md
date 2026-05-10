# GTO Wizard 解説くん

GTO Wizardのトレーニングモードのスクリーンショットをアップロードすると、
**「なぜそのプレイが正解なのか」** をClaudeが日本語で自動解説してくれるWebアプリです。

トレーニングモードを回しているときに「正解は分かったけど理由が分からない」
となる場面を、レンジ・ボード・ブロッカー・代替アクションの観点から噛み砕いて教えてくれます。

## 使い方

1. GTO Wizardでトレーニングモードを開き、結果が出ている画面をスクショする
   (頻度・EVが見えているとなお良い)
2. アプリを開き、スクショをドラッグ&ドロップ or 貼り付け (Ctrl/Cmd+V) or ファイル選択
3. (任意) 補足を書く ― 例: 「私はFoldしたが、Callが正解だった。なぜ？」
4. 「解説する」を押すと、以下が返ってきます
   - 結論 (1〜2文)
   - 場面の整理 (フォーマット / ポジション / ハンド / ボード / アクション履歴)
   - GTOアクション頻度 (バー表示)
   - レンジ vs レンジ / ボード構造 / ハンド固有の理由 / 代替アクションを取らない理由
   - 覚えておくべきポイント

## セットアップ

### 必要なもの

- Node.js 18+ (推奨: 20+)
- Anthropic APIキー — https://console.anthropic.com/ で取得

### 手順

```bash
git clone <this-repo>
cd Poker
npm install
cp .env.example .env.local
# .env.local を開いて ANTHROPIC_API_KEY を設定
npm run dev
```

`http://localhost:3000` で起動します。

### 環境変数

| 変数名 | 必須 | 説明 |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | ✅ | Claude APIキー |
| `ANTHROPIC_MODEL` |   | 使用モデル。デフォルト `claude-sonnet-4-6`。`claude-opus-4-7` などに変更可 |

## 構成

- `app/page.tsx` — メイン画面 (アップロード + 結果表示)
- `app/api/explain/route.ts` — 画像をClaude Visionに投げて解説JSONを取得
- `lib/prompt.ts` — GTOコーチとしてのシステムプロンプト
- `components/UploadCard.tsx` — ドロップ/ペースト/ファイル選択
- `components/ResultView.tsx` — 結果表示 (アクション頻度バー + Markdown解説)

## 注意

- Claudeが画面のテキストとレンジ表示を読み取って解説します。
  完璧な精度ではないため、最終判断はソルバーの公式出力とクロスチェックしてください。
- スクショは**サーバー上のClaude APIにのみ**送信され、永続化されません。
- 公式GTO Wizardとは無関係のサードパーティ・ツールです。

## 開発

```bash
npm run dev       # 開発サーバ
npm run build     # 本番ビルド
npm run typecheck # 型チェック
npm run lint      # ESLint
```
