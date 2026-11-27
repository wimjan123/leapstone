// Taak 268: de breedte van een beschrijving voor Google (`<meta name="description">`) in zichtbare tekens.
// Een zichtbaar teken is een grafeem (in Tamil, Hindi en Thai vormen meer codepunten samen één teken).
// Een breed teken (Chinees, Japans, Koreaans en hun brede leestekens) telt dubbel. Grens: hooguit MAX_BESCHRIJVING.
export const MAX_BESCHRIJVING = 155;
// Taak 297: een titel (`<title>`) is hooguit MAX_TITEL breed, anders valt "| Leapstone" weg in Google. Zelfde telling als de beschrijving.
export const MAX_TITEL = 60;

const BREED = /[ᄀ-ᅟ⺀-〾ぁ-㏿㐀-䶿一-鿿ꥠ-꥿가-퟿豈-﫿︰-﹯＀-｠￠-￦]|[\u{20000}-\u{3FFFD}]/u;
const segmenteer = new Intl.Segmenter("en", { granularity: "grapheme" });

export function beschrijvingBreedte(tekst: string): number {
  let breedte = 0;
  for (const { segment } of segmenteer.segment(tekst)) breedte += BREED.test(segment) ? 2 : 1;
  return breedte;
}

export const titelBreedte = beschrijvingBreedte;
