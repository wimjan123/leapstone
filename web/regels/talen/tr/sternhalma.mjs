// Türkçe sayfa "Sternhalma nedir?" (taak 134): de naam, de relatie met Halma en Çin daması.
// Inhoud en bronnen: de Engelse pagina ../en/sternhalma.mjs (Wikipedia Halma en Chinese checkers, zie daar). Zin voor zin in het Turks.
// Bewust weggelaten, net als in het Engels: wie Stern-Halma in 1892 uitgaf (bronnen verschillen) en patentjaren.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Adın anlamı</h2>
      <p>Sternhalma, yıldız biçimli bir tahtada oynanan Halma'nın Almanca adıdır. <em>Stern</em> Almancada yıldız demektir. Çin daması adı, aynı oyunun daha sonra Amerika Birleşik Devletleri'nde verilen adıdır.</p>
      <p>Leapstone'da bu, <strong>yıldız tahtadır</strong>: <a href="/tr/kurallar/cin-damasi">Çin daması kurallarının</a> tahtası.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Nereden geliyor</h2>
      <ul>
        <li><strong>Halma</strong>, 1883 ya da 1884'te Amerikalı bir cerrah olan George Howard Monks tarafından icat edildi. Adı Yunancada &ldquo;sıçramak&rdquo; demektir. Kare bir tahtada oynanır. <a href="/tr/kurallar/halma">Halma kurallarını oku</a>.</li>
        <li><strong>Stern-Halma</strong> 1892'de Almanya'da ortaya çıktı: aynı fikir, altı köşeli bir yıldız biçimli tahtada.</li>
        <li><strong>Çin daması</strong>, Bill ve Jack Pressman'ın oyuna 1928'de Amerika Birleşik Devletleri'nde verdiği addır; önce &ldquo;Hop Ching checkers&rdquo; olarak. Oyunun Çin'le tarihsel bir bağı yoktur ve bir dama oyunu da değildir.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Oyunlar nasıl ayrılır</h2>
      <ul>
        <li><strong>Halma:</strong> 16'ya 16 yerlik kare bir tahta, 2 veya 4 oyuncu için. Bir taşın düz ve çapraz sekiz komşusu vardır. 2 oyuncuyla herkesin 19, 4 oyuncuyla 13 taşı vardır.</li>
        <li><strong>Sternhalma ve Çin daması:</strong> 121 yerlik bir yıldız tahta, 2, 3, 4 veya 6 oyuncu için. Bir taşın altı komşusu vardır. Herkesin 10 taşı vardır.</li>
        <li><strong>Gerisi aynı:</strong> boş bir komşuya adım ya da bir taşın üzerinden atlama, atlama zincirleriyle birlikte. Tahtanın karşısındaki kampı ilk dolduran kazanır.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varyantlar ve Leapstone'un yaptığı</h2>
      <p>Halma birden fazla biçimde oynanmıştır. Leapstone'un, kaynaklarımızda bulduğumuz varyantlarla karşılaştırması şöyle:</p>
      <ul>
        <li><strong>Tahta boyutu.</strong> Halma 8'e 8 ve 10'a 10 tahtalarda da oynanır. Leapstone'da yalnızca 16'ya 16 tahta var.</li>
        <li><strong>Hedeften çıkmak.</strong> Bir Halma kuralında, rakibin kampına girmiş bir taş oradan bir daha çıkamaz. Leapstone'da bu kural yok: böyle bir taşı yine oynatabilirsin.</li>
        <li><strong>Yıldızda üç oyuncu.</strong> Yıldız tahtada oynanan eski bir üç oyunculu Halma, herkesin 15 taşıyla anlatılır. Leapstone, yıldız tahtada 3 oyuncuyu herkesin 10 taşıyla oynatır.</li>
        <li><strong>Atlamak sana kalmış.</strong> Hiçbir zaman atlamak zorunda değilsin. Hamlenin biteceği yeri sen seçersin.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstone'da oyna</h2>
      <p>Şimdi oyna, yıldız tahtada bilgisayara karşı bir oyun açar. Kare tahta için en üstteki geri okuna dokun ve menüden Kare tahtayı seç.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Alt uçta 10 kırmızı taşın, üst uçta 10 mavi taşın bulunduğu yıldız tahta",
  tekst: "2 oyuncu için yıldız tahta.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Sternhalma nedir? Yıldız tahtada Halma | Leapstone",
  beschrijving: "Sternhalma, yıldız tahtada oynanan Halma'nın Almanca adıdır. Halma ve Çin damasıyla ilişkisi, farkları ve tarayıcında ücretsiz nasıl oynanacağı.",
  h1: "Sternhalma, Halma ve Çin daması",
  intro: "Birbirine çok yakın oyunların üç adı. Her birinin ne anlama geldiği, nereden geldikleri ve nasıl ayrıldıkları.",
  inhoud,
};
