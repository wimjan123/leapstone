/** Praten met de server: Speler, Uitnodiging en Potje. Alleen /api op de eigen server; live via een WebSocket. */
import { IS_APP, LINK_BASIS, SERVER } from "./omgeving";
import { dezeIsTest } from "./testspeler";
import { huidigeTaal, t } from "./taal.svelte";

export type OpgeslagenSpeler = { speler_id: number; spelersnaam: string; sleutel: string };
export type PotjeSpeler = {
  plek: number;
  speler_id: number;
  spelersnaam: string;
  /** De Rating van de Speler; alleen in een Snel potje. */
  rating?: number;
};
export type PotjeInfo = {
  potje_id: number;
  uitnodiging: string;
  bord: string;
  aantal_spelers: number;
  spelers: PotjeSpeler[];
  vol: boolean;
  /** Denktijd in seconden, of null zonder grens (ontbreekt bij een oude server). */
  denktijd_s?: number | null;
};
/** De Rating van een Speler voor en na een afgelopen Snel potje. */
export type RatingVerandering = { voor: number; na: number };
export type StandSpeler = PotjeSpeler & {
  status: "speelt" | "klaar" | "opgegeven";
  /** Alleen na afloop van een Snel potje. */
  rating_verandering?: RatingVerandering;
};
export type LaatsteZet = { nummer: number; plek: number; soort: "zet" | "opgeven" | "overgeslagen"; van: number | null; naar: number | null };
/** De stand van een online Potje, zoals de server hem stuurt (ook op de live verbinding). */
export type Stand = {
  potje_id: number;
  uitnodiging: string;
  bord: "ster" | "vierkant";
  aantal_spelers: number;
  spelers: StandSpeler[];
  gestart: boolean;
  versie: number;
  /** Per vak: 0 is leeg, anders de plek (vanaf 1) van de Speler met de steen. */
  stand: number[];
  aan_de_beurt: number | null;
  laatste_zet: LaatsteZet | null;
  afgelopen: boolean;
  winnaar: number | null;
  ranglijst: number[];
  /** Denktijd in seconden, of null zonder grens. */
  denktijd_s?: number | null;
  /** Wanneer de beurt van wie aan de beurt is op is (ms sinds 1970, klok van de server), of null. */
  deadline_ms?: number | null;
  /** "Nu" volgens de server toen hij deze stand stuurde, om het verschil met de eigen klok weg te rekenen. */
  server_tijd_ms?: number;
  /** Een Snel potje (Play online): geen Uitnodiging en geen Chat. */
  snel?: boolean;
  /** Tot wanneer (ms, klok van de server) het Potje op een tegenstander wacht; null zodra het begonnen is. */
  zoek_tot_ms?: number | null;
};
/** Eén regel van de Ranglijst, zoals `GET /api/ranglijst` hem geeft (al gesorteerd). */
export type RanglijstRij = {
  speler_id: number;
  spelersnaam: string;
  gewonnen: number;
  gespeeld: number;
  /** De Rating van de Speler; de lijst is hierop gesorteerd. */
  rating: number;
};
/** Een Record in Statistieken: in welk Potje en tegen wie. `waarde`: Sprongen (langste Sprong) of eigen Zetten (snelste overwinning). */
export type StatistiekRecord = { potje_id: number; waarde: number; tegenstanders: string[] };
/** De eigen Statistieken, zoals `GET /api/statistieken` ze geeft. */
export type Statistieken = {
  gespeeld: number;
  gewonnen: number;
  verloren: number;
  /** 0 tot 1; null zonder afgelopen Potjes. */
  deel_gewonnen: number | null;
  gemiddelde_plek: number | null;
  /** De Rating na elk van de laatste 50 Potjes met een Ratingwijziging, het oudste eerst. */
  rating_verloop: number[];
  langste_sprong: StatistiekRecord | null;
  snelste_overwinning: StatistiekRecord | null;
};
/** Eén Prestatie van de Speler, zoals `GET /api/prestaties` ze geeft: `behaald_ms` is leeg zolang ze niet gehaald is. */
export type Prestatie = { id: PrestatieId; behaald_ms: number | null };
export type PrestatieId =
  | "first_win"
  | "wins_10"
  | "wins_50"
  | "wins_100"
  | "jumps_6"
  | "jumps_10"
  | "square_win"
  | "six_players_win"
  | "puzzle_streak_7"
  | "five_friends";
