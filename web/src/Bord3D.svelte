<script lang="ts">
  // Het 3D-bord (Bevy). Tekent de stand en meldt tikken; het beslist niets en licht nooit een vak op.
  // Welke steen onder een vinger staat, ziet het 3D-bord (`wijs`); wat de tik dan betekent, kiest
  // tikken.ts; of een Zet mag, bepalen de spelregels via `optik`. Mag hij niet, dan rolt de steen terug. Het canvas is één laag
  // over het hele scherm (bord3d.ts); dit vlak vangt de vingers en zegt waar het bord moet staan.
  import { houdTafelStil, zonderSchuif } from "./toetsenbord";
  import { onDestroy, onMount, untrack } from "svelte";
  import { bordWarm, houdLaag, laadBord3d, markeerMislukt, type Bord3d } from "./bord3d";
  import Laadtafel from "./Laadtafel.svelte";
  import Voorwerpen, { type TafelKnop, type Vakken } from "./Voorwerpen.svelte";
  import type { Voorwerp } from "./voorwerpen";
  import { HUP_MS, SPELER_KLEUREN, STAP_MS, schermPunt, type Beweging, type Vorm } from "./spelers";
  import { t, type Sleutel } from "./taal.svelte";
  import {
    GREEP_PX,
    TIK_PX,
    kiesGewezen,
    landing,
    nogEenTik,
    voerUit,
    type Gewezen,
    type Keuze,
    type Punt,
    type Uitkomst,
  } from "./tikken";

  let {
    vorm = "ster",
    plekken,
    stand,
    aanDeBeurt,
    gekozen,
    doelvakken,
    kijkDoel = [],
    beweging,
    optik,
    weg,
    speelbaar = true,
    kleuren,
    tafel = null,
  }: {
    vorm?: Vorm;
    plekken: number[];
    stand: number[];
    aanDeBeurt: number;
    gekozen: number | null;
    doelvakken: number[];
    /** De doelvakken van de Speler die op dit toestel kijkt: de camera kijkt ernaartoe. */
    kijkDoel?: number[];
    beweging: Beweging | null;
    /** Kies, laat los of probeer een Zet. `false`: een Zet die niet mag. */
    optik: (vak: number) => Uitkomst;
    weg?: () => void;
    speelbaar?: boolean;
    /** Een eigen kleur per Speler (de grijze Stenen van de Speluitleg, taak 184); leeg op een plek: de kleur uit `SPELER_KLEUREN`. */
    kleuren?: readonly (string | undefined)[];
    /**
     * Voorwerpen rond het bord (taak 179, het Potje in uiterlijk 1b): naamplaten, de jade aanwijzer en een blad met knoppen, met
     * een onzichtbare HTML-knop op elk voorwerp. Dan past de camera het bord en de voorwerpen samen in het hele scherm, en vangt het
     * vlak van het bord het hele scherm. Zie docs/bord3d.md, "Het Potje".
     */
    tafel?: {
      voorwerpen: readonly Voorwerp[];
      knoppen: readonly TafelKnop[];
      naam: string;
      plekken?: Record<string, { x: number; z: number }>;
      /** Waar elk voorwerp op het scherm ligt (om er HTML op te leggen, zoals de uitleg op de plaat van de Speluitleg). */
      vakken?: (vakken: Vakken) => void;
      /** Het bord en de voorwerpen staan in beeld, met hun plaatjes. */
      klaar?: () => void;
    } | null;
  } = $props();

  const punten = $derived.by(() => {
    const lijst: Punt[] = [];
    for (let i = 0; i < plekken.length / 2; i++) lijst.push(schermPunt(vorm, plekken[2 * i], plekken[2 * i + 1]));
    return lijst;
  });

  let bord = $state.raw<Bord3d | null>(null);
  let klaar = $state(false);
  /** De voorwerpen rond het bord staan getekend met hun plaatjes (alleen met `tafel`). */
  let tafelKlaar = $state(false);
  const alles = $derived(klaar && (!tafel || tafelKlaar));
  /** Stond hetzelfde bord al in beeld toen dit scherm opende? Dan geen laadtafel (zie `bordWarm`). */
  const warmBegin = untrack(() => bordWarm(vorm === "vierkant"));
  /** Laat de laag met het 3D-bord los (zie `houdLaag`); null zolang dit scherm hem niet toont. */
  let laagLos: (() => void) | null = null;
  $effect(() => {
    if (!alles) return;
    laagLos ??= houdLaag();
    untrack(() => tafel?.klaar?.());
  });
  let tafelVakken = $state<Vakken>({});
  $effect(() => {
    const v = tafelVakken;
    untrack(() => tafel?.vakken?.(v));
  });
  let vlakEl = $state<HTMLDivElement>();
  const minderBeweging = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const tikStand = () => ({ punten, stand, aanDeBeurt, speelbaar, gekozen });

  /** Voer een keuze uit; een Zet die niet mag, rolt terug op het bord. */
  function doe(keuze: Keuze) {
    voerUit(keuze, { optik, weg, gekozen, mis: (van, naar) => stuur((b) => b.mis(van, naar)) });
  }

  /** Wat het 3D-bord onder een punt op het scherm ziet. `ruimte`: hoe ver (px) naast een eigen steen hij nog telt. */
  function wijs(x: number, y: number, ruimte: number): Gewezen {
    let w: ArrayLike<number> = [NaN, NaN, -1, -1];
    stuur((b) => (w = b.wijs(x, y, aanDeBeurt, ruimte)));
    const vak = (v: number) => (v >= 0 ? v : null);
    const plek = Number.isFinite(w[0]) && Number.isFinite(w[1]) ? { x: w[0], y: w[1] } : null;
    return { plek, eigen: vak(w[2]), geraakt: vak(w[3]) };
  }

  /** Een tik op het scherm (px; NaN: naast het bord). */
  function tik(x: number, y: number) {
    doe(kiesGewezen(wijs(x, y, TIK_PX), tikStand()));
  }

  /** Bevy is gestart maar tekent na zo lang nog niets: dan werkt het hier niet. */
  const GEDULD_MS = 12000;

  onMount(() => {
    let weg = false;
    let wachten = 0;
    // Hetzelfde bord stond al in beeld (een schermwissel tussen twee tafels, UI-overgangen): het blijft staan terwijl de Stenen en
    // de voorwerpen wisselen.
    if (untrack(() => bordWarm(vorm === "vierkant"))) laagLos = houdLaag();
    laadBord3d(SPELER_KLEUREN.map((k) => k.kleur))
      .then((b) => {
        if (weg) return;
        b.bij_tik((x, y) => tik(x, y));
        bord = b;
        const begin = performance.now();
        const kijk = () => {
          if (weg) return;
          let k = false;
          try {
            k = b.klaar();
          } catch {
            return mislukt();
          }
          if (k) {
            klaar = true;
          } else if (performance.now() - begin > GEDULD_MS) {
            mislukt();
          } else {
            wachten = requestAnimationFrame(kijk);
          }
        };
        wachten = requestAnimationFrame(kijk);
      })
      .catch(() => !weg && mislukt());
    return () => {
      weg = true;
      cancelAnimationFrame(wachten);
      laagLos?.();
      try {
        bord?.bij_tik(() => {});
        if (greep?.sleept) bord?.loslaten(-1);
        bord?.zet_gekozen(-1);
        // Eigen kleuren gelden alleen voor dit scherm.
        if (eigenKleuren) bord?.zet_kleuren(kleurLijst(SPELER_KLEUREN.map((k) => k.kleur)));
      } catch {
        // Het 3D-bord is al kapot: niets meer te doen.
      }
    };
  });

  /** Het 3D-bord werkt hier niet: de app toont het foutscherm (`Fout3D.svelte`). */
  function mislukt() {
    markeerMislukt();
  }

  /** Roep het 3D-bord aan; gaat dat mis (Bevy is gestopt), dan het foutscherm. */
  function stuur(f: (b: Bord3d) => void) {
    const b = bord;
    if (!b) return;
    try {
      f(b);
    } catch {
      mislukt();
    }
  }

  // Een ander bord (of een nieuw Potje): bouwen, de camera naar het eigen doel en een rustige beweging.
  // Alleen als het bord of het doel echt anders is; online komt bij elke stand een nieuwe lijst.
  let gebouwd = "";
  $effect(() => {
    const vierkant = vorm === "vierkant";
    const doel = kijkDoel.map((v) => punten[v]).filter(Boolean);
    const midden = doel.length
      ? { x: doel.reduce((s, p) => s + p.x, 0) / doel.length, y: doel.reduce((s, p) => s + p.y, 0) / doel.length }
      : { x: NaN, y: NaN };
    const sleutel = `${vorm} ${midden.x.toFixed(2)} ${midden.y.toFixed(2)}`;
    if (!bord || sleutel === gebouwd) return;
    gebouwd = sleutel;
    stuur((b) => {
      b.zet_bord(vierkant, midden.x, midden.y, !minderBeweging());
      // Een nieuw bord begint leeg: stuur alles opnieuw.
      untrack(() => {
        b.zet_stand(Int32Array.from(stand));
        b.zet_doel(aanDeBeurt, Uint32Array.from(doelvakken));
        b.zet_gekozen(gekozen ?? -1);
      });
    });
  });
  $effect(() => {
    const s = Int32Array.from(stand);
    stuur((b) => b.zet_stand(s));
  });
  // Eigen kleuren (Speluitleg): alleen sturen als ze anders zijn dan wat het bord al heeft. Zonder eigen kleuren heeft het bord
  // al `SPELER_KLEUREN` (laadBord3d), dus dan gaat er niets.
  const kleurLijst = (k: readonly string[]) => Uint32Array.from(k, (c) => parseInt(c.slice(1), 16));
  let eigenKleuren = false;
  let vorigeKleuren = "";
  $effect(() => {
    const k = SPELER_KLEUREN.map((s, i) => kleuren?.[i] ?? s.kleur);
    const sleutel = k.join(",");
    if (!bord || (kleuren === undefined && !eigenKleuren) || sleutel === vorigeKleuren) return;
    vorigeKleuren = sleutel;
    eigenKleuren ||= kleuren !== undefined;
    stuur((b) => b.zet_kleuren(kleurLijst(k)));
  });
  $effect(() => {
    const g = gekozen ?? -1;
    stuur((b) => b.zet_gekozen(g));
  });
  $effect(() => {
    const d = Uint32Array.from(doelvakken);
    const s = aanDeBeurt;
    stuur((b) => b.zet_doel(s, d));
  });

  // De Zet die net gedaan is: de steen hupt langs zijn pad. Elke Beweging één keer.
  let getoond: Beweging | null = null;
  $effect(() => {
    const b = beweging;
    if (!bord || !b || b === getoond || b.vakken.length < 2) return;
    getoond = b;
    stuur((bord) => bord.beweeg(Uint32Array.from(b.vakken), b.sprong ? HUP_MS : STAP_MS, minderBeweging()));
  });

  // Waar het bord moet staan: dit vlak, tussen de knoppen.
  $effect(() => {
    const el = vlakEl;
    if (!el || !bord) return;
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

  // ---- Vingers en muis. Een vinger op een eigen steen pakt hem vast: tikken of slepen regelt deze
  // component. Alle andere vingers gaan naar Bevy, voor een tik. Het bord staat stil (ontwerp 1b):
  // schuiven, knijpen, draaien en het muiswiel bewegen niets.
  const FASE = { neer: 0, beweeg: 1, los: 2, weg: 3 } as const;
  /**
   * Een vinger die een steen vasthoudt. `sinds`: wanneer hij neerkwam (`timeStamp` van de vinger).
   * `verst`: hoe ver (px) hij hoogstens van zijn begin was. `wasGekozen`: de steen was al gekozen.
   * `onder`: de plek op het bord recht onder de gesleepte steen.
   */
  let greep: {
    id: number;
    vak: number;
    start: Punt;
    sinds: number;
    laatst: Punt;
    verst: number;
    wasGekozen: boolean;
    sleept: boolean;
    onder: Punt | null;
  } | null = null;
  /** De vingers die Bevy kent. */
  const camVingers = new Set<number>();

  // Op het scherm staat het bord soms boven het toetsenbord geschoven (iOS, toetsenbord.ts). Bevy en de plekken hieronder rekenen
  // zonder die schuif, net als het vlak. Zolang een vinger op het bord staat, staat de tafel stil (`houdTafelStil`), dus de schuif
  // verandert niet onder een tik of een gesleepte Steen.
  const vingerY = (e: PointerEvent) => zonderSchuif(e.clientY);
  const stilVoor = new Map<number, { los: () => void; soort: string }>();
  function laatTafelGaan(id: number) {
    stilVoor.get(id)?.los();
    stilVoor.delete(id);
  }
  // Waar een vinger ook loslaat (ook naast het bord, of als het bord zijn loslaten mist): de tafel is vrij voor die vinger. En een
  // nieuwe eerste aanraking ergens op de pagina (bijvoorbeeld in de Chat) betekent dat oudere van die soort al weg zijn. Op het
  // venster na de rest (niet in de vangfase): op het bord heeft `omlaag` of `omhoog` dan al gerekend met de tafel nog stil.
  function overalLos(e: PointerEvent) {
    laatTafelGaan(e.pointerId);
  }
  function overalNeer(e: PointerEvent) {
    if (!e.isPrimary) return;
    for (const [id, { soort }] of [...stilVoor]) if (id !== e.pointerId && soort === e.pointerType) laatTafelGaan(id);
  }
  window.addEventListener("pointerup", overalLos);
  window.addEventListener("pointercancel", overalLos);
  window.addEventListener("pointerdown", overalNeer);
  onDestroy(() => {
    window.removeEventListener("pointerup", overalLos);
    window.removeEventListener("pointercancel", overalLos);
    window.removeEventListener("pointerdown", overalNeer);
    for (const { los } of stilVoor.values()) los();
    stilVoor.clear();
  });

  function vinger(e: PointerEvent, fase: number) {
    stuur((b) => b.vinger(e.pointerId, fase, e.clientX, vingerY(e), e.timeStamp));
  }

  /**
   * De vinger houdt geen steen meer vast maar beweegt de camera (een tweede vinger, of de steen mag
   * niet). `nu`: de `timeStamp` van de vinger die dit veroorzaakt; dezelfde klok als bij Bevy.
   */
  function naarCamera(nu: number) {
    const g = greep;
    if (!g) return;
    greep = null;
    if (g.sleept) stuur((b) => b.loslaten(-1));
    camVingers.add(g.id);
    stuur((b) => {
      b.vinger(g.id, FASE.neer, g.start.x, g.start.y, g.sinds);
      if (g.laatst.x !== g.start.x || g.laatst.y !== g.start.y) b.vinger(g.id, FASE.beweeg, g.laatst.x, g.laatst.y, nu);
    });
  }

  function omlaag(e: PointerEvent) {
    e.preventDefault();
    // Een nieuwe eerste aanraking van dezelfde soort (vinger, pen, muis): oudere van die soort die de tafel nog stilhouden, zijn al
    // weg (een gemist loslaten). Een trackpadklik laat een vinger die sleept dus niet los.
    // Eerst de nieuwe vinger, dan de oude los: zo is de tafel er geen moment vrij en verspringt hij niet onder deze tik.
    const los = houdTafelStil();
    for (const [id, { soort }] of [...stilVoor]) if (id === e.pointerId || (e.isPrimary && soort === e.pointerType)) laatTafelGaan(id);
    stilVoor.set(e.pointerId, { los, soort: e.pointerType });
    try {
      vlakEl?.setPointerCapture(e.pointerId);
    } catch {
      // Geen capture (bijvoorbeeld in tests): dan zonder.
    }
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Een nieuwe eerste vinger: vingers die nog openstaan (een gemist loslaten) tellen niet meer.
    if (e.isPrimary && !greep && camVingers.size > 0) {
      for (const id of camVingers) stuur((b) => b.vinger(id, FASE.weg, e.clientX, vingerY(e), e.timeStamp));
      camVingers.clear();
    }
    // Een tweede vinger: knijpen of draaien, dus de steen gaat terug.
    if (greep) naarCamera(e.timeStamp);
    if (camVingers.size === 0 && speelbaar) {
      // Vlak bij een eigen steen: tikken of slepen regelt deze component. Verder weg (ook een tik
      // een paar millimeter naast een steen) gaat de vinger naar Bevy; een tik komt terug via `bij_tik`.
      const vak = wijs(e.clientX, vingerY(e), GREEP_PX).eigen;
      if (vak !== null) {
        const punt = { x: e.clientX, y: vingerY(e) };
        greep = { id: e.pointerId, vak, start: punt, sinds: e.timeStamp, laatst: punt, verst: 0, wasGekozen: gekozen === vak, sleept: false, onder: null };
        return;
      }
    }
    camVingers.add(e.pointerId);
    vinger(e, FASE.neer);
  }

  function beweeg(e: PointerEvent) {
    const g = greep;
    if (g?.id === e.pointerId) {
      g.laatst = { x: e.clientX, y: vingerY(e) };
      const afstand = Math.hypot(g.laatst.x - g.start.x, g.laatst.y - g.start.y);
      g.verst = Math.max(g.verst, afstand);
      if (!g.sleept) {
        // Een tik sleept nooit: pas als de vinger duidelijk schuift (zie `nogEenTik`).
        if (nogEenTik(afstand, e.timeStamp - g.sinds)) return;
        // Pak de steen: eerst kiezen. Kan dat niet (midden in een Sprongketen een andere steen), dan schuift de vinger het bord.
        if (gekozen !== g.vak && optik(g.vak) === false) return naarCamera(e.timeStamp);
        g.sleept = true;
      }
      stuur((b) => {
        const q = b.sleep(g.vak, e.clientX, vingerY(e));
        g.onder = Number.isFinite(q[0]) && Number.isFinite(q[1]) ? { x: q[0], y: q[1] } : null;
      });
      return;
    }
    if (camVingers.has(e.pointerId)) vinger(e, FASE.beweeg);
  }

  function omhoog(e: PointerEvent) {
    const g = greep;
    if (g?.id === e.pointerId) {
      greep = null;
      if (g.sleept) g.verst = Math.max(g.verst, Math.hypot(e.clientX - g.start.x, vingerY(e) - g.start.y));
      if (!g.sleept) {
        // Niet gesleept: een gewone tik, meteen, waar de vinger neerkwam (bij loslaten rolt hij wat).
        tik(g.start.x, g.start.y);
      } else if (nogEenTik(g.verst, 0)) {
        // Langzaam een klein stukje gesleept (minder dan een tik mag rollen): nooit een Zet. De steen
        // valt terug in zijn gaatje, en het telt als een tik. Slepen koos hem al; was hij al gekozen,
        // dan laat de tik hem los (of eindigt de Sprongketen).
        stuur((b) => b.loslaten(g.vak));
        if (g.wasGekozen) doe({ soort: "los", vak: g.vak });
      } else {
        // Het vak onder de vinger bij het loslaten, niet onder de laatste beweging: bij een snelle
        // sleep komt de laatste beweging soms ver voor de plek waar de vinger loslaat.
        stuur((b) => {
          const q = b.sleep(g.vak, e.clientX, vingerY(e));
          g.onder = Number.isFinite(q[0]) && Number.isFinite(q[1]) ? { x: q[0], y: q[1] } : null;
        });
        laatLos(g.vak, g.onder);
      }
      return;
    }
    if (camVingers.delete(e.pointerId)) vinger(e, FASE.los);
  }

  function afgebroken(e: PointerEvent) {
    if (greep?.id === e.pointerId) {
      if (greep.sleept) stuur((b) => b.loslaten(-1));
      greep = null;
      return;
    }
    if (camVingers.delete(e.pointerId)) vinger(e, FASE.weg);
  }

  /**
   * De gesleepte steen van `vak` wordt losgelaten boven plek `onder`. Boven een ander vak: een poging,
   * net als een tik. Mag hij niet, boven een eigen steen of naast het bord: terug naar zijn gaatje.
   */
  function laatLos(vak: number, onder: Punt | null) {
    const l = landing(onder, vak, { punten, stand, aanDeBeurt });
    if (l.soort === "blijf") return stuur((b) => b.loslaten(vak));
    if (l.soort === "terug") return stuur((b) => b.loslaten(-1));
    const mag = optik(l.vak) !== false;
    stuur((b) => b.loslaten(mag ? l.vak : -1));
  }

  // Wat de Speler met toetsenbord of schermlezer kan kiezen: dezelfde keuzes als met een tik.
  // Met een gekozen steen: elk leeg vak, niet alleen de vakken waar hij heen mag (geen hint).
  const stenen = $derived(stand.flatMap((speler, vak) => (speler >= 0 ? [{ vak, speler }] : [])));
  const legeVakken = $derived(speelbaar && gekozen !== null ? stand.flatMap((s, vak) => (s < 0 ? [vak] : [])) : []);
  const KLEUR_NAAM: Sleutel[] = ["color.red", "color.blue", "color.green", "color.yellow", "color.purple", "color.graphite"];
  const naam = (speler: number) => (KLEUR_NAAM[speler] ? t(KLEUR_NAAM[speler]) : t("player.n", { n: speler + 1 }));
</script>

<!-- Een Potje met een tafel (taak 224): de laadtafel tot het bord en de voorwerpen er staan. Stond
     hetzelfde bord al in beeld (een schermwissel tussen twee tafels), dan blijft die staan. -->
<Laadtafel aan={!alles && !!tafel && !warmBegin} />

<!-- Vingers en muis gaan naar het 3D-bord; toetsenbord en schermlezer via de knoppen hieronder. -->
<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<div
  class="bord3d"
  class:tafel={tafel !== null}
  class:klaar
  bind:this={vlakEl}
  onpointerdown={omlaag}
  onpointermove={beweeg}
  onpointerup={(e) => {
    omhoog(e);
    laatTafelGaan(e.pointerId);
  }}
  onpointercancel={(e) => {
    afgebroken(e);
    laatTafelGaan(e.pointerId);
  }}
  onclick={(e) => e.stopPropagation()}
  oncontextmenu={(e) => e.preventDefault()}
>
  {#if !alles && !tafel}
    <!-- Laden: het bord tekent zich zacht af tot het 3D-bord er is. -->
    <div class="laden" role="status" aria-label={t("game.loadingBoard")}>
      <svg viewBox="-10 -10 20 20" aria-hidden="true">
        {#if vorm === "vierkant"}
          <rect x="-8" y="-8" width="16" height="16" rx="0.6" />
        {:else}
          <path d="M0 -8.6 L7.45 -4.3 L7.45 4.3 L0 8.6 L-7.45 4.3 L-7.45 -4.3 Z" />
        {/if}
      </svg>
    </div>
  {/if}
</div>

{#if tafel}
  <Voorwerpen
    voorwerpen={tafel.voorwerpen}
    knoppen={tafel.knoppen}
    plekken={tafel.plekken}
    naam={tafel.naam}
    stand={[]}
    {bord}
    klaar={() => (tafelKlaar = true)}
    bind:vakken={tafelVakken}
  />
{/if}

<div class="sr-only" role="group" aria-label={vorm === "vierkant" ? t("board.square") : t("board.star")}>
  {#each stenen as s (s.vak)}
    {#if speelbaar && s.speler === aanDeBeurt}
      <button
        class="steen kan"
        class:gekozen={gekozen === s.vak}
        data-vak={s.vak}
        data-speler={s.speler}
        aria-pressed={gekozen === s.vak}
        onclick={() => optik(s.vak)}>{t("game.pieceOn", { name: naam(s.speler), n: s.vak + 1 })}</button
      >
    {:else}
      <span class="steen" class:gekozen={gekozen === s.vak} data-vak={s.vak} data-speler={s.speler}
        >{t("game.pieceOn", { name: naam(s.speler), n: s.vak + 1 })}</span
      >
    {/if}
  {/each}
  {#each legeVakken as vak (vak)}
    <button class="gat" data-gat={vak} onclick={() => doe({ soort: "zet", vak })}>{t("game.movePieceTo", { n: vak + 1 })}</button>
  {/each}
</div>

<style>
  .bord3d {
    position: relative;
    width: 100%;
    height: 100%;
    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
  }
  /* Met voorwerpen rond het bord ligt het vlak over het hele scherm (zonder notch en thuisbalk): de tafel past daarin. */
  .bord3d.tafel {
    position: fixed;
    inset: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
    width: auto;
    height: auto;
  }
  .laden {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
  }
  .laden svg {
    width: min(86%, 70vh);
    aspect-ratio: 1;
    fill: rgb(214 222 235 / 0.03);
    stroke: rgb(214 222 235 / 0.22);
    stroke-width: 0.12;
    stroke-linejoin: round;
    animation: adem 1.8s ease-in-out infinite alternate;
  }
  @keyframes adem {
    from {
      opacity: 0.35;
      transform: scale(0.985);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .laden svg {
      animation: none;
    }
  }
</style>
