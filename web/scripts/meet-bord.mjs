// Meet hoe goed tikken en slepen op het bord de bedoelde Zet geven (taak 168), met aanraking via CDP en een echte schermdichtheid.
//
//   npm --prefix web run meet-bord -- [--dpr=3] [--fracties=0.3,0.45] [--alleen=tik|sleep] [--richt] [--stenen=1|2|3] [--gpu] [--uit=map] [--poort=5199]
//   npm --prefix web run meet-bord -- --meting=kleur --gpu        ΔE00 tussen de zes Stenen op de render, Sterbord en Vierkant bord (taak 177)
//   npm --prefix web run meet-bord -- --meting=beeldtijd --gpu [--onbegrensd]   beelden per seconde tijdens stilstand en slepen (taak 177)
//   npm --prefix web run meet-bord -- --meting=zoom --gpu [--onbegrensd] [--cpu=4]   beelden bij knijpen, schuiven en stilstand ingezoomd (taak 186);
//                                                                    haperingen, browsertijd per beeld, knoppen en het punt onder de vingers (taak 190)
//   npm --prefix web run meet-bord -- --meting=startmenu --gpu [--onbegrensd]   het Startmenu als 3D-tafel (taak 178): tijd tot de tafel
//                                                                               staat, beelden bij stilstand en bij het indrukken van voorwerpen
//
// Per combinatie (Steen naar doelvak) en afwijking (0%, 30%, 45% van de afstand tot het buurvak, 6 richtingen) telt het: goed,
// andere Steen, ander vak, geen Zet. --richt richt bij slepen op de landingsschaduw (vinger een half gat onder het doelvak, na eerst 30 px onder de Steen te zijn geweest zodat de schaduw er is).
// Op 3D met software-rendering kost een poging bij dpr 3 ongeveer 15 s; meet 3D daarom op dpr 1 of met --gpu.
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { POTJES, aanraking, geo3d, open, openPotje, opties, slaap, startBrowser, startNepServer, stil } from "./bord-hulp.mjs";
import { alsHex, beeld, beeldtijd, beeldtijdZoom, steenKleuren, verschillen, zesSpelers } from "./meet-bord-render.mjs";

const o = opties({ bord: "3d", dpr: 3, fracties: "0.3,0.45", alleen: "", richt: false, stenen: 3, gpu: false, uit: path.join(tmpdir(), "leapstone-meting"), poort: 5199, meting: "besturing", onbegrensd: false, cpu: 1 });
if (o.meting !== "besturing") {
  await meetRender();
  process.exit(0);
}
// Sinds feature 251 is er alleen het 3D-bord; `bord` blijft "3d" in de namen van de uitvoer.
if (o.bord !== "3d") throw new Error("Er is geen 2D-bord meer (feature 251): meet-bord meet alleen het 3D-bord.");
const FR = String(o.fracties).split(",").map(Number);
const RICHTINGEN = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]];
mkdirSync(o.uit, { recursive: true });

