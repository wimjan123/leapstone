import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

// De iPhone-app: Meldingen via APNs (Tauri-commando's) in plaats van web push.
vi.mock("./omgeving", () => ({ IS_APP: true, SERVER: "https://server.example", LINK_BASIS: "https://server.example" }));
const invoke = vi.fn();
vi.mock("@tauri-apps/api/core", () => ({ invoke: (c: string) => invoke(c) }));

import Meldingen from "./Meldingen.svelte";

const TOKEN = "ab".repeat(32);
let verzoeken: { url: string; init?: RequestInit }[];
let toestemming: string;

beforeEach(() => {
  verzoeken = [];
  toestemming = "prompt";
  localStorage.clear();
  invoke.mockReset();
  invoke.mockImplementation(async (c: string) => {
    if (c === "meldingen_toestemming") return toestemming;
    if (c === "apns_token") {
      if (toestemming === "prompt") toestemming = "granted";
      if (toestemming !== "granted") throw "denied";
      return { token: TOKEN, omgeving: "sandbox" };
    }
    throw new Error(`onbekend commando ${c}`);
  });
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X)");
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      verzoeken.push({ url, init });
      return new Response(null, { status: 204 });
    }),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const aanmeldingen = () => verzoeken.filter((v) => v.url === "https://server.example/api/push/apns" && v.init?.method === "POST");

test("nog nooit gevraagd: de app vraagt vanzelf en meldt het token aan bij de server", async () => {
  render(Meldingen, { sleutel: "geheim", klein: true });
  await screen.findByRole("button", { name: "Notifications are on" });
  expect(invoke).toHaveBeenCalledWith("apns_token");
  const [post] = aanmeldingen();
  expect(new Headers(post.init?.headers).get("Authorization")).toBe("Bearer geheim");
  expect(JSON.parse(post.init?.body as string)).toEqual({ token: TOKEN, omgeving: "sandbox" });
});

test("uitzetten meldt het token af en vraagt daarna niet vanzelf opnieuw", async () => {
  render(Meldingen, { sleutel: "geheim" });
  await fireEvent.click(await screen.findByRole("button", { name: "Notifications are on" }));
  await screen.findByRole("button", { name: "Turn on notifications" });
  const del = verzoeken.find((v) => v.init?.method === "DELETE")!;
  expect(del.url).toBe("https://server.example/api/push/apns");
  expect(JSON.parse(del.init?.body as string)).toEqual({ token: TOKEN });
  cleanup();
  invoke.mockClear();
  render(Meldingen, { sleutel: "geheim" });
  await screen.findByRole("button", { name: "Turn on notifications" });
  expect(invoke).not.toHaveBeenCalledWith("apns_token");
});

test("al aan: het token wordt opnieuw aangemeld (iOS kan het veranderen)", async () => {
  toestemming = "granted";
  localStorage.setItem("leapstone-apns-token", TOKEN);
  render(Meldingen, { sleutel: "geheim" });
  await screen.findByRole("button", { name: "Notifications are on" });
  await waitFor(() => expect(aanmeldingen()).toHaveLength(1));
});

test("geweigerd in iOS: uitleg in plaats van een knop", async () => {
  toestemming = "denied";
  render(Meldingen, { sleutel: "geheim" });
  await screen.findByText(/Notifications are blocked/);
  expect(screen.queryByRole("button")).toBeNull();
  expect(aanmeldingen()).toHaveLength(0);
});

test("uitzetten lukt niet bij de server: fout en de stand blijft aan", async () => {
  render(Meldingen, { sleutel: "geheim" });
  const aan = await screen.findByRole("button", { name: "Notifications are on" });
  (fetch as ReturnType<typeof vi.fn>).mockImplementation(async (url: string, init?: RequestInit) => {
    verzoeken.push({ url, init });
    return new Response(null, { status: init?.method === "DELETE" ? 500 : 204 });
  });
  await fireEvent.click(aan);
  await screen.findByText(/Could not turn on notifications/);
  expect(screen.getByRole("button", { name: "Notifications are on" })).toBeTruthy();
  expect(localStorage.getItem("leapstone-apns-uit")).toBeNull();
});

test("uitzetten zonder verbinding: fout en de stand blijft aan", async () => {
  render(Meldingen, { sleutel: "geheim" });
  const aan = await screen.findByRole("button", { name: "Notifications are on" });
  (fetch as ReturnType<typeof vi.fn>).mockImplementation(async (url: string, init?: RequestInit) => {
    if (init?.method === "DELETE") throw new TypeError("offline");
    verzoeken.push({ url, init });
    return new Response(null, { status: 204 });
  });
  await fireEvent.click(aan);
  await waitFor(() => expect(screen.getByRole("button", { name: "Notifications are on" })).toBeTruthy());
  expect(localStorage.getItem("leapstone-apns-uit")).toBeNull();
});
