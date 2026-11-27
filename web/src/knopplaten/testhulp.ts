// Alleen voor tests: een canvas en lettertypen van Node (@napi-rs/canvas), zodat de platen zonder browser te bakken zijn.
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import path from "node:path";
import { zetDoekMaker, zetLetterLader, type Ctx } from "./index";

export function zetNodeOmgeving() {
  zetDoekMaker((b, h) => {
    const c = createCanvas(b, h);
    const ctx = c.getContext("2d");
    return { ctx: ctx as unknown as Ctx, beeldpunten: () => new Uint8ClampedArray(ctx.getImageData(0, 0, b, h).data) };
  });
  zetLetterLader(async (familie, url) => {
    const bestand = path.join(process.cwd(), url.split("?")[0]);
    if (!GlobalFonts.registerFromPath(bestand, familie)) throw new Error("Lettertype niet geladen: " + bestand);
  });
}
