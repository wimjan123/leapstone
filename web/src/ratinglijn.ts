/**
 * De Ratinglijn van My stats (taak 284): een punt per Potje in een vlak van `breed` x `hoog`, met `rand` ruimte rondom, en de waarden
 * voor de as ernaast. Zijn alle waarden gelijk (ook bij één Potje), dan staat de lijn in het midden en heeft de as één waarde in
 * plaats van twee keer dezelfde.
 */
export type RatingLijn = {
  punten: { x: number; y: number }[];
  /** De waarden op de as, van boven naar beneden: hoogste en laagste, of één als ze gelijk zijn. */
  as: number[];
  laatste: number;
  /** Het SVG-pad door alle punten. */
  pad: string;
};

export function ratingLijn(r: readonly number[], breed: number, hoog: number, rand: number): RatingLijn | null {
  if (r.length === 0) return null;
  const laag = Math.min(...r);
  const top = Math.max(...r);
  const vlak = laag === top;
  const punten = r.map((v, i) => ({
    x: r.length === 1 ? breed / 2 : rand + (i * (breed - 2 * rand)) / (r.length - 1),
    y: vlak ? hoog / 2 : hoog - rand - ((v - laag) * (hoog - 2 * rand)) / (top - laag),
  }));
  return {
    punten,
    as: vlak ? [top] : [top, laag],
    laatste: r[r.length - 1],
    pad: punten.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" "),
  };
}
