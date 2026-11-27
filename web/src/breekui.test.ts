// Taak 284 (break-ui-ronde): wat de schermen uitrekenen of beslissen bij worst-case gegevens.
import { afterEach, expect, test } from "vitest";
import { getal, ratingGetal } from "./getal";
import { zoekKrimp } from "./krimp";
import { tegenstandersKort } from "./online";
import { ratingLijn } from "./ratinglijn";
import { bovenop, laatLaag, neemLaag } from "./tafellagen.svelte";
import { metNaam, zetTaal } from "./taal.svelte";

afterEach(async () => {
  await zetTaal("en", false);
});

test("Mijn potjes met zes Spelers: twee namen en +3; tot twee tegenstanders alle namen", () => {
  expect(tegenstandersKort(["Fox", "Sam", "Noor", "Finn", "Lena"])).toEqual({ namen: ["Fox", "Sam"], meer: 3 });
  expect(tegenstandersKort(["Fox", "Sam", "Noor"])).toEqual({ namen: ["Fox", "Sam"], meer: 1 });
  expect(tegenstandersKort(["Fox", "Sam"])).toEqual({ namen: ["Fox", "Sam"], meer: 0 });
  expect(tegenstandersKort([])).toEqual({ namen: [], meer: 0 });
});

test("Ratinglijn: één Potje (of steeds dezelfde Rating) geeft één waarde op de as, in het midden", () => {
  const een = ratingLijn([1016], 300, 120, 10)!;
  expect(een.as).toEqual([1016]);
  expect(een.punten).toEqual([{ x: 150, y: 60 }]);
  expect(ratingLijn([1016, 1016, 1016], 300, 120, 10)!.as).toEqual([1016]);
  const twee = ratingLijn([1000, 1040, 1020], 300, 120, 10)!;
  expect(twee.as).toEqual([1040, 1000]);
  // Hoogste bovenaan, laagste onderaan.
  expect(twee.punten.map((p) => p.y)).toEqual([110, 10, 60]);
  expect(twee.laatste).toBe(1020);
  expect(ratingLijn([], 300, 120, 10)).toBeNull();
});

test("krimp: de grootste letter die past; past alles, dan de gewone maat; past niets, dan het minimum", () => {
  // Een titel die bij 0,8 van drie naar twee regels gaat en pas onder 0,55 op de plaat past (zoals een lange naam op het winstscherm).
  const k = zoekKrimp((x) => x <= 0.55, 0.3);
  expect(k).toBeLessThanOrEqual(0.55);
  expect(k).toBeGreaterThan(0.54);
  expect(zoekKrimp(() => true, 0.3)).toBe(1);
  expect(zoekKrimp(() => false, 0.3)).toBe(0.3);
});

test("getallen in de taal van de Speler; een Rating krijgt pas vanaf vijf cijfers een scheidingsteken", () => {
  expect(getal(2093, "en")).toBe("2,093");
  expect(getal(2093, "de")).toBe("2.093");
  expect(getal(1.8734, "en", 1)).toBe("1.9");
  expect(ratingGetal(2417, "en")).toBe("2417");
  expect(ratingGetal(12417, "en")).toBe("12,417");
});

test("metNaam deelt een zin rond de Spelersnaam, ook als de naam in een andere taal ergens anders staat", async () => {
  expect(metNaam("challenge.incoming", "Anna")).toEqual(["", "Anna", " challenges you"]);
  expect(metNaam("common.nameYou", "Anna")).toEqual(["", "Anna", " (you)"]);
  await zetTaal("de", false);
  const [voor, naam, na] = metNaam("common.nameYou", "Anna");
  expect(voor + naam + na).toBe("Anna (du)");
  expect(naam).toBe("Anna");
});

test("tafellagen: alleen het laatst geopende scherm stuurt naar het 3D-bord; sluit het, dan komt het scherm eronder terug", () => {
  const potje = neemLaag();
  expect(bovenop(potje)).toBe(true);
  const feest = neemLaag();
  expect([bovenop(potje), bovenop(feest)]).toEqual([false, true]);
  laatLaag(feest);
  expect(bovenop(potje)).toBe(true);
  // Een schermwissel: het nieuwe scherm opent voor het oude sluit; het oude neemt dan niets meer terug.
  const nieuw = neemLaag();
  laatLaag(potje);
  expect(bovenop(nieuw)).toBe(true);
  laatLaag(nieuw);
});

test("tafellagen: het winstscherm (laag 1) blijft bovenop, ook als het Potje er pas na komt", () => {
  const feest = neemLaag(1);
  const potje = neemLaag();
  expect([bovenop(feest), bovenop(potje)]).toEqual([true, false]);
  laatLaag(feest);
  expect(bovenop(potje)).toBe(true);
  laatLaag(potje);
});
