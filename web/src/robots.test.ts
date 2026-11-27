import { expect, test } from "vitest";
import robots from "../public/robots.txt?raw";

const BOTS = [
  "GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bytespider", "CCBot",
  "Meta-ExternalAgent", "Amazonbot", "cohere-ai", "DuckAssistBot", "MistralAI-User",
];

function blokken(): Map<string, string[]> {
  const uit = new Map<string, string[]>();
  for (const blok of robots.split(/\n\s*\n/)) {
    const regels = blok.split("\n").filter((r) => r.trim() && !r.startsWith("#"));
    const agent = regels.find((r) => r.startsWith("User-agent:"));
    if (agent) uit.set(agent.slice("User-agent:".length).trim(), regels.filter((r) => !r.startsWith("User-agent:")));
  }
  return uit;
}

test("elke AI-bot heeft een eigen blok met Allow: / en dezelfde Disallow-regels als *", () => {
  const b = blokken();
  const alle = b.get("*");
  expect(alle).toContain("Allow: /");
  const disallow = alle!.filter((r) => r.startsWith("Disallow:"));
  expect(disallow).toEqual(["Disallow: /api/", "Disallow: /beheer", "Disallow: /uitnodiging/", "Disallow: /potje/", "Disallow: /uitnodiging-kaart/"]);
  for (const bot of BOTS) {
    const regels = b.get(bot);
    expect(regels, bot).toBeDefined();
    expect(regels, bot).toContain("Allow: /");
    expect(regels!.filter((r) => r.startsWith("Disallow:")), bot).toEqual(disallow);
  }
});
