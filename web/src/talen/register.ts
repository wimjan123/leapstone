/**
 * De talen van het spel. Een taal erbij: een bestand `talen/<code>.ts` (zoals `nl.ts`) en één regel hieronder.
 * De schermen veranderen niet. Een taal wordt pas geladen als een Speler hem nodig heeft (behalve het Engels).
 * `naam`: de taal in zichzelf, zoals de Speler hem in Account ziet. `rtl`: schrijft van rechts naar links.
 * `alias`: andere taalcodes van de telefoon die deze tabel gebruiken (bijvoorbeeld `nb` voor `no`).
 */
export type TaalInfo = {
  naam: string;
  rtl?: boolean;
  alias?: string[];
  laad: () => Promise<{ default: Record<string, string>; woorden: Record<string, string> }>;
};

export const TALEN: Record<string, TaalInfo> = {
  en: { naam: "English", laad: () => import("./en") },
  nl: { naam: "Nederlands", laad: () => import("./nl") },
  de: { naam: "Deutsch", laad: () => import("./de") },
  ar: { naam: "العربية", rtl: true, laad: () => import("./ar") },
  he: { naam: "עברית", rtl: true, alias: ["iw"], laad: () => import("./he") },
  ur: { naam: "اردو", rtl: true, laad: () => import("./ur") },
  ca: { naam: "Català", laad: () => import("./ca") },
  cs: { naam: "Čeština", laad: () => import("./cs") },
  da: { naam: "Dansk", laad: () => import("./da") },
  el: { naam: "Ελληνικά", laad: () => import("./el") },
  es: { naam: "Español", laad: () => import("./es") },
  fi: { naam: "Suomi", laad: () => import("./fi") },
  fr: { naam: "Français", laad: () => import("./fr") },
  hr: { naam: "Hrvatski", laad: () => import("./hr") },
  hu: { naam: "Magyar", laad: () => import("./hu") },
  it: { naam: "Italiano", laad: () => import("./it") },
  no: { naam: "Norsk", alias: ["nb", "nn"], laad: () => import("./no") },
  pl: { naam: "Polski", laad: () => import("./pl") },
  pt: { naam: "Português", laad: () => import("./pt") },
  ro: { naam: "Română", laad: () => import("./ro") },
  ru: { naam: "Русский", laad: () => import("./ru") },
  sk: { naam: "Slovenčina", laad: () => import("./sk") },
  sl: { naam: "Slovenščina", laad: () => import("./sl") },
  sv: { naam: "Svenska", laad: () => import("./sv") },
  tr: { naam: "Türkçe", laad: () => import("./tr") },
  uk: { naam: "Українська", laad: () => import("./uk") },
  bn: { naam: "বাংলা", laad: () => import("./bn") },
  gu: { naam: "ગુજરાતી", laad: () => import("./gu") },
  hi: { naam: "हिन्दी", laad: () => import("./hi") },
  id: { naam: "Bahasa Indonesia", alias: ["in"], laad: () => import("./id") },
  ja: { naam: "日本語", laad: () => import("./ja") },
  kn: { naam: "ಕನ್ನಡ", laad: () => import("./kn") },
  ko: { naam: "한국어", laad: () => import("./ko") },
  ml: { naam: "മലയാളം", laad: () => import("./ml") },
  mr: { naam: "मराठी", laad: () => import("./mr") },
  ms: { naam: "Bahasa Melayu", laad: () => import("./ms") },
  or: { naam: "ଓଡ଼ିଆ", laad: () => import("./or") },
  pa: { naam: "ਪੰਜਾਬੀ", laad: () => import("./pa") },
  ta: { naam: "தமிழ்", laad: () => import("./ta") },
  te: { naam: "తెలుగు", laad: () => import("./te") },
  th: { naam: "ไทย", laad: () => import("./th") },
  vi: { naam: "Tiếng Việt", laad: () => import("./vi") },
  "zh-hans": { naam: "简体中文", alias: ["zh", "zh-cn", "zh-sg"], laad: () => import("./zh-hans") },
};
