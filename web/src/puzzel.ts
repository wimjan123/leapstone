/**
 * De Dagelijkse puzzel op dit toestel (taak 152, feature 141): de datum van vandaag in de eigen tijd van de Speler,
 * je beste aantal Zetten, je Reeks en de deeltekst. Alles blijft in localStorage; er gaat niets naar de server.
 */

export const PUZZEL_OPSLAG = "leapstone.puzzel";
/** Waar de deeltekst naartoe wijst: de Landingspagina. */
export const PUZZEL_LINK = "https://playleapstone.com/";

export type Datum = { jaar: number; maand: number; dag: number };
export type PuzzelOpslag = {
  /** De laatste datum (jjjj-mm-dd) waarop de Speler de Dagelijkse puzzel oploste. */
  opgelost: string | null;
  /** Dagen achter elkaar opgelost, tot en met `opgelost`. */
  reeks: number;
  /** Het beste aantal Zetten van de puzzel van die datum. */
  beste: { datum: string; zetten: number } | null;
};

/** De datum van `nu` in de eigen tijd van de Speler. */
export const datumVan = (nu: Date): Datum => ({ jaar: nu.getFullYear(), maand: nu.getMonth() + 1, dag: nu.getDate() });
export const datumSleutel = (d: Datum): string => `${d.jaar}-${String(d.maand).padStart(2, "0")}-${String(d.dag).padStart(2, "0")}`;

/** De datum een dag eerder, ook over een maand- of jaargrens. */
export function gisteren(d: Datum): Datum {
  const x = new Date(d.jaar, d.maand - 1, d.dag - 1);
  return datumVan(x);
}

/** Milliseconden tot de volgende middernacht in de eigen tijd. */
export function totMiddernacht(nu: Date): number {
  return new Date(nu.getFullYear(), nu.getMonth(), nu.getDate() + 1).getTime() - nu.getTime();
}

export function leesOpslag(): PuzzelOpslag {
  const leeg: PuzzelOpslag = { opgelost: null, reeks: 0, beste: null };
  try {
    const ruw = JSON.parse(localStorage.getItem(PUZZEL_OPSLAG) ?? "null");
    if (!ruw || typeof ruw !== "object") return leeg;
    return {
      opgelost: typeof ruw.opgelost === "string" ? ruw.opgelost : null,
      reeks: Number.isInteger(ruw.reeks) && ruw.reeks > 0 ? ruw.reeks : 0,
      beste: ruw.beste && typeof ruw.beste.datum === "string" && Number.isInteger(ruw.beste.zetten) ? ruw.beste : null,
    };
  } catch {
    return leeg;
  }
}

/** De Reeks zoals hij nu telt: nog 0 als de laatste oplossing niet van vandaag of gisteren is. */
export function huidigeReeks(o: PuzzelOpslag, vandaag: Datum): number {
  if (o.opgelost === null) return 0;
  return o.opgelost === datumSleutel(vandaag) || o.opgelost === datumSleutel(gisteren(vandaag)) ? o.reeks : 0;
}

/** De puzzel van `vandaag` is opgelost in `zetten` Zetten: bewaar het beste aantal en tel de Reeks. Elke oplossing telt. */
export function registreerOplossing(vandaag: Datum, zetten: number): PuzzelOpslag {
  const o = leesOpslag();
  const dag = datumSleutel(vandaag);
  const reeks = o.opgelost === dag ? Math.max(o.reeks, 1) : o.opgelost === datumSleutel(gisteren(vandaag)) ? o.reeks + 1 : 1;
  const beste = o.beste && o.beste.datum === dag && o.beste.zetten <= zetten ? o.beste : { datum: dag, zetten };
  const nieuw: PuzzelOpslag = { opgelost: dag, reeks, beste };
  try {
    localStorage.setItem(PUZZEL_OPSLAG, JSON.stringify(nieuw));
  } catch {
    // Opslag vol of geblokkeerd: de Reeks van deze sessie blijft op het scherm staan.
  }
  return nieuw;
}

/** Het beste aantal Zetten van de puzzel van vandaag, of null. */
export const besteVandaag = (o: PuzzelOpslag, vandaag: Datum): number | null => (o.beste && o.beste.datum === datumSleutel(vandaag) ? o.beste.zetten : null);
