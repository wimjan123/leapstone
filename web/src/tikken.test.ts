import { expect, test } from "vitest";
import { GAT_STRAAL, dichtsteVak, kiesGewezen, landing, nogEenTik, voerUit, type Gewezen, type Keuze, type Punt, type TikStand } from "./tikken";

/** Een tik op plek `p` van het bord, zonder steen die het 3D-bord onder de vinger ziet. */
const naast = (p: Punt): Gewezen => ({ plek: p, eigen: null, geraakt: null });

// Een rij van vijf vakken, 1 uit elkaar: 0 1 2 3 4 op x = 0..4.
const rij = (stand: number[], extra: Partial<TikStand> = {}): TikStand => ({
  punten: stand.map((_, i) => ({ x: i, y: 0 })),
  stand,
  aanDeBeurt: 0,
  speelbaar: true,
  gekozen: null,
  ...extra,
});

test("een tik ver weg doet niets zonder keuze en laat een keuze los", () => {
  const t = rij([0, -1, -1, -1, -1]);
  expect(kiesGewezen(naast({ x: 3, y: 0 }), t)).toEqual({ soort: "los", vak: null });
  expect(kiesGewezen(naast({ x: 2, y: 1.2 }), { ...t, gekozen: 0 })).toEqual({ soort: "los", vak: null });
});

test("niet speelbaar (niet jouw beurt online): niets te kiezen", () => {
  const t = rij([0, -1, -1, -1, -1], { speelbaar: false });
  expect(kiesGewezen(naast({ x: 0, y: 0 }), t)).toEqual({ soort: "los", vak: null });
  expect(kiesGewezen(naast({ x: 1, y: 0 }), { ...t, gekozen: 0 })).toEqual({ soort: "los", vak: null });
});

test("met een gekozen steen is een tik een poging naar het dichtstbijzijnde vak, welk vak ook", () => {
  const t = rij([0, -1, 1, -1, -1], { gekozen: 0 });
  // Elk vak telt even zwaar: de tik verraadt niet welke vakken mogen.
  expect(kiesGewezen(naast({ x: 1.3, y: 0.2 }), t)).toEqual({ soort: "zet", vak: 1 });
  expect(kiesGewezen(naast({ x: 3.4, y: -0.3 }), t)).toEqual({ soort: "zet", vak: 3 });
  // Op een steen van de ander: ook een poging (die zal niet mogen).
  expect(kiesGewezen(naast({ x: 2.1, y: 0 }), t)).toEqual({ soort: "zet", vak: 2 });
});

test("met een gekozen steen: een andere eigen steen kiezen, of de gekozen steen loslaten", () => {
  const t = rij([0, -1, -1, 0, -1], { gekozen: 0 });
  expect(kiesGewezen(naast({ x: 3.2, y: 0.1 }), t)).toEqual({ soort: "kies", vak: 3 });
  expect(kiesGewezen(naast({ x: 0.1, y: 0 }), t)).toEqual({ soort: "los", vak: 0 });
  // Dichter bij het lege vak ernaast: een poging.
  expect(kiesGewezen(naast({ x: 0.6, y: 0 }), t)).toEqual({ soort: "zet", vak: 1 });
});

test("het dichtstbijzijnde vak binnen een straal", () => {
  const t = rij([0, -1, 1, -1, 0]);
  expect(dichtsteVak({ x: 2.6, y: 0.1 }, t.punten, 0.75)).toBe(3);
  expect(dichtsteVak({ x: 2.5, y: 2 }, t.punten, 0.75)).toBeNull();
});

test("3D-bord zonder gekozen steen: de eigen steen die het bord aanwijst, of niets", () => {
  const t = rij([0, -1, 1, -1, 0]);
  // De vinger staat op de kop van steen 4, boven het vak ervoor: het bord weet welke steen het is.
  expect(kiesGewezen({ plek: { x: 3.2, y: 0 }, eigen: 4, geraakt: 4 }, t)).toEqual({ soort: "kies", vak: 4 });
  // Op een steen van de ander, met een eigen steen erachter: die eigen steen.
  expect(kiesGewezen({ plek: { x: 2, y: 0 }, eigen: 0, geraakt: 2 }, t)).toEqual({ soort: "kies", vak: 0 });
  expect(kiesGewezen({ plek: { x: 2, y: 0 }, eigen: null, geraakt: 2 }, t)).toEqual({ soort: "los", vak: null });
  expect(kiesGewezen({ plek: null, eigen: null, geraakt: null }, t)).toEqual({ soort: "los", vak: null });
  expect(kiesGewezen({ plek: null, eigen: 0, geraakt: 0 }, { ...t, speelbaar: false })).toEqual({ soort: "los", vak: null });
});

