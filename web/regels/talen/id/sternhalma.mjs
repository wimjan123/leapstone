// Halaman Indonesia "Apa itu Sternhalma?" (taak 134): de naam, de relatie met Halma en dam Cina.
// Inhoud en bronnen: de Engelse pagina ../en/sternhalma.mjs (Wikipedia Halma en Chinese checkers, zie daar). Zin voor zin in het Indonesisch.
// Bewust weggelaten, net als in het Engels: wie Stern-Halma in 1892 uitgaf (bronnen verschillen) en patentjaren.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Arti namanya</h2>
      <p>Sternhalma adalah nama bahasa Jerman untuk Halma yang dimainkan di papan berbentuk bintang. <em>Stern</em> berarti bintang dalam bahasa Jerman. Nama dam Cina adalah permainan yang sama dengan nama yang diberikan kemudian di Amerika Serikat.</p>
      <p>Di Leapstone ini adalah <strong>papan bintang</strong>: papan dari <a href="/id/aturan/dam-cina">aturan dam Cina</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Asal-usulnya</h2>
      <ul>
        <li><strong>Halma</strong> ditemukan pada 1883 atau 1884 oleh George Howard Monks, seorang ahli bedah Amerika. Namanya berarti &ldquo;lompat&rdquo; dalam bahasa Yunani. Permainan ini dimainkan di papan persegi. <a href="/id/aturan/halma">Baca aturan Halma</a>.</li>
        <li><strong>Stern-Halma</strong> muncul di Jerman pada 1892: gagasan yang sama di papan berbentuk bintang berujung enam.</li>
        <li><strong>Dam Cina</strong> adalah nama yang diberikan Bill dan Jack Pressman untuk permainan ini di Amerika Serikat pada 1928, awalnya sebagai &ldquo;Hop Ching checkers&rdquo;. Permainan ini tidak punya kaitan sejarah dengan Cina, dan bukan permainan dam.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Perbedaan permainannya</h2>
      <ul>
        <li><strong>Halma:</strong> papan persegi 16 kali 16 petak, untuk 2 atau 4 pemain. Sebuah bidak punya delapan tetangga, lurus dan diagonal. Dengan 2 pemain masing-masing punya 19 bidak, dengan 4 pemain 13.</li>
        <li><strong>Sternhalma dan dam Cina:</strong> papan bintang 121 petak, untuk 2, 3, 4, atau 6 pemain. Sebuah bidak punya enam tetangga. Semua orang punya 10 bidak.</li>
        <li><strong>Selebihnya sama:</strong> menggeser ke tetangga yang kosong, atau melompati satu bidak, dengan rangkaian lompatan. Pemain pertama yang mengisi kamp di seberang papan menang.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varian, dan apa yang dilakukan Leapstone</h2>
      <p>Halma dimainkan dengan lebih dari satu cara. Beginilah Leapstone dibandingkan dengan varian yang kami temukan di sumber-sumber kami:</p>
      <ul>
        <li><strong>Ukuran papan.</strong> Halma juga dimainkan di papan 8 kali 8 dan 10 kali 10. Leapstone hanya punya papan 16 kali 16.</li>
        <li><strong>Meninggalkan tujuan.</strong> Dalam salah satu aturan Halma, bidak yang sudah masuk ke kamp lawan tidak boleh keluar lagi. Leapstone tidak punya aturan ini: kamu bisa menggerakkan bidak seperti itu lagi.</li>
        <li><strong>Tiga pemain di bintang.</strong> Halma tiga pemain zaman dulu di papan bintang digambarkan dengan masing-masing 15 bidak. Leapstone memainkan 3 pemain di papan bintang dengan masing-masing 10 bidak.</li>
        <li><strong>Lompatan itu pilihanmu.</strong> Kamu tidak pernah wajib melompat. Kamu memilih petak tempat langkahmu berakhir.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Mainkan di Leapstone</h2>
      <p>Main sekarang membuka permainan di papan bintang melawan komputer. Untuk papan persegi, ketuk panah kembali di bagian atas dan pilih Papan persegi di menu.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Papan bintang dengan 10 bidak merah di ujung bawah dan 10 bidak biru di ujung atas",
  tekst: "Papan bintang untuk 2 pemain.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Apa itu Sternhalma? Halma di papan bintang | Leapstone",
  beschrijving: "Sternhalma adalah nama bahasa Jerman untuk Halma di papan bintang. Kaitannya dengan Halma dan dam Cina, dan cara memainkannya gratis di browser.",
  h1: "Sternhalma, Halma, dan dam Cina",
  intro: "Tiga nama untuk permainan yang sangat mirip. Apa arti masing-masing, dari mana asalnya, dan apa bedanya.",
  inhoud,
};
