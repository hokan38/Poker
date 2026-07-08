#!/usr/bin/env python3
"""
オフラインで上質なアンビエントBGMを生成する（外部音源なし・完全合成）。

- 黒×金の高級感に合う、静かで邪魔をしないパッド＋まばらなフェルトピアノのループ。
- 32秒のシームレスループを書き出し、Remotion 側で <Audio loop> して全編に敷く。
- 出力: public/bgm/bgm.mp3（本編用ループ）, public/bgm/bgm-preview.mp3（試聴用・2ループ）

必要: pip install numpy scipy soundfile imageio-ffmpeg
使い方: python3 scripts/generate_bgm.py
"""
import subprocess
from pathlib import Path

import numpy as np
from scipy.signal import butter, lfilter, fftconvolve
import soundfile as sf
import imageio_ffmpeg

SR = 44100
LOOP = 32.0                      # ループ長（秒）＝ 4コード × 8秒
HERE = Path(__file__).resolve().parent.parent
OUT = HERE / "public" / "bgm"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
rng = np.random.default_rng(7)   # 決定論的な“ゆらぎ”

A4 = 440.0
NAMES = {"C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4,
         "F#": -3, "G": -2, "G#": -1, "A": 0, "A#": 1, "B": 2}


def freq(note: str) -> float:
    name, octv = note[:-1], int(note[-1])
    semis = NAMES[name] + (octv - 4) * 12
    return A4 * 2 ** (semis / 12)


# I - vi - IV - V を 9th/6-9 でボイシング（温かく上品な循環）
CHORDS = [
    {"pad": ["C3", "E3", "G3", "B3", "D4"], "bass": "C2", "color": ["E4", "G4", "B4"]},   # Cmaj9
    {"pad": ["A2", "C3", "E3", "G3", "B3"], "bass": "A1", "color": ["C4", "E4", "A4"]},   # Am9
    {"pad": ["F2", "A2", "C3", "E3", "G3"], "bass": "F2", "color": ["A3", "C4", "G4"]},   # Fmaj9
    {"pad": ["G2", "B2", "D3", "E3", "A3"], "bass": "G2", "color": ["D4", "G4", "A4"]},   # G6/9
]


def lp(x, cut, order=4):
    b, a = butter(order, cut / (SR / 2), btype="low")
    return lfilter(b, a, x)


def pad_tone(f, n):
    """柔らかいパッド：わずかにデチューンした倍音＋ゆるいトレモロ。"""
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, amp in [(1, 1.0), (2, 0.28), (3, 0.12), (4, 0.05)]:
        det = 1 + rng.uniform(-0.0016, 0.0016)
        out += amp * np.sin(2 * np.pi * f * k * det * t + rng.uniform(0, 6.28))
    trem = 1 + 0.05 * np.sin(2 * np.pi * 0.08 * t + rng.uniform(0, 6.28))
    return out * trem


def piano_tone(f, n):
    """フェルトピアノ風：速い立ち上がり＋指数減衰、少数の倍音。"""
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, amp in [(1, 1.0), (2, 0.42), (3, 0.16), (4, 0.07)]:
        out += amp * np.sin(2 * np.pi * f * k * t)
    env = np.exp(-t / 0.85) * (1 - np.exp(-t / 0.005))
    return out * env


def xfade_win(n, seg, fade):
    """コード切替のクロスフェード用に、各コードの重み配列（周期・ラップ）を作る。"""
    weights = np.zeros((4, n))
    seg_n, fade_n = int(seg * SR), int(fade * SR)
    for i in range(4):
        w = np.zeros(n)
        start = i * seg_n
        idx = (np.arange(start, start + seg_n)) % n
        w[idx] = 1.0
        # 末尾 fade を次コードへ、先頭 fade を前コードから受け取る（生コサイン）
        ramp = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, fade_n))
        out_idx = (np.arange(start + seg_n - fade_n, start + seg_n)) % n
        w[out_idx] = np.cos(np.linspace(0, np.pi / 2, fade_n)) ** 2
        in_idx = (np.arange(start, start + fade_n)) % n
        w[in_idx] = np.sin(np.linspace(0, np.pi / 2, fade_n)) ** 2
        weights[i] = w
    s = weights.sum(axis=0)
    s[s == 0] = 1
    return weights / s


