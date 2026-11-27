/**
 * Een teken dat een lijst op de plaat verder schuift (taak 233): een gouden ronde knop met een pijltje onderaan (er is meer) of
 * bovenaan (je bent al een stuk gezakt). Anders is een half afgekapte rij op het papier niet te onderscheiden van een kapotte rij.
 * Gebruik: `use:schuifteken` op het vlak dat de lijst(en) omsluit (`position: fixed` of `relative`).
 * Taak 240 (council ronde 2): het teken ligt altijd helemaal binnen het vlak (op een breed scherm lag het eronder, buiten de plaat, en
 * was er geen teken te zien), en een tik erop schuift de lijst een stuk verder. Een teken dat over een rij ligt en niets doet, leek
 * een knop die kapot is. Het blijft `aria-hidden`: een schermlezer en het toetsenbord schuiven de lijst zelf.
 */
const SCHUIVERS = ".schuif, .blad, [data-scrollt]";
const MARGE = 3;
/** Taak 278: de strook onder een lijst die schuift (teken van 30 px plus lucht). De tekens liggen in die strook, dus nooit over tekst. */
export const STROOK = 36;

export type Meer = { boven: boolean; onder: boolean };

/** Kan deze lijst nog verder schuiven, en welke kant op? (Zuivere rekenregel, getest.) */
export function meerVan(scrollTop: number, clientHeight: number, scrollHeight: number): Meer {
  if (scrollHeight - clientHeight <= MARGE) return { boven: false, onder: false };
  return { boven: scrollTop > MARGE, onder: scrollTop + clientHeight < scrollHeight - MARGE };
}

/** Hoeveel een tik op het teken schuift, als deel van de zichtbare hoogte: een stuk, met een deel van wat je al zag erbij. */
const STAP = 0.8;

/** Waar de lijst heen schuift na een tik op het teken (naar beneden of naar boven), nooit voorbij het begin of het eind. (Zuivere rekenregel, getest.) */
export function schuifNaar(scrollTop: number, clientHeight: number, scrollHeight: number, omlaag: boolean): number {
  const doel = scrollTop + (omlaag ? 1 : -1) * clientHeight * STAP;
  return Math.max(0, Math.min(scrollHeight - clientHeight, doel));
}

function schuifbaar(el: HTMLElement): boolean {
  const o = getComputedStyle(el).overflowY;
  return o === "auto" || o === "scroll";
}

export function schuifteken(vlak: HTMLElement) {
  // Zonder waarnemers (een test-omgeving zonder layout) is er niets te meten.
  if (typeof ResizeObserver === "undefined" || typeof MutationObserver === "undefined") return {};
  const tekens: HTMLElement[] = [];
  // Lijsten die onderaan een strook vrij houden voor de tekens (taak 278), met hun eigen marge van vóór dat.
  const strook = new Map<HTMLElement, string>();
  const geef = (el: HTMLElement) => { const oud = strook.get(el); if (oud !== undefined) { el.style.marginBottom = oud; strook.delete(el); } };
  let bezig = false;

  function teken(boven: boolean, x: number, y: number, lijst: HTMLElement): HTMLElement {
    const s = document.createElement("span");
    s.className = `schuifteken ${boven ? "boven" : "onder"}`;
    s.setAttribute("aria-hidden", "true");
    s.dataset.schuifteken = boven ? "boven" : "onder";
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.addEventListener("click", () => {
      const reduceer = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
      lijst.scrollTo({ top: schuifNaar(lijst.scrollTop, lijst.clientHeight, lijst.scrollHeight, !boven), behavior: reduceer ? "auto" : "smooth" });
    });
    vlak.appendChild(s);
    return s;
  }

  function bijwerken() {
    bezig = false;
    for (const s of tekens.splice(0)) s.remove();
    const v = vlak.getBoundingClientRect();
    // Een lijst in een lijst (`.blad` met een `.schuif` erin) schuift in de binnenste: alleen die krijgt een teken, anders liggen er twee op elkaar.
    const schuivers = [...vlak.querySelectorAll<HTMLElement>(SCHUIVERS)].filter(schuifbaar);
    const wel = (el: HTMLElement) => {
      const meer = meerVan(el.scrollTop, el.clientHeight, el.scrollHeight);
      return (meer.boven || meer.onder) && el.getBoundingClientRect().height >= 60;
    };
    const lijsten = schuivers.filter(wel);
    // Alleen de binnenste lijst krijgt tekens (anders liggen er twee op elkaar) en een strook.
    const binnen = lijsten.filter((el) => !lijsten.some((ander) => ander !== el && el.contains(ander)));
    for (const el of [...strook.keys()]) if (!binnen.includes(el)) geef(el);
    // De strook is een marge onder de lijst: de lijst wordt korter, dus blijft schuifbaar en de tekens liggen buiten de tekst.
    for (const el of binnen) if (!strook.has(el)) { strook.set(el, el.style.marginBottom); el.style.marginBottom = `${STROOK}px`; }
    for (const el of binnen) {
      const meer = meerVan(el.scrollTop, el.clientHeight, el.scrollHeight);
      const r = el.getBoundingClientRect();
      // De tekens liggen in de strook onder de lijst, nooit buiten het vlak.
      const y = Math.min(r.bottom - v.top + 3, v.height - 33);
      const midden = r.left - v.left + r.width / 2;
      // Beide tekens naast elkaar in de strook: omhoog links, omlaag rechts.
      const naast = meer.boven && meer.onder;
      if (meer.onder) tekens.push(teken(false, naast ? midden + 20 : midden, y, el));
      if (meer.boven) tekens.push(teken(true, naast ? midden - 20 : midden, y, el));
    }
  }
  const plan = () => {
    if (bezig) return;
    bezig = true;
    requestAnimationFrame(bijwerken);
  };

  vlak.addEventListener("scroll", plan, true);
  const grootte = new ResizeObserver(plan);
  grootte.observe(vlak);
  const wijzig = new MutationObserver((l) => {
    // Onze eigen tekens veranderen niets aan de lijst: geen lus.
    if (l.every((m) => [...m.addedNodes, ...m.removedNodes].every((n) => n instanceof HTMLElement && n.classList.contains("schuifteken")))) return;
    plan();
  });
  wijzig.observe(vlak, { childList: true, subtree: true, characterData: true });
  plan();

  return {
    destroy() {
      vlak.removeEventListener("scroll", plan, true);
      grootte.disconnect();
      wijzig.disconnect();
      for (const s of tekens) s.remove();
      for (const el of [...strook.keys()]) geef(el);
    },
  };
}
