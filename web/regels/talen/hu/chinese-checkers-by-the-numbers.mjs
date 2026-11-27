// Leapstone számokban, Hongaars (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Mezők és bábuk</h2>
      <p>A Leapstone két tábláján számolva, egy játszma kezdőállásában.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "A csillag alakú tábla mind a hat csúcsa tele: tíz bábu mind a hat színből, egy üres közép körül.",
  tekst: "A csillag alakú tábla egy hatszemélyes játszma elején.",
})}
      <ul class="tips">
        <li><strong>A csillag alakú táblán ${f("sterbord_vakken")} mező van.</strong> Minden játékos ${f("sterbord_stenen_per_speler")} bábuval kezd. Egy kétszemélyes játszmában tehát ${f("sterbord_stenen_2_spelers")} bábu van a táblán, egy háromszemélyesben ${f("sterbord_stenen_3_spelers")}, négyszemélyesben ${f("sterbord_stenen_4_spelers")}, hatszemélyesben pedig ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>A négyzet alakú Halma-táblán ${f("vierkant_vakken")} mező van.</strong> Kétszemélyes játszmában minden játékos ${f("vierkant_stenen_per_speler_2_spelers")} bábuval kezd, összesen ${f("vierkant_stenen_2_spelers")}. Négyszemélyes játszmában mindenki ${f("vierkant_stenen_per_speler_4_spelers")} bábuval kezd, összesen ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">A leghosszabb ugrássorozat: ${f("langste_sprongketen")}</h2>
      <p>A csillag alakú táblán egy bábu <strong>${f("langste_sprongketen")} ugrást tehet egyetlen lépésben</strong>, és a Leapstone szabályai szerint egy lépésben sem lehet több. Ehhez a számhoz a többi bábut szabadon helyezik el: egyet minden mezőre, amelyet a bábu átugrik.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Csillag alakú tábla egy piros bábuval és sok kék bábuval. Fehér nyilak mutatják, ahogy a piros bábu egyik kék bábut ugorja át a másik után, egy hosszú, kanyargós úton.",
  tekst: "A leghosszabb sorozat: a piros bábu minden kék bábut átugrik, egyiket a másik után.",
})}
      <p><strong>Hogyan számoltuk.</strong> Egy ugrás mindig két mezővel arrébb ér földet, egyenes vonalban. Az a bábu, amely tovább ugrál, ezért csak a mezők egy részére juthat el: a tábla négy ilyen csoportra oszlik, és a legnagyobbikban ${f("grootste_klasse_vakken")} mező van. A Leapstone-ban egy bábu egy lépésen belül nem érkezhet kétszer ugyanarra a mezőre, és arra a mezőre sem, ahonnan elindult. Egy sorozat tehát a csoportja minden többi mezőjére legfeljebb egyszer érkezik. A program átkutatta ezt a csoportot, és talált egy utat, amely mind a ${f("grootste_klasse_vakken")} mezőt érinti, így egyetlen sorozat sem lehet hosszabb: ${f("langste_sprongketen")} ugrás. Ezután egy teszt lejátssza ezt a lépést a Leapstone szabályaival.</p>
      <p><strong>Nem valódi játszma.</strong> Ehhez a sorozathoz ${f("langste_sprongketen")} másik bábu kell, mindegyik pontosan a megfelelő mezőn. Egy két- vagy háromszemélyes játszmában csak ${f("sterbord_stenen_2_spelers")} vagy ${f("sterbord_stenen_3_spelers")} bábu van, ez túl kevés. Egy négy- vagy hatszemélyes játszmában ${f("sterbord_stenen_4_spelers")} vagy ${f("sterbord_stenen_6_spelers")} van, ez elég. Egy valódi játszmában viszont senki sem helyezi el szabadon a bábukat, úgyhogy ne számíts erre a sorozatra az asztalnál. Azt mutatja, mit enged meg a tábla, nem azt, ami játék közben történik.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">A legrövidebb átkelés: ${f("oversteek_zetten")} lépés</h2>
      <p>Egyetlen játékosnak egyedül a csillag alakú táblán, ellenfelek nélkül, <strong>${f("oversteek_zetten")} lépés</strong> kell ahhoz, hogy mind a ${f("sterbord_stenen_per_speler")} bábuját egy csúcsból a szemközti csúcsba vigye, és kevesebből nem megy. Egy teljes ugrássorozat egy lépésnek számít.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Csillag alakú tábla csak tíz piros bábuval, az alsó csúcsban. A felső csúcsnak, ahová el kell jutniuk, szaggatott a kerete.",
  tekst: "Egy játékos egyedül: tíz bábu az alsó csúcsban, és a felső csúcs a cél.",
})}
      <p><strong>Hogyan számoltuk.</strong> Egy teszt lejátszik egy ${f("oversteek_zetten")} lépéses átkelést a Leapstone szabályaival, más bábuk nélkül a táblán. Annak megmutatására, hogy ${f("geen_oversteek_in_zetten")} vagy kevesebb lépés nem elég, egy keresés G. I. Bell módszerét követi (<em>Integers</em> 9, 2009). Minden lépés visszafelé is lejátszható, és a tábla fél fordulatnyi elforgatása felcseréli a kezdetet és a célt. Ha tehát létezne ${f("geen_oversteek_in_zetten")} vagy kevesebb lépéses átkelés, akkor egy félúton lévő állás legfeljebb ${f("zoekdiepte_zetten")} lépésre lenne a kezdettől, és ugyanez az állás fél fordulattal elforgatva is. A keresés végigment minden álláson, amely legfeljebb ${f("zoekdiepte_zetten")} lépésre van a kezdettől, egy állást és a tükörképét egyszer számolta, kihagyta azokat, amelyek bizonyíthatóan nem juthatnak elég messzire időben, és nem talált ilyen párt. ${f("gemeten_rekentijd_seconden")} másodpercig futott egy ${f("gemeten_kernen")} magos gépen, és a legnagyobb lépése ${f("gemeten_grootste_laag_miljoen_standen")} millió állást tartott ${f("gemeten_geheugen_gb")} GB memóriában. A számot a Leapstone saját tábláján újra kiszámoltuk.</p>
      <p><strong>Nem alsó határ egy valódi játszmára.</strong> Egy valódi játszmában a többi játékos bábui is a táblán vannak, és a te bábuid átugorhatják őket. A ${f("oversteek_zetten")} tehát nem a legkevesebb, ameddig egy valódi játszma tarthat: csak egyetlen, egyedül játszó játékosra bizonyított.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Próbáld ki</h2>
      <p><a href="/play/">Játssz a Leapstone-nal a böngészőben</a> a gép ellen, vagy töltsd le az alkalmazást az oldal tetején lévő gombokkal. A szabályokat <a href="/hu/szabalyok/csillaghalma">a csillaghalma szabályai</a> és <a href="/hu/szabalyok/halma">a Halma szabályai</a> között találod. Hogy hogyan használd az ugrássorozatokat egy játszmában, azt a <a href="/hu/utmutatok/csillaghalma-strategia">stratégiai tippekben</a> olvashatod.</p>
    </section>`;

export default {
  nav: "Csillaghalma számokban",
  titel: "Csillaghalma számokban | Leapstone",
  beschrijving: `A csillag alakú táblán ${c.sterbord_vakken} mező van. Egy lépésben legfeljebb ${c.langste_sprongketen} ugrás lehet, egy egyedül játszó pedig ${c.oversteek_zetten} lépésben kel át. Így számoltunk.`,
  h1: "Csillaghalma (kínai dáma) számokban",
  intro: `A csillaghalma csillag alakú tábláján ${f("sterbord_vakken")} mező van, és minden játékos ${f("sterbord_stenen_per_speler")} bábuval kezd. A Leapstone-ban egy lépésben soha nem lehet ${f("langste_sprongketen")} ugrásnál több. Egyetlen játékosnak egyedül a táblán, ellenfelek nélkül, ${f("oversteek_zetten")} lépés kell az átkeléshez. Lent láthatod, hogyan számoltuk ki az egyes számokat, és mit mondanak és mit nem mondanak egy valódi játszmáról.`,
  inhoud,
};
