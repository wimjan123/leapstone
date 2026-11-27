import { Potje } from "./wasm/halma_core.js";
import { schermPunt, type Vorm } from "./spelers";

/**
 * Een klein plaatje van een bord voor de menu's: de gaatjes en de stenen bij het begin.
 * Gedraaid zoals in het spel: Speler 1 zit onderaan. Alleen om te tonen.
 */
export type Punt = { x: number; y: number };
export type Bordje = {
  gaten: Punt[];
  /** De lijnen tussen buurvakken (indexen in `gaten`): het net van het bord als lijntekening. */
  lijnen: [number, number][];
  stenen: { p: Punt; speler: number }[];
  /** Het midden van de beginplek van elke Speler (index = Speler). */
  plekken: Punt[];
  /** Het midden van het bord en de draaiing (in graden) die Speler 1 onderaan zet. */
  midden: Punt;
  draai: number;
  /** Wat in beeld moet: x, y, breedte, hoogte. */
  kader: { x: number; y: number; b: number; h: number };
};

const RAND = 1.05;

export function bordje(vorm: Vorm, aantal: number): Bordje {
  const potje = vorm === "vierkant" ? Potje.vierkant(aantal) : new Potje(aantal);
  const plek = Array.from(potje.vak_plekken());
  const stand = Array.from(potje.stand());
  potje.free();

  const ruw: Punt[] = [];
  for (let i = 0; i < plek.length / 2; i++) ruw.push(schermPunt(vorm, plek[2 * i], plek[2 * i + 1]));
  const midden = gemiddelde(ruw);

  // Draai zo dat het kamp van Speler 1 zo recht mogelijk onderaan ligt (zoals het spel kijkt).
  const kamp0 = gemiddelde(ruw.filter((_, v) => stand[v] === 0));
  const hoek = (Math.atan2(kamp0.y - midden.y, kamp0.x - midden.x) * 180) / Math.PI;
  const stap = vorm === "vierkant" ? 90 : 60;
  let draai = 0;
  let beste = Infinity;
  for (let d = 0; d < 360; d += stap) {
    const af = Math.abs((((hoek + d - 90) % 360) + 540) % 360 - 180);
    if (af < beste - 1e-6) {
      beste = af;
      draai = d;
    }
  }
  const rad = (draai * Math.PI) / 180;
  const draaiPunt = (p: Punt): Punt => {
    const dx = p.x - midden.x;
    const dy = p.y - midden.y;
    return { x: midden.x + dx * Math.cos(rad) - dy * Math.sin(rad), y: midden.y + dx * Math.sin(rad) + dy * Math.cos(rad) };
  };

  const gaten = ruw.map(draaiPunt);
  const stenen = gaten.flatMap((p, v) => (stand[v] >= 0 ? [{ p, speler: stand[v] }] : []));
  const plekken = Array.from({ length: aantal }, (_, s) => gemiddelde(gaten.filter((_, v) => stand[v] === s)));

  const xs = gaten.map((p) => p.x);
  const ys = gaten.map((p) => p.y);
  const x0 = Math.min(...xs) - RAND;
  const y0 = Math.min(...ys) - RAND;
  const kader = { x: x0, y: y0, b: Math.max(...xs) + RAND - x0, h: Math.max(...ys) + RAND - y0 };
  return { gaten, lijnen: buren(gaten), stenen, plekken, midden, draai, kader };
}

function gemiddelde(p: Punt[]): Punt {
  const n = Math.max(p.length, 1);
  return { x: p.reduce((s, q) => s + q.x, 0) / n, y: p.reduce((s, q) => s + q.y, 0) / n };
}

/** Paren vakken die precies één vak uit elkaar liggen. */
function buren(p: Punt[]): [number, number][] {
  const uit: [number, number][] = [];
  for (let i = 0; i < p.length; i++)
    for (let j = i + 1; j < p.length; j++) {
      const d = Math.hypot(p[i].x - p[j].x, p[i].y - p[j].y);
      if (d > 0.95 && d < 1.05) uit.push([i, j]);
    }
  return uit;
}
