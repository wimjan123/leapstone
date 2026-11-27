// Het Thai van de pagina Sternhalma (taak 134). Inhoud: de Engelse pagina ../en/sternhalma.mjs (bronnen en wat bewust is weggelaten
// staan daar), zin voor zin. Wat Leapstone doet staat in crates/halma-core (Board::star, Board::square, Game).
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">ชื่อนี้หมายถึงอะไร</h2>
      <p>Sternhalma คือชื่อภาษาเยอรมันของ Halma ที่เล่นบนกระดานรูปดาว <em>Stern</em> ในภาษาเยอรมันแปลว่าดาว ส่วนชื่อหมากฮอสจีนคือเกมเดียวกันภายใต้ชื่อที่ตั้งขึ้นภายหลังในสหรัฐอเมริกา</p>
      <p>ใน Leapstone นี่คือ<strong>กระดานรูปดาว</strong> ซึ่งเป็นกระดานของ<a href="/th/rules/chinese-checkers">กติกาหมากฮอสจีน</a></p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">เกมนี้มาจากไหน</h2>
      <ul>
        <li><strong>Halma</strong> ถูกคิดค้นในปี 1883 หรือ 1884 โดยจอร์จ โฮเวิร์ด มองค์ส ศัลยแพทย์ชาวอเมริกัน ชื่อนี้เป็นภาษากรีกแปลว่า &ldquo;การกระโดด&rdquo; เล่นบนกระดานสี่เหลี่ยม <a href="/th/rules/halma">อ่านกติกา Halma</a></li>
        <li><strong>Stern-Halma</strong> ปรากฏขึ้นในเยอรมนีในปี 1892 เป็นแนวคิดเดียวกันบนกระดานรูปดาวหกแฉก</li>
        <li><strong>หมากฮอสจีน</strong> คือชื่อที่บิลและแจ็ก เพรสแมนตั้งให้เกมนี้ในสหรัฐอเมริกาในปี 1928 โดยเริ่มแรกเรียกว่า &ldquo;Hop Ching checkers&rdquo; เกมนี้ไม่มีความเกี่ยวข้องทางประวัติศาสตร์กับประเทศจีน และไม่ใช่เกมหมากฮอส</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">เกมเหล่านี้ต่างกันอย่างไร</h2>
      <ul>
        <li><strong>Halma:</strong> กระดานสี่เหลี่ยมขนาด 16 x 16 ช่อง สำหรับผู้เล่น 2 หรือ 4 คน ตัวหมากมีช่องข้างเคียงแปดช่อง ทั้งแนวตรงและทแยง เมื่อมีผู้เล่น 2 คน แต่ละคนมี 19 ตัว เมื่อมีผู้เล่น 4 คน มี 13 ตัว</li>
        <li><strong>Sternhalma และหมากฮอสจีน:</strong> กระดานรูปดาวที่มี 121 ช่อง สำหรับผู้เล่น 2, 3, 4 หรือ 6 คน ตัวหมากมีช่องข้างเคียงหกช่อง ทุกคนมี 10 ตัว</li>
        <li><strong>ส่วนที่เหลือเหมือนกัน:</strong> เดินหนึ่งช่องไปยังช่องข้างเคียงที่ว่าง หรือกระโดดข้ามตัวหมากหนึ่งตัว และกระโดดต่อเนื่องได้ ผู้เล่นคนแรกที่เติมค่ายฝั่งตรงข้ามของกระดานเต็มชนะ</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">รูปแบบอื่น และสิ่งที่ Leapstone ทำ</h2>
      <p>Halma เคยถูกเล่นมากกว่าหนึ่งแบบ นี่คือการเปรียบเทียบ Leapstone กับรูปแบบที่เราพบในแหล่งข้อมูลของเรา:</p>
      <ul>
        <li><strong>ขนาดกระดาน</strong> Halma ยังเล่นบนกระดานขนาด 8 x 8 และ 10 x 10 ด้วย Leapstone มีเพียงกระดานขนาด 16 x 16</li>
        <li><strong>การออกจากเป้าหมาย</strong> ในกติกา Halma แบบหนึ่ง ตัวหมากที่เข้าไปในค่ายของคู่ต่อสู้แล้วจะออกมาอีกไม่ได้ Leapstone ไม่มีกติกานี้: คุณเดินตัวหมากนั้นได้อีก</li>
        <li><strong>ผู้เล่นสามคนบนกระดานรูปดาว</strong> Halma สามผู้เล่นแบบเก่าบนกระดานรูปดาวมีบรรยายไว้ว่าคนละ 15 ตัว Leapstone เล่น 3 คนบนกระดานรูปดาวโดยคนละ 10 ตัว</li>
        <li><strong>การกระโดดเป็นทางเลือกของคุณ</strong> คุณไม่ต้องกระโดดเสมอไป คุณเลือกช่องที่ตาของคุณจบเอง</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">เล่นใน Leapstone</h2>
      <p>เล่นเลยจะเปิดเกมบนกระดานรูปดาวกับคอมพิวเตอร์ สำหรับกระดานสี่เหลี่ยม ให้แตะลูกศรย้อนกลับด้านบนแล้วเลือกกระดานสี่เหลี่ยมในเมนู</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "กระดานรูปดาวที่มีตัวหมากสีแดง 10 ตัวที่แฉกล่างและตัวหมากสีน้ำเงิน 10 ตัวที่แฉกบน",
  tekst: "กระดานรูปดาวสำหรับผู้เล่น 2 คน",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Sternhalma คืออะไร Halma บนกระดานรูปดาว | Leapstone",
  beschrijving: "Sternhalma คือชื่อภาษาเยอรมันของ Halma บนกระดานรูปดาว เกี่ยวข้องกับ Halma และหมากฮอสจีนอย่างไร ต่างกันอย่างไร และเล่นฟรีในเบราว์เซอร์ได้อย่างไร",
  h1: "Sternhalma, Halma และหมากฮอสจีน",
  intro: "สามชื่อสำหรับเกมที่เกี่ยวข้องกันอย่างใกล้ชิด แต่ละชื่อหมายถึงอะไร มาจากไหน และต่างกันอย่างไร",
  inhoud,
};
