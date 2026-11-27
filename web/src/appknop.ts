import { IS_APP } from "./omgeving";

/**
 * Staat de App Store-knop in beeld? Alleen in de browser: niet in de native app, en niet als de web-app al vanaf het beginscherm
 * draait (wie hem zo installeerde, koos al voor deze versie). Het Startmenu legt de lade ernaar (taak 206).
 */
export function toonAppKnop(): boolean {
  if (IS_APP) return false;
  try {
    return !(matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true);
  } catch {
    return true; // Geen matchMedia: toon de knop.
  }
}

export type Winkel = "apple" | "play";

/**
 * Welke winkelknoppen horen bij dit toestel (taak 267)? Android: Google Play. iPhone en iPad: de App Store. Een computer (of een
 * toestel dat we niet kennen): beide. Een iPad meldt zich sinds iPadOS 13 als Mac; een aanraakscherm op een Mac is een iPad.
 */
export function winkelsVoorToestel(ua: string, aanraakpunten: number): Winkel[] {
  if (/android/i.test(ua)) return ["play"];
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && aanraakpunten > 1)) return ["apple"];
  return ["apple", "play"];
}

/** De winkelknoppen die nu in beeld staan: geen in de app of vanaf het beginscherm, anders die van `winkelsVoorToestel`. */
export function winkelKnoppen(): Winkel[] {
  if (!toonAppKnop()) return [];
  const n = typeof navigator === "undefined" ? undefined : navigator;
  return winkelsVoorToestel(n?.userAgent ?? "", n?.maxTouchPoints ?? 0);
}
