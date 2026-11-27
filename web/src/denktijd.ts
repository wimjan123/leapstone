/**
 * Denktijd: de maximale tijd voor één Zet in een online Potje. De server houdt de tijd bij en slaat
 * een beurt over als hij op is; de app rekent hier alleen uit wat hij laat zien.
 */

import { t, tn } from "./taal.svelte";

/** De keuzes bij een nieuw online Potje, in seconden; null is geen grens. */
export const DENKTIJDEN = [15, 30, 60, 120, null] as const;
export type Denktijd = (typeof DENKTIJDEN)[number];
export const STANDAARD_DENKTIJD: Denktijd = 30;

/** Kort, voor een knop of badge: 15s, 30s, 1m, 2m. */
export function denktijdTekst(s: number): string {
  return s % 60 === 0 ? t("moveTime.shortMinutes", { n: s / 60 }) : t("moveTime.shortSeconds", { n: s });
}

/** Voluit, voor schermlezers. */
export function denktijdNaam(s: number | null): string {
  if (s === null) return t("moveTime.none");
  if (s % 60 === 0) return tn("moveTime.minutes", s / 60);
  return tn("moveTime.seconds", s);
}

/**
 * De deadline van de server in de klok van deze telefoon. `server_tijd_ms` is "nu" volgens de server
 * toen hij de stand stuurde; `ontvangenMs` is "nu" hier toen de stand aankwam. Loopt de klok van
 * de telefoon voor of achter, dan valt dat zo weg.
 */
export function lokaleDeadline(deadlineMs: number | null, serverTijdMs: number | null | undefined, ontvangenMs: number): number | null {
  if (deadlineMs === null) return null;
  if (typeof serverTijdMs !== "number") return deadlineMs;
  return deadlineMs - serverTijdMs + ontvangenMs;
}

/** Hoeveel van de denktijd nog over is, van 1 (net begonnen) tot 0 (op). */
export function restDeel(deadline: number, denktijdS: number, nu: number): number {
  const deel = (deadline - nu) / (denktijdS * 1000);
  return Math.min(1, Math.max(0, deel));
}

/** Hele seconden die nog over zijn (naar boven afgerond, nooit onder 0). */
export function restSeconden(deadline: number, nu: number): number {
  return Math.max(0, Math.ceil((deadline - nu) / 1000));
}

/** Vanaf hier telt de HUD af in cijfers: altijd, zolang er een Denktijd is (taak 235; was de laatste 10 s). */
export const AFTEL_VANAF_S = Number.POSITIVE_INFINITY;
/** Vanaf hier is de tijd bijna op. */
export const DRINGEND_VANAF_S = 5;
