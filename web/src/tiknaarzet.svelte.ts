/**
 * Van tik naar Zet (taak 259): de gekozen Steen en de Sprongketen, en wat een tik op een vak doet.
 * Het Potje op deze telefoon, het online Potje, de Dagelijkse puzzel en de Speluitleg gebruiken dit.
 * Welke Stappen en Sprongen kunnen, komt uit de spelregels in Rust (halma-core); de Zet zelf voert het
 * scherm uit (online: de server beslist). Er licht nooit een vak op als hint.
 * Welk vak een vinger bedoelt en het terugrollen op het bord staan in tikken.ts (via Bord3D).
 */

import { meld } from "./geluid";
import type { Uitkomst } from "./tikken";

/** De steen die deze Zet al gesprongen heeft: waar hij begon (`van`), waar hij nu staat (`nu`) en welke vakken hij zag. */
export type Keten = { van: number; nu: number; bezocht: number[] };

/** Wat de app van het Potje in WebAssembly nodig heeft. */
export type Sprongregels = {
  stappen(vak: number): ArrayLike<number>;
  volgende_sprongen(van: number, huidige: number, bezocht: Uint32Array): ArrayLike<number>;
};

const lijst = (x: ArrayLike<number>) => Array.from(x);

/** Bij het kiezen van een steen: de Stappen en de eerste Sprongen. */
function eersteBestemmingen(p: Sprongregels, van: number): number[] {
  return [...lijst(p.stappen(van)), ...lijst(p.volgende_sprongen(van, van, Uint32Array.of(van)))];
}

/** Midden in een keten: alleen nog Sprongen, niet terug naar een vak waar de steen al stond. */
function vervolgSprongen(p: Sprongregels, k: Keten): number[] {
  return lijst(p.volgende_sprongen(k.van, k.nu, Uint32Array.from(k.bezocht)));
}

/** De keten na een Sprong naar `naar`. */
function naSprong(k: Keten | null, van: number, naar: number): Keten {
  return k ? { van: k.van, nu: naar, bezocht: [...k.bezocht, naar] } : { van, nu: naar, bezocht: [van, naar] };
}

/** Wat elk scherm zelf regelt. */
export type Scherm = {
  /** De spelregels van de stand nu, of null (dan kan de gekozen steen nergens heen). */
  regels(): Sprongregels | null;
  /** De stand zoals het Potje hem kent (zonder Sprongketen): per vak de Speler vanaf 0, of -1. */
  stand(): ArrayLike<number>;
  /** De Speler wiens stenen een tik kiest (de Dagelijkse puzzel en de Speluitleg: altijd 0). */
  eigen(): number;
  /** Mag een tik nu iets doen? Niet tijdens de beurt van een ander, na afloop of terwijl een Zet onderweg is. */
  mag(): boolean;
  /**
   * Voer de Zet van `van` naar `naar` uit. `alGetoond`: het einde van een Sprongketen die al Sprong voor Sprong
   * te zien was. `false` terug: de Zet mag niet, de steen rolt terug. Het scherm wist de keuze zelf (`wis`) als
   * de Zet klaar is; online pas als de server antwoordt.
   */
  zet(van: number, naar: number, alGetoond: boolean): Uitkomst;
  /** Er komt een Sprong van `van` naar `naar` (de keten staat nog zoals ervoor): voor de beweging op het bord. */
  sprong?(van: number, naar: number): void;
  /** Er wordt een steen gekozen. */
  kies?(): void;
};

export class TikNaarZet {
  /** De gekozen steen, op het vak waar de Zet begint. */
  gekozen = $state.raw<number | null>(null);
  /** Midden in een Sprongketen: de steen heeft al gesprongen, maar de Zet is nog niet gedaan. */
  keten = $state.raw<Keten | null>(null);

  /** Wat het scherm aan Bord3D geeft: een tik op een vak, en een tik ver weg. */
  readonly bord = {
    optik: (vak: number): Uitkomst => this.tik(vak),
    weg: (): void => {
      // Een tik ver weg laat de keuze los, maar midden in een keten doet hij niets.
      if (!this.keten) this.gekozen = null;
    },
  };

  constructor(private readonly scherm: Scherm) {}

  /** De steen die de Speler gekozen ziet: midden in een keten op zijn nieuwe vak. */
  get getoond(): number | null {
    return this.keten ? this.keten.nu : this.gekozen;
  }

  /** De stand zoals de Speler hem ziet: na een Sprong staat de steen al op zijn nieuwe vak. */
  toon(stand: number[]): number[] {
    const k = this.keten;
    if (!k) return stand;
    const s = [...stand];
    s[k.nu] = s[k.van];
    s[k.van] = -1;
    return s;
  }

  /** Geen gekozen steen en geen keten meer. */
  wis(): void {
    this.gekozen = null;
    this.keten = null;
  }

  /**
   * Een tik (of losgelaten steen) op vak `vak`: kiezen, loslaten, springen of een Zet proberen.
   * `false`: een Zet die niet mag; dan verandert er niets en rolt de steen terug.
   */
  tik(vak: number): Uitkomst {
    const s = this.scherm;
    if (!s.mag()) return;
    const regels = s.regels();
    const keten = this.keten;
    const gekozen = this.gekozen;
    if (keten) {
      // Midden in een keten: verder springen, of de steen nog eens aantikken om te stoppen.
      if (vak === keten.nu) return this.klaar();
      if (regels && vervolgSprongen(regels, keten).includes(vak)) return this.spring(regels, vak);
      return false;
    }
    if (gekozen !== null && regels && eersteBestemmingen(regels, gekozen).includes(vak)) {
      if (lijst(regels.stappen(gekozen)).includes(vak)) return s.zet(gekozen, vak, false);
      return this.spring(regels, vak);
    }
    if (s.stand()[vak] === s.eigen() && gekozen !== vak) {
      s.kies?.();
      this.gekozen = vak;
    } else if (gekozen === vak) {
      this.gekozen = null;
    } else if (gekozen !== null) {
      return false;
    }
  }

  /** Eindig de beurt met de steen waar hij nu staat (Done, of de steen nog eens aantikken). */
  klaar(): Uitkomst {
    const k = this.keten;
    if (k && this.scherm.mag()) return this.scherm.zet(k.van, k.nu, true);
  }

  /** Eén Sprong: de steen blijft gekozen op zijn nieuwe vak. Kan hij niet verder, dan eindigt de beurt. */
  private spring(regels: Sprongregels, vak: number): Uitkomst {
    const k = this.keten;
    const van = k ? k.nu : this.gekozen!;
    this.scherm.sprong?.(van, vak);
    meld({ soort: "sprong", nummer: k ? k.bezocht.length - 1 : 0 });
    const nieuw = naSprong(k, van, vak);
    this.keten = nieuw;
    if (vervolgSprongen(regels, nieuw).length === 0) return this.klaar();
  }
}
