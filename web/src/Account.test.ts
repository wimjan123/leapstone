import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { NepServer } from "./nep-server";

// Het 3D-bord als nep: jsdom kent geen WebGL, en er is alleen nog de tafel (feature 251).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

let server: NepServer;

beforeEach(() => {
  server = new NepServer();
  const anna = server.voegSpelerToe("Anna");
  const ben = server.voegSpelerToe("Ben");
  // Een lopend Potje met Ben, dat doorgaat als Anna weg is.
  server.maakPotje([anna.speler_id, ben.speler_id], 2);
  localStorage.clear();
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: anna.speler_id, spelersnaam: anna.spelersnaam, sleutel: anna.sleutel }));
  localStorage.setItem("halma.chat.1", "3");
  history.replaceState(null, "", "/");
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function naarAccount() {
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Account" }));
}

test("het accountscherm toont de spelersnaam en een link naar het privacybeleid", async () => {
  await naarAccount();
  expect(await screen.findByRole("heading", { name: "Anna" })).toBeTruthy();
  const link = screen.getByRole("link", { name: "Privacy policy" }) as HTMLAnchorElement;
  expect(new URL(link.href).pathname).toBe("/privacy");
});

test("het accountscherm heeft een link naar de gebruiksregels", async () => {
  await naarAccount();
  const link = (await screen.findByRole("link", { name: "Terms of use" })) as HTMLAnchorElement;
  expect(new URL(link.href).pathname).toBe("/terms");
});

test("Delete account vraagt eerst om een bevestiging en doet niets als je bewaart", async () => {
  await naarAccount();
  await fireEvent.click(await screen.findByRole("button", { name: "Delete account" }));
  expect(screen.getByText("Delete your account?")).toBeTruthy();
  expect(server.verzoeken.some((v) => v.startsWith("DELETE"))).toBe(false);
  await fireEvent.click(await screen.findByRole("button", { name: "Keep my account" }));
  expect(screen.queryByText("Delete your account?")).toBeNull();
  expect(localStorage.getItem("halma.speler")).not.toBeNull();
});

test("na bevestigen is het account weg en sta je weer aan het begin zonder spelersnaam", async () => {
  await naarAccount();
  await fireEvent.click(await screen.findByRole("button", { name: "Delete account" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Delete my account" }));

  // Terug bij het begin.
  expect(await screen.findByRole("button", { name: "My games" })).toBeTruthy();
  expect(server.verzoeken).toContain("DELETE /api/spelers/mij");
  expect(localStorage.getItem("halma.speler")).toBeNull();
  expect(localStorage.getItem("halma.chat.1")).toBeNull();
  expect(server.spelers[0].spelersnaam).toBe("Deleted player");

  // Online vraagt nu opnieuw om een Spelersnaam.
  await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
  expect(await screen.findByRole("textbox", { name: "Choose a player name" })).toBeTruthy();
  await waitFor(() => expect(screen.getByRole("link", { name: "Privacy policy" })).toBeTruthy());
});

test("een fout van de server laat het account staan en toont de fout", async () => {
  await naarAccount();
  await fireEvent.click(await screen.findByRole("button", { name: "Delete account" }));
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ fout: "Something went wrong on the server" }), { status: 500 })));
  await fireEvent.click(await screen.findByRole("button", { name: "Delete my account" }));
  expect((await screen.findByRole("alert")).textContent).toBe("Something went wrong on the server");
  expect(localStorage.getItem("halma.speler")).not.toBeNull();
});

test("geblokkeerde Spelers staan in Account en zijn te deblokkeren", async () => {
  server.blokkades.set(1, new Set([2]));
  await naarAccount();
  const rij = await screen.findByRole("button", { name: /Blocked players/ });
  await waitFor(() => expect(rij.textContent).toContain("1"));
  await fireEvent.click(rij);
  expect(screen.getByRole("heading", { name: "Blocked" })).toBeTruthy();
  expect(screen.getByText("Ben")).toBeTruthy();

  await fireEvent.click(await screen.findByRole("button", { name: "Unblock Ben" }));
  await screen.findByText("No blocked players");
  expect(server.verzoeken).toContain("DELETE /api/blokkades/2");
  expect(server.heeftGeblokkeerd(1, 2)).toBe(false);

  // Terug naar Account.
  await fireEvent.click(await screen.findByRole("button", { name: "Account" }));
  expect(await screen.findByRole("heading", { name: "Anna" })).toBeTruthy();
});
