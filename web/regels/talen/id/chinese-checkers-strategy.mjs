// Panduan Indonesia "Strategi dam Cina" (taak 134). Zin voor zin vertaald uit ../en/chinese-checkers-strategy.mjs.
// Elke tip is nagelopen tegen crates/halma-core (zie het Engelse bestand). Het enige getal is 16 (stappen van punt tot punt).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Dasar dari tips ini</h2>
      <p>Tips ini berasal dari <a href="/id/aturan/dam-cina">aturan dam Cina</a> seperti yang dimainkan Leapstone: satu langkah adalah satu geseran atau rangkaian lompatan, dan kamu bisa melompati bidak warna apa pun. Tips ini bukan bukti permainan terbaik. Bermain melawan komputer adalah cara tercepat untuk mencobanya.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Buat tangga</h2>
      <p>Tangga adalah garis bidak dengan satu petak kosong di antara setiap bidak. Sebuah bidak di salah satu ujung melompati seluruh garis dalam satu langkah, jadi dia menyeberangi papan dalam satu giliran, bukan satu petak per giliran.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Empat bidak dalam garis diagonal dengan satu petak kosong di antaranya. Sebuah bidak merah di salah satu ujung melompati keempatnya, dengan empat petak pendaratan bernomor.",
  tekst: "Empat lompatan dalam satu langkah. Bidak yang sama hanya bisa maju satu petak setiap kali.",
})}
      <p>Lompatan bisa ke keenam arah, juga ke belakang, jadi tangga tidak harus dimulai dari ujungmu sendiri. Garis bidak mana pun dengan celah di antaranya sudah cukup.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Jaga bidakmu tetap berdekatan</h2>
      <p>Kamu butuh semua 10 bidak di tujuanmu, jadi bidak terakhirmulah yang menentukan kapan kamu selesai. Bidak tanpa bidak lain di sebelahnya tidak punya apa pun untuk dilompati, dan hanya bisa menggeser.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Papan bintang dengan satu bidak merah sendirian di ujung bawah. Hanya dua tetangganya yang kosong yang ditandai. Bidak merah dan biru lainnya berdiri di tengah.",
  tekst: "Bidak ini tidak punya tetangga, jadi dia hanya bisa melangkah ke dua petak yang ditandai.",
})}
      <p>Dari puncak ujungmu sendiri ke puncak tujuan di seberang papan ada 16 langkah. Itu 16 giliran untuk satu bidak sendirian, sementara tangga menyeberang dalam satu giliran. Gerakkan bidak di belakang selagi masih ada bidak di sekitarnya untuk dilompati. Komputer di Leapstone juga melakukan ini: dia memberi nilai sedikit lebih tinggi pada langkah bidak-bidaknya yang paling belakang.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Manfaatkan bagian tengah</h2>
      <p>Bidak di tengah papan punya enam tetangga, jadi dia bisa menggeser atau melompat ke keenam arah. Bidak di tepi punya lebih sedikit. Bidak di tepi pada gambar punya empat.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Papan bintang dengan satu bidak merah di tengah dengan enam tetangga yang ditandai, dan satu bidak merah dekat tepi kiri atas dengan empat tetangga yang ditandai.",
  tekst: "Enam cara menggeser di tengah, empat di tepi.",
})}
      <p>Bidak di tengah juga memberi bidak lain sesuatu untuk dilompati saat menyeberang.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Isi tujuan dari belakang</h2>
      <p>Tujuanmu adalah segitiga berisi 10 petak, dalam baris 4, 3, 2, dan 1. Petak di belakang hanya bisa dicapai lewat petak di depannya. Jika kamu mengisi bagian depan lebih dulu, bidak terakhir mungkin tidak punya jalan masuk.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Ujung tujuan di atas dengan sembilan bidak merah dan satu petak kosong di paling belakang, ditandai dengan garis putus-putus. Bidak merah kesepuluh, dengan cincin putih, berdiri di bawah baris depan.",
  tekst: "Sembilan bidak sudah sampai, dan petak di belakang kosong. Bidak kesepuluh tidak punya langkah ke sana.",
})}
      <p>Taruh bidak pertama di petak belakang dan bekerjalah ke depan, supaya bagian depan tetap terbuka untuk bidak yang tiba paling akhir.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Jangan kurung bidak di tujuanmu</h2>
      <p>Kamu boleh berhenti di ujung pemain lain, jadi bidak pemain lain bisa berakhir di tujuanmu. Kamu menang hanya jika semua 10 petak tujuanmu berisi bidakmu sendiri. Jika bidak itu tidak punya langkah, tidak ada yang bisa menggerakkannya, dan kamu tidak bisa menang sampai ada petak di sebelahnya yang terbuka.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Ujung tujuan di atas dengan sembilan bidak merah dan satu bidak biru di paling belakang, ditandai dengan cincin putih. Bidak biru itu dikelilingi bidak merah.",
  tekst: "Bidak biru di belakang tidak punya langkah, dan merah tidak bisa mengisi tujuan.",
})}
      <p>Biarkan satu petak di sebelah bidak seperti itu terbuka, supaya dia bisa pergi. Komputer di Leapstone memperhitungkan hal ini: langkah yang mengurung bidak pemain lain di tujuannya sendiri mendapat nilai lebih rendah. Aturan tidak memaksa siapa pun meninggalkan tujuanmu, jadi pemain lain juga bisa sengaja memarkir bidak di sana.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Halangi lompatan, atau biarkan</h2>
      <p>Lompatan butuh petak kosong untuk mendarat. Isi petak itu dan lompatannya hilang. Dua bidak berurutan juga tidak bisa dilompati.</p>
      <p>Bidakmu juga jadi batu pijakan bagi pemain lain. Pada gambar kiri, biru menyeberangi dua bidak merah dalam satu langkah. Di kanan, merah memindahkan satu bidak ke petak pendaratan pertama, dan biru hanya bisa menggeser.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Sebuah bidak biru dengan dua bidak merah dalam satu garis, masing-masing dengan petak kosong di belakangnya. Anak panah menunjukkan dua lompatan oleh bidak biru.",
          tekst: "Sebelum: biru bisa melakukan dua lompatan.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Garis yang sama setelah merah memindahkan bidaknya yang jauh ke petak pendaratan pertama. Bidak biru diikuti dua bidak merah berurutan.",
          tekst: "Sesudah: merah memindahkan satu bidak. Biru tidak punya lompatan.",
        })}
      </div>
      <p>Langkah yang dipakai untuk menghalangi adalah langkah yang tidak dipakai untuk kemajuanmu sendiri, jadi halangi ketika lompatan itu memberi pemain lain lebih banyak daripada yang diberikan langkahmu kepadamu. Sebaliknya berlaku saat kamu membuat tangga: setelah langkahmu, pemain lain bergerak lebih dulu, jadi bidak mereka di salah satu ujung memakai tanggamu sebelum kamu. Di tingkat tersulit, komputer melihat balasan terbaik setiap lawan sebelum memilih langkah.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Lanjutkan</h2>
      <ul>
        <li><a href="/play/">Main melawan komputer di browser</a> dan coba sebuah tangga.</li>
        <li><a href="/id/panduan/dam-cina-2-pemain">Dam Cina untuk 2 pemain</a>: cara kerja permainan berdua.</li>
        <li><a href="/id/aturan/dam-cina">Aturan dam Cina</a>, dengan gambar geseran, lompatan, dan rangkaian.</li>
      </ul>
      <p><a href="/id/panduan/dam-cina-online-dengan-teman">Dam Cina online bersama teman</a></p>
      <p><a href="/id/panduan/halma-atau-dam-cina">Halma atau dam Cina</a></p>
      <p><a href="/id/panduan/dam-cina-3-pemain">Dam Cina untuk 3 pemain</a></p>
    </section>`;

export default {
  nav: "Strategi dam Cina",
  titel: "Strategi dam Cina: 6 tips dengan gambar | Leapstone",
  beschrijving: "Strategi dam Cina: buat tangga, jaga bidak berdekatan, manfaatkan tengah, isi tujuan dari belakang, dan tahu kapan menghalangi lompatan.",
  h1: "Strategi dam Cina",
  intro: "Enam tips untuk papan bintang, masing-masing dengan gambar dari aturan sebenarnya: tangga, bidak yang tertinggal, bagian tengah, mengisi tujuan, dan menghalangi lompatan.",
  inhoud,
};
