/**
 * Een letter die krimpt tot de tekst in zijn vak past (taak 284, break-ui). Voor tekst die nooit afgekapt mag worden: een getal
 * ("2,093" in een tegel van My stats), een woord dat niet midden in breekt ("Datenschutzerklärung"), of een titel van twee regels op
 * een plaat van vaste hoogte (het winstscherm). De tekst zelf blijft heel; alleen de letter wordt kleiner.
 *
 * Hoe: het element krijgt `--krimp` (1 is de gewone maat); zijn CSS rekent de lettermaat daarmee uit, zoals
 * `font-size: calc(2.4rem * var(--krimp, 1))`. `krimp` meet of de inhoud breder (of hoger) is dan het vak en zoekt de grootste
 * `--krimp` waarbij hij past, niet kleiner dan `min`. Het vak zelf moet een maat hebben die niet van de letter afhangt (een cel van
 * een raster, een flex-kind met `flex: 1`, een plaat met een vaste hoogte), anders groeit het vak mee en is er niets te meten.
 */

/**
 * De grootste `--krimp` tussen `min` en 1 waarbij de tekst past (`past(k)`), in `stappen` keer halveren. Een kleinere letter past
 * altijd minstens zo goed (minder regels, smaller); evenredig terugrekenen werkt niet, want met een kleinere letter breekt de tekst
 * anders af (drie regels worden er twee). Past ook `min` niet, dan `min`.
 */
export function zoekKrimp(past: (krimp: number) => boolean, min: number, stappen = 7): number {
  if (past(1)) return 1;
  let laag = min, hoog = 1;
  for (let i = 0; i < stappen; i++) {
    const k = (laag + hoog) / 2;
    if (past(k)) laag = k;
    else hoog = k;
  }
  return laag;
}

/**
 * Svelte-attachment (`{@attach krimp()}`): houdt `--krimp` op het element bij. Meet opnieuw als het vak een andere maat krijgt, de tekst
 * verandert of de lettertypen geladen zijn. `min`: kleiner wordt de letter niet (dan steekt de tekst toch uit). `hoog`: ook de hoogte
 * telt (een plaat van vaste hoogte); anders alleen de breedte, want de cijfers van een groot getal steken een fractie boven hun
 * regel uit en dat is geen te hoge tekst.
 */
export function krimp(min = 0.5, hoog = false) {
  return (el: HTMLElement) => {
    if (typeof ResizeObserver === "undefined" || typeof MutationObserver === "undefined") return;
    let weg = false;
    let vorige = "";
    const pas = () => {
      if (weg) return;
      const past = (k: number) => {
        el.style.setProperty("--krimp", String(k));
        return el.scrollWidth <= el.clientWidth + 0.5 && (!hoog || el.scrollHeight <= el.clientHeight + 0.5);
      };
      el.style.setProperty("--krimp", String(zoekKrimp(past, min)));
      vorige = `${el.clientWidth}x${el.clientHeight}`;
    };
    // Alleen opnieuw als het vak echt een andere maat kreeg: de hoogte van een vak dat met zijn tekst meegroeit, verandert door het
    // krimpen zelf, en dat mag niet opnieuw tot krimpen leiden.
    const ro = new ResizeObserver(() => `${el.clientWidth}x${el.clientHeight}` !== vorige && pas());
    ro.observe(el);
    const mo = new MutationObserver(pas);
    mo.observe(el, { childList: true, characterData: true, subtree: true });
    void document.fonts?.ready.then(pas);
    pas();
    return () => {
      weg = true;
      ro.disconnect();
      mo.disconnect();
    };
  };
}
