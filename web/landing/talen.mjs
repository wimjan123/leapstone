// Alle talen van de Landingspagina. Een nieuwe taal: zet een tabel in talen/<code>.mjs (kopieer talen/de.mjs, vertaal elke regel,
// `dir: "rtl"` voor Arabisch, Hebreeuws en Urdu) en voeg hem hier toe. Daarna `npm --prefix web run landing:paginas` en de tests.
// Engels staat vooraan: dat is de bron en de x-default van hreflang. Daarna nl en de, dan de rest op taalcode (taak 134: 43 talen, één pagina per basistaal).
import en from "./talen/en.mjs";
import nl from "./talen/nl.mjs";
import de from "./talen/de.mjs";
import ar from "./talen/ar.mjs";
import bn from "./talen/bn.mjs";
import ca from "./talen/ca.mjs";
import cs from "./talen/cs.mjs";
import da from "./talen/da.mjs";
import el from "./talen/el.mjs";
import es from "./talen/es.mjs";
import fi from "./talen/fi.mjs";
import fr from "./talen/fr.mjs";
import gu from "./talen/gu.mjs";
import he from "./talen/he.mjs";
import hi from "./talen/hi.mjs";
import hr from "./talen/hr.mjs";
import hu from "./talen/hu.mjs";
import id from "./talen/id.mjs";
import it from "./talen/it.mjs";
import ja from "./talen/ja.mjs";
import kn from "./talen/kn.mjs";
import ko from "./talen/ko.mjs";
import ml from "./talen/ml.mjs";
import mr from "./talen/mr.mjs";
import ms from "./talen/ms.mjs";
import no from "./talen/no.mjs";
import or from "./talen/or.mjs";
import pa from "./talen/pa.mjs";
import pl from "./talen/pl.mjs";
import pt from "./talen/pt.mjs";
import ro from "./talen/ro.mjs";
import ru from "./talen/ru.mjs";
import sk from "./talen/sk.mjs";
import sl from "./talen/sl.mjs";
import sv from "./talen/sv.mjs";
import ta from "./talen/ta.mjs";
import te from "./talen/te.mjs";
import th from "./talen/th.mjs";
import tr from "./talen/tr.mjs";
import uk from "./talen/uk.mjs";
import ur from "./talen/ur.mjs";
import vi from "./talen/vi.mjs";
import zh_hans from "./talen/zh-hans.mjs";

export const LANDING_TALEN = [en, nl, de, ar, bn, ca, cs, da, el, es, fi, fr, gu, he, hi, hr, hu, id, it, ja, kn, ko, ml, mr, ms, no, or, pa, pl, pt, ro, ru, sk, sl, sv, ta, te, th, tr, uk, ur, vi, zh_hans];