const server = await startNepServer({ poort: Number(o.poort), wasm3d: true });
const sessie = await startBrowser({ dpr: Number(o.dpr), gpu: o.gpu === true });
const res = [];
let combos;
try {
  const p = await open(sessie, server.url, "", { wacht3d: true });
  await openPotje(p, "ster");
  await slaap(12000);
  await stil(p);
  const { tik, sleep } = await aanraking(sessie.ctx, p);
  await p.evaluate(() => {
    window.__saved = Array.from(__nep.potjes[0].game.stand());
    window.__reset = async () => { const { Potje } = await import("/src/wasm/halma_core.js"); const q = __nep.potjes[0]; const oud = q.game; q.game = Potje.van_stand(false, 2, Int32Array.from(__saved), 0); oud.free(); q.versie += 1; q.laatste_zet = null; q.beurt_sinds = Date.now(); __nep.stuur(q); window.__v0 = q.versie; };
    window.__uitkomst = () => { const q = __nep.potjes[0]; return q.versie > window.__v0 ? q.laatste_zet : null; };
  });
  await geo3d(p);

  // Drie combinaties van Steen naar doelvak (een stap): de eerste, middelste en laatste Steen van Mila die kan bewegen.
  // --stenen=1: alleen de middelste (een derde van de pogingen, voor een snelle vergelijking voor/na).
  combos = await p.evaluate((n) => {
    const g = __nep.potjes[0].game; const st = Array.from(g.stand());
    const m = st.map((v, i) => (v === 0 ? i : -1)).filter((i) => i >= 0).filter((i) => g.geldige_bestemmingen(i).length > 0);
    const alle = [m[0], m[Math.floor(m.length / 2)], m[m.length - 1]];
    return (n === 1 ? [alle[1]] : alle.slice(0, n)).map((v) => { const st2 = Array.from(g.stappen(v)); const best = Array.from(g.geldige_bestemmingen(v)); return { van: v, naar: st2[0] ?? best[0], best }; });
  }, Number(o.stenen));
  const pos = await p.evaluate((combos) => combos.map((c) => ({
    steen: __geo.steen(0, c.van), gatDoel: __geo.gat(0, c.naar), aim: __geo.aim(0, c.van, c.naar),
    vSteen: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]].map(([dx, dy]) => __geo.buur(0, c.van, dx, dy)),
    vDoel: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]].map(([dx, dy]) => __geo.buur(0, c.naar, dx, dy)),
  })), combos);

  async function proef(modus, fase, f, di, ci) {
    const c = combos[ci], P = pos[ci];
    await p.evaluate(() => __reset()); await slaap(450); await tik(195, 330); await slaap(250); await p.evaluate(() => __reset()); await slaap(350);
    const v = (arr) => [arr[di][0] * f, arr[di][1] * f];
    const os = fase === "steen" && f ? v(P.vSteen) : [0, 0];
    const ot = fase === "doel" && f ? v(P.vDoel) : [0, 0];
    const a = [P.steen[0] + os[0], P.steen[1] + os[1]];
    const basis = o.richt && modus === "sleep" ? P.aim : P.gatDoel;
    const b = [basis[0] + ot[0], basis[1] + ot[1]];
    // Wat het 3D-bord onder de tweede tik ziet (`wijs`: plek op het bord, eigen Steen, geraakte Steen), om een misser te kunnen uitleggen.
    let wijs = null;
    if (modus === "tik") {
      await tik(...a); await slaap(300);
      wijs = await p.evaluate(([x, y]) => Array.from(__halmaBord3d.wijs(x, y, 0, 24)).map((n) => Math.round(n * 100) / 100), b);
      await tik(...b);
    } else {
      // Mikken op de landingsschaduw: de schaduw verschijnt pas als de vinger de tikruimte (12 px) uit is. Een Speler die mikt, ziet
      // hem verschijnen en schuift dan naar zijn plek. Bij een doelvak recht boven de Steen ligt het mikpunt zelf binnen die ruimte;
      // een vinger die daar rechtstreeks heen gaat, "tikt" dus alleen (taak 169). Daarom gaat hij bij --richt eerst 30 px opzij.
      const via = o.richt && modus === "sleep" ? [a[0], a[1] + 30] : null;
      await sleep(a, b, { via });
    }
    await slaap(900); await stil(p, 2, 700);
    const z = await p.evaluate(() => window.__uitkomst());
    const uit = !z ? "geen Zet" : z.van === c.van && z.naar === c.naar ? "goed" : z.van !== c.van ? "andere Steen" : "ander vak";
    return { modus, fase, f, di, ci, uit, zet: z ? [z.van, z.naar] : null, bedoeld: [c.van, c.naar], ...(wijs ? { wijs } : {}) };
  }
  for (const modus of o.alleen ? [o.alleen] : ["tik", "sleep"]) for (const fase of ["steen", "doel"]) {
    for (let ci = 0; ci < combos.length; ci++) {
      res.push(await proef(modus, fase, 0, 0, ci));
      for (const f of FR) for (let di = 0; di < RICHTINGEN.length; di++) { res.push(await proef(modus, fase, f, di, ci)); console.log(modus, fase, f, di, ci, res.at(-1).uit); }
    }
  }
  await p.screenshot({ path: path.join(o.uit, `eind-${o.bord}-dpr${o.dpr}.png`) });
} finally {
  await sessie.browser.close();
  await server.stop();
}

