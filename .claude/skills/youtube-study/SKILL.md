---
name: youtube-study
description: Learn from YouTube videos/channels and record the knowledge into this repo's study notes (docs/*.md). Use when the user shares a YouTube URL (youtube.com / youtu.be / @channel) and asks to 視聴・学習・記憶・要約する, watch a channel's videos, or update the GTO Wizard Japan study note with a new video. Covers the full proven pipeline for this remote environment: yt-dlp setup (bun JS runtime), channel listing, Japanese auto-subtitle download + VTT→clean-text conversion, storyboard (sb0) download + MHTML tile extraction for on-screen slide verification, ASR-error handling, and the note-writing/commit conventions. Also documents which approaches are BLOCKED here (video file download, browser playback) so no time is wasted re-attempting them.
---

# YouTube Study — 動画からの学習・記憶

Extract a YouTube video's full content (narration + on-screen slides), verify it, and persist it as knowledge in this repo (the repo IS the memory — Claude has no cross-session memory).

## When to use
- The user shares a YouTube video/channel URL and asks to 視聴して / 学習して / 記憶して / 要約して.
- Adding more videos of GTO Wizard Japan (or any channel) to an existing study note.

## What works vs what is blocked (verified 2026-07, this environment)

| Approach | Status | Notes |
|---|---|---|
| Auto-subtitle (ja) download | ✅ works | Full narration text — the main content source |
| Storyboard (`sb0`, 160x90/frame) | ✅ works | Enough to read slide headings/labels and verify structure |
| Video file download (yt-dlp, any client) | ❌ 403 | YouTube requires a GVS PO token from datacenter IPs; only SABR streams offered. Do NOT retry clients/flags — all tested |
| Browser playback (Chromium+playwright, headless or Xvfb) | ❌ UNPLAYABLE | Page loads but the in-browser `/youtubei/v1/player` POST gets bot-flagged. Requires chained mitmproxy anyway (env proxy resets Chromium TLS) |
| bgutil PO-token provider (npm) | ❌ denied | Untrusted-code permission denial — do not work around |
| Age-restricted videos | ❌ needs login | Ask the user to open the video, use「文字起こしを表示」and paste the text |

So the pipeline is: **subtitles (all of the audio) + storyboard (spot-check the screen)**. For slide-lecture content this captures essentially everything.

## Setup (once per session)

```bash
pip install -q yt-dlp
# JS runtime for n-challenge: ONLY bun works here (node is 20.x=unsupported at /usr/local/bin, deno absent)
YTDLP="yt-dlp --js-runtimes bun:/root/.bun/bin/bun"
```
Work in the scratchpad directory, not the repo.

## 1. List channel videos

```bash
$YTDLP --flat-playlist --print "%(title)s | %(id)s | %(duration)s" "https://www.youtube.com/@CHANNEL/videos"
```

## 2. Download subtitles (single video or whole channel)

```bash
$YTDLP --skip-download --write-auto-sub --write-sub --sub-lang ja --sub-format vtt \
  -o "subs/%(id)s" --sleep-requests 1 "URL_OR_CHANNEL/videos"
```
Videos that error with "Sign in to confirm your age" cannot be fetched — record them as 本文未取得 and tell the user the paste-the-transcript fallback.

## 3. Convert VTT → clean text

YouTube auto-sub VTT has inline `<timing>` tags and rolling duplicate lines. Convert with:

```python
import re, glob, os
os.makedirs('txt', exist_ok=True)
for path in glob.glob('subs/*.ja.vtt'):
    vid = os.path.basename(path).split('.')[0]
    out, prev = [], None
    for line in open(path, encoding='utf-8'):
        line = line.strip()
        if not line or '-->' in line or line.startswith(('WEBVTT','Kind:','Language:','NOTE')):
            continue
        line = re.sub(r'<[^>]+>', '', line).strip()
        if line and line != prev:
            out.append(line); prev = line
    open(f'txt/{vid}.txt','w',encoding='utf-8').write('\n'.join(out))
```

## 4. Screen verification via storyboard

```bash
$YTDLP -f sb0 -o "sb_%(id)s.%(ext)s" "https://www.youtube.com/watch?v=VIDEO_ID"
```
Extract JPEG tiles from the MHTML (each tile = 800x450 grid of 5x5 frames, 160x90 each):

```python
import email, os
from email import policy
msg = email.message_from_binary_file(open('sb_VIDEO_ID.mhtml','rb'), policy=policy.default)
os.makedirs('sb', exist_ok=True); n = 0
for part in msg.walk():
    if part.get_content_type().startswith('image'):
        data = part.get_payload(decode=True)
        if data: open(f'sb/tile_{n}.jpg','wb').write(data); n += 1
```
Save tiles/crops as PNG (Pillow) and **Read** them. Tiles are often partially corrupted JPEGs — the readable top rows still show slide headings, formula labels, and section order. Use them to (a) verify the transcript's structure, (b) catch slide text the narration skips. Do not expect to read small numbers.

## 5. Write the study note

Target: the relevant `docs/*.md` note (e.g. `docs/gto-wizard-japan-youtube-notes.md`). Follow its existing conventions:

- **Integrate by theme**, don't just append per-video dumps. Update the 動画カタログ table (title / テーマ分類 / 一言要約 / URL).
- **ASR disclaimer**: the source is auto speech recognition — poker terms and numbers may be misrecognized. Reconstruct from context; mark uncertain items（推定）. Never present an ASR number as verified.
- **Cross-check numbers**: if a quiz's stated inputs and its stated answer disagree, trust whichever is self-consistent, and add a note explaining the discrepancy (see the 数式 video's 14.6/5.5 vs 60%-pot case — 解答側を正 with rationale).
- **Screen-verified marker**: when storyboard checking was done, add a `> **画面検証済み (日付)**: …` blockquote stating what was verified (slide sequence, headings) and that it matches the transcript.
- Keep terminology consistent with `docs/amu-goole-poker-notes.md` (α, MDF, ポラライズ, EQ実現率…).

## 6. Persist

Commit the note update to the session's designated branch and push. The note is the memory — future sessions answer from it.

## Reporting to the user

- Lead with what was learned (the actual content), not the mechanics.
- State coverage honestly: 字幕=音声全文 / 画面=ストーリーボードによる構成確認まで（フル画質視聴は不可）.
- List unobtainable videos and the fallback (user pastes transcript, or uploads a screen recording → then use the `gto-hand-explainer` skill's ffmpeg frame pipeline for full-fidelity screen reading).
