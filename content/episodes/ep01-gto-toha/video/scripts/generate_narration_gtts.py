#!/usr/bin/env python3
"""
Google Cloud Text-to-Speech でナレーションを生成する（自然な日本語ニューラル音声）。

- narration/lines.json を読み、各シーンの音声を合成
- public/narration/scene-XX.mp3 を出力（Remotion の staticFile 用）
- src/manifest.json を出力（尺・字幕・ビート）

ビート同期（重要）:
  各シーンの主要な「見せ場」を、ナレーションが実際にその語を発する瞬間に合わせるため、
  SSML の <mark> を該当フレーズ直前に挿入し、enableTimePointing で実測タイムを取得する。
  取得したタイムを frame（= leadIn + time*fps）に変換し、manifest の scenes[].beats に格納。
  scenes.tsx 側はこの beats フレームにアニメの発火を合わせる（無い場合は従来の割合にフォールバック）。

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

# timepointing（SSML mark の実測タイム）は v1beta1 でのみ利用可能
API = "https://texttospeech.googleapis.com/v1beta1/text:synthesize"
VOICE = os.environ.get("TTS_VOICE", "ja-JP-Neural2-C")
RATE = float(os.environ.get("TTS_RATE", "1.0"))
PITCH = float(os.environ.get("TTS_PITCH", "0.0"))

# 各シーンの見せ場を、ナレーションのどのフレーズに合わせるか。
# (beat名, ナレーション本文中の一致文字列)。最初の一致位置に <mark> を置く。
# scenes.tsx はこの beat名のフレームでアニメを発火する。
BEATS = {
    "hook": [("unluck", "運で勝っているのでは"), ("senryaku", "明確な戦略")],
    "def": [("letters", "ゲーム・セオリー・オプティマル"), ("optimal", "最適な戦略")],
    "janken": [("kinko", "均衡です")],
    "jankenExploit": [("youbias", "グーを多めに"), ("oppraise", "パーを増やして"),
                      ("exploited", "搾取され")],
    "river": [("board", "ボードは"), ("danger", "スペードのフラッシュ"),
              ("hero", "あなたの手札は"), ("toppair", "トップペアです"),
              ("pot", "ポットと同じ金額")],
    "potodds": [("s1", "ポットには100"), ("s2", "相手が同じ100"),
                ("s3", "あなたは100ビービーを払って"), ("eq", "受け取るのは合わせて300"),
                ("pct", "33パーセント")],
    "ratio": [("win", "相手のブラフには勝ち"), ("lose", "ストレートやフラッシュには負け"),
              ("bridge", "勝てる割合は、相手が"), ("pct", "33パーセントを超える")],
    "indiff": [("mix", "二対一で混ぜて"), ("result", "ちょうど三回に一回"),
               ("balance", "コールがトントン"), ("indifferent", "無差別")],
    "verdict": [("same", "まったく同じ価値"), ("opts", "二対一より多いと感じたら"),
                ("decide", "あなたの答えを決めるのは")],
    "ranges": [("fan", "ありえる手の範囲")],
    "exploit": [("gto", "誰にも搾取されない"), ("expl", "エクスプロイト、搾取")],
    "foundation": [("base", "は、土台"), ("drop", "その上に乗せる")],
    "solved": [("y2015", "二千十五年"), ("y2017", "二千十七年"),
               ("y2019", "二千十九年"), ("lang", "共通言語")],
    "summary": [("i1", "ひとつ"), ("i2", "ふたつ"), ("i3", "みっつ")],
}


def xml_escape(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_ssml(text: str, beats) -> str:
    marks = []
    for name, needle in beats:
        pos = text.find(needle)
        if pos < 0:
            print(f"    WARN beat {name!r}: needle {needle!r} not found", file=sys.stderr)
            continue
        marks.append((pos, name))
    marks.sort(key=lambda m: m[0])
    out, last = [], 0
    for pos, name in marks:
        out.append(xml_escape(text[last:pos]))
        out.append(f'<mark name="{name}"/>')
        last = pos
    out.append(xml_escape(text[last:]))
    return "<speak>" + "".join(out) + "</speak>"


def synth(text: str, key: str, beats):
    inp = {"ssml": build_ssml(text, beats)} if beats else {"text": text}
    payload = {
        "input": inp,
        "voice": {"languageCode": "ja-JP", "name": VOICE},
        "audioConfig": {
            "audioEncoding": "MP3",
            "speakingRate": RATE,
            "pitch": PITCH,
            "sampleRateHertz": 44100,
        },
    }
    if beats:
        payload["enableTimePointing"] = ["SSML_MARK"]
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(f"{API}?key={key}", data=body,
                                 headers={"Content-Type": "application/json; charset=utf-8"})
    with urllib.request.urlopen(req, timeout=90) as r:
        resp = json.load(r)
    audio = base64.b64decode(resp["audioContent"])
    timepoints = resp.get("timepoints", [])
    return audio, timepoints


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
        audio, timepoints = synth(text, key, BEATS.get(sid))
        mp3_path.write_bytes(audio)

        audio_sec = mp3_seconds(mp3_path)
        audio_frames = math.ceil(audio_sec * fps)
        dur_frames = lead_in + audio_frames + tail
        beats = {tp["markName"]: lead_in + int(round(tp["timeSeconds"] * fps))
                 for tp in timepoints}
        scenes.append({
            "id": sid, "index": i, "file": mp3_path.name,
            "audioSec": round(audio_sec, 3), "audioFrames": audio_frames,
            "leadInFrames": lead_in, "durationInFrames": dur_frames,
            "beats": beats,
            "captions": make_captions(text, audio_frames, lead_in, fps),
        })
        bstr = "  ".join(f"{k}={v}" for k, v in beats.items())
        print(f"  scene {i:02d} {sid:14s} {audio_sec:5.2f}s -> {dur_frames}f   beats: {bstr}")

    total = sum(s["durationInFrames"] for s in scenes)
    manifest = {"fps": fps, "leadInFrames": lead_in, "tailFrames": tail,
                "totalFrames": total, "totalSec": round(total / fps, 2),
                "voice": VOICE, "scenes": scenes}
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nVoice: {VOICE}   Total: {total} frames = {total / fps:.1f}s  ({len(scenes)} scenes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