const json = path.join(o.uit, `besturing-${o.bord}-dpr${o.dpr}${o.richt ? "-richt" : ""}.json`);
writeFileSync(json, JSON.stringify({ bord: o.bord, dpr: Number(o.dpr), gpu: o.gpu === true, combos, res }, null, 1));

// ---- Tabel (markdown) per gebaar, plek en afwijking.
const groepen = new Map();
for (const r of res) { const k = `${r.modus}|${r.fase}|${r.f}`; const t = groepen.get(k) ?? { n: 0, goed: 0, "andere Steen": 0, "ander vak": 0, "geen Zet": 0 }; t.n++; t[r.uit]++; groepen.set(k, t); }
console.log("\n| Bord | Gebaar | Afwijking op | Afstand tot buurvak | Pogingen | Goed | Andere Steen | Ander vak | Geen Zet |\n|---|---|---|---|---|---|---|---|---|");
for (const [k, t] of groepen) { const [m, fase, f] = k.split("|"); console.log(`| ${o.bord.toUpperCase()}, dpr ${o.dpr} | ${m} | ${fase === "steen" ? "Steen pakken" : "doelvak"} | ${Math.round(f * 100)}% | ${t.n} | ${t.goed} | ${t["andere Steen"]} | ${t["ander vak"]} | ${t["geen Zet"]} |`); }
console.log("\nuitkomsten:", json);

/** Metingen op de render van het 3D-bord: kleur (ΔE00) of beeldtijd. */
async function meetRender() {
  mkdirSync(o.uit, { recursive: true });
  // "Zonder grens": Chromium tekent niet op het ritme van het scherm (een aanwijzing, geen meting van de grafische kaart).
  const extra = o.onbegrensd ? ["--disable-frame-rate-limit", "--disable-gpu-vsync"] : [];
  const server = await startNepServer({ poort: Number(o.poort), wasm3d: true });
  const sessie = await startBrowser({ dpr: Number(o.dpr), gpu: o.gpu === true, extra });
  const uit = { meting: o.meting, dpr: Number(o.dpr), gpu: o.gpu === true, onbegrensd: o.onbegrensd === true, datum: new Date().toISOString() };
  try {
    if (o.meting === "startmenu") await meetStartmenu(sessie, server, uit);
    for (const vorm of o.meting === "startmenu" ? [] : ["ster", "vierkant"]) {
      const p = await open(sessie, server.url, "", { wacht3d: true });
      uit.renderer ??= await p.evaluate(() => { const g = document.createElement("canvas").getContext("webgl2"); const e = g?.getExtension("WEBGL_debug_renderer_info"); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : "onbekend"; });
      await openPotje(p, vorm);
      await slaap(8000); await stil(p, 2, 1000);
      await geo3d(p);
      const pi = POTJES[vorm].index;
      if (o.meting === "kleur") {
        // Eerst het lege bord (om de Stenen ervan te onderscheiden), dan de zes Spelers met elk tien Stenen, verspreid
        // over het bord (zoals de beginstand van het prototype).
        const n = vorm === "ster" ? 121 : 256;
        await p.evaluate((n) => { __halmaBord3d.zet_gekozen(-1); __halmaBord3d.zet_stand(new Int32Array(n).fill(-1)); }, n);
        await slaap(1500);
        const leeg = await beeld(p, sessie.dpr);
        await p.evaluate(({ st, pi }) => { window.__stand = st; window.__pi = pi; __halmaBord3d.zet_gekozen(-1); __halmaBord3d.zet_stand(Int32Array.from(st)); }, { st: zesSpelers(vorm === "ster" ? 121 : 256), pi });
        await slaap(1500); await stil(p, 2, 1000);
        await p.screenshot({ path: path.join(o.uit, `kleur-${vorm}-dpr${o.dpr}.png`) });
        const k = await steenKleuren(p, sessie, leeg);
        uit[vorm] = { stenen: alsHex(k), kop: verschillen(k, "kop"), heel: verschillen(k, "heel"), zijkant: verschillen(k, "zij") };
        console.log(vorm, JSON.stringify(uit[vorm], null, 1));
      } else {
        const { raak, raakMeer } = await aanraking(sessie.ctx, p);
        const st = await p.evaluate((pi) => Array.from(__nep.potjes[pi].game.stand()), pi);
        await p.evaluate((st) => { window.__stand = st; }, st);
        const van = st.findIndex((s) => s === 0);
        const steen = await p.evaluate(({ pi, van }) => __geo.steen(pi, van), { pi, van });
        const midden = await p.evaluate(({ pi }) => __geo.gat(pi, 60), { pi });
        if (o.meting === "zoom") {
          // `--cpu=4`: de processor van de pagina 4 keer zo traag (CDP), om een telefoon na te doen (taak 190).
          const cdp = await sessie.ctx.newCDPSession(p);
          if (Number(o.cpu) > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(o.cpu) });
          uit.cpu = Number(o.cpu) || 1;
          uit[vorm] = await beeldtijdZoom(p, raakMeer, raak, steen, { cdp });
          console.log(vorm, JSON.stringify(uit[vorm]));
          await p.close();
          continue;
        }
        uit[vorm] = {
          stil: await beeldtijd(p, raak, { stil: true }),
          slepen: await beeldtijd(p, raak, { stil: false, van: steen, rondje: [midden[0], midden[1], 60] }),
        };
        console.log(vorm, JSON.stringify(uit[vorm]));
      }
      await p.close();
    }
  } finally {
    await sessie.browser.close();
    await server.stop();
  }
  const json = path.join(o.uit, `${o.meting}-dpr${o.dpr}${o.gpu ? "-gpu" : ""}${o.onbegrensd ? "-onbegrensd" : ""}${Number(o.cpu) > 1 ? `-cpu${o.cpu}` : ""}.json`);
  writeFileSync(json, JSON.stringify(uit, null, 1));
  console.log("renderer:", uit.renderer, "\nuitkomsten:", json);
}

