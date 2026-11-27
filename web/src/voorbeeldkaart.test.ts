import { describe, expect, it } from "vitest";
import spel from "../play/index.html?raw";
import { uitnodigingHtml } from "../uitnodigingskaart";
import plaatje from "../public/uitnodiging.png?inline";

// De Worker geeft op /uitnodiging/<code> een kopie van web/play/index.html met een vaste voorbeeldkaart (WhatsApp e.d.).
const html = uitnodigingHtml(spel);
const tag = (naam: string) => new RegExp(`<meta (?:property|name)="${naam}" content="([^"]*)"`).exec(html)?.[1];

describe("voorbeeldkaart van de Uitnodiging", () => {
  it("laat /play/ zijn eigen titel voor Google", () => {
    const speltag = (naam: string) => new RegExp(`<meta (?:property|name)="${naam}" content="([^"]*)"`).exec(spel)?.[1];
    expect(/<title>([^<]*)<\/title>/.exec(spel)?.[1]).toBe("Play Chinese checkers online | Leapstone");
    expect(speltag("og:title")).toBe("Play Chinese checkers online");
    expect(speltag("description")).toMatch(/Chinese checkers/);
    expect(speltag("og:description")).toMatch(/Chinese checkers/);
    expect(html).toContain("noindex");
  });

  it("heeft vaste Open Graph- en Twitter-tags", () => {
    expect(tag("og:title")).toBe("Join my game of Chinese checkers");
    expect(tag("og:description")).toBe("Play Leapstone with me, in the app or in your browser.");
    expect(tag("og:type")).toBe("website");
    expect(tag("og:image")).toBe("https://playleapstone.com/uitnodiging.png");
    expect(tag("og:image:width")).toBe("1200");
    expect(tag("og:image:height")).toBe("630");
    expect(tag("twitter:card")).toBe("summary_large_image");
  });

  it("noemt geen Spelersnaam of code van een Potje", () => {
    const tekst = [...html.matchAll(/<meta (?:property|name)="(?:og|twitter):[^"]*" content="([^"]*)"/g)].map((m) => m[1]).join(" ");
    expect(tekst).not.toMatch(/\{|\$|%|[A-Z0-9]{4}-[A-Z0-9]{4}/);
  });

  it("wijst naar een plaatje van 1200x630 onder de 300 KB", () => {
    const png = Uint8Array.from(atob(plaatje.split(",")[1]), (c) => c.charCodeAt(0));
    const kop = new DataView(png.buffer);
    expect(String.fromCharCode(...png.subarray(1, 4))).toBe("PNG");
    expect(kop.getUint32(16)).toBe(1200);
    expect(kop.getUint32(20)).toBe(630);
    expect(png.length).toBeLessThan(300_000);
  });
});
