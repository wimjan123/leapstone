<script lang="ts">
  import MiniBord from "./MiniBord.svelte";
  import { t } from "./taal.svelte";
  import type { Vorm } from "./spelers";

  // Kies het bord door op het bord zelf te tikken. `kies` hoort het meteen (voor de volgende stap).
  // Met `aantal` tonen de borden de kampen van zoveel Spelers (het Vierkant bord: 2 of 4).
  let {
    vorm = $bindable(),
    kies,
    toonKeuze = false,
    aantal,
    uit = [],
    lak = false,
  }: { vorm: Vorm; kies?: (v: Vorm) => void; toonKeuze?: boolean; aantal?: number; uit?: Vorm[]; lak?: boolean } = $props();

  const stenenOp = (b: { v: Vorm; aantal: number }) =>
    aantal === undefined ? b.aantal : b.v === "vierkant" ? (aantal >= 4 ? 4 : 2) : aantal;

  const BORDEN: { v: Vorm; naam: "board.star" | "board.square"; aantal: number }[] = [
    { v: "ster", naam: "board.star" as const, aantal: 6 },
    { v: "vierkant", naam: "board.square" as const, aantal: 4 },
  ];
</script>

<div class="borden" class:keuze={toonKeuze} role="group" aria-label={t("board.which")}>
  {#each BORDEN as b (b.v)}
    <button
      class="bord-tegel"
      class:plaat={lak && !toonKeuze}
      class:aan={vorm === b.v}
      aria-pressed={vorm === b.v}
      disabled={uit.includes(b.v)}
      aria-label={t(b.naam)}
      onclick={() => {
        vorm = b.v;
        kies?.(b.v);
      }}
    >
      <span class="vak">
        <span class="tekening" class:vierkant={b.v === "vierkant"}><MiniBord vorm={b.v} aantal={stenenOp(b)} {lak} /></span>
      </span>
      {#if !toonKeuze}<span class="naam" aria-hidden="true">{t(b.naam)}</span>{/if}
    </button>
  {/each}
</div>

<style>
  .borden {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 12px;
  }
  /* Een bord op de tafel; bij een keuze heeft het gekozen bord een donkere rand en een lichte achtergrond. */
  .bord-tegel {
    position: relative;
    min-height: 0;
    padding: 14px;
    display: grid;
    border-radius: 32px;
    background: transparent;
  }
  .vak {
    container-type: size;
    min-height: 0;
    display: grid;
    place-items: center;
  }
  .tekening {
    display: block;
    width: min(100cqw, 100cqh * 0.884);
    transition:
      opacity 220ms ease-out,
      transform 320ms var(--uit);
  }
  .tekening.vierkant {
    width: min(100cqw, 100cqh);
  }
  /* Bord kiezen in uiterlijk 1b: elk bord ligt op een plaat van porselein met een gouden rand, met zijn naam eronder (zoals de
     platen op de 3D-tafel). */
  .bord-tegel {
    grid-template-rows: minmax(0, 1fr) auto;
  }
  .naam {
    padding-top: 6px;
    font-weight: 700;
    font-size: 1.1rem;
    text-align: center;
  }
  .plaat {
    padding: 12px 14px 10px;
    border-radius: 22px;
    background: radial-gradient(120% 90% at 30% 20%, #fffaf0, #efe8d6);
    border: 1.5px solid #c9a95a;
    box-shadow:
      inset 0 0 0 5px #efe8d6,
      inset 0 0 0 6.5px rgb(38 67 138 / 0.55),
      0 4px 0 #7a6a44,
      0 10px 18px rgb(0 0 0 / 0.35);
    color: #1f3a82;
  }
  .plaat:active {
    transform: translateY(2px);
    box-shadow:
      inset 0 0 0 5px #efe8d6,
      inset 0 0 0 6.5px rgb(38 67 138 / 0.55),
      0 2px 0 #7a6a44,
      0 6px 12px rgb(0 0 0 / 0.3);
  }
  .bord-tegel:disabled {
    opacity: 0.3;
    pointer-events: none;
  }
  .bord-tegel:active .tekening {
    transform: scale(0.97);
  }
  .keuze .bord-tegel.aan {
    background: rgb(247 241 224 / 0.3);
    box-shadow: inset 0 0 0 3px var(--inkt);
  }
  .keuze .bord-tegel:not(.aan) .tekening {
    opacity: 0.55;
    transform: scale(0.94);
  }
  @media (prefers-reduced-motion: reduce) {
    .tekening {
      transition: none;
    }
  }
</style>
