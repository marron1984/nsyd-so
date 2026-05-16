"use client";

import { useState, type FormEvent } from "react";

const MAIL_TO = "ek@aska-g.com";

export default function MailForm() {
  const [opened, setOpened] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const subject = `【介護のご相談】${name || "お問い合わせ"}`;
    const body = [
      "西淀川いいかいご相談ダイヤル ご担当者さま",
      "",
      "下記のとおりご相談いたします。",
      "",
      `お名前：${name}`,
      `メールアドレス：${email}`,
      `電話番号：${phone || "（未記入）"}`,
      "",
      "ご相談内容：",
      message,
      "",
    ].join("\n");

    const href = `mailto:${MAIL_TO}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setOpened(true);
  }

  return (
    <>
      {opened && (
        <div className="alert success" role="status">
          ご利用のメールソフトを起動しました。内容をご確認のうえ、そのまま送信してください。
          起動しない場合は、お手数ですが <strong>{MAIL_TO}</strong> 宛に直接ご送信ください。
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

        <button type="submit" className="submit-btn">
          メールソフトを起動して送信する
        </button>

        <p className="form-note">
          送信ボタンを押すと、ご利用のメールソフトが立ち上がり、{MAIL_TO} 宛の
          メールが作成されます。内容をご確認のうえ送信してください。担当者より
          手動でご返信いたします（ご相談は無料・秘密厳守です）。
        </p>
      </form>
    </>
  );
}
