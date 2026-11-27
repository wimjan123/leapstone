/**
 * Taal van het spel: alle spelertekst komt uit een tabel per taal (`talen/<code>.ts`), met het Engels als
 * bron en als terugval. Het spel volgt de taal van de telefoon of de browser; een taal gekozen in Account
 * blijft bewaard en wint. Wie Engels koos, ziet overal Engels.
 *
 * `t` en `tn` lezen een $state: een scherm dat ze in zijn opmaak aanroept, wisselt mee als de taal verandert.
 */
import en from "./talen/en";
import { TALEN } from "./talen/register";

export type Sleutel = keyof typeof en;
/** Het begin van een meervoudsleutel: `players.count` voor `players.count.one` en `players.count.other`. */
export type MeervoudSleutel = { [K in Sleutel]: K extends `${infer B}.other` ? B : never }[Sleutel];
type Tabel = Record<string, string>;
type Waarden = Record<string, string | number>;

export const TAAL_OPSLAG = "leapstone.taal";
const BRON = "en";

const geladen: Record<string, Tabel> = { [BRON]: en };
let taal = $state(BRON);
let tabel = $state.raw<Tabel>(en);

/** Vult `{naam}` in. */
function vul(tekst: string, waarden?: Waarden): string {
  return waarden ? tekst.replace(/\{(\w+)\}/g, (stuk, naam: string) => (naam in waarden ? String(waarden[naam]) : stuk)) : tekst;
}

/** Een zin in de taal van de Speler, of in het Engels als de tabel hem niet heeft. */
export function t(sleutel: Sleutel, waarden?: Waarden): string {
  return vul(tabel[sleutel] ?? en[sleutel], waarden);
}

/** Een zin met een aantal `n` (`{n}` wordt ingevuld): kiest de meervoudsvorm van de taal. */
export function tn(basis: MeervoudSleutel, n: number, waarden?: Waarden): string {
  let vorm = "other";
  try {
    vorm = new Intl.PluralRules(taal).select(n);
  } catch {
    // Onbekende taalcode: de algemene vorm.
  }
  const sleutel = `${basis}.${vorm}`;
  const bron = en as Tabel;
  const tekst = tabel[sleutel] ?? tabel[`${basis}.other`] ?? bron[`${basis}.${vorm === "one" ? "one" : "other"}`];
  return vul(tekst, { n, ...waarden });
}

/** Tekst met één link tussen `[[` en `]]`: [voor, linktekst, na]. Zonder link: alleen [tekst]. */
export function metLink(sleutel: Sleutel): string[] {
  const tekst = t(sleutel);
  const m = tekst.match(/^(.*?)\[\[(.*?)\]\](.*)$/s);
  return m ? [m[1], m[2], m[3]] : [tekst];
}

/**
 * Een zin met een Spelersnaam (`{name}`), in drie delen: [voor, naam, na] (taak 284). Zo kan het scherm de naam apart opmaken
 * (afbreken waar het moet, hooguit twee regels) terwijl de rest van de zin ("challenges you", "(you)") altijd heel blijft.
 */
export function metNaam(sleutel: Sleutel, naam: string, waarden?: Waarden): [string, string, string] {
  const tekst = t(sleutel, { ...waarden, name: "\u0000" });
  const i = tekst.indexOf("\u0000");
  return i < 0 ? [tekst, "", ""] : [tekst.slice(0, i), naam, tekst.slice(i + 1)];
}

/** De taal waarin het spel nu staat. */
export const huidigeTaal = () => taal;
export const talen = () => Object.entries(TALEN).map(([code, info]) => ({ code, naam: info.naam }));

/**
 * Kiest uit de taalcodes van de telefoon (de voorkeur eerst) de eerste taal die het spel kent:
 * eerst de hele code (`zh-hant`), dan het eerste deel (`pt` voor `pt-BR`). Onbekend: Engels.
 */
export function kiesUitTalen(codes: readonly string[]): string {
  const kent = (c: string) => Object.keys(TALEN).find((k) => k === c || TALEN[k].alias?.includes(c));
  for (const code of codes) {
    const l = code.toLowerCase().replaceAll("_", "-");
    const gevonden = kent(l) ?? kent(l.split("-")[0]);
    if (gevonden) return gevonden;
  }
  return BRON;
}

function bewaarde(): string | null {
  try {
    const c = localStorage.getItem(TAAL_OPSLAG);
    return c && c in TALEN ? c : null;
  } catch {
    return null;
  }
}

/** Zet de taal van het spel. `bewaar`: onthoud de keuze op deze telefoon (de keuze in Account). */
export async function zetTaal(code: string, bewaar = true): Promise<void> {
  if (!(code in TALEN)) code = BRON;
  if (!geladen[code]) {
    try {
      geladen[code] = (await TALEN[code].laad()).default;
    } catch {
      // De tabel is niet te laden (bijvoorbeeld zonder verbinding): het Engels blijft.
      return;
    }
  }
  taal = code;
  tabel = geladen[code];
  try {
    document.documentElement.lang = code;
    document.documentElement.dir = TALEN[code].rtl ? "rtl" : "ltr";
  } catch {
    // Geen document.
  }
  if (bewaar) {
    try {
      localStorage.setItem(TAAL_OPSLAG, code);
    } catch {
      // Geen opslag: de keuze geldt tot de app sluit.
    }
  }
}

/** Bij het opstarten: de gekozen taal, anders die van de telefoon, anders Engels. */
export async function laadBegintaal(): Promise<void> {
  const codes = typeof navigator === "undefined" ? [] : navigator.languages?.length ? navigator.languages : [navigator.language ?? BRON];
  await zetTaal(bewaarde() ?? kiesUitTalen(codes), false);
}

const VASTE_ZINNEN = new Map(Object.entries(en).flatMap(([k, v]) => (k.startsWith("quick.") ? [[v, k as Sleutel] as const] : [])));

/**
 * Een Vaste zin van de server (altijd Engels) in de taal van de lezer. Elke andere tekst blijft zoals hij is:
 * vrije Berichten worden niet vertaald.
 */
export function vasteZin(tekst: string): string {
  const sleutel = VASTE_ZINNEN.get(tekst);
  return sleutel ? t(sleutel) : tekst;
}
