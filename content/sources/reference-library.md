# リファレンス・ライブラリ（信頼できる情報源）

本シリーズの台本を裏付けるための、精査済みソース集。**格付け（Tier）**と**得意領域**を明記する。
専門的な回ほど Tier 1〜2 に基づくこと。数値（頻度・サイズ・EV・レンジ）は原則 **Tier 1（ソルバー再現）**で確定する。

> 注意：GTOの出力は**設定依存**（フォーマット／スタック／ポジション／ボード／ベットサイズ集合）。
> 数値を引くときは必ず前提条件を併記する。「一般にAだ」ではなく「この設定ではAだ」。

---

## Tier 1 — 一次情報（最上位の権威）

### ソルバー（特定スポットの"GTOの答え"はここで確定）
- **PioSOLVER** — ポストフロップ解析の業界標準（ローカル計算・高精度）。数値の最終確認に。 https://piosolver.com/
- **GTO Wizard**（ツール＋解析ブログ）— ブラウザ完結・膨大なプリ計算解。素早い確認と学習に。ブログは solver 由来で信頼性高。 https://gtowizard.com/ ／ ブログ https://blog.gtowizard.com/
- **GTO+** — Pio 系の低価格ソルバー。 https://www.gtoplus.com/
- **MonkerSolver** — マルチウェイ／PLO など Pio が苦手な領域に。 http://monkerware.com/
- **HoldemResources Calculator（HRC）** — トーナメント／ICM・プリフロップ全ツリー。 https://www.holdemresources.net/
- **ICMIZER** — ICM／プッシュフォールドの定番。 https://www.icmpoker.com/icmizer/

### 査読済み学術論文（GTO・ナッシュ均衡・ソルバー理論の根拠）
- Bowling, Burch, Johanson, Tammelin, **"Heads-up limit hold'em poker is solved"**, *Science* 347(6218):145–149, 2015（Cepheus＝リミットHUを本質的に解いた）。 https://www.science.org/doi/10.1126/science.1259433
- Brown & Sandholm, **"Superhuman AI for heads-up no-limit poker: Libratus beats top professionals"**, *Science*, 2017. https://www.science.org/doi/10.1126/science.aao1733
- Brown & Sandholm, **"Superhuman AI for multiplayer poker"**（Pluribus）, *Science*, 2019, DOI 10.1126/science.aay2400. https://www.science.org/doi/10.1126/science.aay2400
- Moravčík et al., **"DeepStack: Expert-level AI in heads-up no-limit poker"**, *Science*, 2017.
- Zinkevich, Johanson, Bowling, Piccione, **"Regret Minimization in Games with Incomplete Information"**（CFR）, *NIPS*, 2007.
- Nash, **"Equilibrium Points in n-Person Games"**, *PNAS*, 1950（ナッシュ均衡の原典）。

> 使いどころ：第1回（GTO＝ナッシュ均衡／"解かれた"という文脈）、第28回（ソルバー＝CFR）の権威づけ。

---

## Tier 2 — 定評ある書籍・理論解説（概念・導出・枠組みの根拠）

- **The Mathematics of Poker** — Bill Chen & Jerrod Ankenman（2006, ConJelCo）。トイゲーム・[0,1]ゲーム・無差別・分散の厳密な扱い。ISBN 1886070253。 https://www.goodreads.com/book/show/38319.The_Mathematics_of_Poker
- **Modern Poker Theory** — Michael Acevedo（2019, D&B Publishing）。GTO/ソルバー時代の包括的教科書。ISBN 9781909457898。 https://www.simonandschuster.com/books/Modern-Poker-Theory/Michael-Acevedo/9781909457898
- **Applications of No-Limit Hold'em** — Matthew Janda（2013, Two Plus Two）。レンジ構築・ベット/ブラフ比率・**MDF**の枠組み。ISBN 9781880685556。 https://www.amazon.com/Applications-No-Limit-Hold-Matthew-Janda/dp/1880685558
- **No-Limit Hold'em for Advanced Players** — Matthew Janda（2017, Two Plus Two）。ISBN 9781880685594。
- **Play Optimal Poker 1 / 2** — Andrew Brokos（2019 / 2020）。トイゲームで学ぶ実戦的GTO入門。 https://www.thinkingpoker.net/play-optimal-poker/
- **Expert Heads Up No-Limit Hold'em, Vol 1 / 2** — Will Tipton（2012 / 2013, D&B）。決定木・均衡・エクスプロイトの理論。 https://dandbpoker.com/products/expert-heads-up-no-limit-holdem-volume-1
- **The Theory of Poker** — David Sklansky（1987, Two Plus Two）。EV・ポットオッズ・基本定理などの古典的基礎。

> 使いどころ：EV/オッズ（第2–3回）＝Sklansky／Math of Poker。プリフロップ・レンジ（第6–11回）＝Modern Poker Theory／Janda。無差別・ブラフキャッチ（第24回）＝Math of Poker／Tipton／Brokos。

---

## Tier 3 — 信頼できる教育サイト（説明・図解・導入に。数値は Tier 1/2 で裏取り）

- **GTO Wizard 用語集／ブログ** — 解説の質が高く実質 Tier 2 相当の記事も多い。 https://blog.gtowizard.com/ ／ https://pages.gtowizard.com/glossary/
- **Upswing Poker** — 体系的な戦略記事。 https://upswingpoker.com/
- **Red Chip Poker** — 概念解説・ポッドキャスト。 https://redchippoker.com/
- **PokerCoaching（Jonathan Little）** — トーナメント／ICMの実戦解説。 https://pokercoaching.com/
- **SplitSuit（James Sweeney）** — ブラフ頻度など明快な数式解説。 https://www.splitsuit.com/
- **pokerstrategy.com** — ICM等の基礎。
- 導入・平易さ：PokerNews／888poker のストラテジー記事（一次資料としては使わない）。

---

## 概念別・確認済みソース（専門回ですぐ引ける）

| 概念 | 定義・要点 | 主ソース |
|------|-----------|----------|
| バリュー:ブラフ比率／無差別 | ポットサイズベットで value:bluff≈2:1（ブラフ≈33%）→相手を無差別に | GTO Wizard "Mathematical Misconceptions", SplitSuit "Perfect GTO Bluffing", Math of Poker |
| MDF（最小防御頻度）・α | MDF = 1/(1+s)（s=ポット比）。α=1−MDF＝相手のブラフが損益分岐する降り頻度 | GTO Wizard "MDF & Alpha", Upswing "MDF vs Pot Odds", Janda |
| ICM | Malmuth–Harville モデル。Harville(1973, 競馬)→Malmuth(1987, ポーカー転用) | Wikipedia "Independent Chip Model", HRC/ICMIZER, PokerCoaching |
| ソルバー理論 | CFR で近似ナッシュ均衡を計算 | Zinkevich 2007, GTO Wizard, PioSOLVER docs |
| "ポーカーは解かれたか" | リミットHUは本質的に解決（Cepheus）／NLHUは超人AI（Libratus, DeepStack）／6maxはPluribus | Science 2015 / 2017 / 2019 |

---

## 一次資料の入手について（この制作環境）

- **Web検索は利用可能**（本ライブラリのURL・書誌はそれで確認済み）。今後の回でも事実確認に使う。
- **ソルバー**（Pio／GTO Wizard 等）は有料サブスク。特定スポットの数値が要る回は、
  ユーザーが実行して出力（頻度・サイズ・EV）を共有 → それを Tier 1 として台本に反映するのが最も確実。
  （設定：フォーマット・スタック・ポジション・ボード・ベットサイズ集合を必ず添える）
