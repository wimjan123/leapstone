// Türkçe 6 oyunculu Çin daması rehberi (taak 302). Metin ../en/chinese-checkers-6-players.mjs dosyasını cümle cümle izler.
// Kurallar crates/halma-core'dan gelir (Board::star ve start_points(6), Game::new_star(6), make_move, skip_turn, resign, ranking), süre sınırı "Techniek" bölümünden.
// Her iddianın kontrolü docs/plan.md içinde, taak 302 altında.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Oyun nasıl başlar</h2>
      <p>Her oyuncunun 10 taşı vardır ve yıldızın 6 ucunun hepsi kullanılır. Bu, 121 yerlik tahtada 60 taş demektir. Ortadaki 61 yer başlangıçta boştur.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Yıldız tahta: 6 ucun her birinde 10 taş var, 6 farklı renkte",
  tekst: "6 oyuncu, 6 uç, 60 taş.",
})}
      <p>Kırmızı olan 1. Oyuncu alt uçtan ilk oynar. Sıra sonra 1. Oyuncu'dan 6. Oyuncu'ya gider ve 6. Oyuncu'dan sonra yine 1. Oyuncu oynar. Oyuncular, yıldızın çevresindeki uçlarının sırasına göre numaralanmıştır; bu yüzden senden sonraki oyuncu her zaman seninkinin yanındaki uçtan başlar. Bir hamle, bir taşla bir adım ya da bir atlama zinciridir. Adımlar ve atlamalar için <a href="/tr/kurallar/cin-damasi">Çin daması kurallarına</a> bak.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Her hedef başlangıçta doludur</h2>
      <p>10 taşının hepsini tahtanın karşısındaki uca götürürsen kazanırsın. 6 oyuncuyla bu uç, tam karşındaki oyuncunun başladığı uçtur; bu yüzden hiçbir hedef boş değildir: her hedef, başka bir oyuncunun taşlarıyla dolu başlar. Kırmızı için hedef, 4. Oyuncu'nun başladığı üst uçtur.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Yıldız tahta: 6 uç da dolu. Kesik çizgili bir halka, kırmızı oyuncunun hedefi olan ve karşıdaki oyuncunun taşlarını taşıyan üst ucu gösteriyor.",
  tekst: "Kırmızının hedefi karşıdaki uçtur ve 4. Oyuncu'nun taşlarıyla doludur.",
})}
      <p>Yalnızca boş bir yere inebilirsin, bu yüzden sen onun ucunu doldurmadan önce karşıdaki oyuncu kendi ucunu terk etmelidir, onun da senin ucunu doldurmadan önce sen kendi ucunu terk etmelisin. 2 kişilik bir oyunda işin tamamı bundan ibarettir. 6 oyuncuda ise ikiniz de ayrıca diğer 4 oyuncunun oluşturduğu kalabalıktan geçmek zorundasınız.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Kalabalık bir orta</h2>
      <p>Her hedef tahtanın karşı tarafındadır ve uçlar birbirine yalnızca ortadan bağlanır; bu yüzden 60 taşın hepsi aynı 61 yerden geçmek zorundadır. Başlangıçta henüz kimse karşıya geçmemiştir ve orta hızla dolar.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Kırmızı bir taş tek hamlede üç kez atlıyor: önce mavi bir taşın, sonra yeşil bir taşın, sonra mor bir taşın üzerinden. 1, 2 ve 3 rakamları iniş yerlerini gösteriyor.",
  tekst: "Her renkten taş birer basamaktır.",
})}
      <p>Her renkten taşın üzerinden atlayabilirsin. Diğer 5 oyuncunun taşları senin için, seninkiler de bu 5 oyuncunun hepsi için basamaktır. Ortada bıraktığın bir taş sırası, ona ulaşabilen herkes için bir merdivendir ve senden sonraki oyuncu ilk sırayı alır.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">5 rakibe karşı engelleme</h2>
      <ul>
        <li><strong>İniş yerini doldur:</strong> bir atlama için taşın hemen arkasında boş bir yer gerekir. Oraya bir taş koyduğunda, o atlamayı isteyen her oyuncu için atlama ortadan kalkar.</li>
        <li><strong>Kurduğun merdivenlere dikkat et:</strong> hamlenden sonra sıra yeniden sana gelmeden önce diğer 5 oyuncu oynar. Bir merdiven hepsine yardım eder.</li>
        <li><strong>Herkes bir hedefi engelleyebilir:</strong> hedefindeki başka herhangi bir oyuncunun taşı, yalnızca karşıdaki oyuncunun taşı değil, oyunu bitirmeni engeller. Hedefin 10 yerinin hepsinde kendi taşların olmalıdır.</li>
      </ul>
      <p><a href="/tr/rehberler/cin-damasi-strateji">Strateji ipuçları</a>, engellenmiş bir atlamanın nasıl göründüğünü ve başka bir oyuncunun taşını kendi hedefinde nasıl kilitlemeyeceğini gösterir.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Bir oyun ne kadar sürer</h2>
      <p>6 oyunculu bir oyunda oynatılacak 60 taş vardır ve bir hamlenle sonraki hamlen arasında diğer 5 oyuncu birer hamle yapar. Ayrıca oyun, ilk oyuncu bitirdiğinde sona ermez.</p>
      <ul>
        <li><strong>Kazan ve oynamaya devam et:</strong> hedefi ilk dolduran oyuncu kazanır, diğerleri sonraki sıralar için oynamaya devam eder. İşi biten oyuncunun sırası atlanır ve o oyuncunun taşları basamak olarak tahtada kalır. Oyun, yalnızca bir oyuncu oynamaya devam ettiğinde biter.</li>
        <li><strong>Pes etmek:</strong> taşların tahtadan çıkar, bu yüzden artık kimseyi engellemez ya da kimseye yardım etmez ve diğerleri oynamaya devam eder.</li>
        <li><strong>Süre (çevrimiçi):</strong> çevrimiçi bir oyunda her hamlenin, oyunu başlatan oyuncunun belirlediği bir süre sınırı vardır: 15 saniye, 30 saniye, 1 dakika, 2 dakika ya da sınırsız. 6 hamlelik bir tur en çok sınırın 6 katı sürer; yani 30 saniyeyle en çok 3 dakika. Süren dolarsa sıran atlanır. Üst üste 3 sıranı kaçırırsan pes etmiş sayılırsın ve oyun sensiz devam eder.</li>
      </ul>
      <p>Daha az oyunculu bir oyun için <a href="/tr/rehberler/cin-damasi-iki-kisilik">2 oyunculu Çin daması</a> rehberini oku.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstone'da 6 oyuncuyla nerede oynanır</h2>
      <ul>
        <li><strong>Bilgisayara karşı, hemen şimdi:</strong> <a href="/play/">Leapstone'u tarayıcında</a> aç, Bilgisayar'a dokun, yıldız tahtayı ve 5 bilgisayarı seç. 1. Oyuncu sensin, yani ilk sen oynarsın. Bilgisayarlar sırayla, her biri kısa bir aradan sonra oynar; böylece her hamleyi takip edebilirsin. Bilgisayarlar için Kolay, Normal veya Zor seçersin.</li>
        <li><strong>Tek bir telefonda:</strong> Oyna'ya dokun, yıldız tahtayı ve 6 oyuncuyu seç, sonra o yeri bir kişi ile bir bilgisayar arasında değiştirmek için bir taşa dokun.</li>
        <li><strong>Arkadaşlarla çevrimiçi:</strong> Arkadaşlar'a dokun, yıldız tahtayı, 6 oyuncuyu ve hamle başına süreyi seç ve davet bağlantısını gönder. Oyun, 6 yerin hepsi dolduğunda başlar.</li>
        <li><strong>Hızlı oyunlar:</strong> Çevrimiçi oyna, 2 veya 4 oyunculu oyunlar bulur; yani 6 oyuncu için hızlı oyun yoktur.</li>
      </ul>
    </section>`;

export default {
  nav: "6 oyunculu Çin daması",
  titel: "6 oyunculu Çin daması: tam tahta | Leapstone",
  beschrijving: "Çin daması 6 oyuncuyla nasıl işler: 60 taşla dolu bir yıldız, kalabalık bir orta, engelleme, bir oyunun ne kadar sürdüğü ve nerede oynanacağı.",
  h1: "6 oyunculu Çin daması",
  intro: "6 kişilik bir oyun nasıl işler: 6 uç da dolu, tahtanın karşısındaki uca koşarsın ve ilk oyuncu bitirdikten sonra oyun sürer.",
  inhoud,
};
