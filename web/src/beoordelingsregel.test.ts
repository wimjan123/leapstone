import { cleanup, render, screen } from "@testing-library/svelte";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

// De beoordelingsvraag: hooguit twee keer in 365 dagen, minstens vier maanden ertussen, alleen in de iPhone-app.
// En de rij "Rate Leapstone" in Account, alleen in de iPhone-app. Met een nepklok.
const ios = vi.hoisted(() => ({ aan: true }));
vi.mock("./meldingen", async (orig) => ({ ...(await orig<typeof import("./meldingen")>()), isIosApp: () => ios.aan }));
const invoke = vi.fn();
vi.mock("@tauri-apps/api/core", () => ({ invoke: (c: string) => invoke(c) }));

import Account from "./Account.svelte";
import { BEOORDEEL_LINK, vraagBeoordelingNaWinst, WACHTTIJD_MS } from "./beoordeling";

const VOORAF = new Date("2027-01-10T12:00:00Z");
const dagen = (n: number) => n * 24 * 60 * 60 * 1000;

beforeEach(() => {
  localStorage.clear();
  invoke.mockReset();
  invoke.mockResolvedValue(undefined);
  ios.aan = true;
  vi.useFakeTimers();
  vi.setSystemTime(VOORAF);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

async function winst() {
  vraagBeoordelingNaWinst();
  await vi.advanceTimersByTimeAsync(WACHTTIJD_MS + 100);
}
const vragen = () => invoke.mock.calls.filter((c) => c[0] === "vraag_beoordeling").length;
const naDagen = (n: number) => vi.setSystemTime(new Date(VOORAF.getTime() + dagen(n)));

test("na vier maanden vraagt een winst weer, daarvoor niet", async () => {
  await winst();
  naDagen(100); // ruim drie maanden
  await winst();
  expect(vragen()).toBe(1);
  naDagen(121); // 2027-01-10 + 4 maanden = 2027-05-10 = 120 dagen
  await winst();
  expect(vragen()).toBe(2);
});

test("nooit meer dan twee keer in 365 dagen", async () => {
  await winst(); // dag 0
  naDagen(125);
  await winst(); // dag 125
  expect(vragen()).toBe(2);
  naDagen(260); // meer dan vier maanden na de tweede, binnen 365 dagen na de eerste
  await winst();
  naDagen(364);
  await winst();
  expect(vragen()).toBe(2);
  naDagen(366); // de eerste valt uit de periode, de tweede (dag 125) nog niet: één plek vrij
  await winst();
  expect(vragen()).toBe(3);
  naDagen(367);
  await winst();
  expect(vragen()).toBe(3);
});

test("de oude sleutel telt als eerste vraag, ook na een update", async () => {
  localStorage.setItem("leapstone.beoordeling.gevraagd", new Date(VOORAF.getTime() - dagen(10)).toISOString());
  await winst();
  expect(vragen()).toBe(0); // 10 dagen geleden: te snel
  localStorage.setItem("leapstone.beoordeling.gevraagd", new Date(VOORAF.getTime() - dagen(130)).toISOString());
  await winst();
  expect(vragen()).toBe(1);
  expect(JSON.parse(localStorage.getItem("leapstone.beoordeling.vragen")!)).toHaveLength(2);
});

test("zonder werkende opslag vraagt niets", async () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("geen opslag");
  });
  await winst();
  expect(vragen()).toBe(0);
  vi.restoreAllMocks();
});

const accountProps = { spelersnaam: "Anna", sleutel: "k", terug: () => {}, verwijderd: () => {} };

test("Account: in de iPhone-app staat de rij Rate Leapstone, naar de App Store bij sterren geven", () => {
  vi.useRealTimers();
  stubFetch();
  render(Account, accountProps);
  const rij = screen.getByRole("link", { name: "Rate Leapstone" }) as HTMLAnchorElement;
  expect(rij.getAttribute("href")).toBe("itms-apps://apps.apple.com/app/id6831230722?action=write-review");
  expect(BEOORDEEL_LINK).toBe(rij.getAttribute("href"));
});

test("Account: buiten de iPhone-app staat de rij er niet", () => {
  vi.useRealTimers();
  stubFetch();
  ios.aan = false;
  render(Account, accountProps);
  expect(screen.queryByText("Rate Leapstone")).toBeNull();
});

function stubFetch() {
  vi.stubGlobal("fetch", vi.fn(async () => new Response("[]", { status: 200, headers: { "content-type": "application/json" } })));
}
