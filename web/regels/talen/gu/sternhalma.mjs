// De Gujarati pagina Sternhalma (taak 134): de naam, de relatie met Halma en Chinese checkers. Inhoud: ../en/sternhalma.mjs, zin voor zin.
// Bronnen en wat bewust is weggelaten: zie het kopcommentaar van ../en/sternhalma.mjs.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">નામનો અર્થ શું છે</h2>
      <p>Sternhalma એ તારા આકારના બોર્ડ પર રમાતી Halmaનું જર્મન નામ છે. <em>Stern</em> એટલે જર્મનમાં તારો. ચાઇનીઝ ચેકર્સ નામ એ જ રમતનું છે, જે પછીથી યુનાઇટેડ સ્ટેટ્સમાં અપાયું હતું.</p>
      <p>Leapstoneમાં આ <strong>તારા આકારનું બોર્ડ</strong> છે: <a href="/gu/rules/chinese-checkers">ચાઇનીઝ ચેકર્સના નિયમો</a>નું બોર્ડ.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">તે ક્યાંથી આવે છે</h2>
      <ul>
        <li><strong>Halma</strong> ની શોધ 1883 કે 1884માં જ્યોર્જ હાવર્ડ મોન્ક્સે કરી, જે એક અમેરિકન સર્જન હતા. નામ ગ્રીક ભાષામાં &ldquo;કૂદકો&rdquo; માટે છે. તે ચોરસ બોર્ડ પર રમાય છે. <a href="/gu/rules/halma">Halma ના નિયમો વાંચો</a>.</li>
        <li><strong>Stern-Halma</strong> 1892માં જર્મનીમાં આવી: છ ટોચવાળા તારા જેવા આકારના બોર્ડ પર એ જ વિચાર.</li>
        <li><strong>ચાઇનીઝ ચેકર્સ</strong> એ નામ છે જે બિલ અને જેક પ્રેસમેને 1928માં યુનાઇટેડ સ્ટેટ્સમાં રમતને આપ્યું, શરૂઆતમાં &ldquo;Hop Ching checkers&rdquo; તરીકે. રમતનો ચીન સાથે કોઈ ઐતિહાસિક સંબંધ નથી, અને તે ચેકર્સ (ડ્રાફ્ટ્સ) જેવી રમત પણ નથી.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">રમતો કેવી રીતે અલગ છે</h2>
      <ul>
        <li><strong>Halma:</strong> 16 બાય 16 જગ્યાઓનું ચોરસ બોર્ડ, 2 કે 4 ખેલાડીઓ માટે. ગોટીને આઠ પાડોશી હોય છે, સીધા અને ત્રાંસા. 2 ખેલાડીઓ સાથે દરેક પાસે 19 ગોટીઓ હોય છે, 4 ખેલાડીઓ સાથે 13.</li>
        <li><strong>Sternhalma અને ચાઇનીઝ ચેકર્સ:</strong> 121 જગ્યાઓનું તારા આકારનું બોર્ડ, 2, 3, 4 કે 6 ખેલાડીઓ માટે. ગોટીને છ પાડોશી હોય છે. દરેક પાસે 10 ગોટીઓ હોય છે.</li>
        <li><strong>બાકીનું બધું સરખું છે:</strong> ખાલી પાડોશીમાં એક ડગલું, અથવા એક ગોટી પરથી કૂદકો, કૂદકાની સાંકળો સાથે. બોર્ડની સામેની છાવણી પહેલા ભરનાર ખેલાડી જીતે છે.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">જુદા જુદા પ્રકારો, અને Leapstone શું કરે છે</h2>
      <p>Halma એક કરતાં વધુ રીતે રમાય છે. અમારા સ્રોતોમાં મળેલા પ્રકારો સાથે Leapstone આ રીતે સરખાય છે:</p>
      <ul>
        <li><strong>બોર્ડનું કદ.</strong> Halma 8 બાય 8 અને 10 બાય 10 બોર્ડ પર પણ રમાય છે. Leapstoneમાં ફક્ત 16 બાય 16 બોર્ડ છે.</li>
        <li><strong>લક્ષ્ય છોડવું.</strong> Halmaના એક નિયમમાં, વિરોધીની છાવણીમાં પ્રવેશેલી ગોટી ફરી બહાર જઈ શકતી નથી. Leapstoneમાં આ નિયમ નથી: તમે એવી ગોટીને ફરી ચલાવી શકો છો.</li>
        <li><strong>તારા પર ત્રણ ખેલાડીઓ.</strong> તારા આકારના બોર્ડ પરની જૂની ત્રણ ખેલાડીઓની Halma દરેકને 15 ગોટીઓ સાથે વર્ણવાયેલી છે. Leapstone તારા આકારના બોર્ડ પર 3 ખેલાડીઓ સાથે રમાડે છે, દરેકને 10 ગોટીઓ સાથે.</li>
        <li><strong>કૂદકા તમારી પસંદગી છે.</strong> તમારે ક્યારેય કૂદવું પડતું નથી. તમારી ચાલ ક્યાં પૂરી થાય તે જગ્યા તમે પસંદ કરો છો.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstoneમાં રમો</h2>
      <p>હમણાં રમો તારા આકારના બોર્ડ પર કમ્પ્યુટર સામેની રમત ખોલે છે. ચોરસ બોર્ડ માટે, ઉપર પાછળના તીર પર ટેપ કરો અને મેનુમાંથી ચોરસ બોર્ડ પસંદ કરો.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "તારા આકારનું બોર્ડ, નીચેની ટોચ પર 10 લાલ ગોટીઓ અને ઉપરની ટોચ પર 10 વાદળી ગોટીઓ સાથે",
  tekst: "2 ખેલાડીઓ માટેનું તારા આકારનું બોર્ડ.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Sternhalma શું છે? તારા આકારના બોર્ડ પર Halma | Leapstone",
  beschrijving: "Sternhalma એ તારા આકારના બોર્ડ પરની Halmaનું જર્મન નામ છે. તે Halma અને ચાઇનીઝ ચેકર્સ સાથે કેવી રીતે જોડાયેલું છે, શું અલગ છે, અને બ્રાઉઝરમાં મફત કેવી રીતે રમવું.",
  h1: "Sternhalma, Halma અને ચાઇનીઝ ચેકર્સ",
  intro: "એકબીજા સાથે નજીકથી જોડાયેલી રમતોના ત્રણ નામ. દરેકનો અર્થ શું છે, તે ક્યાંથી આવે છે, અને તે કેવી રીતે અલગ છે.",
  inhoud,
};
