/**
 * Een tekst laten passen in een vak (taak 183): zo groot als kan, en een lange tekst kleiner of op twee regels.
 * Het meten gaat via `meet`, zodat deze regels met elk lettertype werken en zonder canvas te testen zijn.
 * Eenheden: `meet` geeft de breedte van een tekst bij lettergrootte 1; vak en lettergrootte zijn in dezelfde eenheid.
 */
export type Meet = (tekst: string) => number;

export type PasOpties = {
  /** Het vak waar de tekst in moet: breedte en hoogte. */
  breedte: number;
  hoogte: number;
  /** De grootste lettergrootte (een korte tekst wordt niet groter). */
  grootste: number;
  /** Hoeveel hoger een regel is dan de letter (Thai en Devanagari hebben tekens boven en onder de regel). */
  regelhoogte: number;
  taal: string;
  /** Mag een regel breken tussen woorden (Latijn, Arabisch), of overal tussen tekens (Chinees, Japans, Thai)? */
  woordgrens: boolean;
  /** Meer dan twee regels komt niet voor. Standaard 2. */
  maxRegels?: number;
  /**
   * Mag een woord zonder spaties ook tussen twee tekens breken (een Spelersnaam als "WWWWWWWWWWWWWWWWWW", taak 193)? Alleen als de
   * tekst geen andere breekplek heeft: een naam met spaties breekt altijd tussen woorden.
   */
  breekWoord?: boolean;
};

export type PasUitkomst = {
  regels: string[];
  /** Lettergrootte. */
  grootte: number;
  /** Hoogte van het blok: regels maal regelhoogte maal grootte. */
  blokhoogte: number;
  /** Breedte van de breedste regel. */
  blokbreedte: number;
};

type Stuk = { tekst: string; spatie: boolean };

/** Splitst in woorden en spaties (Latijn) of in tekens (Chinees, Japans, Thai); Thai en Japans gaan per woord als de browser woorden kent. */
export function stukken(tekst: string, taal: string, woordgrens: boolean): Stuk[] {
  const uit: Stuk[] = [];
  const woorden = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(taal, { granularity: "word" }) : null;
  const tekens = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(taal, { granularity: "grapheme" }) : null;
  if (woordgrens && woorden) {
    for (const s of woorden.segment(tekst)) uit.push({ tekst: s.segment, spatie: /^\s+$/.test(s.segment) });
  } else if (!woordgrens && woorden) {
    // Zonder spaties tussen woorden: breek tussen woorden van de woordenlijst, en kijk bij een lang woord naar tekens.
    for (const s of woorden.segment(tekst)) {
      if (/^\s+$/.test(s.segment)) uit.push({ tekst: s.segment, spatie: true });
      else if (tekens && [...tekens.segment(s.segment)].length > 1 && !s.isWordLike) for (const t of tekens.segment(s.segment)) uit.push({ tekst: t.segment, spatie: false });
      else uit.push({ tekst: s.segment, spatie: false });
    }
  } else {
    for (const t of tekst) uit.push({ tekst: t, spatie: /^\s+$/.test(t) });
  }
  // Voeg leestekens aan het vorige stuk vast: een regel begint niet met een komma of een punt.
  return uit.reduce<Stuk[]>((a, s) => {
    if (a.length && !s.spatie && /^[\p{P}]+$/u.test(s.tekst)) a[a.length - 1] = { tekst: a[a.length - 1].tekst + s.tekst, spatie: false };
    else a.push(s);
    return a;
  }, []);
}

/** Alle manieren om een tekst in twee regels te breken, op de grens tussen stukken. */
export function tweeRegels(tekst: string, taal: string, woordgrens: boolean): [string, string][] {
  return twee(stukken(tekst.trim(), taal, woordgrens));
}

function twee(s: Stuk[]): [string, string][] {
  const uit: [string, string][] = [];
  for (let i = 1; i < s.length; i++) {
    const a = s.slice(0, i).map((x) => x.tekst).join("").trim();
    const b = s.slice(i).map((x) => x.tekst).join("").trim();
    if (a && b) uit.push([a, b]);
  }
  return uit;
}

/** De stukken van een tekst; met `breekWoord` per teken als de tekst geen breekplek heeft (één woord). */
function stukkenVoorPas(tekst: string, o: PasOpties): Stuk[] {
  const s = stukken(tekst, o.taal, o.woordgrens);
  if (!o.breekWoord || s.filter((x) => !x.spatie).length > 1) return s;
  const tekens = typeof Intl !== "undefined" && "Segmenter" in Intl ? [...new Intl.Segmenter(o.taal, { granularity: "grapheme" }).segment(tekst)].map((t) => t.segment) : [...tekst];
  return tekens.map((t) => ({ tekst: t, spatie: /^\s+$/.test(t) }));
}

/** Past de tekst in het vak. Eén regel als het kan, anders de grootste keuze uit kleiner op één regel of twee regels. */
export function pasTekst(meet: Meet, tekst: string, o: PasOpties): PasUitkomst {
  const schoon = tekst.replace(/\s*\n\s*/g, " ").trim();
  const opties: { regels: string[]; grootte: number; blokbreedte: number }[] = [];
  const maak = (regels: string[]) => {
    const wmax = Math.max(...regels.map(meet));
    const hoogteGrens = o.hoogte / (regels.length * o.regelhoogte);
    let grootte = Math.min(o.grootste, hoogteGrens, wmax > 0 ? o.breedte / wmax : Infinity);
    // Afronding van het meten kan een fractie te breed zijn: maak iets kleiner tot het past.
    while (grootte > 0.01 && Math.max(...regels.map(meet)) * grootte > o.breedte + 1e-9) grootte *= 0.99;
    return { regels, grootte, blokbreedte: wmax * grootte };
  };
  opties.push(maak([schoon]));
  if ((o.maxRegels ?? 2) >= 2) for (const r of twee(stukkenVoorPas(schoon, o))) opties.push(maak(r));
  // Eén regel blijft de keuze, tenzij twee regels duidelijk groter zijn (15 procent): dat is beter te lezen.
  const een = opties[0];
  let best = een;
  for (const k of opties.slice(1)) {
    // Bij twee regels van gelijke grootte wint de meest gelijke verdeling: de kortste breedste regel.
    if (k.grootte > best.grootte * (best === een ? 1.15 : 1 + 1e-9) || (best !== een && Math.abs(k.grootte - best.grootte) < 1e-9 && k.blokbreedte < best.blokbreedte)) best = k;
  }
  return { regels: best.regels, grootte: best.grootte, blokhoogte: best.regels.length * o.regelhoogte * best.grootte, blokbreedte: best.blokbreedte };
}
