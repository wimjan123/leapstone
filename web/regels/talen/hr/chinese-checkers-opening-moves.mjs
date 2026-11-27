// Hrvatski vodič Otvaranja u kineskoj dami (taak 303, feature 294): /hr/vodici/kineska-dama-otvaranja.
// Sadržaj: engleski vodič ../en/chinese-checkers-opening-moves.mjs, rečenicu po rečenicu na hrvatskom. Svaki broj i svaki potez provjeren je prema
// crates/halma-core; slike dolaze iz crates/halma-core/examples/regelplaatjes.rs (odjeljak "taak 303").
// "Red" su sva polja jednako udaljena od tvojeg kraka: korak pomiče za 1 red, skok za 2. Bez izmišljenih "stručnjaka" i povijesti.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Tvoj prvi potez: 14 izbora</h2>
      <p>Na početku tvojih 10 figura ispunjava trokut u redovima od 4, 3, 2 i 1, a prednji red gleda prema sredini ploče. Unutar trokuta nema praznog polja, pa figura može ići samo u red neposredno ispred sebe. Tako ostaje 14 prvih poteza: svaka od 4 figure u prednjem redu može koraknuti na 2 polja (8 koraka), a svaka od 3 figure u drugom redu može preskočiti prednju figuru na 2 polja (6 skokova). Ostale 3 figure još se ne mogu pomaknuti.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Crveni krak dolje sa svojih 10 figura, a u redu neposredno ispred njega 5 praznih polja označenih prstenom.",
  tekst: "Svaki prvi potez završava na jednom od ovih 5 polja.",
})}
      <p>U ovom vodiču red je niz polja preko tvojeg kraka, paralelan s njegovim prednjim rubom, a napredak brojimo u redovima. Korak pomiče figuru naprijed za 1 red, a skok za 2 reda. Svaki igrač ima istih 14 prvih poteza, bilo da igra 2, 3, 4 ili 6 igrača i iz bilo kojeg kraka zvijezde, jer svaki krak iznutra izgleda isto.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Otvaranje 1: skoči van, pa oslobodi vrh</h2>
      <p>Figura na vrhu tvojeg kraka najdalja je od tvojeg cilja i na početku se ne može pomaknuti: može preskočiti figuru samo ako je polje iza te figure prazno. Skok iz drugog reda stvara upravo takvo polje.</p>
      <ol>
        <li><strong>Potez 1:</strong> figura na desnom kraju tvojeg drugog reda preskače figuru ispred sebe. Doskoči u red ispred tvojeg kraka i napreduje 2 reda.</li>
        <li><strong>Potez 2:</strong> figura na vrhu skače dvaput u jednom potezu: prvo na polje koje je potez 1 ispraznio, zatim preko figure drugog reda. Napreduje 4 reda.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Crveni krak nakon poteza 1. Figura na vrhu ima prsten, a 2 strelice s brojevima 1 i 2 prikazuju njezine skokove kroz ispražnjeno polje u red ispred kraka.",
  tekst: "Nakon poteza 1 figura s vrha iskače u 2 skoka.",
})}
      <p>To je 6 redova u 2 poteza. Isprobali smo sve načine da se odigraju 2 poteza, a 6 je najviše što možeš dobiti. Samo 4 para poteza to postižu: figura na bilo kojem kraju drugog reda skoči, u jednom od svoja 2 smjera, a figura s vrha slijedi. Figura u sredini drugog reda ne dolazi u obzir, jer drži vrh zatvorenim.</p>
      <p>Obje figure sada stoje u redu ispred tvojeg kraka s praznim poljem među sobom. To je prva prečka ljestava.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Otvaranje 2: 4 poteza s 4 različite figure</h2>
      <p>U 4 poteza najviše možeš dobiti 13 redova, a to postižeš samo ako svaki potez koristi drugu figuru. Ovaj niz to postiže:</p>
      <ol>
        <li><strong>Potez 1:</strong> figura na desnom kraju prednjeg reda koraka naprijed. Dobiva 1 red.</li>
        <li><strong>Potez 2:</strong> figura na desnom kraju trećeg reda skače dvaput. Dobiva 4 reda.</li>
        <li><strong>Potez 3:</strong> figura na lijevom kraju drugog reda skače dvaput. Dobiva 4 reda.</li>
        <li><strong>Potez 4:</strong> figura na vrhu skače dvaput. Dobiva 4 reda.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Crveni krak na početku. 4 figure koje će se pomaknuti imaju broj od 1 do 4, redom kojim idu potezi.",
          tekst: "Prije: figure koje se pomiču, redom.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Crveni krak nakon 4 poteza, s 4 polja na kojima su numerirane figure doskočile u redovima ispred kraka i 4 rupe ostavljene u kraku.",
          tekst: "Poslije: gdje su doskočile.",
        })}
      </div>
      <p>Svaki potez priprema sljedeći. Potezi 2 i 3 završavaju skokom preko figure koja se upravo pomaknula, a potez 4 počinje kroz rupu koju je ostavio potez 3. Sve 4 figure doskaču u tvoju polovicu ploče.</p>
      <p>Ima još nizova koji dosežu 13. Zajednička im je ideja: traži potez koji ostavlja rupu ili odskočnu dasku za sljedeći potez i pusti figuru s vrha van najkasnije do poteza 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Pogreške u prvim potezima</h2>
      <ul class="tips">
        <li><strong>Pomicanje iste figure svaki put.</strong> Figura koja trči sama dobiva 5 redova u 4 poteza, naspram 13 za 4 različite figure. Ostale tvoje figure usto ostaju gdje su bile.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Crveni krak na početku. Jedna figura iz drugog reda radi 4 poteza zaredom duž jedne linije, sa strelicama i brojevima od 1 do 4, i završava sama blizu sredine ploče.",
  tekst: "Jedna figura, 4 poteza, 5 redova.",
})}
      <ul class="tips">
        <li><strong>Koračanje samo prednjim redom.</strong> 4 koraka dobivaju 4 reda. Nakon toga figura na vrhu se i dalje ne može pomaknuti, pa ostaje straga dok ostale idu naprijed.</li>
        <li><strong>Koračanje u stranu.</strong> Korak uzduž reda dobiva 0 redova. Nakon poteza 1 otvaranja 1 prednja figura može koraknuti na susjedno polje, i to izgleda kao napredak, ali je potez izgubljen.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Nastavi dalje</h2>
      <p>Nakon otprilike 4 poteza dvije se vojske približe i gornja otvaranja ustupaju mjesto sredini igre. Ne moraš pamtiti nizove: zapamti da svaki potez treba pripremiti sljedeći.</p>
      <ul>
        <li><a href="/play/">Igraj protiv računala u pregledniku</a> i isprobaj otvaranje 1 ili 2.</li>
        <li><a href="/hr/vodici/kineska-dama-strategija">Strategija kineske dame</a>: ljestve, držanje figura na okupu i ispunjavanje cilja.</li>
        <li><a href="/hr/vodici/kineska-dama-za-2-igraca">Kineska dama za 2 igrača</a>: kako funkcionira igra u dvoje.</li>
        <li><a href="/hr/pravila/kineska-dama">Pravila kineske dame</a>, sa slikama koraka, skokova i lanaca.</li>
      </ul>
    </section>`;

export default {
  nav: "Otvaranja u kineskoj dami",
  titel: "Otvaranja u kineskoj dami: 2 otvaranja | Leapstone",
  beschrijving: "Otvaranja u kineskoj dami: kako iskočiti iz kraka, osloboditi figuru s vrha u potezu 2 i dobiti 13 redova u 4 poteza, uz pogreške koje valja izbjeći.",
  h1: "Otvaranja u kineskoj dami",
  intro: "Dobro otvaranje u kineskoj dami skače iz drugog reda, koristi drugu figuru svaki potez i pušta figuru s vrha van u potezu 2 ili 4. Dva otvaranja sa slikama i pogreške koje valja izbjeći.",
  inhoud,
};
