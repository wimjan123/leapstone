<script lang="ts">
  import LakSteen from "./LakSteen.svelte";
  import { SPELER_KLEUREN } from "./spelers";

  // Het winstscherm als tafel (taak 180, uiterlijk 1b): een klein medaillon van lak met gouden rand, de lak-Steen van de winnaar
  // met een kroon, en confetti die één keer naar beneden valt (alleen zonder "minder beweging"). Alleen versiering; de naam staat
  // in de uitslag eronder, en het eindbord blijft zichtbaar.
  let { speler }: { speler: number } = $props();

  // Vaste stukjes (geen toeval), verdeeld over de breedte, in de kleuren van de Stenen, goud en crème.
  const KLEUREN = [...SPELER_KLEUREN.map((k) => k.kleur), "#d6a93e", "#fff3dc"];
  const STUKJES = Array.from({ length: 34 }, (_, i) => ({
    x: (i * 37 + 11) % 100,
    kleur: KLEUREN[i % KLEUREN.length],
    rond: i % 3 === 0,
    draai: (i * 53) % 180,
    wacht: (i % 9) * 90,
    duur: 1800 + ((i * 131) % 1400),
    maat: 7 + (i % 4) * 2,
  }));
</script>

<div class="podium lak" aria-hidden="true">
  <div class="confetti">
    {#each STUKJES as s, i (i)}
      <i
        class:rond={s.rond}
        style="left:{s.x}%;width:{s.maat}px;height:{s.rond ? s.maat : s.maat * 1.8}px;background:{s.kleur};--r:{s.draai}deg;animation-delay:{s.wacht}ms;animation-duration:{s.duur}ms"
      ></i>
    {/each}
  </div>
  <span class="grond"></span>
  <span class="winnaar">
    <svg class="kroon" width="76" height="52" viewBox="0 0 76 52" focusable="false">
      <path d="M6 44 L2 12 L22 28 L38 4 L54 28 L74 12 L70 44 Z" fill="#f6c945" stroke="#d9a31e" stroke-width="2" stroke-linejoin="round" />
      <circle cx="38" cy="14" r="3.5" fill="#fff3dc" opacity=".8" />
    </svg>
    <svg class="lak-steen" viewBox="-0.62 -0.86 1.24 1.0" width="84" height="68" focusable="false"><LakSteen {speler} id="medaillon" /></svg>
  </span>
</div>

<style>
  /* Het medaillon van lak: donkerrood lak, een gouden rand en een lichte glans. */
  .lak .grond {
    width: 124px;
    background: radial-gradient(circle at 34% 28%, #8a2318 0, #5a0f0a 45%, #240504 100%);
    box-shadow: 0 0 0 5px #d9a93e, 0 0 0 7px #7a5316, 0 8px 14px rgb(0 0 0 / 0.5);
    translate: -50% -50%;
  }
  .lak .winnaar {
    margin-top: 0;
  }
  .lak .kroon {
    width: 46px;
    height: auto;
    margin-bottom: -6px;
    margin-top: -26px;
  }
  .lak .lak-steen {
    margin-top: 4px;
  }
  .podium {
    position: relative;
    flex: none;
    margin-top: auto;
    height: min(300px, 40dvh);
    display: grid;
    place-items: center;
  }
  .grond {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(220px, 62vw);
    aspect-ratio: 1;
    translate: -50% -46%;
    border-radius: 50%;
    background: var(--wit);
    box-shadow: 0 10px 0 rgb(31 58 130 / 0.15);
    animation: schijf 520ms var(--uit) both;
  }
  .winnaar {
    position: relative;
    display: grid;
    justify-items: center;
    margin-top: -8px;
    animation: landen 760ms 120ms var(--uit) both;
  }
  .kroon {
    margin-bottom: -22px;
    z-index: 1;
    animation: kroon 600ms 700ms var(--uit) both;
  }
  /* Over het hele scherm; het valt één keer en is dan weg. */
  .confetti {
    position: fixed;
    inset: 0;
    z-index: 3;
    overflow: hidden;
    pointer-events: none;
  }
  .confetti i {
    position: absolute;
    top: -24px;
    border-radius: 2px;
    opacity: 0;
    transform: rotate(var(--r));
    animation: val ease-in both;
  }
  .confetti i.rond {
    border-radius: 50%;
  }
  @keyframes val {
    0% {
      opacity: 0;
      transform: translateY(0) rotate(var(--r));
    }
    10% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(105dvh) rotate(calc(var(--r) + 300deg));
    }
  }
  @keyframes schijf {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
  }
  @keyframes landen {
    from {
      opacity: 0;
      transform: translateY(-28px);
    }
  }
  @keyframes kroon {
    from {
      opacity: 0;
      transform: translateY(-14px) rotate(-8deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .grond,
    .winnaar,
    .kroon {
      animation: none;
    }
    .confetti i {
      animation: none;
      opacity: 0.9;
      top: calc(6% + var(--r) / 3.6);
    }
  }
</style>
