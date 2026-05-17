import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "運営者情報",
  description:
    "西淀川いいかいご相談ダイヤルの運営者情報。運営法人、所在地、連絡先、受付時間、対応スタッフ（看護師・介護福祉士）、事業者指定について。",
  alternates: { canonical: "/operator" },
};

const rows: [string, string][] = [
  ["名称", "西淀川いいかいご相談ダイヤル（介護相談窓口）"],
  ["運営法人", "株式会社 dhp ケアマネジメント"],
  ["事業者指定", "大阪府指定 介護保険事業者"],
  ["所在地", "〒555-0024　大阪府大阪市西淀川区野里 1-32-14 パシフィック塚本 610"],
  ["電話番号", "06-4400-9333"],
  ["メール", "ek@aska-g.com"],
  ["受付時間", "平日 9:00〜18:00（電話）／メールは24時間受付・手動返信"],
  ["対応スタッフ", "介護の現場に長年携わってきた看護師・介護福祉士"],
  ["アクセス", "JR 塚本駅・JR 御幣島駅・阪神姫島駅 各駅より徒歩 10 分圏内"],
];

export default function OperatorPage() {
  return (
    <main>
      <section className="legal">
        <div className="wrap">
          <h1 className="section-title">運営者情報</h1>
          <p className="section-sub">
            安心してご相談いただけるよう、運営体制を公開しています。
          </p>

          <dl className="legal-table">
            {rows.map(([k, v]) => (
              <div className="legal-row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <h2 className="legal-h2">事業内容</h2>
          <p>
            介護に関する総合相談窓口として、認知症のご家族への接し方、介護保険・
            要介護認定の流れ、訪問介護・訪問看護のご利用、一人暮らしのご親族の
            見守り、住まいの選び方などについて、無料・秘密厳守でご相談を
            お伺いします。必要に応じて地域包括支援センター等の公的機関も
            ご案内します。
          </p>

          <h2 className="legal-h2">相談方針</h2>
          <p>
            ご相談は無料です。営業目的のご連絡は一切いたしません。ご相談内容は
            守秘義務をもって取り扱います。お話を伺うだけでも構いません。
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
