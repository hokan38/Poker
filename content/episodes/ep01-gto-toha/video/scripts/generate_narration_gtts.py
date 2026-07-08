#!/usr/bin/env python3
"""
Google Cloud Text-to-Speech でナレーションを生成する（自然な日本語ニューラル音声）。

- narration/lines.json を読み、各シーンの音声を合成
- public/narration/scene-XX.mp3 を出力（Remotion の staticFile 用）
- src/manifest.json を出力（尺・字幕。字幕ロジックは generate_narration.py と共通）

前提:
  - 環境変数 GOOGLE_TTS_API_KEY にAPIキー
  - ネットワークで texttospeech.googleapis.com を許可
  - pip install soundfile imageio-ffmpeg
任意の環境変数:
  TTS_VOICE  (既定 ja-JP-Neural2-C：落ち着いた男性)  例) ja-JP-Neural2-B(女性)
  TTS_RATE   (既定 1.0：話速)   TTS_PITCH (既定 0.0：ピッチ)
使い方:
  GOOGLE_TTS_API_KEY=... python3 scripts/generate_narration_gtts.py
"""
import base64
import json
import math
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

import soundfile as sf
import imageio_ffmpeg

# 字幕生成ロジックは pyopenjtalk 版と共通のものを流用
from generate_narration import make_captions  # noqa: E402

HERE = Path(__file__).resolve().parent.parent  # video/
LINES = HERE / "narration" / "lines.json"
PUB = HERE / "public" / "narration"
MANIFEST = HERE / "src" / "manifest.json"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

API = "https://texttospeech.googleapis.com/v1/text:synthesize"
VOICE = os.environ.get("TTS_VOICE", "ja-JP-Neural2-C")
RATE = float(os.environ.get("TTS_RATE", "1.0"))
PITCH = float(os.environ.get("TTS_PITCH", "0.0"))


def synth(text: str, key: str) -> bytes:
    body = json.dumps({
        "input": {"text": text},
        "voice": {"languageCode": "ja-JP", "name": VOICE},
        "audioConfig": {
            "audioEncoding": "MP3",
            "speakingRate": RATE,
            "pitch": PITCH,
            "sampleRateHertz": 44100,
        },
    }).encode("utf-8")
    req = urllib.request.Request(f"{API}?key={key}", data=body,
                                 headers={"Content-Type": "application/json; charset=utf-8"})
    with urllib.request.urlopen(req, timeout=90) as r:
        resp = json.load(r)
    return base64.b64decode(resp["audioContent"])


def mp3_seconds(path: Path) -> float:
    tmp = path.with_suffix(".dur.wav")
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", str(path), str(tmp)], check=True)
    x, sr = sf.read(tmp)
    tmp.unlink(missing_ok=True)
    return len(x) / sr


def main() -> int:
    key = os.environ.get("GOOGLE_TTS_API_KEY")
    if not key:
        print("ERROR: set GOOGLE_TTS_API_KEY", file=sys.stderr)
        return 2
    data = json.loads(LINES.read_text(encoding="utf-8"))
    fps = int(data["fps"])
    lead_in = int(data["leadInFrames"])
    tail = int(data["tailFrames"])
    PUB.mkdir(parents=True, exist_ok=True)

    scenes = []
    for i, line in enumerate(data["lines"], start=1):
        sid, text = line["id"], line["text"]
        mp3_path = PUB / f"scene-{i:02d}-{sid}.mp3"
        audio = synth(text, key)
        mp3_path.write_bytes(audio)

        audio_sec = mp3_seconds(mp3_path)
        audio_frames = math.ceil(audio_sec * fps)
        dur_frames = lead_in + audio_frames + tail
        scenes.append({
            "id": sid, "index": i, "file": mp3_path.name,
            "audioSec": round(audio_sec, 3), "audioFrames": audio_frames,
            "leadInFrames": lead_in, "durationInFrames": dur_frames,
            "captions": make_captions(text, audio_frames, lead_in, fps),
        })
        print(f"  scene {i:02d} {sid:8s}  {audio_sec:5.2f}s  -> {dur_frames} frames")

    total = sum(s["durationInFrames"] for s in scenes)
    manifest = {"fps": fps, "leadInFrames": lead_in, "tailFrames": tail,
                "totalFrames": total, "totalSec": round(total / fps, 2),
                "voice": VOICE, "scenes": scenes}
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nVoice: {VOICE}   Total: {total} frames = {total / fps:.1f}s  ({len(scenes)} scenes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
