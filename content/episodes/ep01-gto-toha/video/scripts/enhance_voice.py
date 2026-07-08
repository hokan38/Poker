#!/usr/bin/env python3
"""
ナレーション音声（Open JTalk / HTS）の後処理で耳あたりを良くする。
ニューラルTTSモデルはこの環境（HuggingFace/GitHub 到達不可）で入手できないため、
合成音声を残しつつ DSP で温かみ・自然さを足すのが現実的な最善策。

チェイン: ハイパス → 耳障りな帯域を軽く削る → 低域の温かみ →
          高域のきらつき抑制 → 軽いコンプ → うっすらルーム残響 → ノーマライズ

使い方:
  python3 scripts/enhance_voice.py in.mp3 out.mp3          # 1ファイル処理
  python3 scripts/enhance_voice.py --preview               # before/after 試聴を書き出し
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
HERE = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(3)


def decode(path):
    tmp = Path(str(path) + ".dec.wav")
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", str(path),
                    "-ar", str(SR), "-ac", "1", str(tmp)], check=True)
    x, _ = sf.read(tmp)
    tmp.unlink(missing_ok=True)
    return x.astype(np.float32)


def biquad(x, kind, f0, Q, gain_db=0.0):
    A = 10 ** (gain_db / 40)
    w0 = 2 * np.pi * f0 / SR
    cw, sw = np.cos(w0), np.sin(w0)
    al = sw / (2 * Q)
    if kind == "peak":
        b = [1 + al * A, -2 * cw, 1 - al * A]
        a = [1 + al / A, -2 * cw, 1 - al / A]
    elif kind == "hpf":
        b = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]
        a = [1 + al, -2 * cw, 1 - al]
    elif kind == "hshelf":
        tw = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) + (A - 1) * cw + tw), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - tw)]
        a = [(A + 1) - (A - 1) * cw + tw, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - tw]
    else:
        raise ValueError(kind)
    b = np.array(b) / a[0]
    a = np.array(a) / a[0]
    return lfilter(b, a, x)


def compress(x, thr_db=-20.0, ratio=2.6, atk=0.006, rel=0.13, makeup_db=3.5):
    """穏やかなフィードフォワード・コンプ（声を前に出し、ムラを均す）。"""
    env = np.zeros_like(x)
    a_at = np.exp(-1 / (atk * SR))
    a_re = np.exp(-1 / (rel * SR))
    absx = np.abs(x)
    e = 0.0
    for i in range(len(x)):
        c = a_at if absx[i] > e else a_re
        e = c * e + (1 - c) * absx[i]
        env[i] = e
    env_db = 20 * np.log10(env + 1e-9)
    over = np.maximum(env_db - thr_db, 0)
    gain_db = -over * (1 - 1 / ratio) + makeup_db
    return x * 10 ** (gain_db / 20)


def small_room(x, wet=0.09):
    ir_n = int(0.42 * SR)
    t = np.arange(ir_n) / SR
    ir = rng.standard_normal(ir_n) * np.exp(-t / 0.11)
    b, a = butter(4, 4200 / (SR / 2), btype="low")
    ir = lfilter(b, a, ir)
    ir[0] += 0.6
    ir /= np.max(np.abs(ir))
    wetsig = fftconvolve(x, ir)[: len(x)]
    wetsig /= (np.max(np.abs(wetsig)) or 1)
    return (1 - wet) * x + wet * wetsig * np.max(np.abs(x))


def enhance(x):
    x = biquad(x, "hpf", 80, 0.7)
    x = biquad(x, "peak", 3200, 1.2, -3.2)     # HTS のジリつきを軽減
    x = biquad(x, "peak", 210, 0.9, 2.2)       # 温かみ・胸声
    x = biquad(x, "peak", 5200, 1.6, 1.2)      # わずかに明瞭さ
    x = biquad(x, "hshelf", 9000, 0.7, -3.5)   # 合成臭いきらつきを抑える
    x = compress(x)
    x = small_room(x)
    peak = np.max(np.abs(x)) or 1
    return (x / peak) * 0.95


def encode(x, path):
    tmp = Path(str(path) + ".enc.wav")
    sf.write(tmp, x.astype(np.float32), SR)
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", str(tmp),
                    "-codec:a", "libmp3lame", "-q:a", "3", str(path)], check=True)
    tmp.unlink(missing_ok=True)


def main():
    if "--preview" in sys.argv:
        src = HERE / "public" / "narration" / "scene-02-hook.mp3"
        x = decode(src)[: int(15 * SR)]                 # 冒頭15秒で比較
        out = Path(sys.argv[sys.argv.index("--preview") + 1]) if len(sys.argv) > sys.argv.index("--preview") + 1 else HERE
        before = out / "voice-before.mp3"
        after = out / "voice-after.mp3"
        encode(x / (np.max(np.abs(x)) or 1) * 0.95, before)
        encode(enhance(x), after)
        print(f"before -> {before}\nafter  -> {after}")
        return 0
    inp, outp = sys.argv[1], sys.argv[2]
    encode(enhance(decode(inp)), outp)
    print(f"{inp} -> {outp}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
