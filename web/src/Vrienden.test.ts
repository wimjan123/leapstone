import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { NepServer } from "./nep-server";
import { toonVriendcode } from "./online";

// Het 3D-bord als nep: jsdom kent geen WebGL, en er is alleen nog de tafel (feature 251).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

// Friends kijkt elke 3 seconden naar een antwoord; in de tests elke 40 milliseconden.
vi.mock("./online", async (orig) => ({ ...(await orig<typeof import("./online")>()), UITDAGING_POLL_MS: 40 }));

let server: NepServer;

beforeEach(() => {
  server = new NepServer();
  const anna = server.voegSpelerToe("Anna");
  const ben = server.voegSpelerToe("Ben");
  const cas = server.voegSpelerToe("Cas");
  const dre = server.voegSpelerToe("Dré");
  // Anna speelde eerst met Ben, later met Cas, en tegen Dré alleen een Snel potje.
  server.maakPotje([anna.speler_id, ben.speler_id], 2);
  server.maakPotje([anna.speler_id, cas.speler_id], 2);
  const snel = server.maakPotje([anna.speler_id, dre.speler_id], 2);
  snel.snel = true;
  localStorage.clear();
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: anna.speler_id, spelersnaam: anna.spelersnaam, sleutel: anna.sleutel }));
  history.replaceState(null, "", "/");
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function naarVrienden() {
  render(App);
  // De tegel Friends in het hoofdmenu opent de Vriendenlijst meteen (taak 166).
  await fireEvent.click(await screen.findByRole("button", { name: "Play online with friends" }));
}

test("de Vriendcode wordt als twee groepen van vier cijfers getoond", () => {
  expect(toonVriendcode("48210937")).toBe("4821 0937");
});

test("Friends toont jouw Vriendcode en de tegenstanders uit eerdere Uitnodigingen, de laatste eerst, met hun Rating", async () => {
  await naarVrienden();
  const code = await screen.findByTestId("vriendcode");
  expect(code.textContent).toMatch(/^\d{4} \d{4}$/);
  const lijst = await screen.findByRole("list", { name: "Friends" });
  const rijen = within(lijst).getAllByRole("listitem");
  // Cas speelde het laatst; Dré (Snel potje) staat er niet in.
  expect(rijen.map((r) => r.querySelector(".naam")?.textContent)).toEqual(["Cas", "Ben"]);
  expect(rijen[0].textContent).toContain("1000");
  expect(screen.queryByText("Dré")).toBeNull();
});

test("de tegel Friends opent de Vriendenlijst; Back brengt je terug naar het hoofdmenu", async () => {
  await naarVrienden();
  await screen.findByTestId("vriendcode");
  await fireEvent.click(await screen.findByRole("button", { name: "Back" }));
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
});

test("de Vriendcode staat niet op andere schermen", async () => {
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
  await screen.findByRole("button", { name: "Friends" });
  expect(screen.queryByTestId("vriendcode")).toBeNull();
  expect(document.body.textContent).not.toMatch(/\d{4} \d{4}/);
});

test("Copy friend code zet de Vriendcode op het klembord", async () => {
  const schrijf = vi.fn(() => Promise.resolve());
  // Het klembord op de echte navigator van de test: een kopie van navigator (Object.create) gooit een fout zodra iets een
  // andere eigenschap leest, zoals de winkelknop die naar het toestel kijkt (taak 267).
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: schrijf } });
  try {
    await naarVrienden();
    const code = (await screen.findByTestId("vriendcode")).textContent;
    await fireEvent.click(await screen.findByRole("button", { name: "Copy friend code" }));
    await waitFor(() => expect(schrijf).toHaveBeenCalledWith(code));
    expect(await screen.findByText("Copied")).toBeTruthy();
  } finally {
    delete (navigator as { clipboard?: unknown }).clipboard;
  }
});

