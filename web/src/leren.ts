import { leesSpeler } from "./online";

/**
 * De vraag "Learn to play?" (taak 157): één keer, na het kiezen van een nieuwe Spelersnaam.
 * Het toestel onthoudt dat de vraag al gesteld is (geen server). Een Speler die al een Spelersnaam
 * had vóór deze versie telt als "al gevraagd", zodat die de vraag nooit krijgt.
 */
export const LEREN_OPSLAG = "leapstone.leren.gevraagd";

function gevraagd(): boolean {
  try {
    return localStorage.getItem(LEREN_OPSLAG) !== null;
  } catch {
    // Opslag werkt niet: liever nooit vragen.
    return true;
  }
}

function onthoud() {
  try {
    localStorage.setItem(LEREN_OPSLAG, "1");
  } catch {
    // Dan vraagt gevraagd() toch niet.
  }
}

/** Bij het starten van de app: wie al een Spelersnaam heeft, krijgt de vraag nooit. */
export function merkBestaandeSpeler(): void {
  if (!gevraagd() && leesSpeler() !== null) onthoud();
}

/** Mag de vraag nu? Zo ja, dan onthoudt dit meteen dat hij gesteld is: hij komt nooit terug. */
export function neemVraagLeren(): boolean {
  if (gevraagd()) return false;
  onthoud();
  return true;
}
