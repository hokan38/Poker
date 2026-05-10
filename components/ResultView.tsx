"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ExplainResult, ScenarioInfo } from "@/lib/types";

type Props = { result: ExplainResult };

export function ResultView({ result }: Props) {
  if (!result.ok) {
    return (
      <div className="card border-red-500/40 bg-red-950/40">
        <h2 className="text-lg font-bold text-red-200">解析できませんでした</h2>
        <p className="mt-2 text-sm text-red-100/90">{result.reason}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="card border-emerald-400/40 bg-emerald-900/20">
        <div className="label text-emerald-300">結論</div>
        <p className="mt-2 text-base font-semibold leading-relaxed text-emerald-50">
          {result.verdict}
        </p>
      </div>

      <ScenarioCard scenario={result.scenario} />

      {result.actions && result.actions.length > 0 && (
        <ActionsCard actions={result.actions} />
      )}

      <div className="card">
        <h2 className="mb-3 text-lg font-bold">解説</h2>
        <article className="markdown text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {result.explanation}
          </ReactMarkdown>
        </article>
      </div>

      {result.keyTakeaways && result.keyTakeaways.length > 0 && (
        <div className="card">
          <h2 className="mb-3 text-lg font-bold">覚えておくべきポイント</h2>
          <ul className="space-y-1.5 text-sm">
            {result.keyTakeaways.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-400">▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ScenarioCard({ scenario }: { scenario: ScenarioInfo }) {
  const rows: { label: string; value: string | null | undefined }[] = [
    { label: "フォーマット", value: scenario.format },
    { label: "ストリート", value: scenario.street },
    { label: "ヒーローのポジション", value: scenario.heroPosition },
    { label: "ヒーローのハンド", value: formatHand(scenario.heroHand) },
    { label: "ボード", value: formatHand(scenario.board) },
    {
      label: "ポット",
      value:
        typeof scenario.potBb === "number" ? `${scenario.potBb} bb` : null,
    },
    {
      label: "有効スタック",
      value:
        typeof scenario.effectiveBb === "number"
          ? `${scenario.effectiveBb} bb`
          : null,
    },
    { label: "アクション履歴", value: scenario.actionHistory },
    { label: "ディシジョンポイント", value: scenario.decisionPoint },
  ].filter((r) => r.value);

  if (rows.length === 0) return null;

  return (
    <div className="card">
      <h2 className="mb-3 text-lg font-bold">場面の整理</h2>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col">
            <dt className="label">{r.label}</dt>
            <dd className="text-sm text-zinc-100">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ActionsCard({
  actions,
}: {
  actions: { label: string; frequency?: number | null; ev?: number | null; best?: boolean }[];
}) {
  const max = Math.max(
    1,
    ...actions.map((a) => (typeof a.frequency === "number" ? a.frequency : 0))
  );
  return (
    <div className="card">
      <h2 className="mb-3 text-lg font-bold">アクション頻度 (GTO)</h2>
      <ul className="space-y-2">
        {actions.map((a, i) => (
          <li key={i} className="text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span
                className={`font-medium ${
                  a.best ? "text-emerald-300" : "text-zinc-200"
                }`}
              >
                {a.best && <span className="mr-1">★</span>}
                {a.label}
              </span>
              <span className="text-zinc-400">
                {typeof a.frequency === "number"
                  ? `${a.frequency.toFixed(0)}%`
                  : "—"}
                {typeof a.ev === "number"
                  ? ` · EV ${a.ev >= 0 ? "+" : ""}${a.ev.toFixed(2)}`
                  : ""}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded bg-white/10">
              <div
                className={`h-full ${
                  a.best ? "bg-emerald-400" : "bg-zinc-400"
                }`}
                style={{
                  width: `${
                    typeof a.frequency === "number"
                      ? (a.frequency / max) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SUIT_MAP: Record<string, string> = {
  h: "♥",
  d: "♦",
  c: "♣",
  s: "♠",
};

function formatHand(s: string | null | undefined): string | null {
  if (!s) return null;
  return s.replace(/([2-9TJQKA])([hdcs])/g, (_m, rank, suit) => {
    return rank + SUIT_MAP[suit];
  });
}
