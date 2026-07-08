---
name: gto-hand-explainer
description: Build a polished, self-contained HTML article (Artifact) that explains ONE poker hand street-by-street from GTO Wizard screen recordings or screenshots. Use when the user uploads a GTO Wizard practice/study (練習/学習) video or screenshots of a hand and asks to explain the GTO play / hand / street, or wants another article in this same style. Covers ffmpeg frame extraction, reading the solver's ranges & frequencies, the hero-primary + opponent-context street-by-street layout, embedding the real 13x13 range charts, and publishing with the Artifact tool. The "why" is grounded in a compact GTO theory framework (value vs the calling range, polarization & sizing, α/MDF, river equity separation & push-up, protection, EQ/EV/EQR).
---

# GTO Hand Explainer

Produce a Japanese, self-contained HTML "記事" (published via the **Artifact** tool) that explains a single poker hand, street by street, grounded in what a GTO Wizard video/screenshot actually shows.

## When to use
- The user uploads a **GTO Wizard screen recording (.mp4)** or **screenshots** of a hand and asks to explain the play/hand/street.
- The user wants a new article in the same style as a previous one.

Two GTO Wizard modes appear in captures:
- **練習 (practice)** — the graded decision + simplified (often pot-only) bet tree.
- **学習 (study/analysis)** — the full solver tree: every node's action %, the 13x13 range grid, per-combo splits, equity/EQR/nut buckets, レンジ比較. Prefer this for exact numbers.

## Process

### 1. Extract frames
```bash
command -v ffmpeg || apt-get install -y ffmpeg
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 IN.mp4
ffmpeg -hide_banner -loglevel error -i IN.mp4 -vf fps=1 -q:v 2 f_%02d.jpg      # 1fps; use fps=4 for fast transitions
```
Read frames with the **Read** tool (they render as images). Zoom into details by cropping, then Read the crop:
```bash
ffmpeg -i f_08.jpg -vf "crop=W:H:X:Y,scale=760:-1" -q:v 2 crop.png             # board, hole cards, a grid cell popup, etc.
```

### 2. Read the hand from the frames
Capture precisely:
- **Format / positions**: e.g. 6-max NL25, 100bb, SRP; who is Hero, who is PFR, who is IP vs OOP.
- **4-color deck**: spade = grey/black, heart = red, diamond = blue, club = green. Read the board and the hero's exact hole cards (suits matter — see blockers).
- **Board texture**: classify it — monotone / two-tone / rainbow, paired, connected, high vs low. Texture decides which theory lens dominates (flushes & blockers on monotone; protection on wet two-tone; who has the nut advantage). Zoom the board and re-read every suit: one mis-read (e.g. a spade turn that makes the board *monotone*, not a flush-draw) flips the whole story.
- **Line**: read the action-history bar across the top of GTO Wizard (Raise/Call/Fold/Check/Bet per seat, pot per street, board runout).
- **Per node (study mode)**: the action panel gives the **range-level %** (Bet/Check/Fold/Call/Raise). Hover the hero's cell (popup) or read the "ハンド" panel (its 6 combos) for the **hand-specific split**. Record BOTH at every hero node.
- Optional depth: equity vs villain, EQ buckets (とても強い/強い/弱い = nut advantage), EQR (エクイティ実現率), and the opponent's fold% when facing the hero's bet.

### 3. Build the article — copy `template.html`
`template.html` is the design system (tokens + every component) plus a skeleton. Structure:

