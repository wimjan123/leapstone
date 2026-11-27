// Taak 268: geen beschrijving voor Google (<meta name="description">) is breder dan 155 zichtbare tekens, in geen enkele taal.
// Google kapt een langere beschrijving af. De breedte telt grafemen; een breed teken (Chinees, Japans, Koreaans) telt dubbel.
import { expect, test } from "vitest";
import { MAX_BESCHRIJVING, MAX_TITEL, beschrijvingBreedte, titelBreedte } from "./metabreedte";

const bronnen = {
  ...(import.meta.glob("../public/**/*.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>),
  ...(import.meta.glob("../landing/**/index.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>),
  ...(import.meta.glob("../play/index.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>),
};
const uitHtml = (t: string) => t.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const beschrijving = (h: string) => h.match(/<meta name="description" content="([^"]*)"/)?.[1];

test("een breed teken telt dubbel en een samengesteld teken telt één keer", () => {
  expect(beschrijvingBreedte("abc")).toBe(3);
  expect(beschrijvingBreedte("ダイヤ")).toBe(6);
  expect(beschrijvingBreedte("한글")).toBe(4);
  expect(beschrijvingBreedte("नमस्ते")).toBe(3); // 3 grafemen in 6 codepunten
  expect(beschrijvingBreedte("é")).toBe(1);
});

test("elke pagina met een beschrijving (spelregels, gidsen, Landingspagina's, /play/, /privacy, /terms) past in 155 zichtbare tekens", () => {
  const paginas = Object.entries(bronnen).map(([pad, h]) => ({ pad, tekst: beschrijving(h) })).filter((p) => p.tekst !== undefined);
  expect(paginas.length).toBeGreaterThan(260);
  const teBreed = paginas
    .map((p) => ({ pad: p.pad, breedte: beschrijvingBreedte(uitHtml(p.tekst!)) }))
    .filter((p) => p.breedte > MAX_BESCHRIJVING);
  expect(teBreed).toEqual([]);
});

test("elke beschrijving is uniek", () => {
  const gezien = new Map<string, string>();
  for (const [pad, h] of Object.entries(bronnen)) {
    const t = beschrijving(h);
    if (t === undefined) continue;
    expect(gezien.get(t), `${pad} heeft dezelfde beschrijving als ${gezien.get(t)}`).toBeUndefined();
    gezien.set(t, pad);
  }
});

const titel = (h: string) => h.match(/<title>([^<]*)<\/title>/)?.[1];

test("elke titel (spelregels, gidsen, Landingspagina's, /play/, /privacy, /terms) past in 60 zichtbare tekens, in elke taal", () => {
  const paginas = Object.entries(bronnen).map(([pad, h]) => ({ pad, tekst: titel(h) })).filter((p) => p.tekst !== undefined);
  expect(paginas.length).toBeGreaterThan(260);
  const teBreed = paginas
    .map((p) => ({ pad: p.pad, titel: uitHtml(p.tekst!), breedte: titelBreedte(uitHtml(p.tekst!)) }))
    .filter((p) => p.breedte > MAX_TITEL);
  expect(teBreed).toEqual([]);
});

test("elke titel is uniek, in elke taal (taak 309)", () => {
  const gezien = new Map<string, string>();
  for (const [pad, h] of Object.entries(bronnen)) {
    const t = titel(h);
    if (t === undefined) continue;
    expect(gezien.get(t), `${pad} heeft dezelfde titel als ${gezien.get(t)}`).toBeUndefined();
    gezien.set(t, pad);
  }
});
