/**
 * Getallen zoals de taal van de Speler ze schrijft (taak 284): "2,093" in het Engels, "2.093" in het Duits, "2 093" in het Fins.
 * Een Rating krijgt pas een scheidingsteken vanaf vijf cijfers (`min2`): 2417 blijft 2417, zoals op de naamplaat en het winstscherm.
 */
export function getal(n: number, taal: string, cijfers = 0): string {
  return n.toLocaleString(taal, { maximumFractionDigits: cijfers, minimumFractionDigits: cijfers });
}

export function ratingGetal(n: number, taal: string): string {
  return n.toLocaleString(taal, { maximumFractionDigits: 0, useGrouping: "min2" } as Intl.NumberFormatOptions);
}