test("3D-bord met een gekozen steen: een geraakte steen telt als zijn vak, anders het vak onder de vinger", () => {
  const t = rij([0, -1, 1, -1, 0], { gekozen: 0 });
  // Op de (opgetilde) kop van de gekozen steen, boven vak 1: loslaten, geen poging naar vak 1.
  expect(kiesGewezen({ plek: { x: 1, y: 0 }, eigen: 0, geraakt: 0 }, t)).toEqual({ soort: "los", vak: 0 });
  // Een andere eigen steen raken: die kiezen.
  expect(kiesGewezen({ plek: { x: 3, y: 0 }, eigen: 4, geraakt: 4 }, t)).toEqual({ soort: "kies", vak: 4 });
  // Een steen van de ander: een poging (die zal niet mogen).
  expect(kiesGewezen({ plek: { x: 1.6, y: 0 }, eigen: null, geraakt: 2 }, t)).toEqual({ soort: "zet", vak: 2 });
  // Geen steen geraakt: het vak onder de vinger, ook naast een eigen steen (elk vak telt even zwaar).
  expect(kiesGewezen({ plek: { x: 3.2, y: 0.1 }, eigen: 4, geraakt: null }, t)).toEqual({ soort: "zet", vak: 3 });
  expect(kiesGewezen({ plek: { x: 2.5, y: 2 }, eigen: null, geraakt: null }, t)).toEqual({ soort: "los", vak: null });
});

test("tik of slepen: een vinger die bij een snelle tik wat rolt, sleept niet", () => {
  expect(nogEenTik(0, 50)).toBe(true);
  expect(nogEenTik(11, 120)).toBe(true);
  expect(nogEenTik(13, 120)).toBe(false);
  // Eerst even stil, dan langzaam schuiven: dat is slepen.
  expect(nogEenTik(5, 400)).toBe(true);
  expect(nogEenTik(7, 400)).toBe(false);
});


test("een keuze uitvoeren: kiezen, proberen, loslaten of weg; een Zet die niet mag rolt terug", () => {
  const gedaan: string[] = [];
  const doe = (k: Keuze, gekozen: number | null, weg = true, mag = true) =>
    voerUit(k, {
      optik: (v) => {
        gedaan.push(`tik ${v}`);
        return k.soort === "zet" && !mag ? false : undefined;
      },
      weg: weg ? () => gedaan.push("weg") : undefined,
      mis: (van, naar) => gedaan.push(`terug ${van}>${naar}`),
      gekozen,
    });
  doe({ soort: "kies", vak: 3 }, null);
  doe({ soort: "zet", vak: 5 }, 3);
  doe({ soort: "zet", vak: 6 }, 3, true, false);
  doe({ soort: "los", vak: 3 }, 3);
  doe({ soort: "los", vak: null }, 3);
  // Zonder `weg` laat een tik ver weg de gekozen steen los via `optik`.
  doe({ soort: "los", vak: null }, 3, false);
  expect(gedaan).toEqual(["tik 3", "tik 5", "tik 6", "terug 3>6", "tik 3", "weg", "tik 3"]);
});

// Een stuk Sterbord: vijf rijen van zes vakken, elke rij een halve plek opgeschoven (zoals `schermPunt`).
const roosterPunten = (rijen: number, kolommen: number) =>
  Array.from({ length: rijen * kolommen }, (_, i) => {
    const rij = Math.floor(i / kolommen);
    return { x: (i % kolommen) + rij / 2, y: rij * 0.866 };
  });

test("een tik net naast een vak van het Sterbord komt in dat vak, in elke richting", () => {
  const punten = roosterPunten(5, 6);
  const stand = punten.map(() => -1);
  stand[0] = 0;
  const t: TikStand = { punten, stand, aanDeBeurt: 0, speelbaar: true, gekozen: 0 };
  // Binnenin het rooster: elk vak, behalve de rand (daar mist een buur en is het vak dus ook van verder weg te raken).
  for (let rij = 1; rij < 4; rij++) {
    for (let kolom = 1; kolom < 5; kolom++) {
      const vak = rij * 6 + kolom;
      for (let graad = 0; graad < 360; graad += 15) {
        // 0,49 is net binnen het eigen vlak van een vak (de cel is 0,5 tot de rand en 0,58 tot de hoek).
        const hoek = (graad * Math.PI) / 180;
        const p = { x: punten[vak].x + 0.49 * Math.cos(hoek), y: punten[vak].y + 0.49 * Math.sin(hoek) };
        expect(kiesGewezen(naast(p), t)).toEqual({ soort: "zet", vak });
      }
    }
  }
});

