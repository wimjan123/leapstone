// हिन्दी pagina Sternhalma (taak 134). Inhoud: de Engelse pagina ../en/sternhalma.mjs (bronnen en wat Leapstone doet: zie daar en
// docs/plan.md, taak 117), zin voor zin in het Hindi. Wijzig je een regel, wijzig dan elke taal.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">नाम का मतलब</h2>
      <p>Sternhalma तारे के आकार के बोर्ड पर खेले जाने वाले Halma का जर्मन नाम है। जर्मन में <em>Stern</em> का अर्थ तारा है। चाइनीज़ चेकर्स वही खेल है, जिसे बाद में अमेरिका में यह नाम दिया गया।</p>
      <p>Leapstone में यह <strong>तारे के आकार का बोर्ड</strong> है: <a href="/hi/rules/chinese-checkers">चाइनीज़ चेकर्स के नियमों</a> का बोर्ड।</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">यह कहाँ से आया</h2>
      <ul>
        <li><strong>Halma</strong> का आविष्कार 1883 या 1884 में जॉर्ज हॉवर्ड मॉन्क्स ने किया, जो एक अमेरिकी सर्जन थे। यह नाम यूनानी भाषा में &ldquo;कूद&rdquo; का अर्थ रखता है। यह चौकोर बोर्ड पर खेला जाता है। <a href="/hi/rules/halma">Halma के नियम पढ़ें</a>।</li>
        <li><strong>Stern-Halma</strong> 1892 में जर्मनी में आया: वही विचार, छह नोकों वाले तारे के आकार के बोर्ड पर।</li>
        <li><strong>चाइनीज़ चेकर्स</strong> वह नाम है जो बिल और जैक प्रेसमैन ने 1928 में अमेरिका में इस खेल को दिया, शुरू में &ldquo;Hop Ching checkers&rdquo; के रूप में। इस खेल का चीन से कोई ऐतिहासिक संबंध नहीं है, और यह चेकर्स का खेल भी नहीं है।</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">खेलों में अंतर</h2>
      <ul>
        <li><strong>Halma:</strong> 16 गुणा 16 जगहों का चौकोर बोर्ड, 2 या 4 खिलाड़ियों के लिए। एक गोटी के आठ पड़ोसी होते हैं, सीधे और तिरछे। 2 खिलाड़ियों में हर एक के पास 19 गोटियाँ होती हैं, 4 खिलाड़ियों में 13।</li>
        <li><strong>Sternhalma और चाइनीज़ चेकर्स:</strong> 121 जगहों का तारे के आकार का बोर्ड, 2, 3, 4 या 6 खिलाड़ियों के लिए। एक गोटी के छह पड़ोसी होते हैं। सबके पास 10 गोटियाँ होती हैं।</li>
        <li><strong>बाकी सब एक जैसा है:</strong> खाली पड़ोसी पर एक कदम, या एक गोटी के ऊपर से कूद, और कूदों की शृंखलाएँ। जो खिलाड़ी सबसे पहले बोर्ड के सामने वाले कैंप को भर देता है, वह जीतता है।</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">रूप, और Leapstone क्या करता है</h2>
      <p>Halma एक से ज़्यादा तरीकों से खेला गया है। हमारे स्रोतों में मिले रूपों से Leapstone की तुलना इस तरह है:</p>
      <ul>
        <li><strong>बोर्ड का आकार।</strong> Halma 8 गुणा 8 और 10 गुणा 10 के बोर्ड पर भी खेला जाता है। Leapstone में सिर्फ़ 16 गुणा 16 का बोर्ड है।</li>
        <li><strong>लक्ष्य से बाहर जाना।</strong> Halma के एक नियम में, जो गोटी विरोधी के कैंप में पहुँच गई, वह उससे फिर बाहर नहीं जा सकती। Leapstone में यह नियम नहीं है: आप ऐसी गोटी को फिर चला सकते हैं।</li>
        <li><strong>तारे पर तीन खिलाड़ी।</strong> तारे के आकार के बोर्ड पर तीन खिलाड़ियों वाले एक पुराने Halma का वर्णन हर एक के लिए 15 गोटियों के साथ मिलता है। Leapstone तारे के आकार के बोर्ड पर 3 खिलाड़ियों को हर एक की 10 गोटियों के साथ खिलाता है।</li>
        <li><strong>कूदना आपकी मर्ज़ी है।</strong> आपको कभी कूदना ज़रूरी नहीं होता। आपकी चाल जिस जगह खत्म हो, उसे आप चुनते हैं।</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Leapstone में खेलें</h2>
      <p>अभी खेलें बटन तारे के आकार के बोर्ड पर कंप्यूटर के खिलाफ़ एक खेल खोलता है। चौकोर बोर्ड के लिए ऊपर वापसी का तीर दबाएँ और मेनू में चौकोर बोर्ड चुनें।</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "तारे के आकार का बोर्ड, जिसकी नीचे की नोक में 10 लाल गोटियाँ और ऊपर की नोक में 10 नीली गोटियाँ हैं",
  tekst: "2 खिलाड़ियों के लिए तारे के आकार का बोर्ड।",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Sternhalma क्या है? तारे के बोर्ड पर Halma | Leapstone",
  beschrijving: "Sternhalma तारे के आकार के बोर्ड पर Halma का जर्मन नाम है। इसका Halma और चाइनीज़ चेकर्स से क्या संबंध है, क्या अलग है, और इसे ब्राउज़र में मुफ़्त कैसे खेलें।",
  h1: "Sternhalma, Halma और चाइनीज़ चेकर्स",
  intro: "आपस में बहुत जुड़े खेलों के तीन नाम। हर एक का क्या मतलब है, वे कहाँ से आए हैं, और उनमें क्या अंतर है।",
  inhoud,
};
