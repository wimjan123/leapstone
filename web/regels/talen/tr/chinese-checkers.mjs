// Türkçe sayfa "Çin daması kuralları" (taak 134). Zin voor zin vertaald uit ../en/chinese-checkers.mjs.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} oyuncu`,
      alt:
        {
          2: "Alt uçta 10 kırmızı taşın, üst uçta 10 mavi taşın bulunduğu yıldız tahta",
          3: "Altta kırmızı, sol üstte mavi ve sağ üstte yeşil taşların bulunduğu yıldız tahta",
          4: "Dört ucunda taşların bulunduğu yıldız tahta: altta kırmızı, üstte yeşil, sol altta mavi ve sağ üstte sarı",
          6: "Altı ucunda da, altı renkte taşların bulunduğu yıldız tahta",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Tahta</h2>
      <p>Çin daması, altı uçlu bir yıldız üzerinde oynanır. Tahtada 121 yer vardır ve her uçta bunlardan 10 tanesi bulunur. Tahtanın içinde her yerin altı komşusu vardır.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Taşlar nasıl başlar</h2>
      <p>Her oyuncunun 10 taşı vardır ve taşlarla yıldızın bir ucunda başlar. Seninkinin tam karşısındaki uç senin hedefindir.</p>
      <ul>
        <li><strong>2 oyuncu:</strong> birbirinin karşısındaki iki uç.</li>
        <li><strong>3 oyuncu:</strong> birer atlayarak her uç. Üç hedef boş başlar.</li>
        <li><strong>4 oyuncu:</strong> yan yana duran iki çift uç. Her oyuncunun karşısında başka bir oyuncu vardır.</li>
        <li><strong>6 oyuncu:</strong> altı ucun hepsi.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Sıra</h2>
      <p>1. Oyuncu ilk oynar. Sonra sıra 2. Oyuncu, 3. Oyuncu diye sırayla gider ve son oyuncudan sonra yine 1. Oyuncu oynar. Leapstone'da renkler numaralara göre gider: kırmızı, mavi, yeşil, sarı, mor ve gümüş.</p>
      <p>Sıra sendeyken bir taşı bir kez oynatırsın. Hiçbir şey yenmez: taşlar, oyuncusu pes edene kadar tahtada kalır.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Adım</h2>
      <p>Bir taşı yanındaki boş bir yere oynat.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Çevresinde beyaz bir halka olan kırmızı bir taş. Altı komşusundan üçü boş ve işaretli; diğer üçünde taş var.",
  tekst: "Kırmızı taş işaretli üç yere adım atabilir. Diğer üç komşu dolu.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Atlama</h2>
      <p>Senin taşının yanındaki, herhangi bir renkten bir taşın üzerinden atla ve düz bir çizgide hemen arkasındaki boş yere in. Altı yönden herhangi birinde, geriye doğru da atlayabilirsin.</p>
      <ul>
        <li>İneceğin yer boş olmalı.</li>
        <li>Üst üste iki taşın ya da boş bir yerin üzerinden atlayamazsın.</li>
        <li>Üzerinden atladığın taş olduğu yerde kalır.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Bir kırmızı taş, bir mavi taşın üzerinden arkasındaki boş yere atlıyor; bir okla gösterilmiş.",
  tekst: "Kırmızı taş mavi taşın üzerinden atlıyor.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Atlama zinciri</h2>
      <p>Bir atlamadan sonra aynı taş yeniden atlayabilir; elinden geldiği kadar, istediği yönde. Nerede duracağına sen karar verirsin. Bütün atlamalar birlikte tek bir hamledir.</p>
      <ul>
        <li>Tek bir hamlede aynı yere iki kez inemezsin.</li>
        <li>Bir hamle ya tek bir adımdır ya da bir veya daha fazla atlamadır. Atlamadan sonra adım atamazsın.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Bir kırmızı taş tek hamlede üç kez atlıyor: bir mavi, bir yeşil ve bir mavi taşın üzerinden. Üç iniş yeri 1, 2 ve 3 diye numaralanmış.",
  tekst: "Üç atlamalı tek bir hamle, numaraların sırasıyla.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Hedef</h2>
      <p>10 taşının hepsini başladığın yerin karşısındaki uca götürürsen kazanırsın. O ucun 10 yerinin hepsinde kendi taşların olmalı. Orada başka bir oyuncunun taşı durduğu sürece oyunu bitiremezsin.</p>
      <p>Boş olan her yere inebilirsin, diğer oyuncuların uçlarında da.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Üç oyunculu bir yıldız tahta. Kırmızı altta başlar; üstteki, kesik çizgili dairelerle işaretli boş uç kırmızının hedefidir.",
  tekst: "3 oyuncuyla kırmızı altta başlar. Kırmızının hedefi üstteki boş uçtur.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">2, 3, 4 veya 6 oyuncuyla</h2>
      <ul>
        <li><strong>2 oyuncu:</strong> hedefi ilk dolduran kazanır ve oyun biter.</li>
        <li><strong>3, 4 veya 6 oyuncu:</strong> hedefi ilk dolduran kazanır. Diğerleri sonraki sıralar için oynamaya devam eder ve işi bitmiş oyuncunun sırası atlanır. Yalnızca bir oyuncu oynamaya devam ederken oyun biter.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Pes etmek</h2>
      <p>Pes edersen taşların tahtadan çıkar, bu yüzden kimseyi engellemezler. 2 oyuncuyla diğer oyuncu kazanır. Daha çok oyuncuyla oyun sensiz sürer ve biri hariç herkes pes ederse son oyuncu kazanır.</p>
      <p>Çevrimiçi bir oyunda her hamlenin bir süre sınırı vardır. Sınırı oyunu başlatan oyuncu belirler, hızlı oyunda ise 30 saniyedir. Süren dolarsa sıran atlanır. Üst üste 3 sıranı kaçırırsan pes etmiş sayılırsın. Bilgisayara karşı ve tek telefonda oynanan oyunlarda süre sınırı yoktur.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">İpuçları</h2>
      <ul class="tips">
        <li><strong>Merdiven kur.</strong> Taşları, aralarında birer boş yer olacak şekilde, hedefine bakan bir çizgiye diz. O zaman tek bir taş bütün çizgi boyunca tek hamlede atlayabilir.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Aralarında birer boş yer olan, çapraz bir çizgide dört taş. Bir uçtaki kırmızı taş dördünün de üzerinden atlıyor, dört numaralı iniş yeriyle.",
  tekst: "Bir çizgide dört taş: üstteki kırmızı taş dört atlamayla tahtayı tek hamlede geçer.",
})}
        </li>
        <li><strong>Her taş bir merdivendir.</strong> Her rengin üzerinden atlayabilirsin, yani diğer oyuncuların taşları da sana yardım eder. Senin merdivenlerin de onlara yardım eder: arkanda ne bıraktığına bak.</li>
        <li><strong>Geride kalanları unutma.</strong> 10 taşın hepsinin evde olması gerekir. Çok geride kalmış, üzerinden atlayacak hiçbir şeyi olmayan bir taş sırada bir yer ilerler. Diğer taşlar hâlâ çevresindeyken onu da yanında götür.</li>
        <li><strong>Senin başlangıcın onların hedefi.</strong> 2, 4 veya 6 oyuncuyla senin başlangıç ucun karşındaki oyuncunun hedefidir ve senin bir taşın hâlâ orada durduğu sürece o oyunu bitiremez. Aynısı senin için de geçerli.</li>
      </ul>
      <p>Resimli daha fazla ipucu <a href="/tr/rehberler/cin-damasi-strateji">Çin daması stratejisi</a> rehberinde. İki kişilik bir oyun için <a href="/tr/rehberler/cin-damasi-iki-kisilik">2 oyunculu Çin daması</a> yazısını oku.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Sorular</h2>
      <h3>Çin daması kaç kişiyle oynanır?</h3>
      <p>İki, üç, dört veya altı kişiyle. Her oyuncu yıldızın bir ucunda başlar. 2, 3 veya 4 oyuncuyla bazı uçlar boş kalır.</p>
      <h3>Çin damasında her oyuncunun kaç taşı var?</h3>
      <p>Her oyuncunun 10 taşı (bilyesi) vardır. Tahtada 121 yer var: altı ucun her birinde 10, ortada 61.</p>
      <h3>Çin damasında kendi taşlarının üzerinden ya da geriye doğru atlayabilir misin?</h3>
      <p>Evet. Herhangi bir renkten bir taşın, kendi taşın da dahil, altı yönden herhangi birinde, geriye doğru da üzerinden atlayabilirsin. Üzerinden atladığın taş olduğu yerde kalır.</p>
      <h3>Çin damasında taş yenir mi?</h3>
      <p>Hayır. Hiçbir şey yenmez. Bir taş ancak oyuncusu pes ettiğinde tahtadan çıkar.</p>
      <h3>Çin daması Çin'den mi geliyor?</h3>
      <p>Hayır. Oyun 1892'de Almanya'da, daha eski Halma oyununa dayanan Stern-Halma adıyla ortaya çıktı. Çin daması adı 1928'de Amerika Birleşik Devletleri'nden geldi. Daha fazlası için <a href="/tr/kurallar/sternhalma">Sternhalma</a> yazısını oku.</p>
      <h3>Çin damasını arkadaşlarla çevrimiçi ücretsiz nerede oynayabilirsin?</h3>
      <p>Leapstone'da, tarayıcında ya da App Store'daki uygulamada. Bir arkadaşına davet bağlantısı gönder: hesap, e-posta adresi veya şifre olmadan oyununa katılır. Bilgisayara karşı ya da başka bir oyuncuya karşı hızlı bir oyun da oynayabilirsin. Leapstone ücretsizdir ve reklamsızdır.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Leapstone'da Çin daması oyna</h2>
      <p>Leapstone, Çin daması ve Halma için ücretsiz bir uygulama; 3 boyutlu, kırmızı lake ve altın bir tahtası var. Uygulamada ve tarayıcında oynayabilirsin.</p>
      <ul>
        <li><strong>Bilgisayara karşı.</strong> Kolay, normal veya zor. İnternet gerekmez.</li>
        <li><strong>Arkadaşlarla.</strong> Bir davet bağlantısı gönder. Hamle başına süreyi sen belirlersin ve sohbet edebilirsiniz.</li>
        <li><strong>Çevrimiçi.</strong> Senin seviyendeki başka bir oyuncuya karşı hızlı bir oyun, hamle başına 30 saniye. Bazı çevrimiçi rakipler bilgisayar oyuncusu olabilir.</li>
        <li><strong>Tek telefonda.</strong> Telefonu masanın etrafında elden ele geçirin.</li>
      </ul>
      <p>Leapstone ücretsizdir, reklamsızdır ve e-posta adresiyle kayıt gerektirmez: yalnızca bir oyuncu adı seçersin. <a href="https://apps.apple.com/tr/app/id6831230722">App Store'dan indir</a> / <a href="/play/">Tarayıcıda oyna</a>.</p>
    </section>`;

export default {
  nav: "Çin daması kuralları",
  titel: "Çin daması kuralları ve ipuçları | Leapstone",
  beschrijving: "Çin daması nasıl oynanır: taşların başlangıcı, adımlar, atlamalar ve zincirler, 2, 3, 4 veya 6 oyuncuyla kazanmak ve ipuçları. Tarayıcında ücretsiz oyna.",
  h1: "Çin daması kuralları",
  intro: "10 taşının hepsini yıldız tahtanın karşı ucuna başkalarından önce taşı. Kurallar kısaca, resimlerle ve birkaç ipucuyla.",
  inhoud,
};
