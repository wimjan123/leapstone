import { IS_APP, SERVER } from "./omgeving";
/**
 * Meldingen: toestemming, aanmelden en het abonnement naar de eigen server sturen.
 * In de browser via web push; in de iPhone-app via Apple (APNs), met het apparaattoken van iOS.
 * De Android-app heeft nog geen Meldingen (Firebase komt later).
 */

export type MeldingStatus =
  | "laden"
  | "aan"
  | "uit"
  | "geblokkeerd"
  | "beginscherm" // iPhone: eerst op het beginscherm zetten
  | "niet-beschikbaar"; // geen ondersteuning of de server heeft het (nog) niet

/** iPhone of iPad (een iPad meldt zich als Mac, maar met aanraken). */
export const isIos = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isStandalone = () =>
  matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;

/** De iPhone-app: Meldingen via APNs in plaats van web push. */
export const isIosApp = () => IS_APP && isIos();

/** Kan deze omgeving Meldingen tonen? De browser altijd (met uitleg), de iPhone-app ook, de Android-app nog niet. */
export const heeftMeldingen = () => !IS_APP || isIosApp();

const kanPush = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

/** base64url-tekst naar bytes, zoals `applicationServerKey` die wil. */
export function sleutelNaarBytes(tekst: string): Uint8Array<ArrayBuffer> {
  const b64 = tekst.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(tekst.length / 4) * 4, "=");
  const ruw = atob(b64);
  return Uint8Array.from(ruw, (c) => c.charCodeAt(0));
}

async function registratie() {
  return navigator.serviceWorker.ready;
}

export async function leesMeldingStatus(): Promise<MeldingStatus> {
  if (isIosApp()) return (await apnsStatus()).status;
  if (isIos() && !isStandalone()) return "beginscherm";
  if (!kanPush()) return "niet-beschikbaar";
  if (Notification.permission === "denied") return "geblokkeerd";
  if (Notification.permission !== "granted") return "uit";
  const abonnement = await (await registratie()).pushManager.getSubscription();
  return abonnement ? "aan" : "uit";
}

async function haalSleutel(): Promise<string | null> {
  try {
    const antwoord = await fetch(`${SERVER}/api/push/sleutel`);
    if (!antwoord.ok) return null;
    const j = await antwoord.json();
    return typeof j.sleutel === "string" ? j.sleutel : null;
  } catch {
    return null;
  }
}

/** Is de server klaar voor Meldingen? Zo niet, dan tonen we de knop niet als actie. */
export async function serverKanMeldingen(): Promise<boolean> {
  return (await haalSleutel()) !== null;
}

/** Vraagt toestemming, abonneert en meldt het abonnement aan bij de server. */
export async function zetMeldingenAan(spelerSleutel: string): Promise<MeldingStatus> {
  if (isIosApp()) return apnsAan(spelerSleutel);
  if (!kanPush()) return "niet-beschikbaar";
  const toestemming = await Notification.requestPermission();
  if (toestemming === "denied") return "geblokkeerd";
  if (toestemming !== "granted") return "uit";
  const sleutel = await haalSleutel();
  if (!sleutel) return "niet-beschikbaar";
  const reg = await registratie();
  const abonnement =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: sleutelNaarBytes(sleutel) }));
  const antwoord = await fetch(`${SERVER}/api/push/abonnement`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${spelerSleutel}` },
    body: JSON.stringify(abonnement.toJSON()),
  });
  if (!antwoord.ok) throw new Error("The server did not accept notifications.");
  return "aan";
}

/**
 * Meldingen staan in deze browser al aan: meld het bestaande abonnement opnieuw aan. De server wist de
 * abonnementen van een Speler bij herstel met de Herstelcode; zo hoort dit toestel er daarna weer bij.
 * Een fout hier is geen probleem.
 */
export async function vernieuwAbonnement(spelerSleutel: string): Promise<void> {
  const abonnement = await (await registratie()).pushManager.getSubscription();
  if (!abonnement) return;
  await fetch(`${SERVER}/api/push/abonnement`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${spelerSleutel}` },
    body: JSON.stringify(abonnement.toJSON()),
  }).catch(() => {});
}

