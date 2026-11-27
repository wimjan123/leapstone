// De pagina van scripts/knopplaten.mjs: bakt de knopplaten in de browser en meet hoe lang dat duurt.
import { bakKnoppen, KNOPPEN, type Plaat } from "../src/knopplaten/index";

const mediaan = (l: number[]) => [...l].sort((a, b) => a - b)[Math.floor(l.length / 2)];

/** De volgorde en de rijen van het overzicht: twee platen naast elkaar op de breedte van een kolom. */
const RIJEN: string[][] = [["spelen"], ["online"], ["computer", "vrienden"], ["puzzel", "uitleg"], ["ranglijst", "stats"], ["lade"], ["menu", "opgeven"], ["klaar"]];

(window as unknown as { __knop: unknown }).__knop = {
  /** Bakt alle knoppen van een taal `n` keer. Geeft de tijd van de eerste keer (met lettertypen laden) en van de volgende keren (in ms). */
  async meet(taal: string, n: number, schaal: number) {
    const t0 = performance.now();
    await bakKnoppen(taal, { schaal });
    const eerste = performance.now() - t0;
    const tijden: number[] = [];
    for (let i = 0; i < n; i++) {
      const t = performance.now();
      await bakKnoppen(taal, { schaal });
      tijden.push(performance.now() - t);
    }
    return { taal, eerste, mediaan: mediaan(tijden), langste: Math.max(...tijden), tijden };
  },
  /** Alle knoppen van de gegeven talen naast elkaar: één kolom per taal. Geeft een PNG als data-adres. */
  async overzicht(talen: string[], schaal: number) {
    const kolomB = Math.round(8.4 * schaal), rijH = Math.round(3.0 * schaal), gat = Math.round(0.25 * schaal);
    const alle = await Promise.all(talen.map((t) => bakKnoppen(t, { schaal })));
    const hoogte = RIJEN.reduce((som, rij) => som + Math.max(...rij.map((id) => alle[0][KNOPPEN.findIndex((k) => k.id === id)].hoogte)) + gat, gat);
    const c = document.createElement("canvas");
    c.width = talen.length * (kolomB + gat) + gat;
    c.height = hoogte;
    const x = c.getContext("2d")!;
    x.fillStyle = "#0b0e18"; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = "#06402f"; x.font = `600 ${Math.round(0.28 * schaal)}px sans-serif`;
    alle.forEach((platen: Plaat[], ti) => {
      let y = gat;
      for (const rij of RIJEN) {
        let px = gat + ti * (kolomB + gat);
        let h = 0;
        for (const id of rij) {
          const p = platen[KNOPPEN.findIndex((k) => k.id === id)];
          const beeld = new ImageData(new Uint8ClampedArray(p.beeldpunten), p.breedte, p.hoogte);
          // Een rij met twee platen: ze staan in de taal van de kolom, van rechts naar links bij Arabisch en Hebreeuws.
          x.putImageData(beeld, p.rtl && rij.length > 1 ? px + (kolomB - 2 * p.breedte - gat) / 2 + (rij.indexOf(id) === 0 ? p.breedte + gat : 0) : px + (rij.length > 1 ? (kolomB - 2 * p.breedte - gat) / 2 + rij.indexOf(id) * (p.breedte + gat) : (kolomB - p.breedte) / 2), y);
          h = Math.max(h, p.hoogte);
        }
        y += h + gat;
      }
    });
    void rijH;
    return c.toDataURL("image/png");
  },
};
document.title = "klaar";
