import type { TransitionConfig } from "svelte/transition";

/** Wil de Speler minder beweging? Dan verschijnen schermen meteen. */
export function minderBeweging(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Een scherm schuift zacht binnen: een beetje opzij (`richting` 1 = vooruit, -1 = terug) en vervagend.
 * Alleen een in-overgang, zodat er nooit twee schermen tegelijk ruimte innemen.
 *
 * Op de 3D-tafel (de laag met het bord staat aan) vervaagt het scherm alleen: zijn tekst ligt op de platen van de tafel, en die
 * schuiven niet opzij (UI-overgangen: de voorwerpen komen omhoog, de camera glijdt).
 */
export function binnen(_: Element, { richting = 1, duur = 320 }: { richting?: number; duur?: number } = {}): TransitionConfig {
  // Zonder Web Animations (oude browser, tests in jsdom) verschijnt het scherm meteen.
  if (minderBeweging() || typeof Element.prototype.animate !== "function") return { duration: 0 };
  const schuif = document.querySelector(".bord3d-laag.aan") ? 0 : 28 * richting;
  return {
    duration: duur,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    css: (t, u) => (schuif ? `opacity:${t};transform:translate3d(${(u * schuif).toFixed(2)}px,0,0)` : `opacity:${t}`),
  };
}

/**
 * De laadtafel gaat weg terwijl de tafel erachter invervaagt (taak 223): 260 ms, net zo lang als de laag met het 3D-bord er over
 * doet om weg te gaan, en ease-in. Met minder beweging, of zonder Web Animations, is hij meteen weg.
 */
export function laadtafelUit(_: Element): TransitionConfig {
  if (minderBeweging() || typeof Element.prototype.animate !== "function") return { duration: 0 };
  return { duration: 260, easing: (t) => t * t, css: (t) => `opacity:${t}` };
}
