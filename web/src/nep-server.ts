/**
 * Een nep-server voor tests, met dezelfde vorm als de server (de Worker). De spelregels komen uit WebAssembly.
 * Tests zetten `fetch` op `server.fetch` en `WebSocket` op `server.WebSocket`.
 */
import { Potje, zet_pad } from "./wasm/halma_core.js";

type Sp = { speler_id: number; spelersnaam: string; sleutel: string; herstelcode: string };
type NepPotje = {
  potje_id: number;
  uitnodiging: string;
  bord: "ster" | "vierkant";
  aantal_spelers: number;
  spelers: number[];
  game: Potje;
  versie: number;
  laatste_zet: unknown;
  opgegeven: Set<number>;
  /** Aangemelde live verbindingen. */
  luisteraars: Set<NepWebSocket>;
  berichten: { id: number; plek: number; speler_id: number; spelersnaam: string; tekst: string; tijd: number }[];
  /** Denktijd in seconden, of null zonder grens. */
  denktijd_s: number | null;
  /** Wanneer de huidige beurt begon (klok van de server). */
  beurt_sinds: number;
  /** Een Snel potje (Play online). */
  snel?: boolean;
  /** Tot wanneer het Snel potje op een tegenstander wacht (klok van de server). */
  zoek_tot_ms?: number | null;
  /** De Rating van elke Speler voor en na het Potje, zodra een Snel potje afliep (Elo met K = 32, twee Spelers). */
  rating_wijziging?: Map<number, { voor: number; na: number }>;
  /** Het moment (ms) waarop het Potje afliep, voor de datum van een Prestatie; zonder dit geldt `nu`. */
  einde_ms?: number;
  /** Per plek: de eigen Zetten en de meeste Sprongen in één Zet (voor de Statistieken). */
  eigen?: Map<number, { zetten: number; sprongen: number; /** Een test zet dit om een winst met alle stenen in de doelpunt te nabootsen. */ doel?: boolean }>;
};

/** Zoals `StatistiekRecord` in halma-opslag. */
export type NepStatistiekRecord = { potje_id: number; waarde: number; tegenstanders: string[] };
/** Zoals `Statistieken` in halma-opslag. */
export type NepStatistieken = {
  gespeeld: number;
  gewonnen: number;
  verloren: number;
  deel_gewonnen: number | null;
  gemiddelde_plek: number | null;
  rating_verloop: number[];
  langste_sprong: NepStatistiekRecord | null;
  snelste_overwinning: NepStatistiekRecord | null;
};

/** Zoals `Prestatie` in halma-opslag. */
export type NepPrestatie = { id: string; behaald_ms: number | null };

