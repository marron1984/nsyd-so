import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ORG_NAME = "西淀川いいかいご相談ダイヤル（介護相談窓口）";
const ORG_TEL = "06-4400-9333";
const ORG_HOURS = "平日 9:00〜18:00";
const ORG_MAIL = "ek@aska-g.com";

const SYSTEM_PROMPT = `あなたは大阪市西淀川区の介護相談窓口「${ORG_NAME}」が提供する、介護のお悩みに一次回答する案内AIです。運営は株式会社 dhp ケアマネジメント、大阪府指定の介護保険事業者です。

ご家族の介護で悩む方からの質問に対し、その場で読める「簡単相談」の回答を日本語で作成します。

【回答の方針】
- まず質問してくださったことへのねぎらいと共感を、温かく丁寧な敬語で短く述べる。
- 質問内容に沿って、一般的でわかりやすい情報や考え方、次の一歩を具体的に案内する。
- 介護保険・要介護認定・地域包括支援センター・訪問介護等、公的な制度や相談先を必要に応じて紹介する。
- 全体で400〜600字程度。読みやすいよう自然な段落に分け、過度な箇条書きや装飾記号は使わない。

【厳守事項】
- これはAIによる一般的な簡単回答であり、個別の状況に応じた正式なご相談は専門スタッフが承る旨を、回答の最後に必ず添える。連絡先として電話 ${ORG_TEL}（受付時間 ${ORG_HOURS}）またはメール ${ORG_MAIL} を案内する。
- 医学的な診断、断定的な医療・法律アドバイス、確約・保証はしない。一般的で穏やかな案内にとどめる。
- 生命や安全に関わる緊急の危険がうかがえる場合は、ためらわず救急（119）や警察（110）、お近くの医療機関への連絡を最優先に勧める一文を冒頭に置く。
- 介護・高齢者支援・福祉と無関係の質問には回答せず、当窓口は介護のご相談窓口である旨を丁寧に伝える。
- 回答本文のみを出力し、件名や前置きの説明は書かない。`;

// 簡易レート制限（IP単位の固定ウィンドウ）。
// 注: サーバインスタンス単位のメモリ保持のため、スケール時は厳密ではない。
// 厳密な制限が必要な場合は Vercel KV / Upstash 等の共有ストアを利用する。
const RATE_LIMIT_MAX = 6; // ウィンドウあたりの最大リクエスト数
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10分

type RateEntry = { count: number; resetAt: number };
const rateStore = new Map<string, RateEntry>();

function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = rateStore.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    if (rateStore.size > 5000) {
      rateStore.forEach((value, key) => {
        if (now >= value.resetAt) rateStore.delete(key);
      });
    }
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `ご相談が短時間に集中しています。少し時間をおいてお試しいただくか、お電話（${ORG_TEL}）またはメール（${ORG_MAIL}）でご連絡ください。`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfter) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "リクエストの形式が正しくありません。" },
      { status: 400 },
    );
  }

  const question =
    typeof body === "object" &&
    body !== null &&
    typeof (body as Record<string, unknown>).question === "string"
      ? ((body as Record<string, unknown>).question as string).trim()
      : "";

  if (question.length < 5 || question.length > 2000) {
    return NextResponse.json(
      { ok: false, error: "ご相談内容をご確認ください（5〜2000文字）。" },
      { status: 400 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not configured.");
    return NextResponse.json(
      {
        ok: false,
        error: `現在AI相談を準備中です。お手数ですが、お電話（${ORG_TEL}）またはメール（${ORG_MAIL}）でご連絡ください。`,
      },
      { status: 503 },
    );
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 6000,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }],
    });

    const answer = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (!answer) {
      throw new Error("Empty response from model");
    }

    return NextResponse.json({ ok: true, answer });
  } catch (err) {
    console.error("AI consult failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: `回答の生成に失敗しました。お手数ですが、お電話（${ORG_TEL}）またはメール（${ORG_MAIL}）でご連絡ください。`,
      },
      { status: 502 },
    );
  }
}
