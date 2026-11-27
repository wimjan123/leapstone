<script lang="ts">
  import { Potje } from "./wasm/halma_core.js";
  import Icoon from "./Icoon.svelte";
  import Bord3D from "./Bord3D.svelte";
  import type { TafelKnop, Vakken } from "./Voorwerpen.svelte";
  import { platenStijl, speluitleg } from "./voorwerpen-lijsten";
  import { binnen } from "./overgang";
  import { TikNaarZet } from "./tiknaarzet.svelte";
  import { OEFENINGEN, oefeningStand, vakOp } from "./speluitleg";
  import { meldBeweging } from "./geluid";
  import { LAK_GRIJS } from "./lak";
  import { beweging as beweging_van, type Beweging } from "./spelers";
  import { t } from "./taal.svelte";

  // De Speluitleg (taak 156): drie oefeningen op het echte Sterbord en daarna het doel van het spel.
  // In een oefening licht alleen het doelvakje op. Een Zet naar een ander vak rolt terug en de tekst blijft staan.
  // Taak 184: het is een tafel in uiterlijk 1b (het 3D-bord met vingers, Terug, de titel en de knop als voorwerpen, de
  // uitleg op een plaat van porselein).
  let { terug, speel }: { terug: () => void; speel: () => void } = $props();

  // Speler 0 is de Steen van de Speler (zijn eigen kleur, leeg: de gewone kleur van het bord), 1 is een grijze Steen die niet beweegt.
  const KLEUREN = [undefined, LAK_GRIJS] as const;

  /** 0, 1 en 2 zijn de oefeningen; 3 is het doel van het spel. */
  let fase = $state(0);
  let potje = $state.raw<Potje>(nieuwePotje(0));
  let versie = $state(0);
  let beweging = $state<Beweging | null>(null);
  let gedaan = $state(false);
  // De gekozen steen en de Sprongketen, en wat een tik doet (tiknaarzet.svelte.ts). De eigen Steen is altijd Speler 0;
  // buiten een oefening of als hij klaar is, doet een tik niets. `voerZetUit` wijst een Zet naar een ander vak af.
  const invoer = new TikNaarZet({
    regels: () => potje,
    stand: () => echteStand,
    eigen: () => 0,
    mag: () => oefening !== null && !gedaan,
    zet: (van, naar, alGetoond) => voerZetUit(van, naar, alGetoond),
    sprong: (van, naar) => (beweging = beweging_van("ster", plekken, stand, van, naar)),
    kies: () => (beweging = null),
  });

  function nieuwePotje(nummer: number): Potje {
    // Een leeg Potje geeft de vakplekken; daarna de stand van de oefening, met de regels van halma-core.
    const leeg = new Potje(2);
    const plekken = Array.from(leeg.vak_plekken());
    leeg.free();
    if (nummer >= OEFENINGEN.length) return new Potje(2);
    return Potje.van_stand(false, 2, oefeningStand(plekken, OEFENINGEN[nummer]), 0);
  }

  const oefening = $derived(fase < OEFENINGEN.length ? OEFENINGEN[fase] : null);
  const plekken = $derived(Array.from(potje.vak_plekken()));
  const echteStand = $derived.by(() => {
    versie;
    return Array.from(potje.stand());
  });
  const stand = $derived(invoer.toon(echteStand));
  const doel = $derived(oefening ? vakOp(plekken, oefening.doel) : null);
  // Alleen het doelvakje licht op. Bij het doel van het spel is het bord een echt Potje: daar het gewone doelpunt.
  const doelvakken = $derived(oefening ? [doel!] : Array.from(potje.doelvakken(0)));

  function volgende() {
    potje.free();
    fase++;
    potje = nieuwePotje(fase);
    invoer.wis();
    beweging = null;
    gedaan = false;
    versie++;
  }

  /** De Zet is klaar op `vak`: alleen het doelvakje is goed. Anders rolt de Steen terug. */
  function voerZetUit(van: number, vak: number, alGetoond = false): boolean | void {
    if (vak !== doel) {
      invoer.wis();
      return false;
    }
    const pad = alGetoond ? beweging : beweging_van("ster", plekken, echteStand, van, vak);
    try {
      potje.zet(van, vak);
    } catch {
      return false;
    }
    if (!alGetoond) meldBeweging(pad);
    beweging = pad;
    invoer.wis();
    gedaan = true;
    versie++;
  }

  // De tafel (taak 184). De lijst voorwerpen is in elke stap gelijk; alleen het plaatje van de lakknop wisselt.
  let tafelKlaar = $state(false);
  let vakken = $state<Vakken>({});
  const tafel = $derived.by(() => {
    const knoppen: TafelKnop[] = [{ id: "terug", tekst: t("common.back"), doe: terug }];
    if (!oefening) knoppen.push({ id: "verder", tekst: t("learn.playComputer"), doe: speel });
    else knoppen.push({ id: "verder", tekst: t("learn.next"), uit: !gedaan, doe: volgende });
    return {
      voorwerpen: speluitleg(!oefening ? "computer" : gedaan ? "volgende" : "leeg"),
      knoppen,
      naam: t("learn.title"),
      vakken: (v: Vakken) => (vakken = v),
      klaar: () => (tafelKlaar = true),
    };
  });
