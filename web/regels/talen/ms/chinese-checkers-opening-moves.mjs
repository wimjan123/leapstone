// Panduan Melayu "Langkah pembukaan dam Cina" (taak 303). Zin voor zin vertaald uit ../en/chinese-checkers-opening-moves.mjs.
// Elke zet en elk getal is nagelopen tegen crates/halma-core (zie het Engelse bestand). Alleen cijfers in de tekst, geen getalwoorden.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Langkah pertama anda: 14 pilihan</h2>
      <p>Pada permulaan, 10 buah anda memenuhi sebuah segi tiga dengan barisan 4, 3, 2 dan 1, dan barisan hadapan menghadap ke tengah papan. Tiada petak kosong di dalam segi tiga itu, jadi sebuah buah hanya boleh bergerak ke barisan tepat di hadapannya. Itu meninggalkan 14 langkah pertama: setiap satu daripada 4 buah di barisan hadapan boleh menganjak ke 2 petak (8 anjakan), dan setiap satu daripada 3 buah di barisan kedua boleh melompat melepasi sebuah buah hadapan ke 2 petak (6 lompatan). 3 buah yang lain belum boleh bergerak.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Hujung merah di bahagian bawah dengan 10 buahnya, dan di barisan tepat di hadapannya 5 petak kosong yang ditandakan dengan bulatan.",
  tekst: "Setiap langkah pertama berakhir di salah satu daripada 5 petak ini.",
})}
      <p>Dalam panduan ini, barisan ialah garisan petak yang melintang di hujung anda, selari dengan tepi hadapannya, dan kemajuan dikira dalam barisan. Satu anjakan membawa buah ke hadapan 1 barisan dan satu lompatan membawanya 2 barisan. Setiap pemain mempunyai 14 langkah pertama yang sama, dengan 2, 3, 4 atau 6 pemain dan dari mana-mana hujung bintang, kerana setiap hujung kelihatan sama dari dalam.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Pembukaan 1: melompat keluar, kemudian bebaskan puncak</h2>
      <p>Buah di puncak hujung anda paling jauh dari matlamat anda, dan ia tidak boleh bergerak pada permulaan: ia hanya boleh melompat melepasi sebuah buah jika petak di belakang buah itu kosong. Lompatan dari barisan kedua menghasilkan petak kosong seperti itu.</p>
      <ol>
        <li><strong>Langkah 1:</strong> buah di hujung kanan barisan kedua anda melompat melepasi buah di hadapannya. Ia mendarat di barisan di hadapan hujung anda dan maju 2 barisan.</li>
        <li><strong>Langkah 2:</strong> buah di puncak melompat dua kali dalam satu langkah: mula-mula ke petak yang dikosongkan oleh langkah 1, kemudian melepasi sebuah buah di barisan kedua. Ia maju 4 barisan.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Hujung merah selepas langkah 1. Buah di puncak diberi bulatan, dan 2 anak panah dengan nombor 1 dan 2 menunjukkan lompatannya melalui petak yang dikosongkan ke barisan di hadapan hujung itu.",
  tekst: "Selepas langkah 1, buah puncak melompat keluar dalam 2 lompatan.",
})}
      <p>Itu 6 barisan dalam 2 langkah. Kami telah mencuba setiap cara bermain 2 langkah, dan 6 ialah kemajuan paling banyak. Hanya 4 pasang langkah yang mencapainya: buah di mana-mana hujung barisan kedua melompat, ke salah satu daripada 2 arahnya, dan buah puncak menyusul. Buah di tengah barisan kedua tidak sesuai, kerana ia membiarkan puncak terkurung.</p>
      <p>Kedua-dua buah kini berdiri di barisan di hadapan hujung anda dengan satu petak kosong di antaranya. Itulah anak tangga pertama.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Pembukaan 2: 4 langkah dengan 4 buah berbeza</h2>
      <p>Dalam 4 langkah, kemajuan paling banyak ialah 13 barisan, dan ia hanya tercapai jika setiap langkah menggunakan buah yang berbeza. Urutan ini melakukannya:</p>
      <ol>
        <li><strong>Langkah 1:</strong> buah di hujung kanan barisan hadapan menganjak ke hadapan. Ia maju 1 barisan.</li>
        <li><strong>Langkah 2:</strong> buah di hujung kanan barisan ketiga melompat dua kali. Ia maju 4 barisan.</li>
        <li><strong>Langkah 3:</strong> buah di hujung kiri barisan kedua melompat dua kali. Ia maju 4 barisan.</li>
        <li><strong>Langkah 4:</strong> buah di puncak melompat dua kali. Ia maju 4 barisan.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Hujung merah pada permulaan. 4 buah yang akan bergerak diberi nombor 1 hingga 4, mengikut urutan langkah.",
          tekst: "Sebelum: buah yang bergerak, mengikut urutan.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Hujung merah selepas 4 langkah, dengan 4 petak tempat buah bernombor mendarat di barisan di hadapan hujung itu, dan 4 lubang yang tertinggal di dalam hujung.",
          tekst: "Selepas: tempat mereka mendarat.",
        })}
      </div>
      <p>Setiap langkah menyediakan langkah seterusnya. Langkah 2 dan 3 berakhir dengan lompatan melepasi buah yang baru bergerak, dan langkah 4 bermula melalui lubang yang ditinggalkan oleh langkah 3. Semua 4 buah mendarat di separuh papan anda sendiri.</p>
      <p>Ada urutan lain yang mencapai 13. Yang sama pada semuanya ialah idea itu: cari langkah yang meninggalkan lubang atau batu loncatan untuk langkah seterusnya, dan keluarkan buah puncak selewat-lewatnya pada langkah 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Kesilapan dalam langkah pertama</h2>
      <ul class="tips">
        <li><strong>Menggerakkan buah yang sama setiap giliran.</strong> Buah yang berlari sendirian maju 5 barisan dalam 4 langkah, berbanding 13 untuk 4 buah berbeza. Ia juga membiarkan buah anda yang lain kekal di tempatnya.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Hujung merah pada permulaan. Satu buah dari barisan kedua membuat 4 langkah berturut-turut pada satu garisan, dengan anak panah dan nombor 1 hingga 4, dan berakhir bersendirian berhampiran tengah papan.",
  tekst: "Satu buah, 4 langkah, 5 barisan.",
})}
      <ul class="tips">
        <li><strong>Hanya menganjak barisan hadapan.</strong> 4 anjakan memajukan 4 barisan. Selepas itu buah di puncak masih tidak boleh bergerak, jadi ia tertinggal di belakang sementara yang lain maju.</li>
        <li><strong>Menganjak ke sisi.</strong> Anjakan sepanjang barisan memajukan 0 barisan. Selepas langkah 1 pembukaan 1, buah di hadapan boleh menganjak ke petak di sebelahnya, dan ia kelihatan seperti kemajuan, tetapi langkah itu sia-sia.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Teruskan</h2>
      <p>Selepas kira-kira 4 langkah, kedua-dua pasukan menghampiri satu sama lain, dan pembukaan di atas bertukar kepada pertengahan permainan. Anda tidak perlu menghafal urutan itu: ingat sahaja bahawa setiap langkah harus menyediakan langkah seterusnya.</p>
      <ul>
        <li><a href="/play/">Main menentang komputer dalam pelayar anda</a> dan cuba pembukaan 1 atau 2.</li>
        <li><a href="/ms/panduan/dam-cina-strategi">Strategi dam Cina</a>: tangga, memastikan buah anda berdekatan dan mengisi matlamat anda.</li>
        <li><a href="/ms/panduan/dam-cina-2-pemain">Dam Cina untuk 2 pemain</a>: cara permainan untuk dua orang berfungsi.</li>
        <li><a href="/ms/peraturan/dam-cina">Peraturan dam Cina</a>, dengan gambar anjakan, lompatan dan rangkaian.</li>
      </ul>
    </section>`;

export default {
  nav: "Langkah pembukaan dam Cina",
  titel: "Langkah pembukaan dam Cina: 2 pembukaan | Leapstone",
  beschrijving: "Langkah pembukaan dam Cina: cara melompat keluar dari hujung anda, membebaskan buah puncak pada langkah 2, maju 13 barisan dalam 4 langkah dan kesilapan.",
  h1: "Langkah pembukaan dam Cina",
  intro: "Pembukaan yang baik dalam dam Cina melompat keluar dari barisan kedua, menggunakan buah berbeza setiap giliran, dan mengeluarkan buah di puncak anda pada langkah 2 atau 4. Dua pembukaan dengan gambar, dan kesilapan yang perlu dielakkan.",
  inhoud,
};
