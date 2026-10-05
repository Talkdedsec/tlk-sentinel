import type { Lang, LocalizedText } from "./events.js";

export function resolveText(text: string | LocalizedText, lang: Lang): string {
  if (typeof text === "string") return text;
  return text[lang] ?? text.en ?? text.tr;
}

type Key =
  | "signatureOk"
  | "signatureTampered"
  | "alertBan"
  | "alertWarn"
  | "blocked"
  | "startProfile"
  | "sourceBound"
  | "noSource"
  | "integrityWatch"
  | "banAction"
  | "unbanAction"
  | "dryPrefix"
  | "behavioralAnomaly";

const CATALOG: Record<Key, LocalizedText> = {
  signatureOk: { en: "signature ok", tr: "imza doğrulandı" },
  signatureTampered: { en: "SIGNATURE TAMPERED", tr: "İMZA DEĞİŞTİRİLMİŞ" },
  alertBan: { en: "BAN", tr: "BAN" },
  alertWarn: { en: "WARN", tr: "UYARI" },
  blocked: { en: "blocked", tr: "engellendi" },
  startProfile: { en: "profile", tr: "profil" },
  sourceBound: { en: "source bound", tr: "kaynak bağlandı" },
  noSource: { en: "no log source configured", tr: "hiçbir log kaynağı ayarlı değil" },
  integrityWatch: { en: "integrity watch", tr: "bütünlük izleme" },
  banAction: { en: "ban", tr: "ban" },
  unbanAction: { en: "unban", tr: "ban kalktı" },
  dryPrefix: { en: "[dry-run]", tr: "[deneme]" },
  behavioralAnomaly: { en: "Behavioral anomaly", tr: "Davranışsal anomali" },
};

export function t(key: Key, lang: Lang): string {
  return CATALOG[key][lang];
}
