package nl.leapstone.app

import android.os.Bundle
import android.view.View
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)
  }

  // Met edge-to-edge (targetSdk 35+) krimpt Android het venster niet voor het schermtoetsenbord: het valt over de pagina en de
  // pagina merkt er niets van. Meld daarom aan de pagina hoe hoog het toetsenbord is en hoe hoog het venster (CSS-px), met het
  // event `leapstone-toetsenbord`. Dan schuift de app zelf omhoog, zoals op iOS (web/src/toetsenbord.ts). Het venster blijft even
  // groot, dus de opstelling (breed of smal) wisselt niet door het toetsenbord. De pagina rekent alleen met het deel van het
  // toetsenbord dat over het zichtbare deel ligt: maakt een nieuwere WebView dat deel zelf al kleiner, dan telt het niet dubbel.
  override fun onWebViewCreate(webView: WebView) {
    val inhoud = findViewById<View>(android.R.id.content)
    var toetsenbordPx = 0
    var gemeld = ""
    // Meld de laatste hoogte van het toetsenbord met de hoogte die het venster nu heeft.
    fun meld() {
      val dichtheid = inhoud.resources.displayMetrics.density
      val hoogte = Math.round(toetsenbordPx / dichtheid)
      val venster = Math.round(inhoud.height / dichtheid)
      val melding = "{hoogte:$hoogte,venster:$venster}"
      if (melding == gemeld) return
      gemeld = melding
      webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('leapstone-toetsenbord',{detail:$melding}))", null)
    }
    // Op de content-view, zoals in de eerste meting op de emulator; de insets gaan ongewijzigd door naar de WebView.
    ViewCompat.setOnApplyWindowInsetsListener(inhoud) { _, insets ->
      toetsenbordPx = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
      meld()
      // De WebView rekent zelf de veilige randen uit (env(safe-area-inset-*)): geef de insets ongewijzigd door.
      insets
    }
    // Android geeft de insets vóór de nieuwe maat van het venster: verandert het venster terwijl het toetsenbord open is (draaien,
    // splitsen), dan klopt de hoogte pas na de layout. Meld daarom na elke layout met een andere maat opnieuw.
    inhoud.addOnLayoutChangeListener { _, _, top, _, bottom, _, oudTop, _, oudBottom -> if (bottom - top != oudBottom - oudTop) meld() }
  }
}
