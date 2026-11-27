// Türkçe rehber "4 oyunculu Çin daması" (taak 301). Zin voor zin vertaald uit ../en/chinese-checkers-4-players.mjs.
// Regels en menu's: zie de bronverwijzingen in het Engelse bestand.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Tahta nasıl bölünür</h2>
      <p>Her oyuncunun 10 taşı vardır, yani 121 yerlik tahtada 40 taş durur. Dört başlangıç ucu, yan yana duran iki çift uçtur: kırmızı altta ve mavi sol altta, yeşil üstte ve sarı sağ üstte.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Alt uçta 10 kırmızı taşın, sol alt uçta 10 mavi taşın, üst uçta 10 yeşil taşın ve sağ üst uçta 10 sarı taşın bulunduğu yıldız tahta. Sol üst ve sağ alt uçlar boştur.",
  tekst: "Kırmızı altta, mavi sol altta, yeşil üstte, sarı sağ üstte.",
})}
      <p>Kırmızı olan 1. Oyuncu ilk oynar. Sonra mavi 2. Oyuncu, yeşil 3. Oyuncu, sarı 4. Oyuncudur ve sarıdan sonra sıra yine kırmızıya gelir. Bir hamle, bir taşla bir adım ya da bir atlama zinciridir. Adımlar ve atlamalar için <a href="/tr/kurallar/cin-damasi">Çin daması kurallarına</a> bak.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Kim kimin karşısında</h2>
      <p>Uçlar tahtanın karşı taraflarında çiftler oluşturur: kırmızı yeşilin, mavi de sarının karşısındadır. Hedefin tam karşındaki uçtur. Kırmızı yeşilin başladığı yere, yeşil kırmızının başladığı yere, mavi sarının başladığı yere, sarı da mavinin başladığı yere gider.</p>
      <p>2 kişilik oyundaki gibi her hedef, karşındaki oyuncunun taşlarıyla dolu başlar; bu yüzden oraya ancak onlar çıktıktan sonra inebilirsin. 3 oyuncuda hedefler boş başlar, 4 oyuncuda ise kimse hemen bitiremez. Dört hedef dört farklı uçtur, bu yüzden senin hedefini başka kimse istemez: işi biten bir oyuncu kimseyi asla engellemez.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">İki boş uç</h2>
      <p>Sol üst ve sağ alt uçlarda taş yoktur. Hiç kimsenin başlangıcı ya da hedefi değildirler. Sol üst uç mavi ile yeşilin arasında, sağ alt uç ise sarı ile kırmızının arasındadır.</p>
      <p>Herhangi bir boş yere adım atabilir ya da atlayabilirsin; bu yüzden bu uçlardan geçebilir ya da onlarda durabilirsin. Ama orada duran taş henüz hedefte sayılmaz. Biri oraya taş getirene kadar boş bir uçta üzerinden atlanacak bir şey yoktur.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Taktikte ne değişir</h2>
      <ul>
        <li><strong>Aynı anda iki geçiş:</strong> kırmızı ile yeşil tahtayı birbirine doğru geçer, mavi ile sarı da öyle. İki çizgi de ortadan geçer; bu yüzden orta, yalnızca bir çizginin geçtiği 2 kişilik oyundakinden daha kalabalıktır.</li>
        <li><strong>Sıran arasında üç oyuncu oynar:</strong> tahta, iki hamlen arasında 2 kişilik oyundakinden daha çok değişir. Her sıranın başında tahtaya yeniden bak ve atlama zincirini o zaman planla. Senden sonra oynayan oyuncu hiçbir zaman karşındaki oyuncu değildir.</li>
        <li><strong>Taşlar herkese yardım eder:</strong> diğer üç oyuncunun her taşı senin için bir basamaktır, seninkiler de onlar için. Karşındaki oyuncunun taşları, 2 kişilik oyundaki gibi ters yöne gider.</li>
        <li><strong>Dolanacak yer:</strong> orta doluysa boş uçlar, kampların yanında açık alandır. Bunlardan birinin içinden geçen bir yol, kalabalığı dolaşmanın yolu olabilir.</li>
        <li><strong>Pes eden oyuncu hedefini boşaltır:</strong> karşındaki oyuncu pes ederse taşları tahtadan çıkar, yani hedefin hemen boşalır.</li>
      </ul>
      <p>Merdivenler, geride kalan taşlar ve hedefi arkadan doldurma hakkındaki <a href="/tr/rehberler/cin-damasi-strateji">strateji ipuçları</a> 4 oyuncuda da aynıdır.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Kazanmak ve sonrasında olanlar</h2>
      <ul>
        <li><strong>Kazanmak:</strong> hedefi 10 taşıyla ilk dolduran oyuncu kazanır. Oyun orada bitmez: diğer üç oyuncu sonraki sıralar için oynamaya devam eder ve işi biten oyuncunun sırası atlanır. O oyuncunun taşları tahtada kalır. Oyun, yalnızca bir oyuncu oynamaya devam ettiğinde biter.</li>
        <li><strong>Pes etmek:</strong> taşların tahtadan çıkar ve diğer üç oyuncu oynamaya devam eder. Diğerleri de pes ederse geriye kalan son oyuncu kazanır.</li>
        <li><strong>Süre (çevrimiçi):</strong> çevrimiçi bir oyunda her hamlenin bir süre sınırı vardır. Süren dolarsa sıran atlanır. Üst üste 3 sıranı kaçırırsan pes etmiş sayılırsın ve oyun sensiz devam eder.</li>
      </ul>
      <p>Daha az oyunculu oyunlar için <a href="/tr/rehberler/cin-damasi-iki-kisilik">2 oyunculu Çin daması</a> rehberini oku. <a href="/tr/kurallar/cin-damasi">Kurallar sayfasında</a> her başlangıcın resimleri var.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstone'da 4 oyuncuyla nerede oynanır</h2>
      <ul>
        <li><strong>Bilgisayara karşı, hemen şimdi:</strong> <a href="/play/">Leapstone'u tarayıcında</a> aç, Bilgisayar'a dokun, yıldız tahtayı ve 3 bilgisayarı seç. 1. Oyuncu sensin, yani ilk sen oynarsın. Bilgisayarlar için Kolay, Normal veya Zor seçersin.</li>
        <li><strong>Tek bir telefonda:</strong> Oyna'ya dokun, yıldız tahtayı ve 4 oyuncuyu seç, sonra o yeri kişi ile bilgisayar arasında değiştirmek için bir taşa dokun.</li>
        <li><strong>Arkadaşlarla çevrimiçi:</strong> Arkadaşlar'a dokun, yıldız tahtayı, 4 oyuncuyu ve hamle başına süreyi seç ve davet bağlantısını gönder. Oyun, 4 yerin hepsi dolunca başlar.</li>
        <li><strong>Hızlı oyun, uygulamada:</strong> Çevrimiçi oyna'ya dokun. 2 kişilik bir oyun ararken, bunun yerine 4 kişilik bir oyun aramak için 4 veya 6 oyuncu ara'ya dokun. Her hamle 30 saniyedir. 20 saniye içinde yeterince oyuncu katılmazsa boş yerleri bilgisayar oyuncuları doldurur; bu yüzden bazı rakipler bilgisayar oyuncusu olabilir.</li>
      </ul>
    </section>`;

export default {
  nav: "4 oyunculu Çin daması",
  titel: "4 oyunculu Çin daması: kurulum ve ipuçları | Leapstone",
  beschrijving: "Çin daması 4 oyuncuyla nasıl işler: tahta nasıl bölünür, hangi 2 uç boş kalır, kim kimin karşısında, taktik nasıl değişir ve nerede oynanır.",
  h1: "4 oyunculu Çin daması",
  intro: "4 oyuncuyla her biriniz yıldızın dört ucundan birinde başlar, iki uç da boş kalır. Kırmızı yeşilin, mavi de sarının karşısındadır: hedefin, karşındaki uçtur ve o oyuncunun taşlarıyla doludur. İşte kurulum, boş uçlar, taktik ve nerede oynayabileceğin.",
  inhoud,
};
