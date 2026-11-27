// Den danske guide Kinaskak for 3 spillere (opgave 299): /da/guider/kinaskak-for-tre-spillere.
// Reglerne kommer fra crates/halma-core (se den engelske guide, opgave 139). Indhold: den engelske guide ../en/chinese-checkers-3-players.mjs, sætning for sætning på dansk.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Sådan starter spillet</h2>
      <p>Hver spiller har 10 brikker, så der står 30 brikker på et bræt med 121 felter. De starter i hver anden spids af stjernen: rød nederst, blå øverst til venstre og grøn øverst til højre. De tre spidser imellem er tomme.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Stjernebrættet med 10 røde brikker i den nederste spids, 10 blå brikker i spidsen øverst til venstre og 10 grønne brikker i spidsen øverst til højre",
  tekst: "Rød nederst, blå øverst til venstre, grøn øverst til højre.",
})}
      <p>Spiller 1, rød, går først. Derefter er blå spiller 2, grøn er spiller 3, og efter grøn er det rød igen. Et træk er ét skridt eller en kæde af hop med én brik. Se <a href="/da/regler/kinaskak">reglerne for kinaskak</a> for skridt og hop.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Tre mål, alle tomme i starten</h2>
      <p>Dit mål er spidsen overfor, hvor du startede, og med 3 spillere er den tom i starten. Det er den tomme spids mellem de to andre spilleres starter: røds mål er øverst, blås nederst til højre og grøns nederst til venstre.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Stjernebrættet for tre spillere. Stiplede cirkler i hver spillers farve markerer de tre tomme mål: rød øverst, blå nederst til højre, grøn nederst til venstre.",
  tekst: "Hvert mål har sin spillers farve.",
})}
      <p>Du vinder ved at flytte alle 10 af dine brikker ind i dit mål. Alle 10 felter skal have dine egne brikker. Ingen starter i dit mål, men du må stoppe på ethvert tomt felt, så en anden spillers brik kan lande der senere. Så længe den står der, kan du ikke blive færdig.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">At vinde, og hvad der sker bagefter</h2>
      <ul>
        <li><strong>Vinde:</strong> Den første spiller, der fylder målet, vinder. Spillet stopper ikke der: de to andre spiller videre om de næste pladser, og en spiller, der er færdig, bliver sprunget over. Spillet er slut, når der kun er én spiller tilbage.</li>
        <li><strong>Give op:</strong> Dine brikker forlader brættet, og de to andre spiller videre. Hvis en anden spiller giver op, før nogen er blevet færdig, vinder den sidste spiller, der er tilbage.</li>
        <li><strong>Tid (online):</strong> I et onlinespil har hvert træk en tidsgrænse, som spilleren, der starter spillet, bestemmer. Når din tid løber ud, bliver din tur sprunget over. Hvis du misser 3 ture i træk, giver du op, og spillet fortsætter uden dig.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Hvordan det er anderledes end et spil for 2</h2>
      <ul>
        <li><strong>Flere brikker:</strong> 30 på brættet mod 20 med 2 spillere.</li>
        <li><strong>Tomme mål:</strong> Med 2 spillere starter dit mål fuldt af den anden spillers brikker. Med 3 er det tomt i starten.</li>
        <li><strong>To modstandere:</strong> Efter dit træk flytter to andre spillere, før det igen er din tur. Begges brikker er trædesten for dig, og dine for dem. En stige, du bygger, kan bruges af begge, og spilleren efter dig får første chance.</li>
        <li><strong>Spillet fortsætter:</strong> Med 2 spillere slutter spillet, når en af jer er færdig. Med 3 fortsætter det om anden- og tredjepladsen.</li>
      </ul>
      <p>Om spillet for to kan du læse <a href="/da/guider/kinaskak-for-to-spillere">Kinaskak for 2 spillere</a>. <a href="/da/guider/kinaskak-strategi">Strategitipsene</a> handler om skridt og hop, som er de samme med 3 spillere.</p>
      <p><a href="/da/guider/kinaskak-online-med-venner">Kinaskak online med venner</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Hvor du kan spille med 3 spillere i Leapstone</h2>
      <ul>
        <li><strong>Mod computeren, lige nu:</strong> Åbn <a href="/play/">Leapstone i din browser</a>, tryk på Computer, vælg stjernebrættet og 2 computere. Du er spiller 1, så du går først. Du vælger Let, Normal eller Svær til computerne.</li>
        <li><strong>På én telefon:</strong> Tryk på »På denne telefon«, vælg stjernebrættet og 3 spillere, og tryk derefter på en brik for at skifte den plads mellem et menneske og en computer.</li>
        <li><strong>Online med venner:</strong> Tryk på Venner, vælg stjernebrættet, 3 spillere og tiden pr. træk, og send invitationslinket. Spillet starter, når alle 3 pladser er taget.</li>
        <li><strong>Hurtige spil:</strong> Spil online finder spil for 2 eller 4 spillere, så der er intet hurtigt spil for 3.</li>
      </ul>
    </section>`;

export default {
  nav: "Kinaskak for 3 spillere",
  titel: "Kinaskak for 3 spillere: regler | Leapstone",
  beschrijving: "Sådan fungerer kinaskak med 3 spillere: hvor de 30 brikker starter, hvilken tom spids der er hver spillers mål, og hvordan du vinder.",
  h1: "Kinaskak for 3 spillere",
  intro: "Sådan fungerer et spil for tre på stjernebrættet: opstillingen, de tre mål, hvem der går først, hvordan du vinder, og hvor du kan spille det.",
  inhoud,
};
