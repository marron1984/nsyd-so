import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ORG_NAME = "西淀川いいかいご相談ダイヤル（介護相談窓口）";
const ORG_TEL = "06-4400-9333";
const ORG_HOURS = "平日 9:00〜18:00";

function validate(body: unknown): { ok: true; data: Payload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "リクエストの形式が正しくありません。" };
  }
  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (!name || name.length > 100) {
    return { ok: false, error: "お名前をご確認ください。" };
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return { ok: false, error: "メールアドレスをご確認ください。" };
  }
  if (phone.length > 30) {
    return { ok: false, error: "電話番号をご確認ください。" };
  }
  if (!message || message.length < 5 || message.length > 4000) {
    return { ok: false, error: "ご相談内容をご確認ください（5文字以上）。" };
  }
  return { ok: true, data: { name, email, phone, message } };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SYSTEM_PROMPT = `あなたは大阪市西淀川区の介護相談窓口「${ORG_NAME}」のメール対応スタッフです。運営は株式会社 dhp ケアマネジメント、大阪府指定の介護保険事業者です。

ご家族の介護で悩む相談者から届いたメールに対し、最初の受付確認の返信文を日本語で作成します。

【返信文の方針】
- 相談を寄せてくださったことへの感謝と、おひとりで抱え込まずご連絡くださったことへのねぎらいを、温かく丁寧な敬語で伝える。
- 相談者が書いた状況に具体的に触れ、気持ちに寄り添う（決めつけず、共感的に）。
- ご相談は無料・秘密厳守であること、内容は守秘義務をもって取り扱うことを伝える。
- 担当の介護専門スタッフが改めてご連絡する旨を伝える。
- お急ぎの場合や直接話したい場合の連絡先として、電話 ${ORG_TEL}（受付時間 ${ORG_HOURS}）を案内する。
- 必要に応じて地域包括支援センター等の公的機関も案内できることに軽く触れてよい。

【厳守事項】
- 医学的な診断、断定的な医療・法律アドバイス、確約・保証はしない。一般的で穏やかな案内にとどめる。
- 生命や安全に関わる緊急の危険がうかがえる場合は、ためらわず救急（119）や警察（110）、お近くの医療機関への連絡を最優先に勧める一文を添える。
- 過度に長くせず、本文はおおむね250〜400字程度。装飾記号や箇条書きは使わず、自然な手紙文にする。
- 返信文の本文のみを出力し、件名・前置き・補足説明は書かない。署名は本文末尾に改行して「${ORG_NAME}\n株式会社 dhp ケアマネジメント」と記す。`;

function fallbackReply(name: string): string {
  return `${name} 様

このたびはご相談をお寄せいただき、ありがとうございます。おひとりで抱え込まず、ご連絡くださったことに感謝申し上げます。

いただいた内容は担当の介護専門スタッフが確認し、改めてご連絡いたします。ご相談は無料・秘密厳守で、内容は守秘義務をもって取り扱いますのでご安心ください。

お急ぎの場合や直接お話を伺ったほうがよいと思われる場合は、お電話（${ORG_TEL}　受付時間 ${ORG_HOURS}）でもお気軽にご連絡ください。

${ORG_NAME}
株式会社 dhp ケアマネジメント`;
}

async function generateReply(data: Payload): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const aiEnabled = process.env.AI_AUTO_REPLY_ENABLED !== "false";

  if (!apiKey || !aiEnabled) {
    return fallbackReply(data.name);
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 6000,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `次の介護相談メールに対する受付確認の返信文を作成してください。

お名前: ${data.name}
メールアドレス: ${data.email}
電話番号: ${data.phone || "（未記入）"}

ご相談内容:
${data.message}`,
        },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return text || fallbackReply(data.name);
  } catch (err) {
    console.error("AI reply generation failed:", err);
    return fallbackReply(data.name);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "リクエストの形式が正しくありません。" },
      { status: 400 },
    );
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  const data = result.data;

  const resendKey = process.env.RESEND_API_KEY;
  const mailFrom = process.env.MAIL_FROM;
  const mailTo = process.env.MAIL_TO;

  if (!resendKey || !mailFrom || !mailTo) {
    console.error("Mail configuration is missing (RESEND_API_KEY / MAIL_FROM / MAIL_TO).");
    return NextResponse.json(
      {
        ok: false,
        error:
          "現在メール受付を準備中です。お手数ですが、お電話（" +
          ORG_TEL +
          "）でご連絡ください。",
      },
      { status: 503 },
    );
  }

  const reply = await generateReply(data);
  const resend = new Resend(resendKey);

  try {
    const userMail = await resend.emails.send({
      from: mailFrom,
      to: data.email,
      replyTo: mailTo.split(",").map((s) => s.trim()),
      subject: `【${ORG_NAME}】ご相談を受け付けました`,
      text: reply,
    });
    if (userMail.error) throw userMail.error;
  } catch (err) {
    console.error("Failed to send confirmation email to user:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "確認メールの送信に失敗しました。お手数ですが、お電話（" +
          ORG_TEL +
          "）でご連絡ください。",
      },
      { status: 502 },
    );
  }

  try {
    const staffHtml = `
      <h2>新しい介護相談メール</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
        <tr><td><b>お名前</b></td><td>${escapeHtml(data.name)}</td></tr>
        <tr><td><b>メール</b></td><td>${escapeHtml(data.email)}</td></tr>
        <tr><td><b>電話番号</b></td><td>${escapeHtml(data.phone || "（未記入）")}</td></tr>
      </table>
      <h3>ご相談内容</h3>
      <p style="white-space:pre-wrap;font-size:14px">${escapeHtml(data.message)}</p>
      <hr/>
      <h3>自動返信（AI 下書き・相談者へ送信済み）</h3>
      <p style="white-space:pre-wrap;font-size:14px;color:#555">${escapeHtml(reply)}</p>`;

    const staffMail = await resend.emails.send({
      from: mailFrom,
      to: mailTo.split(",").map((s) => s.trim()),
      replyTo: data.email,
      subject: `【相談受付】${data.name} 様より`,
      html: staffHtml,
    });
    if (staffMail.error) throw staffMail.error;
  } catch (err) {
    // 相談者への確認メールは送信済みのため、ここは記録のみで成功扱いとする。
    console.error("Failed to send staff notification email:", err);
  }

  return NextResponse.json({ ok: true, reply });
}
