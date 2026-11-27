// Türkçe rehber "Çin daması açılış hamleleri" (taak 303). Zin voor zin vertaald uit ../en/chinese-checkers-opening-moves.mjs.
// Elk getal en elke zet is nagelopen tegen crates/halma-core (zie het Engelse bestand). Alleen cijfers in de tekst, geen getalwoorden.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">İlk hamlen: 14 seçenek</h2>
      <p>Başlangıçta 10 taşın, 4, 3, 2 ve 1 taşlık sıralarla bir üçgeni doldurur ve ön sıra tahtanın ortasına bakar. Üçgenin içinde boş yer yoktur, bu yüzden bir taş yalnızca hemen önündeki sıraya gidebilir. Geriye 14 ilk hamle kalır: ön sıradaki 4 taşın her biri 2 yere adım atabilir (8 adım) ve ikinci sıradaki 3 taşın her biri öndeki bir taşın üzerinden 2 yere atlayabilir (6 atlama). Diğer 3 taş henüz hareket edemez.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Altta 10 taşıyla kırmızı uç ve hemen önündeki sırada halkayla işaretlenmiş 5 boş yer.",
  tekst: "Her ilk hamle bu 5 yerden birinde biter.",
})}
      <p>Bu rehberde sıra, ucunu enine kesen ve ön kenarına paralel uzanan bir yer çizgisidir ve ilerlemeyi sıralarla sayarız. Bir adım taşı 1 sıra ileri götürür, bir atlama 2 sıra. Her oyuncunun aynı 14 ilk hamlesi vardır; 2, 3, 4 ya da 6 oyuncuyla ve yıldızın herhangi bir ucundan, çünkü her uç içeriden aynı görünür.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Açılış 1: dışarı atla, sonra tepeyi aç</h2>
      <p>Ucunun tepesindeki taş hedefinden en uzaktaki taştır ve başlangıçta hareket edemez: bir taşın üzerinden ancak arkasındaki yer boşsa atlayabilir. İkinci sıradan bir atlama tam olarak böyle bir yer açar.</p>
      <ol>
        <li><strong>Hamle 1:</strong> ikinci sıranın sağ ucundaki taş önündeki taşın üzerinden atlar. Ucunun önündeki sıraya iner ve 2 sıra kazanır.</li>
        <li><strong>Hamle 2:</strong> tepedeki taş tek hamlede iki kez atlar: önce hamle 1'in boşalttığı yere, sonra ikinci sıradaki bir taşın üzerinden. 4 sıra kazanır.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Hamle 1'den sonra kırmızı uç. Tepedeki taşın halkası var ve 1 ile 2 numaralı 2 ok, boşalan yerden ucun önündeki sıraya yaptığı atlamaları gösteriyor.",
  tekst: "Hamle 1'den sonra tepedeki taş 2 atlamayla dışarı çıkar.",
})}
      <p>Bu, 2 hamlede 6 sıra eder. 2 hamle oynamanın bütün yollarını denedik ve kazanabileceğin en çok 6'dır. Buna yalnızca 4 hamle çifti ulaşır: ikinci sıranın iki ucundan birindeki taş, 2 yönünden birinde atlar ve tepedeki taş onu izler. İkinci sıranın ortasındaki taş işe yaramaz, çünkü tepeyi kapalı tutar.</p>
      <p>İki taş da şimdi ucunun önündeki sırada, aralarında bir boş yerle duruyor. Bu, bir merdivenin ilk adımıdır.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Açılış 2: 4 farklı taşla 4 hamle</h2>
      <p>4 hamlede en çok 13 sıra kazanabilirsin ve oraya yalnızca her hamle farklı bir taş kullanırsa varırsın. Bu diziliş bunu yapar:</p>
      <ol>
        <li><strong>Hamle 1:</strong> ön sıranın sağ ucundaki taş ileri adım atar. 1 sıra kazanır.</li>
        <li><strong>Hamle 2:</strong> üçüncü sıranın sağ ucundaki taş iki kez atlar. 4 sıra kazanır.</li>
        <li><strong>Hamle 3:</strong> ikinci sıranın sol ucundaki taş iki kez atlar. 4 sıra kazanır.</li>
        <li><strong>Hamle 4:</strong> tepedeki taş iki kez atlar. 4 sıra kazanır.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Başlangıçtaki kırmızı uç. Hareket edecek 4 taşın üzerinde, hamle sırasına göre 1'den 4'e kadar bir numara var.",
          tekst: "Önce: hareket edecek taşlar, sırasıyla.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "4 hamleden sonra kırmızı uç; numaralı taşların ucun önündeki sıralarda indiği 4 yer ve uçta kalan 4 boşluk görünüyor.",
          tekst: "Sonra: indikleri yerler.",
        })}
      </div>
      <p>Her hamle bir sonrakini hazırlar. Hamle 2 ve 3, hemen önce hareket eden taşın üzerinden bir atlamayla biter ve hamle 4, hamle 3'ün bıraktığı boşluktan başlar. 4 taşın hepsi tahtanın kendi yarında iner.</p>
      <p>13'e ulaşan başka dizilişler de var. Ortak noktaları fikirdir: bir sonraki hamle için bir boşluk ya da basamak bırakan hamleyi ara ve tepedeki taşı en geç hamle 4'te çıkar.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">İlk hamlelerdeki hatalar</h2>
      <ul class="tips">
        <li><strong>Her turda aynı taşı oynamak.</strong> Tek başına koşan bir taş 4 hamlede 5 sıra kazanır; 4 farklı taşta bu 13'tür. Üstelik diğer taşların olduğu yerde kalır.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Başlangıçtaki kırmızı uç. İkinci sıradan bir taş, oklar ve 1'den 4'e numaralarla tek bir çizgi boyunca üst üste 4 hamle yapar ve tahtanın ortasına yakın bir yerde tek başına kalır.",
  tekst: "Bir taş, 4 hamle, 5 sıra.",
})}
      <ul class="tips">
        <li><strong>Yalnızca ön sırayla adım atmak.</strong> 4 adım 4 sıra kazandırır. Ardından tepedeki taş hâlâ hareket edemez, bu yüzden gerisi ilerlerken arkada kalır.</li>
        <li><strong>Yana adım atmak.</strong> Bir sıra boyunca atılan adım 0 sıra kazandırır. Açılış 1'in hamle 1'inden sonra öndeki taş yanındaki yere adım atabilir ve bu ilerleme gibi görünür, ama hamle boşa gitmiştir.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Devam et</h2>
      <p>Yaklaşık 4 hamleden sonra iki ordu yaklaşır ve yukarıdaki açılışlar oyunun ortasına yerini bırakır. Dizilişleri ezberlemene gerek yok: her hamlenin bir sonrakini hazırlaması gerektiğini hatırla.</p>
      <ul>
        <li><a href="/play/">Tarayıcında bilgisayara karşı oyna</a> ve açılış 1'i ya da 2'yi dene.</li>
        <li><a href="/tr/rehberler/cin-damasi-strateji">Çin daması stratejisi</a>: merdivenler, taşları bir arada tutmak ve hedefi doldurmak.</li>
        <li><a href="/tr/rehberler/cin-damasi-iki-kisilik">2 oyunculu Çin daması</a>: iki kişilik bir oyun nasıl işler.</li>
        <li><a href="/tr/kurallar/cin-damasi">Çin daması kuralları</a>, adımların, atlamaların ve zincirlerin resimleriyle.</li>
      </ul>
    </section>`;

export default {
  nav: "Çin daması açılış hamleleri",
  titel: "Çin daması açılış hamleleri: 2 açılış | Leapstone",
  beschrijving: "Çin daması açılış hamleleri: ucundan nasıl atlarsın, tepedeki taşı hamle 2'de nasıl açarsın, 4 hamlede 13 sıra nasıl kazanırsın ve hatalar.",
  h1: "Çin daması açılış hamleleri",
  intro: "Çin damasında iyi bir açılış ikinci sıradan atlar, her turda farklı bir taş kullanır ve ucunun tepesindeki taşı hamle 2 ya da 4'te çıkarır. Resimli iki açılış ve kaçınılacak hatalar.",
  inhoud,
};
