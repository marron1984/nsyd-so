import type { Metadata, Viewport } from "next";
import { SITE_URL, ORG } from "@/lib/site";
import "./globals.css";

const title =
  "大阪市西淀川区の介護相談｜西淀川いいかいご相談ダイヤル（無料・秘密厳守）";
const description =
  "大阪市西淀川区の介護相談窓口。介護の現場に長年携わってきた看護師・介護福祉士が、認知症・介護保険・要介護認定・訪問介護・一人暮らしの見守りなどのお悩みを無料・秘密厳守でお伺いします。お電話（06-4400-9333）・メールでお気軽にご相談ください。大阪府指定 介護保険事業者。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s｜西淀川いいかいご相談ダイヤル",
  },
  description,
  applicationName: ORG.name,
  keywords: [
    "介護相談",
    "西淀川区 介護",
    "大阪市 介護相談",
    "認知症 相談",
    "介護保険",
    "要介護認定",
    "訪問介護",
    "地域包括支援センター",
    "高齢者 見守り",
    "ケアマネジメント",
    "介護 無料相談",
  ],
  authors: [{ name: ORG.legalName }],
  creator: ORG.legalName,
  publisher: ORG.legalName,
  alternates: { canonical: "/" },
  category: "介護・福祉",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : {},
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: ORG.name,
    title,
    description,
    images: [
      {
        url: "/hero.png",
        width: 1402,
        height: 1122,
        alt: "車いすの高齢の女性と、寄り添って笑顔で話す介護スタッフ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/hero.png"],
  },
  formatDetection: { telephone: true, email: true, address: true },
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
