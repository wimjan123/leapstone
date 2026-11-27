import { expect, test } from "vitest";
import { uitnodigingPadUitLink } from "./deeplink";

test("een uitnodigingslink geeft het pad voor het Uitnodiging-scherm", () => {
  expect(uitnodigingPadUitLink("https://leapstone.visser-william.workers.dev/uitnodiging/ABC123")).toBe("/uitnodiging/ABC123");
  expect(uitnodigingPadUitLink("https://leapstone.visser-william.workers.dev/andere/pagina")).toBeNull();
  expect(uitnodigingPadUitLink("geen link")).toBeNull();
});

test("een Uitnodiging van de eigen site (playleapstone.com) en een oude link van workers.dev geven allebei hetzelfde pad", () => {
  expect(uitnodigingPadUitLink("https://playleapstone.com/uitnodiging/ABC123")).toBe("/uitnodiging/ABC123");
  expect(uitnodigingPadUitLink("https://www.playleapstone.com/uitnodiging/ABC123/")).toBe("/uitnodiging/ABC123/");
  // /play/ is het spel zelf, geen Uitnodiging.
  expect(uitnodigingPadUitLink("https://playleapstone.com/play/")).toBeNull();
});
