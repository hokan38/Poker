# 週刊均衡 メンバーシップ学習ノート — Stage1〜8 練習問題解答・解説 全読破

## このノートについて

- 対象: note.com **[gto_theorem（週刊均衡）](https://note.com/gto_theorem)**（著者: Drama @RiverProbe / Amu @Amuformu）。
- **アクセス状況（2026-07 時点）**: メンバーシップ（解答集プラン）加入により、全93記事中 **55記事が読取可能**になった。読めるようになったのは:
  - **Stage1〜8 の「練習問題の解答・解説」全44本**
  - **Stage1~3 復習問題①②＋解答・解説（4本）**
  - **番外編「金脈spotの紹介」#1・#2（全文）**
  - （従来から読めた: poker学習のロードマップ／週刊均衡目録／Stage1-1本編。Stage1-2〜1-5本編は単品購入済み）
  - **未読のまま（上位プラン限定）**: Stage2〜8 の理論本編 38本（Stage2-1〜2-5、Stage3-1〜3-6、Stage4-1〜4-5、Stage5-1〜5-5、Stage6-1〜6-7、Stage7-1〜7-5、Stage8-1〜8-5）。
- 理論本編がロックされている Stage2〜8 については、**解答・解説記事のテキスト（採点基準・出題意図）から理論内容を復元**した。問題文・模範解答の多くは画像掲載のため、ボード・頻度の詳細は本文で言及された範囲のみ。**推定を含む箇所は各所に明記**している。
- 本ノートは学習・復習用の**非公式の要約・再構成**であり、有料本文の逐語転載ではない。正確・最新の内容は必ず元記事（メンバーシップ）で確認すること。
- 姉妹ノート:
  - [`gto-theorem-weekly-equilibrium-notes.md`](./gto-theorem-weekly-equilibrium-notes.md) — 全記事マップ＋無料範囲（Stage1-1・ロードマップ・目録）
  - [`note-purchased-articles-study-notes.md`](./note-purchased-articles-study-notes.md) — 単品購入したStage1-2〜1-5本編＋Amu「Flop CBの基礎」
  - [`amu-goole-poker-notes.md`](./amu-goole-poker-notes.md) — Amuの無料記事まとめ

## 全体を貫く最重要原則（横断サマリ）

1. **思考順序の鉄則**: どのStageでも「**レンジ全体の戦略 → 自ハンドの戦略**」の順。ハンド単体先行の判断はバランスを欠く。call/fold・bet/check・bluff判定すべてこの順で採点される。
2. **Call判定の完成型**（Stage1）: Step1 bet size→fold頻度（**レンジEQ差でoverfold調整**）→ Step2 **shift**に注意して現状の自レンジを弱い順に切る → Step3 自ハンド判定。「役の強さ順」でなく「**レンジ内序列**」でfoldする（draw付き優先防衛、shift後はsetすらpure foldになりうる）。
3. **Bet判定の骨格**（Stage2）: range bet の判定はボードの見た目でなく **EQ chartの形**。レンジアドバンテージは必要条件であって十分条件ではない。**Urgency**（次streetで安心してvalueを打てなくなる脆さ）が特大サイズを牽引し、nutsは全サイズに分配される。RiverはEQ分布の **01-game** で近似し、value下限は「相手のindifferent帯の少し上」。
4. **Bluff判定の骨格**（Stage3）: 持ち越した自レンジ→弱い順にbluff候補→相手のdefense下限→**blocker/unblockerで最終選別**。「相手のfoldレンジをunblockし、続行レンジをblockする」ハンドが優秀。Flop/Turnのraise bluffは「jamされたときの損失が小さい＋バックアップEQ」＝combo draw系が最適。
5. **持ち越しレンジの復元が全ての起点**（Stage4）: probe/barrel/call判定は「前streetで各ハンドクラスがどのアクションに行ったか」の復元から。サイズは「そのサイズでindifferentになる層が相手レンジに濃いか」で選ぶ。
6. **Blocker/Unblocker/EQ頑健性**（Stage5）: blocker評価は「そのコンボが相手の**現**レンジに実在するか」（前streetで抜けていないか）を確認してから。vulnerableな低EQハンド（non-setミドルポケット等）のbetしすぎは最頻出リーク。
7. **頻出スポットの構造**（Stage6）: stabの本質は「CBスキップ後のcapされたレンジを苛める」。ブランクにはsmall wide、ナッツ優位カードにはgeometric overbet polar。ただしEQ差が小さいBvB/IPccでは低頻度・中サイズに絞る。monotone等ボード性質は原則を上書きする。
8. **Exploitの入口 = MinES**（Stage7）: 「後続streetのexploitabilityをケアしつつ、当該street内で最大限exploitする」。CB過多にはfold−10%/raise+15%、xr過小にはrange CB化。均衡でindifferentなハンドは相手がunder-bluffなら即fold変換。3wayはHU比でpassive化が第一原則。
9. **実戦の錨数値**: 50%bet→α33%（実戦は35〜40%fold）／4bpはα33%に対し52%fold級のoverfoldが均衡／BTNvsBB SRP 33%betの境界はAThi付近／大サイズbetのコール下限は「gutshot付き1pair」／Turn125%betがoverbluffされることはまず無い。

---

# Part 1: Stage1 解答・解説＋復習問題①②


出典: note.com 連載「週刊均衡」(gto_theorem) / 文責: Drama(@RiverProbe), Amu(@Amuformu)

Stage1の共通フレームワーク（完成版）:

- **Step1**: Bet sizeからfoldする頻度を判定する（**レンジEQ差を考慮**して調整）
- **Step2**: **shiftに気を付けて**現状の自レンジを捕捉し、弱いハンドから順にfold群を選ぶ（前streetのアクションによるレンジ変化に注意）
- **Step3**: 自ハンドがfold群に属するかを判定する

注記: 各記事の問題文・模範解答の詳細（正確なハンド・ボード・スタック）は画像内にあり、本文テキストには残っていない。以下は本文＋対応する本編記事から確実に読み取れる範囲での再構成。

---

### Stage1-1 練習問題の解答・解説（n9c842ca1f07f）

**(a) スポット設定**
- 本編の例題: BTN vs BB SRP、Flop CB直面。Khiボード（K75r系）でBBがAd4d（BDFD/BD付きAhi）をdefenceするか。
- 練習問題: 同じBTNvsBB SRPのFlop CB直面だが、**K75rと比べてStraight drawの濃い（connectした）ボード**でのAhiのcall/fold判定。正確なボード・ハンドは画像内。

**(b) 正解**
- 例題: Ad4dはfoldせずcall。call/fold境界はQJなどQhiの一部とAhiの間にある。
- 練習問題: 画像内のため本文からは特定不可。判定基準は「そのAhiにdraw（SD/BDFD）が付いているか」。draw無しAhiはfold側に回る。

**(c) 解説の核心ロジック**
- Step1: bet size→alpha（33%bet≒alpha小、50%bet等）でレンジ全体のfold量を決める。
- Step2: 「役が強い順にcall」ではなく、**発展性のあるハンド（draw付き）を優先的に守る**。
- Drawの濃いボードではハイカードの中でもdraw持ちを優先して守るため、**draw無しAhiの相対価値が下がる**。
- ハンドを「Ahi」と一枚で見ず、kickerが何か・kickerでSDやBDFDが付かないかまで**2枚で精査する**。

**(d) 一般原則・目安数値**
- **BTNvsBB SRPでは、ボードを問わず33%betに対してAThi付近がcall/fold境界**になることが多い。
- Khiボードのハイカード防衛にはBDFD＋BDSDの両方が要求されるが、**LowボードならBDFD（2 over card付き）だけで十分**なことが多い。
- 例題のスポットでは50% betに対してAhiはindifferent（どちらでもEV同等）になる。
- MDF/alpha（例: 50%betのMDF67%＝alpha33%）はcall/fold判定の理論的土台。GTO Wizardの結論暗記ではなく、Step1→2→3の思考過程で導出できることが重要。

---

### Stage1-2 練習問題の解答・解説（na564ba427231）

**(a) スポット設定**（3bet potシリーズ。本編例題はHJ call vs BTN 3bet、T42ttボードの50%CB直面）
- 練習問題①: 3bpで**Q72r**ボードのCB直面。レンジ構成を変えるQが落ちたボードでのpocketのcall/fold判定。
- 練習問題②: 3bpで**A82tt**（twotone）ボードのCB直面。Aが落ちたボードでのpocketのcall/fold判定。

**(b) 正解**
- 画像内のため具体アクションは本文から特定不可。採点基準から:
  - ①はrainbow系ボードでは**低いランクのpocketから順にfold**するのが正解筋。
  - ②はtwotoneボードでは**ランクを問わずFDの色を持たないpocketから順にfold**するのが正解筋。

**(c) 解説の核心ロジック**
- ①: QのようなカードはHJのQhit量を大きく変える。**Preflopレンジを正確に把握していないと自レンジ内のQhit割合を見積もれない**。レンジ捕捉（Step2）の精度が問われる。
- ②: twotoneボードの**色なしpocketは、2枚のset outsのうち1枚がflush completeカードになってしまう**ため非常に弱い。rainbowボードと同じ感覚で「高いランクのpocketから順にcall」とするのは誤り。

**(d) 一般原則・目安数値**（本編Stage1-2より補完）
- 3bpのコールレンジ構成の概略: **Ahi/Khiが約40%、pocketが約50%、スーコネ等が約10%**。Ahi/Khiを全部降りても40%にしかならないので、pocketからもfoldを捻出する必要がある。
- 50%betのMDFは67%（alpha=33%）だが、実戦の均衡fold頻度はMDFより多め（例題spotで35.5%、感覚的には40%程度降りるボードも多い）。
- 均衡思考のcall/fold判定では**相手レンジ・相手戦略への言及は基本的に不要**（均衡では「相手はバランスしている」前提）。見るのは bet size / 自レンジ / 自ハンド の3つ。
- twotone: 色ありpocketをcallに残すと、set完成時にflushの無いボードになりやすいという副次的価値もある。

---

### Stage1-3 練習問題の解答・解説（n03e4119d2d7c）

**(a) スポット設定**
- テーマはレンジEQ差によるoverfold（本編例題: UTG 2bb open vs BB、K75r系ボードのCBにATがfoldになる例）。
- 研究題1「アクション由来でEQ差が生まれ高頻度foldになるspotを挙げよ」/ 研究題2「ボード由来のもの」。
- 練習問題①: EQ差があるspotでのtwotoneボード・色なしpocketのcall/fold判定（本編例題の類題、Stage1-2②の復習兼用）。
- 練習問題②: **Preflop時点のEQ差がFlopのボードによって緩和される**connectボードでのAhi判定（Stage1-1練習問題の復習兼用）。

**(b) 正解（研究題の模範解答例）**
- アクション由来のEQ差→高頻度fold:
  1. **4bp全般**: BTNvsSB 4bp 222r Flop 50%CB → SBはレンジの**52.4%をfold**（alpha33%に対し大幅overfold）。100bb effでは4bet sizeが小さくodds callレンジが広いため、SBは脆弱なcallレンジを抱える。
  2. **polarレンジでcheckしたnode**: BTNvsBB 2bp AK2r-6r-9r、x125%c-xx-36%probe → BTNは**52.4%fold**（alpha26%）。Turnで高EQハンドがbetに抜けた後のIP checkレンジはEQで大きく劣る。
  3. **Preflopレンジが広い**: BvB limp pot TTTr 75%CB → BBは**59.9%fold**（alpha約43%）。limp-checkでcapされたレンジは大量のtrashを抱える。
- ボード由来のEQ差→高頻度fold:
  1. **4bettorに有利なボード**: COvsBTN 4bp AAKr Flop 10%CB → BTNは**36.3%fold**（alpha約9%！）。COはQuadsコンボ圧倒的＋弱いハンドがほぼ無い。
  2. **Bluffが軒並み完成するRiver**: BTNvsBB 2bp KQ8r-Jtt-Tf（xx-x50c-x59%bet）→ BBは**68.9%fold**（alpha約37%）。BTNのTurn bluff（Ax・色ありlow pocket）がRiverで全て進展しtrashが消滅、BB側は弱い2pair等のtrashを大量に抱える。
- 練習問題①②の具体アクションは画像内。②は「Flop時点でEQ差が緩和されている→overfold不要→通常のalpha基準で判定」が正解筋。

**(c) 解説の核心ロジック**
- **レンジEQで大きく劣っている側は、alphaを大幅に超えるoverfoldが正当化される**（負けている状態で無理にdefenceしない）。Step1のfold頻度をEQ差で調整する。
- EQ差の発生要因は2つに切り分ける: **(i) 前street終了時点で既に大きい（アクション・ポジション由来）、(ii) ボードが片方に味方した（ボード由来）**。
- fold頻度調整で参照するのは常に「**その時点のレンジEQ**」。Preflopで差があってもFlopで緩和されていれば通常防衛に戻る。本編の模範解答の形だけ模倣すると誤る。原理に立ち返ること。

**(d) 一般原則・目安数値**
- BB vs BTNのレンジEQはIP約53%（ほぼ互角→通常のfold頻度約30%）、BB vs UTGはIP約60%（→fold約40%、alpha25%を大きく超える）。
- 高頻度foldの定番spot: 4bp全般 / polar側がcheckした後のnode / limp potなどレンジが広くcapされた側 / 4bettor有利ボード（AAKr等）/ bluffが全部進展したRiver。
- 「alpha比でどれだけ余分に降りるか」の感覚は、fold%とalphaの差（例: 52.4% vs 33%）をspotごとに蓄積して磨く。

---

### Stage1-4 練習問題の解答・解説（nbcad24a30425）

**(a) スポット設定**
- テーマはTurn/Riverのcall判定（本編例題: BTNvsBB系、AhiトップのボードでFlop 33%CBコール後、Turn 125%betに対するKhJc＝2nd pairの判定→均衡はfold）。
- 研究題: Flop 50%betにcallしたレンジがTurnカードでどう変化するかを列挙する問題（Stage1-1のcall/fold境界の復習兼用）。
- 練習問題①: Turnでのcall/fold判定。**1pairをdraw付きとdraw無しで区別**することが焦点のボード。
- 練習問題②: 対照的に**draw付き1pairがほとんど存在しないボード**でのTP判定。上位役が少ないボード。

**(b) 正解**
- 具体アクションは画像内。採点基準・出題意図から:
  - ①: draw無しTP/1pairはfold側（「実戦ではTPをcallしすぎる人が多いspot」）。
  - ②: 上位役が少ないボードではTPが自レンジ内で相対的に強い→call側が正解筋。

**(c) 解説の核心ロジック**
- Turn/Riverでは**Flopで持ち越したレンジの形**がcall/fold判定を支配する。本編例題ではTop pair(Ahit)がレンジの18%を占めるため、それを守ればSecond pair(Khit)は半分降りてよい。
- 自レンジがPreflopから現在までどう変化してきたかを正確に想起できないと、正しい手順を踏んでも誤答する（Step2の「現状の」自レンジ捕捉）。
- **1pairを一括りにせず、draw付き/無しで優先順位付けする**。
- bluff catch優先順位の研究: 相手のvalue下限（例: AJ）より下のハンドは全て「bluffには勝ちvalueには負ける」点で平等なbluff catcher。この場合**kickerの強い順にcallする理由は無く**（均衡はKTよりK9を優先callすることもある）、blocker等で選ばれる。

**(d) 一般原則・実戦目安**
- **TPのレンジ内序列はボードテクスチャに大きく依存する**: draw豊富なボードではdraw無しTPは大幅に降ろされ、dry/上位役の少ないボードではTPはレンジ上位として守る。
- PreflopレンジとFlopコールレンジを正しく捉えることが、Turn/Riverの意思決定精度の前提。
- 実戦傾向: 大きいbetに対してdraw無しTPはcallされすぎている（＝降ろす勇気を持つべきspotが多い）。

---

### Stage1-5 練習問題の解答・解説（n6c897fbea54d）

**(a) スポット設定**
- テーマはshift（本編例題: connect+flush系ボード、Flop/Turnコール後のRiverでKcが落ち、Turn 125%betコールレンジ（最低でもgutshot付き1pair）が全て進展するspotで、99のsetの判定→均衡はpure fold）。
- 研究題: Flop/Turnで50%betにcallしたレンジがRiverカードでどの役にshiftするかを列挙する問題。
- 練習問題: **shiftの大きいボードでのcall/fold判定**。setを持っているが、自レンジ内では下から数えた方が早い状況。

**(b) 正解**
- 練習問題はfoldが正解筋（「setが自レンジの中で下から数えたほうが早いほど弱いハンドになってしまっていることに気づければ回答しやすかった」）。本編例題でも99 set相当はpure fold。

**(c) 解説の核心ロジック**
- **shift＝前streetで持ち越したレンジの弱い部分が、落ちたカードで強化されること**。例: K9→2pair、QJ→straight、56cc→flush。
- shiftが起きるとレンジ下限が引き上がり、**絶対的には強い役（set等）がレンジ内では最弱クラスに転落**する。Riverレンジの役内訳を見ると最弱がTwo pairということも起こる（1pairがレンジに存在しない）。
- 判定手順: Riverで進展した役を正確に判定 → 1pair/2pair等のレンジ内割合を推定 → 「降りないハンドが60%（=MDF相当）あるか」の観点でFlush/Straightの割合から逆算してもよい。
- naked SD（FD無し・hit無しのSD）とhit付きSDを区別して列挙できるのが理想（＝ハンドを2枚で見る力）。

**(d) 一般原則・補足（blocker）**
- Turnの125%bet（大サイズ）に対するコールレンジは**draw無しのただの1pairは全fold、最低でもgutshot付き1pairから**。この「コールレンジの下限」がRiverのshift分析の起点になる。
- blocker補足: 入り組んだspotでは「役として弱い順にfold」が崩れる。均衡は88より弱いAT(Tc持ち＝相手valueをblock)を高頻度call、JTの2pairを高頻度callし、**代わりに7xのstraightの半分ほどをfold**する。Stage1では採点対象外だが、blockerはアクションに大きく影響する（後のStageで詳説）。
- 勉強法: Turn→Riverと進むにつれ強い役が相対的に弱体化するボードを自作して解くのが効果的。

---

### Stage1~3 復習問題①（nf35766502bdd）

**(a) スポット設定**
- メンバーシップ向け、Stage4に進む前の知識定着用。問題2問（画像内）。解答解説から: 問1は**UTGvsBB 2bp**のTurn call判定（Stage1の復習）、問2は**BTNvsBB 2bp**のFlop CB戦略（Stage2の復習）。
- 問題文自体は全て画像のため、詳細設定はテキストに残っていない。

**(b)(c)(d)** → 解答編（naec84301ceca）参照。

---

### Stage1~3 復習問題① 解答と解説（naec84301ceca）

**(a) スポット設定**
- 復習問題1: UTGvsBB 2bp。FlopでCBにdefence後、Turnでのcall/fold判定（自ハンド・ボードは画像内）。
- 復習問題2: BTNvsBB 2bp。under pocket（ボード最小カード未満のpocket）でのFlop CB判定（bet or check）。

**(b) 正解**
- 問1: Turnでは通常防衛（overfold不要）→call側が正解筋。
- 問2: **pure check**（33%betの頻度すら設けない）。

**(c) 解説の核心ロジック**
- 問1: UTGvsBB 2bpは**Flop時点でEQ差がありBBはMDFよりoverfold**する（Stage1-3の内容）。しかし**FlopでBBのtrashが落ちたことでTurnではEQが拮抗**しており、Turnで追加のoverfoldは不要。「その時点のレンジEQ」を参照するという原則の実践。
- 問2: 当該spotのCB戦略はpolar。**under pocketは一般にcheck頻度が高い**ため、焦点は「33%bet頻度を設けるか否か」。レンジ全体のCB戦略でsmall bet頻度が少ないと推定できれば、pure checkに到達できる。

**(d) 一般原則**
- overfoldの判定はstreetごとにリセットして考える: 前streetでtrashを降ろし終えていれば、次streetは通常のMDF感覚に戻る。
- ハンド単体の判定は「レンジ全体のsize別bet頻度」から降ろして考える（レンジ→ハンドの順）。
- 採点配分も「Turnに持ち越した自レンジへの言及」「自レンジ概形の推定」に大半が割かれており、**結論よりレンジ捕捉の過程**が重視される。

---

### Stage1~3 復習問題②（n95ec3c83b43e）

**(a) スポット設定**
- メンバーシップ向け復習問題の第2弾、2問（いずれも画像内）。解答解説から: 問3は**UTGvsBB 2bpのRiver（01-game類似）でのbet戦略**（Stage2-4の復習）、問4は**River bluff raise判定**（Stage3-4の復習）。

**(b)(c)(d)** → 解答編（nb3ab06421429）参照。

---

### Stage1~3 復習問題② 解答と解説（nb3ab06421429）

**(a) スポット設定**
- 練習問題3: UTGvsBB 2bp。Flop 50%CBにBBがシビアにdefenceした後のRiver。UTG側のbet戦略を複数ハンドについて答える問題（01-game的状況）。
- 練習問題4: River bluff raise判定。TurnまでコールしてRiverでbottom pair（2xのペア）を拾ったspot。ボードは89でnuts straightが完成する構造（詳細は画像内）。

**(b) 正解**
- 問3: **01-game likeに戦略を組み、small bet頻度を高くする**。各ハンドの具体アクションは画像内（各2点×2ハンド分の採点）。
- 問4: **Riverで拾った2xのbottom pairでbluff raise**を選択するのが正解。

**(c) 解説の核心ロジック**
- 問3: Flop 50%CBに対するBBのシビアなdefenceの結果、**River時点ではBB側にEQ advantageがある**。さらにUTGの弱いハンド群には強いハイカードが濃いため、通常の01-gameとは少し違う戦略になる。核心は「**相手のレンジの濃い部分をindifferentにするbet sizeを選ぶ**」という考え方（Stage4以降でも重要）。
- 問4: bluff raiseの候補は「相手のbet/callレンジを押さえている（blockしている）ハンド」だが、**89（nuts straightブロッカー）はIPのTurnでpure betに回っているため、River IPのbet/callレンジに存在しない**→blockerとして機能しない。代わりにRiverで拾ったbottom pairが典型的なbluff raise要員になる。

**(d) 一般原則**
- River戦略設計: 相手レンジのどこが厚いかを見て、そこをindifferentにするsizeを選ぶ（01-gameの応用）。
- blocker評価は「そのカードが**相手の現在のレンジに実在するか**」が前提。前streetのアクションで抜けているコンボはblockできない。**常に相手レンジの形（どのnodeで何が抜けたか）を意識する**こと。
- Riverで拾ったbottom pairは、相手のvalueに勝てないがbluffには勝つ×相手の該当コンボを消す、というbluff raiseの典型資源。

---

## 全体を貫く学習ポイント（横断まとめ）

1. **Step1→2→3の型を崩さない**: bet size→fold頻度（EQ差で調整）→shiftに注意して現レンジ捕捉→弱い順にfold群→自ハンド判定。相手レンジ・戦略への言及からcall/foldを導くのは原則誤り。
2. **「役の強さ順」ではなく「レンジ内序列＋発展性」**: draw付きを優先防衛、twotoneの色なしpocketは即fold候補、shift後のsetは最弱クラスになり得る。
3. **数値の錨**: 50%bet→alpha33%（実戦は35〜40%fold）、33%bet vs BTNvsBB SRPの境界はAThi付近、EQ差spotではalpha+10〜20pt級のoverfold（例: alpha33%に対し52%fold、alpha9%に対し36%fold）。
4. **ハンドは常に2枚で見る**: kicker由来のSD/BDFD、naked SDとhit SDの区別、blockerの実在性チェック。

---

# Part 2: Stage2「Bet判定均衡思考」解答・解説


出典: note.com 連載「週刊均衡」(gto_theorem) Stage2-1〜2-5 の解答・解説記事（文責: Drama @RiverProbe）。
理論本編はロックされているため、本ノートは解答・解説の本文テキストからStage2理論を復元したもの。
※問題文・解答表の多くは画像掲載のため、盤面・頻度の一部は本文で言及された範囲のみ記載。

---

### Stage2-1: Range bet（n22fab336b6f9 / 2025-06-27）

**(a) スポット設定**

- 研究題（レンジアドバンテージの有無を判定する4問）
  - BTN vs BB SRP K83r → あり
  - UTG vs BB SRP AKJr → あり
  - BTN vs BB SRP Ts9s5h → **なし**
  - BTN vs BB SRP AK5r → **あり**（ただしrange betはしない例外例）
- 練習問題: range betとなるボードでのCB判断（詳細盤面は画像内）
- 発展問題: UTG vs BB SRP **844r**（originalに多いカードが落ちていないボード）

**(b) 正解**

- 練習問題: **range bet（レンジ全体で33%bet）**。採点は「range betと言及=5点」「33%betを選択=5点」。
  - なお均衡ではcheck頻度や50%betもわずかに発生するが、「range全体として小さいサイズを高頻度でのっぺり打つ」ものはrange betと呼ぶ。
- 発展問題: **range bet寄りだがcheck頻度がそれなりにあり、check or 33%betの混合戦略**が正解（range bet言及3点 / check頻度への言及3点 / 混合頻度の適切さ4点）。

**(c) 解説の核心ロジック**

- レンジアドバンテージは「一方に弱いハンドが少なく、もう一方に弱いハンドが多い」ときに発生する。
- 判定はボードテクスチャの見た目ではなく **EQ chart（EQ graph）の形** で行う。PreflopレンジのEQ差が大きいポジション関係（UTG vs BBなど）では、844rのようにoriginal側のカードが落ちていないボードでもレンジアドバンテージが発生する（844rではnuts級のtripsのみBB側だが、全体ではUTG優位）。
- AK5rは「レンジアドバンテージはあるのにrange betはしない」奇妙な例。→ **レンジアドバンテージはrange betの必要条件であって十分条件ではない**。
- 余談として重要な既知事実: UTG vs BBのmiddle〜low paired boardでは、BBは33%CBに対し**超高頻度でcheck raise**を返す。理由は、UTGの強いレンジに対してcallで守れるハンドが少なく、pair系はprotectionを要するものが多いため。

**(d) 復元できる一般原則**

- range betの定義: レンジ全体で小さいサイズ（目安**33%pot**）を高頻度で打つCB。
- range betの成立条件: レンジアドバンテージ（EQ chart全域での優位）が前提。ただしそれだけでは決まらない（AK5r反例）。
- レンジアドバンテージ判定は「ボードの見た目」ではなく「両者のEQ分布の形」。ポジション間のPreflop EQ差が大きいほど、地味なボードでもrange bet化しやすい。
- 実戦目安: range betボード=33%一択で簡潔に。境界ボード（844r型）はcheckを混ぜた33%betとの混合。

---

### Stage2-2: 概論 — range betでないボードのサイズ選択（n24030ea8fccb / 2025-07-04）

**(a) スポット設定**

- 練習問題①: 本編例題ベースのスポットで「自ハンドが打ちうるサイズ」を考える問題（盤面は画像内）。
- 練習問題➁: **Thi（Tハイ）ボード**でのハンド打ち分け。
- 練習問題③: ➁と同じThiボードで **JJ** を持っている場合の戦略。

**(b) 正解**

- ①➁の採点: 「レンジ全体の戦略に正しく言及=5点」「自ハンドが各bet sizeに適するか判定=5点」。
- ③の採点: レンジ全体の戦略3点 / 各サイズ適性判定3点 / **頻度振り分け4点**。
- ③の正解: ThiボードにはoverbetGO（**125%bet**）頻度があり、JJはpureに125%を打つのではなく **125% / 75% / 50% を頻度で混合**する。

**(c) 解説の核心ロジック**

- 意思決定の流れ: まず「レンジ全体でどのサイズ構成を使うボードか」→次に「自ハンドがどのサイズに適するか」。
- **value下限の判定基準**: 相手のid帯（indifferent帯）の「直上」ではなく、その**少し上**がvalue下限。id帯の直上で打つと、相手のコールレンジに対して自ハンドのEQが50%を切る（＝**水没**する）ことが多いため。
- JJが複数サイズを混合する理由: **各サイズのbet rangeのバランスを取るため**（1サイズに偏るとそのレンジ構成が崩れる）。
- ハンド打ち分けの経験則:
  - ボードの**top card直上付近のペアはbet頻度が上がる**
  - **top cardより下のペアはbet頻度が下がる**
- 混合戦略の作り方: **レンジ全体のアクション頻度をベースに、自ハンドの性質で少しずらす**のが自然。

**(d) 復元できる一般原則**

- ボードテクスチャごとの「レンジ全体で使うサイズ構成」はある程度**暗記が必要**（Thiボード=overbet 125%が発生する、など）。
- value bet下限の実戦目安: 「相手のid帯直上より少し上」。判定は相手コールレンジに対しEQ50%を確保できるか（水没チェック）。
- 常に「レンジ→ハンド」の順で考える（Stage2全体の思考順序）。

---

### Stage2-3: Urgency（n9506bc946d7d / 2025-07-11）

**(a) スポット設定**

- 研究題A: depolarな特大CBが出るボードの観察
  - **BvB 2bp 853r** — BBのpocket 3bet下限が99付近のため、SBが一方的にoverpairを持つ
  - **BB vs UTG 3bp AK3 monotone**
  - **SB vs BTN 3bp JThiボード**（depolarの最有名例）
  - **SB vs BTN 3bp 542tt**（BTNのtop pocketが99 → jam CB）
- 研究題B: 2e size（geometric系）が出るスポットの列挙
  - 2bp Flop xx後のOOP turn probe（straight/flush未完成ボード全般）
  - 2bp Flop xx後、IP側にnutsがあるボードでのIP delay CB（nutsのAKがIPのみ）
  - 3bp Flop CB後、Turnでurgencyが発生し結果的に2eに近いラインになるケース
- 練習問題: **SB vs BTN 3bp Jhiボード**、QQとJJ（nuts）の扱い。
- 発展問題: Turnで激しいshiftが起きた場面のdonk。**Turn Qhで自レンジが強化**され、**straight(9x)** がurgencyの高いハンド、**99をdonk jam**するスポット。

**(b) 正解**

- 練習問題: レンジ→ハンドの順で言及(2点)。**QQ=urgencyが高い→大きいサイズでbet**(3点)。**JJ(nuts)=passiveにプレイ**(3点)し、**レンジ全体で使う全サイズに配分**(2点)。※125%betも低頻度で使われるボードだが例外的で言及不要。
- 発展問題: Turn Qhでの自レンジ強化に気づく(3点)、straight(9x)のurgency言及(3点)、**99はdonk jam**が正解。他ハンド・他サイズの扱いまで正しく考えるのは高難度。

**(c) 解説の核心ロジック**

- **Urgencyの定義（復元）**: 「次のストリートで安心して二発目のvalueを打てるアウツが少ない」場面で発生する、今すぐ大きく取り切る必要性。
  - 例: SB vs BTN 3bp **J97r**のQQは、TurnにT,8,J,K,Aが落ちると安心してbarrelできない → **urgencyあり**。同じQQでも**752r**ではurgencyなし。
- urgencyの高いvulnerable pair＋高EQドローを混合して特大CB（jam含む）を打つのが**depolar構成**。JThiボードでJJ/TTがlarge betを選ばないのが典型（nutsはpassive、脆い強ハンドがlarge）。
- 853r・542ttでは「相手のpocket上限（99）より上のoverpairを一方的に持つ」というレンジ非対称がjam級CBを生む。542ttはovercardに加えA,3,6落ちでもoverpairの価値が落ちるため見た目以上にurgencyが高い。
- AK3 monotoneは「相手のflushをケア」ではなく「色持ちpocketに捲られる前にvalueを取り切る」ためのlarge CB（両者ともレンジ内flush割合は小さい）。
- **2e（geometric）sizeの必要条件はナッツアドバンテージ**。IPのFlop check後はIPに2pair+が少なくなるため、OOPがpolar rangeでcheck rangeを攻撃する。
- レンジ思考を経由する理由: 「urgencyがありそうだからlarge」でも単問は解けるが、レンジを経由しないとハンドよがりでバランスを欠く。

**(d) 復元できる一般原則**

- nutsは受け身に・全サイズに薄く配分、urgencyの高い脆い強ハンドが大サイズを牽引する（depolar large bet）。
- urgency判定の実戦手順: 「Turnで何枚の悪いカードがあるか」を数える（J97rのQQ=T,8,J,K,Aの5種で危険）。
- 相手レンジのpocket下限（3bet下限が99付近など）を把握すると「一方的overpairスポット」= jam級CBスポットを特定できる。
- 2e size（2ストリートgeometric）はナッツアドバンテージ＋相手レンジがcapされている局面で出現（turn probe、delay CBが代表例）。

---

### Stage2-4: 01-game（nb64af46ea957 / 2025-07-18）

**(a) スポット設定**

- 練習問題①: BTNが絡むスポットで01-gameを実スポットに応用（River、盤面詳細は画像内。BTN側のTurnまでの戦略から各ハンドのEQを概算する）。
- 練習問題➁: ポジション関係を **UTG vs BTN** に変えた同型スポット。登場ハンド: **A4s**（ほぼレンジ下限）、**QJo**（2pair、nuts級EQ）、**QQ**（真のnuts）。OOPの選択肢に**36%bet**を含む複数サイズ。

**(b) 正解**

- ①: 各ハンドのEQを概算し01-gameに当てはめる。**nutsは全アクション（全サイズ+check）を混合戦略として選択**（2点）。
- ➁: **A4s=bluff**（ほぼレンジ下限のため）。**QJo=nuts級EQとして扱う**。**bluffも全アクションの混合戦略**（2点）。
- ➁の例外: 真のnutsである**QQは全アクションを混合しない**。理由は**blocker**——36%betにはIPのQxからvalue raiseが返ってくるが、QQはそのQxをブロックしており、small betのEVが明確に下がるため。

**(c) 解説の核心ロジック**

- 01-game（[0,1]ゲーム）の使い方: **各ハンドのおおよそのEQを推定できれば、選ぶべきアクションは01-gameが教えてくれる**。
- EQ概算には「PreflopレンジからFlop, Turnへ持ち越した相手レンジの形」の把握が必須（採点でも5点と最大の配点）。ポジション関係が変わる（BTN→UTG）とPreflopレンジが変わり、River突入時のEQ把握が難しくなる。
- 01-gameの帰結: EQ順に value bet / bluff catch(check) / bluff が割り当てられ、**nutsとレンジ下限のbluffは全サイズ+checkを混合**する（polar両端は全アクション無差別）。
- 現実の修正要素は**blocker**: 相手のraiseレンジをブロックするnutsはsmall betのEVが下がり、混合から外れる。

**(d) 復元できる一般原則**

- 01-gameの概念（復元）: Riverなど静的な局面を[0,1]上のEQ分布ゲームとして近似し、ハンドのEQ位置だけでアクションを決めるモデル。
- 実戦手順: ①相手のRiver到達レンジを再構成 → ②自ハンドのEQ(レンジ内順位)を概算 → ③01-gameの解（nuts=全サイズ混合、下限=bluffで全サイズ混合、中間=check/bluff catch）を適用 → ④blockerで補正。
- 「2pairでもnuts級EQ」(QJo)のように、絶対的な役ではなく**相手レンジに対するEQ順位**で判断する。

---

### Stage2-5: 01-game後のIP（na5df98c15525 / 2025-07-25）

**(a) スポット設定**

- 練習問題: OOPが01-game likeに打つ状況（2bp、middle-hiボード系）での**Turn IP check range**とRiverの各ハンドのアクション選択（盤面は画像内。OOPの36%betが登場）。
- 発展問題: Turn IPのcheck rangeが**ハイカードに濃くなっている**参考画像から、**OOPのvalue下限→IPのvalue下限を推測**する問題。
- 応用編: Turn IPがone pairを全体的に**fast play**しているため、RiverのOOP・IP双方のvalue下限が低くなっているスポット（River IPの**73%bet**に対するOOPの防御を観察）。

**(b) 正解**

- 採点: 「OOPが01-game likeに打つと言及=3点」「Turn IP check rangeへの言及=4点(練習)/ハイカード濃度への言及=2点(発展)」「各ハンドの正しいアクション/正しいvalue下限推定=各1点」。
- bluff開始位置の目安: **Kx middle kicker（K8〜K6付近）からbluffを打ち始める**。相手のid帯直下（KQhi, KJhi）はbluff候補に**入らない**。
- River IPのbetに対し、OOPは**MDF準拠に守らない**のが正解（73%betに対しレンジの約60%をfold）。一方、IPがOOPの36%betに対して守るときは**MDF準拠**。

**(c) 解説の核心ロジック**

- OOPが01-game likeになりやすい**middle-hiボード**では、Riverで**お互いAhiのid帯（indifferent帯）を取り合う**構図になる。
- 相手のid帯直下のハンド（KQhi/KJhi等）がbluffしない理由: 「相手がbluff catchできるほど強いハンドの直下」には大抵**十分なshowdown value**があるため。→ bluffはさらに下のKx middle kickerから。一枚ストレートボード等でshiftがあれば、bluff開始ランクはもう少し上がる。
- Turn IPがone pairをfast playする理由: 相手レンジの大部分が2over（特にAhi）で、low pairが**protection**を要する。**Ahi全てにgutshotが付いている**ため、Turn時点でこれらをindifferentにしておくこと自体に価値がある。→ 結果としてRiverの両者value下限が低下。
- OOPがMDF通り守らない理由 = **EQの切り離し**: OOP側にbluffを諦めたtrash handが一定数あり、それらは最初からbetに抵抗する気がない（MDFはレンジ全体が防御に参加する前提の指標）。

**(d) 復元できる一般原則**

- 01-game後のIP戦略: OOPのcheckを受けたIPは、OOPのvalue下限から自分のvalue下限を**相対的に**推定する（OOPの下限が下がればIPの下限も下がる）。
- bluff選択の実戦目安: 相手id帯（Ahi想定）の直下はbluffせずSDVで勝負、**2段下（Kx middle kicker以下）からbluff**。
- MDFの適用限界: 相手レンジに「降りることが最初から確定しているtrash」が多い局面（EQの切り離し発生時）では、均衡でもfold率がMDFを大きく超える（73%betにfold約60%）。→ 実戦でも「相手はMDFで守ってこない」前提でvalue寄りに打てる。

---

## Stage2 全体の思考フレーム（総括）

1. **常に「レンジ全体の戦略 → 自ハンドの戦略」の順**で考える（全記事の採点基準に共通）。ハンド先行はバランスを欠く。
2. **range bet判定**: EQ chartの形でレンジアドバンテージを確認 → 成立なら33%レンジベット。ただしレンジアドバンテージ≠range bet（AK5r）。
3. **range betでないボード**: そのボードのサイズ構成（暗記要素）→ 自ハンドの適サイズ → 頻度混合。value下限は「相手id帯の少し上」（コールレンジにEQ50%＝水没回避）。
4. **Urgency**: 次streetで安心して二発目を打てるアウツが少ないとき、脆い強ハンド＋高EQドローでdepolarな特大bet。nutsはpassiveに全サイズへ配分。
5. **01-game**: 静的局面ではEQ概算→[0,1]ゲームの解を適用。nutsとレンジ下限bluffは全アクション混合、blockerで補正。01-game後は相手のvalue下限から自分の下限を導き、EQの切り離しがあればMDFは成立しない。

---

# Part 3: Stage3「Bluff判定均衡思考」解答・解説＋金脈spot


出典: note.com 週刊均衡（gto_theorem）/ 文責: Drama(@RiverProbe)
注: 理論本編はロックされているため、無料公開の解答・解説6本＋番外編2本のテキストから理論を復元した。問題図・解答表の多くは画像のため、ボード・正解頻度の一部は本文テキストで言及された範囲のみ記載。

---

### Stage3-1: RiverのBluff判定（n15522a9ace8b）

**(a) スポット設定**
- 練習問題①: UTG vs BB のシングルレイズポット。Riverでのbluff候補選定問題。IP側の状況は「01-game後のIP」（＝Turnまでチェックが続き、Riverだけが残った0-1ゲーム的な局面）と解釈してよい。
- 練習問題②: BTN vs BB、Flopで75%betを挟んだラインのRiver。出題には誤植があり、本来はBB側A3hh（A3スーテッドハート）のRiverアクションを問う意図（BTN側bluff精査と読んだ人向けに両側の解答が用意された）。

**(b) 正解**
- ①: bluffを実行する（サイズは01-gameのIP betサイズ理論に従う）。UTGのレンジが狭いため、BTNvsBBより高いランクのハンドまでbluffに回る。
- ②: 均衡ではBTNのA3hhに一部bluff頻度が発生する（純粋なcheckではない）。

**(c) 解説の核心ロジック（A3hhのbluff頻度の理由）**
- BB側はtrashになったheartスーテッドコンボを全てbetに打ち出している → 自分の持つ「3h」は相手のcheck/foldレンジを全くblockしていない（unblock成功）。
- 一方で3hは相手のcheck/call or raiseレンジ（63hh、43hhなど）をblockしている。
- 「foldするレンジをunblockし、続行するレンジをblockする」＝blockerとして優秀なので、レンジ下限でなくてもbluff頻度が付く。

**(d) 復元できる一般原則・採点基準から見えるbluff判定の型**
採点基準がそのままStage3の「River bluff判定の型」になっている:
1. River突入時点の**自レンジ全体**を確認する（自ハンド単体から考えない）
2. 自レンジの**弱い順**にbluff候補を挙げる
3. **レンジ全体の戦略**から自ハンドの戦略を決定する
4. その上でアクション（bet/check、サイズ）を選ぶ
- 補足原則: Preflopレンジが狭いポジション（UTGなど）ほど、bluffに回るハンドのランクは高くなる。
- blockerの原則（②より）: 良いblocker = 相手の続行レンジ（call/raise）を抑え、相手のfoldレンジを抑えていないカード。

---

### Stage3-2: TurnのBluff判定（na46ed0832212）

**(a) スポット設定**
- Turnでのbluff候補構築を3問。問1・問2はボードテクスチャからbluff候補を挙げる基礎問題。問3はUTGが75%betを打つライン（3ストリートの持ち越しレンジを考える必要がある応用問題）。

**(b) 正解**
- 問1・問2: **drawのあるハンドをbluff候補にし、drawのないハンドはbluffしない**のが正解の骨子。
- 問3: TurnでIPが抱えるレンジ下限は1pair。その中で「捲り目（改善アウツ）のある1pair」がbluff候補。具体例として**ATまでbluffに回る**。このUTG 75%betではAK・QQがindifferentになっており、AT betはbluffとして正しく機能している。

**(c) 解説の核心ロジック**
- Turn bluffの第一基準はボードテクスチャ: draw（エクイティ）の有無でbluff候補を仕分ける。これはプレイ中に瞬時にできる必要がある基礎動作。
- 応用局面ではPreflop→Flop→Turnと**持ち越してきた自レンジ**を先に確定する（Stage1-4の内容）。レンジ下限が1pairしかないなら、1pairの中から捲り目のあるものをbluffに選ぶ。
- 「bluffとして機能しているか」の判定基準: 相手のindifferentハンド（AK・QQ等）よりさらに弱いハンドで打てていればbluffとして成立。

**(d) 一般原則・実戦目安**
- Turn bluff候補 = draw持ち ＞ drawなし（原則bluffしない）。
- レンジが強い状況（3bet pot、4bet potなど自レンジに強い役が多い状況）では、bluffに回せる弱いハンドが少なく**bluff構築の難易度が大きく上がる**。「レンジ下限＋捲り目」までbluffに使う覚悟が必要。
- 練習法: GTO Wizardでボードを並べ、bluff候補を予想→答え合わせを反復する。

---

### Stage3-3: FlopのCB Bluff構築（n80e90c377f3f）

**(a) スポット設定**
- Polar CB（ポラライズしたラージCB）のレンジ構築を2問。問1はBTN vs BBで、BB側の強いハンドがA4・Q4・44に限られるボード（A/Q/4系のボードと推定。BBはAQをほぼPreflopで3betに回している）。問2は本編例題の延長で、2xの一部をbluffに加える問題。

**(b) 正解**
- 問1: draw持ちに加えて**4xをbluff候補に挙げる**のが正解のキモ。
- 問2: 本編で扱ったbluffハンド＋**2xの一部**をbluffに追加（2xは挙げなくても減点なし）。

**(c) 解説の核心ロジック**
- 問1（4xのblocker価値）: BB側の3bet構成により、BB（相手）が持ちうる強いハンドはA4・Q4・44のみで、**全てが4を含む**。自分が4を持てば相手が強い可能性が急減し、他のハンドよりbluff成功率が上がる → 4xはdrawがなくても優秀なbluff。
- 問2（outs cleaning）: 2xをbetして**上のkicker（自分より良い同種ハンド）をfoldさせることで、自分のoutsを有効化する**考え方。この「上位キッカーを降ろしてアウツを綺麗にする」戦略はouts cleaningと呼ばれ、均衡でしばしば現れる。

**(d) 一般原則**
- Polar CBのbluff候補は2系統: ①draw持ち（エクイティ型）②blockerの良いハンド（除去型: 相手の限られた強ハンドを抑えるカード）。
- 相手のPreflop構成（3bet傾向）まで遡って「相手の強ハンドが何に集中しているか」を特定すると、意外なカードが最強blockerになる。
- bluff優先順位はボードテクスチャで大きく変動する。お互いのレンジ精査→CB戦略確認→その上でbluff候補の有用性を判断、の順序を崩さない。

---

### Stage3-4: RiverのRaise Bluff（n70f7f538cbe3）

**(a) スポット設定**
- 練習問題1: OOPのRiver 60%betに対し、IPが複数ハンドで raise/call/fold を判定する問題（raiseサイズは42%と80%の2種類が用意されている）。
- 練習問題2: OOPがFlopでcallしたレンジ（XYddのFDコンボを含む）から、Riverで27%の小さいbetを打ってくるnode。ヒントなしでbluff raise候補を見極める問題。

**(b) 正解**
- 問1: **相手のbet/callレンジ（続行レンジ）をblockしているハンドがbluff raise候補**。bluffを抑えているハンドはfold、valueを抑えているハンドはcall、という仕分けが採点対象。raiseサイズは問わない（raiseを選べていればOK）。
- 問2: **ダイヤを持たないハンド**にbluff raise頻度が付く。ダイヤ持ちは相手のRiver bluff（滑ったXYdd）を抑えてしまうためcall EV・raise EVがともに下がる。

**(c) 解説の核心ロジック**
- Raise bluffのblocker三分法（問1採点基準より）:
  - 相手の**bluffをblock**している → 相手はfoldしやすいハンドを持っている可能性が減る → **fold**
  - 相手の**valueをblock**している → **call**（ブラフキャッチ向き）
  - 相手の**bet/call（続行）レンジをblock** → **bluff raise**候補
- サイズの細部（87s vs 54sの例）: IPの87sは80%raiseのみ、54sは42%raiseも使う。理由はOOPの応答: OOPの57s・56s（2pair）は42%raiseにはcallするが80%raiseにはfoldする。54sは「80%raiseのfoldターゲットである2pair」を自ら抑えてしまっているため、相対的に42%raiseのEVがマシになる。→ **raiseサイズの選択すら「そのサイズでfoldさせたいレンジをblockしていないか」で決まる**。
- 問2: 相手のFlop callレンジを想起 →「Riverの小サイズbetに含まれるbluffは何か（滑ったFD＝XYdd）」を特定 → それをunblockするハンドでraise。

**(d) 一般原則**
- Raise bluffの条件 = 相手の「betして、raiseにcallしてくるレンジ」をblockし、相手の「betして、raiseにfoldするレンジ（bluff）」をunblockしていること。
- 相手のbluffを抑えるカード（この例ではダイヤ）は、call EVもraise EVも同時に下げる → おとなしくfold側に寄る。
- 相手のライン（Flop call→River小bet）からbluffの構成銘柄を逆算するのがraise bluff判定の出発点。

---

### Stage3-5: Flop・TurnのRaise Bluff（n84e054baf4dc）

**(a) スポット設定**
- 練習問題1: 候補ハンドの中からbluff raiseするものを見極める問題。ボードは6・3を含むローボード系（call/fold境界が「6hit・3hit・99以下のpocket」）。
- 練習問題2: drawが濃いボードでのbluff raise候補選定。TとPが良いblockerになるボード（T・9が重要カード）。

**(b) 正解**
- 問1: **A~Tを含むハンドが良いblocker、それ以外は悪いblocker**。call/fold境界のうち6hit・3hitはbluff raise候補になり得るが、**pocketペア（99以下）はcall/fold境界でもbluff raiseしない**。
- 問2: **combo draw**と**hit+draw**からbluff raise候補を選ぶ。**nuts FDはbluff raiseしない**、**純粋なhit単品（ペアのみ）もbluff raiseしない**。

**(c) 解説の核心ロジック**
- 問1: 「call/fold境界のハンドがbluff raiseに向く」のは、多くの場合それらが**2pair・set・straightなど相手の強いハンドをblockしているから**。pocketペアはボードと絡まずこれらをblockしないので、境界ハンドであってもraiseに回さない。→「境界だからraise」ではなく「境界かつblockerが良いからraise」。
- 問2: draw濃ボードではdrawハンドが多すぎるため、**かなり絞って**bluff raiseする。
  - nuts FDを外す理由: raiseに3bet jamが返ってきた時のEV損失が激しい（降りるにはエクイティが勿体なく、続けるにはコストが大きい）。
  - hit単品を外す理由: EQが低すぎる＋blockerが悪い。
  - 残るのは「combo draw」「hit+draw」＝raiseが失敗しても捲れる複合エクイティ持ち。

**(d) 一般原則・実戦目安**
- Flop/Turnのraise bluff選定基準（Riverと違いエクイティが残る点が鍵）:
  1. blockerの良さ（相手の続行・強ハンドを抑える。この種のボードではA~Tのハイカードが良blocker）
  2. 3bet jamを返された時の損失が小さいこと（nuts FDは不適）
  3. raise失敗時のバックアップエクイティ（combo draw / hit+draw が最適、hit単品は不適）
- pocketペアは境界ハンドでもraise bluffに使わない、と型で覚えてよい。

---

### Stage3-6: 難しいBluff（n634a02441d98）

**(a) スポット設定**
- 練習問題1: drawの良型が少ない（ドライな）ボードでのTurn 75% bluff構築。
- 練習問題2: Flopから持ち越したレンジの下限がpairしかなく、**pairをbluffしなければならない**River（UTGが相手のスポット）。

**(b) 正解**
- 問1: **弱いハイカードを満遍なくbluffする**。ただし**Aハイ good kickerはbluffしない**（勿体ない）。根拠: Turn 75%betに対するBB側のdefense下限は「AJhi～naked pair」なので、AJ以上のAハイはbluffではなく薄いショーダウンバリュー/ブラフキャッチとして機能する。
- 問2: **low pairをbluffに回し、FD滑り（ミスしたFD）はbluffしない**。

**(c) 解説の核心ロジック**
- 問1: 相手のdefense下限（AJhi～naked pair）を特定すると、自分のAハイがkickerによって「bluffとして機能する側（弱kicker）」と「bluffには勿体ない側（good kicker＝相手のfoldレンジに勝っている）」に分かれる。
- 問2: pairをbluffしハイカードをあまりbluffしないのは**blockerによる**。
  - low card 2枚のハンド（low pair含む）はUTGのfoldレンジをblockしていない → bluff EVが高い。
  - middle card 2枚のハンド（特に**9含み**）は相手のfoldレンジを抑えている → bluff EVが伸びない。FD滑りはこのmiddle card帯に該当。

**(d) 一般原則**
- 「bluffするには強すぎる」の判定式: 自ハンドが**相手のdefense下限に勝っているならbluffしない**（betしてもfoldするのは自分が既に勝っているハンドだけ）。実戦目安: 75% turn betへのBB defense下限 ≒ AJhi～naked pair。
- レンジ下限がpairしかない場合はpairでもbluffする。ハンドの絶対的な強さよりも「相手のfoldレンジをunblockしているか」が優先される（low pair > 9含みミスFD、が典型例）。
- これはStage3-1のblocker原則（foldレンジunblock＋続行レンジblockが良bluff）のRiver応用形。

---

### 番外編 金脈spot #1: ローボード→overcard turnのdouble barrel（nc0b1ac7d3f71）

**(a) スポット概要**
- 「金脈spot」= 多くのプレイヤーに刺さる（＝人口の多くが均衡からズレていて）EVの高いexploit引き出しのこと。強いプレイヤーは自分だけの金脈spotを複数持つ。
- 題材: Flopローボードでbottom hitしたKh2h（BB側と推定）が、Turnにovercard（A）が落ちた後の75% double barrelを守るかどうか。

**(b) 均衡での正解**
- Kh2h（bottom pair）は**call/fold境界**。foldではない。Turnの75% double barrelに対し、Flop時点のpairは**ランクを問わず全体的にindifferent付近まで追い込まれる**（bottom pairでも一部守らなければならない）。
- Turn overbetに対してさえ、BBはFlop時点のweak pairを一部defenseする必要がある。

**(c) 人口のリークと実戦Exploit**
- リーク: 「Flopローボード＋Turnにovercard」のdouble barrelに対し、**weak pairがoverfoldになりやすい**（Aが落ちたbottom pair＝fold、と反射的に降りる人が多い）。
- Exploit（攻め側の戦略）:
  1. **Flop時点からTurnを見据えてbluffを開始する**（overcardは高確率で落ちるので、double barrel前提でFlopのbluffレンジを広げる）。
  2. Flopで**middle size以上のbet**を使う。これで2 overcardのハイカードのoverfoldも同時に取れると更に良い。ハイカードのfloatが足りない相手は、overcardが落ちたTurnでdefenseレンジを確保できず崩壊する。
  3. Turnでは**overbet**まで使える（筆者の実戦例）。overbetに対してもweak pairの一部defenseが均衡要求なので、overfoldする相手からのEVは非常に大きい。

**(d) 一般化**
- 「均衡ではindifferent境界に追い込まれるハンド群」×「人口が反射的にfoldする状況」= 金脈。攻め側はその境界を強く叩くサイズ（middle+〜overbet）とライン（barrel前提のFlop bluff拡張）を選ぶ。

---

### 番外編 金脈spot #2: 2BWボードのsecond pair tough callを狩る（nc1a26bcc4aa9）

**(a) スポット概要**
- FlopでThit（second pair）した**JThd**を、75% CBに対してdefenseするかどうか。ボードはbroadway 2枚（Tより上のカードが1枚ある、例: A/K/Q + T系）の2BWボード。

**(b) 均衡での正解**
- **JThdはpure fold**。second pairだが75% CBに対して守れない（Stage1-3で既出の内容）。

**(c) 人口のリークと実戦Exploit**
- リーク: この場面での**second pairのtough call**（ラフに守りすぎ）は非常に多くのプレイヤーに見られる。
- Exploit（攻め側）: 均衡の75% bet rangeのvalueは基本的に**AJ+（トップペア強キッカー以上）**だが、pair tough callする相手には**value下限を下げる**。際どいハンド（均衡ではvalueにならない薄いトップヒット等）までlarge betに取り入れてvalueを増やす。

**(d) 使えるボード条件（実戦目安）**
- このexploitの可否はボード依存。**「75% CBで2nd pair以下がtough call（均衡fold）になるのは2BWボード（ボード上位2枚がJThi～AKhi、つまりJT〜AKのbroadway 2枚）」**と整理して覚える。
- 反例: 762rのようなローボードでは均衡が**3rd pairまでpure call**するため、相手がそれらを守ってもtough callではなく、このexploitは成立しない。
- 厳密にはもう少し細かい整理が正確だが、実戦運用は上記の覚え方で十分。

---

## Stage3理論の総復元（横断まとめ）

**Bluff判定の型（全記事共通の思考手順）**
1. そのnodeまで持ち越してきた**自レンジ全体**を確定する（Preflopレンジの広狭、Flop/Turnのアクションによる絞り込み）
2. 自レンジを**弱い順**に並べ、下からbluff候補を挙げる（レンジ下限が1pairならpairでもbluffする）
3. 相手の**defense下限／fold・call・raiseの各レンジ**を特定する
4. blockerで最終選別: **相手のfoldレンジをunblock ＋ 続行レンジをblock**しているものを優先
5. 自ハンドが相手のdefense下限に勝っているなら「bluffするには勿体ない」＝bluffしない

**Blocker/Unblockerの使い方**
- 良いbluff: 相手の続行（call/raise）ハンドを抑え、fold候補を抑えない（例: A3hhの3h、A/Q/4ボードの4x、low card 2枚のハンド）
- 悪いbluff: 相手のfoldレンジ（bluffや弱ハンド）を抑えるカード（例: 9含みミドルカード、相手の滑りFDと同スートのカード）
- 相手のbluffをblockするハンドはcall EVもraise EVも下がる → fold寄り。相手のvalueをblockするならcall（ブラフキャッチ）。

**Raise bluffの条件**
- 相手の「betして、raiseにcallするレンジ」をblockしていること（River）
- Flop/Turnでは追加で: ①3bet jamされた時の損失が小さい（nuts FDは不可）②失敗時のバックアップEQがある（combo draw / hit+draw ○、hit単品 ×、pocket ×）
- raiseサイズ選択も「そのサイズのfoldターゲットをblockしていないか」で決まる（54sが42% raiseを混ぜる例）

**実戦的な目安数値**
- Turn 75% betへのBB defense下限 ≒ AJhi～naked pair
- 75% CBで2nd pair以下が均衡foldになるのは2BWボード（JThi～AKhiの2枚）。762r等のローボードは3rd pairまでpure call
- ローボード→overcard turnの75% barrelでは、Flop全pairがindifferent付近（bottom pairすらcall/fold境界）
- UTG 75% turn betではAK・QQがindifferent、ATが機能するbluff（レンジが強いspotほどbluffは高ランク化）

---

# Part 4: Stage4「総合的均衡思考」・Stage5「均衡思考周辺知識」解答・解説


出典: note.com「週刊均衡」(gto_theorem / 文責 Drama @RiverProbe)。
問題文・模範解答の大部分は画像で提供されているため、本ノートは各記事のテキスト（採点基準・出題意図）から復元可能な範囲で、(a)スポット設定 / (b)正解 / (c)解説の核心 / (d)一般原則を再構成したもの。画像のみで示されている詳細（正確なボード・スタック等）は「推定」と明記する。

---

## Stage4: 総合的均衡思考

### Stage4-1 総合的均衡思考（3bp Flop CB戦略）
URL: https://note.com/gto_theorem/n/n6698d2acbb9c

- **(a) スポット設定**: 3bet pot、CO vs BTN。本編例題（HJ vs BTN）とほぼ同一の設定で、position関係のみをCOvsBTNに変更したFlop CB戦略の問題（詳細ボードは画像のみ）。
- **(b) 正解（採点基準から復元）**:
  1. COに **range advantage** がある（3点）
  2. よって **高頻度のsmall bet** を打つ（3点）
  3. **large bet頻度はない**。その理由を「Preflopレンジの形」から導く（4点）
- **(c) 核心ロジック**: 本編例題のHJ vs BTNでは、HJ（3bettor）レンジに **JJ が存在した** ために **depolar（デポラライズ）bet** が採用されていた。今回のCO vs BTNではその条件が崩れており、そこが例題との唯一の違い。つまり「caller側レンジの中でのtop pocket（相手が持ちうる最上位ポケット）」の位置によって、3bettor側のサイズ構成（depolar small一本か、polarにlargeを混ぜるか）が変わる。
- **(d) 一般原則**:
  - 3bet potの戦略は **caller側のtop pocketがどこにあるか** で大きく変わる。各position関係のtop pocket（callレンジに残る最上位ポケット）は暗記推奨。
  - range advantageがあるspotの基本形は「広くsmall bet」。large sizeを採用するかは、自分・相手のPreflopレンジ形状（特にoverpair帯の分布）から判定する。

### Stage4-2 Turn probe（overbet＋small betの複数サイズprobe）
URL: https://note.com/gto_theorem/n/na2607e8a5c11

- **(a) スポット設定**: FlopでIPがcheck backした後の **OOPのTurn probe** 戦略。本編例題より難化させ、overbetに加えてsmall sizeも均衡で発生するスポット（具体ボードは画像。解説からAJhi〜A9hi、set・2pairが登場する＝Aハイ絡みのボードと推定）。
- **(b) 正解（採点基準から復元）**:
  1. **Flopでcheckされた（＝IPがx backした）レンジの推定** を行う（3点）
  2. probeに **overbet頻度がある** （3点）
  3. 同時に **small bet頻度もある** （4点）
- **(c) 核心ロジック**:
  - IPのFlop CB自体は広いが、中身に偏りがある: **setや2pairはほぼpure bet**（Flopで打ち切る）のに対し、**AJhi〜A9hiあたりのAハイは高頻度でcheck back** する。したがってTurnのIPレンジは「強い役が抜け、Aハイ・中間ハンドが濃い」capされたレンジ。
  - overbetはcapされたレンジを攻める用、small betは「Aハイなどのindifferentゾーン」を安く攻める用、と役割が分かれる。
- **(d) 一般原則**:
  - **あるsizeを戦略に入れるか否かの判定基準: そのsizeでindifferentになるハンド群が、相手レンジに濃く存在するかを精査する。** 濃ければそのsizeは有効。
  - probe戦略の出発点は常に「相手のFlop x backレンジの復元」。CB頻度だけでなく「何がbetされ、何がcheckされるか」の質を見る。

### Stage4-3 3bp Turn barrel（見えにくいsmall barrel）
URL: https://note.com/gto_theorem/n/nc96dfdc63d41

- **(a) スポット設定**: 3bet potの **Turn barrel**（2nd barrel）判定。Hero側のハンド例としてQQ（check側）とAQs（bet側に見えるが要注意）が登場。ややトリッキーなspot（ボードは画像のみ）。
- **(b) 正解（採点基準から復元）**:
  1. Flopを持ち越した **お互いのレンジ** に言及（3点）
  2. Turnで **small bet（20%〜33%）を広く打つ** 戦略に気づく（4点）
  3. **large sizeをあまり打たない理由** に言及（3点）
- **(c) 核心ロジック**:
  - 多くの人は「QQはcheckできるがAQsは75% betしてしまう」——つまりハンド単位でlarge barrelを選びがち。均衡はレンジ全体で広くsmall betする形。
  - small betに気づけない原因は **Flop持越しレンジの精査不足**。持越しレンジを丁寧に見れば、large一辺倒にできない（bluffとvalueの構成が合わない）ことが分かる。
  - 20% betと33% betの打ち分けは高難度で採点対象外だが、**33% betだと相手のpocket（KK〜99）を落としすぎるため、これらは「水没気味」（indifferentを割ってfoldに傾く）になる** ——だからより小さい20%が併用される、という感覚は持ちたい。
- **(d) 一般原則**:
  - barrel判定は「自分のハンド」ではなく「Flopを持ち越した双方のレンジ」から始める。
  - **サイズ選択は『相手レンジの中核（ここではmid pocket群）をindifferent付近に保てるか』で決まる**。サイズを上げてターゲット層が全部foldしてしまうなら、そのサイズは過大。
  - 「AQs=強いドローだから大きく打つ」のようなハンド単位の発想はレンジ戦略とズレやすい典型パターン。

### Stage4-4 3bp Turn call判定（IP caller視点）
URL: https://note.com/gto_theorem/n/n6cee41875d99

- **(a) スポット設定**: 3bet pot、**SB(3bettor/OOP) vs CO(caller/IP)**。SBのTurn継続betに対する **IP caller側のcall/raise/fold判定**。Turnで自レンジの一部が進展するボード（詳細は画像のみ）。
- **(b) 正解（採点基準から復元）**:
  1. Flopを持ち越した **Heroのレンジ** に言及（3点）
  2. **Turnで進展した自レンジ**（新たにできた役・ドロー）に言及（3点）
  3. **pocket内でのfold優先度** を正しく判定（4点）——具体的には **TT・99を優先的にfold**、33〜77はcall/raiseに残す。
- **(c) 核心ロジック**:
  - SB側は **ほぼ全レンジでTurn継続bet** し、CO側はそれに対して **高頻度でraise** を返す。これは「SB側に安易な（フリーの）EQ実現を許さない」ための均衡構造。SB側はunder pocketや2BW（2枚ブロードウェイ）で苦しい判断を迫られる。
  - CO側の **bluff raise候補は call/fold境界にあるlow pocket（33〜77）**。どうせcallでもfoldでも限界EVなら、raiseに回してSBのEQ実現を咎める方が良い。
  - 一方 **TT・99は「都合のいいアウツがない」ため、callもraiseもEVが低い → 優先的にfold**。同じ「ミドル〜ローポケット」でも一括りにしない。
- **(d) 一般原則**:
  - 相手が全レンジ級のbetを打ってくるspotでは、**高頻度raiseで相手のEQ実現を咎める** のが均衡側の応手。
  - **bluff raiseの供給源は「call/fold境界のハンド」**（元のEVがほぼ0のハンドをraiseに転用する）。
  - fold優先度は「改善アウツの質」で決まる: raiseした後・callした後に勝ちに変わるアウツがないハンド（この例のTT,99）から先に捨てる。

### Stage4-5 3bp River call判定（Triple barrel・極小betへの防御）
URL: https://note.com/gto_theorem/n/n860a9f5b2e24

- **(a) スポット設定**: 3bet potで **Triple barrelに直面**（本編例題と同構造）。River は **10% potの極小bet**。相手はSB、Hero(HJ)はIP caller。ボードはAハイでflush完成系と推定（解説に「Ahit」「flush」が登場）。
- **(b) 正解（採点基準から復元）**:
  1. Flop・Turnで持ち越したHeroレンジに言及（3点）
  2. Turn・Riverそれぞれで進展した自レンジに言及（3点）
  3. Riverで正しいアクション選択（4点）——10% betに対しfoldはごく僅か、かつ **HJ側はレンジの大部分をraiseに回す** のが均衡。
- **(c) 核心ロジック**:
  - **極小サイズへのfold率の概算法**: 「50% betには約40% fold、30% betには約30% fold」という基準点から内挿し、**10% betには約10% foldすればよい** と概算できる。（α=s/(1+s)の理論値より実戦目安としてやや多めのfold率で覚える形）
  - さらにこのspotでは、HJ側レンジは **純粋なAhitが少なく、pocketとflushがレンジの大部分**。そこで **pocketをbluff（raise）に変換** し、SBの10% betによる安易なEQ実現を咎めに行く——レンジの大部分がraiseに回る。
- **(d) 一般原則**:
  - 見慣れないbetサイズへの防御頻度は、既知のサイズ（50%→40% fold、30%→30% fold）からの **比例的な概算** で即席対応できる。10% botクラスの極小betにはほとんどfoldしない（fold約10%）。
  - 相手の極小bet＝「安くEQを実現したい」というシグナル。**自レンジがブラフ転用可能な層（showdown value薄のpocket等）を多く含むなら、raiseで咎めるのが均衡**。
  - ここでもStage4-4と同じ原理: 「相手の安易なEQ実現を許さない」ためのraise構築。

---

## Stage5: 均衡思考周辺知識

### Stage5-1 Blocker（River call判定でのブロッカー比較）
URL: https://note.com/gto_theorem/n/n079fe941b34e

- **(a) スポット設定**: RiverでOOPのbetに対するcall判定。手持ちカードのblocker価値を比較する問題（2問構成、2問目は **Jc と 9c の比較**）。
- **(b) 正解（採点基準から復元）**:
  1. 2つのハンド間で **共通していないカードのblocker比較** を行う（2点）
  2. **相手のbluff rangeを具体的に想像し、自分のカードがそれをblockしているか** を判定（4点）
  3. その相手bluff rangeの概形を **Preflopレンジから** 正しく導出（4点）
- **(c) 核心ロジック**:
  - このspotのRiver OOP bluff rangeは **Jxが大部分** を占める。したがってJcは（bluffを潰す）**bad blocker for calling** ——bluff combo を減らしてしまうため、9cよりcallに不向き…ではなく正確には「Jxブラフをブロックする＝相手のbluffが減る＝callの価値が下がる」方向に働く。9cはblockするbluffが少ない。
  - なぜJxがbluffの主体か: **PreflopでBBはJxsを9xsより広くディフェンドする** ため、Riverまで到達するair系にJxが構造的に多い。
- **(d) 一般原則**:
  - blocker判定は「一般論の暗記」ではなく、**(1) 相手のbluff rangeを持ち越しレンジとして復元 → (2) 自分のカードがそのcomboを何枚減らすか** の2段階で行う。
  - **Riverのblocker評価すらPreflopレンジ構築（どのsuited gapperを守るか等）に規定される**。「持ち越しレンジを考える力」がblocker理論の土台。
  - callの良し悪し = bluff combo を unblock しているか（相手のbluffが最大限残る手でcallする）。

### Stage5-2 Unblocker（value blockerとbluff unblockerの区別）
URL: https://note.com/gto_theorem/n/n1cf03e526fc2

- **(a) スポット設定**: Riverのbetに対するcall判定。自レンジの内訳から「pure callとなる役の下限」を答えさせ、さらに境界付近でどのcomboがcall/foldに分かれるかを問う（ボードは画像のみ。Kxが境界に絡む）。
- **(b) 正解（採点基準から復元）**:
  1. 自レンジ内訳から **pure callの境界（役の下限）** を判定（2点）
  2. **value blocker** となるhit系（相手のvalueをblockする手）をcall寄りと判定（4点）
  3. **bluff unblocker（= check blocker）** となるAxのhit系をcall寄りと判定（4点）
- **(c) 核心ロジック**:
  - 均衡ではKというカードが **相手のbluffをblockしている**（相手のbluff候補にKxが多い）ため、同じKヒットでも **K8, K7, K3はfold** になる——「ペアの強さ」順にcallが決まらない典型例。
  - callに向く手は2種類あり、混同しないこと:
    - **value blocker**: 相手のvalue comboを減らすカードを持つhit系 → 相対的に相手レンジ中のbluff比率が上がる → call。
    - **bluff unblocker (check blocker)**: 相手のbluff（やcheckに回る手）をblockしないカード構成のAxヒット等 → 相手のbluffがフルに残る → call。
- **(d) 一般原則**:
  - River callの優先順位 = **「相手valueをblock」＋「相手bluffをunblock」** の合成で決まる。絶対的なハンド強度（K8 > A3的な序列）はしばしば逆転する。
  - 「境界より上はpure call」の境界自体は自レンジの内訳（MDFを満たすのに必要な枚数）から決める。境界帯のcomboの取捨選択にblocker/unblockerを使う、という2層構造で考える。

### Stage5-3 Preflop bluff — BB 3bet構築
URL: https://note.com/gto_theorem/n/n84e84b0a0231

- **(a) スポット設定**: BBからの3betレンジ構築。UTG open / HJ open / CO open それぞれに対し、bluff側（特にoffsuit・suitedのbluff 3bet）を過不足なく作る問題。
- **(b) 正解（採点基準から復元）**:
  1. offsuit・suitedともに **各構成要素を過不足なく** 3betに配置（4点）
  2. **vsEPとvsLPでoffsuitのbluff 3betハンドを使い分ける**（2点）
  3. **相手のopenレンジ下限から逆算してsuited bluff 3betを構築**（4点）
- **(c) 核心ロジック**:
  - BB 3betで多くの人が **bluff過少** になる。模範レンジ（vs UTG / vs HJ / vs CO の3枚の解答画像）と見比べ、自分がどのゾーン（特にsuited gapper帯・offsuit Ax/Kx帯）でbluffを削りがちかを自覚するのが狙い。
  - offsuitのbluff候補はopener positionで推移する（EPに対してはより上位のoffsuitのみ、LPに対しては範囲が広がる）。
  - suited bluffは「相手のopenレンジの下限がどこか」= 3betされたとき相手がfoldする層・dominateできる層から逆算して選ぶ。
- **(d) 一般原則**:
  - **PF bluff 3betの選定は相手openレンジの下限との相対で決める**（固定のチャート暗記ではなく、vs positionで連続的にシフトさせる）。
  - BBのbluff 3betは直感より広い。「bluff過少」が最頻出のリーク。
  - offsuit bluffとsuited bluffは役割が別（block効果重視 vs playability重視）で、それぞれ独立に過不足を点検する。

### Stage5-4 Preflop bluff — 4bet構築
URL: https://note.com/gto_theorem/n/n76708542fa48

- **(a) スポット設定**: 3betに対する **bluff 4betレンジ構築**。複数のposition関係（例としてHJ open vs SB 3betの解答画像あり）と、**BB 3betに対する4bet** を含む。
- **(b) 正解（採点基準から復元）**:
  1. **標準的なbluff 4betハンド群**（AQo, A5s等のblocker系）に言及（3点）
  2. position関係に応じて **bluff 4betハンド群を推移（シフト）** させる（4点）
  3. **BB 3betに対するbluff 4betレンジ** を適切に構築（3点）
- **(c) 核心ロジック**:
  - EPvsEPとLPvsLPの中間的なposition関係で迷ったら、**標準形から大きく変えない** のが基本（過剰な調整は不要）。
  - HJ vs SB 3betの例では、**AQoとA5sはfold/call/raise(4bet)の3択混合戦略** になる。「AQo=常に4bet bluff」「A5s=常に4bet bluff」ではなく頻度で混ぜる。
- **(d) 一般原則**:
  - bluff 4betの中核は **Aブロッカー系（A5s等のsuited wheel Ax、AQo等）**: 相手のAA/AKをblockし、foldさせたときの効果が大きい。
  - position関係で候補は連続的にシフトするが、**基本レンジからの逸脱は小さく** 保つ。
  - 境界ハンド（AQo, A5s）は混合戦略が正解であり、pure化（常に同じアクション）は搾取されうる簡略化だと認識しておく。

### Stage5-5 EQ robustness（EQの頑健性によるbet/check振り分け）
URL: https://note.com/gto_theorem/n/nd8c77e8bb0e5

- **(a) スポット設定**: 各ハンドのEQの「性質」（robust=頑健 / vulnerable=脆弱、高EQ / 低EQ）に応じてbet/checkを振り分ける問題。登場ハンドから、Jハイでダイヤ2枚のボード（J-7-2 twotone級）と推定。
- **(b) 正解（記事本文に明記）**:
  1. **set（22, 77, JJ）、hit+FD（A7dd）→ bet**
  2. **weak FD（68dd, 56dd）→ bet**（checkも可）
  3. **AJ（top pair top kicker級）→ bet**
  4. **setでないTT以下のpocket → check**
- **(c) 核心ロジック**:
  - EQを2軸で分類: **大きさ（high/low） × 頑健性（robust/vulnerable）**。
    - robust高EQ（set, hit+FD）: betでpotを膨らませて得。
    - vulnerable高EQ（AJ等のtop pair）: protectionも兼ねてbet。
    - robust低EQ（weak FD）: bluff側としてbet可（check混合も可）。
    - **vulnerable低EQ（TT以下のnon-set pocket）: check**。betしても上をfoldさせられず、下を追い出すだけ＆raiseに耐えられない。
  - 実際の均衡ではpure actionのハンドは少ないが、この4象限は blunder回避の判断指標として有効。
- **(d) 一般原則**:
  - **最頻出リーク: vulnerableで低EQのハンド（ミドル〜アンダーポケット等）をbetしすぎること**。この層は原則checkでEQを静かに実現する。
  - bet候補 = 「EQが大きい（robust/vulnerable問わず）」または「robustな低EQ（ドロー）」。check候補 = 「vulnerableな低EQ」。
  - Stage4-4・4-5の「EQ実現を咎める」議論と表裏: 自分がvulnerable低EQ側のときは、咎められる前に静かにcheckで回すのが基本。

---

## 横断まとめ（Stage4→5を貫く原理）

1. **すべての判断は「持ち越しレンジの復元」から始まる**: Flop CB/x backで各ハンドクラスがどちらに行ったかを追い、Turn/Riverの双方レンジを再構成する（4-2, 4-3, 4-4, 4-5, 5-1で反復）。
2. **サイズ採用の判定基準**: そのサイズでindifferentになるハンド群が相手レンジに濃いか（4-2）。サイズを上げてターゲット層が全fold（水没）するなら過大（4-3のKK〜99 vs 33%bet）。
3. **EQ実現の攻防**: 全レンジ的な小さいbet（10%bet等）は「安いEQ実現」の試みであり、受け手はcall/fold境界ハンド（low pocket等）をbluff raiseに転用して咎める（4-4, 4-5）。防御頻度の目安: 50%betに40%fold、30%betに30%fold、10%betに約10%fold。
4. **blocker理論の実務手順**: 相手のbluff/value comboをレンジ復元で特定 → 自カードの増減効果を数える。value blockerとbluff unblocker(check blocker)は別概念（5-1, 5-2）。
5. **PF bluffは相手レンジ下限との相対＋Aブロッカー**: BB 3betはbluff過少に注意、4betはA5s/AQo等の混合を標準形から大きく崩さない（5-3, 5-4）。

---

# Part 5: Stage6「頻出均衡思考」・Stage7「Exploitと均衡」・Stage8「総合演習」解答・解説


note.com「週刊均衡」（gto_theorem）Stage6「頻出均衡思考」／Stage7「Exploitと均衡」／Stage8「総合演習」の解答・解説記事16本からの学習ノート。

**注意**: 各記事の問題文と模範解答本体は画像として掲載されており、テキストとして残っているのは「採点基準」と「出題意図」。本ノートはそこから (a)スポット設定 (b)正解 (c)核心ロジック (d)一般原則 を復元・再構成したもの。画像でしか示されていない部分（正確なボード・スタック等）は推定を含む。

---

## Stage6 頻出均衡思考

### Stage6-1: 3bp stab（応用: Turn probe）

- **(a) スポット**: 3bet pot。Hero（HJ・OOP側）がFlopでCBを受けずに進行し、相手がCBをスキップした後のTurnでのprobe戦略。Turnカードが 4h の場合と Ah の場合の2シナリオ。
- **(b) 正解**:
  - Turn 4h（ブランク低札）→ **small size の wide probe**
  - Turn Ah → 全レンジcheckではなく **overbet polar probe**（Turnからgeometric sizeを使用）
- **(c) 核心ロジック**: FlopのstabもTurnのprobeも本質は同じで「**相手がCBをスキップした後の弱くcapされたレンジを苛める場面**」。HJ側はset・2pがレンジに多く残るためpolar rangeを保持しており、A落ちでもレンジチェックに逃げる必要はない。geometric sizing（残りストリートで均等にpotを膨らませるoverbet）で相手のA hitを苛められる。
- **(d) 一般原則**:
  - CBスキップ後のレンジは弱い＝probe/stabの標的。
  - ブランクには「小さく広く」、ナッツアドバンテージが活きるカード（自分にset/2pが厚いA落ちなど）には「polarにgeometric overbet」という2系統の攻め分けが基本形。
  - 採点配分: レンジ把握4点／small wide probe 3点／overbet polar probe 3点 —— まずレンジ認識、次にサイズ選択の順で思考する。

### Stage6-2: IPcc pot の stab（UTG vs BTN）

- **(a) スポット**: UTGオープンにBTNがコールしたIPコールドコールpot。UTGがCBをスキップした後（あるいはUTG側が一方的に強レンジを持つボード）でのBTNのstab戦略。具体ハンドとして 67ss のアクション選択。
- **(b) 正解**: overbet stabは棄却。BTNは**低頻度の middle size bet**を採用し、**67ss は check**。
- **(c) 核心ロジック**: 例題で扱った overbet stab は「ポケットペア主体（pocket が id＝担い手）」の戦略。UTG側が一方的に強いレンジ（レンジアドバンテージがUTGにある）状況では、BTNは広く攻めることも大きく攻めることもできず、頻度を絞ったミドルサイズに留まる。
- **(d) 一般原則**:
  - stabのサイズ・頻度は「相手レンジの強さ」で決まる。相手（PFR）が強レンジを一方的に持つボードでは stab は低頻度・中サイズ。
  - Flop戦略の学習は暗記から入ってよいが、最終的には**双方のレンジ構成から戦略を導出**できることが目標。
  - 採点配分: 両者のレンジ構成3点／低頻度middle size bet 4点／67ss check 3点。

### Stage6-3: SBcc pot（HJ vs SB、BW-hi low paired board）

- **(a) スポット**: HJオープンにSBがコールドコール。ボードは**ブロードウェイハイかつロー札ペアード**（例: A high + low pair 型）。HJのFlop CB戦略を導出。
- **(b) 正解**: range bet は棄却。**overbetをメインサイズに据える**polar寄りの戦略。根拠は HJ の A hit good kicker アドバンテージ。
- **(c) 核心ロジック**: SBccレンジにはAx suitedが多く残る。ボードがKhi以下ならそのAxをターゲットに range bet が成立する（実際にaggregate reportでKhi以下のボードでbet頻度が急上昇）。しかしA hiボードではHJのtop hit top kicker優位を活かし、大きいサイズで攻める構造になる。
- **(d) 一般原則**:
  - **SBccレンジの特徴 = Ax suitedが厚い**。→ K以下のハイカードボードでは「Axをフロートさせない/降ろす」range betが有効、Aボードではrange betでなくoverbet polar。
  - 「BWhiだがlow paired」のような複合テクスチャは、どちらの性質が支配的か（誰のレンジに強いhitが厚いか）で戦略を決める。
  - 採点配分: range bet棄却3点／A hit good kickerの優位への言及3点／overbetメイン化4点。

### Stage6-4: BvB（2bp）IP stab のブラフ側

- **(a) スポット**: ブラインド戦の2bet pot。OOP（SB側）がcheckした後の BB（IP）の stab 戦略、特に**ブラフ側のハンド選択**。具体ハンド 9h7h のアクション。
- **(b) 正解**: レンジ戦略は**polarな構築**。ブラフ候補はハンドごとの打ち分け（bet/checkの使い分け）を強く意識して選定する。9h7hの正解アクションは配点2点（bluff候補としての採否を判断する問題）。
- **(c) 核心ロジック**: BvBは**EQ差が小さく、betレンジを広く作れない**状況。そこで均衡は、bluff候補を細かく打ち分けたpolar戦略により「**相手のマージナル群を広くindifferentに追い込む**」構造をとる。
- **(d) 一般原則**:
  - EQ差が小さいスポット（BvB, IPccなど）では wide small bet ではなく「絞ったpolar stab + 精密なbluff選定」が均衡の形。
  - bluff選定基準: ブロッカー・バックドア等でbetとcheckを打ち分け、check側にもEQを残す。
  - IPcc pot（6-2）とBvB（6-4）を合わせて「2bpのstab戦略」として一括理解せよ、というのが筆者の整理。
  - 採点配分: polar構築4点／他のbluff候補列挙4点／9h7hのアクション2点。

### Stage6-5: xr（check-raise）頻度の推定

- **(a) スポット**: 相手のポジション（例: BTNvsBB と UTGvsBB）とボードテクスチャを変えたとき、OOP（BB）のxr頻度がどう変わるかを推定する問題（レンジ全体のxr頻度を数値で答える形式）。
- **(b) 正解**: 数値の正確さより次の2つの定性理解が主眼。
  1. **UTGvsBB では call頻度を減らし raise or fold に寄る**（xr頻度は上がる）
  2. **middle以下の paired board では xr頻度が増える**
- **(c) 核心ロジック**: 相手レンジが強い（UTG）ほどマージナルコールの価値が下がり、応答は二極化する。またミドル以下ペアードはOOP（コーラー）側にトリップスが厚く、ナッツアドバンテージがxrを支える。
- **(d) 一般原則**:
  - xr頻度を決める2大要因 = **相手のオープンレンジの強さ（ポジション）× ボードのどちらにナッツが厚いか（テクスチャ）**。
  - 頻度の暗記より力学の理解が優先（採点も「positionによる調整4点／textureによる調整3点／数値の正確さ3点」と力学重視）。
  - 実戦目安: タイトなPFRに対しては「コール域を削ってraise/foldへ」、low-mid pairedではxrを標準より明確に増やす。

### Stage6-6: 4bp（100bb LPvsLP、A-hiボード）

- **(a) スポット**: 100bb effective、レイトポジション同士（LPvsLP）の4bet pot。A-hiボードで、4bettorの**極小CB（10% pot）**に対するOOP（4bet caller）の応答。具体ハンドは TT / 77 などの BDSD 有無を含むポケット群。
- **(b) 正解**: **Flop時点で大胆にfold**（TTのような一見強いポケットでも降りる）。ポケット内の序列はBDSD（バックドアストレートドロー）等の付加価値で決まり、**ペアとしての価値ではTTと77は全く同等**（相手の4betレンジのポケットに全て負けているため）。
- **(c) 核心ロジック**: 100bb LPvsLP では **5bet jam のEVが高いハンドが多すぎるため、4bet call レンジが非常に脆弱（capされる）**。特にA-hiボードでは4bettor側のAx・プレミアが刺さり、OOPは10%という極小CBにすら厳しい選択を迫られる。ソルバー上、OOPは10%CBに対しほぼ **raise or fold** で応答（xcレンジをほぼ持たない）。
- **(d) 一般原則**:
  - 4bpの戦略は「4bet callレンジがどれだけ歪んでいる（capされている）か」から考える。100bb LPvsLPはその歪みが最大級。
  - 「**xcレンジをそもそも持つ必要がない**」状況（xr記事の原則）: レンジが二極化し、marginalが薄い場合はcall域が消える。
  - 相手のレンジに全て負けているペア同士の序列は、キッカーやペアの高さでなく**ドロー・バックドアの有無**で付ける。
  - 採点配分: PFレンジへの言及3点／大きなEQ差の指摘3点／ポケット序列を踏まえた正解アクション4点。

### Stage6-7: monotone（3bp、AKQモノトーン系）

- **(a) スポット**: 3bet pot、AKQ級のハイカード**モノトーン**ボード。3bettorのlarge CBに対するコーラー側の応答（適正fold頻度の推定と自レンジの序列付け）。
- **(b) 正解**: 通常の3bp AKQ（レインボー）なら3bettorの圧倒的EQアドバンテージで**大幅overfoldが正解**だが、モノトーンでは**色持ちポケット（フラッシュドロー付きpocket）のcall oddsが合ってしまう**ため、結果として**適正fold頻度（MDF近辺）どおりの防御構成**になる。
- **(c) 核心ロジック**: 「EQアドバンテージ→overfold」という原則は、ボード性質（モノトーン）がコール側に十分なdraw equityを与えると打ち消される。fold頻度はα/MDFだけでなく「レンジ内にoddsの合うハンドが何コンボあるか」の積み上げで決まる。
- **(d) 一般原則**:
  - 3bp AKQ型ボードのデフォルト = コーラー側のoverfold。**例外 = モノトーン**（色付きハンドの防御でMDF付近まで守れる）。
  - 防御ハンドの序列は**ペアの強さ＋drawの有無**で総合評価する（採点: 適正fold頻度の推定4点／draw込みの序列精査4点／最終アクション2点）。
  - 「ボード性質による原則の上書き」を判断できることが上級者への分岐点、というのが筆者のメッセージ。

---

## Stage7 Exploitと均衡

### Stage7-1: MinESの初歩（Flop CB過多への対応）

- **(a) スポット**: BTNvsBB 2bp、Flop **K75r**。BTNがFlop CBを打ちすぎている（極端には100% range CB）場合の、BBのMinES（Minimally Exploitable Strategy / 最小被搾取的エクスプロイト）構築。
- **(b) 正解**:
  1. GTOのBTNは実は範囲betではない: **QQやAJ〜A9あたりはほぼpure check**（K75rでも「何でもbetできる」わけではない）。
  2. 相手を100% CBとnode lockすると、BBの応答は **fold頻度が約10%減、raise頻度が約15%増**。
  3. GTOではpure callだった**7 hitや88などのマージナルペアにraise頻度が生える**。
- **(c) 核心ロジック**: 相手が本来checkすべきAT・AJ等のハイカードまでbetに回すため、マージナルペアは（フリーカードでまくられないよう）**protection raise**の価値が生じる。「打ちすぎ」へのカウンターは単なるcall増でなくraise増。
- **(d) 一般原則**:
  - CB過多への標準カウンター: **fold −10%程度 / raise +15%程度**（K75r BTNvsBBの実測値、他ボードにも広く応用可）。
  - MinESで「唐突にraise頻度を持ち始めるハンド」= protectionを要するマージナルペア群。この現象は極めて一般的。
  - まず「GTOで相手がcheckすべきハンドは何か」を特定することがexploitの出発点（採点でも配点4点で最重視）。

### Stage7-2: 戦略の濫用（polar CBをrange CBと誤解する相手）

- **(a) スポット**: HJvsBTN 2bp、**low paired board**。均衡ではHJは**polar CB**を打つスポットだが、「wide small CB のスポット」と勘違いして全レンジ33%CBを打ってくる相手へのBTNのMinES。
- **(b) 正解**: HJを全レンジ33%betでnode lockすると、BTN側は**fold頻度0%**と推定でき、**ほとんどのハンドがraise/callの混合**になる。本編例題同様「foldせず安いraiseを返す」。
- **(c) 核心ロジック**: レンジの強さから相手のbetが割に合わないため一切foldしない。さらに、**ハンド性質にこだわらず広く薄くraiseを混ぜる**のは、raiseレンジが偏るとFlop 3betやTurn/Riverで逆にexploitされるため。
- **(d) 一般原則**:
  - **MinESの定義的性質: 「後続streetでのexploitabilityをケアしながら、当該street内でできる限りのexploitをする」**（本連載のMinES概念の核心）。
  - エクスプロイト時もレンジバランス（raise域の均質化）は捨てない —— 相手の再カウンターを防ぐため。
  - low paired boardのPFR戦略はpolar CBが正解形。range small CBは「濫用」でありexploit対象。
  - 採点配分: HJのCB戦略の正答3点／fold 0%推定3点／raise/call混合への言及4点。

### Stage7-3: Aggression不足（xr過小の相手）

- **(a) スポット**: HJvsBTN 2bp。均衡ではHJ（OOP）の**xr頻度が25%以上**と非常に高いボードで、実戦の相手はxr過小（特に**色ありポケット＝FD付きポケットのxrを怠りがち**）。BTNのMinESを構築。
- **(b) 正解**:
  1. HJのxr候補（特にbluff部分）を列挙できること（配点5点）。
  2. BTNのMinES = **range CB**（配点5点）。
- **(c) 核心ロジック**: 均衡のBTNは激しいxrによる抵抗を避けるためbetレンジを絞っている。相手がxrしてこないなら、その「抑止力」が消えるので**bet側に大きく寄せてマージナルハンドのEVを底上げ**できる。
- **(d) 一般原則**:
  - **相手のaggression不足（xr過小）→ 自分のbet頻度を均衡より大幅増（range CB化）**。均衡でbetを絞る理由の大半は「xrされるから」なので、その前提が崩れれば絞る理由も消える。
  - 実戦で最もxrが不足しがちなハンド群 = FD付きポケット等の「見た目マージナルなsemi-bluff候補」。
  - 相手のリークを特定する際は「均衡のxr頻度（ここでは25%+）」という基準値を知っていることが前提になる。

### Stage7-4: overfoldとtough call（実戦リークの二大類型）

- **(a) スポット**: 特定の1スポットではなく、自分で具体的スポットを設定し、相手の想定リーク→自分のbetへの応答→MinES構築、を記述する論述型問題。
- **(b) 正解**: 一般論として実戦プレイヤーのFlopリークは
  1. **広く守るべき場面で high card を overfold しすぎ**
  2. **守るレンジを絞るべき場面で one pair を tough call しすぎ**
- **(c) 核心ロジック**:
  - overfold型は **LPvsLP 3bpなど「均衡のPFレンジが想像より広い」場面**で発生しやすい（レンジが広い＝ハイカードでも守る必要があるのに、実戦では降りてしまう）。
  - tough call型は **EQ差のある場面**（相手レンジが強い場面）で発生しやすい（本来ワンペアでも降りるべきなのに粘ってしまう）。
- **(d) 一般原則**:
  - 相手のdefenseリークは「overfold / overcall」の二軸で、**スポットのレンジ広さ・EQ差から先験的に予測できる**。
  - MinES構築の型: ①スポット指定 → ②相手の想定リーク → ③自分のbetへの具体的応答の記述 → ④それを搾取する戦略（採点配分 2/4/4点。「相手の応答を具体的に書く」ことが最重要ステップの一つ）。
  - 実戦指針: LPvsLP 3bpの低〜中ボードでは（ハイカードoverfoldを見込んで）ブラフを増やし、EQ差の大きい場面ではワンペアのtough callを標的にvalueを厚くする。

### Stage7-5: Exploitと均衡（3way）

- **(a) スポット**: UTGオープン、BTNコール、BBコールの**3way pot**。middle以下のボードでの各プレイヤーの戦略（第1問: UTGのCB戦略、第2問: checkが回ったときのBTNのstab戦略と頻度）。
- **(b) 正解**:
  1. **UTG（PFR）はCB頻度をほぼ持たない**（配点5点）。
  2. **BTNは small size の wide stab** を打つ（配点4点。正確なbet頻度は1点のみ）。
- **(c) 核心ロジック**: 3wayでは基本的に**HUよりも全員passiveになる**（複数人相手にbluffが通りにくく、MDFが分散するため）。その中でBTNだけは**UTG・BBに比べ trash が圧倒的に少ないレンジ**を持つため、両者のtrash群からfold equityを奪うwide small stabが成立する。
- **(d) 一般原則**:
  - 3wayの第一原則: **HU比でpassive化**。PFRでもmiddle以下ボードではCBを放棄する。
  - 例外的にaggressiveになれる条件 = 「レンジ内trash比率が相対的に最少のプレイヤー」であること。
  - ツール上の注意: GTO Wizard AIで3wayを解かせる際は**small raiseをsize inputに必ず含める**こと。大きいraiseしか許さない設定だとwide small betが過大評価され、solutionが不正確になる。

---

## Stage8 総合演習

### Stage8-1: BTNvsBB 2bp（マージナルハンドの総合判断）

- **(a) スポット**: BTNvsBB 2bet pot。BB側がマージナルハンド **KJ**（River時点でブラフキャッチャー級）を持ち、相手のRiver到達レンジと各streetの戦略の歪みを踏まえてRiverのアクションを決める。
- **(b) 正解**: 唯一解なし。模範解答は3例併記で、**相手（BTN）の理解度と「BTNがBBをどう見ているか」で最適解が変わる**。例: BTNが「BBはRiverでxcしてくる」と強く想定しているタイプなら、KJは **x/f** が推奨。
- **(c) 核心ロジック**: 思考手順は ①相手のRiver到達レンジの推定 → ②各streetでの相手戦略の歪み（均衡からのズレ）の特定 → ③その2つを合成してKJのEV最大アクションを選択（採点 3/3/4点）。相手がGTOなら②は不要。
- **(d) 一般原則**:
  - マージナルハンドのriver判断は「レンジ推定 × 相手モデル」の掛け算であり、**相手モデルが変われば正解が反転する**ことを許容する。
  - 実戦では歪みが複数同時に存在し、各要素の影響度を比較衡量する必要がある —— 総合演習の主眼は「一つの正解」でなく**論理の一貫性**。

### Stage8-2: BTNvsSB 3bp（River value betのサイズ選択）

- **(a) スポット**: SBの3bet potでRiverまで進行し、相手（SB）がRiverでcheck。こちらはvalue handを持ち、**bet sizeを選ぶ**問題。
- **(b) 正解**: ①相手のRiver checkレンジを丁寧に列挙 → ②そのレンジ内の各ハンドが「callするギリギリのサイズ（defense境界）」を精査 → ③自ハンドのEVが最大になるサイズを選択（採点 4/4/2点）。
- **(c) 核心ロジック**: **相手は強い役ほど大きいサイズまでdefenseする**。したがって「相手checkレンジに残る最強クラスのハンドはどこまでか」「自分が勝っているハンド帯はどのサイズまで付いてくるか」を特定すれば、サイズは自動的に決まる。境界サイズの見積もりは相手の想定次第でブレるので、厳密な数値に固執しなくてよい。
- **(d) 一般原則**:
  - value betサイジングの型: 「**ターゲットハンド帯のcall上限サイズ**」を求め、その直下のサイズを打つ。
  - サイズを上げるほどcallレンジが強くなる（＝薄いvalueは小さく、強いvalueはターゲットの上限まで大きく）。
  - checkレンジ推定→ハンド別call境界→サイズ決定、という3段の手順そのものが得点対象（プロセス重視）。

### Stage8-3: UTG vs BB 2bp（Triple barrelにTPWKをどこまで耐えるか）

- **(a) スポット**: UTGvsBB 2bet pot。BB側が**ドローなしのTPWK**（トップペア弱キッカー）で、UTGのtriple barrel（Turnは**125% pot overbet**）に直面。どのstreetまで耐えるか。
- **(b) 正解**: **FlopまたはTurnでfold**が模範解答。理由: 「Turn 125% betのbluffが均衡より多く飛んでくる」ことは実戦上まず考えられないため。
- **(c) 核心ロジック**: 均衡のTurn defenseレンジでは**hit＋drawのハンドですらindifferent**に追い込まれている。防御優先順位は「**draw付きのmiddle以下のpair ＞ drawなしのTP**」（Stage1-5の原則の再確認）。実戦の相手はovербluffしないので、indifferent帯のドローなしTPWKは素直に降りてよい。
- **(d) 一般原則**:
  - overbet barrelに対する防御序列: ペアの絶対的強さでなく**改善可能性（draw）優先**。
  - 「均衡でindifferentなハンドは、相手がunder-bluffなら即fold」というexploit側の基本変換。
  - Flop時点で「Turnで継続できる率」を見積もってからFlopのアクションを決める（採点4点で最重視）—— street単位でなくline単位で判断する。

### Stage8-4: HJvsSB（4bet pot、A-hiボードでのbluff line構築）

- **(a) スポット**: HJvsSBの**4bet pot**。弱いハンド（ブラフ候補）を持っているときに、どのbluff line（bet/check、single/double barrel等）が最もEVが高いかを模索する。A-hi等ハイカード落ちのボード。
- **(b) 正解**: 固定解なし。①各アクションに対する均衡のindifferent帯の推定 → ②Flop checkした場合の相手のstab戦略も考慮 → ③自分の想定に基づく論理的なline選択（採点 3/2/5点）。
- **(c) 核心ロジック**:
  - 4bp lowボードでは「ハイカードのoverfold」を標的にするのが本編の原則だったが、**A-hiボードでは代わりにpocketの挙動を標的**にする。
  - 実戦では**double barrelに対してQQ・JJ（特にFDなしの色なし）を守れているプレイヤーは少ない**。
  - A hitをoverfoldさせるのは困難なので、「A hit・pocketをindifferentにする」のではなく**pocketだけを効率よく降ろすline**を設計する。
  - line比較の観点: 均衡比のoverfold度合い、（double barrelなら）相手がFlopを持ち越すレンジの量。
- **(d) 一般原則**:
  - 4bpブラフの標的選定: lowボード→ハイカードのoverfold、A-hiボード→**中位pocket（QQ/JJ）のfold**。
  - 相手は複数リークを同時に持つため厳密なEV比較は不可能 —— 「どのハンド帯を降ろすlineか」を明示して自分なりに最良と論証できれば十分（論証部分が配点5点）。

---

## 横断まとめ（Stage6-8の思考フレーム）

1. **すべての起点はレンジ認識**: 「CBスキップ後はcapされる」「4bet callレンジは脆弱」「SBccはAx suitedが厚い」「BTNは3wayでtrash最少」など、アクション履歴からレンジの歪みを言語化することが全問題で最初の配点対象。
2. **サイズは構造から決まる**: EQ/ナッツ優位が偏る→polar overbet（geometric）、優位が小さい→低頻度middle or 絞ったpolar、相手trashが多い→small wide。range betが成立するのは明確なターゲット（Ax等）がいるときのみ。
3. **MinESの定義**: 当該streetで最大限exploitしつつ、後続streetでのexploitabilityをケアする戦略。CB過多→fold−10%/raise+15%＋マージナルペアのprotection raise、xr過小→range CB、range small CB濫用→fold 0%で広くraise/call混合。
4. **防御序列はdraw優先・indifferent帯は相手モデルで処理**: draw付きmiddle pair ＞ drawなしTP。均衡でindifferentなハンドは相手がunder-bluffならfold、over-defenseならbluff中止、と機械的に変換する。
5. **ボード性質は原則を上書きする**: AKQ 3bpのoverfold原則はmonotoneで消える、4bpの「ハイカードoverfold狙い」はA-hiでは「pocket狙い」に変わる。原則＋例外条件のセットで記憶する。
