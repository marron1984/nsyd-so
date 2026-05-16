import QuickConsult from "@/components/QuickConsult";
import MailForm from "@/components/MailForm";
import Image from "next/image";
import heroImg from "@/public/hero.png";

const worries = [
  "同居の家族が認知症で、対応に困っている",
  "近所の高齢の方の様子が気になる",
  "親が一人暮らしで、夜中の徘徊が心配",
  "どこに相談すればいいか、わからない",
  "一人で抱え込んで、誰にも話せていない",
];

const steps = [
  {
    num: "STEP 1",
    title: "お電話・メール",
    body: "お気軽にご連絡ください。お話をじっくり伺います。",
  },
  {
    num: "STEP 2",
    title: "ご案内",
    body: "公的機関のご紹介や、訪問でのご相談も可能です。",
  },
  {
    num: "STEP 3",
    title: "解決へ",
    body: "ご家族に合った形で、最適な解決策をご提案します。",
  },
];

const services = [
  "認知症のご家族への接し方、徘徊や物忘れのお悩み",
  "介護保険の使い方、要介護認定の流れ",
  "訪問介護・訪問看護のご利用について",
  "一人暮らしのご親族の見守りについて",
  "ご家族の住まい、サポート付き住宅の選び方",
];

export default function Page() {
  return (
    <>
      <header className="hero">
        <div className="wrap hero-inner">
          <span className="region">西淀川</span>
          <h1>いいかいご相談ダイヤル</h1>
          <p className="lead">～ ご家族の介護で、お困りのあなたへ ～</p>
          <div className="hero-badge">
            どんなことでもお気軽にご相談ください
          </div>
          <div className="hero-photo">
            <Image
              src={heroImg}
              alt="車いすの高齢の女性と、寄り添って笑顔で話す介護スタッフ"
              priority
              placeholder="blur"
              sizes="(max-width: 680px) 100vw, 640px"
            />
          </div>
        </div>
      </header>

      <section className="worry">
        <div className="wrap">
          <div className="center">
            <span className="ribbon">こんなこと、ありませんか？</span>
          </div>
          <ul className="worry-list">
            {worries.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>

          <div className="worry-message">
            <h3>
              そのお悩み、
              <br />
              私たちにお話しください。
            </h3>
            <p>
              介護のことで困ったとき、最初にどこへ相談すればいいのか分からず、
              一人で悩み続けてしまう方が、本当に多くいらっしゃいます。
            </p>
            <p style={{ marginTop: "14px" }}>
              私たちは、介護の専門スタッフがご相談を
              <span className="hl">無料</span>でお伺いし、必要に応じて、
              <span className="hl">地域包括支援センター等の公的機関</span>
              もご案内します。
            </p>
          </div>
        </div>
      </section>

      <section className="phone-cta" id="tel">
        <div className="wrap">
          <div className="phone-card">
            <span className="tag">お電話ください</span>
            <div>
              <a className="phone-number" href="tel:0644009333">
                06-4400-9333
              </a>
            </div>
            <p className="phone-hours">受付時間　平日 9:00 〜 18:00</p>
            <p className="phone-note">※ お話を伺うだけでも構いません。</p>
            <div className="phone-pills">
              <span>相談無料</span>
              <span>秘密厳守</span>
              <span>営業目的の電話は一切いたしません</span>
              <span>守秘義務をもって取り扱います</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2 className="section-title">ご相談から、その先まで。</h2>
          <p className="section-sub">
            地域に根ざした介護のプロが、ご家族に寄り添います。
          </p>
          <div className="steps-grid">
            {steps.map((s) => (
              <div className="step" key={s.num}>
                <div className="num">{s.num.replace("STEP ", "")}</div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services">
        <div className="wrap">
          <div className="center">
            <span className="ribbon">私たちがご相談に応じられること</span>
          </div>
          <ul className="services-list">
            {services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="contact" id="ai">
        <div className="wrap">
          <h2 className="section-title pink">AIに簡単相談（無料・その場で回答）</h2>
          <p className="section-sub">
            「まず何から始めれば？」そんな疑問に、AIがその場でお答えします。
            <br />
            個別の詳しいご相談は、専門スタッフが承ります。
          </p>
          <div className="contact-card">
            <QuickConsult />
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="wrap">
          <h2 className="section-title">メールでのご相談</h2>
          <p className="section-sub">
            じっくりご相談されたい方は、メールでどうぞ。
            <br />
            担当の専門スタッフが内容を確認し、手動でご返信いたします。
          </p>
          <div className="contact-card">
            <MailForm />
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap">
          <p>一人で抱え込まないでください。</p>
          <h2>まずは、ご相談を。</h2>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p className="org">
            いいかいご 相談ダイヤル（介護相談窓口）　株式会社 dhp
            ケアマネジメント
          </p>
          <p>〒555-0024　大阪府大阪市西淀川区野里 1-32-14 パシフィック塚本 610</p>
          <p>電話：06-4400-9333　／　メール：ek@aska-g.com</p>
          <p>
            JR 塚本駅・JR 御幣島駅・阪神姫島駅　各駅より徒歩 10 分圏内
          </p>
          <div className="cert">大阪府指定 介護保険事業者</div>
        </div>
      </footer>
    </>
  );
}
