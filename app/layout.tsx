import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "西淀川 いいかいご相談ダイヤル｜ご家族の介護のご相談窓口",
  description:
    "ご家族の介護でお困りの方へ。介護の専門スタッフが無料・秘密厳守でご相談をお伺いします。お電話・メールでお気軽にご相談ください。大阪府指定 介護保険事業者。",
  openGraph: {
    title: "西淀川 いいかいご相談ダイヤル",
    description:
      "ご家族の介護でお困りの方へ。介護の専門スタッフが無料・秘密厳守でご相談をお伺いします。",
    locale: "ja_JP",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#5b8a3c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
