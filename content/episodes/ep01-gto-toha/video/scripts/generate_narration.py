#!/usr/bin/env python3
"""
オフライン日本語ナレーション生成（Open JTalk / pyopenjtalk）。

- narration/lines.json を読み、各シーンの音声を合成
- public/narration/scene-XX.mp3 を出力（Remotion の staticFile 用）
- src/manifest.json を出力（各シーンの尺・フレーム数）

必要:
  pip install pyopenjtalk soundfile numpy imageio-ffmpeg
  Open JTalk 辞書を用意し、環境変数 OPEN_JTALK_DICT_DIR で場所を指定
    （例: SourceForge の open_jtalk_dic_utf_8-1.11 を展開したディレクトリ）
使い方:
  OPEN_JTALK_DICT_DIR=/path/to/open_jtalk_dic_utf_8-1.11 python3 scripts/generate_narration.py
"""
import json
import math
import os
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import pyopenjtalk
import soundfile as sf
import imageio_ffmpeg

HERE = Path(__file__).resolve().parent.parent  # video/
LINES = HERE / "narration" / "lines.json"
PUB = HERE / "public" / "narration"
MANIFEST = HERE / "src" / "manifest.json"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

MIN_CHARS = 12   # 字幕1枚の最小文字数の目安


def make_captions(text, audio_frames, lead_in, fps):
    """ナレーションを句読点で区切り、文字数に比例して時間割りした字幕を作る。
    返り値: [{"t": 表示文, "from": フレーム, "to": フレーム}]（シーン先頭基準）。"""
    tokens = re.findall(r"[^、。！？]+[、。！？]?", text)
    chunks, cur = [], ""
    for tok in tokens:
        cur += tok
        if len(cur) >= MIN_CHARS or tok.endswith(("。", "！", "？")):
            chunks.append(cur)
            cur = ""
    if cur:
        chunks.append(cur)
    # 表示は末尾の読点を除いて整える
    disp = [c.rstrip("、") for c in chunks]
    total_chars = sum(len(c) for c in chunks) or 1
    caps, acc = [], lead_in
    for c, d in zip(chunks, disp):
        dur = max(int(round(len(c) / total_chars * audio_frames)), 8)
        caps.append({"t": d, "from": acc, "to": acc + dur})
        acc += dur
    if caps:  # 最後は音声終端に合わせる
        caps[-1]["to"] = lead_in + audio_frames
    return caps


def main() -> int:
    dict_dir = os.environ.get("OPEN_JTALK_DICT_DIR")
    if not dict_dir or not Path(dict_dir).exists():
        print("ERROR: set OPEN_JTALK_DICT_DIR to the Open JTalk dictionary directory", file=sys.stderr)
        return 2
    pyopenjtalk.OPEN_JTALK_DICT_DIR = str(dict_dir).encode("utf-8")

    data = json.loads(LINES.read_text(encoding="utf-8"))
    fps = int(data["fps"])
    lead_in = int(data["leadInFrames"])
    tail = int(data["tailFrames"])
    PUB.mkdir(parents=True, exist_ok=True)

    scenes = []
    for i, line in enumerate(data["lines"], start=1):
        sid = line["id"]
        text = line["text"]
        wav_path = PUB / f"scene-{i:02d}-{sid}.wav"
        mp3_path = PUB / f"scene-{i:02d}-{sid}.mp3"

        x, sr = pyopenjtalk.tts(text, speed=1.0)
        x = np.asarray(x, dtype=np.float32)
        peak = float(np.max(np.abs(x))) or 1.0
        x = (x / peak) * 0.95
        # 末尾の無音を少しトリム（HTS は末尾に無音を持つことがある）
        sf.write(wav_path, x, sr)

        subprocess.run(
            [FFMPEG, "-y", "-loglevel", "error", "-i", str(wav_path),
             "-codec:a", "libmp3lame", "-q:a", "3", str(mp3_path)],
            check=True,
        )
        wav_path.unlink(missing_ok=True)

        audio_sec = len(x) / sr
        audio_frames = math.ceil(audio_sec * fps)
        dur_frames = lead_in + audio_frames + tail
        scenes.append({
            "id": sid,
            "index": i,
            "file": mp3_path.name,
            "audioSec": round(audio_sec, 3),
            "audioFrames": audio_frames,
            "leadInFrames": lead_in,
            "durationInFrames": dur_frames,
            "captions": make_captions(text, audio_frames, lead_in, fps),
        })
        print(f"  scene {i:02d} {sid:8s}  {audio_sec:5.2f}s  -> {dur_frames} frames")

    total = sum(s["durationInFrames"] for s in scenes)
    manifest = {"fps": fps, "leadInFrames": lead_in, "tailFrames": tail,
                "totalFrames": total, "totalSec": round(total / fps, 2), "scenes": scenes}
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nTotal: {total} frames = {total / fps:.1f}s  ({len(scenes)} scenes)")
    print(f"Manifest: {MANIFEST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
