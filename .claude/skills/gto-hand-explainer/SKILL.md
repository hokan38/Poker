---
name: gto-hand-explainer
description: Build a polished, self-contained HTML article (Artifact) that explains ONE poker hand street-by-street from GTO Wizard screen recordings or screenshots. Use when the user uploads a GTO Wizard practice/study (練習/学習) video or screenshots of a hand and asks to explain the GTO play / hand / street, or wants another article in this same style. Covers ffmpeg frame extraction, reading the solver's ranges & frequencies, the hero-primary + opponent-context street-by-street layout, embedding the real 13x13 range charts, and publishing with the Artifact tool.
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
   - `<h3>なぜ…</h3>` + `.reasons` (the why).
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

## Accuracy conventions (do not skip)
- **Never round solver values.** Report `Fold 99.8%`, not 100%. Use `≈100%` only when the exact decimal isn't visible (a solid single-color cell).
- **Blocker vs draw.** A flush needs 5 same-suit cards. With 2 board cards of a suit, holding one more is a **backdoor draw** (on the flop) but only a **blocker** (on the turn, when the hero can no longer complete a flush). Never call a blocker a "draw" or vice-versa. Explain blockers as reducing the *opponent's* value/continues.
- **Suit-dependence.** The same pocket pair can bet with one suit and check with another (blocker/backdoor). Read all 6 combos; identify the hero's exact combo.
- **Bars sum to 100.** Hide `<small>` %s on narrow screens (`@media(max-width:560px){.seg small{display:none}}`) so thin segments don't clip.
- **Both themes** (light/dark tokens already in the CSS); fully self-contained (inline CSS, base64 images).
- **Verify against the frames.** If a later frame contradicts an earlier claim, correct it explicitly.

## Style
- Japanese, **hero-first** ("私(BTN)の戦略"), opponent as context ("相手CO"). Gloss jargon on first use: ドンク/リード, キャップ, MDF, EQR, ブロッカー, ポラライズ, ナッツ有利. Numbered takeaways. One clear thesis in the header.

## Files
- `template.html` — full design system + skeleton with placeholders. Start every article from this.
