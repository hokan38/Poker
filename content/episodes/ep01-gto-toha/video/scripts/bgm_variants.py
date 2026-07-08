#!/usr/bin/env python3
"""
BGM の雰囲気ちがいを複数生成して試聴（完全合成・オフライン）。
styles: noir(ダーク緊張) / jazz(ラウンジ) / cinematic(荘厳) / ambient(前回の温かい系)
使い方: python3 scripts/bgm_variants.py <出力ディレクトリ>
各 style を 2 ループつなげた試聴用 mp3 を書き出す。
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
rng = np.random.default_rng(11)

A4 = 440.0
NAMES = {"C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4,
         "F#": -3, "G": -2, "G#": -1, "A": 0, "A#": 1, "B": 2}


def freq(note):
    return A4 * 2 ** ((NAMES[note[:-1]] + (int(note[-1]) - 4) * 12) / 12)


def lp(x, cut, order=4):
    b, a = butter(order, min(cut, SR / 2 - 100) / (SR / 2), btype="low")
    return lfilter(b, a, x)


def pad_tone(f, n, bright=1.0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, amp in [(1, 1.0), (2, 0.3 * bright), (3, 0.13 * bright), (4, 0.05 * bright)]:
        det = 1 + rng.uniform(-0.0016, 0.0016)
        out += amp * np.sin(2 * np.pi * f * k * det * t + rng.uniform(0, 6.28))
    return out * (1 + 0.05 * np.sin(2 * np.pi * 0.08 * t))


def string_tone(f, n):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for voice in range(3):
        det = 1 + rng.uniform(-0.004, 0.004)
        vib = 1 + 0.003 * np.sin(2 * np.pi * 5.0 * t + rng.uniform(0, 6.28))
        for k in range(1, 9):
            out += (1.0 / k) * np.sin(2 * np.pi * f * k * det * vib * t + rng.uniform(0, 6.28))
    return lp(out / 3, 3200)


def rhodes_tone(f, n):
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2 * f * t)
    tine = 0.5 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / 0.18)
    env = np.exp(-t / 1.7) * (1 - np.exp(-t / 0.004))
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.2 * t)
    return (body + tine) * env * trem


def piano_tone(f, n):
    t = np.arange(n) / SR
    out = sum(a * np.sin(2 * np.pi * f * k * t) for k, a in [(1, 1), (2, 0.42), (3, 0.16), (4, 0.07)])
    return out * np.exp(-t / 0.9) * (1 - np.exp(-t / 0.005))


def reverb(x, wet, tau, cut):
    ir_n = int((tau * 3.2) * SR)
    t = np.arange(ir_n) / SR
    ir = lp(rng.standard_normal(ir_n) * np.exp(-t / tau), cut)
    ir /= np.max(np.abs(ir))
    tri = np.tile(x, 3)
    w = fftconvolve(tri, ir)[: len(tri)]
    n = len(x)
    w = w[n:2 * n]
    w /= (np.max(np.abs(w)) or 1)
    return (1 - wet) * x + wet * w


def seamless(x, fade=0.18):
    xf = int(fade * SR)
    wi = np.sin(np.linspace(0, np.pi / 2, xf)) ** 2
    wo = np.cos(np.linspace(0, np.pi / 2, xf)) ** 2
    y = x.copy()
    y[:xf] = x[:xf] * wi + x[-xf:] * wo
    return y[:-xf]


def chord_bed(chords, seg, timbre, level, bright=1.0):
    n = int(seg * len(chords) * SR)
    seg_n = int(seg * SR)
    out = np.zeros(n)
    fade = int(min(2.0, seg * 0.35) * SR)
    env = np.ones(seg_n)
    env[:fade] = np.sin(np.linspace(0, np.pi / 2, fade)) ** 2
    env[-fade:] = np.cos(np.linspace(0, np.pi / 2, fade)) ** 2
    for i, notes in enumerate(chords):
        sig = np.zeros(seg_n)
        for note in notes:
            if timbre == "string":
                sig += string_tone(freq(note), seg_n)
            elif timbre == "rhodes":
                sig += rhodes_tone(freq(note), seg_n)
            else:
                sig += pad_tone(freq(note), seg_n, bright)
        sig = sig / len(notes) * env
        s = i * seg_n
        out[s:s + seg_n] += sig
    return out * level


def bass_line(roots, seg, level, cut=180):
    seg_n = int(seg * SR)
    n = seg_n * len(roots)
    out = np.zeros(n)
    env = np.ones(seg_n)
    f = int(0.05 * SR)
    env[:f] = np.linspace(0, 1, f)
    env[-f:] = np.linspace(1, 0, f)
    for i, r in enumerate(roots):
        sig = np.sin(2 * np.pi * freq(r) * np.arange(seg_n) / SR) * env
        out[i * seg_n:(i + 1) * seg_n] += sig
    return lp(out, cut) * level


def sprinkle(events, total_n, style):
    """(time_frac, note) のリストで、まばらな上物を配置。"""
    out = np.zeros(total_n)
    for tf, note, vel in events:
        start = int(tf * total_n) % total_n
        tone = piano_tone(freq(note), int(3.0 * SR))
        end = min(start + len(tone), total_n)
        out[start:end] += tone[: end - start] * vel
    return out


STYLES = {
    # ダーク・緊張感（ポーカーの張り詰めた空気）
    "noir": dict(
        seg=12.0,
        chords=[["A2", "C3", "E3", "B3"], ["F2", "A2", "C3", "E3"]],
        roots=["A1", "F1"], timbre="pad", bright=0.5, chord_lvl=0.42, bass_lvl=0.4,
        rev=(0.42, 1.0, 3000),
        lead=[(0.18, "A4", 0.18), (0.55, "E4", 0.15), (0.78, "C5", 0.14),
              (1.30, "F4", 0.16), (1.72, "A4", 0.13)],
    ),
    # ラウンジ・ジャズ（洗練されたカジノ）
    "jazz": dict(
        seg=6.0,
        chords=[["D3", "F3", "A3", "C4", "E4"], ["G2", "B3", "D4", "F4", "A4"],
                ["C3", "E3", "G3", "B3", "D4"], ["A2", "C#4", "E4", "G4"]],
        roots=["D2", "G2", "C2", "A1"], timbre="rhodes", bright=1.0, chord_lvl=0.34, bass_lvl=0.36,
        rev=(0.3, 0.7, 4200),
        lead=[(0.30, "A4", 0.16), (0.75, "C5", 0.14), (1.55, "B4", 0.15), (2.40, "E5", 0.13), (3.10, "D5", 0.14)],
    ),
    # 荘厳・シネマティック（プレミアムなドキュメンタリー感）
    "cinematic": dict(
        seg=8.0,
        chords=[["C3", "G3", "D#4", "G4"], ["G#2", "D#3", "C4", "G4"],
                ["D#3", "A#3", "G4", "A#4"], ["A#2", "F3", "D4", "F4"]],
        roots=["C2", "G#1", "D#2", "A#1"], timbre="string", bright=1.0, chord_lvl=0.36, bass_lvl=0.42,
        rev=(0.44, 1.4, 3200),
        lead=[(0.10, "G4", 0.14), (1.05, "D#5", 0.13), (2.05, "A#4", 0.14), (3.05, "C5", 0.13)],
    ),
}


def build(style):
    p = STYLES[style]
    bed = chord_bed(p["chords"], p["seg"], p["timbre"], p["chord_lvl"], p.get("bright", 1.0))
    n = len(bed)
    bass = bass_line(p["roots"], p["seg"], p["bass_lvl"])[:n]
    lead = sprinkle(p["lead"], n, style)
    mix = bed + bass + lead
    wet, tau, cut = p["rev"]
    mix = reverb(mix, wet, tau, cut)
    loop = seamless(mix)
    loop /= (np.max(np.abs(loop)) or 1)
    return loop * 0.72


def encode(x, path):
    tmp = Path(str(path) + ".wav")
    sf.write(tmp, x.astype(np.float32), SR)
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", str(tmp),
                    "-codec:a", "libmp3lame", "-q:a", "4", str(path)], check=True)
    tmp.unlink(missing_ok=True)


def main():
    # 本番用：選んだ style の1ループを指定パスへ（例: public/bgm/bgm.mp3）
    if len(sys.argv) > 1 and sys.argv[1] == "--final":
        style = sys.argv[2]
        out = Path(sys.argv[3]) if len(sys.argv) > 3 else Path("public/bgm/bgm.mp3")
        out.parent.mkdir(parents=True, exist_ok=True)
        encode(build(style), out)
        print(f"final [{style}] -> {out}")
        return 0
    # 既定：3種の試聴（2ループ）を書き出す
    outdir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    outdir.mkdir(parents=True, exist_ok=True)
    for style in ("noir", "jazz", "cinematic"):
        loop = build(style)
        prev = np.tile(loop, 2)
        path = outdir / f"bgm-{style}.mp3"
        encode(prev, path)
        print(f"{style:10s} loop {len(loop)/SR:.1f}s -> {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
