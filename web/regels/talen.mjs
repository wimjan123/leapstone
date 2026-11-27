// Alle talen van de spelregelpagina's en gidsen (taak 133). Een nieuwe taal: kopieer de map talen/en/ naar talen/<code>/, vertaal elk bestand
// zin voor zin, zet de adressen in paginas.mjs, en voeg de taal hier toe. De taal moet ook in web/landing/talen.mjs staan (daar staan
// locale, richting, naam, taalkeuze, App Store-land). Daarna `npm --prefix web run regels:paginas`.
import en from "./talen/en/index.mjs";
import nl from "./talen/nl/index.mjs";
import de from "./talen/de/index.mjs";
import pl from "./talen/pl/index.mjs";
import pt from "./talen/pt/index.mjs";
import ro from "./talen/ro/index.mjs";
import ru from "./talen/ru/index.mjs";
import sk from "./talen/sk/index.mjs";
import sl from "./talen/sl/index.mjs";
import sv from "./talen/sv/index.mjs";
import tr from "./talen/tr/index.mjs";
import uk from "./talen/uk/index.mjs";
import ur from "./talen/ur/index.mjs";
import id from "./talen/id/index.mjs";
import ms from "./talen/ms/index.mjs";
import vi from "./talen/vi/index.mjs";
import bn from "./talen/bn/index.mjs";
import gu from "./talen/gu/index.mjs";
import hi from "./talen/hi/index.mjs";
import ja from "./talen/ja/index.mjs";
import kn from "./talen/kn/index.mjs";
import ko from "./talen/ko/index.mjs";
import ml from "./talen/ml/index.mjs";
import mr from "./talen/mr/index.mjs";
import or from "./talen/or/index.mjs";
import pa from "./talen/pa/index.mjs";
import ta from "./talen/ta/index.mjs";
import te from "./talen/te/index.mjs";
import th from "./talen/th/index.mjs";
import zhhans from "./talen/zh-hans/index.mjs";

import ar_ from "./talen/ar/index.mjs";
import ca_ from "./talen/ca/index.mjs";
import es_ from "./talen/es/index.mjs";
import cs_ from "./talen/cs/index.mjs";
import hu_ from "./talen/hu/index.mjs";
import da_ from "./talen/da/index.mjs";
import no_ from "./talen/no/index.mjs";
import el_ from "./talen/el/index.mjs";
import it_ from "./talen/it/index.mjs";
import fi_ from "./talen/fi/index.mjs";
import hr_ from "./talen/hr/index.mjs";
import fr_ from "./talen/fr/index.mjs";
import he_ from "./talen/he/index.mjs";

export const REGEL_TALEN = [en, nl, de, pl, pt, ro, ru, sk, sl, sv, tr, uk, ur, id, ms, vi, bn, gu, hi, ja, kn, ko, ml, mr, or, pa, ta, te, th, zhhans, ar_, ca_, es_, cs_, hu_, da_, no_, el_, it_, fi_, hr_, fr_, he_];
