// આંકડામાં ચાઇનીઝ ચેકર્સ, Gujarati (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">જગ્યાઓ અને ગોટીઓ</h2>
      <p>Leapstone ના બંને બોર્ડ પર, રમતની શરૂઆતની ગોઠવણીમાં ગણેલું.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "તારા આકારનું બોર્ડ, જેની છએ છ ટોચ ભરેલી છે: ખાલી વચ્ચેના ભાગની આસપાસ છ રંગોમાંથી દરેક રંગની દસ ગોટીઓ.",
  tekst: "છ ખેલાડીઓની રમતની શરૂઆતમાં તારા આકારનું બોર્ડ.",
})}
      <ul class="tips">
        <li><strong>તારા આકારના બોર્ડ પર ${f("sterbord_vakken")} જગ્યાઓ છે.</strong> દરેક ખેલાડી ${f("sterbord_stenen_per_speler")} ગોટીઓથી શરૂ કરે છે. એટલે બે ખેલાડીઓની રમતમાં બોર્ડ પર ${f("sterbord_stenen_2_spelers")} ગોટીઓ હોય છે, ત્રણની રમતમાં ${f("sterbord_stenen_3_spelers")}, ચારની રમતમાં ${f("sterbord_stenen_4_spelers")} અને છની રમતમાં ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Halma ના ચોરસ બોર્ડ પર ${f("vierkant_vakken")} જગ્યાઓ છે.</strong> બે ખેલાડીઓની રમતમાં દરેક ખેલાડી ${f("vierkant_stenen_per_speler_2_spelers")} ગોટીઓથી શરૂ કરે છે, કુલ ${f("vierkant_stenen_2_spelers")}. ચારની રમતમાં દરેક જણ ${f("vierkant_stenen_per_speler_4_spelers")} ગોટીઓથી શરૂ કરે છે, કુલ ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">કૂદકાની સૌથી લાંબી સાંકળ: ${f("langste_sprongketen")}</h2>
      <p>તારા આકારના બોર્ડ પર એક ગોટી <strong>એક જ ચાલમાં ${f("langste_sprongketen")} કૂદકા</strong> મારી શકે છે, અને Leapstone ના નિયમો મુજબ કોઈ ચાલમાં આનાથી વધુ કૂદકા હોઈ શકતા નથી. આ સંખ્યા સુધી પહોંચવા માટે બાકીની ગોટીઓ મરજી મુજબ મૂકેલી છે: ગોટી જે દરેક જગ્યા પરથી કૂદે છે, તે દરેક પર એક.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "એક લાલ ગોટી અને ઘણી વાદળી ગોટીઓવાળું તારા આકારનું બોર્ડ. સફેદ તીર બતાવે છે કે લાલ ગોટી એક લાંબા, વાંકાચૂકા રસ્તે એક પછી એક વાદળી ગોટી પરથી કૂદે છે.",
  tekst: "સૌથી લાંબી સાંકળ: લાલ ગોટી દરેક વાદળી ગોટી પરથી, એક પછી એક, કૂદે છે.",
})}
      <p><strong>આ કેવી રીતે ગણ્યું.</strong> કૂદકો હંમેશા સીધી લીટીમાં બે જગ્યા આગળ ઊતરે છે. એટલે કૂદતી રહેતી ગોટી ફક્ત અમુક જગ્યાઓ સુધી પહોંચી શકે છે: બોર્ડ આવા ચાર જૂથોમાં વહેંચાઈ જાય છે, અને સૌથી મોટા જૂથમાં ${f("grootste_klasse_vakken")} જગ્યાઓ છે. Leapstone માં એક ગોટી એક ચાલમાં એક જ જગ્યા પર બે વાર ઊતરી શકતી નથી, અને જ્યાંથી નીકળી હતી તે જગ્યા પર પણ નહીં. એટલે એક સાંકળ પોતાના જૂથની બીજી દરેક જગ્યા પર વધુમાં વધુ એક વાર ઊતરે છે. પ્રોગ્રામે એ જૂથ શોધ્યું અને બધી ${f("grootste_klasse_vakken")} જગ્યાઓમાંથી પસાર થતો રસ્તો મળ્યો, એટલે કોઈ સાંકળ આનાથી લાંબી ન હોઈ શકે: ${f("langste_sprongketen")} કૂદકા. પછી એક ટેસ્ટ એ ચાલ Leapstone ના નિયમોથી રમે છે.</p>
      <p><strong>આ અસલ રમત નથી.</strong> આ સાંકળ માટે બીજી ${f("langste_sprongketen")} ગોટીઓ જોઈએ, દરેક બરાબર સાચી જગ્યા પર. બે કે ત્રણ ખેલાડીઓની રમતમાં ફક્ત ${f("sterbord_stenen_2_spelers")} કે ${f("sterbord_stenen_3_spelers")} ગોટીઓ હોય છે, જે બહુ ઓછી છે. ચાર કે છ ખેલાડીઓની રમતમાં ${f("sterbord_stenen_4_spelers")} કે ${f("sterbord_stenen_6_spelers")} હોય છે, જે પૂરતી છે. પણ અસલ રમતમાં કોઈ ગોટીઓ મરજી મુજબ મૂકતું નથી, એટલે રમતી વખતે આ સાંકળની આશા ન રાખો. તે બતાવે છે કે બોર્ડ શું થવા દે છે, રમતમાં શું થાય છે તે નહીં.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">સૌથી ટૂંકું સામે પાર જવું: ${f("oversteek_zetten")} ચાલ</h2>
      <p>તારા આકારના બોર્ડ પર એકલા એક ખેલાડીને, વિરોધીઓ વગર, પોતાની બધી ${f("sterbord_stenen_per_speler")} ગોટીઓ એક ટોચથી સામેની ટોચ સુધી લઈ જવા <strong>${f("oversteek_zetten")} ચાલ</strong> જોઈએ, અને તે આનાથી ઓછામાં કરી શકતો નથી. કૂદકાની આખી સાંકળ એક ચાલ ગણાય છે.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "તારા આકારનું બોર્ડ, જેની નીચેની ટોચમાં ફક્ત દસ લાલ ગોટીઓ છે. ઉપરની ટોચ, જ્યાં તેમને જવાનું છે, તેની કિનારી તૂટક લીટીની છે.",
  tekst: "એકલો એક ખેલાડી: નીચેની ટોચમાં દસ ગોટીઓ, અને ઉપરની ટોચ લક્ષ્ય છે.",
})}
      <p><strong>આ કેવી રીતે ગણ્યું.</strong> એક ટેસ્ટ Leapstone ના નિયમોથી ${f("oversteek_zetten")} ચાલમાં સામે પાર જવાનું રમે છે, બોર્ડ પર બીજી કોઈ ગોટી વગર. ${f("geen_oversteek_in_zetten")} કે તેનાથી ઓછી ચાલ પૂરતી નથી એ બતાવવા એક શોધ G. I. Bell ની રીત અનુસરે છે (<em>Integers</em> 9, 2009). દરેક ચાલ ઊલટી રમી શકાય છે, અને બોર્ડને અડધું ફેરવવાથી શરૂઆત અને લક્ષ્ય અદલાબદલ થાય છે. એટલે જો ${f("geen_oversteek_in_zetten")} કે તેનાથી ઓછી ચાલમાં સામે પાર જવાતું હોત, તો અડધા રસ્તાની કોઈ સ્થિતિ શરૂઆતથી વધુમાં વધુ ${f("zoekdiepte_zetten")} ચાલ દૂર હોત, અને અડધી ફેરવેલી એ જ સ્થિતિ પણ. શોધે શરૂઆતથી ${f("zoekdiepte_zetten")} ચાલની અંદરની દરેક સ્થિતિ જોઈ, એક સ્થિતિ અને તેના અરીસાના પ્રતિબિંબને એક વાર ગણ્યાં, જે સ્થિતિઓ સાબિત રીતે સમયસર પૂરતી આગળ જઈ શકતી નથી તે છોડી દીધી, અને આવી કોઈ જોડી ન મળી. તે ${f("gemeten_kernen")} કોરવાળા મશીન પર ${f("gemeten_rekentijd_seconden")} સેકન્ડ ચાલી, અને તેના સૌથી મોટા તબક્કામાં ${f("gemeten_geheugen_gb")} GB મેમરીમાં ${f("gemeten_grootste_laag_miljoen_standen")} મિલિયન સ્થિતિઓ હતી. આ સંખ્યા Leapstone ના પોતાના બોર્ડ માટે ફરીથી ગણી કાઢી છે.</p>
      <p><strong>અસલ રમતની નીચલી મર્યાદા નહીં.</strong> અસલ રમતમાં બીજા ખેલાડીઓની ગોટીઓ પણ બોર્ડ પર હોય છે, અને તમારી ગોટીઓ તેમની પરથી કૂદી શકે છે. એટલે ${f("oversteek_zetten")} એ અસલ રમતમાં લાગી શકે તેટલું સૌથી ઓછું નથી: તે ફક્ત એકલા એક ખેલાડી માટે સાબિત છે.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">જાતે અજમાવો</h2>
      <p><a href="/play/">Leapstone બ્રાઉઝરમાં રમો</a> કમ્પ્યુટર સામે, અથવા આ પાનાની ઉપરનાં બટનોથી એપ લો. નિયમો માટે <a href="/gu/rules/chinese-checkers">ચાઇનીઝ ચેકર્સના નિયમો</a> કે <a href="/gu/rules/halma">Halma ના નિયમો</a> વાંચો. રમતમાં કૂદકાની સાંકળો કેવી રીતે વાપરવી, તે <a href="/gu/guides/chinese-checkers-strategy">વ્યૂહરચનાની ટિપ્સ</a> માં વાંચો.</p>
    </section>`;

export default {
  nav: "આંકડામાં ચાઇનીઝ ચેકર્સ",
  titel: "આંકડામાં ચાઇનીઝ ચેકર્સ | Leapstone",
  beschrijving: `તારા આકારના બોર્ડ પર ${c.sterbord_vakken} જગ્યાઓ છે. એક ચાલમાં વધુમાં વધુ ${c.langste_sprongketen} કૂદકા, અને એકલા ખેલાડીને સામે પાર જવા ${c.oversteek_zetten} ચાલ જોઈએ. દરેક સંખ્યા કેવી રીતે મળી.`,
  h1: "આંકડામાં ચાઇનીઝ ચેકર્સ",
  intro: `ચાઇનીઝ ચેકર્સના તારા આકારના બોર્ડ પર ${f("sterbord_vakken")} જગ્યાઓ છે, અને દરેક ખેલાડી ${f("sterbord_stenen_per_speler")} ગોટીઓથી શરૂ કરે છે. Leapstone માં એક ચાલમાં ક્યારેય ${f("langste_sprongketen")} થી વધુ કૂદકા હોઈ શકતા નથી. બોર્ડ પર એકલા એક ખેલાડીને, વિરોધીઓ વગર, તેને પાર કરવા ${f("oversteek_zetten")} ચાલ જોઈએ. નીચે તમે જોઈ શકો છો કે દરેક સંખ્યા કેવી રીતે ગણી, અને તે અસલ રમત વિશે શું કહે છે અને શું નથી કહેતી.`,
  inhoud,
};
