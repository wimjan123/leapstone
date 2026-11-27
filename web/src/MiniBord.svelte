<script lang="ts">
  import { bordje, type Bordje, type Punt } from "./bordje";
  import { mengKleur, SPELER_KLEUREN, type Vorm } from "./spelers";
  import { GAT_DIEP, GAT_RAND } from "./steen";
  import LakSteen from "./LakSteen.svelte";

  // Een klein bord voor de menu's, een licht, zacht bord met gaatjes, de kampen
  // met een lichte tint en de Stenen als pionnen met een teken op de kop (rood ▲, blauw ■, groen ●, geel ◆,
  // paars ✚, zesde ○). `stenen={false}`: een leeg bord zonder kampen. `kralen={false}`: de kampen zonder Stenen
  // (de Spelers staan er dan als losse pion bovenop). `teken`: het bord verschijnt zacht en de Stenen
  // komen een voor een (alleen zonder "minder beweging").
  // Alleen versiering; de knop eromheen draagt de naam.
  let {
    vorm,
    aantal,
    stenen = true,
    kralen = true,
    teken = false,
    lak = false,
    bord = $bindable(),
  }: { vorm: Vorm; aantal: number; stenen?: boolean; kralen?: boolean; teken?: boolean; lak?: boolean; bord?: Bordje } = $props();

  const id = $props.id();
  const b = $derived(bordje(vorm, aantal));
  $effect.pre(() => {
    bord = b;
  });

  const r = (v: number) => v.toFixed(3);
  const afstand = (p: Punt) => Math.hypot(p.x - b.midden.x, p.y - b.midden.y);

  // De zes punten van de ster zijn de gaatjes het verst van het midden; twee driehoeken vormen het bord.
  const driehoeken = $derived.by(() => {
    if (vorm === "vierkant") return [];
    const max = Math.max(...b.gaten.map(afstand));
    const punten = b.gaten
      .filter((p) => afstand(p) > max - 0.05)
      .sort((p, q) => Math.atan2(p.y - b.midden.y, p.x - b.midden.x) - Math.atan2(q.y - b.midden.y, q.x - b.midden.x));
    const pad = (i: number[]) => i.map((k) => punten[k]).filter(Boolean).map((p) => `${r(p.x)},${r(p.y)}`).join(" ");
    return [pad([0, 2, 4]), pad([1, 3, 5])];
  });
  // Een rechthoek met ronde hoeken voor het Vierkant bord: het kader zonder de ruimte voor de schaduw.
  const vlak = $derived(b.kader);

  // De kampen: de bolle omhullende van de gaatjes die bij het begin van een Speler horen.
  function omhulsel(punten: Punt[]): string {
    const p = [...punten].sort((a, c) => a.x - c.x || a.y - c.y);
    if (p.length < 3) return "";
    const kruis = (o: Punt, a: Punt, c: Punt) => (a.x - o.x) * (c.y - o.y) - (a.y - o.y) * (c.x - o.x);
    const half = (rij: Punt[]) => {
      const uit: Punt[] = [];
      for (const q of rij) {
        while (uit.length >= 2 && kruis(uit[uit.length - 2], uit[uit.length - 1], q) <= 1e-6) uit.pop();
        uit.push(q);
      }
      uit.pop();
      return uit;
    };
    return [...half(p), ...half([...p].reverse())].map((q) => `${r(q.x)},${r(q.y)}`).join(" ");
  }
  const kampen = $derived(
    stenen
      ? Array.from({ length: aantal }, (_, s) => omhulsel(b.stenen.filter((x) => x.speler === s).map((x) => x.p)))
      : [],
  );

  // Het teken op de kop van elke Steen; donker op de lichte kleuren, wit op de andere.
  const lichtheid = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  };
</script>

<svg
  class="minibord"
  style="--gat-rand:{lak ? "#d6a93e" : GAT_RAND};--gat-diep:{lak ? "#1b0506" : GAT_DIEP}"
  class:teken
  class:lak
  viewBox="{b.kader.x} {b.kader.y} {b.kader.b} {b.kader.h}"
  aria-hidden="true"
  focusable="false"