/** Eén regel in Mijn potjes, zoals `GET /api/mijn-potjes` hem geeft. */
export type MijnPotje = {
  potje_id: number;
  uitnodiging: string;
  bord: "ster" | "vierkant";
  aantal_spelers: number;
  spelers: PotjeSpeler[];
  gestart: boolean;
  /** Plek (vanaf 1) van de Speler aan de beurt, of null. */
  aan_de_beurt: number | null;
  jouw_plek: number;
  afgelopen: boolean;
  winnaar: number | null;
  /** Seconden sinds 1970. */
  laatste_activiteit: number;
  /** Denktijd in seconden, of null zonder grens. */
  denktijd_s?: number | null;
  snel?: boolean;
};
/** Eén vriend in de Vriendenlijst, zoals `GET /api/vrienden` hem geeft. */
export type Vriend = { speler_id: number; spelersnaam: string; rating: number; laatst_ms: number };
/** De Vriendenlijst: jouw Vriendcode (acht cijfers) en de vrienden, de laatst gespeelde eerst. */
export type Vriendenlijst = { vriendcode: string; vrienden: Vriend[]; verzoeken: Vriendverzoek[]; uitdagingen: Uitdaging[]; uitgedaagd: Uitdaging[] };
/**
 * Een open Uitdaging. `speler_id` en `spelersnaam` zijn die van de ander: de uitdager in `uitdagingen` (aan jou), de
 * uitgedaagde vriend in `uitgedaagd` (van jou).
 */
export type Uitdaging = {
  id: number;
  speler_id: number;
  spelersnaam: string;
  bord: "ster" | "vierkant";
  denktijd_s: number | null;
  verloopt_ms: number;
  /** Het aantal Spelers van het Potje, jij mee: 2 bij één vriend, tot 6 bij meer vrienden (taak 164). */
  aantal_spelers: number;
  /** Het id van de hele Uitdaging; daarmee volg je haar. Bij één vriend gelijk aan `id`. */
  groep: number;
  /** Het antwoord van de uitgedaagde vriend; in `uitdagingen` (aan jou) altijd `open`. */
  antwoord: "open" | "accepted" | "declined";
};
/** Het antwoord op een nieuwe Uitdaging. */
export type UitdagingUitkomst = { id: number; spelersnaam: string; verloopt_ms: number };
/**
 * Waar jouw Uitdaging staat. `declined` en `expired` (5 minuten zonder antwoord) zijn voor de uitdager allebei "Not now".
 * Bij meer vrienden is het `choice` zodra iemand nee zei of de 5 minuten om zijn: dan kiest de uitdager (taak 164).
 * Voor een uitgedaagde vriend betekent `open` ook: je accepteerde en de anderen moeten nog.
 */
export type UitdagingStand = {
  status: "open" | "accepted" | "declined" | "expired" | "choice";
  potje: PotjeInfo | null;
  aantal_spelers: number;
  /** De Spelersnamen van wie al accepteerde. */
  geaccepteerd: string[];
  geweigerd: number;
  wachtend: number;
  /** Kent het bord het aantal Spelers van wie accepteerde? Dan kan de uitdager daarmee beginnen. */
  kan_beginnen: boolean;
};
/** Wat de uitdager kiest na een Decline of na 5 minuten: beginnen met wie accepteerde, of de lege plekken vullen met Computerspelers. */
export type UitdagingKeuze = "beginnen" | "computer";
/** Een Vriendverzoek aan jou: wie het stuurde. Jij kiest goedkeuren of weigeren. */
export type Vriendverzoek = { speler_id: number; spelersnaam: string; tijd_ms: number };
/** De Speler achter een Vriendcode, voor je een Vriendverzoek stuurt. */
export type VriendKandidaat = { spelersnaam: string; vrienden: boolean };
/** Het antwoord op een Vriendverzoek: `vrienden` als jullie meteen vrienden zijn (de ander vroeg jou ook al). */
export type VerzoekUitkomst = { spelersnaam: string; vrienden: boolean };
/** Een Bericht in de Chat van een Potje, zoals de server het stuurt (ook als event `bericht`). */
export type Bericht = { id: number; plek: number; speler_id: number; spelersnaam: string; tekst: string; tijd: number };
/** Een Speler die jij blokkeerde, zoals `GET /api/blokkades` hem geeft. */
export type GeblokkeerdeSpeler = { speler_id: number; spelersnaam: string };
export const MAX_BERICHT = 300;
export type NieuweSpeler = OpgeslagenSpeler & { herstelcode: string };

