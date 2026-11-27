/**
 * Werkt het 3D-bord hier niet (een fout, of Bevy tekent na `GEDULD_MS` nog niets)? Dan toont `App.svelte` het foutscherm met
 * "Try again" in plaats van de tafel (feature 251: er is geen plat scherm meer). Reactief, zodat de app meteen wisselt.
 */
let mislukt = $state(false);

export const drieFout = {
  get mislukt(): boolean {
    return mislukt;
  },
  markeer(): void {
    mislukt = true;
  },
  /** Alleen voor tests (`nep-bord3d.ts`): een verse pagina, waar 3D nog niet mislukt is. */
  herstel(): void {
    mislukt = false;
  },
};

/** Wat de console zegt als het 3D-bord niet in de build zit (de dev-server en `vite build` zeggen het ook, zie vite.config.ts). */
export const BOUW_MELDING =
  "Leapstone: het 3D-bord zit niet in deze build (web/src/wasm3d ontbreekt). Zonder 3D-bord is er alleen het foutscherm. Bouw het met `npm --prefix web run wasm3d:snel` (werk) of `npm --prefix web run wasm3d` (uitrol).";
