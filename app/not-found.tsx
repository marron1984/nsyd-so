import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main>
      <section className="legal">
        <div className="wrap">
          <h1 className="section-title">ページが見つかりません</h1>
          <p className="section-sub">
            お探しのページは移動または削除された可能性があります。
          </p>
          <p style={{ textAlign: "center" }}>
            <Link className="legal-back" href="/">
              トップページへ戻る
            </Link>
          </p>
          <p className="form-note" style={{ marginTop: "28px" }}>
            介護のご相談はお電話（06-4400-9333／平日 9:00〜18:00）でも
            承っています。
          </p>
        </div>
      </section>
    </main>
  );
}
