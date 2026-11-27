<script lang="ts" module>
  import { zonderSchuif } from "./toetsenbord";
  import type { Vak } from "./voorwerpen";

  /** Een echte HTML-knop boven een voorwerp. Zie docs/bord3d.md, "Voorwerpen". */
  export type TafelKnop = {
    /** Het voorwerp (`Voorwerp.id`) waar deze knop op ligt. */
    id: string;
    /** Bij de lade: de helft met Sound (0) of Vibration (1). */
    deel?: 0 | 1;
    /** De tekst op het voorwerp; ook de tekst van de HTML-knop (schermlezer, toetsenbord, tests). */
    tekst: string;
    /** Een langere naam voor de schermlezer, als die anders is dan de tekst. */
    label?: string;
    /** Een schakelaar (Sound, Vibration): aan of uit. Bij de lade schuift de kraal mee. */
    aan?: boolean;
    /** Een keuze uit een rij (taak 188: bord, aantal, niveau): `role="radio"`, gekozen of niet. Staat in `nav` naast de andere knoppen. */
    keuze?: boolean;
    /** De knop doet nu niets (Resign na afloop van het Potje): de HTML-knop is `disabled`. */
    uit?: boolean;
    /** De knop wacht op de server (Continue bij de Spelersnaam): het voorwerp blijft ingedrukt tot het antwoord er is. */
    bezig?: boolean;
    doe: () => void;
    /** Een vinger komt op het voorwerp, of het toetsenbord komt erop: laat zien wat de knop zou kiezen (Bord kiezen toont dat bord). */
    wijs?: () => void;
  };

  /** Waar elk voorwerp op het scherm ligt, op id (CSS-pixels). */
  export type Vakken = Record<string, Vak>;
</script>