export class ApiFout extends Error {
  constructor(
    public status: number,
    bericht: string,
  ) {
    super(bericht);
  }
}

const OPSLAG = "halma.speler";

export function leesSpeler(): OpgeslagenSpeler | null {
  try {
    const s = JSON.parse(localStorage.getItem(OPSLAG) ?? "null");
    return s && typeof s.sleutel === "string" ? s : null;
  } catch {
    return null;
  }
}

export function bewaarSpeler(s: NieuweSpeler): OpgeslagenSpeler {
  const { speler_id, spelersnaam, sleutel } = s;
  const bewaard = { speler_id, spelersnaam, sleutel };
  localStorage.setItem(OPSLAG, JSON.stringify(bewaard));
  return bewaard;
}

const POTJE_OPSLAG = "halma.potje";

/** Het Potje waar deze Speler mee bezig is, zodat verversen hem terugbrengt. */
export function leesPotjeId(): number | null {
  const n = Number(localStorage.getItem(POTJE_OPSLAG));
  return Number.isInteger(n) && n > 0 ? n : null;
}
export function bewaarPotjeId(id: number | null) {
  if (id === null) localStorage.removeItem(POTJE_OPSLAG);
  else localStorage.setItem(POTJE_OPSLAG, String(id));
}

async function vraag<T>(pad: string, opties: { sleutel?: string; body?: unknown; post?: boolean; methode?: "DELETE" } = {}): Promise<T> {
  let antwoord: Response;
  try {
    antwoord = await fetch(`${SERVER}/api${pad}`, {
      method: opties.methode ?? (opties.body === undefined && !opties.post ? "GET" : "POST"),
      headers: {
        ...(opties.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(opties.sleutel ? { Authorization: `Bearer ${opties.sleutel}` } : {}),
      },
      body: opties.body !== undefined ? JSON.stringify(opties.body) : undefined,
    });
  } catch {
    throw new ApiFout(0, t("online.offline"));
  }
  if (!antwoord.ok) {
    const j = await antwoord.json().catch(() => ({}));
    throw new ApiFout(antwoord.status, typeof j.fout === "string" ? j.fout : t("online.error"));
  }
  // 201 of 204 zonder inhoud (Rapport, Blokkeren) is ook goed.
  const tekst = await antwoord.text();
  return (tekst ? JSON.parse(tekst) : undefined) as T;
}

/** Vertelt de server in welke taal de Speler speelt (voor Meldingen en foutmeldingen). */
export const zetServerTaal = (sleutel: string, taal: string) => vraag<void>("/taal", { sleutel, body: { taal } });

/**
 * Geeft de huidige taal door aan de server, als er een Speler is. Mislukt dat (geen verbinding), dan blijft de
 * oude taal staan tot de volgende keer: een Melding in een andere taal is geen reden voor een foutmelding.
 */
export function meldTaal(): void {
  const s = leesSpeler();
  if (s) zetServerTaal(s.sleutel, huidigeTaal()).catch(() => {});
}

export const maakSpeler = (spelersnaam: string) =>
  vraag<NieuweSpeler>("/spelers", { body: dezeIsTest(IS_APP) ? { spelersnaam, test: true } : { spelersnaam } });
export const herstel = (herstelcode: string) =>
  vraag<NieuweSpeler>("/herstel", { body: { herstelcode } });
export const maakPotje = (sleutel: string, bord: "ster" | "vierkant", aantal_spelers: number, denktijd_s: number | null) =>
  vraag<PotjeInfo>("/potjes", { sleutel, body: { bord, aantal_spelers, denktijd_s } });
export const bekijkUitnodiging = (code: string) =>
  vraag<PotjeInfo>(`/uitnodigingen/${encodeURIComponent(code)}`);
export const doeMee = (sleutel: string, code: string) =>
  vraag<PotjeInfo>(`/uitnodigingen/${encodeURIComponent(code)}/meedoen`, { sleutel, post: true });
/** Play online: zoekt een Snel potje. De server koppelt aan wie het eerst wacht, of wacht op een tegenstander. */
export const zoekSnelPotje = (sleutel: string, meer = false) =>
  vraag<Stand>("/snel", meer ? { sleutel, body: { meer: true } } : { sleutel, post: true });
/** Stopt met zoeken: de Speler verlaat de wachtrij. Is het Potje al begonnen, dan geeft de server 409. */
export const stopZoeken = (sleutel: string, potjeId: number) => vraag<void>(`/snel/${potjeId}`, { sleutel, methode: "DELETE" });
export const haalMijnPotjes = (sleutel: string) => vraag<MijnPotje[]>("/mijn-potjes", { sleutel });
export const haalRanglijst = (sleutel: string) => vraag<RanglijstRij[]>("/ranglijst", { sleutel });
export const haalVrienden = (sleutel: string) => vraag<Vriendenlijst>("/vrienden", { sleutel });
export const verwijderVriend = (sleutel: string, spelerId: number) => vraag<void>(`/vrienden/${spelerId}`, { sleutel, methode: "DELETE" });
/** De cijfers van een ingetypte Vriendcode (spaties en streepjes weg). Acht cijfers is een volledige code. */
export const vriendcodeCijfers = (invoer: string) => invoer.replace(/\D/g, "").slice(0, 8);
export const zoekVriendcode = (sleutel: string, code: string) => vraag<VriendKandidaat>(`/vrienden/code/${encodeURIComponent(code)}`, { sleutel });
export const stuurVriendverzoek = (sleutel: string, vriendcode: string) =>
  vraag<VerzoekUitkomst>("/vrienden/verzoeken", { sleutel, body: { vriendcode } });
export const keurVriendverzoekGoed = (sleutel: string, spelerId: number) =>
  vraag<void>(`/vrienden/verzoeken/${spelerId}/goedkeuren`, { sleutel, post: true });
export const weigerVriendverzoek = (sleutel: string, spelerId: number) =>
  vraag<void>(`/vrienden/verzoeken/${spelerId}`, { sleutel, methode: "DELETE" });
/** Eén vriend uitdagen voor een live Potje van twee. De server geeft 409 als jouw Uitdaging aan hem nog openstaat. */
export const daagUit = (sleutel: string, vriendId: number, bord: "ster" | "vierkant", denktijd_s: number | null) =>
  vraag<UitdagingUitkomst>("/uitdagingen", { sleutel, body: { vriend_id: vriendId, bord, denktijd_s } });
/** Waar jouw Uitdaging nu staat; bij `accepted` hoort het Potje. */
export const haalUitdaging = (sleutel: string, id: number) => vraag<UitdagingStand>(`/uitdagingen/${id}`, { sleutel });
/** Twee tot vijf vrienden tegelijk uitdagen voor een Potje van drie tot zes Spelers. */
export const daagVrienden = (sleutel: string, vriendIds: number[], bord: "ster" | "vierkant", denktijd_s: number | null) =>
  vraag<UitdagingUitkomst>("/uitdagingen", { sleutel, body: { vriend_ids: vriendIds, bord, denktijd_s } });
/** Accept: heeft iedereen geaccepteerd, dan maakt de server het live Potje voor allen. Anders is het antwoord `null`: wacht op de anderen. */
export const accepteerUitdaging = async (sleutel: string, id: number) =>
  (await vraag<{ potje: PotjeInfo | null }>(`/uitdagingen/${id}/accepteren`, { sleutel, post: true })).potje;
/** De keuze van de uitdager na een Decline of na 5 minuten; het live Potje begint meteen. */
export const startUitdaging = (sleutel: string, id: number, keuze: UitdagingKeuze) =>
  vraag<PotjeInfo>(`/uitdagingen/${id}/start`, { sleutel, body: { keuze } });
/** Het aantal Spelers dat elk bord kent (zoals halma-core). */
const BORD_AANTALLEN = { ster: [2, 3, 4, 6], vierkant: [2, 4] };
/** Kent dit bord een Potje met zoveel Spelers? */
export const bordKentAantal = (bord: "ster" | "vierkant", aantal: number) => BORD_AANTALLEN[bord].includes(aantal);
/** Decline: de uitdager ziet "Not now". De uitdager zelf trekt zo zijn Uitdaging in. */
export const weigerUitdaging = (sleutel: string, id: number) => vraag<void>(`/uitdagingen/${id}`, { sleutel, methode: "DELETE" });
/** Zo vaak kijkt Friends of er een Uitdaging bij kwam of een antwoord op de eigen Uitdaging (milliseconden). */
export const UITDAGING_POLL_MS = 3000;
/** De Vriendcode zoals de Speler hem leest: `4821 0937`. */
export const toonVriendcode = (code: string) => code.replace(/^(\d{4})(\d{4})$/, "$1 $2");
export const haalStatistieken = (sleutel: string) => vraag<Statistieken>("/statistieken", { sleutel });
/** Meldt de server de datum (jjjj-mm-dd) waarop de Speler de Dagelijkse puzzel oploste (taak 175). Alleen de datum. */
export const meldPuzzeldag = (sleutel: string, datum: string) => vraag<void>("/puzzeldagen", { sleutel, body: { datum } });
export const haalPrestaties = (sleutel: string) => vraag<Prestatie[]>("/prestaties", { sleutel });
export const haalStand = (sleutel: string, potjeId: number) => vraag<Stand>(`/potjes/${potjeId}`, { sleutel });
export const doeZet = (sleutel: string, potjeId: number, van: number, naar: number) =>
  vraag<Stand>(`/potjes/${potjeId}/zetten`, { sleutel, body: { van, naar } });
export const haalBerichten = (sleutel: string, potjeId: number) => vraag<Bericht[]>(`/potjes/${potjeId}/berichten`, { sleutel });
export const stuurBericht = (sleutel: string, potjeId: number, tekst: string) =>
  vraag<Bericht>(`/potjes/${potjeId}/berichten`, { sleutel, body: { tekst } });
export const geefOp = (sleutel: string, potjeId: number) =>
  vraag<Stand>(`/potjes/${potjeId}/opgeven`, { sleutel, post: true });
/** Een Rapport over een Bericht voor William (de beheerpagina). */
export const rapporteer = (sleutel: string, potjeId: number, berichtId: number) =>
  vraag<void>(`/potjes/${potjeId}/rapporten`, { sleutel, body: { bericht_id: berichtId } });
export const blokkeer = (sleutel: string, spelerId: number) => vraag<void>("/blokkades", { sleutel, body: { speler_id: spelerId } });
export const deblokkeer = (sleutel: string, spelerId: number) => vraag<void>(`/blokkades/${spelerId}`, { sleutel, methode: "DELETE" });
export const haalBlokkades = (sleutel: string) => vraag<GeblokkeerdeSpeler[]>("/blokkades", { sleutel });

/** Voegt Berichten samen op id: dubbele vallen weg, de volgorde is die van versturen. */
export function voegBerichtenSamen(oud: Bericht[], nieuw: Bericht[]): Bericht[] {
  const perId = new Map<number, Bericht>();
  for (const b of [...oud, ...nieuw]) perId.set(b.id, b);
  return [...perId.values()].sort((a, b) => a.id - b.id);
}

const gelezenSleutel = (potjeId: number) => `halma.chat.${potjeId}`;
/** Het id van het laatste Bericht dat deze Speler gezien heeft (0 als nog niets). */
export function leesGelezen(potjeId: number): number {
  const n = Number(localStorage.getItem(gelezenSleutel(potjeId)));
  return Number.isSafeInteger(n) && n > 0 ? n : 0;
}
export function bewaarGelezen(potjeId: number, id: number) {
  if (id > leesGelezen(potjeId)) localStorage.setItem(gelezenSleutel(potjeId), String(id));
}

export const TERUGVAL_MS = [500, 1000, 2000, 4000, 8000];
/** Zo vaak stuurt de app `ping`; de server antwoordt `pong` zonder wakker te worden. */
export const PING_MS = 25_000;
/** Komt er zo lang niets binnen (ook geen `pong`), dan is de verbinding dood. */
export const STIL_MS = 60_000;

/** Het adres van de live verbinding: dezelfde server, met ws:// of wss://. */
export function liveAdres(potjeId: number): string {
  const basis = SERVER || location.origin;
  return `${basis.replace(/^http/, "ws")}/api/potjes/${potjeId}/live`;
}

/**
 * Eén live verbinding (WebSocket). Stuurt eerst de sleutel; daarna komt elke stand en elk Bericht
 * als `{"soort": "stand" | "bericht", "data": ...}`. Geeft de sluitcode als de verbinding dicht is.
 */
function liveVerbinding(
  sleutel: string,
  potjeId: number,
  stop: AbortSignal,
  opStand: (s: Stand, eerste: boolean) => void,
  opBericht: (b: Bericht) => void,
): Promise<number> {
  return new Promise((klaar) => {
    const ws = new WebSocket(liveAdres(potjeId));
    let laatst = Date.now();
    let eerste = true;
    const sluit = () => {
      try {
        ws.close(1000);
      } catch {
        // Al dicht.
      }
    };
    const ping = setInterval(() => {
      if (Date.now() - laatst > STIL_MS) return sluit();
      try {
        ws.send("ping");
      } catch {
        // Nog niet open of al dicht: de controle hierboven sluit hem straks.
      }
    }, PING_MS);
    const opStop = () => sluit();
    stop.addEventListener("abort", opStop, { once: true });
    ws.onopen = () => ws.send(JSON.stringify({ sleutel }));
    ws.onmessage = (e: MessageEvent) => {
      laatst = Date.now();
      if (typeof e.data !== "string" || e.data === "pong") return;
      try {
        const { soort, data } = JSON.parse(e.data);
        if (soort === "stand") {
          opStand(data, eerste);
          eerste = false;
        } else if (soort === "bericht") opBericht(data);
      } catch {
        // Een kapot bericht slaan we over; de volgende stand is altijd compleet.
      }
    };
    ws.onclose = (e: CloseEvent) => {
      clearInterval(ping);
      stop.removeEventListener("abort", opStop);
      klaar(e.code);
    };
  });
}

/** Sluitcodes van de server: 4000 plus de HTTP-status. Bij deze stopt de app met volgen. */
const STOP_CODES = [4401, 4403, 4404];

/**
 * Volgt een Potje live. Valt de verbinding weg, dan wacht hij steeds langer, haalt de stand
 * opnieuw op en verbindt weer. Stopt bij 401, 403 of 404. Geeft een functie terug om te stoppen.
 */
export function volgPotje(
  sleutel: string,
  potjeId: number,
  opties: {
    opStand: (s: Stand) => void;
    opVerbonden: (ok: boolean) => void;
    opFout: (e: ApiFout) => void;
    /** Een nieuw Bericht van de live verbinding. */
    opBericht?: (b: Bericht) => void;
    /** Alle Berichten, opgehaald bij elke (her)verbinding. */
    opBerichten?: (lijst: Bericht[]) => void;
    wacht?: number[];
  },
): () => void {
  const stop = new AbortController();
  const wacht = opties.wacht ?? TERUGVAL_MS;
  const slaap = (ms: number) =>
    new Promise<void>((klaar) => {
      const t = setTimeout(klaar, ms);
      stop.signal.addEventListener("abort", () => (clearTimeout(t), klaar()), { once: true });
    });
  (async () => {
    let poging = 0;
    while (!stop.signal.aborted) {
      try {
        const code = await liveVerbinding(
          sleutel,
          potjeId,
          stop.signal,
          (s, eerste) => {
            poging = 0;
            if (eerste) {
              opties.opVerbonden(true);
              // Berichten uit de tijd dat we weg waren; een mislukte poging mag de stand niet hinderen.
              if (opties.opBerichten) {
                haalBerichten(sleutel, potjeId).then(
                  (l) => !stop.signal.aborted && opties.opBerichten?.(l),
                  () => {},
                );
              }
            }
            opties.opStand(s);
          },
          (b) => opties.opBericht?.(b),
        );
        if (STOP_CODES.includes(code)) {
          opties.opFout(new ApiFout(code - 4000, t("online.gameGone")));
          return;
        }
      } catch {
        // Geen WebSocket mogelijk: hieronder opnieuw proberen.
      }
      if (stop.signal.aborted) return;
      opties.opVerbonden(false);
      await slaap(wacht[Math.min(poging++, wacht.length - 1)]);
      if (stop.signal.aborted) return;
      try {
        opties.opStand(await haalStand(sleutel, potjeId));
      } catch (e) {
        if (e instanceof ApiFout && (e.status === 401 || e.status === 404 || e.status === 403)) {
          opties.opFout(e);
          return;
        }
      }
    }
  })();
  return () => stop.abort();
}

export const uitnodigingsLink = (code: string) => `${LINK_BASIS}/uitnodiging/${code}`;

/** De code uit /uitnodiging/<code>, of null. */
export function codeUitPad(pad: string): string | null {
  const m = /^\/uitnodiging\/([^/]+)\/?$/.exec(pad);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    // Kapotte link (bijvoorbeeld "%"): de ruwe tekst gaat naar de server, die zegt "bestaat niet".
    return m[1];
  }
}

