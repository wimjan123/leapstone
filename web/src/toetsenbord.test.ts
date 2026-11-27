// Na het toetsenbord zet de app de pagina terug naar boven (bug van 2026-11-19, `toetsenbord.ts`).
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { ANDROID_TOETSENBORD, houdTafelStil, schuifBovenToetsenbord, schuifVoor, toetsenbordSchuif, zetTerugNaToetsenbord } from "./toetsenbord";

let uit: () => void;
let schuif: ReturnType<typeof vi.spyOn>;
/** Het zichtbare deel van de pagina (jsdom heeft er geen): een hoogte en een resize-melding. */
const zicht = Object.assign(new EventTarget(), { height: 844, scale: 1, offsetTop: 0 });
const wordHoog = (px: number, scale = 1) => {
  zicht.height = px;
  zicht.scale = scale;
  zicht.dispatchEvent(new Event("resize"));
};
beforeEach(() => {
  vi.useFakeTimers();
  zicht.height = 844;
  zicht.scale = 1;
  Object.defineProperty(window, "innerHeight", { value: 844, configurable: true });
  Object.defineProperty(window, "visualViewport", { value: zicht, configurable: true });
  document.body.innerHTML = `<input id="naam" /><input id="code" type="text" /><input id="vink" type="checkbox" /><button id="knop">Continue</button>`;
  schuif = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  uit = zetTerugNaToetsenbord(window);
});
afterEach(() => {
  uit();
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const el = (id: string) => document.getElementById(id) as HTMLElement;

test("een tekstveld verlaten (toetsenbord dicht): meteen terug naar boven, en nog eens als het toetsenbord dicht is", () => {
  el("naam").focus();
  el("naam").blur();
  vi.advanceTimersByTime(1);
  expect(schuif).toHaveBeenCalledTimes(1);
  expect(schuif).toHaveBeenLastCalledWith(0, 0);
  // iOS verschuift de pagina soms pas als het toetsenbord helemaal weg is (ongeveer 250 ms): dan nog eens.
  vi.advanceTimersByTime(300);
  expect(schuif).toHaveBeenCalledTimes(2);
  vi.advanceTimersByTime(400);
  expect(schuif).toHaveBeenCalledTimes(3);
  vi.advanceTimersByTime(5000);
  expect(schuif).toHaveBeenCalledTimes(3);
});

test("naar een ander tekstveld (toetsenbord blijft open), of een vinkje of knop verlaten: de pagina blijft staan", () => {
  el("knop").focus();
  el("knop").blur();
  el("vink").focus();
  el("vink").blur();
  vi.advanceTimersByTime(1000);
  el("naam").focus();
  el("code").focus();
  vi.advanceTimersByTime(1000);
  expect(schuif).not.toHaveBeenCalled();
});

test("het toetsenbord sluit terwijl het veld de focus houdt (iPad): terug, ook als de hoogte pas na de melding klopt", () => {
  el("naam").focus();
  wordHoog(500); // toetsenbord open
  wordHoog(560); // werkbalk van Safari, toetsenbord nog open
  vi.advanceTimersByTime(1000);
  expect(schuif).not.toHaveBeenCalled();
  // De melding komt met de oude hoogte; de echte hoogte volgt zonder nieuwe melding.
  wordHoog(560);
  vi.advanceTimersByTime(1);
  expect(schuif).not.toHaveBeenCalled();
  zicht.height = 844;
  vi.advanceTimersByTime(1000);
  expect(schuif).toHaveBeenCalledTimes(2);
  expect(document.activeElement).toBe(el("naam"));
});

test("toetsenbord weer open, een groter venster met het toetsenbord open, of uitzoomen: niets terug", () => {
  el("naam").focus();
  wordHoog(500);
  wordHoog(844); // dicht
  vi.advanceTimersByTime(1);
  expect(schuif).toHaveBeenCalledTimes(1);
  wordHoog(500); // meteen weer open: de late pogingen gaan niet door
  vi.advanceTimersByTime(1000);
  expect(schuif).toHaveBeenCalledTimes(1);
  // Het venster van de iPad wordt groter terwijl het toetsenbord open blijft.
  Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
  wordHoog(656);
  vi.advanceTimersByTime(1000);
  expect(schuif).toHaveBeenCalledTimes(1);
  // Uitzoomen: de schaal is niet gewoon.
  Object.defineProperty(window, "innerHeight", { value: 844, configurable: true });
  wordHoog(400, 2);
  wordHoog(844, 1.5);
  vi.advanceTimersByTime(1000);
  expect(schuif).toHaveBeenCalledTimes(1);
});

// Boven het toetsenbord (bug van 2026-11-20): het veld voor de Spelersnaam lag onder het toetsenbord.
const open = { boven: 0, onder: 500, schaal: 1, venster: 844 };
test("schuifVoor: zo ver omhoog dat het formulier boven het toetsenbord staat, nooit zo ver dat het veld boven wegvalt", () => {
  // Toetsenbord dicht: alles past, niet schuiven.
  expect(schuifVoor({ boven: 560, onder: 600 }, 640, { ...open, onder: 844 })).toBe(0);
  // Dicht, en het formulier eindigt op de schermrand (de Chat onderaan): ook niet voor de marge.
  expect(schuifVoor({ boven: 790, onder: 830 }, 844, { ...open, onder: 844 })).toBe(0);
  // Open, en iOS heeft wat in beeld is omlaag verschoven (417 hoog vanaf 380): het toetsenbord telt wel.
  expect(schuifVoor({ boven: 560, onder: 600 }, 640, { ...open, boven: 380, onder: 797 })).toBe(0);
  expect(schuifVoor({ boven: 700, onder: 740 }, 830, { ...open, boven: 380, onder: 797 })).toBe(45);
  // Open: de onderkant van het formulier (640) moet boven 500, met 12 px ruimte.
  expect(schuifVoor({ boven: 560, onder: 600 }, 640, open)).toBe(152);
  // Een hoog formulier: niet verder dan tot het veld 12 px onder de bovenkant staat.
  expect(schuifVoor({ boven: 100, onder: 140 }, 900, open)).toBe(88);
  // Krap: het veld staat 8 px onder de bovenkant en de zin eronder valt 6 px achter het toetsenbord. Met marges past het niet,
  // zonder wel: precies 6 px.
  expect(schuifVoor({ boven: 108, onder: 148 }, 506, { ...open, boven: 100 })).toBe(6);
  // Heel weinig ruimte (60 px) voor een veld van 56 px: het hele veld in beeld, ook al gaat de marge eraf.
  expect(schuifVoor({ boven: 20, onder: 76 }, 100, { ...open, boven: 0, onder: 60 })).toBe(16);
  // Het veld is hoger dan wat in beeld is: zijn bovenkant boven in beeld.
  expect(schuifVoor({ boven: 20, onder: 120 }, 140, { ...open, boven: 0, onder: 60 })).toBe(20);
  // iOS schoof wat in beeld is omlaag (vanaf 380) en het veld begint op 360: 20 px omlaag.
  expect(schuifVoor({ boven: 360, onder: 400 }, 420, { ...open, boven: 380, onder: 797 })).toBe(-20);
  // Het veld staat al boven in beeld: niet omlaag schuiven.
  expect(schuifVoor({ boven: 5, onder: 45 }, 900, open)).toBe(0);
  // Ingezoomd op 125% zonder toetsenbord: in beeld is 675 hoog, op het scherm 844. Niet schuiven.
  expect(schuifVoor({ boven: 560, onder: 600 }, 700, { boven: 100, onder: 775, schaal: 1.25, venster: 844 })).toBe(0);
  // Ingezoomd op 125% met het toetsenbord open (in beeld 400 hoog vanaf 100): de zin onder het veld komt erboven.
  expect(schuifVoor({ boven: 420, onder: 460 }, 540, { boven: 100, onder: 500, schaal: 1.25, venster: 844 })).toBe(52);
});

test("schuifBovenToetsenbord: een veld met focus en het toetsenbord open schuift de app omhoog; dicht of weg weer terug", () => {
  uit();
  const zetUit = schuifBovenToetsenbord(window);
  const app = document.createElement("div");
  app.id = "app";
  document.body.append(app);
  // De app staat waar de overgang nu is (niet altijd op het doel); het veld staat mee verschoven.
  let nu = 0;
  vi.spyOn(app, "getBoundingClientRect").mockImplementation(() => ({ top: -nu }) as DOMRect);
  vi.spyOn(el("naam"), "getBoundingClientRect").mockImplementation(() => ({ top: 560 - nu, bottom: 600 - nu }) as DOMRect);
  const waarde = () => document.documentElement.style.getPropertyValue("--toetsenbord-schuif");
  el("naam").focus();
  vi.advanceTimersByTime(1000);
  expect(toetsenbordSchuif()).toBe(0);
  wordHoog(500); // toetsenbord open
  expect(toetsenbordSchuif()).toBe(112);
  expect(waarde()).toBe("112px");
  // Een blad van onderen (de Chat) krijgt de hoogte van wat in beeld is.
  const zichtWaarde = () => document.documentElement.style.getPropertyValue("--toetsenbord-zicht");
  expect(zichtWaarde()).toBe("500px");
  expect(document.documentElement.classList.contains("toetsenbord-open")).toBe(true);
  // Midden in de overgang (40 van de 112 px) nog eens meten: het doel blijft 112.
  nu = 40;
  wordHoog(500);
  expect(toetsenbordSchuif()).toBe(112);
  nu = 112;
  wordHoog(500);
  expect(toetsenbordSchuif()).toBe(112);
  wordHoog(844); // toetsenbord dicht, de focus blijft in het veld
  expect(toetsenbordSchuif()).toBe(0);
  expect(zichtWaarde()).toBe("");
  expect(document.documentElement.classList.contains("toetsenbord-open")).toBe(false);
  wordHoog(500);
  expect(toetsenbordSchuif()).toBe(112);
  // iPad: de melding van het dichtgaan komt met de oude hoogte, de echte hoogte volgt zonder melding.
  wordHoog(500);
  zicht.height = 844;
  vi.advanceTimersByTime(1000);
  expect(toetsenbordSchuif()).toBe(0);
  wordHoog(500);
  el("naam").blur();
  vi.advanceTimersByTime(1);
  expect(toetsenbordSchuif()).toBe(0);
  expect(document.documentElement.classList.contains("boven-toetsenbord")).toBe(true);
  zetUit();
  expect(document.documentElement.classList.contains("boven-toetsenbord")).toBe(false);
  uit = () => {};
});

test("schuifBovenToetsenbord in de Android-app: de gemelde plek van het toetsenbord schuift de app, zonder dubbel te tellen", () => {
  uit();
  const zetUit = schuifBovenToetsenbord(window);
  vi.spyOn(el("naam"), "getBoundingClientRect").mockImplementation(() => ({ top: 560, bottom: 600 }) as DOMRect);
  const meld = (hoogte: number) => window.dispatchEvent(new CustomEvent(ANDROID_TOETSENBORD, { detail: { hoogte, venster: 844 } }));
  const zichtWaarde = () => document.documentElement.style.getPropertyValue("--toetsenbord-zicht");
  el("naam").focus();
  vi.advanceTimersByTime(1000);
  expect(toetsenbordSchuif()).toBe(0);
  // Android meldt 344 px toetsenbord; het venster en het zichtbare deel blijven 844 hoog.
  meld(344);
  expect(toetsenbordSchuif()).toBe(112);
  expect(zichtWaarde()).toBe("500px");
  // Een nieuwere WebView maakt het zichtbare deel zelf al 344 px kleiner: dan niet nog eens aftrekken.
  wordHoog(500);
  expect(toetsenbordSchuif()).toBe(112);
  expect(zichtWaarde()).toBe("500px");
  // Ingezoomd (schaal 2, het zichtbare deel 422 px van de pagina): 344 px op het scherm is 172 px van de pagina.
  wordHoog(422, 2);
  expect(zichtWaarde()).toBe("250px");
  wordHoog(844, 1);
  // Android meldt een hoger venster (900) dan de pagina nu kent (844, de layout volgt nog): het toetsenbord begint dan op 556, dus
  // ligt er 288 px over de pagina en schuift de app 56 px (44 plus de marge), niet 112.
  window.dispatchEvent(new CustomEvent(ANDROID_TOETSENBORD, { detail: { hoogte: 344, venster: 900 } }));
  expect(toetsenbordSchuif()).toBe(56);
  // Toetsenbord dicht: terug.
  meld(0);
  expect(toetsenbordSchuif()).toBe(0);
  expect(zichtWaarde()).toBe("");
  // Een laag toetsenbord (110 px, onder de drempel van 120 voor Safari) dat Android meldt, telt ook: het veld eindigt op 780 en
  // het toetsenbord begint op 734, dus 46 px plus de marge omhoog.
  vi.spyOn(el("naam"), "getBoundingClientRect").mockImplementation(() => ({ top: 740, bottom: 780 }) as DOMRect);
  meld(110);
  expect(toetsenbordSchuif()).toBe(58);
  meld(0);
  expect(toetsenbordSchuif()).toBe(0);
  // Een melding zonder veld met focus schuift niets.
  el("naam").blur();
  meld(344);
  expect(toetsenbordSchuif()).toBe(0);
  zetUit();
  // Uitgezet: een melding doet niets meer.
  el("naam").focus();
  meld(344);
  expect(toetsenbordSchuif()).toBe(0);
  uit = () => {};
});

test("schuifBovenToetsenbord: groeit het formulier terwijl het veld de focus heeft, dan schuift de app verder", () => {
  uit();
  let groei: () => void = () => {};
  const gevolgd: Element[] = [];
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(f: () => void) {
        groei = f;
      }
      observe(el: Element) {
        gevolgd.push(el);
      }
      disconnect() {}
    },
  );
  document.body.innerHTML = `<form><input id="vriend" /></form>`;
  const zetUit = schuifBovenToetsenbord(window);
  let onder = 600;
  vi.spyOn(el("vriend"), "getBoundingClientRect").mockImplementation(() => ({ top: 560, bottom: 600 }) as DOMRect);
  vi.spyOn(document.querySelector("form")!, "getBoundingClientRect").mockImplementation(() => ({ top: 540, bottom: onder }) as DOMRect);
  el("vriend").focus();
  expect(gevolgd).toEqual([document.querySelector("form")]);
  wordHoog(500);
  expect(toetsenbordSchuif()).toBe(112);
  // De gevonden Vriend en Add komen eronder: het formulier wordt 60 px hoger.
  onder = 660;
  groei();
  expect(toetsenbordSchuif()).toBe(172);
  // De lijst om het formulier schuift 20 px omhoog (scrollen in de lijst): de app hoeft 20 px minder.
  onder = 640;
  document.body.dispatchEvent(new Event("scroll"));
  expect(toetsenbordSchuif()).toBe(152);
  zetUit();
  vi.unstubAllGlobals();
  uit = () => {};
});