<script lang="ts">
  // De voorwerpen van een scherm op de 3D-tafel (taak 178): Bevy tekent het bord en de voorwerpen, deze component legt op elk
  // voorwerp een onzichtbare, echte HTML-knop. Een vinger op het voorwerp drukt dus die knop in: het voorwerp zakt een stukje
  // (`druk_voorwerp`) en de knop doet zijn werk. Toetsenbord en schermlezer gebruiken dezelfde knoppen.
  import { onDestroy, onMount, untrack } from "svelte";
  import { bordWarm, houdLaag, laadBord3d, markeerMislukt, type Bord3d } from "./bord3d";
  import { opZijde } from "./lak";
  import { SPELER_KLEUREN } from "./spelers";
  import { huidigeTaal } from "./taal.svelte";
  import { TALEN } from "./talen/register";
  import { helft, knopPlek, metUit, vakVan, voorwerpLijst, type Voorwerp } from "./voorwerpen";
  import { bovenop as isBovenop, laatLaag, neemLaag } from "./tafellagen.svelte";

  let {
    voorwerpen,
    knoppen,
    stand,
    vierkant = false,
    naam,
    klaar,
    vakken = $bindable({}),
    bord: extern = undefined,
    plekken = {},
    laag = 0,
  }: {
    voorwerpen: readonly Voorwerp[];
    knoppen: readonly TafelKnop[];
    /** De Stenen op het bord van dit scherm (per vak de Speler, of -1). */
    stand: readonly number[];
    vierkant?: boolean;
    /** De naam van de knoppen samen (aria-label van de nav). */
    naam: string;
    /** De tafel staat helemaal in beeld, met de plaatjes. */
    klaar?: () => void;
    vakken?: Vakken;
    /**
     * Taak 179: een 3D-bord dat de eigenaar al geladen heeft (het Potje). Dan laadt, bouwt en meet deze component niets: hij legt
     * alleen voorwerpen, plaatjes en knoppen op de tafel van dat bord. `null`: het bord is nog niet geladen.
     */
    bord?: Bord3d | null;
    /** Voorwerpen die op een andere plek liggen dan in de lijst, op id (x, z, voor een taal van links naar rechts): de jade aanwijzer. */
    plekken?: Record<string, { x: number; z: number }>;
    /** Taak 284: 1 voor een scherm dat over een ander scherm met voorwerpen ligt (het winstscherm over het Potje). Zie `tafellagen.svelte.ts`. */
    laag?: number;
  } = $props();

  // Taak 284: alleen het bovenste scherm stuurt naar Bevy (het winstscherm boven het Potje, zie `tafellagen.svelte.ts`).
  const ik = neemLaag(untrack(() => laag));
  const bovenop = () => isBovenop(ik);

  /** Bevy is gestart maar tekent na zo lang nog niets: dan werkt het hier niet. */
  const GEDULD_MS = 12000;

  let bord = $state.raw<Bord3d | null>(null);
  const ingebed = untrack(() => extern !== undefined);
  $effect(() => {
    if (ingebed) bord = extern ?? null;
  });
  let zichtbaar = $state(false);
  /** Een nieuwe lijst is onderweg naar Bevy: de knoppen liggen nog op de oude plekken en vangen geen vingers. */
  let wisselt = $state(false);
  let ruwe = $state.raw<ArrayLike<number>>([]);
  /** Bevy meldt waar de voorwerpen liggen: de knoppen gaan erheen. */
  const meldVakken = (b: Bord3d) => {
    ruwe = Array.from(b.voorwerp_vakken());
    if (!lijstOnderweg) wisselt = false;
  };
  let vlakEl = $state<HTMLDivElement>();
  const rtl = $derived(TALEN[huidigeTaal()]?.rtl === true);

  /** Roep het 3D-bord aan; gaat dat mis (Bevy is gestopt), dan het foutscherm (`Fout3D.svelte`). */
  function stuur(f: (b: Bord3d) => void) {
    const b = bord;
    if (!b) return;
    try {
      f(b);
    } catch {
      mislukt();
    }
  }

  let gefaald = false;
  function mislukt() {
    if (gefaald) return;
    gefaald = true;
    markeerMislukt();
  }

  // Ingezoomd (taak 235) zakken de naamplaten, de kom en het zegel weg, zodat ze niet over het bord liggen. Hun knoppen gaan mee: een
  // knop zonder voorwerp zou onzichtbaar over het bord liggen en tikken opvangen. Het blad met zijn knoppen blijft liggen en tikbaar
  // (ook voor Done in een reeks Sprongen), en de jade aanwijzer schuift onder het blad. Uitzoomen brengt alles terug. Bevy meldt
  // `overzicht`; `zakt_weg` in `overgang.rs` kiest dezelfde soorten.
  const ZAKT_WEG = ["naamplaat", "kom", "zegel"];
  const zaktWeg = (id: string) => ZAKT_WEG.includes(voorwerpen.find((v) => v.id === id)?.soort ?? "");
  let ingezoomd = $state(false);
  const meldCamera = (overzicht: boolean) => (ingezoomd = !overzicht);

  const nummer = (id: string) => voorwerpen.findIndex((v) => v.id === id);

  onMount(() => {
    let weg = false;
    let wachten = 0;
    let vanZijde: (() => void) | null = null;
    let laatLos: (() => void) | null = null;
    // Een schermwissel tussen twee tafels op hetzelfde bord (UI-overgangen): de tafel blijft in beeld en zijn voorwerpen wisselen,
    // in plaats van eerst te vervagen en dan opnieuw te verschijnen.
    if (!ingebed && untrack(() => bordWarm(vierkant))) {
      vanZijde = opZijde();
      laatLos = houdLaag();
    }
    if (!ingebed) {
      laadBord3d(SPELER_KLEUREN.map((k) => k.kleur))
        .then((b) => {
          if (weg) return;
          bord = b;
        })
        .catch(() => !weg && mislukt());
    }

    // Wacht tot de plaatjes gestuurd zijn en Bevy alles getekend heeft; dan pas de tafel tonen. Het geduld loopt pas als Bevy er
    // is: het ophalen zelf duurt op een trage verbinding langer dan `GEDULD_MS` en is geen fout (mislukt het, dan meldt `laadBord3d` dat).
    let begin: number | null = null;
    const kijk = () => {
      if (weg) return;
      // Taak 284: een scherm onder een ander (het Potje onder het winstscherm) stuurt niets en wacht dus niet op zijn tafel: geen
      // geduld, anders gaf het na `GEDULD_MS` het foutscherm. Komt het weer bovenop, dan begint het wachten opnieuw.
      if (!bovenop()) {
        begin = null;
        wachten = requestAnimationFrame(kijk);
        return;
      }
      if (bord) begin ??= performance.now();
      let k = false;
      try {
        k = !!bord && platenKlaar && bord.klaar() && bord.beelden() > beeldenNaPlaten;
      } catch {
        return mislukt();
      }
      if (k) {
        zichtbaar = true;
        performance.mark?.("tafel");
        if (!ingebed) {
          vanZijde ??= opZijde();
          laatLos ??= houdLaag();
        }
        stuur(meldVakken);
        klaar?.();
      } else if (begin !== null && performance.now() - begin > GEDULD_MS) {
        mislukt();
      } else {
        wachten = requestAnimationFrame(kijk);
      }
    };
    wachten = requestAnimationFrame(kijk);

    return () => {
      weg = true;
      cancelAnimationFrame(wachten);
      vanZijde?.();
      laatLos?.();
      // Ligt er een ander scherm bovenop, dan zijn de voorwerpen en de meldingen van Bevy van dat scherm: niets weghalen.
      if (bovenop()) {
        try {
          bord?.bij_voorwerpen(() => {});
          bord?.bij_camera(() => {});
          bord?.zet_voorwerpen(new Float32Array());
        } catch {
          // Het 3D-bord is al kapot: niets meer te doen.
        }
      }
      laatLaag(ik);
    };
  });

  // Bevy meldt waar de voorwerpen liggen en wat de camera doet aan het bovenste scherm (opnieuw als dit scherm weer bovenop komt).
  $effect(() => {
    const b = bord;
    if (!b || !bovenop()) return;
    b.bij_voorwerpen(() => meldVakken(b));
    b.bij_camera(meldCamera);
    if (ingebed) meldVakken(b);
  });

  // Het bord van dit scherm, vanaf de kant van Speler 1.
  $effect(() => {
    if (ingebed || !bord) return;
    const s = Int32Array.from(stand);
    untrack(() =>
      stuur((b) => {
        b.zet_bord(vierkant, NaN, NaN, false);
        b.zet_stand(s);
        b.zet_gekozen(-1);
      }),
    );
  });

  // De voorwerpen, opnieuw bij een andere taal (van rechts naar links spiegelt de tafel), met hun plaatjes in die taal.
  // Verandert alleen een plaatje (de naam van een Speler, de jade aanwijzer), dan gaat alleen dat plaatje opnieuw: de lijst en de
  // andere plaatjes blijven staan en Bevy tekent maar één textuur opnieuw.
  // Een nieuwe lijst gaat pas naar Bevy als zijn plaatjes gebakken zijn, samen met de plaatjes (UI-overgangen): zo komen de nieuwe
  // voorwerpen meteen met hun plaatje omhoog. Tot dan vangen de knoppen geen vingers (`wisselt`).
  let platenKlaar = false;
  let beeldenNaPlaten = Infinity;
  let lijstVersie = $state(0);
  let vorigeLijst = "";
  let vorigePlaten: string[] = [];
  /** De nieuwste lijst die nog niet naar Bevy ging (een nummer), of 0. */
  let lijstOnderweg = 0;
  let lijstNummer = 0;
  $effect(() => {
    if (!bord) return;
    const taal = huidigeTaal();
    const lijst = voorwerpLijst(voorwerpen, rtl);
    const platen = metUit(voorwerpen, knoppen).map((v) => v.plaat);
    const sleutels = platen.map((p) => JSON.stringify(p ?? null));
    const b = bord;
    // Niet bovenop: niets sturen, en alles opnieuw sturen zodra dit scherm weer bovenop ligt.
    if (!bovenop()) {
      vorigeLijst = "";
      return;
    }
    untrack(() => {
      const lijstSleutel = `${taal} ${lijst.join(",")}`;
      // Komt er een plaatje bij terwijl een lijst nog onderweg is, dan gaat alles opnieuw met die lijst mee.
      const alles = lijstSleutel !== vorigeLijst || lijstOnderweg !== 0;
      const nummers = alles ? undefined : sleutels.flatMap((s, i) => (s !== vorigePlaten[i] ? [i] : []));
      vorigePlaten = sleutels;
      if (nummers && nummers.length === 0) return;
      let zetLijst = () => bovenop();
      if (alles) {
        vorigeLijst = lijstSleutel;
        const mijn = (lijstOnderweg = ++lijstNummer);
        wisselt = true;
        zetLijst = () => {
          if (lijstOnderweg !== mijn || bord !== b || !bovenop()) return false;
          lijstOnderweg = 0;
          stuur((b) => b.zet_voorwerpen(lijst));
          lijstVersie++;
          return true;
        };
      }
      b.stuurPlaten(taal, platen, nummers, zetLijst)
        .catch(() => {
          // Geen Canvas 2D of lettertype: de voorwerpen blijven effen. De HTML-knoppen werken gewoon.
          zetLijst();
        })
        .finally(() => {
          if (bord !== b) return;
          try {
            beeldenNaPlaten = b.beelden();
          } catch {
            beeldenNaPlaten = 0;
          }
          platenKlaar = true;
        });
    });
  });

  // Voorwerpen die op een andere plek liggen dan in de lijst (de jade aanwijzer). Na een nieuwe lijst opnieuw.
  $effect(() => {
    void lijstVersie;
    const p = plekken;
    if (!bovenop()) return;
    for (const [id, plek] of Object.entries(p)) {
      const i = nummer(id);
      if (i >= 0) stuur((b) => b.zet_voorwerp_plek(i, rtl ? -plek.x : plek.x, plek.z));
    }
  });

  // De kralen van de lade volgen Sound en Vibration.
  $effect(() => {
    void lijstVersie;
    if (!bovenop()) return;
    for (const k of knoppen) {
      if (k.aan === undefined || k.deel === undefined) continue;
      const i = nummer(k.id);
      const aan = k.aan;
      if (i >= 0) stuur((b) => b.zet_schakelaar(i, k.deel!, aan));
    }
  });

  // Een knop die op de server wacht, blijft ingedrukt; de plaat wordt niet dof (dat kost een nieuw plaatje en voelt als haperen).
  // Een nieuwe lijst (een andere taal, een tablet die draait) legt verse voorwerpen neer die omhoog staan: druk dan alles opnieuw in.
  // Een plaat die in de nieuwe lijst op dezelfde plek blijft, houdt in Bevy zijn drukstand: ook van een vorig scherm, of met een
  // loslaten dat de lijst wiste voordat Bevy het zag. Stuur daarom bij elke nieuwe lijst de stand van elke knop: omlaag als hij
  // wacht, anders omhoog.
  let vastIn = new Set<string>();
  let vastVersie = -1;
  $effect(() => {
    const versie = lijstVersie;
    if (!bovenop()) return;
    const nu = new Set(knoppen.filter((k) => k.bezig).map((k) => k.id));
    const vers = versie !== vastVersie;
    untrack(() => {
      if (vers) for (const id of new Set(knoppen.map((k) => k.id))) if (!nu.has(id)) drukId(id, false);
      for (const id of nu) if (vers || !vastIn.has(id)) drukId(id, true);
      for (const id of vastIn) if (!nu.has(id)) drukId(id, false);
    });
    vastIn = nu;
    vastVersie = versie;
  });

  // Het hele scherm, zonder de randen van de telefoon (notch, thuisbalk): daar moet de tafel in passen.
  $effect(() => {
    const el = vlakEl;
    if (ingebed || !el || !bord) return;
    const meet = () => {
      const r = el.getBoundingClientRect();
      // Boven het toetsenbord geschoven (iOS): het bord schuift zelf mee, dus meet zonder die schuif (ook midden in de overgang).
      stuur((b) => b.zet_vlak(r.left, zonderSchuif(r.top), r.width, r.height));
    };
    meet();
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(meet);
    ro?.observe(el);
    window.addEventListener("resize", meet);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", meet);
    };
  });

  // Waar elk voorwerp op het scherm ligt.
  $effect(() => {
    const uit: Vakken = {};
    voorwerpen.forEach((v, i) => {
      const vak = vakVan(ruwe, i);
      if (vak) uit[v.id] = vak;
    });
    vakken = uit;
  });

  function plek(k: TafelKnop): string {
    let vak = vakken[k.id];
    if (ingezoomd && zaktWeg(k.id)) return "display:none";
    if (!vak) return "";
    // Ingezoomd (taak 186) kan een voorwerp buiten beeld liggen: dan is er niets om te raken, dus ook geen knop. Uitzoomen
    // brengt het voorwerp en zijn knop terug (Bevy meldt dan nieuwe vakken).
    if (vak.rechts <= 0 || vak.links >= window.innerWidth || vak.onder <= 0 || vak.boven >= window.innerHeight) return "display:none";
    if (k.deel !== undefined) vak = helft(vak, k.deel, rtl);
    const p = knopPlek(vak);
    return `left:${p.left}px;top:${p.top}px;width:${p.width}px;height:${p.height}px`;
  }

  // Indrukken: het voorwerp zakt zolang de vinger erop staat. Met het toetsenbord (geen vinger) kort.
  function drukId(id: string, aan: boolean) {
    const i = nummer(id);
    if (i >= 0 && bovenop()) stuur((b) => b.druk_voorwerp(i, aan));
  }
  // Een vinger die loslaat, laat een wachtende knop niet omhoog komen.
  const druk = (k: TafelKnop, aan: boolean) => {
    if (aan || !vastIn.has(k.id)) drukId(k.id, aan);
  };
  // Na een tik kan het scherm al weg zijn als de knop weer omhoog moet: dan zijn de voorwerpen er niet meer.
  let opgeruimd = false;
  onDestroy(() => (opgeruimd = true));
  function klik(k: TafelKnop, e: MouseEvent) {
    if (e.detail === 0) {
      druk(k, true);
      setTimeout(() => {
        if (!opgeruimd) druk(k, false);
      }, 140);
    }
    k.doe();
  }
