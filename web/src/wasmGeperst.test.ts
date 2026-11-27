import { describe, expect, it, vi } from "vitest";
import { startWasm } from "./wasmGeperst";

const bestand = (status = 200, type = "application/x-xz") => new Response(new Uint8Array([1, 2, 3]), { status, headers: { "content-type": type } });
const ontpak = (b: ReadableStream<Uint8Array>) => b;

describe("startWasm", () => {
  it("pakt het xz-bestand en laat het gewone bestand dan met rust", async () => {
    const haal = vi.fn(async (_u: string) => bestand());
    const start = vi.fn(async (_r: Response | Promise<Response>) => {});
    await startWasm(start, "/a.wasm.xz", "/a.wasm", haal, ontpak);
    expect(haal).toHaveBeenCalledTimes(1);
    const r = start.mock.calls[0][0] as Response;
    expect(r.headers.get("content-type")).toBe("application/wasm");
    expect(new Uint8Array(await r.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
  });

  it("geeft het gewone bestand zonder xz-adres (de app)", async () => {
    const haal = vi.fn(async (_u: string) => bestand(200, "application/wasm"));
    const start = vi.fn(async (_r: Response | Promise<Response>) => {});
    await startWasm(start, undefined, "/a.wasm", haal, ontpak);
    expect(haal.mock.calls.map((c) => c[0])).toEqual(["/a.wasm"]);
    expect(start).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["een 404", () => bestand(404, "text/html")],
    ["een pagina in plaats van een bestand", () => bestand(200, "text/html; charset=utf-8")],
  ])("valt terug op het gewone bestand bij %s", async (_naam, antwoord) => {
    const haal = vi.fn(async (u: string) => (u.endsWith(".xz") ? antwoord() : bestand(200, "application/wasm")));
    const start = vi.fn(async (_r: Response | Promise<Response>) => {});
    await startWasm(start, "/a.wasm.xz", "/a.wasm", haal, ontpak);
    expect(haal.mock.calls.map((c) => c[0])).toEqual(["/a.wasm.xz", "/a.wasm"]);
    expect(start).toHaveBeenCalledTimes(1);
  });

  it("valt terug als het netwerk of het uitpakken faalt", async () => {
    const haal = vi.fn(async (u: string) => {
      if (u.endsWith(".xz")) throw new Error("netwerk");
      return bestand(200, "application/wasm");
    });
    const start = vi.fn(async (_r: Response | Promise<Response>) => {});
    await startWasm(start, "/a.wasm.xz", "/a.wasm", haal, ontpak);
    expect(start).toHaveBeenCalledTimes(1);

    // Het uitpakken breekt af tijdens het vertalen: start gooit bij het xz-antwoord, en lukt daarna met het gewone bestand.
    const haal2 = vi.fn(async (_u: string) => bestand());
    const start2 = vi.fn(async (r: Response | Promise<Response>) => { if ((await r).headers.get("content-type") === "application/wasm" && start2.mock.calls.length === 1) throw new Error("kapot xz"); });
    await startWasm(start2, "/a.wasm.xz", "/a.wasm", haal2, ontpak);
    expect(haal2.mock.calls.map((c) => c[0])).toEqual(["/a.wasm.xz", "/a.wasm"]);
    expect(start2).toHaveBeenCalledTimes(2);
  });
});
