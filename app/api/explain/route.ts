import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  SYSTEM_PROMPT,
  USER_PROMPT_PREFIX,
  USER_PROMPT_WITH_NOTE,
} from "@/lib/prompt";
import type { ExplainResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_MEDIA_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 10 * 1024 * 1024;

const DEFAULT_MODEL = "claude-sonnet-4-6";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        reason:
          "サーバーにANTHROPIC_API_KEYが設定されていません。.env.localを確認してください。",
      } satisfies ExplainResult,
      { status: 500 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        reason: "リクエストの読み込みに失敗しました。",
      } satisfies ExplainResult,
      { status: 400 }
    );
  }

  const file = form.get("image");
  const note = (form.get("note") as string | null)?.trim() ?? "";

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        ok: false,
        reason: "画像ファイルがアップロードされていません。",
      } satisfies ExplainResult,
      { status: 400 }
    );
  }

  if (!ALLOWED_MEDIA_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        ok: false,
        reason: `対応していない画像形式です (${file.type || "unknown"})。PNG / JPEG / WebP / GIF のいずれかをアップロードしてください。`,
      } satisfies ExplainResult,
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        reason: `画像サイズが大きすぎます (${(file.size / 1024 / 1024).toFixed(1)}MB)。10MB以下にしてください。`,
      } satisfies ExplainResult,
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  let raw: string;
  try {
    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: file.type as
                  | "image/png"
                  | "image/jpeg"
                  | "image/webp"
                  | "image/gif",
                data: base64,
              },
            },
            {
              type: "text",
              text: note ? USER_PROMPT_WITH_NOTE(note) : USER_PROMPT_PREFIX,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    raw = textBlock && textBlock.type === "text" ? textBlock.text : "";
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        reason: `Claude APIの呼び出しに失敗しました: ${message}`,
      } satisfies ExplainResult,
      { status: 502 }
    );
  }

  const parsed = parseJsonResponse(raw);
  if (!parsed) {
    return NextResponse.json(
      {
        ok: false,
        reason:
          "モデルの応答をJSONとして解釈できませんでした。もう一度試してください。",
      } satisfies ExplainResult,
      { status: 502 }
    );
  }

  return NextResponse.json(parsed satisfies ExplainResult);
}

function parseJsonResponse(raw: string): ExplainResult | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  const candidates: string[] = [trimmed];

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) candidates.push(fenceMatch[1].trim());

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    candidates.push(trimmed.slice(firstBrace, lastBrace + 1));
  }

  for (const c of candidates) {
    try {
      const obj = JSON.parse(c);
      if (obj && typeof obj === "object" && "ok" in obj) {
        return obj as ExplainResult;
      }
    } catch {
      // try next
    }
  }
  return null;
}