test("een tik tussen twee vakken kiest het dichtstbijzijnde, ook als dat maar een haar scheelt", () => {
  const t = rij([-1, -1, -1], { gekozen: null, stand: [0, -1, -1] });
  const g = { ...t, gekozen: 0 };
  expect(kiesGewezen(naast({ x: 1.49, y: 0 }), g)).toEqual({ soort: "zet", vak: 1 });
  expect(kiesGewezen(naast({ x: 1.51, y: 0 }), g)).toEqual({ soort: "zet", vak: 2 });
});

test("een losgelaten steen: het dichtstbijzijnde vak binnen een straal, anders niets", () => {
  const punten = roosterPunten(3, 4);
  // Net binnen het bord, tussen de vakken: altijd een vak.
  for (const p of [{ x: 0.5, y: 0.43 }, { x: 1.25, y: 0.3 }, { x: 2.1, y: 0.9 }]) {
    expect(dichtsteVak(p, punten, GAT_STRAAL)).not.toBeNull();
  }
  // Ver naast het bord: terug naar zijn gaatje.
  expect(dichtsteVak({ x: 0, y: -1.2 }, punten, GAT_STRAAL)).toBeNull();
  expect(dichtsteVak({ x: 6, y: 0.9 }, punten, GAT_STRAAL)).toBeNull();
});

test("een losgelaten steen landt in het vak waar zijn schaduw het dichtst bij is, ook als dat net naast het vak is", () => {
  const punten = roosterPunten(4, 5);
  // Een steen op vak 7 (rij 1, kolom 2); een andere eigen steen op vak 8; een steen van de ander op vak 12.
  const stand = punten.map(() => -1);
  stand[7] = 0;
  stand[8] = 0;
  stand[12] = 1;
  const t = { punten, stand, aanDeBeurt: 0 };
  // Vak 6 ligt links van de steen. De schaduw valt 0,4 vak naast het midden van vak 7: nog dichter bij 7 dan bij 6.
  expect(landing({ x: punten[6].x + 0.6, y: punten[6].y + 0.1 }, 7, t)).toEqual({ soort: "blijf" });
  expect(landing({ x: punten[6].x + 0.2, y: punten[6].y + 0.3 }, 7, t)).toEqual({ soort: "zet", vak: 6 });
  // Net naast een leeg vak aan de andere kant (vak 3, rij 0).
  expect(landing({ x: punten[3].x - 0.3, y: punten[3].y - 0.25 }, 7, t)).toEqual({ soort: "zet", vak: 3 });
  // Boven zijn eigen vak: hij blijft, ook als de schaduw er een stukje naast valt.
  expect(landing({ x: punten[7].x + 0.3, y: punten[7].y - 0.3 }, 7, t)).toEqual({ soort: "blijf" });
});

test("een losgelaten steen: boven een eigen steen of naast het bord gaat hij terug; boven een steen van de ander is het een poging", () => {
  const punten = roosterPunten(4, 5);
  const stand = punten.map(() => -1);
  stand[7] = 0;
  stand[8] = 0;
  stand[12] = 1;
  const t = { punten, stand, aanDeBeurt: 0 };
  expect(landing(punten[8], 7, t)).toEqual({ soort: "terug" });
  expect(landing({ x: punten[8].x + 0.2, y: punten[8].y }, 7, t)).toEqual({ soort: "terug" });
  expect(landing(punten[12], 7, t)).toEqual({ soort: "zet", vak: 12 });
  // Ver naast het bord, of geen plek onder de steen (de steen hangt buiten het bord).
  expect(landing({ x: -3, y: 0 }, 7, t)).toEqual({ soort: "terug" });
  expect(landing(null, 7, t)).toEqual({ soort: "terug" });
  // Hij landt nooit in een vak dat verder dan GAT_STRAAL ligt.
  expect(landing({ x: punten[0].x - GAT_STRAAL - 0.05, y: punten[0].y }, 7, t)).toEqual({ soort: "terug" });
});
