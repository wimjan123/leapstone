// Halaman Melayu "Apakah Sternhalma?" (taak 134): de naam, de relatie met Halma en dam Cina.
// Inhoud en bronnen: de Engelse pagina ../en/sternhalma.mjs (Wikipedia Halma en Chinese checkers, zie daar). Zin voor zin in het Maleis.
// Bewust weggelaten, net als in het Engels: wie Stern-Halma in 1892 uitgaf (bronnen verschillen) en patentjaren.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Maksud nama itu</h2>
      <p>Sternhalma ialah nama Jerman bagi Halma yang dimainkan pada papan berbentuk bintang. <em>Stern</em> bermaksud bintang dalam bahasa Jerman. Nama dam Cina ialah permainan yang sama dengan nama yang diberikan kemudian di Amerika Syarikat.</p>
      <p>Dalam Leapstone ini ialah <strong>papan bintang</strong>: papan bagi <a href="/ms/peraturan/dam-cina">peraturan dam Cina</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Asal-usulnya</h2>
      <ul>
        <li><strong>Halma</strong> dicipta pada 1883 atau 1884 oleh George Howard Monks, seorang pakar bedah Amerika. Namanya bermaksud &ldquo;lompat&rdquo; dalam bahasa Yunani. Ia dimainkan pada papan segi empat sama. <a href="/ms/peraturan/halma">Baca peraturan Halma</a>.</li>
        <li><strong>Stern-Halma</strong> muncul di Jerman pada 1892: idea yang sama pada papan berbentuk bintang berhujung enam.</li>
        <li><strong>Dam Cina</strong> ialah nama yang diberikan oleh Bill dan Jack Pressman kepada permainan ini di Amerika Syarikat pada 1928, pada mulanya sebagai &ldquo;Hop Ching checkers&rdquo;. Permainan ini tiada kaitan sejarah dengan China, dan ia bukan permainan dam.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Perbezaan antara permainan ini</h2>
      <ul>
        <li><strong>Halma:</strong> papan segi empat sama 16 kali 16 petak, untuk 2 atau 4 pemain. Sebuah buah mempunyai lapan jiran, lurus dan pepenjuru. Dengan 2 pemain setiap orang mempunyai 19 buah, dengan 4 pemain 13.</li>
        <li><strong>Sternhalma dan dam Cina:</strong> papan bintang 121 petak, untuk 2, 3, 4 atau 6 pemain. Sebuah buah mempunyai enam jiran. Semua orang mempunyai 10 buah.</li>
        <li><strong>Selebihnya sama:</strong> menganjak ke jiran yang kosong, atau melompat melepasi satu buah, dengan rangkaian lompatan. Pemain pertama yang memenuhkan kem di seberang papan menang.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varian, dan apa yang Leapstone lakukan</h2>
      <p>Halma telah dimainkan dengan lebih daripada satu cara. Beginilah Leapstone berbanding dengan varian yang kami temui dalam sumber kami:</p>
      <ul>
        <li><strong>Saiz papan.</strong> Halma juga dimainkan pada papan 8 kali 8 dan 10 kali 10. Leapstone hanya mempunyai papan 16 kali 16.</li>
        <li><strong>Meninggalkan matlamat.</strong> Dalam satu peraturan Halma, buah yang sudah masuk ke kem lawan tidak boleh keluar lagi. Leapstone tidak mempunyai peraturan ini: anda boleh menggerakkan buah seperti itu semula.</li>
        <li><strong>Tiga pemain pada bintang.</strong> Halma tiga pemain zaman dahulu pada papan bintang diperihalkan dengan 15 buah setiap seorang. Leapstone memainkan 3 pemain pada papan bintang dengan 10 buah setiap seorang.</li>
        <li><strong>Lompatan ialah pilihan anda.</strong> Anda tidak pernah wajib melompat. Anda memilih petak tempat langkah anda berakhir.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Mainkannya dalam Leapstone</h2>
      <p>Main sekarang membuka permainan pada papan bintang menentang komputer. Untuk papan segi empat sama, ketik anak panah kembali di bahagian atas dan pilih Papan segi empat sama dalam menu.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Papan bintang dengan 10 buah merah di hujung bawah dan 10 buah biru di hujung atas",
  tekst: "Papan bintang untuk 2 pemain.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Apakah Sternhalma? Halma pada papan bintang | Leapstone",
  beschrijving: "Sternhalma ialah nama Jerman bagi Halma pada papan bintang. Kaitannya dengan Halma dan dam Cina, dan cara memainkannya percuma dalam pelayar.",
  h1: "Sternhalma, Halma dan dam Cina",
  intro: "Tiga nama bagi permainan yang sangat berkait rapat. Maksud setiap satu, asal-usulnya, dan bagaimana ia berbeza.",
  inhoud,
};
