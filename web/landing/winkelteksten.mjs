// De winkelteksten per taal (docs/winkel/talen/<locale>.json), alleen voor de tests van de Landingspagina (taak 134).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MAP = join(import.meta.dirname, "winkel", "talen");

/** Alle winkelteksten, elk met zijn `locale` (bestandsnaam zonder .json). */
export const winkelteksten = () =>
  readdirSync(MAP)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ ...JSON.parse(readFileSync(join(MAP, f), "utf8")), locale: f.replace(/\.json$/, "") }));
