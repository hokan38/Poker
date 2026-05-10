"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

type Props = {
  file: File | null;
  previewUrl: string | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
};

export function UploadCard({ file, previewUrl, onFileChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const f = item.getAsFile();
          if (f) {
            onFileChange(f);
            e.preventDefault();
            break;
          }
        }
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [disabled, onFileChange]);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) {
      onFileChange(f);
    }
  }

  function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    onFileChange(f);
  }

  return (
    <div className="card">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold">1. スクリーンショット</h2>
        {file && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onFileChange(null)}
            disabled={disabled}
          >
            削除
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-zinc-400">
        GTO Wizardのトレーニング画面をスクショして、
        ここにドラッグ&ドロップ、貼り付け(Ctrl/Cmd+V)、またはファイル選択。
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`mt-4 flex min-h-[220px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition ${
          dragOver
            ? "border-emerald-400 bg-emerald-500/10"
            : "border-white/20 hover:border-white/40"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="screenshot preview"
            className="max-h-[420px] rounded-md object-contain"
          />
        ) : (
          <div className="px-6 py-8 text-center text-sm text-zinc-400">
            <div className="text-2xl">📋</div>
            <div className="mt-2 font-medium text-zinc-200">
              ここにスクショをドロップ or 貼り付け
            </div>
            <div className="mt-1 text-xs">
              対応形式: PNG / JPEG / WebP / GIF (最大10MB)
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleSelect}
          disabled={disabled}
        />
      </div>

      {file && (
        <div className="mt-3 text-xs text-zinc-400">
          {file.name} · {(file.size / 1024).toFixed(0)} KB · {file.type}
        </div>
      )}
    </div>
  );
}
