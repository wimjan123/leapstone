/** Waar draait deze build: als web-app (relatieve adressen) of als native app (vast serveradres). */

declare const __HALMA_APP__: boolean;

/** Het adres van de server van Leapstone (Cloudflare Worker). Instelbaar bij het bouwen met `VITE_HALMA_SERVER`. */
export const STANDAARD_SERVER = "https://leapstone.visser-william.workers.dev";

/** True in de native app (Tauri), false in de web-app en in tests. */
export const IS_APP: boolean = typeof __HALMA_APP__ !== "undefined" && __HALMA_APP__;

/** Voorvoegsel voor elk /api-adres: leeg in de web-app, het serveradres in de native app. */
export const SERVER: string = IS_APP
  ? (import.meta.env.VITE_HALMA_SERVER || STANDAARD_SERVER).replace(/\/+$/, "")
  : "";

/** Het adres van de Uitnodigingen: altijd het serveradres, ook in de app (daar is de eigen oorsprong tauri.localhost). */
export const LINK_BASIS: string = IS_APP ? SERVER : location.origin;

/** Het adres van het spel zelf: /play/ op de site (op / staat de Landingspagina), / in de native app. */
export const SPEL_PAD: string = IS_APP ? "/" : "/play/";