</script>

<section class="scherm uitleg tafel" in:binnen>
  <Bord3D
    vorm="ster"
    {plekken}
    {stand}
    aanDeBeurt={0}
    gekozen={invoer.getoond}
    {doelvakken}
    {beweging}
    {...invoer.bord}
    speelbaar={oefening !== null && !gedaan}
    kleuren={oefening ? KLEUREN : undefined}
    {tafel}
  />

  <!-- De uitleg ligt op de plaat van porselein onder het bord; de knoppen zijn voorwerpen. -->
  <div class="op-plaat" class:klaar={tafelKlaar && !!vakken.uitleg} style={platenStijl(vakken.uitleg, 0.07, 0.1, 0.08)}>
    <p class="tekst" aria-live="polite">{oefening ? t(oefening.tekst) : t("learn.goal")}</p>
    {#if oefening}
      <span class="stappen" aria-hidden="true">
        {#each OEFENINGEN as _, i}<i class:nu={i === fase}></i>{/each}
      </span>
    {/if}
    <!-- Taak 240: Next ligt er dof tot de oefening klaar is; zeg erbij wat je eerst moet doen. -->
    {#if oefening && !gedaan}<p class="eerst">{t("hint.exercise")}</p>{/if}
  </div>
</section>

<style>
  /* Het bord krijgt de ruimte; onderin een crème blad met de uitleg, de voortgang en de knop. */
  .tekst {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.3;
    min-height: 2.6em;
    display: flex;
    align-items: center;
    text-wrap: balance;
  }
  /* De uitleg op de plaat van porselein (uiterlijk 1b): kobaltblauwe letters, de stap als rood lak met dun goud. Verborgen tot
     de tafel in beeld is. Geen vingers: een tik naast het bord laat de Steen los, ook hier. Kobalt #1f3a82 op porselein #efece3
     is 9:1. */
  .op-plaat {
    position: fixed;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-align: center;
    color: #1f3a82;
    pointer-events: none;
    visibility: hidden;
  }
  .op-plaat.klaar {
    visibility: visible;
  }
  .op-plaat .tekst {
    justify-content: center;
    min-height: 0;
    font-size: 1.1rem;
  }
  .op-plaat .eerst {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
    color: #46578f;
  }
  .op-plaat .stappen i {
    background: #d9c28a;
  }
  .op-plaat .stappen i.nu {
    background: #9d2318;
    box-shadow: 0 0 0 1.5px #c9a95a;
  }
  .stappen {
    display: flex;
    gap: 6px;
  }
  .stappen i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--blad-rand);
  }
  .stappen i.nu {
    width: 26px;
    border-radius: 5px;
    background: var(--inkt);
  }
</style>
