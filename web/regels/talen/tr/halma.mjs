// Türkçe sayfa "Halma kuralları" (taak 134). Zin voor zin vertaald uit ../en/halma.mjs.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 oyuncu: her birinde 19 taş",
    alt: "Sol üst köşede 19 kırmızı taşın, sağ alt köşede 19 mavi taşın bulunduğu kare tahta",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 oyuncu: her birinde 13 taş",
    alt: "Dört köşenin her birinde 13 taşın bulunduğu kare tahta: sol üstte kırmızı, sağ üstte mavi, sağ altta yeşil ve sol altta sarı",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Tahta</h2>
      <p>Halma, 16'ya 16 yerlik, toplam 256 yerli kare bir tahtada oynanır. Her yerin en çok sekiz komşusu vardır: dört düz ve dört çapraz. Kenardaki bir yerin daha az komşusu vardır, köşedekinin ise üç.</p>
      <p>Bu, Leapstone'daki Kare tahtadır. Oyunu yıldız tahtada biliyorsan <a href="/tr/kurallar/sternhalma">Sternhalma</a> yazısını ve <a href="/tr/kurallar/cin-damasi">Çin daması kurallarını</a> oku.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Taşlar nasıl başlar</h2>
      <p>Halma 2 veya 4 oyuncuyla oynanır. Her oyuncu, taşlarla tahtanın bir köşesindeki bir kampta başlar. Karşı köşedeki kamp senin hedefindir.</p>
      <ul>
        <li><strong>2 oyuncu:</strong> her birinde 19 taş, birbirinin karşısındaki iki köşede. Kamp, 5, 5, 4, 3 ve 2 yerlik beş sıradan oluşur.</li>
        <li><strong>4 oyuncu:</strong> her birinde 13 taş, her köşede bir kamp. Kamp, 4, 4, 3 ve 2 yerlik dört sıradan oluşur. Hedefin tahtanın karşısındaki, çapraz köşedir.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Sıra</h2>
      <p>1. Oyuncu ilk oynar. Sonra sıra sırayla gider ve son oyuncudan sonra yine 1. Oyuncu oynar. Leapstone'da renkler numaralara göre gider: kırmızı, mavi, yeşil ve sarı.</p>
      <p>Sıra sendeyken bir taşı bir kez oynatırsın. Hiçbir şey yenmez: taşlar, oyuncusu pes edene kadar tahtada kalır.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Adım</h2>
      <p>Bir taşı yanındaki boş bir yere, sekiz yönden herhangi birinde oynat: düz ya da çapraz.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Çevresinde beyaz bir halka olan kırmızı bir taş. Sekiz komşusundan beşi boş ve işaretli; diğer üçünde taş var.",
  tekst: "Kırmızı taş işaretli beş yere adım atabilir. Diğer üç komşu dolu.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Atlama</h2>
      <p>Senin taşının yanındaki, herhangi bir renkten bir taşın üzerinden atla ve düz bir çizgide hemen arkasındaki boş yere in. Sekiz yönün hepsinde, çapraz ve geriye doğru da atlayabilirsin.</p>
      <ul>
        <li>İneceğin yer boş olmalı.</li>
        <li>Üst üste iki taşın ya da boş bir yerin üzerinden atlayamazsın.</li>
        <li>Üzerinden atladığın taş olduğu yerde kalır.</li>
        <li>Tahtanın kenarının dışına atlayamazsın.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Bir kırmızı taş, bir mavi taşın üzerinden çapraz olarak arkasındaki boş yere atlıyor; bir okla gösterilmiş.",
  tekst: "Kırmızı taş mavi taşın üzerinden çapraz atlıyor.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Atlama zinciri</h2>
      <p>Bir atlamadan sonra aynı taş yeniden atlayabilir; elinden geldiği kadar, istediği yönde, düz ya da çapraz. Nerede duracağına sen karar verirsin. Bütün atlamalar birlikte tek bir hamledir.</p>
      <ul>
        <li>Tek bir hamlede aynı yere iki kez inemezsin.</li>
        <li>Bir hamle ya tek bir adımdır ya da bir veya daha fazla atlamadır. Atlamadan sonra adım atamazsın.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Bir kırmızı taş tek hamlede üç kez atlıyor: bir mavi taşın üzerinden çapraz, başka bir mavi taşın üzerinden düz ve bir kırmızı taşın üzerinden çapraz. Üç iniş yeri 1, 2 ve 3 diye numaralanmış.",
  tekst: "Üç atlamalı tek bir hamle, numaraların sırasıyla.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Hedef</h2>
      <p>Bütün taşlarını başladığın yerin karşısındaki kampa götürürsen kazanırsın. O kampın her yerinde kendi taşların olmalı: 2 oyuncuyla 19, 4 oyuncuyla 13. Orada başka bir oyuncunun taşı durduğu sürece oyunu bitiremezsin.</p>
      <p>Boş olan her yere inebilirsin, diğer oyuncuların kamplarında da. Hedefindeki bir taş yine çıkıp gidebilir; hiçbir şey onu kilitlemez.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "İki oyunculu kare tahta. Kırmızı sol üstte başlar; kesik çizgili dairelerle işaretli ve mavi taşlar bulunan sağ alt kamp kırmızının hedefidir.",
  tekst: "2 oyuncuyla kırmızının hedefi mavinin başladığı kamptır.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">2 veya 4 oyuncuyla</h2>
      <ul>
        <li><strong>2 oyuncu:</strong> hedefi ilk dolduran kazanır ve oyun biter.</li>
        <li><strong>4 oyuncu:</strong> hedefi ilk dolduran kazanır. Diğerleri sonraki sıralar için oynamaya devam eder ve işi bitmiş oyuncunun sırası atlanır. Yalnızca bir oyuncu oynamaya devam ederken oyun biter.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Pes etmek</h2>
      <p>Pes edersen taşların tahtadan çıkar, bu yüzden kimseyi engellemezler. 2 oyuncuyla diğer oyuncu kazanır. 4 oyuncuyla oyun sensiz sürer ve biri hariç herkes pes ederse son oyuncu kazanır.</p>
      <p>Çevrimiçi bir oyunda her hamlenin bir süre sınırı vardır. Sınırı oyunu başlatan oyuncu belirler. Süren dolarsa sıran atlanır. Üst üste 3 sıranı kaçırırsan pes etmiş sayılırsın. Bilgisayara karşı ve tek telefonda oynanan oyunlarda süre sınırı yoktur.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">İpuçları</h2>
      <ul class="tips">
        <li><strong>Merdiven kur.</strong> Taşları, aralarında birer boş yer olacak şekilde, düz ya da çapraz, hedefine bakan bir çizgiye diz. O zaman tek bir taş bütün çizgi boyunca tek hamlede atlayabilir.</li>
        <li><strong>Her taş bir merdivendir.</strong> Her rengin üzerinden atlayabilirsin, yani diğer oyuncuların taşları da sana yardım eder. Senin merdivenlerin de onlara yardım eder: arkanda ne bıraktığına bak.</li>
        <li><strong>Çaprazları kullan.</strong> Hedef karşı köşede, bu yüzden çapraz bir taş çizgisi karşıya geçmenin en hızlı yoludur.</li>
        <li><strong>Geride kalanları unutma.</strong> Bütün taşlarının evde olması gerekir. Çok geride kalmış, üzerinden atlayacak hiçbir şeyi olmayan bir taş sırada bir yer ilerler. Diğer taşlar hâlâ çevresindeyken onu da yanında götür.</li>
        <li><strong>Senin başlangıcın onların hedefi.</strong> 2 oyuncuyla senin kampın diğer oyuncunun hedefidir ve senin bir taşın hâlâ orada durduğu sürece o oyunu bitiremez. Leapstone bir taşı evde tutmana izin verir, yani bu şekilde engelleyebilirsin. Aynısı senin için de geçerli.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Sorular</h2>
      <h3>Halma kaç kişiyle oynanır?</h3>
      <p>İki veya dört kişiyle. Halma, 16'ya 16 yerlik kare bir tahtada oynanır ve her oyuncu bir köşede başlar.</p>
      <h3>Halma'da her oyuncunun kaç taşı var?</h3>
      <p>2 oyuncuyla her birinde 19 taş, 4 oyuncuyla her birinde 13 taş vardır.</p>
      <h3>Halma'yı kim icat etti?</h3>
      <p>Amerikalı bir cerrah olan George Howard Monks, 1883 veya 1884'te. Adı Yunancada &ldquo;sıçramak&rdquo; demektir. Daha fazlası için <a href="/tr/kurallar/sternhalma">Sternhalma</a> yazısını oku.</p>
      <h3>Halma ile Çin daması arasındaki fark nedir?</h3>
      <p>Halma kare bir tahtada oynanır; sekiz yönde adım ve atlama vardır ve her oyuncunun 19 veya 13 taşı bulunur. Çin damasında yıldız bir tahta, altı yön ve her oyuncuya 10 taş vardır; 2, 3, 4 veya 6 oyuncuyla oynanır.</p>
      <h3>Halma çevrimiçi ücretsiz oynanır mı?</h3>
      <p>Evet, Leapstone'da, tarayıcında veya App Store'daki uygulamada. Bilgisayara karşı ya da arkadaşlarla çevrimiçi gibi bir oynama yolu seç, sonra Kare tahtaya dokun. Leapstone ücretsizdir ve reklamsızdır.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Oyna</h2>
      <p>Şimdi oyna düğmesi, <a href="/tr/kurallar/cin-damasi">yıldız tahtada</a> bilgisayara karşı bir oyun açar. Halma oynamak için en üstteki geri okuna dokun, sonra Bu telefonda oyna, Bilgisayara karşı oyna veya Arkadaşlarla çevrimiçi oyna seçeneğini seç ve Kare tahtaya dokun.</p>
    </section>`;

export default {
  nav: "Halma kuralları",
  titel: "Halma kuralları ve ipuçları | Leapstone",
  beschrijving: "16'ya 16 kare tahtada Halma nasıl oynanır: başlangıç, adımlar, atlamalar, zincirler, kazanmak ve ipuçları. Tarayıcında ücretsiz oyna.",
  h1: "Halma kuralları",
  intro: "Bütün taşlarını kare tahtanın karşı köşesine başkalarından önce taşı. Kurallar kısaca, resimlerle ve birkaç ipucuyla.",
  inhoud,
};
