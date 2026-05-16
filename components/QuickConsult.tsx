"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function QuickConsult() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    setAnswer("");

    const form = event.currentTarget;
    const question = String(
      new FormData(form).get("question") ?? "",
    ).trim();

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const result = (await res.json()) as {
        ok: boolean;
        error?: string;
        answer?: string;
      };

      if (!res.ok || !result.ok || !result.answer) {
        setStatus("error");
        setError(
          result.error ??
            "回答の取得に失敗しました。お手数ですが、お電話でご連絡ください。",
        );
        return;
      }

      setStatus("success");
      setAnswer(result.answer);
    } catch {
      setStatus("error");
      setError(
        "通信エラーが発生しました。お手数ですが、お電話でご連絡ください。",
      );
    }
  }

  return (
    <>
      {status === "success" && answer && (
        <div className="alert success" role="status">
          AIによる簡単回答です。個別の詳しいご相談は、専門スタッフが承ります。
          <div className="reply-box">
            <div className="reply-head">介護相談窓口（AI）からの回答</div>
            {answer}
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="question">
            ご相談内容<span className="req">必須</span>
          </label>
          <textarea
            id="question"
            name="question"
            required
            minLength={5}
            maxLength={2000}
            placeholder="例：要介護認定はどこに申請すればいいですか？ 親が一人暮らしで物忘れが増えてきて心配です。"
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={status === "submitting"}
        >
          {status === "submitting"
            ? "回答を作成しています…"
            : "AIに相談する（無料・その場で回答）"}
        </button>

        <p className="form-note">
          AIによる一般的な簡単回答です。回答内容は参考情報であり、
          個別の状況に応じた正式なご相談は専門スタッフが承ります。
        </p>
      </form>
    </>
  );
}
