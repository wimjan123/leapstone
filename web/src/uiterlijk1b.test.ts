import { describe, expect, it } from "vitest";
import play from "../play/index.html?raw";
import vite from "../vite.config.ts?raw";

// Het uiterlijk is 1b (porselein, kobalt, rood lak, goud, zijde). De kleuren en namen van het oude uiterlijk Lagune (aqua, limoen,
// wit plastic, pastelvlakken) mogen nergens in de code van de schermen terugkomen, ook niet in de platte schermen zonder 3D.
const bron = import.meta.glob(
  ["./**/*.{svelte,ts,css}", "!./**/*.test.ts", "!./talen/**", "!./wasm/**", "!./wasm3d/**", "!./bord3d/**", "!./assets/**"],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;
const lijst: [string, string][] = [...Object.entries(bron), ["play/index.html", play], ["vite.config.ts", vite]];

const HEX = [
  "6fd6cb", "d8f55e", "eaf8f6", "d3ece8", "0e3b43", "fff1c2", "ffe3dc", "e8e2fc", "8a5f00", "b83f28", "5b43b5",
  "e6f98e", "dcf1ee", "0a2b32", "134a54", "3f6d72", "4a787d", "fdeeea", "dbe8fc", "2a52b5", "f4fbd3", "cbe94f", "86bfb6", "5ea89e",
];
const VERBODEN: [string, RegExp][] = [
  ["een kleur van Lagune", new RegExp(`#(${HEX.join("|")})\\b`, "i")],
  ["de rand of schaduw van Lagune, rgb(14 59 67)", /rgba?\(\s*14[ ,]+59[ ,]+67/],
  ["het woord aqua", /\baqua\b/i],
  ["het woord limoen", /\blimoen/i],
  ["het woord Lagune", /\blagune\b/i],
  ["de naam --glas, --aqua of --limoen", /--(glas|aqua|limoen)\b/],
  ["een wit blad of een witte schijf", /\bwitte? (blad|schijf)\b/i],
];

describe("uiterlijk 1b", () => {
  it("zoekt in de schermen en de manifestkleuren", () => {
    expect(lijst.some(([f]) => f.endsWith("app.css"))).toBe(true);
    expect(lijst.some(([f]) => f.endsWith("Beurtbalk.svelte"))).toBe(true);
    expect(lijst.some(([f]) => f.endsWith("index.html"))).toBe(true);
  });

  it("heeft geen kleur of naam van het oude uiterlijk Lagune", () => {
    const gevonden: string[] = [];
    for (const [f, tekst] of lijst) {
      tekst.split("\n").forEach((regel, i) => {
        for (const [wat, patroon] of VERBODEN) if (patroon.test(regel)) gevonden.push(`${f}:${i + 1} ${wat}: ${regel.trim().slice(0, 90)}`);
      });
    }
    expect(gevonden).toEqual([]);
  });
});
