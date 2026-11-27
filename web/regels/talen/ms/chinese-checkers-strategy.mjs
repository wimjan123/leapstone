// Panduan Melayu "Strategi dam Cina" (taak 134). Zin voor zin vertaald uit ../en/chinese-checkers-strategy.mjs.
// Elke tip is nagelopen tegen crates/halma-core (zie het Engelse bestand). Het enige getal is 16 (stappen van punt tot punt).
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Asas petua ini</h2>
      <p>Petua ini bersumberkan <a href="/ms/peraturan/dam-cina">peraturan dam Cina</a> seperti yang dimainkan oleh Leapstone: satu langkah ialah satu anjakan atau rangkaian lompatan, dan anda boleh melompat melepasi buah daripada warna apa pun. Ia bukan bukti permainan terbaik. Bermain menentang komputer ialah cara paling pantas untuk mencubanya.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Bina tangga</h2>
      <p>Tangga ialah garisan buah dengan satu petak kosong di antara setiap buah. Sebuah buah di salah satu hujung melompat melepasi seluruh garisan dalam satu langkah, jadi ia merentasi papan dalam satu giliran dan bukannya satu petak setiap giliran.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Empat buah dalam garisan pepenjuru dengan satu petak kosong di antaranya. Sebuah buah merah di satu hujung melompat melepasi kesemua empat, dengan empat petak pendaratan bernombor.",
  tekst: "Empat lompatan dalam satu langkah. Buah yang sama hanya dapat bergerak satu petak pada satu masa.",
})}
      <p>Lompatan boleh dibuat ke keenam-enam arah, termasuk ke belakang, jadi tangga tidak semestinya bermula di hujung anda sendiri. Mana-mana garisan buah dengan jurang di antaranya sudah memadai.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Pastikan buah anda berdekatan</h2>
      <p>Anda memerlukan kesemua 10 buah di matlamat anda, jadi buah terakhir andalah yang menentukan bilakah anda selesai. Buah tanpa sebarang buah di sebelahnya tiada apa-apa untuk dilompati, dan hanya boleh menganjak.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Papan bintang dengan sebuah buah merah bersendirian di hujung bawah. Hanya dua jirannya yang kosong ditandakan. Buah merah dan biru yang lain berdiri di tengah.",
  tekst: "Buah ini tiada jiran, jadi ia hanya boleh melangkah ke dua petak yang ditandakan.",
})}
      <p>Dari puncak hujung anda sendiri ke puncak matlamat di seberang papan ialah 16 langkah. Itu 16 giliran bagi satu buah yang bersendirian, sedangkan tangga merentasinya dalam satu giliran. Gerakkan buah di belakang selagi masih ada buah di sekelilingnya untuk dilompati. Komputer dalam Leapstone juga berbuat demikian: ia memberi skor sedikit lebih tinggi kepada langkah buahnya yang paling belakang.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Gunakan bahagian tengah</h2>
      <p>Buah di tengah papan mempunyai enam jiran, jadi ia boleh menganjak atau melompat ke keenam-enam arah. Buah di tepi mempunyai lebih sedikit. Buah di tepi dalam gambar mempunyai empat.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Papan bintang dengan sebuah buah merah di tengah dengan enam jiran yang ditandakan, dan sebuah buah merah berhampiran tepi kiri atas dengan empat jiran yang ditandakan.",
  tekst: "Enam cara menganjak di tengah, empat di tepi.",
})}
      <p>Buah di tengah juga memberi buah lain sesuatu untuk dilompati ketika merentasi papan.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Penuhkan matlamat dari belakang</h2>
      <p>Matlamat anda ialah segi tiga dengan 10 petak, dalam baris 4, 3, 2 dan 1. Petak di belakang hanya boleh dicapai melalui petak di hadapannya. Jika anda memenuhkan bahagian hadapan dahulu, buah terakhir mungkin tiada jalan masuk.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Hujung matlamat di atas dengan sembilan buah merah dan satu petak kosong di paling belakang, ditandakan dengan garis putus-putus. Buah merah kesepuluh, dengan cincin putih, berdiri di bawah baris hadapan.",
  tekst: "Sembilan buah sudah sampai, dan petak di belakang kosong. Buah kesepuluh tiada langkah ke sana.",
})}
      <p>Letakkan buah pertama di petak belakang dan bekerja ke hadapan, supaya bahagian hadapan kekal terbuka untuk buah yang tiba paling akhir.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Jangan kurung buah di matlamat anda</h2>
      <p>Anda boleh berhenti di hujung pemain lain, jadi buah pemain lain boleh berakhir di matlamat anda. Anda menang hanya apabila kesemua 10 petak matlamat anda berisi buah anda sendiri. Jika buah itu tiada langkah, tiada sesiapa dapat menggerakkannya, dan anda tidak boleh menang sehingga sebuah petak di sebelahnya terbuka.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Hujung matlamat di atas dengan sembilan buah merah dan sebuah buah biru di paling belakang, ditandakan dengan cincin putih. Buah biru itu dikelilingi oleh buah merah.",
  tekst: "Buah biru di belakang tiada langkah, dan merah tidak dapat memenuhkan matlamat.",
})}
      <p>Biarkan satu petak di sebelah buah seperti itu terbuka, supaya ia boleh pergi. Komputer dalam Leapstone mengambil kira perkara ini: langkah yang mengurung buah pemain lain di matlamatnya sendiri mendapat skor lebih rendah. Peraturan tidak memaksa sesiapa meninggalkan matlamat anda, jadi pemain lain juga boleh meletakkan sebuah buah di sana dengan sengaja.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Halang lompatan, atau biarkan</h2>
      <p>Lompatan memerlukan petak kosong untuk mendarat. Penuhkan petak itu dan lompatan itu hilang. Dua buah berturut-turut juga tidak boleh dilompati.</p>
      <p>Buah anda juga menjadi batu loncatan bagi pemain lain. Dalam gambar kiri, biru merentasi dua buah merah dalam satu langkah. Di kanan, merah mengalihkan sebuah buah ke petak pendaratan pertama, dan biru hanya boleh menganjak.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Sebuah buah biru dengan dua buah merah dalam satu garisan, masing-masing dengan petak kosong di belakangnya. Anak panah menunjukkan dua lompatan oleh buah biru.",
          tekst: "Sebelum: biru boleh membuat dua lompatan.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Garisan yang sama selepas merah mengalihkan buahnya yang jauh ke petak pendaratan pertama. Buah biru diikuti oleh dua buah merah berturut-turut.",
          tekst: "Selepas: merah mengalihkan sebuah buah. Biru tiada lompatan.",
        })}
      </div>
      <p>Langkah yang digunakan untuk menghalang ialah langkah yang tidak digunakan untuk kemajuan anda sendiri, jadi halang apabila lompatan itu memberi pemain lain lebih banyak daripada yang akan diberikan oleh langkah anda kepada anda. Sebaliknya berlaku apabila anda membina tangga: selepas langkah anda, pemain lain bergerak dahulu, jadi buah mereka di salah satu hujung menggunakan tangga anda sebelum anda. Pada tahap paling sukar, komputer melihat balasan terbaik setiap lawan sebelum memilih langkah.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Teruskan</h2>
      <ul>
        <li><a href="/play/">Main menentang komputer dalam pelayar</a> dan cuba sebuah tangga.</li>
        <li><a href="/ms/panduan/dam-cina-2-pemain">Dam Cina untuk 2 pemain</a>: cara permainan berdua berfungsi.</li>
        <li><a href="/ms/peraturan/dam-cina">Peraturan dam Cina</a>, dengan gambar anjakan, lompatan dan rangkaian.</li>
      </ul>
      <p><a href="/ms/panduan/dam-cina-dalam-talian-dengan-rakan">Dam Cina dalam talian dengan rakan</a></p>
      <p><a href="/ms/panduan/halma-atau-dam-cina">Halma atau dam Cina</a></p>
      <p><a href="/ms/panduan/dam-cina-3-pemain">Dam Cina untuk 3 pemain</a></p>
    </section>`;

export default {
  nav: "Strategi dam Cina",
  titel: "Strategi dam Cina: 6 petua dengan gambar | Leapstone",
  beschrijving: "Strategi dam Cina: bina tangga, pastikan buah berdekatan, gunakan tengah, penuhkan matlamat dari belakang, dan bila hendak menghalang lompatan.",
  h1: "Strategi dam Cina",
  intro: "Enam petua untuk papan bintang, masing-masing dengan gambar daripada peraturan sebenar: tangga, buah tertinggal, bahagian tengah, memenuhkan matlamat dan menghalang lompatan.",
  inhoud,
};