test("een naam weghalen haalt hem uit de lijst en vraagt de server erom", async () => {
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Remove Cas from your friends" }));
  // Eerst een vraag met de Spelersnaam (taak 234): niets is nog weggehaald.
  expect(await screen.findByRole("heading", { name: "Remove Cas?" })).toBeTruthy();
  expect(server.verzoeken).not.toContain("DELETE /api/vrienden/3");
  await fireEvent.click(screen.getByRole("button", { name: "Yes, remove" }));
  await waitFor(() => expect(screen.queryByText("Cas")).toBeNull());
  expect(screen.getByText("Ben")).toBeTruthy();
  expect(server.verzoeken).toContain("DELETE /api/vrienden/3");
});

test("bij de vraag houdt No, keep de vriend", async () => {
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Remove Cas from your friends" }));
  await fireEvent.click(await screen.findByRole("button", { name: "No, keep" }));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(screen.getByText("Cas")).toBeTruthy();
  expect(server.verzoeken).not.toContain("DELETE /api/vrienden/3");
});

/** Een tweede telefoon: dezelfde nep-server, een andere Speler. */
function alsSpeler(naam: string) {
  const s = server.spelers.find((x) => x.spelersnaam === naam)!;
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: s.speler_id, spelersnaam: s.spelersnaam, sleutel: s.sleutel }));
}

async function typCode(code: string) {
  const veld = await screen.findByLabelText("Friend code");
  await fireEvent.input(veld, { target: { value: code } });
}

test("Add friend: je typt de Vriendcode, ziet de Spelersnaam, tikt Add, en de ander keurt goed", async () => {
  const eva = server.voegSpelerToe("Eva");
  const evaCode = server.vriendcodeVan(eva.speler_id);
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Add friend" }));
  // Met een spatie ertussen, zoals de Vriendcode op het scherm staat; pas bij acht cijfers verschijnt de naam.
  await typCode(evaCode.slice(0, 7));
  expect(screen.queryByTestId("gevonden")).toBeNull();
  await typCode(`${evaCode.slice(0, 4)} ${evaCode.slice(4)}`);
  const gevonden = await screen.findByTestId("gevonden");
  expect(gevonden.textContent).toContain("Eva");
  await fireEvent.click(within(gevonden).getByRole("button", { name: "Add" }));
  expect(await screen.findByText("Friend request sent to Eva.")).toBeTruthy();
  expect(server.verzoeken).toContain("POST /api/vrienden/verzoeken");
  // Eva is nog niet in de lijst van Anna.
  expect(within(screen.getByRole("list", { name: "Friends" })).queryByText("Eva")).toBeNull();
  cleanup();

  // Op de tweede telefoon (Eva): het verzoek staat in Friends; goedkeuren zet Anna in de lijst.
  alsSpeler("Eva");
  await naarVrienden();
  const verzoeken = await screen.findByRole("list", { name: "Friend requests" });
  expect(within(verzoeken).getByText("Anna")).toBeTruthy();
  await fireEvent.click(screen.getByRole("button", { name: "Approve the friend request from Anna" }));
  await waitFor(() => expect(screen.queryByRole("list", { name: "Friend requests" })).toBeNull());
  expect(within(await screen.findByRole("list", { name: "Friends" })).getByText("Anna")).toBeTruthy();
  cleanup();

  // En Anna ziet Eva nu ook.
  alsSpeler("Anna");
  await naarVrienden();
  const lijst = await screen.findByRole("list", { name: "Friends" });
  expect(within(lijst).getByText("Eva")).toBeTruthy();
});

test("Decline haalt het verzoek weg; de aanvrager merkt niets en kan het nog eens sturen zonder dat de ander het ziet", async () => {
  const eva = server.voegSpelerToe("Eva");
  const anna = server.spelers.find((s) => s.spelersnaam === "Anna")!;
  server.vriendverzoeken.push({ van: anna.speler_id, naar: eva.speler_id, geweigerd: false });
  alsSpeler("Eva");
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Decline the friend request from Anna" }));
  await waitFor(() => expect(screen.queryByRole("list", { name: "Friend requests" })).toBeNull());
  expect(server.verzoeken).toContain(`DELETE /api/vrienden/verzoeken/${anna.speler_id}`);
  cleanup();

  // Anna: geen spoor van de weigering; ze krijgt hetzelfde antwoord als de eerste keer.
  alsSpeler("Anna");
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Add friend" }));
  await typCode(server.vriendcodeVan(eva.speler_id));
  await fireEvent.click(within(await screen.findByTestId("gevonden")).getByRole("button", { name: "Add" }));
  expect(await screen.findByText("Friend request sent to Eva.")).toBeTruthy();
  expect(screen.queryByText(/declined|refused/i)).toBeNull();
  cleanup();
  alsSpeler("Eva");
  await naarVrienden();
  await screen.findByRole("button", { name: "Add friend" });
  expect(screen.queryByRole("list", { name: "Friend requests" })).toBeNull();
});

