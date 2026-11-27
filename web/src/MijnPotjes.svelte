<script lang="ts">
  import { onMount } from "svelte";
  import { ApiFout, deelIn, haalMijnPotjes, tegenstandersKort, tekstVan, type MijnPotje } from "./online";
  import Icoon from "./Icoon.svelte";
  import Laden from "./Laden.svelte";
  import Steentje from "./Steentje.svelte";
  import Tafel from "./Tafel.svelte";
  import type { TafelObject } from "./tafelblad";
  import { binnen } from "./overgang";
  import { denktijdNaam, denktijdTekst } from "./denktijd";
  import { t, tn } from "./taal.svelte";

  // Mijn potjes: alle online Potjes van de Speler. De server houdt de lijst bij; de app deelt hem alleen in.
  let {
    sleutel,
    ikId,
    melding = "",
    open,
    nieuw,
    terug,
    ranglijst,
    account,
    vrienden,
    verlopen,
  }: {
    sleutel: string;
    ikId: number;
    melding?: string;
    open: (potjeId: number) => void;
    nieuw: () => void;
    terug: () => void;
    ranglijst: () => void;
    account: () => void;
    vrienden: () => void;
    /** De server kent de sleutel niet meer. */
    verlopen: () => void;
  } = $props();

  let lijst = $state.raw<MijnPotje[] | null>(null);
  let fout = $state("");
  const delen = $derived(lijst ? deelIn(lijst) : null);

  async function laad() {
    try {
      lijst = await haalMijnPotjes(sleutel);
      fout = "";
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      fout = tekstVan(e);
    }
  }

  onMount(() => {
    laad();
    // Terug in de app (na een Melding bijvoorbeeld): de lijst is dan misschien verouderd.
    const opZicht = () => document.visibilityState === "visible" && laad();
    document.addEventListener("visibilitychange", opZicht);
    return () => document.removeEventListener("visibilitychange", opZicht);
  });

  const bordNaam = (p: MijnPotje) => (p.bord === "vierkant" ? t("board.square") : t("board.star"));
  const naamVan = (p: MijnPotje, plek: number | null) => p.spelers.find((s) => s.plek === plek)?.spelersnaam ?? "";
  const tegenstanderNamen = (p: MijnPotje) => p.spelers.filter((s) => s.speler_id !== ikId).map((s) => s.spelersnaam);
  function status(p: MijnPotje): string {
    if (p.afgelopen) {
      if (p.winnaar === null) return t("mine.finished");
      return p.winnaar === p.jouw_plek ? t("mine.youWon") : t("mine.won", { name: naamVan(p, p.winnaar) });
    }
    if (!p.gestart) {
      // Kort (taak 233): "1 seat still open" in plaats van "Lobby: 1 seat still open", dat in een smalle rij werd afgekapt.
      const vrij = p.aantal_spelers - p.spelers.length;
      return tn("online.seatsOpen", vrij);
    }
    if (p.aan_de_beurt === p.jouw_plek) return t("common.yourTurn");
    return t("mine.toMove", { name: naamVan(p, p.aan_de_beurt) });
  }

  // Op de tafel (taak 181): Terug, Friends, Account, Leaderboard en New game zijn voorwerpen.
  const tafelKnoppen: TafelObject[] = [
    { id: "account", soort: "porselein", sleutel: "common.account", pictogram: "persoon", doe: () => account() },
    { id: "vrienden", soort: "porselein", sleutel: "menu.friends", pictogram: "vrienden", doe: () => vrienden() },
    { id: "ranglijst", soort: "porselein", sleutel: "common.leaderboard", pictogram: "ranglijst", doe: () => ranglijst() },
    { id: "nieuw", soort: "rood", sleutel: "common.newGame", doe: () => nieuw() },
  ];
</script>

