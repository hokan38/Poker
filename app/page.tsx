"use client";

import { FormEvent, useEffect, useState } from "react";
import { UploadCard } from "@/components/UploadCard";
import { ResultView } from "@/components/ResultView";
import type { ExplainResult } from "@/lib/types";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("image", file);
      if (note.trim()) fd.append("note", note.trim());

      const res = await fetch("/api/explain", { method: "POST", body: fd });
      const data = (await res.json()) as ExplainResult;
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`通信エラー: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          GTO Wizard 解説くん
        </h1>
        <p className="mt-2 text-sm text-zinc-300">
          GTO Wizardのトレーニング画面をスクショしてアップすると、
          なぜそのプレイが正解なのかをClaudeが日本語で解説します。
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <UploadCard
          file={file}
          previewUrl={previewUrl}
          onFileChange={setFile}
          disabled={loading}
        />

        <div className="card">
          <label htmlFor="note" className="text-lg font-bold">
            2. 補足 (任意)
          </label>
          <p className="mt-1 text-sm text-zinc-400">
            「私はFoldしましたが何が間違っていますか？」
            「BTNからのオープンに対するBBの守り方を学びたい」など。
          </p>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={loading}
            rows={3}
            placeholder="例: 私は3betしたが、Callが正解でした。なぜ？"
            className="mt-3 w-full resize-y rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="btn-primary"
            disabled={!file || loading}
          >
            {loading ? "解析中…" : "解説する"}
          </button>
          {loading && (
            <span className="text-sm text-zinc-400">
              Claudeがスクリーンショットを読んでいます (10〜30秒)
            </span>
          )}
        </div>
      </form>

      {error && (
        <div className="card mt-8 border-red-500/40 bg-red-950/40 text-sm text-red-100">
          {error}
        </div>
      )}

      {result && (
        <section className="mt-8">
          <ResultView result={result} />
        </section>
      )}

      <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-zinc-500">
        <p>
          このツールはGTO Wizardの公式機能ではありません。
          Claudeは画面のテキストとレンジ表示を読み取って解説しますが、
          最終的な判断はソルバーの公式出力とご自身でクロスチェックしてください。
        </p>
      </footer>
    </main>
  );
}
