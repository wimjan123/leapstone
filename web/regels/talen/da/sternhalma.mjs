// Den danske side "Hvad er Sternhalma?" (opgave 134): navnet og forholdet til Halma og kinaskak.
// Indhold og kilder: den engelske side ../en/sternhalma.mjs (Wikipedia Halma og Chinese checkers, se dér). Sætning for sætning på dansk.
// Bevidst udeladt, som på engelsk: hvem der udgav Stern-Halma i 1892 (kilderne er uenige) og patentår.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Hvad navnet betyder</h2>
      <p>Sternhalma er det tyske navn for Halma spillet på et stjerneformet bræt. <em>Stern</em> er tysk for stjerne. Navnet Chinese checkers (kinaskak) er det samme spil under et navn, der blev givet senere i USA.</p>
      <p>I Leapstone er det <strong>stjernebrættet</strong>: brættet i <a href="/da/regler/kinaskak">reglerne for kinaskak (Chinese checkers)</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Hvor det kommer fra</h2>
      <ul>
        <li><strong>Halma</strong> blev opfundet i 1883 eller 1884 af George Howard Monks, en amerikansk kirurg. Navnet er græsk for &bdquo;spring&ldquo;. Det spilles på et firkantet bræt. <a href="/da/regler/halma">Læs reglerne for Halma</a>.</li>
        <li><strong>Stern-Halma</strong> udkom i Tyskland i 1892: den samme idé på et bræt formet som en stjerne med seks spidser.</li>
        <li><strong>Chinese checkers</strong> er det navn, Bill og Jack Pressman gav spillet i USA i 1928, først som &bdquo;Hop Ching checkers&ldquo;. Spillet har ingen historisk forbindelse til Kina, og det er ikke et damspil.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Hvordan spillene er forskellige</h2>
      <ul>
        <li><strong>Halma:</strong> et firkantet bræt på 16 gange 16 felter, for 2 eller 4 spillere. En brik har otte nabofelter, ligeud og diagonalt. Med 2 spillere har hver 19 brikker, med 4 spillere 13.</li>
        <li><strong>Sternhalma og kinaskak:</strong> et stjernebræt med 121 felter, for 2, 3, 4 eller 6 spillere. En brik har seks nabofelter. Alle har 10 brikker.</li>
        <li><strong>Resten er ens:</strong> et skridt til et frit nabofelt eller et hop over én brik, med kæder af hop. Den første spiller, der fylder lejren på den anden side af brættet, vinder.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varianter, og hvad Leapstone gør</h2>
      <p>Halma er blevet spillet på mere end én måde. Sådan adskiller Leapstone sig fra de varianter, vi fandt i vores kilder:</p>
      <ul>
        <li><strong>Brætstørrelse.</strong> Halma spilles også på bræt på 8 gange 8 og 10 gange 10. Leapstone har kun brættet på 16 gange 16.</li>
        <li><strong>At forlade målet.</strong> I én Halma-regel må en brik, der er kommet ind i modstanderens lejr, ikke forlade den igen. Leapstone har ikke denne regel: Du kan flytte sådan en brik igen.</li>
        <li><strong>Tre spillere på en stjerne.</strong> Et gammelt Halma for tre spillere på et stjernebræt beskrives med 15 brikker hver. Leapstone spiller 3 spillere på stjernebrættet med 10 brikker hver.</li>
        <li><strong>Hop er dit valg.</strong> Du behøver aldrig at hoppe. Du vælger selv det felt, hvor dit træk slutter.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Spil det i Leapstone</h2>
      <p>Spil nu åbner et spil på stjernebrættet mod computeren. Til det firkantede bræt skal du trykke på tilbagepilen øverst og vælge Firkantet bræt i menuen.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Stjernebrættet med 10 røde brikker i den nederste spids og 10 blå brikker i den øverste spids",
  tekst: "Stjernebrættet til 2 spillere.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Hvad er Sternhalma? Halma på et stjernebræt | Leapstone",
  beschrijving: "Sternhalma er det tyske navn for Halma på et stjernebræt. Hvordan det hænger sammen med Halma og kinaskak, og hvordan du spiller det gratis i browseren.",
  h1: "Sternhalma, Halma og kinaskak",
  intro: "Tre navne for nært beslægtede spil. Hvad hvert af dem betyder, hvor de kommer fra, og hvordan de er forskellige.",
  inhoud,
};
