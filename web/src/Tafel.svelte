<script lang="ts">
  // Een scherm met een lijst op de 3D-tafel (taak 181, uiterlijk 1b): bovenaan Terug en de naam van het scherm als voorwerpen,
  // in het midden een plaat van porselein met de inhoud van het scherm als gewone HTML, onderaan de knoppen als voorwerpen.
  import { onMount, type Snippet } from "svelte";
  import Laden from "./Laden.svelte";
  import Voorwerpen, { type TafelKnop, type Vakken } from "./Voorwerpen.svelte";
  import { bordWarm } from "./bord3d";
  import { opZijde } from "./lak";
  import { t, type Sleutel } from "./taal.svelte";
  import { tafelLijst, type TafelObject } from "./tafelblad";
  import { schuifteken } from "./schuifteken";
  import { kolomStijl, plaatZij, tafelStand } from "./voorwerpen-lijsten";
  import { isBreed } from "./breed.svelte";

  let {
    titel,
    terug,
    onder = [],
    inhoud,
  }: {
    /** Sleutel van de naam van het scherm (op de naamplaat). */
    titel: Sleutel;
    /** Terug: de naam voor de schermlezer (waar het heen gaat) en wat er gebeurt. */
    terug: { label: string; doe: () => void };
    /** De knoppen onderaan, als voorwerpen. */
    onder?: readonly TafelObject[];
    /** De inhoud van het scherm, op de plaat. De knoppen hierboven zijn voorwerpen; de inhoud laat ze weg. */
    inhoud: Snippet;
  } = $props();

  let klaar = $state(false);
  // Kwam de Speler van een andere tafel (UI-overgangen), dan blijft die in beeld: geen wachtteken ertussen, en de inhoud vervaagt
  // in op de plaat zodra Bevy zegt waar die aankomt (anders zie je even de schaduw van het bord op de lege plaat).
  const warm = bordWarm();
  let vakken = $state<Vakken>({});
  // Breed scherm (taak 236): het bord links met de Stenen van zes Spelers (zoals het Startmenu), de plaat en de knoppen rechts.
  const breed = $derived(isBreed());
  const voorwerpen = $derived(tafelLijst(titel, onder, breed));
  const knoppen = $derived<TafelKnop[]>([
    { id: "terug", tekst: t("common.back"), label: terug.label, doe: terug.doe },
    ...onder.map((o) => ({ id: o.id, tekst: t(o.sleutel), label: o.label, doe: o.doe })),
  ]);
  // Het bord ligt onder de plaat: leeg en niet te zien. Op een breed scherm ligt het naast de plaat.
  const leeg: number[] = Array(121).fill(-1);
  const stand = $derived(breed ? tafelStand() : leeg);

  // De zijden tafel meteen, ook voor de tafel in beeld is (anders staat er even een lichte achtergrond).
  onMount(() => opZijde());

  const plek = $derived.by(() => {
    const v = vakken.plaat;
    if (!v) return "";
    if (breed) return kolomStijl(v, 0.05, 0.03);
    // De bovenkant van de plaat is een trapezium (verder weg is smaller): het vlak ligt erbinnen.
    const b = v.rechts - v.links, h = v.onder - v.boven;
    const kantX = b * plaatZij(typeof window === "undefined" ? 0.6 : window.innerWidth / window.innerHeight), kantBoven = h * 0.05, kantOnder = h * 0.03;
    return `left:${v.links + kantX}px;top:${v.boven + kantBoven}px;width:${b - 2 * kantX}px;height:${h - kantBoven - kantOnder}px`;
  });
</script>

<Voorwerpen {voorwerpen} {knoppen} {stand} naam={t("common.back")} klaar={() => (klaar = true)} bind:vakken />
<div class="plaatvlak" class:klaar={(klaar || warm) && plek !== ""} class:breed-tekst={breed} style={plek} use:schuifteken>
  {@render inhoud()}
