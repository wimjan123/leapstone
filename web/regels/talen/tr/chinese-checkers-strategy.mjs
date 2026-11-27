// Türkçe rehber "Çin daması stratejisi" (taak 134). Zin voor zin vertaald uit ../en/chinese-checkers-strategy.mjs.
// Elke tip is nagelopen tegen crates/halma-core (zie het Engelse bestand). Het enige getal is 16 (stappen van punt tot punt).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Bu ipuçları neye dayanıyor</h2>
      <p>İpuçları, Leapstone'un oynattığı haliyle <a href="/tr/kurallar/cin-damasi">Çin daması kurallarından</a> çıkar: bir hamle bir adım ya da bir atlama zinciridir ve herhangi bir renkteki taşın üzerinden atlayabilirsin. Bunlar en iyi oyunun kanıtı değil. Denemenin en hızlı yolu bilgisayara karşı oynamaktır.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Merdiven kur</h2>
      <p>Merdiven, her biri arasında bir boş yer olan bir taş çizgisidir. Bir uçtaki taş bütün çizginin üzerinden tek hamlede atlar; böylece tahtayı sırada bir yer yerine tek sırada geçer.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Aralarında birer boş yer olan, çapraz bir çizgide dört taş. Bir uçtaki kırmızı taş dördünün de üzerinden atlıyor, dört numaralı iniş yeriyle.",
  tekst: "Tek hamlede dört atlama. Aynı taş adımla ancak birer yer ilerleyebilirdi.",
})}
      <p>Bir atlama altı yönün hepsinde, geriye doğru da çalışır; bu yüzden bir merdivenin kendi ucunda başlaması gerekmez. Aralarında boşluk olan her taş çizgisi işe yarar.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Taşlarını bir arada tut</h2>
      <p>10 taşın hepsinin hedefte olması gerekir, yani son taşın ne zaman bitireceğini belirler. Yanında hiç taş olmayan bir taşın üzerinden atlayacağı bir şey yoktur ve yalnızca adım atabilir.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Alt uçta tek başına duran bir kırmızı taşın bulunduğu yıldız tahta. Yalnızca boş olan iki komşusu işaretli. Ortada başka kırmızı ve mavi taşlar duruyor.",
  tekst: "Bu taşın komşusu yok, bu yüzden yalnızca işaretli iki yere adım atabilir.",
})}
      <p>Kendi ucunun tepesinden tahtanın karşısındaki hedefin tepesine 16 adımdır. Tek başına bir taş için bu 16 sıra demek, oysa bir merdiven tek sırada geçer. Arkadaki taşları, çevrelerinde hâlâ üzerinden atlanacak taşlar varken oynat. Leapstone'daki bilgisayar da bunu yapar: en arkadaki taşlarının hamlelerine biraz daha yüksek puan verir.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Ortayı kullan</h2>
      <p>Tahtanın ortasındaki bir taşın altı komşusu vardır, bu yüzden altı yönün hepsinde adım atabilir ya da atlayabilir. Kenardaki bir taşın daha azı vardır. Resimdeki kenardaki taşın dört tane.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Ortada altı işaretli komşusu olan bir kırmızı taşın ve sol üst kenarın yakınında dört işaretli komşusu olan bir kırmızı taşın bulunduğu yıldız tahta.",
  tekst: "Ortada altı adım yolu, kenarda dört.",
})}
      <p>Ortadaki taşlar, karşıya geçerken diğer taşlara da üzerinden atlayacak bir şey verir.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Hedefini arkadan doldur</h2>
      <p>Hedefin, 4, 3, 2 ve 1 yerlik sıralardan oluşan 10 yerlik bir üçgendir. Arkadaki yerlere yalnızca önlerindeki yerlerden ulaşılabilir. Önce öndekini doldurursan son taşın içeri girecek yolu olmayabilir.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Üstteki hedef ucunda dokuz kırmızı taş ve en arkada, kesik çizgilerle işaretli bir boş yer. Beyaz halkalı onuncu bir kırmızı taş ön sıranın altında duruyor.",
  tekst: "Dokuz taş evde ve arkadaki yer boş. Onuncu taşın oraya giden bir hamlesi yok.",
})}
      <p>İlk taşları arka yerlere koy ve öne doğru ilerle; böylece ön, en son gelen taşlar için açık kalır.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Hedefindeki bir taşı sıkıştırma</h2>
      <p>Başka bir oyuncunun ucunda durabilirsin, yani diğer oyuncunun bir taşı senin hedefinde kalabilir. Ancak hedefinin 10 yerinin hepsinde kendi taşların varsa kazanırsın. O taşın hamlesi yoksa kimse onu oynatamaz ve yanındaki bir yer açılana kadar kazanamazsın.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Üstteki hedef ucunda dokuz kırmızı taş ve en arkada beyaz halkayla işaretli bir mavi taş. Mavi taşın çevresi kırmızı taşlarla dolu.",
  tekst: "Arkadaki mavi taşın hamlesi yok ve kırmızı hedefi dolduramaz.",
})}
      <p>Böyle bir taşın yanındaki bir yeri açık tut, böylece çıkıp gidebilir. Leapstone'daki bilgisayar bunu hesaba katar: başka bir oyuncunun taşını kendi hedefinde sıkıştıran bir hamle daha düşük puan alır. Kurallar kimseyi senin hedefinden çıkmaya zorlamaz, bu yüzden diğer oyuncu da bir taşı oraya bilerek park edebilir.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Bir atlamayı engelle ya da bırak</h2>
      <p>Bir atlama için inilecek boş bir yer gerekir. O yeri doldurursan atlama ortadan kalkar. Üst üste iki taşın üzerinden de atlanamaz.</p>
      <p>Senin taşların diğer oyuncu için de basamaktır. Soldaki resimde mavi, iki kırmızı taşın üzerinden tek hamlede geçiyor. Sağda kırmızı bir taşını ilk iniş yerine koydu ve mavi yalnızca adım atabiliyor.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Bir çizgide bir mavi taş ve iki kırmızı taş; her kırmızı taşın arkasında bir boş yer var. Oklar mavi taşın iki atlamasını gösteriyor.",
          tekst: "Önce: mavi iki atlama yapabilir.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Kırmızı, uzaktaki taşını ilk iniş yerine oynattıktan sonra aynı çizgi. Mavi taşın arkasında üst üste iki kırmızı taş var.",
          tekst: "Sonra: kırmızı bir taşını oynattı. Mavinin atlaması yok.",
        })}
      </div>
      <p>Engellemek için harcanan hamle, kendi ilerlemen için harcanmayan hamledir; bu yüzden atlama diğer oyuncuya senin hamlenin sana vereceğinden fazlasını veriyorsa engelle. Merdiven kurarken bunun tersi geçerli: hamlenden sonra önce diğer oyuncu oynar, yani bir ucundaki taşı merdivenini senden önce kullanır. En zor seviyede bilgisayar, bir hamle seçmeden önce her rakibin en iyi cevabına bakar.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Devam et</h2>
      <ul>
        <li><a href="/play/">Tarayıcında bilgisayara karşı oyna</a> ve bir merdiven dene.</li>
        <li><a href="/tr/rehberler/cin-damasi-iki-kisilik">2 oyunculu Çin daması</a>: iki kişilik bir oyun nasıl işler.</li>
        <li><a href="/tr/kurallar/cin-damasi">Çin daması kuralları</a>, adımların, atlamaların ve zincirlerin resimleriyle.</li>
      </ul>
      <p><a href="/tr/rehberler/cin-damasi-arkadaslarla-online">Arkadaşlarla çevrimiçi Çin daması</a></p>
      <p><a href="/tr/rehberler/halma-mi-cin-damasi-mi">Halma ve Çin daması</a></p>
      <p><a href="/tr/rehberler/cin-damasi-uc-kisilik">3 oyunculu Çin daması</a></p>
    </section>`;

export default {
  nav: "Çin daması stratejisi",
  titel: "Çin daması stratejisi: resimli 6 ipucu | Leapstone",
  beschrijving: "Çin daması stratejisi: merdiven kur, taşları bir arada tut, ortayı kullan, hedefi arkadan doldur ve atlamayı engelle.",
  h1: "Çin daması stratejisi",
  intro: "Yıldız tahta için altı ipucu, her biri gerçek kurallardan bir resimle: merdivenler, geride kalanlar, orta, hedefi doldurmak ve atlamaları engellemek.",
  inhoud,
};
