import { fireEvent, screen } from "@testing-library/svelte";

/** Tests: vanuit het hoofdmenu naar de keuze van de spelers (stap 2), op dit bord. */
export async function naarSpelers(bord: "Star board" | "Square board" = "Star board") {
  // De eerste keer wacht het Startmenu op de laadtafel (taak 223): de knoppen komen als de tafel klaar is.
  await fireEvent.click(await screen.findByRole("button", { name: "Play on this phone" }));
  await fireEvent.click(await screen.findByRole("button", { name: bord }));
}

/** Tests: vanuit het hoofdmenu naar het scherm "Computer". */
export async function naarComputer() {
  await fireEvent.click(await screen.findByRole("button", { name: "Play against the computer" }));
}

/** Het label van de keuze "zoveel Computers" op de tafel (de HTML-knop op de keuzebalk). */
export const computers = (n: number) => new RegExp(`^${n} computers?$`);