test("een onbekende Vriendcode geeft de foutmelding van de server en geen Add-knop", async () => {
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Add friend" }));
  await typCode("00000000");
  expect((await screen.findByRole("alert")).textContent).toBe("Unknown friend code");
  expect(screen.queryByRole("button", { name: "Add" })).toBeNull();
});

test("een geblokkeerde Speler is niet toe te voegen, in beide richtingen", async () => {
  const eva = server.voegSpelerToe("Eva");
  const anna = server.spelers.find((s) => s.spelersnaam === "Anna")!;
  server.blokkades.set(eva.speler_id, new Set([anna.speler_id]));
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Add friend" }));
  await typCode(server.vriendcodeVan(eva.speler_id));
  expect((await screen.findByRole("alert")).textContent).toBe("Unknown friend code");
  expect(screen.queryByTestId("gevonden")).toBeNull();
});

test("wie al je vriend is, krijgt geen Add-knop", async () => {
  const ben = server.spelers.find((s) => s.spelersnaam === "Ben")!;
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Add friend" }));
  server.nieuweVrienden.set(1, new Set([ben.speler_id]));
  await typCode(server.vriendcodeVan(ben.speler_id));
  expect((await screen.findByTestId("gevonden")).textContent).toContain("Ben is already your friend.");
  expect(screen.queryByRole("button", { name: "Add" })).toBeNull();
});

