/**
 * Wie mag de 3D-tafel aansturen (taak 284). Er is één 3D-bord, en soms liggen twee schermen met voorwerpen tegelijk op de pagina:
 * het winstscherm (`FeestTafel`) boven het Potje dat eronder blijft staan, of twee schermen tijdens een schermwissel. Alleen het
 * bovenste (de hoogste laag, en daarin het laatst geopende dat nog open is) stuurt voorwerpen, plaatjes en plekken naar Bevy. Anders schoof het Potje zijn jade
 * aanwijzer (voorwerp 3) naar boven het bord, en op het winstscherm van een Snel potje is voorwerp 3 Back to start.
 *
 * De lijst zelf is geen $state: een scherm dat net opent of sluit, moet hem meteen goed lezen. `wissel` telt alleen, zodat elk
 * scherm in een effect opnieuw kijkt of het bovenop ligt (en zijn voorwerpen opnieuw stuurt als het weer bovenop komt).
 */
const lagen: { id: number; hoog: number }[] = [];
const wissel = $state({ n: 0 });
let volgende = 0;

/**
 * Een scherm opent. `hoog`: een scherm dat over een ander ligt (het winstscherm, 1) wint altijd van een gewoon scherm (0), ook als het
 * Potje eronder pas later op de pagina komt (een afgelopen Potje openen zet beide tegelijk neer). Bij gelijke hoogte wint het
 * laatst geopende. Geeft het nummer van het scherm.
 */
export function neemLaag(hoog = 0): number {
  const id = ++volgende;
  lagen.push({ id, hoog });
  // Het scherm dat tot nu toe bovenop lag, moet weten dat het dat niet meer is (het wacht dan ook niet meer op zijn tafel).
  wissel.n++;
  return id;
}

/** Een scherm sluit: het scherm eronder (als dit het bovenste was) komt weer bovenop. */
export function laatLaag(id: number): void {
  const i = lagen.findIndex((l) => l.id === id);
  if (i < 0) return;
  lagen.splice(i, 1);
  wissel.n++;
}

/** Ligt dit scherm bovenop? In een effect of de opmaak: kijkt opnieuw als er een scherm opent of sluit. */
export function bovenop(id: number): boolean {
  void wissel.n;
  let top: { id: number; hoog: number } | undefined;
  for (const l of lagen) if (!top || l.hoog >= top.hoog) top = l;
  return top?.id === id;
}