1. **Hero header** — title, board runout as 4-color `.card`s (`.street-sep` between streets), meta chips, one-line thesis.
2. **前提 / premises** — the lenses (think in ranges; position; state that each block shows *range %* AND *the hero hand's answer*).
3. **One `<section>` per street** — hero-primary:
   - `.did` = what happened (opponent action as context).
   - Opponent block `.seat.utg` (grey) with its range bar — context.
   - Hero block(s) `.seat.bb` (gold) with the range bar + a `.note` giving the hero hand's specific split (`.hh` gold highlight for the hero hand). A street can have several hero nodes (e.g. lead → face bet).
   - `<h3>なぜ…</h3>` + `.reasons` (the why). Tag each reason's `.k` with its **governing principle** from *Theory lenses* below, so the same idea reads the same way across articles.
   - Optional: `.math` stat cards (equity / nut% / opp fold%), `.combos` (per-combo breakdown when suit-dependent), `.rangefig` (real range chart + `.h88`-style mini-stat).
4. **Takeaways** — numbered `.takeaways`.
5. **Foot** — Hero / Board / Villain line.

### 4. Embed the real range charts (optional, high value)
Crop the 13x13 strategy grid (grid occupies ~x0–1090, y203–888 in a 1902×896 frame):
```bash
ffmpeg -i grid_frame.jpg -vf "crop=1095:690:0:200,scale=800:-1" -q:v 5 grid.jpg
```
- Prefer a **clean frame**: no cursor over the grid, no hover popup — unless the user asks for the enlarged cell popup. (In GTO Wizard the cell popup appears while hovering; find a frame where the cursor is off-grid, or paint out the cursor/popup and redraw grid lines + labels with `drawbox`/`drawtext` using `/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf`.)
- CSP blocks external images, so **embed as base64 data URI**. Inject with a small python pass (the file has huge base64 lines — use python string/regex replaces, not the Edit tool, once images are embedded):
```python
import base64, pathlib, re
html = pathlib.Path("article.html").read_text("utf-8")
uri = "data:image/jpeg;base64," + base64.b64encode(pathlib.Path("grid.jpg").read_bytes()).decode()
html = re.sub(r'(alt="RANGE_TURN" src=")data:image/jpeg;base64,[^"]*(")', lambda m: m.group(1)+uri+m.group(2), html)
pathlib.Path("article.html").write_text(html, "utf-8")
```
- Add the legend (`.sw b`=bet/raise, `.sw g`=check/call, `.sw f`=fold, `.sw d`=out-of-range) and a `.h88` mini-bar showing the hero hand's % *next to* the chart (so the hand's numbers are visible even when its cell isn't enlarged).

### 5. Publish
- Load the **`artifact-design`** skill first (design calibration — required before Artifact).
- Write the HTML file (no `<html>/<head>/<body>` — the harness wraps it), then call **Artifact** with the file path, a `<title>`, `description`, `favicon` (emoji of the hand's suits, e.g. `♠️♣️`), and `label`.
- To update, **redeploy the same file path** to keep the URL.

## Theory lenses — grounding the "why"

The screen gives you *what* the solver does; these lenses give you *why*. Every `reasons` block should trace to this small, consistent framework (distilled from the Amu(goole) note — the full treatment lives in `docs/amu-goole-poker-notes.md` when present in the repo). Name the governing principle in the reason's `.k` tag so the same idea reads the same across articles. Don't dump all of them on one hand — pick the 2–4 that actually drive the decision.

**Core lenses**
- **Value/Bluff + target.** Every bet is value or bluff. A **value bet must beat the villain's *calling* range, not their whole range** — the classic leak is a hand that only makes worse fold and better call. (「打ってはいけないハンド／サイズ」.)
- **Range bet vs Polar bet — the size tells you which hands qualify.** Small (≤33%) = **range/merged**: leans on protection & equity denial, a whole range can bet "as if checking." Big (≥pot) = **polar**: value + bluffs only, middling hands check. Read the size first, then ask which hands belong.
- **α and MDF.** Polar spot: bluff ratio **α = b/(b+p)**, defender's min-call frequency **MDF = p/(b+p)** (b = bet, p = pot before bet). Bigger bet → more bluffs allowed, villain folds more. Use to sanity-check bluff quantity and over/under-folding.
- **EQ ≠ EV ≠ EQR.** Raw equity is not the strategy. **EQR (実現率) > 100%** = over-realizes (usually IP + polar + initiative); **< 100%** = under-realizes (OOP, capped, no showdown control). When the screen shows all three, report them and explain the gap — a hand can be behind in equity yet ahead in EV.
- **River: 切り離し (separation) & 押し上げ (push-up).** The villain folds trash to a bet, so **cut that trash off** and re-measure the hero vs the *contesting* (calling) range. Against it a middling hand's true equity drops → can't value bet; yet it still beats the give-up range → has showdown value → can't bluff either. It falls into the **check "valley."** This is why river range-EQ alone never dictates the play.
- **Protection is a pre-river thing.** Real only while cards are still to come (flop/turn). **Gone on the river.** When a hand that could bet the turn for protection must check the river, say so explicitly — that transition is often the whole point.
- **Robust vs Vulnerable equity.** Equity that survives most runouts (top set) vs fragile (one pair, wet board). Bet bigger/more with robust; pot-control the vulnerable.
- **anchor (碇).** A middling holding that blocks *your own* profitable raises — a reason to call/pot-control instead of raise.
- **Indifference & mixing.** Mixed frequencies exist to make the villain indifferent; when a pair/suited hand mixes, the **blocker/suit decides which combos take which action** (tie this to the blocker convention).
- **GTO vs Exploit / MES.** State the GTO baseline first; add a one-line exploit note only where a population clearly deviates — and label it an exploit, not the equilibrium.

**Per-street reflex**
- **Flop / Turn:** who has range & nut advantage → who bets. Range bet (small, protection on) or polar (big)? Which blockers matter on *this* texture?
- **River:** apply 切り離し / 押し上げ, then sort the hero hand into **value (beats the calling range) / bluff (no showdown value) / bluff-catcher (check)**. Protection is gone. Is the bluff quantity right for the size (α)?

**The one question at every hero node:** *is this hand a value bet vs the calling range, or a hand with no showdown value usable as a bluff?* If neither → check. Put the answer in the hero `.note`; put the reason in `.reasons`.

## Accuracy conventions (do not skip)
- **Never round solver values.** Report `Fold 99.8%`, not 100%. Use `≈100%` only when the exact decimal isn't visible (a solid single-color cell).
- **Blocker vs draw.** A flush needs 5 same-suit cards. With 2 board cards of a suit, holding one more is a **backdoor draw** (on the flop) but only a **blocker** (on the turn, when the hero can no longer complete a flush). Never call a blocker a "draw" or vice-versa. Explain blockers as reducing the *opponent's* value/continues.
- **Suit-dependence.** The same pocket pair can bet with one suit and check with another (blocker/backdoor). Read all 6 combos; identify the hero's exact combo.
- **Texture first.** Re-read every board suit before writing and classify the texture — it selects the lens (see *Theory lenses*). A wrong suit yields a wrong thesis (a monotone board is not a flush-draw board).
- **Bars sum to 100.** Hide `<small>` %s on narrow screens (`@media(max-width:560px){.seg small{display:none}}`) so thin segments don't clip.
- **Both themes** (light/dark tokens already in the CSS); fully self-contained (inline CSS, base64 images).
- **Verify against the frames.** If a later frame contradicts an earlier claim, correct it explicitly.

## Style
- Japanese, **hero-first** ("私(BTN)の戦略"), opponent as context ("相手CO"). Gloss jargon on first use: ドンク/リード, キャップ, MDF, α(バリュー:ブラフ比), EQ/EV/EQR(実現率), ブロッカー, ポラライズ／レンジベット, ナッツ有利, 切り離し・押し上げ, インディファレンス, Protection(プロテクション), Robust EQ(EQの堅牢性), anchor(碇). Keep **"Value = 相手のcallレンジに勝つこと"** front-of-mind. Numbered takeaways. One clear thesis in the header.

## Files
- `template.html` — full design system + skeleton with placeholders. Start every article from this.
- Theory basis — the *Theory lenses* section above. For the full framework (worked examples, α/MDF derivations, 切り離し・押し上げ, EQ/EV/EQR) see `docs/amu-goole-poker-notes.md`; for a finished example that applies it, see `docs/hand-explainer-88-btn-vs-co.html` (both in this repo).
