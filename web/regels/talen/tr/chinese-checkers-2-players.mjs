// Türkçe rehber "2 oyunculu Çin daması" (taak 134). Zin voor zin vertaald uit ../en/chinese-checkers-2-players.mjs.
// Regels, niveaus en menu's: zie de bronverwijzingen in het Engelse bestand.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Oyun nasıl başlar</h2>
      <p>Her oyuncunun 10 taşı vardır. Taşlar, yıldızın birbirine bakan iki ucunda başlar: kırmızı altta, mavi üstte. 20 taş, 121 yerlik bir tahtada durur.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Alt uçta 10 kırmızı taşın, üst uçta 10 mavi taşın bulunduğu yıldız tahta",
  tekst: "Kırmızı altta, mavi üstte başlar.",
})}
      <p>Kırmızı olan 1. Oyuncu ilk oynar. Sonra sırayla, birer hamle oynarsınız. Bir hamle, bir taşla bir adım ya da bir atlama zinciridir. Adımlar ve atlamalar için <a href="/tr/kurallar/cin-damasi">Çin daması kurallarına</a> bak.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Hedefin, diğer oyuncunun başlangıcı</h2>
      <p>10 taşının hepsini diğer oyuncunun başladığı uca götürürsen kazanırsın. O uç onun taşlarıyla dolu başlar, seninki de seninkilerle. Kırmızı için bu, yukarıdaki resimdeki üst uçtur.</p>
      <p>Yalnızca boş bir yere inebilirsin, bu yüzden her biriniz diğeri doldurmadan önce kendi ucunu terk etmelisiniz. Diğerinin bir taşı hedefte kaldığı sürece ikiniz de bitiremezsiniz. Ve aynı ortadan ters yönlerde geçtiğiniz için, diğer oyuncunun taşları senin için, seninkiler de onun için basamaktır. Bununla ne yapacağın için <a href="/tr/rehberler/cin-damasi-strateji">strateji ipuçlarını</a> oku.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Kazanmak ve pes etmek</h2>
      <ul>
        <li><strong>Kazanmak:</strong> hedefi 10 taşıyla ilk dolduran kazanır ve oyun hemen biter. Diğer oyuncu oynamaya devam etmez.</li>
        <li><strong>Pes etmek:</strong> taşların tahtadan çıkar ve diğer oyuncu kazanır.</li>
        <li><strong>Süre (çevrimiçi):</strong> çevrimiçi bir oyunda her hamlenin bir süre sınırı vardır. Süren dolarsa sıran atlanır. Üst üste 3 sıranı kaçırırsan pes etmiş sayılırsın.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">3, 4 ve 6 oyuncu nasıl farklı</h2>
      <ul>
        <li><strong>3 oyuncu:</strong> taşlar birer atlayarak her uçta başlar ve üç hedef boş başlar. Bitiren ilk oyuncu kazanır; diğerleri sonraki sıralar için oynamaya devam eder ve işi bitmiş oyuncunun sırası atlanır.</li>
        <li><strong>4 oyuncu:</strong> yan yana iki çift uç. Hedefin, başka bir oyuncunun taşlarıyla dolu başlar. Oyun, 3 oyuncuda olduğu gibi ilk bitirenden sonra sürer.</li>
        <li><strong>6 oyuncu:</strong> altı ucun hepsi. Tahtada 60 taş var; 2 oyuncuyla 20.</li>
      </ul>
      <p>Tahtada yalnızca 20 taş olunca üzerinden atlanacak daha az taş vardır, bu yüzden kendi kurduğun merdivenler daha çok önem taşır. <a href="/tr/kurallar/cin-damasi">Kurallar sayfasında</a> her başlangıcın resmi var.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstone'da 2 oyuncuyla nerede oynanır</h2>
      <ul>
        <li><strong>Bilgisayara karşı, hemen şimdi:</strong> <a href="/play/">Leapstone'u tarayıcında</a> aç, Bilgisayar'a dokun ve yıldız tahtayı seç. Varsayılan bir bilgisayardır, yani bu 2 kişilik bir oyundur. Kolay, Normal veya Zor seçersin ve 1. Oyuncu sensin, yani ilk sen oynarsın. Kolay, üç rastgele hamlenin en iyisini seçer. Normal, hedefine doğru en çok ilerleme sağlayan hamleyi seçer. Zor ayrıca rakiplerinin nasıl cevap verebileceğine ve kendi sonraki hamlesine de bakar.</li>
        <li><strong>Uygulamada çevrimiçi oyna:</strong> senin seviyendeki başka bir oyuncuya karşı, hamle başına 30 saniyeyle, yıldız tahtada 2 oyuncuyla hızlı bir oyun. Bazı çevrimiçi rakipler bilgisayar oyuncusu olabilir.</li>
        <li><strong>Bir arkadaşla:</strong> bir davet bağlantısı gönder ve hamle başına süreyi kendin belirle. Ya da tek bir telefonu elden ele geçirin.</li>
      </ul>
      <p><a href="/tr/rehberler/cin-damasi-arkadaslarla-online">Arkadaşlarla çevrimiçi Çin daması</a></p>
      <p><a href="/tr/rehberler/cin-damasi-uc-kisilik">3 oyunculu Çin daması</a></p>
    </section>`;

export default {
  nav: "2 oyunculu Çin daması",
  titel: "2 oyunculu Çin daması: kurulum ve kurallar | Leapstone",
  beschrijving: "Çin daması 2 oyuncuyla nasıl işler: 10 taş nerede başlar, kim ilk oynar, nasıl kazanılır ya da pes edilir ve 3, 4 veya 6 oyuncudan farkı.",
  h1: "2 oyunculu Çin daması",
  intro: "Yıldız tahtada iki kişilik bir oyun nasıl işler: kurulum, kimin ilk oynadığı, nasıl kazanılacağı ve nerede oynanabileceği.",
  inhoud,
};
