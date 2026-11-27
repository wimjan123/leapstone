// De gids Halma vs Çin daması in het Turks, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Çin daması: yıldız tahta, 121 yer",
    alt: "Alt uçta 10 kırmızı taşın, üst uçta 10 mavi taşın bulunduğu yıldız tahta",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: kare tahta, 256 yer",
    alt: "Sol üst köşede 19 kırmızı taşın, sağ alt köşede 19 mavi taşın bulunduğu kare tahta",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Yıldız tahta: altı komşu, burada üçü boş",
    alt: "Çevresinde beyaz bir halka olan kırmızı bir taş. Altı komşusundan üçü boş ve işaretli; diğer üçünde taş var.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Kare tahta: sekiz komşu, burada beşi boş",
    alt: "Çevresinde beyaz bir halka olan kırmızı bir taş. Sekiz komşusundan beşi boş ve işaretli; diğer üçünde taş var.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Kısa cevap</h2>
      <p>Halma kare bir tahtada, Çin daması ise altı köşeli bir yıldız biçimindeki tahtada oynanır. İki oyunda da taşlarını adımlarla ve atlamalarla tahtanın karşısına götürürsün ve karşı taraftaki kampı ilk dolduran kazanır.</p>
      <p>Değişen şeyler tahta, hareket ettiğin yönler, kaç kişinin oynayabildiği ve her oyuncunun kaç taşı olduğudur. <a href="/tr/kurallar/sternhalma">Sternhalma</a>, yıldız tahtada oynanan Halma'nın adıdır, yani Çin daması ile aynı oyundur.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Tahtalar</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Çin daması</strong> yıldız tahtayı kullanır: 121 yer ve altı ucun her birinde 10 yerlik bir uç. Bir uç, 4, 3, 2 ve 1 yerlik sıralardan oluşan bir üçgendir.</li>
        <li><strong>Halma</strong> kare tahtayı kullanır: 16'ya 16 yer, toplam 256. Kamp bir köşededir. Büyük bir kamp 5, 5, 4, 3 ve 2 yerlik sıralardan, küçük bir kamp 4, 4, 3 ve 2 yerlik sıralardan oluşur.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Yönler: altı ya da sekiz</h2>
      <p>Yıldız tahtada bir yerin altı komşusu vardır. Kare tahtada sekiz komşusu vardır, çünkü çaprazlar da sayılır. Bir adım boş bir komşuya gider. Bir atlama, senin taşının yanındaki tek bir taşın üzerinden, düz bir çizgide, hemen arkasındaki boş yere iner; bu yönlerin hepsinde ve geriye doğru da atlanabilir.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Kenardaki bir yerin daha az komşusu vardır, kare tahtanın köşesindeki yerin ise üç. Altı yön, yıldız tahtada bir yerden geçen üç çizgi oluşturur. Sekiz yön, kare tahtada dört çizgi oluşturur: yatay, dikey ve iki çapraz.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Oyuncular ve taşlar</h2>
      <ul>
        <li><strong>Çin daması:</strong> 2, 3, 4 veya 6 oyuncu. Herkesin 10 taşı vardır, yani tahtada 20, 30, 40 veya 60 taş bulunur.</li>
        <li><strong>Halma:</strong> 2 veya 4 oyuncu. 2 oyuncuyla her birinin 19 taşı vardır, toplam 38. 4 oyuncuyla her birinin 13 taşı vardır, toplam 52.</li>
      </ul>
      <p>Leapstone'da kare tahtada 3 veya 6 oyunculu oyun yoktur. Üç kişilik oyun için <a href="/tr/rehberler/cin-damasi-uc-kisilik">3 oyunculu Çin daması</a> sayfasını oku.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Aynı olan şeyler</h2>
      <ul>
        <li><strong>Bir hamle:</strong> bir adım ya da bir taşla yapılan bir atlama zinciri. Zincirin nerede biteceğine sen karar verirsin ve atlamadan sonra adım atamazsın.</li>
        <li><strong>Her renk:</strong> herhangi bir renkten bir taşın, kendi taşının da üzerinden atlarsın. Üzerinden atladığın taş olduğu yerde kalır. Hiçbir şey yenmez.</li>
        <li><strong>Hedef:</strong> başladığın yerin karşısındaki kamp. Bütün yerlerinde kendi taşların olmalı. Orada başka bir oyuncunun taşı durduğu sürece bitiremezsin.</li>
        <li><strong>Kazanmak:</strong> hedefi ilk dolduran kazanır. 2 oyuncuyla oyun o zaman biter. Daha çok oyuncuyla diğerleri sonraki sıralar için oynamaya devam eder ve işi bitmiş oyuncunun sırası atlanır.</li>
        <li><strong>Pes etmek ve süre:</strong> pes edersen taşların tahtadan çıkar. Çevrimiçi bir oyunda her hamlenin bir süre sınırı vardır ve üst üste 3 sıranı kaçırırsan pes etmiş sayılırsın.</li>
      </ul>
      <p>Tüm kurallar için <a href="/tr/kurallar/cin-damasi">Çin daması</a> ve <a href="/tr/kurallar/halma">Halma</a> sayfalarını oku.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Leapstone'da hangi tahtayı seçmeli</h2>
      <ul>
        <li><strong>3 veya 6 oyuncu:</strong> yalnızca yıldız tahtada vardır.</li>
        <li><strong>Her oyuncuya daha çok taş:</strong> kare tahta; 2 oyuncuyla her birinde 19, 4 oyuncuyla 13 taş, yıldız tahtadaki 10'a karşı.</li>
        <li><strong>Çevrimiçi oynamak:</strong> hızlı oyun yıldız tahtada oynanır. Arkadaşlarla ve bilgisayara karşı iki tahtadan birini seçebilirsin.</li>
      </ul>
      <p>Şimdi oyna düğmesi, yıldız tahtada bilgisayara karşı bir oyun açar. Kare tahtada oynamak için en üstteki geri oka dokun ve menüden Kare tahtayı seç.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Devam et</h2>
      <ul>
        <li><a href="/play/">Tarayıcında oyna</a> ve iki tahtayı da dene.</li>
        <li><a href="/tr/rehberler/cin-damasi-strateji">Çin daması stratejisi</a>: resimli altı ipucu.</li>
        <li><a href="/tr/rehberler/cin-damasi-iki-kisilik">2 oyunculu Çin daması</a>: iki kişilik bir oyun nasıl işler.</li>
      </ul>
      <p><a href="/tr/rehberler/cin-damasi-arkadaslarla-online">Arkadaşlarla çevrimiçi Çin daması</a></p>
    </section>`;

export default {
  nav: "Halma ve Çin daması",
  titel: "Halma ve Çin daması: farklar | Leapstone",
  beschrijving: "Halma mı, Çin daması mı? Kare ve yıldız tahta, altı ya da sekiz yön, oyuncular ve taşlar, ve aynı olan şeyler.",
  h1: "Halma ve Çin daması",
  intro: "Tek fikri olan iki oyun: bütün taşlarını tahtanın karşı tarafına götür. Neler farklı, neler aynı ve ikisini nerede oynayabilirsin.",
  inhoud,
};