<Tafel titel="common.myGames" terug={{ label: t("common.backToStart"), doe: () => terug() }} onder={tafelKnoppen}>
{#snippet inhoud()}
<section class="scherm mijn" in:binnen>
  <h1 class="sr-only">{t("common.myGames")}</h1>

  {#if melding}<p class="fout" role="alert">{melding}</p>{/if}

  {#if fout}
    <div class="leeg">
      <p class="fout" role="alert">{fout}</p>
      <button class="knop-lijn" onclick={laad}>{t("common.tryAgain")}</button>
    </div>
  {:else if !delen}
    <Laden />
  {:else if lijst && lijst.length === 0}
    <div class="blad">
      <p class="leeg-tekst">{t("mine.none")}</p>
    </div>
  {:else}
    {#snippet groep(titel: string, potjes: MijnPotje[], beurt: boolean)}
      {#if potjes.length > 0}
        <div class="groep-kop"><h2>{titel}</h2><span class="tal cijfers" aria-hidden="true">{potjes.length}</span></div>
        <ul class="rijen lijstblok" aria-label={titel}>
          {#each potjes as p, n (p.potje_id)}
            {@const alle = tegenstanderNamen(p)}
            {@const kort = tegenstandersKort(alle)}
            <li style="--n:{n}">
              <button class="rij" class:jouw={beurt} class:klaar={p.afgelopen} onclick={() => open(p.potje_id)}>
                <span class="stippen" class:drie={p.aantal_spelers === 3 || p.aantal_spelers === 6} class:vierkant={p.bord === "vierkant"} aria-hidden="true">
                  {#each Array.from({ length: p.aantal_spelers }, (_, i) => i) as i (i)}
                    {#if p.spelers.some((s) => s.plek === i + 1)}
                      <Steentje speler={i} maat={9} stip />
                    {:else}
                      <span class="open"></span>
                    {/if}
                  {/each}
                </span>
                <span class="tekst">
                  <!-- Taak 284: hooguit twee namen, en "+3" voor de rest; de schermlezer hoort alle namen. -->
                  <span class="tegen">
                    {#if alle.length === 0}
                      <strong>{t("mine.noOpponents")}</strong>
                    {:else if kort.meer === 0}
                      <strong>{alle.join(", ")}</strong>
                    {:else}
                      <strong><span aria-hidden="true">{kort.namen.join(", ")}</span><span class="sr-only">{alle.join(", ")}</span></strong>
                      {#if kort.meer > 0}<span class="meer cijfers" aria-hidden="true" data-testid="meer-tegenstanders">+{kort.meer}</span>{/if}
                    {/if}
                  </span>
                  <span class="status">
                    <span class="status-tekst">{status(p)}</span>
                    {#if p.denktijd_s !== undefined && !p.afgelopen}
                      <span class="denktijd cijfers" data-testid="denktijd-badge">
                        <Icoon naam={p.denktijd_s === null ? "oneindig" : "klok"} maat={12} />
                        <span class="sr-only">, {denktijdNaam(p.denktijd_s)}</span>
                        <!-- Taak 233: geen kaal ∞-teken; de Speler leest "No time limit". -->
                        <span aria-hidden="true">{p.denktijd_s === null ? t("moveTime.none") : denktijdTekst(p.denktijd_s)}</span>
                      </span>
                    {/if}
                  </span>
                  <span class="sr-only">{t("mine.boardPlayers", { board: bordNaam(p), players: tn("players.count", p.aantal_spelers) })}</span>
                </span>
                <span class="pijl" aria-hidden="true"><Icoon naam="verder" maat={16} /></span>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    {/snippet}
    <div class="blad">
      <div class="schuif" data-scrollt>
        {@render groep(t("common.yourTurn"), delen.jouwBeurt, true)}
        {@render groep(t("mine.waiting"), delen.wacht, false)}
        {@render groep(t("mine.finished"), delen.afgelopen, false)}
      </div>
    </div>
  {/if}
</section>
{/snippet}
</Tafel>

<style>
  .blad .schuif {
    flex: 0 1 auto;
  }
  .groep-kop {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 16px 4px 8px;
    color: var(--tekst-zacht);
  }
  .groep-kop h2 {
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .groep-kop:first-child {
    margin-top: 4px;
  }
  .tal {
    font-size: 0.82rem;
    font-weight: 800;
    color: var(--tekst-zacht);
  }
  .rijen li {
    animation: rij-in 420ms calc(min(var(--n), 6) * 40ms) var(--uit) both;
  }
  .rij {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 0;
    padding-inline: 14px 12px;
    min-height: 68px;
    border-radius: 0;
    text-align: start;
  }
  .rij:active {
    background: var(--blad-rand);
  }
  @media (hover: hover) {
    .rij:hover {
      background: #efe2bd;
    }
  }
  .rij.klaar {
    opacity: 0.65;
  }
  .rij.jouw {
    background: var(--goudvlak);
  }
  .rij.jouw:active {
    background: #e0c06f;
  }
  .tekst {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  /* Namen over hooguit twee regels, de status mag ook omslaan (taak 233): niets wordt afgekapt met "...". */
  .tekst strong {
    font-size: 1.02rem;
    font-weight: 700;
    line-height: 1.2;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow-wrap: anywhere;
  }
  .tegen {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    min-width: 0;
  }
  .tegen strong {
    min-width: 0;
  }
  /* "+3": altijd van links naar rechts, ook in het Arabisch. */
  .meer {
    flex: none;
    direction: ltr;
    unicode-bidi: isolate;
    font-size: 0.92rem;
    font-weight: 800;
    line-height: 1.3;
    color: var(--tekst-zacht);
  }
  .status {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 10px;
    min-width: 0;
    color: var(--tekst-zacht);
    font-size: 0.85rem;
    font-weight: 600;
  }
  .status-tekst {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .denktijd {
    flex: none;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 1px 8px;
    border-radius: 11px;
    background: var(--wit);
    color: var(--chip-inkt, var(--tekst-zacht));
    font-size: 0.72rem;
    font-weight: 800;
  }
  /* Jij bent aan de beurt: de rij is goud. */
  .jouw .status {
    color: var(--inkt);
    font-weight: 800;
  }
  /* De Stenen van het Potje in een ring (Sterbord) of een vierkantje (Vierkant bord); een open plek
     is een ringetje. */
  .stippen {
    display: grid;
    grid-template-columns: repeat(2, 9px);
    gap: 5px;
    place-content: center;
    flex: none;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--wit);
  }
  .stippen.vierkant {
    border-radius: 14px;
  }
  .stippen.drie {
    grid-template-columns: repeat(3, 9px);
    gap: 3px;
  }
  .open {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1.5px var(--lijn-fel);
  }
  .pijl {
    flex: none;
    color: var(--tekst-stil);
  }
  @container (max-height: 150px) {
  }
  .leeg {
    flex: 1;
    min-height: 0;
    display: grid;
    place-items: center;
  }
  .leeg-tekst {
    margin: 0;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
  @keyframes rij-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .rijen li {
      animation: none;
    }
  }
</style>
