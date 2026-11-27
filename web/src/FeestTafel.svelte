<script lang="ts">
  // De tafel van het winstscherm (taak 180, uiterlijk 1b): het eindbord, een lakplaat voor de uitslag, een plaat van porselein voor de
  // beoordeling en de ranglijst, en de knoppen als voorwerpen met een onzichtbare HTML-knop. De tekst op de platen is gewone HTML van
  // het scherm zelf (`vakken` zegt waar de platen liggen). Zie docs/bord3d.md, "Lijstschermen".
  import { onMount } from "svelte";
  import Voorwerpen, { type TafelKnop, type Vakken } from "./Voorwerpen.svelte";
  import { t } from "./taal.svelte";
  import { breedLijst, MEDAILLE_RUIMTE, winst } from "./voorwerpen-lijsten";
  import { isBreed } from "./breed.svelte";

  let {
    stand,
    vierkant = false,
    hoofd,
    start = null,
    metLijst,
    klaar,
    vakken = $bindable({}),
  }: {
    /** Het eindbord: per vak de Speler, of -1. */
    stand: readonly number[];
    vierkant?: boolean;
    /** De hoofdknop: Play again, New game of My games. */
    hoofd: { id: "opnieuw" | "nieuwPotje" | "mijnPotjes"; tekst: string; doe: () => void };
    /** Back to start, als het scherm die heeft. */
    start?: { tekst: string; doe: () => void } | null;
    /** Staat er een plaat voor de beoordeling en de ranglijst. */
    metLijst: boolean;
    klaar?: () => void;
    vakken?: Vakken;
  } = $props();

  // Breed scherm (taak 236): het eindbord links, uitslag, medaille, lijst en knoppen als kolom rechts.
  const voorwerpen = $derived(breedLijst(winst(hoofd.id, !!start, metLijst), isBreed(), { ruimte: { uitslag: MEDAILLE_RUIMTE } }));
  const knoppen = $derived<TafelKnop[]>([{ id: "hoofd", tekst: hoofd.tekst, doe: hoofd.doe }, ...(start ? [{ id: "start", tekst: start.tekst, doe: start.doe }] : [])]);

  // Terwijl de tafel in beeld is, is de rest van het spelscherm (balk, voet) niet te zien en niet te raken.
  onMount(() => {
    document.body.classList.add("feest-tafel");
    return () => document.body.classList.remove("feest-tafel");
  });
</script>

<!-- Het winstscherm ligt over het Potje (dat eronder blijft staan): het stuurt de tafel, ook als het Potje later op de pagina komt. -->
<Voorwerpen {voorwerpen} {knoppen} {stand} {vierkant} naam={t("common.gameOver")} {klaar} laag={1} bind:vakken />
