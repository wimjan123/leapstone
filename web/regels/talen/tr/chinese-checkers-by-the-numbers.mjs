// Leapstone rakamlarla, Turks (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Yerler ve taşlar</h2>
      <p>Leapstone'un iki tahtasında, bir oyunun başlangıç dizilişinde sayıldı.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Altı ucunun hepsi dolu yıldız tahta: boş bir ortanın çevresinde altı rengin her birinden on taş.",
  tekst: "Altı oyunculu bir oyunun başında yıldız tahta.",
})}
      <ul class="tips">
        <li><strong>Yıldız tahtada ${f("sterbord_vakken")} yer var.</strong> Her oyuncu ${f("sterbord_stenen_per_speler")} taşla başlar. Yani iki oyunculu bir oyunda tahtada ${f("sterbord_stenen_2_spelers")} taş olur, üç oyunculuda ${f("sterbord_stenen_3_spelers")}, dört oyunculuda ${f("sterbord_stenen_4_spelers")} ve altı oyunculuda ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Kare Halma tahtasında ${f("vierkant_vakken")} yer var.</strong> İki oyunculu bir oyunda her oyuncu ${f("vierkant_stenen_per_speler_2_spelers")} taşla başlar, toplam ${f("vierkant_stenen_2_spelers")}. Dört oyunculu bir oyunda her biri ${f("vierkant_stenen_per_speler_4_spelers")} taşla başlar, toplam ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">En uzun atlama zinciri: ${f("langste_sprongketen")}</h2>
      <p>Yıldız tahtada bir taş <strong>tek bir hamlede ${f("langste_sprongketen")} atlama</strong> yapabilir ve Leapstone kurallarına göre hiçbir hamlede bundan fazlası olamaz. Bu sayıya ulaşmak için diğer taşlar serbestçe yerleştirilir: taşın üstünden atladığı her yere bir taş.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Bir kırmızı taş ve çok sayıda mavi taş olan bir yıldız tahta. Beyaz oklar, kırmızı taşın uzun ve dolambaçlı bir yol boyunca mavi taşların üstünden birbiri ardına atladığını gösterir.",
  tekst: "En uzun zincir: kırmızı taş her mavi taşın üstünden birbiri ardına atlar.",
})}
      <p><strong>Nasıl sayıldı.</strong> Bir atlama her zaman düz bir çizgide iki yer öteye iner. Bu yüzden atlamaya devam eden bir taş yerlerin yalnızca bir kısmına ulaşabilir: tahta bu türden dört gruba ayrılır ve en büyüğünde ${f("grootste_klasse_vakken")} yer vardır. Leapstone'da bir taş tek bir hamlede aynı yere iki kez inemez, başladığı yere de inemez. Yani bir zincir, grubundaki diğer yerlerin her birine en fazla bir kez iner. Program bu grubu taradı ve ${f("grootste_klasse_vakken")} yerin hepsinden geçen bir yol buldu, yani hiçbir zincir daha uzun olamaz: ${f("langste_sprongketen")} atlama. Ardından bir test bu hamleyi Leapstone kurallarıyla oynar.</p>
      <p><strong>Gerçek bir oyun değil.</strong> Bu zincir için ${f("langste_sprongketen")} başka taş gerekir, her biri tam doğru yerde. İki ya da üç oyunculu bir oyunda yalnızca ${f("sterbord_stenen_2_spelers")} ya da ${f("sterbord_stenen_3_spelers")} taş vardır, bu da çok az. Dört ya da altı oyunculu bir oyunda ${f("sterbord_stenen_4_spelers")} ya da ${f("sterbord_stenen_6_spelers")} taş vardır, bu yeterli. Ama gerçek bir oyunda kimse taşları serbestçe yerleştirmez, bu yüzden bu zinciri masada beklemeyin. Tahtanın neye izin verdiğini gösterir, oyunda ne olduğunu değil.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">En kısa geçiş: ${f("oversteek_zetten")} hamle</h2>
      <p>Yıldız tahtada rakipsiz, tek başına bir oyuncunun ${f("sterbord_stenen_per_speler")} taşın hepsini bir uçtan karşı uca götürmesi için <strong>${f("oversteek_zetten")} hamle</strong> gerekir ve daha azıyla yapamaz. Bütün bir atlama zinciri tek hamle sayılır.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Alt uçta yalnızca on kırmızı taş olan bir yıldız tahta. Gitmeleri gereken üst ucun kenarı kesik çizgilidir.",
  tekst: "Tek başına bir oyuncu: alt uçta on taş, hedef ise üst uç.",
})}
      <p><strong>Nasıl sayıldı.</strong> Bir test, tahtada başka taş olmadan, Leapstone kurallarıyla ${f("oversteek_zetten")} hamlelik bir geçiş oynar. ${f("geen_oversteek_in_zetten")} ya da daha az hamlenin yetmediğini göstermek için bir arama G. I. Bell'in yöntemini izler (<em>Integers</em> 9, 2009). Her hamle geriye doğru oynanabilir ve tahtayı yarım tur çevirmek başlangıçla hedefin yerini değiştirir. Yani ${f("geen_oversteek_in_zetten")} ya da daha az hamlelik bir geçiş olsaydı, yolun yarısındaki bir diziliş başlangıçtan en fazla ${f("zoekdiepte_zetten")} hamle uzakta olurdu, yarım tur çevrilmiş aynı diziliş de öyle. Arama, başlangıçtan en fazla ${f("zoekdiepte_zetten")} hamle uzaktaki her dizilişi gözden geçirdi, bir dizilişle ayna görüntüsünü bir kez saydı, zamanında yeterince ileri gidemeyeceği kanıtlanabilen dizilişleri dışarıda bıraktı ve böyle bir çift bulamadı. ${f("gemeten_kernen")} çekirdekli bir makinede ${f("gemeten_rekentijd_seconden")} saniye çalıştı ve en büyük adımı ${f("gemeten_geheugen_gb")} GB bellekte ${f("gemeten_grootste_laag_miljoen_standen")} milyon diziliş tuttu. Sayı, Leapstone'un kendi tahtası için yeniden hesaplandı.</p>
      <p><strong>Gerçek bir oyun için alt sınır değil.</strong> Gerçek bir oyunda diğer oyuncuların taşları da tahtadadır ve sizin taşlarınız onların üstünden atlayabilir. Yani ${f("oversteek_zetten")}, gerçek bir oyunun sürebileceği en kısa süre değildir: yalnızca tek başına bir oyuncu için kanıtlanmıştır.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Deneyin</h2>
      <p><a href="/play/">Leapstone'u tarayıcınızda</a> bilgisayara karşı oynayın ya da bu sayfanın üstündeki düğmelerle uygulamayı indirin. Kurallar için <a href="/tr/kurallar/cin-damasi">Çin daması kuralları</a> ya da <a href="/tr/kurallar/halma">Halma kuralları</a> sayfasını okuyun. Atlama zincirlerini oyunda nasıl kullanacağınızı <a href="/tr/rehberler/cin-damasi-strateji">strateji ipuçlarında</a> bulabilirsiniz.</p>
    </section>`;

export default {
  nav: "Rakamlarla Çin daması",
  titel: "Rakamlarla Çin daması | Leapstone",
  beschrijving: `Yıldız tahtada ${c.sterbord_vakken} yer var. Bir hamlede en fazla ${c.langste_sprongketen} atlama olur ve tek başına bir oyuncu ${c.oversteek_zetten} hamlede karşıya geçer. Her sayı nasıl hesaplandı.`,
  h1: "Rakamlarla Çin daması",
  intro: `Çin damasının yıldız tahtasında ${f("sterbord_vakken")} yer var ve her oyuncu ${f("sterbord_stenen_per_speler")} taşla başlar. Leapstone'da bir hamlede asla ${f("langste_sprongketen")} atlamadan fazlası olamaz. Tahtada rakipsiz, tek başına bir oyuncunun karşıya geçmesi için ${f("oversteek_zetten")} hamle gerekir. Aşağıda her sayının nasıl sayıldığını ve gerçek bir oyun hakkında neyi söyleyip neyi söylemediğini görebilirsiniz.`,
  inhoud,
};
