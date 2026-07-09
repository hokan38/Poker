#!/usr/bin/env python3
"""
明るい・軽快なBGMをゼロから合成する（完全オフライン）。

従来の bgm_variants.py（持続パッド＋深いリバーブ）は雰囲気が暗く重かったため、
まったく別の作り方にする:
  - 長調・はっきりしたテンポ（108 BPM）で「動き」を出す
  - 歯切れの良いプラック（マリンバ/ピチカート風）のアルペジオ＋オルゴールの旋律
  - リバーブは控えめ（近く・明るい）、音域は高め、低音は軽く
  - preset 'daylight'（ドラム無し・上品）/ 'sunrise'（軽い groove 付き・陽気）

使い方:
  python3 scripts/bright_bgm.py <preset> <out.mp3>      # 単一ループを書き出す
  python3 scripts/bright_bgm.py --preview <dir>          # 全preset の試聴(2ループ)
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy.signal import butter, lfilter, fftconvolve
import soundfile as sf
import imageio_ffmpeg

SR = 44100
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
rng = np.random.default_rng(3)

NAMES = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5,
         "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}


def freq(note):
    name, octv = note[:-1], int(note[-1])
    midi = (octv + 1) * 12 + NAMES[name]
    return 440.0 * 2 ** ((midi - 69) / 12)


def lp(x, cut, order=4):
    b, a = butter(order, min(cut, SR / 2 - 100) / (SR / 2), btype="low")
    return lfilter(b, a, x)


def hp(x, cut, order=2):
    b, a = butter(order, max(30, cut) / (SR / 2), btype="high")
    return lfilter(b, a, x)


# ---- 音色（すべて速いアタック・明るい倍音・短めの減衰でカラッと） ----
def pluck(f, dur, vel=1.0, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    parts = [(1, 1.0), (2, 0.55 * bright), (3, 0.36 * bright), (4, 0.22 * bright),
             (5, 0.13 * bright), (6, 0.08 * bright)]
    out = sum(a * np.sin(2 * np.pi * f * k * t) for k, a in parts)
    env = np.exp(-t * 5.5) * (1 - np.exp(-t * 500))
    return out * env * vel


def musicbox(f, dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 2 * f * t)
           + 0.3 * np.sin(2 * np.pi * 3.02 * f * t) + 0.16 * np.sin(2 * np.pi * 4.9 * f * t))
    env = np.exp(-t * 3.2) * (1 - np.exp(-t * 800))
    return out * env * vel


def bass(f, dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    env = np.exp(-t * 3.2) * (1 - np.exp(-t * 300))
    return lp(out, 1400) * env * vel


def kick(dur=0.26, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(np.linspace(115, 46, n)) / SR
    out = np.sin(ph) * np.exp(-t * 15)
    click = np.exp(-t * 320) * 0.35
    return (out + click) * vel


def shaker(dur=0.11, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = hp(rng.standard_normal(n), 6500) * np.exp(-t * 42)
    return out * vel


def small_reverb(x, wet, tau=0.5, cut=6500):
    ir_n = int(tau * 3 * SR)
    t = np.arange(ir_n) / SR
    ir = lp(rng.standard_normal(ir_n) * np.exp(-t / tau), cut)
    ir /= np.max(np.abs(ir))
    w = fftconvolve(x, ir)[: len(x)]
    w /= (np.max(np.abs(w)) or 1)
    return (1 - wet) * x + wet * w * np.max(np.abs(x))


def seamless(x, fade=0.14):
    xf = int(fade * SR)
    wi = np.sin(np.linspace(0, np.pi / 2, xf)) ** 2
    wo = np.cos(np.linspace(0, np.pi / 2, xf)) ** 2
    y = x.copy()
    y[:xf] = x[:xf] * wi + x[-xf:] * wo
    return y[:-xf]


# ---- 楽曲データ（Cメジャー・I–V–vi–IV を2周 = 8小節） ----
BPM = 108
BEAT = 60.0 / BPM
BAR = 4 * BEAT
BARS = 8
PROG = ["C", "G", "Am", "F", "C", "G", "Am", "F"]
ARP_POOL = {
    "C":  ["C4", "E4", "G4", "C5", "E5", "G5"],
    "G":  ["G3", "B3", "D4", "G4", "B4", "D5"],
    "Am": ["A3", "C4", "E4", "A4", "C5", "E5"],
    "F":  ["F3", "A3", "C4", "F4", "A4", "C5"],
}
ARP_ROOT = {"C": "C3", "G": "G2", "Am": "A2", "F": "F2"}
ARP_PATTERN = [0, 2, 4, 5, 4, 2, 3, 5]   # 8分×8 = 1小節
# 旋律（(loop先頭からのbeat, note, dur_beats)）
MELODY = [
    (0, "C5", 1), (1, "E5", 1), (2, "G5", 2),
    (4, "D5", 1), (5, "G5", 1), (6, "B5", 2),
    (8, "C5", 1), (9, "E5", 1), (10, "A5", 2),
    (12, "A4", 1), (13, "C5", 1), (14, "F5", 2),
    (16, "E5", 1), (17, "G5", 1), (18, "C6", 2),
    (20, "B4", 1), (21, "D5", 1), (22, "G5", 2),
    (24, "C5", 1), (25, "E5", 1), (26, "A5", 2),
    (28, "C5", 1), (29, "A4", 1), (30, "F5", 2),
]


def add(buf, tone, start_sec):
    s = int(start_sec * SR)
    e = min(s + len(tone), len(buf))
    if s < len(buf):
        buf[s:e] += tone[: e - s]


def build(preset):
    total = int(BARS * BAR * SR) + SR  # +1s の余韻ぶん
    arp = np.zeros(total)
    mel = np.zeros(total)
    bs = np.zeros(total)
    dr = np.zeros(total)

    for bar in range(BARS):
        ch = PROG[bar]
        pool = ARP_POOL[ch]
        t0 = bar * BAR
        # アルペジオ（8分音符×8）
        for i, idx in enumerate(ARP_PATTERN):
            note = pool[idx]
            add(arp, pluck(freq(note), 0.5, vel=0.42, bright=1.0), t0 + i * (BEAT / 2))
        # ベース（1・3拍）
        add(bs, bass(freq(ARP_ROOT[ch]), 0.9, vel=0.5), t0)
        add(bs, bass(freq(ARP_ROOT[ch]), 0.7, vel=0.42), t0 + 2 * BEAT)
        # ドラム（sunrise のみ・軽く）
        if preset == "sunrise":
            add(dr, kick(vel=0.5), t0)
            add(dr, kick(vel=0.42), t0 + 2 * BEAT)
            for j in range(8):
                if j % 2 == 1:
                    add(dr, shaker(vel=0.16), t0 + j * (BEAT / 2))

    # 旋律（オルゴール）
    for beat, note, db in MELODY:
        add(mel, musicbox(freq(note), db * BEAT + 0.4, vel=0.5), beat * BEAT)

    mix = 0.9 * arp + 1.0 * mel + 0.85 * bs + (0.8 * dr if preset == "sunrise" else 0.0)
    # 明るさ：控えめリバーブ＋高域を少し持ち上げ
    mix = small_reverb(mix, wet=0.16 if preset == "daylight" else 0.13)
    mix = mix + 0.25 * hp(mix, 3000)
    # ちょうど8小節でループ
    loop = mix[: int(BARS * BAR * SR)]
    loop = seamless(loop)
    loop /= (np.max(np.abs(loop)) or 1)
    return loop * 0.82


def encode(x, path):
    tmp = Path(str(path) + ".wav")
    sf.write(tmp, x.astype(np.float32), SR)
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", str(tmp),
                    "-codec:a", "libmp3lame", "-q:a", "3", str(path)], check=True)
    tmp.unlink(missing_ok=True)


PRESETS = ("daylight", "sunrise")


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--preview":
        outdir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(".")
        outdir.mkdir(parents=True, exist_ok=True)
        for p in PRESETS:
            loop = build(p)
            encode(np.tile(loop, 2), outdir / f"bright-{p}.mp3")
            print(f"{p:10s} loop {len(loop)/SR:.1f}s -> {outdir / f'bright-{p}.mp3'}")
        return 0
    preset = sys.argv[1] if len(sys.argv) > 1 else "daylight"
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("public/bgm/bgm.mp3")
    out.parent.mkdir(parents=True, exist_ok=True)
    encode(build(preset), out)
    print(f"final [{preset}] -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
