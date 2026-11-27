/**
 * Het tekenvlak voor de platen: een Canvas 2D in de browser (OffscreenCanvas, of een gewoon canvas), en in de tests
 * een canvas van Node (zetDoekMaker). De module weet niet welke; ze vraagt alleen een vlak en leest daarna de beeldpunten.
 */
export type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
export type Doek = { ctx: Ctx; beeldpunten: () => Uint8ClampedArray };
export type DoekMaker = (breedte: number, hoogte: number) => Doek;

const browserDoek: DoekMaker = (breedte, hoogte) => {
  if (typeof OffscreenCanvas !== "undefined") {
    const c = new OffscreenCanvas(breedte, hoogte);
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas 2D is niet beschikbaar");
    return { ctx, beeldpunten: () => ctx.getImageData(0, 0, breedte, hoogte).data };
  }
  const c = document.createElement("canvas");
  c.width = breedte;
  c.height = hoogte;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D is niet beschikbaar");
  return { ctx, beeldpunten: () => ctx.getImageData(0, 0, breedte, hoogte).data };
};

let maker: DoekMaker = browserDoek;
/** Voor tests: een ander tekenvlak (bijvoorbeeld uit @napi-rs/canvas). */
export function zetDoekMaker(m: DoekMaker | null) {
  maker = m ?? browserDoek;
}
export const maakDoek: DoekMaker = (b, h) => maker(b, h);