>
  <defs>
    {#each SPELER_KLEUREN as k, s (k.naam)}
      <linearGradient id="{id}-l{s}" x1="0" x2="1">
        <stop offset="0" stop-color={mengKleur(k.kleur, 0.3)} />
        <stop offset="0.6" stop-color={k.kleur} />
        <stop offset="1" stop-color={mengKleur(k.kleur, -0.25)} />
      </linearGradient>
      <radialGradient id="{id}-k{s}" cx=".38" cy=".32" r=".8">
        <stop offset="0" stop-color={mengKleur(k.kleur, 0.5)} />
        <stop offset="0.55" stop-color={k.kleur} />
        <stop offset="1" stop-color={mengKleur(k.kleur, -0.25)} />
      </radialGradient>
      {#if lak}
      <g id="{id}-s{s}"><LakSteen speler={s} id="{id}-ls{s}" /></g>
      {:else}
      <g id="{id}-s{s}">
        <ellipse cx=".02" cy=".05" rx=".42" ry=".15" fill="#14204a" opacity=".22" />
        <ellipse cx="0" cy="-.06" rx=".4" ry=".15" fill={mengKleur(k.kleur, -0.3)} />
        <path d="M-.34 -.1 Q-.27 -.34 -.12 -.58 L.12 -.58 Q.27 -.34 .34 -.1 Z" fill="url(#{id}-l{s})" />
        <circle cx="0" cy="-.78" r=".29" fill="url(#{id}-k{s})" />
        <g transform="translate(0 -.78) scale(.56)" style="color:{lichtheid(k.kleur) > 0.55 ? '#14204a' : '#fff3dc'}" fill="currentColor">
          {#if s === 0}<path d="M0 -.3 L.29 .22 L-.29 .22 Z" />
          {:else if s === 1}<rect x="-.24" y="-.24" width=".48" height=".48" rx=".05" />
          {:else if s === 2}<circle r=".27" />
          {:else if s === 3}<path d="M0 -.32 L.28 0 L0 .32 L-.28 0 Z" />
          {:else if s === 4}<path d="M-.09 -.3H.09V-.09H.3V.09H.09V.3H-.09V.09H-.3V-.09H-.09Z" />
          {:else}<circle r=".25" fill="none" stroke="currentColor" stroke-width=".11" />{/if}
        </g>
      </g>
      {/if}
    {/each}
  </defs>

  <g class="plaat-boord">
    {#if vorm === "vierkant"}
      <rect x={r(vlak.x + 0.1)} y={r(vlak.y + 0.1)} width={r(vlak.b - 0.2)} height={r(vlak.h - 0.2)} rx="0.9" class="schaduw" transform="translate(.05 .32)" />
      <rect x={r(vlak.x + 0.1)} y={r(vlak.y + 0.1)} width={r(vlak.b - 0.2)} height={r(vlak.h - 0.2)} rx="0.9" class="wit" />
    {:else}
      <g class="schaduw" transform="translate(.05 .32)">
        {#each driehoeken as d (d)}<polygon points={d} />{/each}
      </g>
      <g class="wit">
        {#each driehoeken as d (d)}<polygon points={d} />{/each}
      </g>
    {/if}
  </g>
  {#if stenen && !lak}
    <g class="tinten">
      {#each kampen as p, s (s)}
        {#if p}<polygon points={p} fill={SPELER_KLEUREN[s].kleur} stroke={SPELER_KLEUREN[s].kleur} />{/if}
      {/each}
    </g>
  {/if}
  <g class="gaten">
    {#each b.gaten as p, i (i)}
      <circle cx={r(p.x)} cy={r(p.y)} r=".27" class="rand" />
      <circle cx={r(p.x)} cy={r(p.y - 0.03)} r=".23" class="kuil" />
    {/each}
  </g>
  {#if stenen && kralen}
    <g class="kampen">
      {#each [...b.stenen].sort((p, q) => p.p.y - q.p.y) as s, i (i)}
        <use class="steen" href="#{id}-s{s.speler}" x={r(s.p.x)} y={r(s.p.y)} style="--s:{s.speler};--d:{(afstand(s.p) / 8).toFixed(3)}" />
      {/each}
    </g>
  {/if}
</svg>

<style>
  .minibord {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .wit polygon,
  .wit {
    fill: #fff3dc;
    stroke: #fff3dc;
    stroke-width: 2.1;
    stroke-linejoin: round;
  }
  /* Rood lak (uiterlijk 1b, taak 188): een bord van diep rood lak met een rand van rood lak en goud. */
  .lak .wit polygon,
  .lak .wit {
    fill: #430a0c;
    stroke: #b2301c;
    stroke-width: 2.1;
  }
  .lak rect.wit {
    stroke-width: 0;
    stroke: none;
  }
  .lak .schaduw polygon,
  .lak .schaduw {
    fill: #000;
    stroke: #000;
    opacity: 0.4;
  }
  .schaduw polygon,
  .schaduw {
    fill: #14204a;
    stroke: #14204a;
    stroke-width: 2.1;
    stroke-linejoin: round;
    opacity: 0.22;
  }
  rect.wit,
  rect.schaduw {
    stroke-width: 0;
  }
  /* De tint van een kamp is de driehoek van het kamp met ronde hoeken. De groep draagt de doorzichtigheid, zodat
     vlak en rand samen één egale tint zijn (anders ligt de rand lichter en lijkt het een rechthoek). */
  .tinten {
    opacity: 0.16;
  }
  .tinten polygon {
    stroke-width: 0.88;
    stroke-linejoin: round;
  }
  .rand {
    fill: var(--gat-rand);
  }
  .kuil {
    fill: var(--gat-diep);
  }
  .steen {
    transform-box: fill-box;
    transform-origin: center bottom;
  }
  /* Tekenen: het bord komt zacht op, dan de gaatjes, dan de Stenen een voor een. */
  .teken .plaat-boord {
    animation: kom 500ms ease-out both;
  }
  .teken .gaten {
    animation: kom 500ms 200ms ease-out both;
  }
  .teken .steen {
    animation: steen 520ms calc(500ms + var(--s) * 90ms + var(--d) * 200ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes kom {
    from {
      opacity: 0;
    }
  }
  @keyframes steen {
    from {
      opacity: 0;
      transform: translateY(-0.5px) scale(0.3);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .teken .plaat-boord,
    .teken .gaten,
    .teken .steen {
      animation: none;
    }
  }
</style>