export async function zetMeldingenUit(spelerSleutel: string): Promise<MeldingStatus> {
  if (isIosApp()) return apnsUit(spelerSleutel);
  const abonnement = await (await registratie()).pushManager.getSubscription();
  if (abonnement) {
    await fetch(`${SERVER}/api/push/abonnement`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${spelerSleutel}` },
      body: JSON.stringify({ endpoint: abonnement.endpoint }),
    }).catch(() => {});
    await abonnement.unsubscribe();
  }
  return "uit";
}

// ---- iPhone-app (APNs) ------------------------------------------------------------------

/** Het laatst aangemelde apparaattoken, om het later af te melden. */
const APNS_TOKEN = "leapstone-apns-token";
/** De Speler zette Meldingen zelf uit in de app; dan niet vanzelf weer aanmelden. */
const APNS_UIT = "leapstone-apns-uit";

function lees(sleutel: string): string | null {
  try {
    return localStorage.getItem(sleutel);
  } catch {
    return null;
  }
}

function schrijf(sleutel: string, waarde: string | null) {
  try {
    if (waarde === null) localStorage.removeItem(sleutel);
    else localStorage.setItem(sleutel, waarde);
  } catch {
    // Geen opslag: dan vergeet de app het alleen.
  }
}

async function roep<T>(commando: string): Promise<T> {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<T>(commando);
}

/**
 * De status in de iPhone-app. `vraagNog`: iOS heeft nog nooit om toestemming gevraagd.
 * De app vraagt dan zelf, op het moment dat de Speler een online Potje start of meedoet.
 */
export async function apnsStatus(): Promise<{ status: MeldingStatus; vraagNog: boolean }> {
  const toestemming = await roep<string>("meldingen_toestemming");
  if (toestemming === "denied") return { status: "geblokkeerd", vraagNog: false };
  if (toestemming !== "granted") return { status: "uit", vraagNog: lees(APNS_UIT) === null };
  return { status: lees(APNS_UIT) === null && lees(APNS_TOKEN) !== null ? "aan" : "uit", vraagNog: false };
}

/** Vraagt toestemming en het apparaattoken aan iOS en meldt het token aan bij de server. */
async function apnsAan(spelerSleutel: string): Promise<MeldingStatus> {
  let t: { token: string; omgeving: string };
  try {
    t = await roep("apns_token");
  } catch (e) {
    if (String(e).includes("denied")) return "geblokkeerd";
    throw e;
  }
  const antwoord = await fetch(`${SERVER}/api/push/apns`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${spelerSleutel}` },
    body: JSON.stringify(t),
  });
  if (antwoord.status === 404) return "niet-beschikbaar";
  if (!antwoord.ok) throw new Error("The server did not accept notifications.");
  schrijf(APNS_TOKEN, t.token);
  schrijf(APNS_UIT, null);
  return "aan";
}

async function apnsUit(spelerSleutel: string): Promise<MeldingStatus> {
  const token = lees(APNS_TOKEN);
  if (token) {
    // Mislukt dit, dan blijft de stand "aan": de fout gaat naar de knop, die een melding toont.
    const antwoord = await fetch(`${SERVER}/api/push/apns`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${spelerSleutel}` },
      body: JSON.stringify({ token }),
    });
    if (!antwoord.ok && antwoord.status !== 404) throw new Error("The server did not turn off notifications.");
  }
  schrijf(APNS_UIT, "1");
  return "uit";
}

/**
 * iPhone-app met Meldingen aan: meld het token opnieuw aan. iOS kan het token veranderen, en zo
 * hoort het token ook bij de Speler na een Herstelcode. Een fout hier is geen probleem.
 */
export async function vernieuwApnsToken(spelerSleutel: string): Promise<void> {
  await apnsAan(spelerSleutel).catch(() => {});
}