/** Een verzoek aan de nep-server als een andere Speler (de tweede telefoon). */
function alsAnder(naam: string, pad: string, methode = "GET", body?: unknown) {
  const sp = server.spelers.find((x) => x.spelersnaam === naam)!;
  return server.fetch(pad, {
    method: methode,
    headers: { Authorization: `Bearer ${sp.sleutel}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
}

test("Challenge: kies een vriend, het bord en de Denktijd; de vriend kiest Accept en jullie spelen", async () => {
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Challenge Ben" }));
  // Hetzelfde als bij een nieuw Potje: het bord en de Denktijd.
  await fireEvent.click(screen.getByRole("button", { name: "Square board" }));
  await fireEvent.click(screen.getByRole("radio", { name: /15 seconds per move/ }));
  await fireEvent.click(await screen.findByRole("button", { name: "Send challenge" }));
  expect(await screen.findByTestId("uitdaging-wacht")).toBeTruthy();
  expect(screen.getByTestId("uitdaging-wacht").textContent).toBe("Waiting for Ben…");
  expect(server.uitdagingen).toMatchObject([{ van: 1, naar: 2, bord: "vierkant", denktijd_s: 15, status: "open" }]);
  // Zolang de Uitdaging openstaat, kan Anna Ben niet nog eens uitdagen; Cas wel.
  await waitFor(() => expect((screen.getByRole("button", { name: "Challenge Ben" }) as HTMLButtonElement).disabled).toBe(true));
  expect((screen.getByRole("button", { name: "Challenge Cas" }) as HTMLButtonElement).disabled).toBe(false);

  // Ben (de tweede telefoon) kiest Accept: Anna komt vanzelf in het live Potje.
  expect((await accepteerAlsBen()).status).toBe(200);
  expect(await screen.findByTestId("denktijd-badge")).toBeTruthy();
  expect(screen.queryByTestId("uitdaging-wacht")).toBeNull();
  expect(screen.queryByTestId("vriendcode")).toBeNull();
  const potje = server.potjes.find((p) => p.potje_id === server.uitdagingen[0].potje_id)!;
  expect(potje).toMatchObject({ bord: "vierkant", spelers: [1, 2], denktijd_s: 15 });
});

async function accepteerAlsBen() {
  return alsAnder("Ben", `/api/uitdagingen/${server.uitdagingen[0].id}/accepteren`, "POST");
}

test("Decline van de vriend geeft de uitdager 'Not now', en daarna kan hij weer uitdagen", async () => {
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Challenge Ben" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Send challenge" }));
  await screen.findByTestId("uitdaging-wacht");
  await alsAnder("Ben", `/api/uitdagingen/${server.uitdagingen[0].id}`, "DELETE");
  const nietNu = await screen.findByTestId("niet-nu");
  expect(nietNu.textContent).toBe("Ben: Not now");
  expect(screen.queryByTestId("uitdaging-wacht")).toBeNull();
  expect((screen.getByRole("button", { name: "Challenge Ben" }) as HTMLButtonElement).disabled).toBe(false);
});

test("zonder antwoord binnen 5 minuten ziet de uitdager 'Not now'", async () => {
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Challenge Cas" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Send challenge" }));
  await screen.findByTestId("uitdaging-wacht");
  // De klok van de server loopt 5 minuten verder.
  const nu = Date.now();
  server.nu = () => nu + 5 * 60 * 1000;
  expect((await screen.findByTestId("niet-nu")).textContent).toBe("Cas: Not now");
  expect(server.uitdagingen[0].status).toBe("open");
});

test("een tweede Uitdaging aan dezelfde vriend wordt door de server geweigerd (409) en de app toont de fout", async () => {
  await naarVrienden();
  await fireEvent.click(await screen.findByRole("button", { name: "Challenge Ben" }));
  // Een tweede telefoon van Anna daagt Ben uit terwijl dit scherm openstaat.
  await alsAnder("Anna", "/api/uitdagingen", "POST", { vriend_id: 2, bord: "ster", denktijd_s: null });
  await fireEvent.click(await screen.findByRole("button", { name: "Send challenge" }));
  expect(await screen.findByText("You already challenged this friend")).toBeTruthy();
  expect(server.uitdagingen).toHaveLength(1);
});

test("een Uitdaging aan jou toont 'challenges you' met Accept en Decline; Accept start het Potje", async () => {
  await alsAnder("Anna", "/api/uitdagingen", "POST", { vriend_id: 2, bord: "ster", denktijd_s: 30 });
  alsSpeler("Ben");
  await naarVrienden();
  const lijst = await screen.findByRole("list", { name: "Challenges" });
  // De naam staat apart in de zin (taak 284), maar de zin leest als geheel.
  expect(lijst.querySelector(".zin")?.textContent).toBe("Anna challenges you");
  expect(lijst.textContent).toContain("30 seconds per move");
  await fireEvent.click(within(lijst).getByRole("button", { name: "Accept: Anna" }));
  expect(await screen.findByTestId("denktijd-badge")).toBeTruthy();
  expect(server.uitdagingen[0]).toMatchObject({ status: "accepted" });
  expect(server.potjes.at(-1)).toMatchObject({ spelers: [1, 2], denktijd_s: 30 });
});

test("Decline haalt de Uitdaging uit de lijst en vraagt de server erom", async () => {
  await alsAnder("Anna", "/api/uitdagingen", "POST", { vriend_id: 2, bord: "vierkant", denktijd_s: null });
  alsSpeler("Ben");
  await naarVrienden();
  const lijst = await screen.findByRole("list", { name: "Challenges" });
  expect(lijst.textContent).toContain("No time limit");
  await fireEvent.click(within(lijst).getByRole("button", { name: "Decline: Anna" }));
  await waitFor(() => expect(screen.queryByRole("list", { name: "Challenges" })).toBeNull());
  expect(server.uitdagingen[0].status).toBe("declined");
  expect(server.verzoeken).toContain("DELETE /api/uitdagingen/1");
});

test("een Uitdaging die tijdens het kijken binnenkomt, verschijnt vanzelf in de lijst", async () => {
  alsSpeler("Ben");
  await naarVrienden();
  await screen.findByRole("list", { name: "Friends" });
  expect(screen.queryByRole("list", { name: "Challenges" })).toBeNull();
  await alsAnder("Anna", "/api/uitdagingen", "POST", { vriend_id: 2, bord: "ster", denktijd_s: 60 });
  expect((await screen.findByRole("list", { name: "Challenges" })).querySelector(".zin")?.textContent).toBe("Anna challenges you");
});

test("een Uitdaging van jou die openstaat, blijft zichtbaar na terugkomen in Friends", async () => {
  await alsAnder("Anna", "/api/uitdagingen", "POST", { vriend_id: 2, bord: "ster", denktijd_s: 30 });
  await naarVrienden();
  expect((await screen.findByTestId("uitdaging-wacht")).textContent).toBe("Waiting for Ben…");
  expect((screen.getByRole("button", { name: "Challenge Ben" }) as HTMLButtonElement).disabled).toBe(true);
});

// Taak 164: twee tot vijf vrienden tegelijk uitdagen.

/** Vijf vrienden voor Anna (Ben en Cas staan er al): Dré, Eva en Fay erbij; Gus is een zesde. */
function meerVrienden() {
  const anna = server.spelers.find((s) => s.spelersnaam === "Anna")!;
  for (const naam of ["Eva", "Fay", "Gus"]) {
    const sp = server.voegSpelerToe(naam);
    server.maakPotje([anna.speler_id, sp.speler_id], 2);
  }
  const dre = server.spelers.find((s) => s.spelersnaam === "Dré")!;
  server.maakVrienden(anna.speler_id, dre.speler_id);
}

const idVan = (naam: string) => server.spelers.find((s) => s.spelersnaam === naam)!.speler_id;
const vink = (naam: string) => fireEvent.click(screen.getByRole("checkbox", { name: `Select ${naam}` }));
const accepteerAls = (naam: string, groep = 1) => {
  const rij = server.uitdagingen.find((u) => u.groep === groep && u.naar === idVan(naam))!;
  return alsAnder(naam, `/api/uitdagingen/${rij.id}/accepteren`, "POST");
};
const wijsAfAls = (naam: string, groep = 1) => {
  const rij = server.uitdagingen.find((u) => u.groep === groep && u.naar === idVan(naam))!;
  return alsAnder(naam, `/api/uitdagingen/${rij.id}`, "DELETE");
};

async function dagUit(namen: string[]) {
  await naarVrienden();
  await screen.findByRole("list", { name: "Friends" });
  for (const n of namen) await vink(n);
  await fireEvent.click(await screen.findByTestId("groep-uitdagen"));
  await fireEvent.click(await screen.findByRole("button", { name: "Send challenge" }));
  await screen.findByTestId("uitdaging-wacht");
}

test("twee namen aanvinken en Challenge: een Uitdaging voor drie Spelers, en bij twee keer Accept spelen jullie met drie", async () => {
  await naarVrienden();
  await screen.findByRole("list", { name: "Friends" });
  expect(screen.getByText("Tick 2 to 5 friends to challenge them together.")).toBeTruthy();
  await vink("Ben");
  expect(screen.queryByTestId("groep-uitdagen")).toBeNull();
  await vink("Cas");
  const knop = await screen.findByTestId("groep-uitdagen");
  expect(knop.textContent?.trim()).toBe("Challenge the selected friends (2)");
  await fireEvent.click(knop);
  // Hetzelfde scherm als bij één vriend, met het aantal Spelers; drie Spelers kan alleen op het Sterbord.
  expect(screen.getByTestId("uitdaging-spelers").textContent).toBe("Players: 3");
  expect((screen.getByRole("button", { name: "Square board" }) as HTMLButtonElement).disabled).toBe(true);
  expect(screen.getByRole("button", { name: "Star board" }).getAttribute("aria-pressed")).toBe("true");
  await fireEvent.click(await screen.findByRole("button", { name: "Send challenge" }));
  expect((await screen.findByTestId("uitdaging-wacht")).textContent).toBe("Waiting for Cas, Ben…");
  expect(server.uitdagingen).toMatchObject([
    { van: 1, naar: 3, aantal: 3, groep: 1, status: "open" },
    { van: 1, naar: 2, aantal: 3, groep: 1, status: "open" },
  ]);
  // Beide vrienden zijn nu bezet: je kunt ze niet nog eens uitdagen of aanvinken.
  await waitFor(() => expect((screen.getByRole("button", { name: "Challenge Ben" }) as HTMLButtonElement).disabled).toBe(true));
  expect((screen.getByRole("checkbox", { name: "Select Cas" }) as HTMLInputElement).disabled).toBe(true);

  // Ben accepteert: nog geen Potje; Anna ziet wie al meedoet.
  expect((await accepteerAls("Ben")).status).toBe(200);
  expect((await screen.findByTestId("uitdaging-geaccepteerd")).textContent).toBe("Accepted: Ben");
  expect(server.potjes.some((p) => p.aantal_spelers === 3)).toBe(false);
  // Cas accepteert: het Potje met drie Spelers begint voor Anna.
  expect((await accepteerAls("Cas")).status).toBe(200);
  expect(await screen.findByTestId("denktijd-badge")).toBeTruthy();
  const potje = server.potjes.at(-1)!;
  expect(potje).toMatchObject({ bord: "ster", aantal_spelers: 3, spelers: [1, 3, 2] });
  expect(screen.queryByTestId("vriendcode")).toBeNull();
});

test("Ben ziet 'challenges you' voor drie Spelers, wacht na Accept op Cas en komt dan in het Potje", async () => {
  await alsAnder("Anna", "/api/uitdagingen", "POST", { vriend_ids: [2, 3], bord: "ster", denktijd_s: 30 });
  alsSpeler("Ben");
  await naarVrienden();
  const lijst = await screen.findByRole("list", { name: "Challenges" });
  expect(lijst.textContent).toContain("Anna challenges you");
  expect(lijst.textContent).toContain("Players: 3");
  await fireEvent.click(within(lijst).getByRole("button", { name: "Accept: Anna" }));
  expect((await screen.findByTestId("uitdaging-wacht-vriend")).textContent).toBe("You accepted. Waiting for the other friends…");
  expect(screen.queryByRole("list", { name: "Challenges" })).toBeNull();
  await accepteerAls("Cas");
  expect(await screen.findByTestId("denktijd-badge")).toBeTruthy();
  expect(server.potjes.at(-1)).toMatchObject({ aantal_spelers: 3, spelers: [1, 2, 3], denktijd_s: 30 });
});

test("een tweede telefoon die niet meer door hoeft: trekt de uitdager in, dan ziet wie accepteerde dat het niet doorgaat", async () => {
  await alsAnder("Anna", "/api/uitdagingen", "POST", { vriend_ids: [2, 3], bord: "ster", denktijd_s: null });
  alsSpeler("Ben");
  await naarVrienden();
  await fireEvent.click(within(await screen.findByRole("list", { name: "Challenges" })).getByRole("button", { name: "Accept: Anna" }));
  await screen.findByTestId("uitdaging-wacht-vriend");
  await alsAnder("Anna", "/api/uitdagingen/1", "DELETE");
  expect((await screen.findByTestId("uitdaging-afgelast")).textContent).toBe("The challenge was called off.");
});

test("na een Decline kiest de uitdager: beginnen met wie accepteerde", async () => {
  meerVrienden();
  await dagUit(["Ben", "Cas", "Dré"]);
  expect(server.uitdagingen).toHaveLength(3);
  await accepteerAls("Cas");
  await wijsAfAls("Ben");
  const keuze = await screen.findByTestId("uitdaging-keuze");
  expect(keuze.textContent).toContain("Not everyone joins");
  expect(within(keuze).getByTestId("uitdaging-geaccepteerd").textContent).toBe("Accepted: Cas");
  await fireEvent.click(within(keuze).getByRole("button", { name: "Start with the friends who accepted" }));
  expect(await screen.findByTestId("denktijd-badge")).toBeTruthy();
  // Een Potje van twee met Cas; Dré, die niet antwoordde, doet niet mee.
  expect(server.potjes.at(-1)).toMatchObject({ aantal_spelers: 2, spelers: [1, idVan("Cas")] });
  expect(server.verzoeken).toContain("POST /api/uitdagingen/1/start");
});

test("na een Decline kiest de uitdager: de lege plek vullen met een Computerspeler", async () => {
  await dagUit(["Ben", "Cas"]);
  await wijsAfAls("Ben");
  await accepteerAls("Cas");
  const keuze = await screen.findByTestId("uitdaging-keuze");
  await fireEvent.click(within(keuze).getByRole("button", { name: "Fill the empty spots with computer players" }));
  expect(await screen.findByTestId("denktijd-badge")).toBeTruthy();
  const potje = server.potjes.at(-1)!;
  expect(potje).toMatchObject({ aantal_spelers: 3 });
  expect(potje.spelers).toHaveLength(3);
  expect(potje.spelers.slice(0, 2)).toEqual([1, idVan("Cas")]);
});

test("kent het bord het aantal niet, dan kan de uitdager alleen vullen met Computerspelers", async () => {
  meerVrienden();
  await dagUit(["Ben", "Cas", "Dré", "Eva", "Fay"]);
  expect(server.uitdagingen[0].aantal).toBe(6);
  for (const n of ["Ben", "Cas", "Dré", "Eva"]) await accepteerAls(n);
  await wijsAfAls("Fay");
  const keuze = await screen.findByTestId("uitdaging-keuze");
  // Vijf Spelers (vier vrienden en Anna) kent geen bord.
  const beginnen = within(keuze).getByRole("button", { name: "Start with the friends who accepted" }) as HTMLButtonElement;
  expect(beginnen.disabled).toBe(true);
  expect(keuze.textContent).toContain("No board has a game for 5 players.");
  await fireEvent.click(within(keuze).getByRole("button", { name: "Fill the empty spots with computer players" }));
  expect(await screen.findByTestId("denktijd-badge")).toBeTruthy();
  expect(server.potjes.at(-1)!.spelers).toHaveLength(6);
});

test("zonder antwoord binnen 5 minuten kiest de uitdager; hij kan ook de hele Uitdaging annuleren", async () => {
  await dagUit(["Ben", "Cas"]);
  await accepteerAls("Ben");
  const nu = Date.now();
  server.nu = () => nu + 5 * 60 * 1000;
  const keuze = await screen.findByTestId("uitdaging-keuze");
  expect(within(keuze).getByTestId("uitdaging-geaccepteerd").textContent).toBe("Accepted: Ben");
  await fireEvent.click(within(keuze).getByRole("button", { name: "Cancel challenge" }));
  await waitFor(() => expect(screen.queryByTestId("uitdaging-keuze")).toBeNull());
  expect(server.uitdagingen).toHaveLength(0);
  await waitFor(() => expect((screen.getByRole("button", { name: "Challenge Ben" }) as HTMLButtonElement).disabled).toBe(false));
});

test("hooguit vijf vrienden aanvinken, en vier vrienden (vijf Spelers) heeft geen bord", async () => {
  meerVrienden();
  await naarVrienden();
  await screen.findByRole("list", { name: "Friends" });
  for (const n of ["Ben", "Cas", "Dré", "Eva"]) await vink(n);
  expect(screen.queryByTestId("groep-uitdagen")).toBeNull();
  expect(screen.getByTestId("groep-geen-bord").textContent).toBe("No board has a game for 5 players.");
  await vink("Fay");
  expect((await screen.findByTestId("groep-uitdagen")).textContent?.trim()).toBe("Challenge the selected friends (5)");
  // Een zesde naam kan niet.
  expect((screen.getByRole("checkbox", { name: "Select Gus" }) as HTMLInputElement).disabled).toBe(true);
  await fireEvent.click(screen.getByTestId("groep-uitdagen"));
  // Zes Spelers: alleen het Sterbord.
  expect((screen.getByRole("button", { name: "Square board" }) as HTMLButtonElement).disabled).toBe(true);
});

test("een geblokkeerde vriend is niet uit te dagen in een groep: de server weigert de hele Uitdaging", async () => {
  await naarVrienden();
  await screen.findByRole("list", { name: "Friends" });
  await vink("Ben");
  await vink("Cas");
  server.blokkades.set(idVan("Cas"), new Set([1]));
  server.vriendenWeg.set(1, new Set([idVan("Cas")]));
  await fireEvent.click(await screen.findByTestId("groep-uitdagen"));
  await fireEvent.click(await screen.findByRole("button", { name: "Send challenge" }));
  expect(await screen.findByText("Unknown player")).toBeTruthy();
  expect(server.uitdagingen).toHaveLength(0);
});
