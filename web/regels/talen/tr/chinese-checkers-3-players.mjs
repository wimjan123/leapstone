// Türkçe rehber "3 oyunculu Çin daması" (taak 299). Zin voor zin vertaald uit ../en/chinese-checkers-3-players.mjs.
// Regels, niveaus en menu's: zie de bronverwijzingen in het Engelse bestand.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Oyun nasıl başlar</h2>
      <p>Her oyuncunun 10 taşı vardır, yani 121 yerlik tahtada 30 taş durur. Taşlar, yıldızın birer atlayarak her ucunda başlar: kırmızı altta, mavi sol üstte ve yeşil sağ üstte. Aradaki üç uç boştur.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Alt uçta 10 kırmızı taşın, sol üst uçta 10 mavi taşın ve sağ üst uçta 10 yeşil taşın bulunduğu yıldız tahta",
  tekst: "Kırmızı altta, mavi sol üstte, yeşil sağ üstte.",
})}
      <p>Kırmızı olan 1. Oyuncu ilk oynar. Sonra mavi 2. Oyuncu, yeşil 3. Oyuncu olur ve yeşilden sonra sıra yine kırmızıya gelir. Bir hamle, bir taşla bir adım ya da bir atlama zinciridir. Adımlar ve atlamalar için <a href="/tr/kurallar/cin-damasi">Çin daması kurallarına</a> bak.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Üç hedef, hepsi başta boş</h2>
      <p>Hedefin, başladığın yerin karşısındaki uçtur ve 3 oyuncuyla boş başlar. Bu, diğer iki oyuncunun başlangıçları arasındaki boş uçtur: kırmızının hedefi üstte, mavinin hedefi sağ altta ve yeşilin hedefi sol alttadır.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Üç oyunculu yıldız tahta. Her oyuncunun renginde kesikli daireler üç boş hedefi gösterir: kırmızı üstte, mavi sağ altta, yeşil sol altta.",
  tekst: "Her hedef, oyuncusunun renginde.",
})}
      <p>10 taşının hepsini hedefine götürürsen kazanırsın. 10 yerin hepsinde kendi taşların olmalı. Hedefinde kimse başlamaz ama istediğin boş yerde durabilirsin, bu yüzden başka bir oyuncunun taşı sonradan oraya inebilir. O taş orada durduğu sürece bitiremezsin.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Kazanmak ve sonrasında olanlar</h2>
      <ul>
        <li><strong>Kazanmak:</strong> hedefi ilk dolduran oyuncu kazanır. Oyun burada bitmez: diğer ikisi sonraki sıralar için oynamaya devam eder ve işi bitmiş oyuncunun sırası atlanır. Yalnızca bir oyuncu oynamaya devam ederken oyun biter.</li>
        <li><strong>Pes etmek:</strong> taşların tahtadan çıkar ve diğer ikisi oynamaya devam eder. Kimse bitirmeden ikinci bir oyuncu da pes ederse, geriye kalan son oyuncu kazanır.</li>
        <li><strong>Süre (çevrimiçi):</strong> çevrimiçi bir oyunda her hamlenin bir süre sınırı vardır; bunu oyunu başlatan oyuncu belirler. Süren dolarsa sıran atlanır. Üst üste 3 sıranı kaçırırsan pes etmiş sayılırsın ve oyun sensiz sürer.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">2 kişilik oyundan farkı</h2>
      <ul>
        <li><strong>Daha çok taş:</strong> tahtada 30 taş var; 2 oyuncuyla 20.</li>
        <li><strong>Boş hedefler:</strong> 2 oyuncuyla hedefin, diğer oyuncunun taşlarıyla dolu başlar. 3 oyuncuyla boş başlar.</li>
        <li><strong>İki rakip:</strong> hamlenden sonra sıra tekrar sana gelmeden iki başka oyuncu oynar. İkisinin taşları senin için, seninkiler de onlar için basamaktır. Kurduğun bir merdiveni ikisi de kullanabilir ve senden sonraki oyuncu ilk fırsatı yakalar.</li>
        <li><strong>Oyun sürer:</strong> 2 oyuncuyla biriniz bitirince oyun biter. 3 oyuncuyla ikinci ve üçüncü sıra için sürer.</li>
      </ul>
      <p>İki kişilik oyun için <a href="/tr/rehberler/cin-damasi-iki-kisilik">2 oyunculu Çin damasını</a> oku. <a href="/tr/rehberler/cin-damasi-strateji">Strateji ipuçları</a> adımlar ve atlamalarla ilgilidir; bunlar 3 oyuncuyla da aynıdır.</p>
      <p><a href="/tr/rehberler/cin-damasi-arkadaslarla-online">Arkadaşlarla çevrimiçi Çin daması</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstone'da 3 oyuncuyla nerede oynanır</h2>
      <ul>
        <li><strong>Bilgisayara karşı, hemen şimdi:</strong> <a href="/play/">Leapstone'u tarayıcında</a> aç, Bilgisayar'a dokun, yıldız tahtayı ve 2 bilgisayarı seç. 1. Oyuncu sensin, yani ilk sen oynarsın. Bilgisayarlar için Kolay, Normal veya Zor seçersin.</li>
        <li><strong>Tek bir telefonda:</strong> “Bu telefonda” düğmesine dokun, yıldız tahtayı ve 3 oyuncuyu seç, sonra o yeri kişi ile bilgisayar arasında değiştirmek için bir taşa dokun.</li>
        <li><strong>Arkadaşlarla çevrimiçi:</strong> Arkadaşlar'a dokun, yıldız tahtayı, 3 oyuncuyu ve hamle başına süreyi seç, sonra davet bağlantısını gönder. Oyun, 3 yerin hepsi dolunca başlar.</li>
        <li><strong>Hızlı oyunlar:</strong> Çevrimiçi oyna 2 veya 4 oyunculu oyunlar bulur, yani 3 kişilik hızlı oyun yoktur.</li>
      </ul>
    </section>`;

export default {
  nav: "3 oyunculu Çin daması",
  titel: "3 oyunculu Çin daması: kurulum ve kurallar | Leapstone",
  beschrijving: "Çin daması 3 oyuncuyla nasıl işler: 30 taş nerede başlar, hangi boş uç hangi oyuncunun hedefi, kim ilk oynar ve nasıl kazanılır.",
  h1: "3 oyunculu Çin daması",
  intro: "Yıldız tahtada üç kişilik bir oyun nasıl işler: kurulum, üç hedef, kimin ilk oynadığı, nasıl kazanılacağı ve nerede oynanabileceği.",
  inhoud,
};
