/**
 * De WebAssembly van het 3D-bord komt als `.wasm.xz` binnen (ongeveer 3,2 MB tegen 4,7 MB die Cloudflare zelf
 * overhoudt: het perst `.wasm` alleen met zstd niveau 3, en `.xz` niet nog eens). De browser pakt hem uit terwijl hij binnenkomt
 * en vertaalt hem meteen (`instantiateStreaming`). Geen eigen `Content-Encoding`: dat kan op Cloudflare Workers niet.
 * Lukt iets niet (geen `.xz` op de server, een browser zonder streams, een afgebroken download), dan komt het gewone `.wasm`.
 */

type Haal = (url: string) => Promise<Response>;
type Ontpak = (bron: ReadableStream<Uint8Array>) => ReadableStream<Uint8Array>;
type Start = (invoer: Response | Promise<Response>) => Promise<unknown>;

/** De uitpakker is een eigen stuk JavaScript (met kleine WebAssembly erin): alleen halen als de `.xz` echt komt. */
const ontpakXz: Ontpak = (bron) => {
  const uit = new TransformStream<Uint8Array, Uint8Array>();
  void import("xz-decompress").then(
    ({ XzReadableStream }) => new XzReadableStream(bron).pipeTo(uit.writable),
    (fout) => uit.writable.abort(fout),
  );
  return uit.readable;
};

/**
 * Start de WebAssembly via `start` (wasm-bindgen: `m.default`). `xzUrl` leeg (de app, een dev-server): meteen het gewone bestand.
 * `haal` en `ontpak` zijn er voor de test.
 */
export async function startWasm(
  start: Start,
  xzUrl: string | undefined,
  gewoonUrl: string,
  haal: Haal = (u) => fetch(u),
  ontpak: Ontpak = ontpakXz,
  /** Het geperste bestand is helemaal binnen: de lijn is vrij, het vertalen loopt nog. */
  binnen: () => void = () => {},
): Promise<void> {
  if (xzUrl) {
    try {
      const antwoord = await haal(xzUrl);
      // Een 404-pagina of een andere vorm dan een bestand is geen xz: dan het gewone bestand.
      if (antwoord.ok && antwoord.body && !(antwoord.headers.get("content-type") ?? "").includes("html")) {
        // `instantiateStreaming` eist dit type op de Response.
        const geteld = antwoord.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({ flush: binnen }));
        const wasm = new Response(ontpak(geteld), { headers: { "content-type": "application/wasm" } });
        await start(wasm);
        return;
      }
    } catch {
      // Door naar het gewone bestand.
    }
  }
  await start(haal(gewoonUrl));
}