/** Het Potje uit /potje/<id> (waar een Melding naartoe wijst), of null. */
export function potjeIdUitPad(pad: string): number | null {
  const m = /^\/potje\/(\d+)\/?$/.exec(pad);
  const n = m ? Number(m[1]) : 0;
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

export function tekstVan(e: unknown): string {
  return e instanceof ApiFout ? e.message : t("online.error");
}

/** Een duidelijke melding als meedoen via een Uitnodiging niet lukt. */
export function meldingBijMeedoen(e: unknown): string {
  if (e instanceof ApiFout) {
    if (e.status === 404) return t("online.inviteMissing");
    if (e.status === 409) return t("online.gameFull");
  }
  return tekstVan(e);
}

/** Deelt Mijn potjes in: jouw beurt bovenaan, de rest die loopt (ook de Wachtkamer), en afgelopen. */
export function deelIn(lijst: MijnPotje[]): { jouwBeurt: MijnPotje[]; wacht: MijnPotje[]; afgelopen: MijnPotje[] } {
  const nieuwste = [...lijst].sort((a, b) => b.laatste_activiteit - a.laatste_activiteit || b.potje_id - a.potje_id);
  return {
    jouwBeurt: nieuwste.filter((p) => !p.afgelopen && p.gestart && p.aan_de_beurt === p.jouw_plek),
    wacht: nieuwste.filter((p) => !p.afgelopen && !(p.gestart && p.aan_de_beurt === p.jouw_plek)),
    afgelopen: nieuwste.filter((p) => p.afgelopen),
  };
}

/**
 * De tegenstanders in een rij van Mijn potjes (taak 284): de eerste `max` namen, en hoeveel er dan nog zijn ("+3"). Zo valt bij zes
 * Spelers niemand ongemerkt weg achter de twee regels van de rij.
 */
export function tegenstandersKort(namen: readonly string[], max = 2): { namen: string[]; meer: number } {
  const n = Math.min(namen.length, max);
  return { namen: namen.slice(0, n), meer: namen.length - n };
}

/** Het adres van het privacybeleid, ook vanuit de native app (daar is de eigen oorsprong tauri.localhost). */
export const PRIVACY_LINK = `${LINK_BASIS}/privacy`;
/** Het adres van de gebruiksregels (chat en Spelersnamen). */
export const TERMS_LINK = `${LINK_BASIS}/terms`;

/**
 * Verwijdert het account van de Speler op de server. Een onbekende sleutel (401) telt als gelukt:
 * het account bestaat dan al niet meer.
 */
export async function verwijderAccount(sleutel: string): Promise<void> {
  let antwoord: Response;
  try {
    antwoord = await fetch(`${SERVER}/api/spelers/mij`, { method: "DELETE", headers: { Authorization: `Bearer ${sleutel}` } });
  } catch {
    throw new ApiFout(0, t("online.offline"));
  }
  if (antwoord.ok || antwoord.status === 401) return;
  const j = await antwoord.json().catch(() => ({}));
  throw new ApiFout(antwoord.status, typeof j.fout === "string" ? j.fout : t("online.error"));
}

/** Wist alles wat deze telefoon van de Speler onthoudt: sleutel, het open Potje en wat gelezen is. */
export function wisLokaleSpeler() {
  try {
    localStorage.removeItem(OPSLAG);
    bewaarPotjeId(null);
    for (const k of Object.keys(localStorage)) if (k.startsWith("halma.chat.")) localStorage.removeItem(k);
  } catch {
    // Geen opslag: dan is er ook niets te wissen.
  }
}

/** De Vaste zinnen die een Speler in een Snel potje mag sturen. De lijst staat op de server. */
export const haalVasteZinnen = () => vraag<string[]>("/vaste-zinnen");
