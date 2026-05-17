import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "西淀川いいかいご相談ダイヤルの個人情報の取り扱いについて。守秘義務、メール相談時の情報の扱い、Cookie・アクセス解析、お問い合わせ窓口を記載します。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="legal">
        <div className="wrap">
          <h1 className="section-title">プライバシーポリシー</h1>
          <p className="section-sub">
            ご相談者の個人情報を適切に取り扱うための方針です。
          </p>

          <h2 className="legal-h2">1. 基本方針</h2>
          <p>
            西淀川いいかいご相談ダイヤル（運営：株式会社 dhp
            ケアマネジメント）は、ご相談者の個人情報の重要性を認識し、
            関係法令を遵守して適切に取り扱います。ご相談内容は守秘義務を
            もって取り扱い、秘密を厳守します。
          </p>

          <h2 className="legal-h2">2. メールでのご相談について</h2>
          <p>
            本サイトのメール相談は、お客様ご自身のメールソフトを起動して
            送信する方式です。本ウェブサイトのサーバー上に相談内容や
            個人情報を保存・収集することはありません。送信後の情報は、
            ご相談対応の目的のみに使用し、ご本人の同意なく第三者へ
            提供しません。
          </p>

          <h2 className="legal-h2">3. 利用目的</h2>
          <p>
            お預かりした情報は、ご相談への対応、必要な公的機関等のご案内、
            ご連絡のために利用します。これ以外の目的には利用しません。
          </p>

          <h2 className="legal-h2">4. Cookie・アクセス解析</h2>
          <p>
            本サイトは、行動追跡を目的とした Cookie
            や広告トラッキングを使用していません。
          </p>

          <h2 className="legal-h2">5. お問い合わせ窓口</h2>
          <p>
            個人情報の取り扱いに関するお問い合わせは、電話 06-4400-9333
            （平日 9:00〜18:00）またはメール ek@aska-g.com まで
            ご連絡ください。
          </p>

          <h2 className="legal-h2">6. 改定</h2>
          <p>
            本ポリシーは、必要に応じて改定することがあります。改定後の
            内容は本ページに掲載した時点から適用されます。
          </p>

          <p className="legal-back-wrap">
            <Link className="legal-back" href="/">
              トップページへ戻る
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
