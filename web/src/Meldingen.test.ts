import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Meldingen from "./Meldingen.svelte";
import { potjeIdUitPad } from "./online";
import { sleutelNaarBytes } from "./meldingen";

const ABONNEMENT = { endpoint: "https://push.example/abc", keys: { p256dh: "P", auth: "A" } };
let verzoeken: { url: string; init?: RequestInit }[];
let subscribe: ReturnType<typeof vi.fn>;
let abonnement: unknown;
let toestemming: NotificationPermission;
let serverHeeftPush: boolean;

function zetOp(opties: { ios?: boolean; standalone?: boolean } = {}) {
  verzoeken = [];
  abonnement = null;
  serverHeeftPush = true;
  subscribe = vi.fn(async () => (abonnement = { toJSON: () => ABONNEMENT, endpoint: ABONNEMENT.endpoint, unsubscribe: async () => (abonnement = null) }));
  vi.stubGlobal("PushManager", class {});
  vi.stubGlobal("Notification", {
    get permission() {
      return toestemming;
    },
    requestPermission: vi.fn(async () => toestemming),
  });
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: { ready: Promise.resolve({ pushManager: { getSubscription: async () => abonnement, subscribe } }) },
  });
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(opties.ios ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" : "Mozilla/5.0 (X11; Linux)");
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: !!opties.standalone && q.includes("standalone") }));
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      verzoeken.push({ url, init });
      if (url === "/api/push/sleutel") return serverHeeftPush ? Response.json({ sleutel: "AQID" }) : new Response("", { status: 404 });
      return Response.json({}, { status: 200 });
    }),
  );
}

beforeEach(() => {
  toestemming = "default";
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test("de knop vraagt toestemming, abonneert en stuurt het abonnement met de sleutel van de Speler", async () => {
  zetOp();
  render(Meldingen, { sleutel: "geheim" });
  const knop = await screen.findByRole("button", { name: "Turn on notifications" });
  toestemming = "granted";
  await fireEvent.click(knop);
  await screen.findByRole("button", { name: "Notifications are on" });
  expect(subscribe).toHaveBeenCalledOnce();
  expect(Array.from(subscribe.mock.calls[0][0].applicationServerKey)).toEqual([1, 2, 3]);
  const post = verzoeken.find((v) => v.url === "/api/push/abonnement")!;
  expect(post.init?.method).toBe("POST");
  expect(new Headers(post.init?.headers).get("Authorization")).toBe("Bearer geheim");
  expect(JSON.parse(post.init?.body as string)).toEqual(ABONNEMENT);
});

test("uitzetten meldt het af bij de server", async () => {
  zetOp();
  toestemming = "granted";
  abonnement = { toJSON: () => ABONNEMENT, endpoint: ABONNEMENT.endpoint, unsubscribe: async () => (abonnement = null) };
  render(Meldingen, { sleutel: "geheim" });
  await fireEvent.click(await screen.findByRole("button", { name: "Notifications are on" }));
  await screen.findByRole("button", { name: "Turn on notifications" });
  const del = verzoeken.find((v) => v.init?.method === "DELETE")!;
  expect(JSON.parse(del.init?.body as string)).toEqual({ endpoint: ABONNEMENT.endpoint });
});

test("staan Meldingen al aan, dan meldt de app het abonnement opnieuw aan (na herstel wist de server de oude)", async () => {
  zetOp();
  toestemming = "granted";
  abonnement = { toJSON: () => ABONNEMENT, endpoint: ABONNEMENT.endpoint, unsubscribe: async () => (abonnement = null) };
  render(Meldingen, { sleutel: "nieuw" });
  await screen.findByRole("button", { name: "Notifications are on" });
  await waitFor(() => expect(verzoeken.some((v) => v.url === "/api/push/abonnement")).toBe(true));
  const post = verzoeken.find((v) => v.url === "/api/push/abonnement")!;
  expect(post.init?.method).toBe("POST");
  expect(new Headers(post.init?.headers).get("Authorization")).toBe("Bearer nieuw");
  expect(JSON.parse(post.init?.body as string)).toEqual(ABONNEMENT);
  expect(subscribe).not.toHaveBeenCalled();
});

test("geblokkeerd: uitleg in plaats van een knop", async () => {
  zetOp();
  toestemming = "denied";
  render(Meldingen, { sleutel: "x" });
  await screen.findByText(/Notifications are blocked/);
  expect(screen.queryByRole("button")).toBeNull();
});

test("iPhone zonder beginscherm: uitleg over Zet op beginscherm", async () => {
  zetOp({ ios: true });
  render(Meldingen, { sleutel: "x" });
  await screen.findByText(/Add to Home Screen/);
  expect(screen.queryByRole("button")).toBeNull();
});

test("iPhone vanaf het beginscherm: gewone knop", async () => {
  zetOp({ ios: true, standalone: true });
  render(Meldingen, { sleutel: "x" });
  await screen.findByRole("button", { name: "Turn on notifications" });
});

test("server zonder push (404): geen knop, wel 'nog niet beschikbaar'", async () => {
  zetOp();
  serverHeeftPush = false;
  render(Meldingen, { sleutel: "x" });
  await waitFor(() => screen.getByText(/not available yet/));
  expect(screen.queryByRole("button")).toBeNull();
});

test("potjeIdUitPad leest alleen /potje/<getal>", () => {
  expect(potjeIdUitPad("/potje/12")).toBe(12);
  expect(potjeIdUitPad("/potje/12/")).toBe(12);
  expect(potjeIdUitPad("/potje/0")).toBeNull();
  expect(potjeIdUitPad("/potje/abc")).toBeNull();
  expect(potjeIdUitPad("/uitnodiging/x")).toBeNull();
});

test("sleutelNaarBytes leest base64url", () => {
  expect(Array.from(sleutelNaarBytes("-_8"))).toEqual([251, 255]);
});

test("codeUitPad loopt niet vast op een kapotte uitnodigingslink", async () => {
  const { codeUitPad } = await import("./online");
  expect(codeUitPad("/uitnodiging/ab%20c")).toBe("ab c");
  expect(() => codeUitPad("/uitnodiging/%")).not.toThrow();
  expect(codeUitPad("/uitnodiging/%")).toBe("%");
  expect(codeUitPad("/uitnodiging/%E0%A4%A")).toBe("%E0%A4%A");
});
