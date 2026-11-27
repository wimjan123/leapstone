// Panduan Indonesia "Langkah pembuka dam Cina" (taak 303). Zin voor zin vertaald uit ../en/chinese-checkers-opening-moves.mjs.
// Elke zet en elk getal is nagelopen tegen crates/halma-core (zie het Engelse bestand). Alleen cijfers in de tekst, geen getalwoorden.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Langkah pertamamu: 14 pilihan</h2>
      <p>Di awal, 10 bidakmu mengisi sebuah segitiga dengan baris 4, 3, 2, dan 1, dan baris depan menghadap ke tengah papan. Tidak ada petak kosong di dalam segitiga, jadi sebuah bidak hanya bisa pindah ke baris tepat di depannya. Itu menyisakan 14 langkah pertama: tiap dari 4 bidak di baris depan bisa menggeser ke 2 petak (8 geseran), dan tiap dari 3 bidak di baris kedua bisa melompati bidak depan ke 2 petak (6 lompatan). 3 bidak lainnya belum bisa bergerak.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Puncak merah di bagian bawah dengan 10 bidaknya, dan di baris tepat di depannya 5 petak kosong yang ditandai dengan lingkaran.",
  tekst: "Setiap langkah pertama berakhir di salah satu dari 5 petak ini.",
})}
      <p>Dalam panduan ini, baris adalah garis petak yang melintang di puncakmu, sejajar dengan tepi depannya, dan kemajuan dihitung dalam baris. Satu geseran membawa bidak maju 1 baris dan satu lompatan membawanya 2 baris. Setiap pemain punya 14 langkah pertama yang sama, dengan 2, 3, 4, atau 6 pemain dan dari ujung bintang mana pun, karena dari dalam setiap ujung terlihat sama.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Pembuka 1: lompat keluar, lalu bebaskan pucuk</h2>
      <p>Bidak di pucuk puncakmu paling jauh dari tujuanmu, dan di awal ia tidak bisa bergerak: ia hanya bisa melompati bidak jika petak di belakang bidak itu kosong. Lompatan dari baris kedua membuat petak kosong seperti itu.</p>
      <ol>
        <li><strong>Langkah 1:</strong> bidak di ujung kanan baris keduamu melompati bidak di depannya. Ia mendarat di baris di depan puncakmu dan maju 2 baris.</li>
        <li><strong>Langkah 2:</strong> bidak di pucuk melompat dua kali dalam satu langkah: pertama ke petak yang dikosongkan langkah 1, lalu melompati bidak baris kedua. Ia maju 4 baris.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Puncak merah setelah langkah 1. Bidak di pucuk diberi lingkaran, dan 2 panah dengan angka 1 dan 2 menunjukkan lompatannya melewati petak yang dikosongkan ke baris di depan puncak.",
  tekst: "Setelah langkah 1, bidak pucuk melompat keluar dalam 2 lompatan.",
})}
      <p>Itu 6 baris dalam 2 langkah. Kami sudah mencoba semua cara memainkan 2 langkah, dan 6 adalah kemajuan terbanyak. Hanya 4 pasang langkah yang mencapainya: bidak di salah satu ujung baris kedua melompat, ke salah satu dari 2 arahnya, lalu bidak pucuk menyusul. Bidak di tengah baris kedua tidak cocok, karena ia membuat pucuk tetap terkurung.</p>
      <p>Kedua bidak kini berdiri di baris di depan puncakmu dengan satu petak kosong di antaranya. Itu adalah anak tangga pertama.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Pembuka 2: 4 langkah dengan 4 bidak berbeda</h2>
      <p>Dalam 4 langkah, kemajuan terbanyak adalah 13 baris, dan itu hanya tercapai jika setiap langkah memakai bidak yang berbeda. Urutan ini melakukannya:</p>
      <ol>
        <li><strong>Langkah 1:</strong> bidak di ujung kanan baris depan menggeser maju. Ia maju 1 baris.</li>
        <li><strong>Langkah 2:</strong> bidak di ujung kanan baris ketiga melompat dua kali. Ia maju 4 baris.</li>
        <li><strong>Langkah 3:</strong> bidak di ujung kiri baris kedua melompat dua kali. Ia maju 4 baris.</li>
        <li><strong>Langkah 4:</strong> bidak di pucuk melompat dua kali. Ia maju 4 baris.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Puncak merah di awal. 4 bidak yang akan bergerak diberi angka 1 sampai 4, sesuai urutan langkah.",
          tekst: "Sebelum: bidak yang bergerak, berurutan.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Puncak merah setelah 4 langkah, dengan 4 petak tempat bidak bernomor mendarat di baris di depan puncak, dan 4 lubang yang tertinggal di dalam puncak.",
          tekst: "Sesudah: tempat mereka mendarat.",
        })}
      </div>
      <p>Setiap langkah menyiapkan langkah berikutnya. Langkah 2 dan 3 berakhir dengan lompatan melewati bidak yang baru saja bergerak, dan langkah 4 dimulai lewat lubang yang ditinggalkan langkah 3. Semua 4 bidak mendarat di separuh papan milikmu sendiri.</p>
      <p>Ada urutan lain yang mencapai 13. Yang sama dari semuanya adalah idenya: cari langkah yang meninggalkan lubang atau pijakan untuk langkah berikutnya, dan keluarkan bidak pucuk paling lambat pada langkah 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Kesalahan di langkah-langkah pertama</h2>
      <ul class="tips">
        <li><strong>Menggerakkan bidak yang sama setiap giliran.</strong> Bidak yang berlari sendirian maju 5 baris dalam 4 langkah, dibandingkan 13 untuk 4 bidak berbeda. Ia juga membiarkan bidak-bidakmu yang lain tetap di tempatnya.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Puncak merah di awal. Satu bidak dari baris kedua melakukan 4 langkah berturut-turut di satu garis, dengan panah dan angka 1 sampai 4, dan berakhir sendirian dekat tengah papan.",
  tekst: "Satu bidak, 4 langkah, 5 baris.",
})}
      <ul class="tips">
        <li><strong>Hanya menggeser baris depan.</strong> 4 geseran maju 4 baris. Setelah itu bidak di pucuk masih tidak bisa bergerak, jadi ia tertinggal di belakang sementara yang lain maju.</li>
        <li><strong>Menggeser ke samping.</strong> Geseran sepanjang baris maju 0 baris. Setelah langkah 1 pembuka 1, bidak di depan bisa menggeser ke petak di sebelahnya, dan itu terlihat seperti kemajuan, tetapi langkahnya sia-sia.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Lanjutkan</h2>
      <p>Setelah sekitar 4 langkah, kedua pasukan saling mendekat, dan pembuka di atas berganti ke tengah permainan. Kamu tidak perlu menghafal urutannya: ingat saja bahwa setiap langkah harus menyiapkan langkah berikutnya.</p>
      <ul>
        <li><a href="/play/">Main melawan komputer di browser</a> dan coba pembuka 1 atau 2.</li>
        <li><a href="/id/panduan/dam-cina-strategi">Strategi dam Cina</a>: tangga, menjaga bidak tetap berdekatan, dan mengisi tujuan.</li>
        <li><a href="/id/panduan/dam-cina-2-pemain">Dam Cina untuk 2 pemain</a>: cara kerja permainan untuk dua orang.</li>
        <li><a href="/id/aturan/dam-cina">Aturan dam Cina</a>, dengan gambar geseran, lompatan, dan rangkaian.</li>
      </ul>
    </section>`;

export default {
  nav: "Langkah pembuka dam Cina",
  titel: "Langkah pembuka dam Cina: 2 pembuka | Leapstone",
  beschrijving: "Langkah pembuka dam Cina: cara melompat keluar dari puncakmu, membebaskan bidak pucuk di langkah 2, maju 13 baris dalam 4 langkah, dan kesalahan umum.",
  h1: "Langkah pembuka dam Cina",
  intro: "Pembuka yang baik di dam Cina melompat keluar dari baris kedua, memakai bidak berbeda setiap giliran, dan mengeluarkan bidak di pucukmu pada langkah 2 atau 4. Dua pembuka dengan gambar, dan kesalahan yang perlu dihindari.",
  inhoud,
};
