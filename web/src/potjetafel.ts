/**
 * Het Potje als tafel (taak 179, uiterlijk 1b): wat het spelscherm en het online spelscherm samen nodig hebben om de naamplaten,
 * de jade aanwijzer en het blad met knoppen te leggen. De voorwerpen zelf staan in `voorwerpen.ts` (`potjeVoorwerpen`).
 */
import { AFTEL_VANAF_S, restDeel, restSeconden } from "./denktijd";
import type { TafelKnop } from "./Voorwerpen.svelte";
import { jadePlek, potjeVoorwerpen, type PotjeOpties } from "./voorwerpen";

/** Seconden als 0:27. */
export const klok = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/**
 * De tekst op de jade aanwijzer. Is het Potje voorbij, dan "The game is over"; ben jij aan de beurt, dan "Your turn". Anders wijst
 * de aanwijzer onder de naamplaat van wie aan de beurt is en zegt "is thinking". Bij vier Spelers of meer zegt de aanwijzer de naam:
 * bij vier dragen de platen geen naam (te klein), bij zes liggen ze in twee rijen en wijst de aanwijzer alleen een kolom aan.
 */
export function beurtTekst(o: { afgelopen: boolean; jij: boolean; naam: string; aantal: number; yourTurn: string; gameOver: string; thinking: string }): string {
  if (o.afgelopen) return o.gameOver;
  if (o.jij) return o.yourTurn;
  return o.aantal > 3 ? o.naam : o.thinking;
}

/**
 * De Denktijd op de jade aanwijzer: het deel dat over is (in 1/60 stappen, zodat het plaatje maar eens per seconde verandert) en
 * in de laatste seconden de klok. `null` zonder Denktijd.
 */
export function tijdOpJade(deadline: number | null, denktijdS: number | null, aan: boolean, nu: number): PotjeOpties["tijd"] {
  if (!aan || deadline === null || denktijdS === null) return undefined;
  const s = restSeconden(deadline, nu);
  return { rest: Math.round(restDeel(deadline, denktijdS, nu) * 60) / 60, klok: s <= AFTEL_VANAF_S ? klok(s) : undefined };
}

/** Het `tafel` van `Speelbord` voor een Potje. `aan`: de plek (index in `spelers`) van wie aan de beurt is, of null. */
export function potjeTafel(o: PotjeOpties & { knoppenLijst: readonly TafelKnop[]; naam: string; aan: number | null }) {
  return {
    voorwerpen: potjeVoorwerpen(o),
    knoppen: o.knoppenLijst,
    naam: o.naam,
    plekken: { beurt: jadePlek(o.aan, o.spelers.length, o.breed) },
  };
}
