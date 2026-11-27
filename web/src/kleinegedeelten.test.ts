import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { afterEach, expect, test, vi } from "vitest";
import Chat from "./Chat.svelte";
import Laden from "./Laden.svelte";
import Steentje from "./Steentje.svelte";
import { GOUD, LAK_STENEN } from "./lak";

// Taak 189: de kleine onderdelen in de kleuren van uiterlijk 1b (lak, goud, porselein); geen aqua of limoen.
afterEach(cleanup);

test("een kraal van een Steentje heeft de kleur van de lak en een gouden randje", () => {
  const { container } = render(Steentje, { speler: 1, maat: 9, stip: true });
  const stip = container.querySelector(".stip") as HTMLElement;
  expect(stip.style.getPropertyValue("--k")).toBe(LAK_STENEN[1].kleur);
  expect(stip.style.getPropertyValue("--rand")).toBe(GOUD.midden);
});

test("een Steentje is een Steen van lak met een gouden bies en zijn teken", () => {
  const { container } = render(Steentje, { speler: 0, maat: 24 });
  const svg = container.querySelector("svg.pion")!;
  expect(svg.querySelector(`circle[fill="${LAK_STENEN[0].kleur}"]`)).not.toBeNull();
  expect(svg.querySelector(`[stroke="${GOUD.licht}"]`)).not.toBeNull();
  expect(svg.getAttribute("aria-hidden")).toBe("true");
});

test("het laden zegt het in tekst voor schermlezers en toont drie kralen van lak", () => {
  const { container } = render(Laden);
  expect(screen.getByRole("status").textContent).toMatch(/\w/);
  const kralen = Array.from(container.querySelectorAll<HTMLElement>(".stip"));
  expect(kralen.map((k) => k.style.getPropertyValue("--k"))).toEqual(LAK_STENEN.slice(0, 3).map((s) => s.kleur));
});

test("de Chat opent met een tik en ligt op porselein; sluiten kan met de knop", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => Response.json([])));
  render(Chat, { potjeId: 1, snel: false, berichten: [], mijnPlek: 1, sleutel: "k", stuurBericht: async () => {} });
  await fireEvent.click(screen.getByRole("button", { name: /^Chat/ }));
  const blad = await screen.findByRole("dialog", { name: "Chat" });
  expect(blad.classList.contains("porselein")).toBe(true);
  await fireEvent.click(screen.getByRole("button", { name: "Close chat" }));
  expect(screen.queryByRole("dialog", { name: "Chat" })).toBeNull();
  vi.unstubAllGlobals();
});

test.each([
  ["iOS, toetsenbord open", true, true],
  ["iOS, toetsenbord dicht (iPad-venster lager)", true, false],
  ["buiten iOS", false, false],
])("Chat-lijst wordt lager: %s", async (_, ios, open) => {
  vi.stubGlobal("fetch", vi.fn(async () => Response.json([])));
  const html = document.documentElement;
  html.classList.toggle("boven-toetsenbord", ios);
  const kijkers: { f: () => void; el: Element[] }[] = [];
  vi.stubGlobal(
    "ResizeObserver",
    class {
      k: { f: () => void; el: Element[] };
      constructor(f: () => void) {
        this.k = { f, el: [] };
        kijkers.push(this.k);
      }
      observe(el: Element) {
        this.k.el.push(el);
      }
      disconnect() {}
    },
  );
  const berichten = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, plek: 2, speler_id: 9, spelersnaam: "Ana", tekst: `b${i}`, tijd: i }));
  render(Chat, { potjeId: 1, snel: false, berichten, mijnPlek: 1, sleutel: "k", stuurBericht: async () => {} });
  await fireEvent.click(screen.getByRole("button", { name: /^Chat/ }));
  const blad = await screen.findByRole("dialog", { name: "Chat" });
  const ul = blad.querySelector("ul.schuif") as HTMLElement;
  const kijker = kijkers.find((k) => k.el.includes(ul));
  let hoog = 400;
  let top = 600;
  Object.defineProperty(ul, "scrollHeight", { get: () => 1000 });
  Object.defineProperty(ul, "clientHeight", { get: () => hoog });
  Object.defineProperty(ul, "scrollTop", { get: () => top, set: (v: number) => (top = Math.min(v, 1000 - hoog)) });
  kijker?.f(); // de eerste meting, zoals een echte ResizeObserver bij observe
  // Onderaan. Het toetsenbord maakt de lijst 150 px lager; een scroll-event van het scrollen naar onderen komt pas daarna.
  hoog = 250;
  ul.dispatchEvent(new Event("scroll"));
  html.classList.toggle("toetsenbord-open", open);
  kijker?.f();
  // Alleen op iOS met het toetsenbord open schuift de lijst mee; anders blijft de scrollpositie staan, zoals altijd.
  expect(top).toBe(ios && open ? 750 : 600);
  if (ios && open) {
    // Toetsenbord dicht: de lijst groeit, de browser begrenst scrollTop en dat scroll-event komt vóór de meting.
    const dicht = () => {
      html.classList.remove("toetsenbord-open");
      hoog = 400;
      top = 600;
      ul.dispatchEvent(new Event("scroll"));
      kijker?.f();
    };
    const weerOpen = () => {
      hoog = 250;
      html.classList.add("toetsenbord-open");
      kijker?.f();
    };
    dicht();
    weerOpen();
    // Nog steeds onderaan: de lijst gaat weer mee naar onderen.
    expect(top).toBe(750);
    // Dicht, de Speler scrolt omhoog om iets terug te lezen, weer open: de lijst blijft staan.
    dicht();
    top = 100;
    ul.dispatchEvent(new Event("scroll"));
    weerOpen();
    expect(top).toBe(100);
  }
  html.classList.remove("boven-toetsenbord", "toetsenbord-open");
  vi.unstubAllGlobals();
});
