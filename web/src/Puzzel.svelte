<script lang="ts">
  import { onMount } from "svelte";
  import { DagelijksePuzzel } from "./wasm/halma_core.js";
  import Icoon from "./Icoon.svelte";
  import Bord3D from "./Bord3D.svelte";
  import type { TafelKnop, Vakken } from "./Voorwerpen.svelte";
  import { platenStijl, puzzelTafel, type PuzzelKnop } from "./voorwerpen-lijsten";
  import { binnen } from "./overgang";
  import { TikNaarZet } from "./tiknaarzet.svelte";
  import { meld, meldBeweging } from "./geluid";
  import { leesSpeler, meldPuzzeldag } from "./online";
  import { meldNieuwePrestaties, neemBasis } from "./prestaties";
  import { LAK_GRIJS } from "./lak";
  import { beweging as beweging_van, bewegingDuur, type Beweging } from "./spelers";
  import {
    PUZZEL_LINK,
    besteVandaag,
    datumSleutel,
    datumVan,
    huidigeReeks,
    leesOpslag,
    registreerOplossing,
    totMiddernacht,
    type Datum,
  } from "./puzzel";
  import { kanPuzzelmelding, leesAan, plan as planMelding, zetAan, zetUit } from "./puzzelmelding";
  import { huidigeTaal, t, tn } from "./taal.svelte";

  // Taak 187: de puzzel is een tafel zoals een Potje (het 3D-bord met vingers, Terug, de titel, Start over en Done of Share
  // als voorwerpen, het Streefgetal en het aantal Zetten op een plaat).
  // De Dagelijkse puzzel (taak 152): het Sterbord met de puzzel van vandaag in de eigen tijd van de Speler.
  // Zetten gaan zoals in een gewoon Potje; een Zet die niet mag rolt terug. Alles blijft op dit toestel.
  let { terug, nu = () => new Date() }: { terug: () => void; nu?: () => Date } = $props();

  // Speler 0 is de Steen van de Speler (zijn eigen kleur, leeg: de gewone kleur van het bord), 1 is een grijze Steen die niet beweegt.
  const KLEUREN = [undefined, LAK_GRIJS] as const;

  const begin = datumVan(nu());
  let datum = $state.raw<Datum>(begin);
  let puzzel = $state.raw<DagelijksePuzzel>(new DagelijksePuzzel(begin.jaar, begin.maand, begin.dag));
  let versie = $state(0);
  let beweging = $state<Beweging | null>(null);
  // De gekozen steen en de Sprongketen, en wat een tik doet (tiknaarzet.svelte.ts). De eigen Steen is altijd Speler 0;
  // na het oplossen doet een tik niets.
  const invoer = new TikNaarZet({
    regels: () => puzzel,
    stand: () => echteStand,
    eigen: () => 0,
    mag: () => !opgelost,
    zet: (van, naar, alGetoond) => voerZetUit(van, naar, alGetoond),
    sprong: (van, naar) => (beweging = beweging_van("ster", plekken, stand, van, naar)),
    kies: () => (beweging = null),
  });
  let opslag = $state.raw(leesOpslag());
  let gedeeld = $state("");
  // De Melding van de Dagelijkse puzzel (taak 153): alleen in de iPhone-app, standaard uit, lokaal op het toestel.
  const toonMelding = kanPuzzelmelding();
  let meldingAan = $state(toonMelding && leesAan());
  let meldingGeblokkeerd = $state(false);
  const meldingTitel = () => t("puzzle.title");
  const meldingTekst = () => t("pmelding.body");

  const plekken = $derived(Array.from(puzzel.vak_plekken()));
  const echteStand = $derived.by(() => {
    versie;
    return Array.from(puzzel.stand());
  });
  const stand = $derived(invoer.toon(echteStand));
  const doelvakken = $derived(Array.from(puzzel.doelvakken()));
  const zetten = $derived.by(() => {
    versie;
    return puzzel.zetten();
  });
  const opgelost = $derived.by(() => {
    versie;
    return puzzel.is_opgelost();
  });
  const streef = $derived(puzzel.streefgetal());
  const reeks = $derived(huidigeReeks(opslag, datum));
  const beste = $derived(besteVandaag(opslag, datum));

  // Een nieuwe Prestatie (taak 174): alleen met een account. Bij het openen is alles wat de server heeft al bekend.
  onMount(() => {
    const speler = leesSpeler();
    if (speler) void neemBasis(speler.sleutel, speler.speler_id);
  });

  // Plan de Meldingen opnieuw bij het openen: een nieuwe dag, of de Speler loste al op.
  onMount(() => {
    if (meldingAan) void planMelding(meldingTitel(), meldingTekst(), nu());
  });

  async function wisselMelding() {
    meldingGeblokkeerd = false;
    if (meldingAan) {
      meldingAan = false;
      await zetUit(meldingTitel(), meldingTekst(), nu()).catch(() => {});
      return;
    }
    try {
      meldingAan = await zetAan(meldingTitel(), meldingTekst(), nu());
      meldingGeblokkeerd = !meldingAan;
    } catch {
      meldingGeblokkeerd = true;
    }
  }

  // Om middernacht (eigen tijd) begint de puzzel van de nieuwe dag.
  onMount(() => {
    let timer: ReturnType<typeof setTimeout>;
    const plan = () => {
      timer = setTimeout(() => {
        nieuweDag();
        plan();
      }, totMiddernacht(nu()) + 50);
    };
    plan();
    return () => clearTimeout(timer);
  });

  function nieuweDag() {
    const d = datumVan(nu());
    if (datumSleutel(d) === datumSleutel(datum)) return;
    datum = d;
    puzzel.free();
    puzzel = new DagelijksePuzzel(d.jaar, d.maand, d.dag);
    wis();
  }

  function wis() {
    invoer.wis();
    beweging = null;
    gedeeld = "";
    versie++;
  }

  function opnieuw() {
    puzzel.opnieuw();
    wis();
  }

  function voerZetUit(van: number, vak: number, alGetoond = false) {
    const pad = alGetoond ? beweging : beweging_van("ster", plekken, echteStand, van, vak);
    try {
      puzzel.zet(van, vak);
    } catch {
      return false;
    }
    if (!alGetoond) meldBeweging(pad);
    beweging = pad;
    invoer.wis();
    versie++;
    if (puzzel.is_opgelost()) {
      opslag = registreerOplossing(datum, puzzel.zetten());
      const speler = leesSpeler();
      // Eerst de datum naar de server (voor de Reeks van zeven), dan kijken of er een Prestatie bij is. Offline: geen fout.
      if (speler) void meldPuzzeldag(speler.sleutel, datumSleutel(datum)).catch(() => {}).then(() => meldNieuwePrestaties(speler.sleutel, speler.speler_id));
      setTimeout(() => meld({ soort: "winst" }), bewegingDuur(pad));
      // Vandaag is opgelost: de Melding van morgen blijft, die van vandaag vervalt.
      if (meldingAan) void planMelding(meldingTitel(), meldingTekst(), nu());
    }
  }

  // De tafel (taak 187). De lijst voorwerpen is in elke stand gelijk; alleen het plaatje van de lakknop wisselt.
  let tafelKlaar = $state(false);
  let vakken = $state<Vakken>({});
  const lakKnop = $derived<PuzzelKnop>(opgelost ? "delen" : invoer.keten ? "klaar" : "leeg");
  const tafel = $derived.by(() => {
    const knoppen: TafelKnop[] = [
      { id: "terug", tekst: t("common.back"), doe: terug },
      { id: "opnieuw", tekst: t("puzzle.restart"), uit: !opgelost && zetten === 0 && !invoer.keten && invoer.gekozen === null, doe: opnieuw },
    ];
    if (opgelost) knoppen.push({ id: "verder", tekst: t("puzzle.share"), doe: () => void deel() });
    else knoppen.push({ id: "verder", tekst: t("game.done"), uit: !invoer.keten, doe: () => invoer.klaar() });
    return {
      voorwerpen: puzzelTafel(lakKnop),
      knoppen,
      naam: t("puzzle.title"),
      vakken: (v: Vakken) => (vakken = v),
      klaar: () => (tafelKlaar = true),
    };
  });

  const datumTekst = $derived(
    new Intl.DateTimeFormat(huidigeTaal() === "en" ? "en-GB" : huidigeTaal(), { day: "numeric", month: "short" }).format(
      new Date(datum.jaar, datum.maand - 1, datum.dag),
    ),
  );
  /** De deeltekst: alleen de datum, je Zetten en het Streefgetal, en een link. Nooit een Spelersnaam. */
  const deelTekst = $derived(tn("puzzle.shareText", zetten, { date: datumTekst, goal: streef }));

  async function deel() {
    const tekst = `${deelTekst}\n${PUZZEL_LINK}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text: tekst });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(tekst);
      gedeeld = t("puzzle.copied");
    } catch {
      gedeeld = t("online.copyFailed");
    }
  }
</script>

<section class="scherm puzzel tafel" in:binnen>
  <Bord3D
    vorm="ster"
    {plekken}
    {stand}
    aanDeBeurt={0}
    gekozen={invoer.getoond}
    {doelvakken}
    {beweging}
    {...invoer.bord}
    speelbaar={!opgelost}
    kleuren={KLEUREN}
    {tafel}
  />

  <!-- Het Streefgetal, het aantal Zetten en de uitslag liggen op de plaat van porselein onder het bord; de knoppen zijn voorwerpen. -->
  <div class="op-plaat" class:klaar={tafelKlaar && !!vakken.uitleg} style={platenStijl(vakken.uitleg, 0.07, 0.1, 0.08)}>
    <p class="tellers">
      <span class="doel"><Icoon naam="puzzel" maat={18} />{tn("puzzle.goal", streef)}</span>
      <span class="teller cijfers" aria-live="polite">{t("puzzle.moveCount", { n: zetten })}</span>
    </p>
    {#if opgelost}
      <div class="klaar" role="status">
        <h2>{t("puzzle.solved")}</h2>
        <p class="stats">
          {#if beste !== null}<span class="pil">{t("puzzle.best", { n: beste })}</span>{/if}
          <span class="pil geel">{tn("puzzle.streak", reeks)}</span>
        </p>
        {#if gedeeld}<p class="gedeeld" role="status">{gedeeld}</p>{/if}
      </div>
    {:else if beste !== null || reeks > 0}
      <span class="stil">{#if beste !== null}{t("puzzle.best", { n: beste })} · {/if}{tn("puzzle.streak", reeks)}</span>
    {/if}
    <!-- Taak 240: Done ligt er dof zonder Sprongketen; zeg erbij wat je eerst moet doen. -->
    {#if !opgelost && !invoer.keten}<p class="eerst">{t("hint.jump", { done: t("game.done") })}</p>{/if}
  </div>
  {#if toonMelding}
    <label class="melding hoek">
      <input type="checkbox" checked={meldingAan} onchange={wisselMelding} />
      <span>{t("pmelding.label")}</span>
    </label>
    {#if meldingGeblokkeerd}<p class="gedeeld hoek" role="status">{t("notif.blocked")}</p>{/if}
  {/if}
</section>

<style>
  .doel,
  .teller {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 7px 14px;
    border-radius: var(--pil);
    background: var(--zacht);
    font-weight: 800;
    font-size: 0.95rem;
  }
  .teller {
    background: var(--inkt);
    color: var(--wit);
    font-size: 0.9rem;
  }
  .eerst {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
    color: #46578f;
    text-align: center;
  }
  .stil {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--tekst-zacht);
  }
  .klaar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
  }
  .klaar h2 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .klaar p {
    margin: 0;
    font-weight: 600;
    color: var(--tekst-zacht);
  }
  .stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
  .pil {
    padding: 4px 12px;
    border-radius: var(--pil);
    background: var(--zacht);
    color: var(--inkt);
    font-size: 0.88rem;
    font-weight: 800;
  }
  .pil.geel {
    background: var(--tegel-geel);
    color: var(--tegel-geel-inkt);
  }
  .melding {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--tekst-zacht);
  }
  .gedeeld {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--tekst-zacht);
    text-align: center;
  }

  .doel,
  .pil {
    background: #efece3;
    color: #1f3a82;
    box-shadow:
      inset 0 0 0 1.5px #26438a,
      0 2px 0 #a9c6ae,
      0 4px 8px rgb(0 0 0 / 0.35);
  }
  .doel :global(svg) {
    color: #1f3a82;
  }
  .pil.geel {
    background: #d2ad5e;
    color: #3a2408;
    box-shadow:
      inset 0 0 0 1.5px #8d6418,
      0 2px 0 #8d6418;
  }
  .teller {
    background: #0b0807;
    color: #f2c466;
    box-shadow:
      inset 0 0 0 1.5px #d9a94e,
      0 4px 8px rgb(0 0 0 / 0.4);
  }
  .stil,
  .melding,
  .gedeeld,
  .klaar p,
  .klaar h2 {
    color: #fff3dc;
  }

  /* Op de tafel (taak 187): de tellers en de uitslag op de plaat van porselein, kobaltblauw zoals de uitleg van de Speluitleg
     (#1f3a82 op #efece3 is 9:1). Geen vingers: een tik naast het bord laat de Steen los. Verborgen tot de tafel in beeld is. */
  .op-plaat {
    position: fixed;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
    color: #1f3a82;
    pointer-events: none;
    visibility: hidden;
  }
  .op-plaat.klaar {
    visibility: visible;
  }
  .tellers {
    display: flex;
    gap: 10px;
    margin: 0;
  }
  .op-plaat .doel,
  .op-plaat .teller {
    white-space: nowrap;
    font-size: 0.82rem;
  }
  .op-plaat .doel {
    background: none;
    box-shadow: none;
    padding: 0;
  }
  .op-plaat .teller {
    display: block;
    padding: 5px 12px;
  }
  .op-plaat .klaar h2 {
    color: #1f3a82;
    font-size: 1.3rem;
  }
  .op-plaat .stil,
  .op-plaat .gedeeld {
    color: #1f3a82;
  }
  /* `.op-plaat.klaar p` zou hier crème letters geven (`.klaar p` hierboven is voor het blad van rood lak). */
  .op-plaat .eerst {
    color: #46578f;
  }
  .op-plaat .pil {
    box-shadow: inset 0 0 0 1.5px #26438a;
  }
  .op-plaat .pil.geel {
    box-shadow: inset 0 0 0 1.5px #8d6418;
  }
  .melding.hoek,
  .gedeeld.hoek {
    position: fixed;
    z-index: 2;
    left: 0;
    right: 0;
    bottom: calc(4px + var(--veilig-onder));
    justify-content: center;
    color: #fff3dc;
  }
</style>