</div>
{#if !klaar && !warm}<div class="wacht"><Laden /></div>{/if}

<style>
  /* De inhoud van het scherm ligt op de plaat. Verborgen tot de tafel in beeld is. */
  .plaatvlak {
    position: fixed;
    z-index: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    visibility: hidden;
    color: var(--inkt);
  }

  /* Het uiterlijk van 1b voor de inhoud op de plaat: porselein en crème vlakken, kobaltblauwe tekst en lijnen, rood lak voor
     nadruk en dun goud voor de randen; geen ander kleurpalet. De kleuren van de knopplaten (`knopplaten/plaat.ts`: KOBALT, GOUD,
     CINNABER). Contrast: kobalt #1f3a82 op crème #f7f1e0 is 9:1, rood #9d2318 op crème 7:1, crème op rood lak 8:1 (AA). De
     namen die elders van var(--inkt) afgeleid zijn, staan hier opnieuw (een var() in :root wordt daar al ingevuld). */
  .plaatvlak {
    --inkt: #1f3a82;
    --zacht: #f7f1e0;
    --wit: #fffcf3;
    --creme: #efe6cc;
    --goudvlak: #ecd28f;
    --blad-rand: #d9c28a;
    --tegel-geel: #f3e2b0;
    --tegel-geel-inkt: #6b4a10;
    --tegel-roze: #f3d9d0;
    --tegel-roze-inkt: #8f1d12;
    --tegel-lila: #e3e6f3;
    --tegel-lila-inkt: #1f3a82;
    --tekst: #1f3a82;
    --tekst-zacht: #3a4c88;
    --tekst-stil: #46578f;
    --lijn: rgb(31 58 130 / 0.14);
    --lijn-sterk: rgb(31 58 130 / 0.26);
    --lijn-fel: rgb(31 58 130 / 0.6);
    --licht: #1f3a82;
    --licht-inkt: #fffcf3;
    --fout: #9d2318;
    --fout-vlak: #f6e0d8;
    --focus: #1f3a82;
    --vel: 12px;
    --goud: #c9a95a;
  }
  .plaatvlak.plaatvlak :global(.lijstblok) {
    border: 1.5px solid var(--goud);
    border-radius: 12px;
  }
  .plaatvlak.plaatvlak :global(.lijstblok > * + *) {
    border-top: 1px solid #dcc78f;
  }
  .plaatvlak.plaatvlak :global(.ikoon),
  .plaatvlak.plaatvlak :global(.stippen) {
    border-radius: 9px;
    border: 1px solid var(--goud);
    background: var(--wit);
  }
  .plaatvlak.plaatvlak :global(.ikoon.blauw) { background: var(--tegel-lila); color: #1f3a82; }
  .plaatvlak.plaatvlak :global(.ikoon.rood) { background: var(--tegel-roze); color: #8f1d12; }
  .plaatvlak.plaatvlak :global(.ikoon.groen) { background: var(--tegel-geel); color: #6b4a10; }
  .plaatvlak.plaatvlak :global(.ikoon.roze) { background: var(--tegel-lila); color: #1f3a82; }
  .plaatvlak.plaatvlak :global(.rij:hover),
  .plaatvlak.plaatvlak :global(.rij:active),
  .plaatvlak.plaatvlak :global(.rij[aria-pressed="true"]) {
    background: #efe2bd;
  }
  /* Rood lak voor nadruk: jij bent aan de beurt. Crème letters op oxbloed. */
  .plaatvlak.plaatvlak :global(.rij.jouw) {
    background: #8f1d12;
    --inkt: #fff3dc;
    --tekst: #fff3dc;
    --tekst-zacht: #f6dcc8;
    --tekst-stil: #f6dcc8;
    /* Taak 240: het witte ovaaltje met de Denktijd ligt op het rood: donkere letters erin (kobalt op wit 9:1), niet de lichte tekstkleur. */
    --chip-inkt: #1f3a82;
    color: #fff3dc;
  }
  .plaatvlak.plaatvlak :global(.rij.jouw:hover),
  .plaatvlak.plaatvlak :global(.rij.jouw:active) {
    background: #a52618;
  }
  .plaatvlak.plaatvlak :global(.rij.jouw .stippen) {
    background: var(--wit);
  }
  .plaatvlak.plaatvlak :global(.knop-licht),
  .plaatvlak.plaatvlak :global(.knop-lijn) {
    border-radius: 12px;
  }
  .plaatvlak.plaatvlak :global(.knop-lijn) {
    border-color: var(--inkt);
  }
  .plaatvlak.plaatvlak :global(.cel),
  .plaatvlak.plaatvlak :global(.code),
  .plaatvlak.plaatvlak :global(.gevonden),
  .plaatvlak.plaatvlak :global(.beoordeel) {
    border-radius: 12px;
  }
  .plaatvlak.plaatvlak :global(.code) {
    border: 1.5px solid var(--goud);
    background: var(--wit);
  }
  .plaatvlak.plaatvlak :global(.cel:not(.donker)) {
    border: 1px solid var(--goud);
  }
  .plaatvlak.plaatvlak :global(.cel.lost) {
    color: #8f1d12;
  }
  .plaatvlak.klaar {
    visibility: visible;
  }
  .wacht {
    position: fixed;
    inset: 0;
    display: flex;
  }
  /* Het scherm vult de plaat; het crème blad en de ronde knoppen van de gedeelde stijl (app.css) horen hier niet. */
  .plaatvlak > :global(.scherm) {
    flex: 1;
    padding: 0;
    gap: 10px;
  }
  .plaatvlak :global(.blad),
  :global(body.zijde) .plaatvlak :global(.blad) {
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: none;
    box-shadow: none;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  .plaatvlak :global(.hero) {
    flex: none;
    padding: 4px 0 0;
  }
  .plaatvlak :global(.hero .vraag) {
    font-size: 1.6rem;
  }
  .plaatvlak :global(.lijstblok .rij) {
    min-height: 56px;
  }
  .plaatvlak :global(.blad::before),
  .plaatvlak :global(.hero-bord),
  .plaatvlak :global(.hero .embleem) {
    display: none;
  }
</style>
