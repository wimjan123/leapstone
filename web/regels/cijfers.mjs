// De getallen van de gids Leapstone in cijfers (taak 320 en 321, feature 313), voor de tekst in elke taal (talen/<code>/chinese-checkers-by-the-numbers.mjs).
// Elk getal komt uit cijfers.json en staat op de pagina in <span data-feit="sleutel">: web/src/regels.test.ts vergelijkt ze in elke taal met
// die gegevens en met het wasm van halma-core, en weigert elk ander getal op de pagina. Rust: `cijfers_json_klopt` in crates/halma-core/src/cijfers.rs.
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** De gegevens uit cijfers.json, voor een getal zonder merk (titel en beschrijving). */
export const c = JSON.parse(readFileSync(join(import.meta.dirname, "cijfers.json"), "utf8"));

/** Een getal van de pagina, gemerkt met zijn sleutel in cijfers.json. */
export const f = (sleutel) => {
  if (!(sleutel in c)) throw new Error(`cijfers.json: ${sleutel} ontbreekt`);
  return `<span data-feit="${sleutel}">${c[sleutel]}</span>`;
};