test("houdTafelStil: de tafel stopt waar hij nu echt staat, en gaat na het loslaten naar wat de app intussen wilde", () => {
  uit();
  const zetUit = schuifBovenToetsenbord(window);
  const app = document.createElement("div");
  app.id = "app";
  document.body.append(app);
  let nu = 0;
  vi.spyOn(app, "getBoundingClientRect").mockImplementation(() => ({ top: -nu }) as DOMRect);
  vi.spyOn(el("naam"), "getBoundingClientRect").mockImplementation(() => ({ top: 560 - nu, bottom: 600 - nu }) as DOMRect);
  el("naam").focus();
  wordHoog(500);
  expect(toetsenbordSchuif()).toBe(112);
  // Midden in de overgang (40 px) komt een vinger op het bord: de tafel stopt op 40.
  nu = 40;
  const los = houdTafelStil();
  expect(toetsenbordSchuif()).toBe(40);
  // Het toetsenbord gaat dicht terwijl de vinger erop staat: de tafel blijft staan.
  wordHoog(844);
  expect(toetsenbordSchuif()).toBe(40);
  los();
  expect(toetsenbordSchuif()).toBe(0);
  zetUit();
  uit = () => {};
});

test("schuifBovenToetsenbord: in een lijst die zelf schuift telt alleen wat erin te zien is; schuift het veld eruit, dan blijft de tafel staan", () => {
  uit();
  document.body.innerHTML = `<div id="lijst" style="overflow-y: auto"><form><input id="vriend" /></form></div>`;
  const zetUit = schuifBovenToetsenbord(window);
  let veldBoven = 400;
  vi.spyOn(el("lijst"), "getBoundingClientRect").mockImplementation(() => ({ top: 300, bottom: 700 }) as DOMRect);
  vi.spyOn(el("vriend"), "getBoundingClientRect").mockImplementation(() => ({ top: veldBoven, bottom: veldBoven + 40 }) as DOMRect);
  vi.spyOn(document.querySelector("form")!, "getBoundingClientRect").mockImplementation(() => ({ top: veldBoven - 20, bottom: veldBoven + 60 }) as DOMRect);
  el("vriend").focus();
  wordHoog(500);
  // Het formulier (tot 460) past al met marge boven het toetsenbord (500): niets.
  expect(toetsenbordSchuif()).toBe(0);
  // De Speler scrolt de lijst: het veld zakt naar 520..560, het formulier tot 580 (de lijst knipt op 700). Omhoog tot 580 + 12.
  veldBoven = 520;
  document.body.dispatchEvent(new Event("scroll"));
  expect(toetsenbordSchuif()).toBe(92);
  // De Speler scrolt het veld boven uit de lijst (250..290, de lijst begint op 300): de tafel blijft staan.
  veldBoven = 250;
  document.body.dispatchEvent(new Event("scroll"));
  expect(toetsenbordSchuif()).toBe(92);
  // Daarna gaat het toetsenbord dicht terwijl het veld de focus houdt (iPad): terug.
  wordHoog(844);
  expect(toetsenbordSchuif()).toBe(0);
  zetUit();
  uit = () => {};
});
