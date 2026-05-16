"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [aiReply, setAiReply] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    setAiReply("");

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await res.json()) as {
        ok: boolean;
        error?: string;
        reply?: string;
      };

      if (!res.ok || !result.ok) {
        setStatus("error");
        setMessage(
          result.error ??
            "送信に失敗しました。お手数ですが、お電話でご連絡ください。",
        );
        return;
      }

      setStatus("success");
      setMessage(
        "ご相談を受け付けました。ご入力のメールアドレス宛に確認のご連絡をお送りしました。",
      );
      if (result.reply) setAiReply(result.reply);
      form.reset();
    } catch {
      setStatus("error");
      setMessage(
        "通信エラーが発生しました。お手数ですが、お電話でご連絡ください。",
      );
    }
  }

  return (
    <>
      {status === "success" && (
        <div className="alert success" role="status">
          {message}
          {aiReply && (
            <div className="reply-box">
              <div className="reply-head">介護相談窓口からの返信</div>
              {aiReply}
            </div>
          )}
        </div>
      )}

      {status === "error" && (
        <div className="alert error" role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">
            お名前<span className="req">必須</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="例：山田 花子"
          />
        </div>

        <div className="field">
          <label htmlFor="email">
            メールアドレス<span className="req">必須</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="例：hanako@example.com"
          />
        </div>

        <div className="field">
          <label htmlFor="phone">電話番号（任意）</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="例：090-1234-5678"
          />
        </div>

        <div className="field">
          <label htmlFor="message">
            ご相談内容<span className="req">必須</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            placeholder="ご家族の状況やお困りのことを、わかる範囲でお書きください。お話を伺うだけでも構いません。"
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "送信中…" : "相談内容を送信する"}
        </button>

        <p className="form-note">
          ご相談は無料・秘密厳守です。内容は守秘義務をもって取り扱います。
        </p>
      </form>
    </>
  );
}