/** Een live verbinding zoals de Worker die geeft: eerst de sleutel, dan `{soort, data}`-berichten. */
class NepWebSocket {
  readyState = 0;
  onopen: ((e: Event) => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onclose: ((e: { code: number }) => void) | null = null;
  onerror: ((e: Event) => void) | null = null;
  private potje: NepPotje | undefined;
  /** De Speler die zich aanmeldde. */
  speler_id = 0;

  constructor(
    private server: NepServer,
    url: string,
  ) {
    const pad = new URL(url).pathname;
    server.verzoeken.push(`WS ${pad}`);
    const m = /^\/api\/potjes\/(\d+)\/live$/.exec(pad);
    this.potje = m ? server.potjes.find((p) => p.potje_id === Number(m[1])) : undefined;
    setTimeout(() => {
      if (this.readyState !== 0) return;
      this.readyState = 1;
      this.onopen?.(new Event("open"));
    });
  }

  send(tekst: string) {
    if (this.readyState !== 1) throw new Error("niet open");
    if (tekst === "ping") return this.ontvang("pong");
    const ik = this.server.spelers.find((s) => s.sleutel === JSON.parse(tekst).sleutel);
    if (!ik) return this.close(4401);
    const p = this.potje;
    if (!p) return this.close(4404);
    if (!p.spelers.includes(ik.speler_id)) return this.close(4403);
    this.speler_id = ik.speler_id;
    p.luisteraars.add(this);
    this.ontvang(JSON.stringify({ soort: "stand", data: this.server.stand(p) }));
  }

  ontvang(data: string) {
    setTimeout(() => this.readyState === 1 && this.onmessage?.({ data }));
  }

  close(code = 1000) {
    if (this.readyState >= 2) return;
    this.readyState = 3;
    this.potje?.luisteraars.delete(this);
    setTimeout(() => this.onclose?.({ code }));
  }
}

/** Zoals `VASTE_ZINNEN` in halma-opslag. */
export const VASTE_ZINNEN = ["Hi!", "Good luck", "Good game", "Nice jump!", "Well played", "Oops", "Thanks", "See you next time"];

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export class NepServer {
  spelers: Sp[] = [];
  potjes: NepPotje[] = [];
  ratings = new Map<number, number>();
  /** Alle verzoeken, voor controles in tests. */
  verzoeken: string[] = [];
  /** Per Speler: wie hij blokkeerde. */
  blokkades = new Map<number, Set<number>>();
  /** Per Speler: wie hij uit zijn Vriendenlijst haalde. */
  vriendenWeg = new Map<number, Set<number>>();
  /** Vriendverzoeken (taak 162): wie wie vroeg, en of de ander weigerde (dat merkt de aanvrager niet). */
  vriendverzoeken: { van: number; naar: number; geweigerd: boolean }[] = [];
  /** Via een goedgekeurd Vriendverzoek: per Speler zijn vrienden. */
  nieuweVrienden = new Map<number, Set<number>>();
  /** Uitdagingen (taak 163): `tijd` is het moment van uitdagen op de klok van de server; na 5 minuten vervalt ze. */
  /** Taak 164: `groep` is het id van de eerste rij (alle vrienden van één Uitdaging), `aantal` het aantal Spelers van het Potje. */
  uitdagingen: {
    id: number;
    van: number;
    naar: number;
    bord: "ster" | "vierkant";
    denktijd_s: number | null;
    tijd: number;
    status: "open" | "accepted" | "declined";
    potje_id?: number;
    groep: number;
    aantal: number;
  }[] = [];
  /** Zoals de server: de uitdager kan kiezen tot een uur na het uitdagen. */
  static readonly UITDAGING_KEUZE_MS = 60 * 60 * 1000;
  /** De aantallen Spelers die het bord kent (zoals halma-core). */
  static readonly BORD_AANTALLEN = { ster: [2, 3, 4, 6], vierkant: [2, 4] };
  /** Zoals de server: een open Uitdaging vervalt na 5 minuten. */
  static readonly UITDAGING_GELDIG_MS = 5 * 60 * 1000;
  /** De Vriendcode van een Speler (acht cijfers). */
  vriendcodeVan(id: number) {
    return String(48210937 + id * 1234567).padStart(8, "0");
  }
  /** Rapporten zoals de beheerpagina ze ziet. */
  rapporten: { melder_id: number; speler_id: number; potje_id: number; bericht_id: number; tekst: string }[] = [];
  /** De klok van de server; een test kan hem laten voor- of achterlopen op die van de app. */
  nu: () => number = () => Date.now();

  /** De WebSocket van deze server, voor `vi.stubGlobal("WebSocket", server.WebSocket)`. */
  WebSocket = ((server: NepServer) =>
    class extends NepWebSocket {
      constructor(url: string) {
        super(server, url);
      }
    })(this);

  voegSpelerToe(spelersnaam: string): Sp {
    const n = this.spelers.length + 1;
    const s = { speler_id: n, spelersnaam, sleutel: `sleutel${n}`, herstelcode: `HERSTEL-${n}` };
    this.spelers.push(s);
    return s;
  }

  maakPotje(ids: number[], aantal: number, bord: "ster" | "vierkant" = "ster", denktijd_s: number | null = null): NepPotje {
    const p: NepPotje = {
      potje_id: Math.max(0, ...this.potjes.map((x) => x.potje_id)) + 1,
      uitnodiging: this.potjes.length === 0 ? "ABCD-EFGH" : `CODE-${this.potjes.length + 1}`,
      bord,
      aantal_spelers: aantal,
      spelers: ids,
      game: bord === "vierkant" ? Potje.vierkant(aantal) : new Potje(aantal),
      versie: 0,
      laatste_zet: null,
      opgegeven: new Set(),
      luisteraars: new Set(),
      berichten: [],
      denktijd_s,
      beurt_sinds: this.nu(),
    };
    this.potjes.push(p);
    return p;
  }

  /** Het wachtende Snel potje (wie het eerst wacht), als er een is. */
  wachtendSnel(aantal = 2): NepPotje | undefined {
    return this.potjes.find((p) => p.snel && p.aantal_spelers === aantal && p.spelers.length < p.aantal_spelers);
  }

  /** De tijd is om: Computerspelers (gewone Spelers voor de app) vullen alle lege plekken van het wachtende Snel potje. */
  vulMetComputer(p: NepPotje) {
    for (const naam of ["Maya", "Noor", "Finn", "Lena", "Sven"]) {
      if (p.spelers.length >= p.aantal_spelers) break;
      p.spelers.push(this.voegSpelerToe(naam).speler_id);
    }
    p.zoek_tot_ms = null;
    p.beurt_sinds = this.nu();
    this.stuur(p);
  }

  /** De Rating van een Speler (start 1000). */
  rating(speler_id: number): number {
    return this.ratings.get(speler_id) ?? 1000;
  }

  /** Verwerkt de Rating één keer, zodra een Snel potje met twee Spelers afliep. */
  private verwerkRating(p: NepPotje, winnaarPlek: number) {
    if (!p.snel || p.rating_wijziging || p.spelers.length !== 2 || winnaarPlek < 1) return;
    const [w, v] = winnaarPlek === 1 ? [p.spelers[0], p.spelers[1]] : [p.spelers[1], p.spelers[0]];
    const kans = 1 / (1 + 10 ** ((this.rating(v) - this.rating(w)) / 400));
    const punten = Math.round(32 * (1 - kans));
    p.rating_wijziging = new Map([
      [w, { voor: this.rating(w), na: this.rating(w) + punten }],
      [v, { voor: this.rating(v), na: this.rating(v) - punten }],
    ]);
    for (const [id, x] of p.rating_wijziging) this.ratings.set(id, x.na);
  }

  info(p: NepPotje) {
    return {
      potje_id: p.potje_id,
      uitnodiging: p.snel ? "" : p.uitnodiging,
      bord: p.bord,
      aantal_spelers: p.aantal_spelers,
      spelers: p.spelers.map((id, i) => ({
        plek: i + 1,
        speler_id: id,
        spelersnaam: this.spelers.find((s) => s.speler_id === id)!.spelersnaam,
        ...(p.snel ? { rating: this.rating(id) } : {}),
      })),
      vol: p.spelers.length >= p.aantal_spelers,
      denktijd_s: p.denktijd_s,
    };
  }

  stand(p: NepPotje) {
    const gestart = p.spelers.length >= p.aantal_spelers;
    const winnaar = gestart ? p.game.winnaar() : -1;
    if (gestart && p.game.is_afgelopen()) this.verwerkRating(p, winnaar + 1);
    return {
      ...this.info(p),
      spelers: this.info(p).spelers.map((s) => ({
        ...s,
        status: p.opgegeven.has(s.plek) ? "opgegeven" : "speelt",
        ...(p.rating_wijziging?.has(s.speler_id) ? { rating_verandering: p.rating_wijziging.get(s.speler_id) } : {}),
      })),
      gestart,
      versie: p.versie,
      stand: Array.from(p.game.stand()).map((v) => v + 1),
      aan_de_beurt: gestart && !p.game.is_afgelopen() ? p.game.aan_de_beurt() + 1 : null,
      laatste_zet: p.laatste_zet,
      afgelopen: gestart && p.game.is_afgelopen(),
      winnaar: winnaar >= 0 ? winnaar + 1 : null,
      ranglijst: gestart && p.game.is_afgelopen() ? Array.from(p.game.ranglijst()).map((x) => x + 1) : [],
      deadline_ms: gestart && !p.game.is_afgelopen() && p.denktijd_s !== null ? p.beurt_sinds + p.denktijd_s * 1000 : null,
      server_tijd_ms: this.nu(),
      snel: p.snel ?? false,
      zoek_tot_ms: gestart ? null : (p.zoek_tot_ms ?? null),
    };
  }

  /** De Denktijd is op: de server slaat de beurt over. */
  slaOver(p: NepPotje) {
    const plek = p.game.aan_de_beurt() + 1;
    let volgende = p.game.aan_de_beurt();
    do volgende = (volgende + 1) % p.aantal_spelers;
    while (p.opgegeven.has(volgende + 1) && volgende !== plek - 1);
    const oud = p.game;
    p.game = Potje.van_stand(p.bord === "vierkant", p.aantal_spelers, oud.stand(), volgende);
    oud.free();
    this.nieuweBeurt(p, { plek, soort: "overgeslagen", van: null, naar: null });
  }

  private nieuweBeurt(p: NepPotje, zet: { plek: number; soort: string; van: number | null; naar: number | null }) {
    p.versie++;
    p.beurt_sinds = this.nu();
    p.laatste_zet = { nummer: p.versie, ...zet };
    this.stuur(p);
  }

  /** Stuur de huidige stand naar iedereen die luistert. */
  stuur(p: NepPotje) {
    const bericht = JSON.stringify({ soort: "stand", data: this.stand(p) });
    for (const ws of p.luisteraars) ws.ontvang(bericht);
  }

  /** De vrienden van een Speler met het laatste Potje samen, de laatste eerst: wie via een Uitnodiging (geen Snel potje) samen speelde of goedgekeurd werd. */
  vriendIds(ik: number): [number, number][] {
    const laatst = new Map<number, number>();
    for (const p of this.potjes.filter((x) => !x.snel && x.spelers.includes(ik))) {
      for (const id of p.spelers) if (id !== ik) laatst.set(id, Math.max(laatst.get(id) ?? 0, p.potje_id));
    }
    const weg = this.vriendenWeg.get(ik) ?? new Set<number>();
    for (const id of this.nieuweVrienden.get(ik) ?? []) laatst.set(id, Math.max(laatst.get(id) ?? 0, 1000));
    return [...laatst]
      .filter(([id]) => !weg.has(id) && !this.heeftGeblokkeerd(ik, id) && !this.heeftGeblokkeerd(id, ik))
      .sort((a, b) => b[1] - a[1]);
  }

  isVriend(ik: number, ander: number) {
    return this.vriendIds(ik).some(([id]) => id === ander);
  }

  /** Heeft `wie` de Speler `ander` geblokkeerd? */
  maakVrienden(a: number, b: number) {
    for (const [x, y] of [[a, b], [b, a]]) {
      const set = this.nieuweVrienden.get(x) ?? new Set<number>();
      set.add(y);
      this.nieuweVrienden.set(x, set);
      this.vriendenWeg.get(x)?.delete(y);
    }
  }

  heeftGeblokkeerd(wie: number, ander: number) {
    return this.blokkades.get(wie)?.has(ander) ?? false;
  }

  /** Een Bericht van een Speler (ook buiten de app om): bewaard en live doorgestuurd, niet naar wie hem blokkeerde. */
  berichtVan(p: NepPotje, plek: number, tekst: string) {
    const speler_id = p.spelers[plek - 1];
    const b = {
      id: p.berichten.length + 1,
      plek,
      speler_id,
      spelersnaam: this.spelers.find((s) => s.speler_id === speler_id)!.spelersnaam,
      tekst: tekst.trim(),
      tijd: 1700000000 + p.berichten.length,
    };
    p.berichten.push(b);
    const data = JSON.stringify({ soort: "bericht", data: b });
    for (const ws of p.luisteraars) if (!this.heeftGeblokkeerd(ws.speler_id, speler_id)) ws.ontvang(data);
    return b;
  }

  /** Verbreek alle live verbindingen van een Potje, alsof het netwerk wegvalt. */
  verbreek(p: NepPotje) {
    for (const ws of [...p.luisteraars]) ws.close(1006);
    p.luisteraars.clear();
  }

  /** De Prestaties van een Speler, zoals `GET /api/prestaties` ze geeft: alle tien, in vaste volgorde. */
  prestaties(speler_id: number): NepPrestatie[] {
    const behaald = new Map<string, number>();
    const eerst = (id: string, ms: number) => behaald.set(id, Math.min(behaald.get(id) ?? ms, ms));
    const winsten: number[] = [];
    for (const p of this.potjes) {
      const mijn = p.spelers.indexOf(speler_id) + 1;
      if (mijn === 0) continue;
      const st = this.stand(p);
      const ms = p.einde_ms ?? this.nu();
      const sprongen = p.eigen?.get(mijn)?.sprongen ?? 0;
      if (sprongen >= 6) eerst("jumps_6", ms);
      if (sprongen >= 10) eerst("jumps_10", ms);
      if (!st.afgelopen || st.winnaar !== mijn) continue;
      winsten.push(ms);
      if (p.bord === "vierkant") eerst("square_win", ms);
      if (p.aantal_spelers === 6) eerst("six_players_win", ms);
    }
    winsten.sort((a, b) => a - b);
    for (const [id, n] of [["first_win", 1], ["wins_10", 10], ["wins_50", 50], ["wins_100", 100]] as const) if (winsten.length >= n) eerst(id, winsten[n - 1]);
    // Reeks van zeven: zeven dagen achter elkaar, het moment is het midden van dag zeven (12:00 UTC).
    let reeks = 0;
    let vorige = Number.NaN;
    for (const d of [...(this.puzzeldagen.get(speler_id) ?? [])].sort()) {
      const dag = Date.parse(`${d}T00:00:00Z`) / 86_400_000;
      reeks = dag === vorige + 1 ? reeks + 1 : 1;
      vorige = dag;
      if (reeks === 7) {
        eerst("puzzle_streak_7", dag * 86_400_000 + 43_200_000);
        break;
      }
    }
    return ["first_win", "wins_10", "wins_50", "wins_100", "jumps_6", "jumps_10", "square_win", "six_players_win", "puzzle_streak_7", "five_friends"].map((id) => ({ id, behaald_ms: behaald.get(id) ?? null }));
  }

  /** Een Zet van een andere Speler, buiten de app om. */
  zetVan(p: NepPotje, plek: number, van: number, naar: number) {
    p.game.zet(van, naar);
    this.nieuweBeurt(p, { plek, soort: "zet", van, naar });
  }

  /** De Statistieken van een Speler, zoals `GET /api/statistieken` ze geeft: alleen afgelopen online Potjes. */
  statistieken(speler_id: number): NepStatistieken {
    let gespeeld = 0;
    let gewonnen = 0;
    let plekken = 0;
    let langste: NepStatistiekRecord | null = null;
    let snelste: NepStatistiekRecord | null = null;
    const verloop: number[] = [];
    for (const p of this.potjes) {
      const mijn = p.spelers.indexOf(speler_id) + 1;
      if (mijn === 0) continue;
      const st = this.stand(p);
      if (!st.afgelopen) continue;
      gespeeld++;
      plekken += st.ranglijst.includes(mijn) ? st.ranglijst.indexOf(mijn) + 1 : p.aantal_spelers;
      const tegenstanders = p.spelers.filter((id) => id !== speler_id).map((id) => this.spelers.find((s) => s.speler_id === id)!.spelersnaam);
      const eigen: { zetten: number; sprongen: number; doel?: boolean } = p.eigen?.get(mijn) ?? { zetten: 0, sprongen: 0 };
      if (st.winnaar === mijn) {
        gewonnen++;
        const stand = p.game.stand();
        const alleStenen = eigen.doel || Array.from(p.game.doelvakken(mijn - 1)).every((v) => stand[v] === mijn - 1);
        if (alleStenen && (!snelste || eigen.zetten < snelste.waarde)) snelste = { potje_id: p.potje_id, waarde: eigen.zetten, tegenstanders };
      }
      if (eigen.sprongen > 0 && (!langste || eigen.sprongen > langste.waarde)) langste = { potje_id: p.potje_id, waarde: eigen.sprongen, tegenstanders };
      const wijziging = p.rating_wijziging?.get(speler_id);
      if (wijziging) verloop.push(wijziging.na);
    }
    return {
      gespeeld,
      gewonnen,
      verloren: gespeeld - gewonnen,
      deel_gewonnen: gespeeld > 0 ? gewonnen / gespeeld : null,
      gemiddelde_plek: gespeeld > 0 ? plekken / gespeeld : null,
      rating_verloop: verloop.slice(-50),
      langste_sprong: langste,
      snelste_overwinning: snelste,
    };
  }

  /** De datums waarop elke Speler de Dagelijkse puzzel oploste (`POST /api/puzzeldagen`). */
  puzzeldagen = new Map<number, Set<string>>();
  /** De taal die elke Speler de server gaf. */
  talen = new Map<number, string>();

  fetch = async (url: string, init: RequestInit = {}): Promise<Response> => {
    this.verzoeken.push(`${init.method ?? "GET"} ${url}`);
    const body = init.body ? JSON.parse(init.body as string) : {};
    const sleutel = new Headers(init.headers).get("Authorization")?.replace("Bearer ", "");
    const ik = this.spelers.find((s) => s.sleutel === sleutel);
    if (url === "/api/spelers") return json(201, this.voegSpelerToe(body.spelersnaam));
    if (url === "/api/spelers/mij" && init.method === "DELETE") {
      if (!ik) return json(401, { fout: "Unknown key" });
      // Zoals de server: de naam en de codes zijn weg; het Potje van anderen blijft met "Deleted player".
      Object.assign(ik, { spelersnaam: "Deleted player", sleutel: "verwijderd", herstelcode: "verwijderd" });
      return new Response(null, { status: 204 });
    }
    if (url === "/api/blokkades") {
      if (!ik) return json(401, { fout: "Unknown key" });
      const set = this.blokkades.get(ik.speler_id) ?? new Set<number>();
      this.blokkades.set(ik.speler_id, set);
      if (init.method === "POST") {
        if (body.speler_id === ik.speler_id) return json(400, { fout: "You cannot block yourself" });
        set.add(body.speler_id);
        return new Response(null, { status: 204 });
      }
      const lijst = [...set].map((id) => ({ speler_id: id, spelersnaam: this.spelers.find((s) => s.speler_id === id)!.spelersnaam }));
      return json(200, lijst.sort((a, b) => a.spelersnaam.localeCompare(b.spelersnaam)));
    }
    const bm = /^\/api\/blokkades\/(\d+)$/.exec(url);
    if (bm && init.method === "DELETE") {
      if (!ik) return json(401, { fout: "Unknown key" });
      this.blokkades.get(ik.speler_id)?.delete(Number(bm[1]));
      return new Response(null, { status: 204 });
    }
    if (url === "/api/herstel") {
      const s = this.spelers.find((x) => x.herstelcode === body.herstelcode);
      return s ? json(200, s) : json(404, { fout: "Unknown recovery code" });
    }
    if (url === "/api/potjes" && ik) {
      const p = this.maakPotje([ik.speler_id], body.aantal_spelers, body.bord, body.denktijd_s ?? null);
      return json(201, this.info(p));
    }
    if (url === "/api/vaste-zinnen") return json(200, VASTE_ZINNEN);
    // De taal van de Speler, voor Meldingen en foutmeldingen van de server.
    if (url === "/api/taal" && init.method === "POST") {
      if (!ik) return json(401, { fout: "Unknown key" });
      this.talen.set(ik.speler_id, body.taal);
      return new Response(null, { status: 204 });
    }
    if (url === "/api/puzzeldagen" && init.method === "POST") {
      if (!ik) return json(401, { fout: "Unknown key" });
      if (!/^\d{4}-\d{2}-\d{2}$/.test(body.datum)) return json(400, { fout: "That date is not valid" });
      this.puzzeldagen.set(ik.speler_id, (this.puzzeldagen.get(ik.speler_id) ?? new Set()).add(body.datum));
      return new Response(null, { status: 204 });
    }
    if (url === "/api/snel" && init.method === "POST") {
      if (!ik) return json(401, { fout: "Unknown key" });
      let p = this.potjes.find((x) => x.snel && x.spelers.includes(ik.speler_id) && x.spelers.length < x.aantal_spelers);
      if (!p) {
        const aantal = body.meer ? 4 : 2;
        p = this.wachtendSnel(aantal);
        if (p) {
          p.spelers.push(ik.speler_id);
          if (p.spelers.length >= p.aantal_spelers) p.zoek_tot_ms = null;
          p.beurt_sinds = this.nu();
          this.stuur(p);
        } else {
          p = this.maakPotje([ik.speler_id], aantal, "ster", 30);
          p.snel = true;
          p.zoek_tot_ms = this.nu() + 20_000;
        }
      }
      return json(200, this.stand(p));
    }
    const sm = /^\/api\/snel\/(\d+)$/.exec(url);
    if (sm && init.method === "DELETE") {
      if (!ik) return json(401, { fout: "Unknown key" });
      const p = this.potjes.find((x) => x.potje_id === Number(sm[1]));
      if (!p || !p.spelers.includes(ik.speler_id)) return json(404, { fout: "Unknown game" });
      if (p.spelers.length >= p.aantal_spelers) return json(409, { fout: "The game has already started" });
      this.potjes.splice(this.potjes.indexOf(p), 1);
      return new Response(null, { status: 204 });
    }
    if (url === "/api/mijn-potjes") {
      if (!ik) return json(401, { fout: "Unknown key" });
      const eigen = this.potjes.filter((p) => p.spelers.includes(ik.speler_id) && !(p.snel && p.spelers.length < p.aantal_spelers));
      return json(
        200,
        eigen.map((p) => {
          const st = this.stand(p);
          return {
            potje_id: p.potje_id,
            uitnodiging: p.uitnodiging,
            bord: p.bord,
            aantal_spelers: p.aantal_spelers,
            spelers: this.info(p).spelers,
            gestart: st.gestart,
            aan_de_beurt: st.aan_de_beurt,
            jouw_plek: p.spelers.indexOf(ik.speler_id) + 1,
            afgelopen: st.afgelopen,
            winnaar: st.winnaar,
            laatste_activiteit: p.versie + p.potje_id,
            denktijd_s: p.denktijd_s,
            snel: p.snel ?? false,
          };
        }),
      );
    }
    if (url === "/api/vrienden") {
      if (!ik) return json(401, { fout: "Unknown key" });
      const vrienden = this.vriendIds(ik.speler_id)
        .map(([id, l]) => ({ speler_id: id, spelersnaam: this.spelers.find((s) => s.speler_id === id)!.spelersnaam, rating: this.rating(id), laatst_ms: l * 1000 }));
      const verzoeken = this.vriendverzoeken
        .filter((v) => v.naar === ik.speler_id && !v.geweigerd)
        .map((v) => ({ speler_id: v.van, spelersnaam: this.spelers.find((s) => s.speler_id === v.van)!.spelersnaam, tijd_ms: 1000 }));
      const nu = this.nu();
      const loopt = (u: (typeof this.uitdagingen)[number]) => nu < u.tijd + NepServer.UITDAGING_GELDIG_MS;
      const regel = (u: (typeof this.uitdagingen)[number], ander: number) => ({
        id: u.id,
        speler_id: ander,
        spelersnaam: this.spelers.find((s) => s.speler_id === ander)!.spelersnaam,
        bord: u.bord,
        denktijd_s: u.denktijd_s,
        verloopt_ms: u.tijd + NepServer.UITDAGING_GELDIG_MS,
        aantal_spelers: u.aantal,
        groep: u.groep,
        antwoord: u.status === "accepted" ? "accepted" : u.status === "open" && loopt(u) ? "open" : "declined",
      });
      const uitdagingen = this.uitdagingen
        .filter((u) => u.naar === ik.speler_id && u.status === "open" && loopt(u) && this.isVriend(ik.speler_id, u.van))
        .map((u) => regel(u, u.van));
      const uitgedaagd = this.uitdagingen
        .filter(
          (u) =>
            u.van === ik.speler_id &&
            u.potje_id === undefined &&
            nu < u.tijd + NepServer.UITDAGING_KEUZE_MS &&
            (u.aantal > 2 || (u.status === "open" && loopt(u)) || u.status === "accepted"),
        )
        .map((u) => regel(u, u.naar));
      return json(200, { vriendcode: this.vriendcodeVan(ik.speler_id), vrienden, verzoeken, uitdagingen, uitgedaagd });
    }
    // Vriend toevoegen (taak 162), zoals de server: Spelersnaam bij de Vriendcode, Vriendverzoek, goedkeuren, weigeren.
    const vc = /^\/api\/vrienden\/code\/([^/]+)$/.exec(url);
    if (vc || url === "/api/vrienden/verzoeken") {
      if (!ik) return json(401, { fout: "Unknown key" });
      const code = (vc ? decodeURIComponent(vc[1]) : String(body.vriendcode ?? "")).replace(/\s/g, "");
      const ander = this.spelers.find((s) => this.vriendcodeVan(s.speler_id) === code && s.sleutel !== "verwijderd");
      if (!ander || this.heeftGeblokkeerd(ik.speler_id, ander.speler_id) || this.heeftGeblokkeerd(ander.speler_id, ik.speler_id)) {
        return json(404, { fout: "Unknown friend code" });
      }
      if (ander.speler_id === ik.speler_id) return json(400, { fout: "You cannot add yourself" });
      const alVrienden = (this.nieuweVrienden.get(ik.speler_id)?.has(ander.speler_id) ?? false) && !(this.vriendenWeg.get(ik.speler_id)?.has(ander.speler_id) ?? false);
      if (vc) return json(200, { spelersnaam: ander.spelersnaam, vrienden: alVrienden });
      const omgekeerd = this.vriendverzoeken.findIndex((v) => v.van === ander.speler_id && v.naar === ik.speler_id);
      if (alVrienden || omgekeerd >= 0) {
        if (omgekeerd >= 0) this.vriendverzoeken.splice(omgekeerd, 1);
        this.maakVrienden(ik.speler_id, ander.speler_id);
        return json(200, { spelersnaam: ander.spelersnaam, vrienden: true });
      }
      if (!this.vriendverzoeken.some((v) => v.van === ik.speler_id && v.naar === ander.speler_id)) {
        this.vriendverzoeken.push({ van: ik.speler_id, naar: ander.speler_id, geweigerd: false });
      }
      return json(200, { spelersnaam: ander.spelersnaam, vrienden: false });
    }
    const vv = /^\/api\/vrienden\/verzoeken\/(\d+)(\/goedkeuren)?$/.exec(url);
    if (vv) {
      if (!ik) return json(401, { fout: "Unknown key" });
      const van = Number(vv[1]);
      const nu = this.vriendverzoeken.find((v) => v.van === van && v.naar === ik.speler_id);
      if (vv[2] && init.method === "POST") {
        if (!nu || nu.geweigerd) return json(404, { fout: "Unknown friend request" });
        this.vriendverzoeken.splice(this.vriendverzoeken.indexOf(nu), 1);
        this.maakVrienden(ik.speler_id, van);
        return new Response(null, { status: 204 });
      }
      if (!vv[2] && init.method === "DELETE") {
        if (nu) nu.geweigerd = true;
        return new Response(null, { status: 204 });
      }
    }
    // Een tot vijf vrienden uitdagen (taak 163 en 164), zoals de server: uitdagen, de stand volgen, Accept, Decline en de keuze.
    if (url === "/api/uitdagingen" && init.method === "POST") {
      if (!ik) return json(401, { fout: "Unknown key" });
      const ids: number[] = body.vriend_ids?.length ? body.vriend_ids : body.vriend_id !== undefined ? [body.vriend_id] : [];
      if (ids.length < 1 || ids.length > 5) return json(400, { fout: "Challenge 1 to 5 friends at once" });
      if (new Set(ids).size !== ids.length) return json(400, { fout: "Choose each friend only once" });
      const aantal = ids.length + 1;
      if (!NepServer.BORD_AANTALLEN[body.bord as "ster" | "vierkant"]?.includes(aantal)) {
        return json(400, { fout: `A game on the ${body.bord === "ster" ? "star" : "square"} board does not have ${aantal} players` });
      }
      const vrienden = ids.map((id) => this.spelers.find((x) => x.speler_id === Number(id)));
      if (vrienden.some((v) => !v || !this.isVriend(ik.speler_id, v.speler_id))) return json(404, { fout: "Unknown player" });
      const nu = this.nu();
      const loopt = (u: (typeof this.uitdagingen)[number]) =>
        u.potje_id === undefined && ((u.status === "open" && nu < u.tijd + NepServer.UITDAGING_GELDIG_MS) || (u.status === "accepted" && nu < u.tijd + NepServer.UITDAGING_KEUZE_MS));
      if (this.uitdagingen.some((u) => u.van === ik.speler_id && ids.includes(u.naar) && loopt(u))) {
        return json(409, { fout: "You already challenged this friend" });
      }
      const eerste = this.uitdagingen.length + 1;
      for (const v of vrienden) {
        this.uitdagingen.push({
          id: this.uitdagingen.length + 1,
          van: ik.speler_id,
          naar: v!.speler_id,
          bord: body.bord,
          denktijd_s: body.denktijd_s ?? null,
          tijd: nu,
          status: "open",
          groep: eerste,
          aantal,
        });
      }
      return json(200, { id: eerste, spelersnaam: vrienden.map((v) => v!.spelersnaam).join(", "), verloopt_ms: nu + NepServer.UITDAGING_GELDIG_MS });
    }
    const ud = /^\/api\/uitdagingen\/(\d+)(\/accepteren|\/start)?$/.exec(url);
    if (ud) {
      if (!ik) return json(401, { fout: "Unknown key" });
      const id = Number(ud[1]);
      const nu = this.nu();
      const loopt = (u: (typeof this.uitdagingen)[number]) => u.status === "open" && nu < u.tijd + NepServer.UITDAGING_GELDIG_MS;
      const rij = this.uitdagingen.find((x) => x.id === id);
      const groep = this.uitdagingen.filter((x) => x.groep === id && x.van === ik.speler_id);
      const maakGroepPotje = (spelers: number[], aantal: number, eerste: (typeof this.uitdagingen)[number]) => {
        const p = this.maakPotje(spelers, aantal, eerste.bord, eerste.denktijd_s);
        for (const x of this.uitdagingen.filter((x) => x.groep === eerste.groep)) x.potje_id = p.potje_id;
        if (p.spelers.length < p.aantal_spelers) this.vulMetComputer(p);
        return p;
      };
      if (init.method === "GET" && !ud[2]) {
        if (groep.length > 0) {
          const aantal = groep[0].aantal;
          const potjeId = groep.find((x) => x.potje_id !== undefined)?.potje_id;
          const naam = (u: (typeof groep)[number]) => this.spelers.find((s) => s.speler_id === u.naar)!.spelersnaam;
          const geaccepteerd = groep.filter((x) => x.status === "accepted").map(naam);
          const wachtend = groep.filter((x) => loopt(x)).length;
          const geweigerd = aantal - 1 - geaccepteerd.length - wachtend;
          let status: string = "open";
          let kan_beginnen = false;
          if (potjeId !== undefined) status = "accepted";
          else if (aantal === 2) status = groep[0].status === "declined" ? "declined" : wachtend === 0 ? "expired" : "open";
          else if (geweigerd > 0) {
            status = nu < groep[0].tijd + NepServer.UITDAGING_KEUZE_MS ? "choice" : "expired";
            kan_beginnen = geaccepteerd.length > 0 && NepServer.BORD_AANTALLEN[groep[0].bord].includes(geaccepteerd.length + 1);
          }
          const potje = status === "accepted" ? this.info(this.potjes.find((p) => p.potje_id === potjeId)!) : null;
          return json(200, { status, potje, aantal_spelers: aantal, geaccepteerd, geweigerd, wachtend, kan_beginnen });
        }
        if (!rij || rij.naar !== ik.speler_id) return json(404, { fout: "Unknown challenge" });
        let status = "expired";
        if (rij.status === "accepted" && rij.potje_id !== undefined) status = "accepted";
        else if (rij.status === "accepted" && nu < rij.tijd + NepServer.UITDAGING_KEUZE_MS) status = "open";
        else if (rij.status === "open" && loopt(rij)) status = "open";
        else if (rij.status === "declined") status = "declined";
        const potje = status === "accepted" ? this.info(this.potjes.find((p) => p.potje_id === rij.potje_id)!) : null;
        return json(200, { status, potje, aantal_spelers: rij.aantal, geaccepteerd: [], geweigerd: 0, wachtend: 0, kan_beginnen: false });
      }
      if (init.method === "POST" && ud[2] === "/accepteren") {
        if (!rij || rij.naar !== ik.speler_id || !loopt(rij) || !this.isVriend(ik.speler_id, rij.van)) return json(404, { fout: "Unknown challenge" });
        rij.status = "accepted";
        const gezamenlijk = this.uitdagingen.filter((x) => x.groep === rij.groep && x.status === "accepted");
        if (gezamenlijk.length + 1 < rij.aantal) return json(200, { potje: null });
        const p = maakGroepPotje([rij.van, ...gezamenlijk.map((x) => x.naar)], rij.aantal, rij);
        return json(200, { potje: this.info(p) });
      }
      if (init.method === "POST" && ud[2] === "/start") {
        if (groep.length === 0 || nu >= groep[0].tijd + NepServer.UITDAGING_KEUZE_MS) return json(404, { fout: "Unknown challenge" });
        if (groep.some((x) => x.potje_id !== undefined)) return json(409, { fout: "This challenge has already started" });
        const aantal = groep[0].aantal;
        const accepteerders = groep.filter((x) => x.status === "accepted").map((x) => x.naar);
        const geweigerd = aantal - 1 - accepteerders.length - groep.filter((x) => loopt(x)).length;
        if (aantal === 2 || geweigerd === 0) return json(409, { fout: "Wait for the answers first" });
        const totaal = body.keuze === "computer" ? aantal : accepteerders.length + 1;
        if (body.keuze !== "computer" && body.keuze !== "beginnen") return json(400, { fout: "The request is not valid JSON for this address" });
        if (body.keuze === "beginnen" && accepteerders.length < 1) return json(400, { fout: "Nobody accepted yet" });
        if (!NepServer.BORD_AANTALLEN[groep[0].bord].includes(totaal)) return json(400, { fout: "That board does not have that many players" });
        const p = maakGroepPotje([ik.speler_id, ...accepteerders], totaal, groep[0]);
        for (const x of groep) if (x.status === "open") x.status = "declined";
        return json(200, this.info(p));
      }
      if (init.method === "DELETE" && !ud[2]) {
        if (rij && rij.naar === ik.speler_id && rij.status === "open") rij.status = "declined";
        // De uitdager trekt zijn Uitdaging in zolang het Potje niet begon.
        if (groep.length > 0 && groep.every((x) => x.potje_id === undefined)) {
          this.uitdagingen = this.uitdagingen.filter((x) => !(x.groep === id && x.van === ik.speler_id));
        }
        return new Response(null, { status: 204 });
      }
    }
    const vm = /^\/api\/vrienden\/(\d+)$/.exec(url);
    if (vm && init.method === "DELETE") {
      if (!ik) return json(401, { fout: "Unknown key" });
      const weg = this.vriendenWeg.get(ik.speler_id) ?? new Set<number>();
      weg.add(Number(vm[1]));
      this.vriendenWeg.set(ik.speler_id, weg);
      return new Response(null, { status: 204 });
    }
    if (url === "/api/statistieken") {
      if (!ik) return json(401, { fout: "Unknown key" });
      return json(200, this.statistieken(ik.speler_id));
    }
    if (url === "/api/prestaties") {
      if (!ik) return json(401, { fout: "Unknown key" });
      return json(200, this.prestaties(ik.speler_id));
    }
    if (url === "/api/ranglijst") {
      if (!ik) return json(401, { fout: "Unknown key" });
      const deel = new Set(this.potjes.filter((p) => p.spelers.includes(ik.speler_id)).flatMap((p) => p.spelers));
      const tel = new Map<number, { speler_id: number; spelersnaam: string; gewonnen: number; gespeeld: number; rating: number }>();
      for (const p of this.potjes) {
        const st = this.stand(p);
        if (!st.afgelopen) continue;
        for (const sp of st.spelers) {
          if (!deel.has(sp.speler_id)) continue;
          const r = tel.get(sp.speler_id) ?? { speler_id: sp.speler_id, spelersnaam: sp.spelersnaam, gewonnen: 0, gespeeld: 0, rating: this.rating(sp.speler_id) };
          r.gespeeld++;
          if (st.winnaar === sp.plek) r.gewonnen++;
          tel.set(sp.speler_id, r);
        }
      }
      return json(200, [...tel.values()].sort((a, b) => b.rating - a.rating || b.gewonnen - a.gewonnen || a.gespeeld - b.gespeeld || a.spelersnaam.localeCompare(b.spelersnaam)));
    }
    const m = /^\/api\/uitnodigingen\/([^/]+)(\/meedoen)?$/.exec(url);
    if (m) {
      const p = this.potjes.find((x) => x.uitnodiging === m[1]);
      if (!p) return json(404, { fout: "Unknown invite" });
      if (m[2]) {
        if (!ik) return json(401, { fout: "Unknown key" });
        if (!p.spelers.includes(ik.speler_id)) {
          if (p.spelers.length >= p.aantal_spelers) return json(409, { fout: "This game is full" });
          p.spelers.push(ik.speler_id);
          p.beurt_sinds = this.nu();
          this.stuur(p);
        }
      }
      return json(200, this.info(p));
    }
    const pm = /^\/api\/potjes\/(\d+)(?:\/(zetten|opgeven|live|berichten|rapporten))?$/.exec(url);
    if (pm) {
      if (!ik) return json(401, { fout: "Unknown key" });
      const p = this.potjes.find((x) => x.potje_id === Number(pm[1]));
      if (!p || !p.spelers.includes(ik.speler_id)) return json(404, { fout: "Unknown game" });
      const plek = p.spelers.indexOf(ik.speler_id) + 1;
      // Zonder WebSocket (een gewone GET) zegt de Worker 426.
      if (pm[2] === "live") return json(426, { fout: "Live updates need a WebSocket" });
      if (pm[2] === "rapporten") {
        const b = p.berichten.find((x) => x.id === body.bericht_id);
        if (!b) return json(404, { fout: "Unknown message" });
        if (b.speler_id === ik.speler_id) return json(400, { fout: "You cannot report yourself" });
        this.rapporten.push({ melder_id: ik.speler_id, speler_id: b.speler_id, potje_id: p.potje_id, bericht_id: b.id, tekst: b.tekst });
        return new Response(null, { status: 201 });
      }
      if (pm[2] === "berichten") {
        if (init.method !== "POST") return json(200, p.berichten.filter((b) => !this.heeftGeblokkeerd(ik.speler_id, b.speler_id)));
        const t = String(body.tekst ?? "").trim();
        if (p.snel && !VASTE_ZINNEN.includes(t)) return json(400, { fout: "Pick a quick message from the list" });
        if (t.length < 1 || [...t].length > 300) return json(400, { fout: "A message has 1 to 300 characters" });
        return json(201, this.berichtVan(p, plek, t));
      }
      if (pm[2] === "zetten") {
        if (p.spelers.length < p.aantal_spelers) return json(409, { fout: "The game is not full yet" });
        if (p.game.is_afgelopen() || p.game.aan_de_beurt() + 1 !== plek) return json(409, { fout: "It is not your turn" });
        // Het aantal Sprongen van deze Zet, voor de Statistieken (een Stap is 0 Sprongen).
        const stap = Array.from(p.game.stappen(body.van)).includes(body.naar);
        let sprongen = 0;
        if (!stap) {
          try {
            sprongen = Math.max(1, zet_pad(p.bord === "vierkant", Int32Array.from(p.game.stand()), body.van, body.naar).length - 1);
          } catch {
            sprongen = 1;
          }
        }
        try {
          p.game.zet(body.van, body.naar);
        } catch (e) {
          return json(400, { fout: String(e) });
        }
        p.eigen ??= new Map();
        const e = p.eigen.get(plek) ?? { zetten: 0, sprongen: 0 };
        p.eigen.set(plek, { zetten: e.zetten + 1, sprongen: Math.max(e.sprongen, sprongen) });
        this.nieuweBeurt(p, { plek, soort: "zet", van: body.van, naar: body.naar });
        return json(200, this.stand(p));
      }
      if (pm[2] === "opgeven") {
        p.game.geef_op(plek - 1);
        p.opgegeven.add(plek);
        this.nieuweBeurt(p, { plek, soort: "opgeven", van: null, naar: null });
        return json(200, this.stand(p));
      }
      return json(200, this.stand(p));
    }
    return json(404, { fout: "Unknown" });
  };
}
