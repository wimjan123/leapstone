// Guiden Spil kinaskak online med venner (opgave 304). Indhold: ../en/play-chinese-checkers-online-with-friends.mjs, teksten følger den engelske sætning for sætning.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Trinene, fra start til første træk</h2>
      <ol>
        <li><strong>Vælg et spillernavn.</strong> Det er alt, du skal bruge for at logge ind.</li>
        <li><strong>Opret et onlineparti.</strong> Vælg brættet, antallet af spillere og tid pr. træk.</li>
        <li><strong>Send invitationslinket.</strong> Del det fra venteværelset, eller kopiér det og indsæt det i en hvilken som helst chatapp.</li>
        <li><strong>Vent på, at alle åbner det.</strong> Når den sidste plads er taget, starter partiet, og du trækker først.</li>
      </ol>
      <p>Resten af siden forklarer hver del og hvad der sker, når en ven holder op med at spille.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Sådan virker invitationslinket</h2>
      <p>Et parti har ét invitationslink, og alle venner bruger det samme. Hver ven, der åbner det, tager den næste ledige plads. Du har oprettet partiet, så du er spiller 1 og tager den første plads.</p>
      <ul>
        <li><strong>Hvor mange pladser:</strong> på stjernebrættet har et parti 2, 3, 4 eller 6 spillere, og på det firkantede bræt 2 eller 4. Det vælger du, før du sender linket. Partiet starter ikke med tomme pladser, og der er intet træk, før den sidste plads er taget.</li>
        <li><strong>Venteværelset:</strong> mens du venter, viser venteværelset, hvem der er med, og hvor mange pladser der stadig er ledige. Det opdaterer sig selv, når en ven kommer med.</li>
        <li><strong>Deling:</strong> knappen “Invitation” åbner delemenuen på din telefon. Hvis den ikke er tilgængelig, kopierer den linket, og du kan selv indsætte det.</li>
        <li><strong>I browseren eller i appen:</strong> linket virker uden appen, i en browser. Hvis din ven har appen, kan linket åbne den.</li>
        <li><strong>Et fuldt eller ukendt link:</strong> når alle pladser er taget, viser linket, at partiet er fuldt. Et link, der ikke findes, viser, at invitationen er ukendt. I begge tilfælde skal du bede din ven om et nyt link.</li>
      </ul>
      <p>Linket gælder kun for dette parti. Det har 16 tilfældige tegn, så ingen kan gætte det, men alle, der får det, kan tage en ledig plads. Send det kun til dem, du vil spille med.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Ingen konto, kun et spillernavn</h2>
      <p>Du skal ikke bruge en e-mailadresse eller en adgangskode. Du vælger et spillernavn på 1 til 30 tegn, og de andre spillere ser det navn. Nogle grove navne bliver afvist, og så vælger du et andet.</p>
      <p>Når du har valgt et navn, viser appen en gendannelseskode på 20 tegn i fem grupper. Gem den. Hvis du får en ny telefon, indtaster du koden og får dit spillernavn tilbage. Uden koden kan du ikke få dit navn tilbage på en ny telefon.</p>
      <p>Dine venner gør det samme, når de åbner dit link: de vælger først et navn og kommer derefter med i dit parti.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Tid pr. træk: hvor længe en ven må tænke</h2>
      <p>Tid pr. træk er den længste tid, en spiller har til ét træk. Du indstiller den, når du opretter partiet, og den gælder for alle i det parti.</p>
      <ul>
        <li><strong>Mulighederne:</strong> 15 sekunder, 30 sekunder, 1 minut eller 2 minutter. Du kan også slå den fra, så der slet ikke er nogen grænse. Appen starter på 30 sekunder.</li>
        <li><strong>Uret:</strong> serveren holder tiden, så en telefon med forkert ur ændrer ikke på den. Appen viser, hvor meget tid der er tilbage.</li>
        <li><strong>Det første ur:</strong> det starter, når den sidste plads er taget. Før da er ingen på tid.</li>
        <li><strong>Et hurtigt parti:</strong> hvis du trykker på “Spil online” for at spille mod en fremmed, er tiden pr. træk fast 30 sekunder. Kun et parti med venner lader dig vælge.</li>
      </ul>
      <p>For venner, der spiller fra sofaen, er 2 minutter eller ingen grænse afslappet. Til et hurtigt parti vælger du 15 sekunder. Uden grænse kan et parti vente, så længe det skal, og du afslutter det, når du har tid.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Hvad der sker, når nogen falder fra</h2>
      <p>Et parti lever på serveren, ikke på en telefon. Hvis en ven lukker appen, mister forbindelsen eller falder i søvn, bliver partiet, hvor det er, og vennen finder det igen under “Mine partier”.</p>
      <ul>
        <li><strong>Tiden løber ud:</strong> den spillers tur bliver sprunget over. Der rykker intet på brættet, og den næste spiller er på tid.</li>
        <li><strong>Tre ture i træk:</strong> en spiller, der misser 3 ture i træk, giver selv op. Hvert træk, spilleren faktisk laver, sætter tallet tilbage til nul.</li>
        <li><strong>At give op:</strong> en spiller, der giver op, frivilligt eller efter 3 missede ture, får sine brikker fjernet fra brættet, så de ikke blokerer nogen.</li>
        <li><strong>Et parti for 2:</strong> partiet slutter, og den anden spiller vinder.</li>
        <li><strong>Et parti for 3, 4 eller 6:</strong> partiet fortsætter uden den spiller, der er væk, og turen går videre til den næste spiller, der stadig er med.</li>
        <li><strong>Ingen tid pr. træk:</strong> hvis du valgte ingen grænse, springer partiet aldrig en tur over. Det venter, til vennen kommer tilbage, eller til vennen giver op.</li>
      </ul>
      <p>Hvis du har slået notifikationer til, fortæller appen dig, når det er din tur, også når den er lukket. Slå dem til fra appen eller i indstillingerne på din telefon eller browser.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Efter partiet</h2>
      <p>Spillere, der spiller sammen via en invitation, bliver tilføjet til hinandens vennelister. Derfra kan du udfordre en ven til et nyt parti uden et nyt link. Dine åbne og afsluttede partier står under “Mine partier”.</p>
      <p>Ny med reglerne? Læs <a href="/da/regler/kinaskak">reglerne for kinaskak</a>. Spiller I to? Læs <a href="/da/guider/kinaskak-for-to-spillere">Kinaskak for 2 spillere</a>. Vil du vinde? Læs <a href="/da/guider/kinaskak-strategi">strategitipsene</a>.</p>
      <p><a href="/da/guider/kinaskak-for-tre-spillere">Kinaskak for 3 spillere</a></p>
    </section>`;

export default {
  nav: "Kinaskak online med venner",
  titel: "Spil kinaskak online med venner | Leapstone",
  beschrijving: "Spil kinaskak online med venner: send et invitationslink, indstil tiden pr. træk, og se, hvad der sker, hvis nogen falder fra.",
  h1: "Spil kinaskak online med venner",
  intro: "Opret et parti, send ét invitationslink, og spil, når alle er kommet med. Du skal kun bruge et spillernavn, og du indstiller selv tiden pr. træk.",
  inhoud,
};