</script>

{#if !ingebed}<div class="vlak" bind:this={vlakEl} aria-hidden="true"></div>{/if}
{#if zichtbaar || ingebed}
  <nav class="tafel-knoppen" class:wacht={(!zichtbaar || wisselt) && bovenop()} aria-label={naam}>
    {#each knoppen as k (k.id + (k.deel ?? ""))}
      <button
        class="tafel-knop"
        style={plek(k)}
        aria-label={k.label}
        role={k.keuze !== undefined ? "radio" : k.aan === undefined ? undefined : "switch"}
        aria-checked={k.keuze ?? k.aan}
        disabled={k.uit}
        data-voorwerp={k.id}
        onpointerdown={() => {
          druk(k, true);
          k.wijs?.();
        }}
        onfocus={() => k.wijs?.()}
        onpointerup={() => druk(k, false)}
        onpointercancel={() => druk(k, false)}
        onpointerleave={() => druk(k, false)}
        onclick={(e) => klik(k, e)}>{k.tekst}</button
      >
    {/each}
  </nav>
{/if}

<style>
  /* Het vlak waar de tafel in moet passen: het hele scherm, zonder notch en thuisbalk. */
  .vlak {
    position: fixed;
    inset: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
    pointer-events: none;
  }
  .tafel-knoppen {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }
  /* Ingebed staan de knoppen er al voor de tafel in beeld is (schermlezer, tests), maar ze vangen nog geen vingers. */
  .tafel-knoppen.wacht :global(.tafel-knop) {
    pointer-events: none;
  }
  /* Onzichtbaar: het voorwerp eronder is de knop. De tekst staat er wel, voor schermlezer en toetsenbord. */
  .tafel-knop {
    position: fixed;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 10px;
    background: none;
    color: transparent;
    font-size: 1px;
    overflow: hidden;
    pointer-events: auto;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
  .tafel-knop:focus-visible {
    outline: 3px solid #f2c466;
    outline-offset: 3px;
  }
</style>
