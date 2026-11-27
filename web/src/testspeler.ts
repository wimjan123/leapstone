/** Is dit een test? Dan wordt een nieuwe Speler een Test-Speler (feature 272, taak 274). */

declare const __HALMA_TESTBUILD__: boolean;

/** Het adres `?testspeler=1` zet de vlag; de browser onthoudt hem hieronder. `?testspeler=0` haalt hem weg. */
export const TESTVLAG_OPSLAG = "leapstone-testspeler";
const TESTVLAG_PARAMETER = "testspeler";

/** True in een debug-build of testbuild van de native app (bij het bouwen gezet, zie `vite.config.ts`). */
const IS_TESTBUILD: boolean = typeof __HALMA_TESTBUILD__ !== "undefined" && __HALMA_TESTBUILD__;

/** Wat de keuze nodig heeft. Een winkelversie (App Store, Google Play, TestFlight) heeft nergens een `true`. */
export type TestBron = { app: boolean; dev: boolean; testbuild: boolean; vlag: boolean };

/** Een test is een ontwikkelversie, een debug- of testbuild van de app, of een browser met de testvlag (niet in de app). */
export function isTest({ app, dev, testbuild, vlag }: TestBron): boolean {
  if (dev || testbuild) return true;
  return !app && vlag;
}

/** Leest `?testspeler=1|0` uit het adres, onthoudt het en geeft terug of de vlag nu aan staat. */
function leesVlag(): boolean {
  try {
    const waarde = new URLSearchParams(location.search).get(TESTVLAG_PARAMETER);
    if (waarde === "1") localStorage.setItem(TESTVLAG_OPSLAG, "1");
    else if (waarde === "0") localStorage.removeItem(TESTVLAG_OPSLAG);
    return localStorage.getItem(TESTVLAG_OPSLAG) === "1";
  } catch {
    return false;
  }
}

/** Zet de vlag uit het adres meteen bij het laden van de app, zodat hij ook na een andere pagina blijft staan. */
export const onthoudTestvlag = (): void => void leesVlag();

export function dezeIsTest(app: boolean): boolean {
  return isTest({ app, dev: import.meta.env.DEV, testbuild: IS_TESTBUILD, vlag: leesVlag() });
}
