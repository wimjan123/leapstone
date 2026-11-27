/**
 * Is dit een breed scherm (een computer, een tablet liggend; `BREED` in voorwerpen.ts)? Dan liggen de tafels met het bord links en de
 * rest als kolom rechts (taak 206 voor het Startmenu, taak 236 voor de andere schermen). Eén luisteraar voor de hele app, gezet bij
 * het laden (in een `$derived` mag geen state veranderen); zonder `matchMedia` (tests) is het altijd de opstelling van de telefoon.
 */
import { BREED } from "./voorwerpen";

function lijst(): MediaQueryList | null {
  try {
    return typeof matchMedia === "function" ? matchMedia(BREED) : null;
  } catch {
    return null;
  }
}

const mq = lijst();
let aan = $state(mq?.matches === true);
mq?.addEventListener?.("change", () => (aan = mq.matches));

/** Breed scherm? Reactief: verandert het venster, dan verandert dit mee. */
export function isBreed(): boolean {
  return aan;
}
