/**
 * De Speluitleg (taak 156): drie oefeningen op het Sterbord, daarna het doel van het spel.
 * De oefeningen zijn standen van een echt Potje (halma-core beslist wat een Stap en een Sprong is);
 * hier staat alleen welke Stenen waar staan en welk vak het doel van de oefening is.
 */

export type Oefening = {
  /** Sleutel van de tekst: één zin. */
  tekst: "learn.step" | "learn.jump" | "learn.chain";
  /** De Steen van de Speler (speler 0) en de grijze Stenen (speler 1), als (kolom, rij) op het Sterbord. */
  eigen: [number, number];
  grijs: [number, number][];
  /** Het doelvakje: het enige vakje dat oplicht. */
  doel: [number, number];
  /** Het aantal Sprongen in de Zet (0: een Stap). */
  sprongen: number;
};

// Het bord kijkt vanaf de kant van Speler 1: vooruit is naar beneden, de richting (0, 1) of (-1, 1).
export const OEFENINGEN: Oefening[] = [
  { tekst: "learn.step", eigen: [0, -1], grijs: [], doel: [0, 0], sprongen: 0 },
  { tekst: "learn.jump", eigen: [0, -2], grijs: [[0, -1]], doel: [0, 0], sprongen: 1 },
  // Drie Sprongen achter elkaar: (1,-3) over (1,-2) naar (1,-1), over (0,0) naar (-1,1), over (-1,2) naar (-1,3).
  { tekst: "learn.chain", eigen: [1, -3], grijs: [[1, -2], [0, 0], [-1, 2]], doel: [-1, 3], sprongen: 3 },
];

/** Het vaknummer van (kolom, rij) in de vakplekken van het bord ([kolom0, rij0, kolom1, ...]). */
export function vakOp(plekken: ArrayLike<number>, [kolom, rij]: [number, number]): number {
  for (let i = 0; i < plekken.length / 2; i++) if (plekken[2 * i] === kolom && plekken[2 * i + 1] === rij) return i;
  throw new Error(`geen vak op ${kolom},${rij}`);
}

/** De stand van een oefening: per vak de Speler (0 of 1) of -1. */
export function oefeningStand(plekken: ArrayLike<number>, o: Oefening): number[] {
  const stand: number[] = Array(plekken.length / 2).fill(-1);
  stand[vakOp(plekken, o.eigen)] = 0;
  for (const g of o.grijs) stand[vakOp(plekken, g)] = 1;
  return stand;
}
