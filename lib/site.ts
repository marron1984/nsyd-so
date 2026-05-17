export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nishiyodo.cafe"
).replace(/\/$/, "");

export const ORG = {
  name: "西淀川いいかいご相談ダイヤル",
  legalName: "株式会社 dhp ケアマネジメント",
  alternateName: "いいかいご相談ダイヤル（介護相談窓口）",
  tel: "06-4400-9333",
  telE164: "+81-6-4400-9333",
  email: "ek@aska-g.com",
  postalCode: "555-0024",
  region: "大阪府",
  locality: "大阪市西淀川区",
  street: "野里 1-32-14 パシフィック塚本 610",
  hours: "平日 9:00〜18:00",
} as const;