/**
 * Het Startmenu als 3D-tafel (taak 178). Tijd tot de tafel staat (vanaf het openen van de pagina), beelden in 5 s stilstand, en
 * beelden in 5 s waarin een vinger steeds een ander voorwerp indrukt en weer weghaalt (touchCancel: er opent niets).
 */
async function meetStartmenu(sessie, server, uit) {
  const p = await open(sessie, server.url, "", { wacht3d: true });
  uit.renderer ??= await p.evaluate(() => { const g = document.createElement("canvas").getContext("webgl2"); const e = g?.getExtension("WEBGL_debug_renderer_info"); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : "onbekend"; });
  await p.waitForSelector(".tafel-knoppen", { timeout: 60000 });
  uit.tafelNaMs = await p.evaluate(() => Math.round(performance.getEntriesByType("mark").find((m) => m.name === "tafel")?.startTime ?? performance.now()));
  await slaap(1500);
  const { raak } = await aanraking(sessie.ctx, p);
  const midden = await p.evaluate(() => [...document.querySelectorAll(".tafel-knop")].map((k) => { const r = k.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }));
  const tel = () => p.evaluate(() => [__halmaBord3d.beelden(), performance.now()]);
  const reken = (a, b) => { const beelden = b[0] - a[0], ms = b[1] - a[1]; return { beelden, seconden: Math.round(ms) / 1000, fps: Math.round((beelden / ms) * 10000) / 10, msPerBeeld: Math.round((ms / Math.max(1, beelden)) * 100) / 100 }; };
  let a = await tel(); await slaap(5000);
  uit.stil = reken(a, await tel());
  a = await tel();
  const begin = Date.now();
  for (let i = 0; Date.now() - begin < 5000; i++) {
    const [x, y] = midden[i % midden.length];
    await raak("touchStart", x, y); await slaap(120);
    await raak("touchCancel"); // geen klik: de aanraking wordt afgebroken
    await slaap(120);
  }
  uit.indrukken = reken(a, await tel());
  await p.screenshot({ path: path.join(o.uit, `startmenu-dpr${o.dpr}.png`) });
  console.log("startmenu", JSON.stringify({ tafelNaMs: uit.tafelNaMs, stil: uit.stil, indrukken: uit.indrukken }));
  await p.close();
}
