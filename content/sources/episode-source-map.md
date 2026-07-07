# 各回のソース割り当て（全30回）

各回で優先的に参照する情報源。数値を扱う回は **[solver]** を必須の裏取りとする。
詳細な書誌・URLは `reference-library.md`、運用は `README.md` を参照。

## 第1章 基礎理論（1–5）
- **1. GTOとは何か** … ナッシュ均衡＝Nash 1950／"解かれた"文脈＝Science 2015・2017・2019／均衡の直感＝MPT。※導入回・検証済み。
- **2. 期待値（EV）** … Sklansky "Theory of Poker"／MPT（分散・バンクロール）。`[derive]`（EV計算）。
- **3. エクイティ・オッズ** … Sklansky／Janda-App。`[derive]`（4-2ルール・ポットオッズ）。
- **4. ポジションとレンジ** … Modern Poker Theory／GTO Wizard（レンジの読み方）。
- **5. GTO vs エクスプロイト** … Tipton1/2（最適と搾取）／POP1／MPT。

## 第2章 プリフロップGTO（6–11）※数値が増える＝[solver]必須
- **6. RFIレンジ** … [solver: 100bb 6max preflop]／Modern Poker Theory／GTO Wizard preflop。
- **7. ベットサイズ・ジオメトリ** … Janda-App／GTO Wizard（サイズ理論・SPR）。`[derive]`。
- **8. 3ベット（ポラライズ/リニア）** … Janda-App／Modern Poker Theory／[solver]。
- **9. 3ベットへの対応** … [solver]／Modern Poker Theory。
- **10. 4/5ベット・ブロッカー** … [solver]／Janda-App／MPT（ブロッカー効果）。
- **11. ブラインドディフェンス・MDF** … GTO Wizard "MDF & Alpha"／Upswing "MDF vs Pot Odds"／`[derive] MDF=1/(1+s)`／[solver]。

## 第3章 フロップ（12–18）※[solver]必須の中心
- **12. Cベット** … [solver]／GTO Wizard（頻度・サイズ）／Janda-App。
- **13. ボードテクスチャ** … Modern Poker Theory／GTO Wizard。
- **14. レンジ優位／ナッツ優位** … GTO Wizard／Janda-App／[solver]。
- **15. ポラライズド vs マージド** … Janda-App／MPT／[solver]。
- **16. MDF・オーバーフォールド** … GTO Wizard "MDF & Alpha"／`[derive]`／[solver]。
- **17. ブロッカー活用** … MPT／GTO Wizard／[solver]。
- **18. チェックレンジ・プロテクション** … Janda-App／[solver]。

## 第4章 ターン・リバー（19–25）
- **19. ターンのバレル** … [solver]／GTO Wizard。
- **20. ポットコントロール** … Tipton／Janda-Adv。
- **21. オーバーベット** … GTO Wizard（overbet理論）／Janda／[solver]。
- **22. リバーのバリュー（シンバリュー）** … MPT／[solver]。
- **23. リバーのブラフ・ブロッカー** … SplitSuit "Perfect GTO Bluffing"／GTO Wizard／`[derive]`／[solver]。
- **24. ブラフキャッチ・無差別** … MPT（[0,1]/トイゲーム）／Tipton／POP1／`[derive]`。
- **25. マルチウェイ** … MonkerSolver [solver]／GTO Wizard（マルチウェイ記事）。

## 第5章 応用・トーナメント・上達法（26–30）
- **26. エクスプロイト（プールリード）** … Tipton（最適↔搾取）／MPT／Modern Poker Theory。
- **27. ICM・バブルファクター** … Wikipedia ICM（Malmuth–Harville, Harville1973/Malmuth1987）／HRC・ICMIZER [solver]／PokerCoaching。
- **28. ソルバーの使い方・学習法** … Zinkevich 2007（CFR）／PioSOLVER docs／GTO Wizard（ノードロック解説）。
- **29. メンタル・ティルト・バンクロール** … MPT（分散・リスクオブルイン）／※心理面は一般文献。
- **30. 総まとめ・ツール活用** … 上記全体＋本リポジトリの自作アプリ紹介。

---

### 運用メモ
- 「[solver]」が付く回は、公開後の訂正を避けるため**数値を出す前に必ず再現**する。ユーザー提供の出力でも可（設定併記）。
- 各回の制作時に、この割り当てを起点に `episodes/epNN-.../references.md` を作り、主張→出典を残す。
