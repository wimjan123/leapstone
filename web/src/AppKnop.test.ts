import { cleanup, render, screen } from "@testing-library/svelte";
import { afterEach, expect, test, vi } from "vitest";
import AppKnop from "./AppKnop.svelte";
import { winkelsVoorToestel } from "./appknop";

const omgeving = vi.hoisted(() => ({ IS_APP: false }));
vi.mock("./omgeving", () => omgeving);

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const APP_STORE = "https://apps.apple.com/app/id6831230722";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=nl.leapstone.app";

const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36";
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1";
const IPAD = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.5 Safari/605.1.15"; // iPadOS 13+
const WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36";

function toon(ua: string, aanraakpunten = 0, isApp = false) {
  omgeving.IS_APP = isApp;
  vi.stubGlobal("navigator", { userAgent: ua, maxTouchPoints: aanraakpunten });
  render(AppKnop);
}

test("welke winkel hoort bij welk toestel", () => {
  expect(winkelsVoorToestel(ANDROID, 5)).toEqual(["play"]);
  expect(winkelsVoorToestel(IPHONE, 5)).toEqual(["apple"]);
  expect(winkelsVoorToestel(IPAD, 5)).toEqual(["apple"]);
  expect(winkelsVoorToestel(WINDOWS, 0)).toEqual(["apple", "play"]);
  expect(winkelsVoorToestel(IPAD, 0)).toEqual(["apple", "play"]); // een Mac met muis
});

test("op een Android-toestel staat alleen de knop van Google Play", () => {
  toon(ANDROID, 5);
  expect(screen.getByRole("link", { name: /Google Play/ }).getAttribute("href")).toBe(GOOGLE_PLAY);
  expect(screen.queryByRole("link", { name: /App Store/ })).toBeNull();
});

test("op een iPhone en een iPad staat alleen de knop van de App Store", () => {
  for (const [ua, punten] of [[IPHONE, 5], [IPAD, 5]] as const) {
    cleanup();
    toon(ua, punten);
    expect(screen.getByRole("link", { name: /App Store/ }).getAttribute("href")).toBe(APP_STORE);
    expect(screen.queryByRole("link", { name: /Google Play/ })).toBeNull();
  }
});

test("op een computer staan beide knoppen", () => {
  toon(WINDOWS);
  expect(screen.getByRole("link", { name: /App Store/ }).getAttribute("href")).toBe(APP_STORE);
  expect(screen.getByRole("link", { name: /Google Play/ }).getAttribute("href")).toBe(GOOGLE_PLAY);
});

test("in de bouwmodus van de app (Tauri) staat er geen knop", () => {
  for (const ua of [ANDROID, IPHONE, WINDOWS]) {
    cleanup();
    toon(ua, 5, true);
    expect(screen.queryAllByRole("link")).toEqual([]);
  }
});

test("als de web-app vanaf het beginscherm draait, staat er geen knop", () => {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q === "(display-mode: standalone)" }));
  toon(ANDROID, 5);
  expect(screen.queryAllByRole("link")).toEqual([]);
});