def build_dry():
    n = int(LOOP * SR)
    seg = LOOP / 4
    W = xfade_win(n, seg, fade=2.0)
    pad = np.zeros(n)
    bass = np.zeros(n)
    for i, ch in enumerate(CHORDS):
        seg_sig = np.zeros(n)
        for note in ch["pad"]:
            seg_sig += pad_tone(freq(note), n)
        seg_sig /= len(ch["pad"])
        pad += seg_sig * W[i]
        b = 0.6 * np.sin(2 * np.pi * freq(ch["bass"]) * np.arange(n) / SR)
        bass += b * W[i]
    pad = lp(pad, 2600) * 0.5
    bass = lp(bass, 220) * 0.32

    # まばらなピアノ（各コードで2音ほど、控えめに）
    piano = np.zeros(n)
    seg_n = n // 4
    for i, ch in enumerate(CHORDS):
        hits = [0.15, 0.55] if i % 2 == 0 else [0.35]
        for h in hits:
            note = ch["color"][rng.integers(0, len(ch["color"]))]
            start = int((i + h) * seg_n) % n
            tone = piano_tone(freq(note) * 2, seg_n)  # 1オクターブ上で軽やかに
            vel = rng.uniform(0.16, 0.24)
            end = min(start + len(tone), n)
            piano[start:end] += tone[: end - start] * vel
    return pad + bass + piano


def reverb(x, wet=0.34):
    """合成インパルス応答による軽いホール（低域寄り・きらつき抑制）。"""
    ir_n = int(2.6 * SR)
    t = np.arange(ir_n) / SR
    ir = rng.standard_normal(ir_n) * np.exp(-t / 0.7)
    ir = lp(ir, 3500)
    ir /= np.max(np.abs(ir))
    # 3連結してループの残響を巻き込み、中央を取り出す＝シームレス
    tri = np.tile(x, 3)
    wetsig = fftconvolve(tri, ir)[: len(tri)]
    n = len(x)
    wetsig = wetsig[n:2 * n]
    wetsig /= (np.max(np.abs(wetsig)) or 1)
    return (1 - wet) * x + wet * wetsig


def seamless(x, fade=0.16):
    """末尾を先頭へクロスフェードして完全ループ化。"""
    xf = int(fade * SR)
    w_in = np.sin(np.linspace(0, np.pi / 2, xf)) ** 2
    w_out = np.cos(np.linspace(0, np.pi / 2, xf)) ** 2
    y = x.copy()
    y[:xf] = x[:xf] * w_in + x[-xf:] * w_out
    return y[:-xf]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    dry = build_dry()
    wet = reverb(dry)
    loop = seamless(wet)
    loop /= (np.max(np.abs(loop)) or 1)
    loop *= 0.72  # -3 dBFS 目安（最終音量は Remotion 側で絞る）

    wav = OUT / "bgm.wav"
    sf.write(wav, loop.astype(np.float32), SR)
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", str(wav),
                    "-codec:a", "libmp3lame", "-q:a", "4", str(OUT / "bgm.mp3")], check=True)

    # 試聴用（2ループ＝約64秒。ループの継ぎ目も確認できる）
    prev = np.tile(loop, 2)
    sf.write(OUT / "_prev.wav", prev.astype(np.float32), SR)
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", str(OUT / "_prev.wav"),
                    "-codec:a", "libmp3lame", "-q:a", "4", str(OUT / "bgm-preview.mp3")], check=True)
    (OUT / "_prev.wav").unlink(missing_ok=True)
    wav.unlink(missing_ok=True)
    print(f"loop {len(loop)/SR:.2f}s -> {OUT/'bgm.mp3'}")
    print(f"preview -> {OUT/'bgm-preview.mp3'}")


if __name__ == "__main__":
    main()
