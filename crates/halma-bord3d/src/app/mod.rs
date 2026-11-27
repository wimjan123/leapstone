//! De Bevy-app in de browser, en wat TypeScript kan aanroepen.
//!
//! TypeScript zet het bord, de stand en het gekozen vak; het 3D-bord tekent die, laat Zetten in
//! bogen huppen, laat een gesleepte steen de vinger volgen, laat een steen terugschuiven als een Zet
//! niet mag, en meldt tikken terug als plek op het bord. Er licht nooit een vak op als hint. Het
//! beslist zelf niets: welke steen of welk vak een tik bedoelt, en of een Zet mag, bepalen de
//! web-app en de spelregels.
//!
//! Uiterlijk (ontwerp 1b, taak 177): een lakbord op een tafel van zijde, met Bevy's gewone
//! `StandardMaterial`, één lamp met schaduw en een omgevingskaart voor de spiegeling. De grote
//! plaatjes komen van TypeScript (`zet_plaatje`). Zonder vingers staat het bord stil: de camera beweegt alleen met
//! knijpen en schuiven (taak 186); verder gaat alleen een Steen omhoog, landt en rolt terug.
//!
//! Voorwerpen (taak 178): knoppen als echte voorwerpen op de tafel (`zet_voorwerpen`, zie
//! `crate::voorwerp` en `docs/bord3d.md`, "Voorwerpen"). Met voorwerpen kijkt de camera over de hele
//! tafel; de web-app legt een onzichtbare HTML-knop op elk voorwerp (`voorwerp_vakken`).
//!
//! Alleen het bord zoomt (taak 190): de tafel en de voorwerpen tekenen met de vaste camera van het overzicht
//! (`Kijk::vast`, materiaal `VastMateriaal`), het bord en de Stenen met de camera die zoomt (`Kijk::cam`). Zo blijven de
//! knoppen en naamplaten op hun plek en even groot, en verschuiven hun HTML-knoppen niet tijdens het knijpen.
//!
//! Het tekent alleen als er iets verandert of beweegt (batterij): Bevy wacht tot
//! TypeScript iets stuurt (`wek`) of tot een beweging om een volgend beeld vraagt.

mod materiaal;
mod webgl2;

use std::cell::{Cell, RefCell};
use std::collections::{HashMap, HashSet};
use std::sync::atomic::{AtomicU32, Ordering};
use std::time::Duration;

use bevy::asset::RenderAssetUsages;
use bevy::camera::visibility::NoFrustumCulling;
use bevy::camera::{CameraProjection, Exposure};
use bevy::core_pipeline::tonemapping::{DebandDither, Tonemapping};
use bevy::light::cluster::ClusterConfig;
use bevy::light::{
    DirectionalLightShadowMap, GlobalAmbientLight, NotShadowCaster, NotShadowReceiver,
};
use bevy::mesh::{Indices, PrimitiveTopology};
use bevy::prelude::*;
use bevy::render::render_resource::{PipelineCache, TextureFormat};
use bevy::render::{Render, RenderApp, RenderSystems};
use bevy::window::{PrimaryWindow, RequestRedraw};
use bevy::winit::{EventLoopProxyWrapper, UpdateMode, WinitSettings, WinitUserEvent};
use wasm_bindgen::prelude::*;

use crate::beweging::{self, Huppel};
use crate::camera::{self, Camera, Greep, Venster};
use crate::gebaren::{Actie, Gebaren};
use crate::hand::{Hand, OPTILLEN, SLEEP_HOOGTE, Terug, Val, landing_vak};
use crate::kies::{self, Wijzer};
use crate::lak;
use crate::overgang::{self, Hup, Komst};
use crate::pion::{self, ZAKT};
use crate::steen;
use crate::textuur;
use crate::vakken::{Indeling, doelvakje};
use crate::voorwerp::{self, Rol, Stof, Voorwerp};
use materiaal::{Overlay, Vast, VastMateriaal, afbeelding, kubus, rechthoek};

/// Wat de camera nog tekent: van dichtbij tot ver weg.
const CAMERA_DICHTBIJ: f32 = 0.5;
const CAMERA_VER: f32 = 600.0;

/// Het gat waar een gesleepte steen valt, ligt een half gat (een half vak, op het scherm gemeten) boven
/// de vinger: net buiten de vingertop, zodat je de landingsschaduw ziet (taak 168).
const BOVEN_VINGER_VAK: f32 = 0.5;
/// Kleuren van de Spelers als TypeScript (nog) niets stuurt; zoals `SPELER_KLEUREN` in de web-app.
const KLEUREN: [u32; 6] = [0xe2533c, 0x3358e0, 0x2aa882, 0xf6c945, 0xb49cf7, 0x242c36];
/// Achter de tafel (bijna nooit te zien): donker, warm.
const ACHTERGROND: Color = Color::srgb(0.043, 0.024, 0.016);
/// De lamp (een lantaarn): links achter boven het bord, gezien vanaf de Speler. Zo valt de glans op
/// de zijkant van de Stenen en niet op de kop (prototype: `LAMP_VAN`). De lamp hangt `LAMP_VER` keer
/// zo ver weg met een even smallere kegel: dan is het licht over het hele bord even sterk, zoals in
/// het prototype (geen afname met de afstand), en verandert er verder niets.
const LAMP_VAN: Vec3 = Vec3::new(-17.0, 27.0, -7.0);
const LAMP_VER: f32 = 3.0;
const LAMP_KEGEL: f32 = 0.62;
/// Bevy laat het licht anders afnemen naar de rand van de kegel dan three.js (kwadratisch in plaats
/// van smoothstep). Met een binnenhoek van 0,48 keer de kegel lijkt het er het meest op (uitgerekend).
const LAMP_BINNEN: f32 = 0.48;
/// Kleur en sterkte van de lamp (prototype: `#ffeedd`, 3). Bevy rekent met lumen en een afname met de
/// afstand in het kwadraat; `lamp_lumen` rekent dat om.
const LAMP_KLEUR: Color = Color::srgb(1.0, 0.933, 0.867);
const LAMP_STERK: f32 = 3.0;
/// Hoe sterk de omgeving (spiegeling en vullicht) meetelt bij een Steen, zoals `envMapIntensity` in
/// het prototype. Bevy kent dat niet per materiaal; de `occlusion_texture` doet hetzelfde voor
/// indirect licht (alleen de omgeving, niet de lamp). Voor de tafel (0,3) zit het in het rode kanaal
/// van `tafel_ruw`.
const OMGEVING_STEEN: f32 = 0.6;
/// Dichterbij de camera dan dit (in vakken) is een pion fijn, verder weg grof.
const FIJN_TOT: f32 = 9.5;
/// Hoe ver een pion in de hand hoogstens kantelt (radialen), en hoeveel per eenheid snelheid.
const KANTEL_MAX: f32 = 0.2;
const KANTEL_PER_SNELHEID: f32 = 0.035;
/// De veer van het optillen (prototype: stijfheid 300, demping 15).
const VEER_STIJF: f32 = 300.0;
const VEER_DEMP: f32 = 15.0;
/// Hoe lang de camera na een lege lijst voorwerpen op de tafel van het volgende scherm wacht (seconden), voordat hij naar het bord
/// alleen gaat. De web-app bakt eerst de plaatjes van die tafel; dat duurt meestal een paar beelden.
const LIJST_GEDULD: f64 = 0.5;
/// Hoe lang het bord op de plaatjes wacht voordat het zich klaar meldt (seconden). Daarna tekent het
/// met effen kleuren tot de plaatjes er zijn.
const PLAATJES_GEDULD: f64 = 6.0;
/// Hoe lang de camera van het eerste bord op de plaatjes wacht voordat hij tekent (seconden). Elk plaatje dat na het eerste
/// beeld komt, laat Bevy de shaders van zijn materiaal opnieuw maken; dat was het meeste werk van het opstarten. Zolang de
/// camera wacht, kost een beeld bijna niets en kan de browser de plaatjes uitpakken. Bij 1 s kwam soms een plaatje net te
/// laat en volgde een tweede ronde shaders (1,4 s op een trage telefoon).
const PLAATJES_EERST: f64 = 2.0;
/// De plaatjes die elk bord nodig heeft, en per bord die van het speelveld.
const PLAATJES: [&str; 9] = [
    "tafel_kleur",
    "tafel_normaal",
    "tafel_ruw",
    "rand_kleur",
    "rand_normaal",
    "beslag_kleur",
    "beslag_normaal",
    "omgeving_glans",
    "omgeving_licht",
];
const VELD_PLAATJES: [&str; 3] = ["kleur", "normaal", "orm"];

/// Berichten van TypeScript, opgehaald bij het volgende beeld.
#[derive(Default)]
struct Post {
    bord: Option<(bool, Option<Vec2>)>,
    kleuren: Option<Vec<u32>>,
    stand: Option<Vec<i32>>,
    gekozen: Option<i32>,
    /// Het doel van de Speler aan de beurt (de vakken).
    doel: Option<Vec<u32>>,
    vlak: Option<(Vec2, Vec2)>,
    beweeg: Option<(Vec<u32>, f32, bool)>,
    vingers: Vec<(u64, u8, Vec2, f64)>,
    /// De Speler sleept de steen op dit vak; waar hij boven het bord hangt (x, z).
    sleep: Option<(usize, Vec2)>,
    /// Losgelaten: boven dit vak (het mag), of -1 (terug naar zijn gaatje).
    loslaten: Option<i32>,
    /// Een tik naar een vak dat niet mag: van, naar.
    mis: Option<(usize, usize)>,
    /// Plaatjes: naam, breedte, hoogte, beeldpunten (leeg: dit plaatje komt niet).
    plaatjes: Vec<(String, u32, u32, Vec<u8>)>,
    /// De voorwerpen op de tafel (`voorwerp::VELDEN` getallen per voorwerp).
    voorwerpen: Option<Vec<f32>>,
    /// Het plaatje van een voorwerp: nummer, breedte, hoogte, beeldpunten (RGBA).
    platen: Vec<(usize, u32, u32, Vec<u8>)>,
    /// Een voorwerp indrukken of loslaten.
    druk: Vec<(usize, bool)>,
    /// Een kraal van het telraam: voorwerp, deel (0 of 1), aan.
    schakelaars: Vec<(usize, usize, bool)>,
    /// Een voorwerp naar een andere plek (x, z in vakken, zoals de web-app ze neerlegt).
    verplaats: Vec<(usize, Vec2)>,
}

/// Wat TypeScript over de camera moet weten om een vinger naar een plek op het bord om te rekenen.
#[derive(Clone)]
struct Blik {
    cam: Camera,
    indeling_midden: Vec2,
}

thread_local! {
    static POST: RefCell<Post> = RefCell::default();
    static BIJ_TIK: RefCell<Option<js_sys::Function>> = const { RefCell::new(None) };
    static BIJ_CAMERA: RefCell<Option<js_sys::Function>> = const { RefCell::new(None) };
    static BIJ_VOORWERPEN: RefCell<Option<js_sys::Function>> = const { RefCell::new(None) };
    /// Waar de voorwerpen op het scherm staan (vier getallen per voorwerp), voor `voorwerp_vakken`.
    static VAKKEN: RefCell<Vec<f32>> = const { RefCell::new(Vec::new()) };
    /// De camera van het laatste beeld, voor `wijs` en `sleep`.
    static BLIK: RefCell<Option<Blik>> = const { RefCell::new(None) };
    /// De pionnen zoals ze in het laatste beeld stonden (ook opgetild of in de hand), voor `wijs`.
    static PIONNEN: RefCell<Vec<kies::Pion>> = const { RefCell::new(Vec::new()) };
    static WIJZER: Wijzer = Wijzer::nieuw();
    static WEKKER: RefCell<Option<Box<dyn Fn()>>> = const { RefCell::new(None) };
    /// Bevy is bezig met een beeld: een nieuw bericht wacht dan op het volgende beeld.
    static BEZIG: Cell<bool> = const { Cell::new(false) };
    static NOG_EEN: Cell<bool> = const { Cell::new(false) };
    static BEELDEN: Cell<u32> = const { Cell::new(0) };
    static KLAAR: Cell<bool> = const { Cell::new(false) };
    /// Het bord dat gebouwd is (Vierkant bord of niet), of geen. Hetzelfde bord opnieuw bouwt niets (UI-overgangen).
    static GEBOUWD: Cell<Option<bool>> = const { Cell::new(None) };
    /// De Speler wil minder beweging (`prefers-reduced-motion`): schermwissels gebeuren meteen.
    static MINDER: Cell<bool> = const { Cell::new(false) };
    static GESTART: Cell<bool> = const { Cell::new(false) };
}

/// Hoeveel pijplijnen (shaders) de grafische kaart nog moet maken; bijgehouden in de render-wereld.
static WACHTEND: AtomicU32 = AtomicU32::new(u32::MAX);

fn post(f: impl FnOnce(&mut Post)) {
    POST.with_borrow_mut(f);
    wek();
}

/// Laat Bevy een beeld maken, ook als het stil stond.
fn wek() {
    if BEZIG.get() {
        NOG_EEN.set(true);
        return;
    }
    WEKKER.with_borrow(|w| {
        if let Some(w) = w {
            w();
        }
    });
}

/// Start het 3D-bord in het canvas met deze CSS-selector (bijvoorbeeld `#bord3d`).
/// `eenvoudig`: zonder gladde randen (MSAA), voor trage telefoons.
/// Kan één keer per pagina: de browser geeft Bevy maar één event loop.
#[wasm_bindgen]
pub fn start(canvas: String, eenvoudig: bool) -> Result<(), JsValue> {
    if GESTART.replace(true) {
        return Err("the 3D board is already running".into());
    }
    let wacht = UpdateMode::reactive_low_power(Duration::from_secs(30));
    let mut app = App::new();
    app.insert_resource(Kwaliteit { eenvoudig })
        .insert_resource(ClearColor(ACHTERGROND))
        .insert_resource(GlobalAmbientLight {
            brightness: 0.0,
            ..default()
        })
        .insert_resource(DirectionalLightShadowMap { size: 2048 })
        .insert_resource(WinitSettings {
            focused_mode: wacht,
            unfocused_mode: wacht,
        })
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                canvas: Some(canvas),
                fit_canvas_to_parent: true,
                prevent_default_event_handling: false,
                ..default()
            }),
            ..default()
        }))
        .add_plugins((materiaal::Materialen, webgl2::KleineGroepjes))
        .add_systems(Startup, opzetten)
        .add_systems(First, begin_beeld)
        .add_systems(
            Update,
            (
                lees_post,
                camera_aan,
                bediening,
                camera_bijwerken,
                stenen_bijwerken,
                voorwerpen_bijwerken,
            )
                .chain(),
        )
        .add_systems(Last, einde_beeld);
    if let Some(render) = app.get_sub_app_mut(RenderApp) {
        render.add_systems(Render, tel_wachtend.in_set(RenderSystems::Cleanup));
    }
    app.run();
    Ok(())
}

/// Het bord: Sterbord of Vierkant bord. `kijk_x`, `kijk_y`: een plek op het bord (zoals in de
/// web-app) waar de Speler heen wil, meestal het midden van zijn doel; de camera kijkt
/// ernaartoe. NaN: geen voorkeur. `intro` telt niet meer: het bord staat stil (ontwerp 1b).
#[wasm_bindgen]
pub fn zet_bord(vierkant: bool, kijk_x: f32, kijk_y: f32, _intro: bool) {
    let kijk = (kijk_x.is_finite() && kijk_y.is_finite()).then(|| Vec2::new(kijk_x, kijk_y));
    // Hetzelfde bord blijft staan (alleen de stand, de keuze en de camera beginnen opnieuw): het is dan al getekend.
    if GEBOUWD.get() != Some(vierkant) {
        KLAAR.set(false);
    }
    post(|p| p.bord = Some((vierkant, kijk)));
}

/// De kleur van elke Speler als 0xRRGGBB.
#[wasm_bindgen]
pub fn zet_kleuren(kleuren: Vec<u32>) {
    post(|p| p.kleuren = Some(kleuren));
}

/// Per vak de Speler (vanaf 0) met een steen erop, of -1.
#[wasm_bindgen]
pub fn zet_stand(stand: Vec<i32>) {
    post(|p| p.stand = Some(stand));
}

/// Het gekozen vak (de steen gaat omhoog en krijgt een ring om zijn gat), of -1. Er licht nooit een
/// vak op als hint.
#[wasm_bindgen]
pub fn zet_gekozen(vak: i32) {
    post(|p| p.gekozen = Some(vak));
}

/// Het doel van de Speler aan de beurt. Het lakbord (ontwerp 1b) kleurt het doel van een Potje niet.
/// Eén enkel doelvak is het doelvakje van een oefening in de Speluitleg (taak 184, de enige plek waar
/// een vak oplicht, besluit van William in feature 143): daar ligt een lichte ring om het gat, zoals op
/// het platte bord.
#[wasm_bindgen]
pub fn zet_doel(_speler: i32, vakken: Vec<u32>) {
    post(|p| p.doel = Some(vakken));
}

/// Een plaatje van het bord (`web/src/bord3d`): `naam` zonder voor- en achtervoegsel, bijvoorbeeld
/// `ster_kleur` of `omgeving_glans`. Beeldpunten als RGBA (een JPEG, gelezen in de browser), of voor
/// de omgeving de inhoud van het `.bin`-bestand (`breedte` is dan de maat van een zijde). Lege
/// `data`: dit plaatje komt niet (laden mislukt); het bord tekent dat deel dan in een effen kleur.
#[wasm_bindgen]
pub fn zet_plaatje(naam: String, breedte: u32, hoogte: u32, data: Vec<u8>) {
    post(|p| p.plaatjes.push((naam, breedte, hoogte, data)));
}

/// Het deel van het scherm waar het bord in moet passen, in CSS-pixels.
#[wasm_bindgen]
pub fn zet_vlak(x: f32, y: f32, breedte: f32, hoogte: f32) {
    post(|p| p.vlak = Some((Vec2::new(x, y), Vec2::new(breedte, hoogte))));
}

/// Laat de steen op het laatste vak van `vakken` langs die vakken huppen (het pad van een Zet).
/// `hup_ms`: hoe lang één hup duurt. `minder`: minder beweging, alleen een korte overgang.
#[wasm_bindgen]
pub fn beweeg(vakken: Vec<u32>, hup_ms: f32, minder: bool) {
    post(|p| p.beweeg = Some((vakken, hup_ms, minder)));
}

/// Een vinger (of de linker muisknop) op het bord. `fase`: 0 neer, 1 bewegen, 2 los, 3 afgebroken.
/// Plek in CSS-pixels in het venster, tijd in milliseconden. Een vinger tikt of schuift het bord (ingezoomd),
/// twee vingers knijpen: zoomen. Het bord draait niet en loopt niet uit (taak 186).
#[wasm_bindgen]
pub fn vinger(id: u32, fase: u8, x: f32, y: f32, tijd: f64) {
    post(|p| {
        p.vingers
            .push((id as u64, fase, Vec2::new(x, y), tijd / 1000.0))
    });
}

/// Zoomen en draaien met muis en touchpad: doet niets (taak 186: alleen vingers zoomen en schuiven, en draaien
/// bestaat niet).
#[wasm_bindgen]
pub fn knijp(_x: f32, _y: f32, _schaal: f32, _hoek: f32) {}

/// `f(x, y)` wordt aangeroepen bij elke tik van een vinger die Bevy kreeg (`vinger`): de plek op
/// het scherm in CSS-pixels. Wat er onder ligt, vraagt de web-app met `wijs`.
/// Meteen bij loslaten: er is geen dubbeltik.
#[wasm_bindgen]
pub fn bij_tik(f: js_sys::Function) {
    BIJ_TIK.with_borrow_mut(|t| *t = Some(f));
}

/// `f(overzicht)` wordt aangeroepen als de camera het overzicht verlaat (`false`, ingezoomd: de voorwerpen zakken weg, taak 235)
/// of er weer is (`true`; ook meteen na het starten).
#[wasm_bindgen]
pub fn bij_camera(f: js_sys::Function) {
    BIJ_CAMERA.with_borrow_mut(|t| *t = Some(f));
}

/// Wat er onder een punt op het scherm (CSS-pixels) ligt, met de camera en de pionnen van het
/// laatste beeld. Geeft `[x, y, eigen, geraakt]`:
/// - `x`, `y`: de plek op het bord (zoals in de web-app), op de hoogte van de gaatjes; NaN naast het bord;
/// - `eigen`: het vak van de pion van `speler` die de vinger pakt, met `ruimte` pixels marge
///   rond de pion op het scherm (ook op zijn kop, ook als hij half achter een andere staat), of -1;
/// - `geraakt`: het vak van de pion (van wie ook) waar de vinger duidelijk op staat (niet op zijn rand, `kies::RAAK_DIEP`), of -1.
#[wasm_bindgen]
pub fn wijs(x: f32, y: f32, speler: i32, ruimte: f32) -> Vec<f32> {
    let punt = Vec2::new(x, y);
    let Some(blik) = BLIK.with_borrow(|b| b.clone()) else {
        return vec![f32::NAN, f32::NAN, -1.0, -1.0];
    };
    let plek = blik
        .cam
        .grondpunt(punt, 0.0)
        .map_or(Vec2::NAN, |g| g + blik.indeling_midden);
    let (eigen, geraakt) = PIONNEN.with_borrow(|pionnen| {
        WIJZER.with(|w| {
            (
                w.eigen(&blik.cam, pionnen, punt, speler, ruimte),
                w.geraakt(&blik.cam, pionnen, punt),
            )
        })
    });
    let vak = |v: Option<usize>| v.map_or(-1.0, |v| v as f32);
    vec![plek.x, plek.y, vak(eigen), vak(geraakt)]
}

/// De Speler sleept de steen op vak `vak` met een vinger op (`x`, `y`) in CSS-pixels: de steen
/// hangt boven de andere stenen, recht boven een plek een half gat boven de vinger. Geeft die plek
/// op het bord (zoals in de web-app): daar valt hij als de vinger loslaat.
#[wasm_bindgen]
pub fn sleep(vak: u32, x: f32, y: f32) -> Vec<f32> {
    let plek = BLIK.with_borrow(|b| {
        b.as_ref().and_then(|b| {
            b.cam
                .boven_vinger(Vec2::new(x, y), BOVEN_VINGER_VAK)
                .map(|g| (g, g + b.indeling_midden))
        })
    });
    let Some((wereld, app)) = plek else {
        return vec![f32::NAN, f32::NAN];
    };
    post(|p| p.sleep = Some((vak as usize, wereld)));
    vec![app.x, app.y]
}

/// De vinger laat de gesleepte steen los. `naar`: het vak waar hij in valt (de Zet mag, of het
/// is zijn eigen vak), of -1: hij gaat terug naar zijn zitje.
#[wasm_bindgen]
pub fn loslaten(naar: i32) {
    post(|p| p.loslaten = Some(naar));
}

/// Een tik naar vak `naar` mag niet: de steen op `van` schuift naar de rand en terug.
#[wasm_bindgen]
pub fn mis(van: u32, naar: u32) {
    post(|p| p.mis = Some((van as usize, naar as usize)));
}

/// Minder beweging (`prefers-reduced-motion`): een nieuwe lijst voorwerpen, een nieuwe stand en de camera veranderen dan
/// meteen, zonder overgang (zie `overgang`).
#[wasm_bindgen]
pub fn zet_minder(minder: bool) {
    MINDER.set(minder);
}

/// Zet de camera terug naar het overzicht. Doet niets meer: de camera staat altijd in het overzicht.
#[wasm_bindgen]
pub fn camera_terug() {}

/// De voorwerpen op de tafel (taak 178), `voorwerp::VELDEN` getallen per voorwerp: soort (zie
/// `voorwerp::Soort`), x, z, breedte, diepte, hoogte (in vakken, zoals het bord; de tafel is het vlak
/// onder het bord) en gespiegeld (1: van rechts naar links). Een nieuwe lijst vervangt de oude, ook de
/// plaatjes. Met voorwerpen past de camera het bord en alle voorwerpen samen in het vlak (`zet_vlak`). Leeg: geen voorwerpen;
/// de camera blijft staan tot er een nieuwe lijst of een nieuw bord komt (zo glijdt hij bij een schermwissel in één keer naar de
/// tafel van het nieuwe scherm). Een nieuwe lijst laat de oude voorwerpen wegzakken en de nieuwe omhoog komen; wat in beide
/// lijsten gelijk ligt, blijft liggen (`overgang::wissel`). Stuur de plaatjes meteen na de lijst, dan komen de voorwerpen er met
/// hun plaatje.
#[wasm_bindgen]
pub fn zet_voorwerpen(lijst: Vec<f32>) {
    post(|p| {
        p.voorwerpen = Some(lijst);
        p.platen.clear();
        p.druk.clear();
        p.schakelaars.clear();
    });
}

/// Het plaatje op de bovenkant van voorwerp `nummer` (zijn plek in de lijst van `zet_voorwerpen`):
/// RGBA, rij voor rij van boven, zoals `Plaat.beeldpunten` uit `web/src/knopplaten`. Elke maat mag.
#[wasm_bindgen]
pub fn zet_voorwerp_plaat(nummer: u32, breedte: u32, hoogte: u32, data: Vec<u8>) {
    post(|p| p.platen.push((nummer as usize, breedte, hoogte, data)));
}

/// Zet voorwerp `nummer` op een andere plek (x, z in vakken, zoals in `zet_voorwerpen`), zonder de lijst en de
/// plaatjes opnieuw te sturen (de jade aanwijzer van het Potje schuift zo naar de Speler aan de beurt). De
/// camera past niet opnieuw: het voorwerp blijft binnen wat al in beeld was.
#[wasm_bindgen]
pub fn zet_voorwerp_plek(nummer: u32, x: f32, z: f32) {
    if x.is_finite() && z.is_finite() {
        post(|p| p.verplaats.push((nummer as usize, Vec2::new(x, z))));
    }
}

/// Druk voorwerp `nummer` in (`aan`) of laat het los: het zakt een stukje en komt terug.
#[wasm_bindgen]
pub fn druk_voorwerp(nummer: u32, aan: bool) {
    post(|p| p.druk.push((nummer as usize, aan)));
}

/// Zet kraal `deel` (0: Sound, 1: Vibration) van de lade `nummer` aan of uit. Hij schuift erheen.
#[wasm_bindgen]
pub fn zet_schakelaar(nummer: u32, deel: u32, aan: bool) {
    post(|p| p.schakelaars.push((nummer as usize, deel as usize, aan)));
}

/// Waar de bovenkant van elk voorwerp op het scherm staat, in CSS-pixels: per voorwerp links, boven,
/// rechts, onder (NaN als het er niet is). Van het laatste beeld; leeg voor het eerste beeld.
#[wasm_bindgen]
pub fn voorwerp_vakken() -> Vec<f32> {
    VAKKEN.with_borrow(|v| v.clone())
}

/// `f()` wordt aangeroepen als `voorwerp_vakken` iets anders geeft (nieuwe voorwerpen, ander venster).
#[wasm_bindgen]
pub fn bij_voorwerpen(f: js_sys::Function) {
    BIJ_VOORWERPEN.with_borrow_mut(|t| *t = Some(f));
}

/// Het aantal getekende beelden sinds de start.
#[wasm_bindgen]
pub fn beelden() -> u32 {
    BEELDEN.get()
}

/// Staat het bord helemaal in beeld (alle shaders klaar, en de plaatjes, of na `PLAATJES_GEDULD`)?
#[wasm_bindgen]
pub fn klaar() -> bool {
    KLAAR.get()
}

#[derive(Resource)]
struct Kwaliteit {
    eenvoudig: bool,
}

/// Wat het bord laat zien.
#[derive(Resource)]
struct Spel {
    indeling: Indeling,
    stand: Vec<i32>,
    gekozen: Option<usize>,
    /// Het doelvakje van een oefening in de Speluitleg (alleen bij één doelvak).
    doel: Option<usize>,
    /// Een steen onderweg: op welk vak hij landt, zijn pad en wanneer hij vertrok (seconden op `Klok`).
    /// Op de klok, niet per beeld: ook op een trage telefoon duurt een hup even lang. Niet op `Time<Real>`: die loopt na een
    /// stilstaand bord een beeld achter (zie `beweging::klok_loopt`).
    onderweg: Option<(usize, Huppel, f64)>,
    /// Minder beweging: de gezette steen verschijnt kort (vak, voortgang).
    verschijnt: Option<(usize, f32)>,
    /// Per vak: een Steen die hupt omdat de stand veranderde zonder Zet (UI-overgangen).
    hups: Vec<Option<Huppend>>,
    /// De draaiing van de camera om de y-as: de lamp en de tekens op de Stenen draaien mee.
    draai: f32,
    /// Wat de Speler met zijn vinger met een steen doet.
    hand: Hand,
    /// Waar de gesleepte steen getoond wordt: hij volgt de vinger heel kort achter.
    sleep_getoond: Option<Vec2>,
    veranderd: bool,
    /// Beelden sinds het bord er staat (om te weten of het helemaal getekend is).
    beelden: u32,
    /// Wanneer het bord gebouwd is (seconden), om niet eindeloos op de plaatjes te wachten.
    gebouwd: f64,
}

/// De materialen van de tafel en het bord. Zonder plaatjes een effen kleur; komt een plaatje,
/// dan zet `pas_plaatjes_toe` het erin.
struct Lakken {
    /// De tafel ligt in de vaste laag (taak 190): hij zoomt niet mee met het bord.
    tafel: Handle<VastMateriaal>,
    /// Het speelveld van het Sterbord en van het Vierkant bord.
    veld: [Handle<StandardMaterial>; 2],
    gat: Handle<StandardMaterial>,
    /// De rand: bovenkant (gesneden rood lak), binnenkant (glad rood lak), buitenkant (zwart lak).
    rood: Handle<StandardMaterial>,
    roodglad: Handle<StandardMaterial>,
    zwart: Handle<StandardMaterial>,
    beslag: Handle<StandardMaterial>,
    messing: Handle<StandardMaterial>,
}

/// Wat Bevy voor het bord gemaakt heeft.
#[derive(Resource)]
struct Bevy {
    lak: Lakken,
    /// De plaatjes die er zijn, op naam, en welke namen al binnen zijn (ook als ze mislukten).
    plaatjes: HashMap<String, Handle<Image>>,
    ontvangen: HashSet<String>,
    /// Per Speler het materiaal van zijn Stenen.
    steen: Vec<Handle<StandardMaterial>>,
    /// Hoeveel de omgeving meetelt bij een glanzende en bij een matte Steen (1 bij 1 beeldpunt).
    omgeving_steen: [Handle<Image>; 2],
    contact: Handle<StandardMaterial>,
    contact_mesh: Handle<Mesh>,
    zweef_materiaal: Handle<StandardMaterial>,
    /// De pion grof (verder weg) en fijn (dichtbij de camera).
    pion: [Handle<Mesh>; 2],
    /// De ring om het gat van de gekozen Steen.
    ring: Entity,
    /// De lichte ring om het doelvakje van een oefening in de Speluitleg (`zet_doel` met één vak).
    doelring: Entity,
    /// De scherpe landingsschaduw op het gat waar een gesleepte steen valt.
    landing: Entity,
    /// De zachte schaduw onder een opgetilde Steen.
    zweef: Entity,
    stenen: Vec<Entity>,
    contacten: Vec<Entity>,
    kleuren: Vec<u32>,
    /// De gedeelde materialen van de voorwerpen (celadon, lak, messing ...), in de vaste laag.
    stoffen: HashMap<Stof, Handle<VastMateriaal>>,
}

/// De voorwerpen op de tafel (taak 178). Per voorwerp (op zijn plek in de lijst van de web-app):
/// het voorwerp, zijn entity, het materiaal van zijn bovenkant, hoe ver hij ingedrukt is, en zijn kralen.
#[derive(Resource, Default)]
struct Tafel {
    voorwerpen: Vec<Option<Voorwerp>>,
    entiteiten: Vec<Option<Entity>>,
    platen: Vec<Option<Handle<VastMateriaal>>>,
    /// Indrukken: (nu, doel), van 0 tot 1.
    druk: Vec<(f32, f32)>,
    /// Per voorwerp twee kralen: voortgang van uit (0) naar aan (1), en of hij aan moet.
    kralen: Vec<[(f32, bool); 2]>,
    /// De vakken op het scherm zoals de web-app ze het laatst hoorde.
    gemeld: Vec<f32>,
    /// Per voorwerp: wanneer het omhoog begint te komen (seconden), of `None` als het op zijn plek ligt (UI-overgangen).
    komt: Vec<Option<f64>>,
    /// Voorwerpen van de vorige lijst die nog wegzakken. Ze tellen niet meer mee (geen nummer, geen vak, geen knop).
    vertrek: Vec<Vertrek>,
    /// Hoe ver alle voorwerpen weggezakt zijn omdat het bord ingezoomd is (taak 235): 0 op hun plek, 1 helemaal weg.
    weg: f32,
}

/// Een voorwerp van de vorige lijst dat wegzakt.
struct Vertrek {
    wortel: Entity,
    plaat: Option<Handle<VastMateriaal>>,
    voorwerp: Voorwerp,
    begin: f64,
}

/// Een Steen die hupt (`overgang::hup_stand`): hoe, vanaf wanneer (seconden, na zijn wachttijd), en de Speler die er stond.
#[derive(Clone, Copy)]
struct Huppend {
    hup: Hup,
    begin: f64,
    oud: i32,
}

/// De klok van de overgangen en de hup van een Zet (seconden): loopt met de beelden mee, maar hooguit 0,05 s per beeld
/// (`beweging::klok_loopt`). Hapert één beeld (de grafische kaart laadt de plaatjes van een nieuwe tafel, tot 200 ms gemeten),
/// dan loopt de overgang daarna gewoon verder in plaats van een stuk over te slaan.
#[derive(Resource, Default)]
struct Klok(f64);

/// Het begin (y = 0) van een voorwerp; zijn kinderen zijn de onderdelen.
#[derive(Component)]
struct VoorwerpWortel;

/// Een kraal van het telraam: van welk voorwerp (zijn wortel), welk deel, en zijn plek als hij aan staat.
#[derive(Component)]
struct Kraal {
    wortel: Entity,
    deel: usize,
    plek: Vec3,
}

#[derive(Resource, Default)]
struct Kijk {
    /// De camera van het bord: knijpen en schuiven bewegen hem.
    cam: Option<Camera>,
    /// De vaste camera van het overzicht (taak 190): de tafel, de voorwerpen en de lamp. Zoomen verandert hem niet.
    vast: Option<Camera>,
    /// Waar de vingers het bord vastpakten (taak 190).
    greep: Option<Greep>,
    /// Het beeld van de vaste camera zoals de materialen van de vaste laag het kennen.
    vast_klem: Option<Mat4>,
    venster: Option<Venster>,
    vlak: Option<(Vec2, Vec2)>,
    gebaren: Gebaren,
    /// Wat de web-app het laatst hoorde: staat de camera in het overzicht?
    gemeld_overzicht: Option<bool>,
    /// De voorwerpen op de tafel: met voorwerpen past de camera ook die in beeld.
    voorwerpen: Vec<Voorwerp>,
    /// De draaiing van het bord: de camera kijkt vanaf de kant van de eigen Speler.
    draai: f32,
    /// De camera glijdt naar `cam` en `vast` (UI-overgangen): waar beide vandaan komen, en wanneer hij begon.
    glij: Option<Glij>,
    /// Sinds wanneer er geen voorwerpen meer liggen terwijl de camera nog op de oude tafel staat (zie `LIJST_GEDULD`).
    wacht_op_lijst: Option<f64>,
    /// De draaiing zoals hij in dit beeld getoond wordt: tijdens het glijden tussen de oude en de nieuwe `draai`. De voorwerpen, de
    /// lamp en de tekens op de Stenen draaien hiermee mee.
    toon_draai: f32,
}

#[derive(Clone)]
struct Glij {
    cam: Camera,
    vast: Camera,
    begin: f64,
    /// Hij draait ook om het bord (`overgang::camera_voortgang`).
    draait: bool,
}

impl Kijk {
    /// De camera's zoals ze nu in beeld zijn: tijdens het glijden ergens tussen het begin en het doel (`cam`, `vast`).
    fn getoond(&self, nu: f64) -> Option<(Camera, Camera)> {
        let cam = self.cam.as_ref()?;
        let vast = self.vast.as_ref().unwrap_or(cam);
        let Some(g) = &self.glij else {
            return Some((cam.clone(), vast.clone()));
        };
        let k = overgang::camera_voortgang((nu - g.begin) as f32, g.draait).unwrap_or(1.0);
        Some((
            Camera::tussen(&g.cam, cam, k),
            Camera::tussen(&g.vast, vast, k),
        ))
    }
}

/// Een deel van het bord; alles met dit kenmerk gaat weg bij een ander bord.
#[derive(Component)]
struct BordDeel;

#[derive(Component)]
struct Steen {
    vak: usize,
    /// Hoe ver hij nu opgetild is, en hoe snel hij omhoog gaat (de veer).
    til: f32,
    til_v: f32,
    /// Waar hij in het vorige beeld was (x, z), voor zijn snelheid.
    vorig: Option<Vec2>,
    /// Hoe ver hij kantelt (x, z): in de hand helt hij een beetje mee met de beweging.
    kantel: Vec2,
    /// Dichtbij de camera: de fijne pion.
    fijn: bool,
}

/// Een effen materiaal van lak of metaal.
fn effen(kleur: u32, ruw: f32, metaal: f32) -> StandardMaterial {
    StandardMaterial {
        base_color: rgb(kleur),
        perceptual_roughness: ruw,
        metallic: metaal,
        ..default()
    }
}

/// Een vlek of tekening zonder licht, met de kleur `kleur` en een doorzichtigheid uit het plaatje.
fn vlek_materiaal(kleur: u32, sterk: f32, textuur: Handle<Image>) -> StandardMaterial {
    StandardMaterial {
        base_color: rgb(kleur).with_alpha(sterk),
        base_color_texture: Some(textuur),
        unlit: true,
        alpha_mode: AlphaMode::Blend,
        ..default()
    }
}

fn rgb(k: u32) -> Color {
    Color::srgb_u8((k >> 16) as u8, (k >> 8) as u8, k as u8)
}

/// Een plaatje van 1 bij 1 met grijswaarde `g` in het rode kanaal: hoeveel de omgeving meetelt.
fn grijs(images: &mut Assets<Image>, g: f32) -> Handle<Image> {
    let v = (g * 255.0).round() as u8;
    images.add(afbeelding(
        vec![v, 255, 255, 255],
        1,
        TextureFormat::Rgba8Unorm,
        false,
        false,
    ))
}

#[allow(clippy::too_many_arguments)] // Bevy-systeem: elke parameter is een stuk wereld.
fn opzetten(
    kwaliteit: Res<Kwaliteit>,
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut images: ResMut<Assets<Image>>,
    mut standaard: ResMut<Assets<StandardMaterial>>,
    mut overlay: ResMut<Assets<Overlay>>,
    mut vaste: ResMut<Assets<VastMateriaal>>,
    proxy: Res<EventLoopProxyWrapper>,
) {
    let proxy = (**proxy).clone();
    WEKKER.with_borrow_mut(|w| {
        *w = Some(Box::new(move || {
            let _ = proxy.send_event(WinitUserEvent::WakeUp);
        }))
    });

    let lak = Lakken {
        tafel: vaste.add(VastMateriaal {
            base: effen(0x0d1018, 0.6, 0.0),
            extension: Vast::nieuw(Vast::ACHTER),
        }),
        veld: [
            standaard.add(effen(0x430a0c, 0.12, 0.0)),
            standaard.add(effen(0x430a0c, 0.12, 0.0)),
        ],
        gat: standaard.add(StandardMaterial {
            double_sided: true,
            cull_mode: None,
            ..effen(0x4a0d0e, 0.2, 0.0)
        }),
        rood: standaard.add(effen(0xa3261b, 0.3, 0.0)),
        roodglad: standaard.add(effen(0x9b2117, 0.22, 0.0)),
        zwart: standaard.add(effen(0x0e0a08, 0.13, 0.0)),
        beslag: standaard.add(effen(0xd2ad5e, 0.34, 1.0)),
        messing: standaard.add(effen(0xd2ad5e, 0.3, 1.0)),
    };
    // De tafel blijft altijd liggen; hij werpt geen schaduw. Hij tekent met de vaste camera, dus de camera die zoomt
    // mag hem niet wegknippen.
    commands.spawn((
        Mesh3d(meshes.add(naar_mesh(lak::tafel(), false))),
        MeshMaterial3d(lak.tafel.clone()),
        NotShadowCaster,
        NoFrustumCulling,
    ));

    let vlak = |maat: f32| Plane3d::default().mesh().size(maat, maat).build();
    // De ring om het gat van de gekozen Steen: altijd bovenop (ook over de koppen van buren), zodat hij
    // nooit verdwijnt. Licht crème, zoals de ring op het platte bord en de tekst op het lak: het bijna zwarte
    // lak van het prototype viel weg op het rode lak (council, taak 168). Geen jade: dat is het doelvakje
    // van de Speluitleg, en dat mag in een Potje niet lijken op een hint.
    let ring_materiaal = overlay.add(Overlay {
        kleur: {
            let k = rgb(0xfff3dc).to_linear();
            Vec4::new(k.red, k.green, k.blue, 0.95)
        },
        textuur: images.add(afbeelding(
            textuur::ring(256),
            256,
            TextureFormat::Rgba8UnormSrgb,
            true,
            false,
        )),
    });
    let geen_schaduw = || (NotShadowCaster, NotShadowReceiver);
    let ring = commands
        .spawn((
            Mesh3d(meshes.add(vlak(1.5))),
            MeshMaterial3d(ring_materiaal),
            Transform::from_xyz(0.0, 0.006, 0.0),
            Visibility::Hidden,
            geen_schaduw(),
        ))
        .id();
    // Het doelvakje van een oefening (Speluitleg): een lichte jadering, breder dan de ring van de
    // gekozen Steen en ook altijd bovenop. Licht jade valt op tegen het rode lak en de gouden ringetjes.
    let doel_materiaal = overlay.add(Overlay {
        kleur: {
            let k = rgb(0xc4f0d6).to_linear();
            Vec4::new(k.red, k.green, k.blue, 0.95)
        },
        textuur: images.add(afbeelding(
            textuur::ring(256),
            256,
            TextureFormat::Rgba8UnormSrgb,
            true,
            false,
        )),
    });
    let doelring = commands
        .spawn((
            Mesh3d(meshes.add(vlak(1.75))),
            MeshMaterial3d(doel_materiaal),
            Transform::from_xyz(0.0, 0.005, 0.0),
            Visibility::Hidden,
            geen_schaduw(),
        ))
        .id();
    // De landingsschaduw: een scherpe donkere schijf, precies op het gat.
    let landing_materiaal = standaard.add(vlek_materiaal(
        0x140802,
        1.0,
        images.add(afbeelding(
            textuur::landing(128),
            128,
            TextureFormat::Rgba8UnormSrgb,
            true,
            false,
        )),
    ));
    let landing = commands
        .spawn((
            Mesh3d(meshes.add(vlak(2.0 * textuur::LANDING_BEREIK))),
            MeshMaterial3d(landing_materiaal),
            Transform::from_xyz(0.0, 0.01, 0.0),
            Visibility::Hidden,
            geen_schaduw(),
        ))
        .id();
    let zweef_materiaal = standaard.add(vlek_materiaal(
        0x140802,
        0.5,
        images.add(afbeelding(
            textuur::zweef(128),
            128,
            TextureFormat::Rgba8UnormSrgb,
            true,
            false,
        )),
    ));
    let zweef = commands
        .spawn((
            Mesh3d(meshes.add(vlak(1.5))),
            MeshMaterial3d(zweef_materiaal.clone()),
            Transform::from_xyz(0.0, 0.011, 0.0),
            Visibility::Hidden,
            geen_schaduw(),
        ))
        .id();
    let contact = standaard.add(vlek_materiaal(
        0x1a0c04,
        0.6,
        images.add(afbeelding(
            textuur::contact(128),
            128,
            TextureFormat::Rgba8UnormSrgb,
            true,
            false,
        )),
    ));

    // Eén lamp met schaduw, als een lantaarn links achter boven het bord (`zet_lamp`).
    commands.spawn((
        SpotLight {
            color: LAMP_KLEUR,
            intensity: lamp_lumen(),
            range: LAMP_VAN.length() * LAMP_VER * 2.0,
            shadow_maps_enabled: true,
            shadow_map_near_z: LAMP_VAN.length() * LAMP_VER * 0.6,
            inner_angle: LAMP_BINNEN * (LAMP_KEGEL.tan() / LAMP_VER).atan(),
            outer_angle: (LAMP_KEGEL.tan() / LAMP_VER).atan(),
            ..default()
        },
        Transform::default(),
    ));

    commands.spawn((
        Camera3d::default(),
        // Aan in `camera_aan`.
        bevy::camera::Camera {
            is_active: false,
            ..default()
        },
        Projection::from(PerspectiveProjection {
            fov: camera::BEELDHOEK,
            near: CAMERA_DICHTBIJ,
            far: CAMERA_VER,
            ..default()
        }),
        if kwaliteit.eenvoudig {
            Msaa::Off
        } else {
            Msaa::Sample4
        },
        // Zoals het prototype (three.js `NeutralToneMapping`), en een belichting van 1: het licht in
        // het prototype komt zonder omrekenen op het scherm.
        Tonemapping::KhronosPbrNeutral,
        DebandDither::Enabled,
        Exposure {
            ev100: -(1.2f32.log2()),
        },
        // Eén lamp, en de vaste laag kijkt van een andere plek dan deze camera (taak 190): één vak voor het licht, dan
        // vindt elk beeldpunt de lamp, waar hij ook ligt.
        ClusterConfig::Single,
        Transform::from_xyz(0.0, 60.0, 10.0).looking_at(Vec3::ZERO, Vec3::Y),
    ));

    let omgeving_steen = [
        grijs(&mut images, OMGEVING_STEEN),
        grijs(&mut images, OMGEVING_STEEN * 0.5),
    ];
    let mut bevy = Bevy {
        lak,
        plaatjes: HashMap::new(),
        ontvangen: HashSet::new(),
        steen: Vec::new(),
        omgeving_steen,
        contact,
        contact_mesh: meshes.add(vlak(1.42)),
        zweef_materiaal,
        pion: [
            meshes.add(pion_mesh(pion::GROF)),
            meshes.add(pion_mesh(pion::FIJN)),
        ],
        ring,
        doelring,
        landing,
        zweef,
        stenen: Vec::new(),
        contacten: Vec::new(),
        kleuren: KLEUREN.to_vec(),
        stoffen: [
            (Stof::Celadon, effen(0xa9c6ae, 0.16, 0.0)),
            (Stof::Lak, effen(0x0e0a08, 0.13, 0.0)),
            (Stof::RoodGlad, effen(0x9b2117, 0.22, 0.0)),
            (Stof::Messing, effen(0xd2ad5e, 0.3, 1.0)),
            (Stof::Thee, effen(0x6b3a12, 0.04, 0.1)),
            (Stof::Zeepsteen, effen(0xc79a55, 0.28, 0.0)),
            (Stof::Pasta, effen(0xb3261c, 0.75, 0.0)),
            (Stof::Zijde, effen(0xa3160f, 0.55, 0.0)),
        ]
        .into_iter()
        .map(|(stof, m)| {
            (
                stof,
                vaste.add(VastMateriaal {
                    base: m,
                    extension: Vast::nieuw(Vast::VOOR),
                }),
            )
        })
        .collect(),
    };
    for (speler, &rgb) in KLEUREN.iter().enumerate() {
        let m = steen_materiaal(&bevy, speler, rgb, &mut images);
        bevy.steen.push(standaard.add(m));
    }
    commands.insert_resource(bevy);
    commands.insert_resource(Spel {
        indeling: Indeling::nieuw(false),
        stand: Vec::new(),
        gekozen: None,
        doel: None,
        onderweg: None,
        verschijnt: None,
        hups: Vec::new(),
        draai: 0.0,
        hand: Hand::Leeg,
        sleep_getoond: None,
        veranderd: true,
        beelden: 0,
        gebouwd: 0.0,
    });
    commands.insert_resource(Kijk::default());
    commands.insert_resource(Tafel::default());
    commands.insert_resource(Klok::default());
}

/// Hoeveel lumen de lamp nodig heeft: Bevy deelt door 4 pi en door de afstand in het kwadraat; het
/// prototype rekent zonder afname (`decay` 0) met sterkte `LAMP_STERK`.
fn lamp_lumen() -> f32 {
    let d = LAMP_VAN.length() * LAMP_VER;
    LAMP_STERK * 4.0 * std::f32::consts::PI * d * d
}

/// Zet de lamp links achter boven het bord, gezien vanaf de camera.
fn lamp_plek(cam: &Camera) -> Transform {
    let draai = Quat::from_rotation_y(cam.draai);
    // Het prototype richt de lamp iets voor het punt waar de camera naar kijkt (in het Potje 0,9,
    // op de tafel met voorwerpen het midden van alles): `doel * 0,55 + 0,6`.
    let midden = cam.midden();
    let doel = if cam.is_tafel() {
        // Het midden zoals de Speler het ziet (zonder de draai van de tafel), daarna met de camera mee.
        let m = crate::camera::draai_xz(midden, -cam.draai);
        draai * Vec3::new(m.x, 0.0, m.y * 0.55 + 0.6)
    } else {
        draai * Vec3::new(0.0, 0.0, 0.9 * 0.55 + 0.6)
    };
    Transform::from_translation(doel + draai * LAMP_VAN * LAMP_VER).looking_at(doel, Vec3::Y)
}

/// Het materiaal van de Stenen van `speler` in kleur `rgb`: gekleurde lak met een blanke laag, het
/// teken op de kop. De inktsteen is mat (zie `steen::Lak`).
fn steen_materiaal(
    bevy: &Bevy,
    speler: usize,
    rgb: u32,
    images: &mut Assets<Image>,
) -> StandardMaterial {
    let lak = steen::lak(rgb);
    let teken = speler % steen::AANTAL_TEKENS;
    let plaatje = images.add(afbeelding(
        textuur::steen(128, lak.kleur, lak.inkt, teken),
        128,
        TextureFormat::Rgba8UnormSrgb,
        true,
        false,
    ));
    StandardMaterial {
        base_color_texture: Some(plaatje),
        perceptual_roughness: if lak.mat { 0.62 } else { 0.42 },
        clearcoat: if lak.mat { 0.3 } else { 1.0 },
        clearcoat_perceptual_roughness: if lak.mat { 0.3 } else { 0.07 },
        occlusion_texture: Some(bevy.omgeving_steen[lak.mat as usize].clone()),
        ..default()
    }
}

/// De pion als Bevy-mesh.
fn pion_mesh(versie: (usize, f32)) -> Mesh {
    let m = pion::mesh(versie);
    Mesh::new(
        PrimitiveTopology::TriangleList,
        RenderAssetUsages::RENDER_WORLD,
    )
    .with_inserted_attribute(Mesh::ATTRIBUTE_POSITION, m.plekken)
    .with_inserted_attribute(Mesh::ATTRIBUTE_NORMAL, m.normalen)
    .with_inserted_attribute(Mesh::ATTRIBUTE_UV_0, m.uv)
    .with_inserted_indices(Indices::U32(m.driehoeken))
}

/// Een deel van het bord als Bevy-mesh. `kleuren`: met een grijswaarde per hoekpunt (de gaten).
fn naar_mesh(m: lak::Deel, kleuren: bool) -> Mesh {
    let mesh = Mesh::new(
        PrimitiveTopology::TriangleList,
        RenderAssetUsages::RENDER_WORLD,
    )
    .with_inserted_attribute(Mesh::ATTRIBUTE_POSITION, m.plekken)
    .with_inserted_attribute(Mesh::ATTRIBUTE_NORMAL, m.normalen)
    .with_inserted_attribute(Mesh::ATTRIBUTE_UV_0, m.uv)
    .with_inserted_attribute(Mesh::ATTRIBUTE_TANGENT, m.tangenten)
    .with_inserted_indices(Indices::U32(m.driehoeken));
    if kleuren {
        mesh.with_inserted_attribute(Mesh::ATTRIBUTE_COLOR, m.kleuren)
    } else {
        mesh
    }
}

/// Zet de camera aan als de plaatjes van het bord er zijn, of na `PLAATJES_EERST`. Daarna telt het bord zijn beelden opnieuw:
/// de shaders komen pas vanaf nu in de wachtrij.
fn camera_aan(
    mut spel: ResMut<Spel>,
    bevy: Res<Bevy>,
    tijd: Res<Time<Real>>,
    mut camera: Query<&mut bevy::camera::Camera, With<Camera3d>>,
) {
    let Ok(mut cam) = camera.single_mut() else {
        return;
    };
    if cam.is_active || bevy.stenen.is_empty() {
        return;
    }
    let wacht = tijd.elapsed_secs_f64() - spel.gebouwd;
    if plaatjes_klaar(&bevy, spel.indeling.vierkant) || wacht > PLAATJES_EERST {
        cam.is_active = true;
        spel.beelden = 0;
    }
}

fn begin_beeld() {
    BEZIG.set(true);
}

fn einde_beeld(mut redraw: MessageWriter<RequestRedraw>) {
    BEZIG.set(false);
    BEELDEN.set(BEELDEN.get().wrapping_add(1));
    if NOG_EEN.replace(false) {
        redraw.write(RequestRedraw);
    }
}

fn tel_wachtend(cache: Res<PipelineCache>) {
    WACHTEND.store(cache.waiting_pipelines().count() as u32, Ordering::Relaxed);
}

/// Haal de berichten van TypeScript op.
#[allow(clippy::too_many_arguments)] // Bevy-systeem: elke parameter is een stuk wereld.
fn lees_post(
    mut commands: Commands,
    mut spel: ResMut<Spel>,
    mut bevy: ResMut<Bevy>,
    mut kijk: ResMut<Kijk>,
    mut tafel: ResMut<Tafel>,
    oud: Query<Entity, With<BordDeel>>,
    camera: Query<Entity, With<Camera3d>>,
    mut meshes: ResMut<Assets<Mesh>>,
    mut images: ResMut<Assets<Image>>,
    mut standaard: ResMut<Assets<StandardMaterial>>,
    mut vaste: ResMut<Assets<VastMateriaal>>,
    tijd: Res<Time<Real>>,
    mut klok: ResMut<Klok>,
) {
    let post = POST.with_borrow_mut(std::mem::take);
    let bevy = &mut *bevy;
    let nu = tijd.elapsed_secs_f64();
    klok.0 = beweging::klok_loopt(klok.0, tijd.delta_secs());
    let klok = klok.0;
    let mut kleuren_anders = false;
    // Overgangen alleen als het bord al in beeld stond, en niet bij minder beweging (UI-overgangen).
    let zacht = KLAAR.get() && !MINDER.get();

    if let Some(k) = post.kleuren
        && !k.is_empty()
    {
        bevy.kleuren = k;
        kleuren_anders = true;
    }

    if !post.plaatjes.is_empty() {
        for (naam, breedte, hoogte, data) in post.plaatjes {
            bevy.ontvangen.insert(naam.clone());
            if let Some(h) = maak_plaatje(&naam, breedte, hoogte, data) {
                bevy.plaatjes.insert(naam, images.add(h));
            }
        }
        pas_plaatjes_toe(bevy, &mut standaard, &mut vaste);
        let glans = bevy.plaatjes.get("omgeving_glans").cloned();
        let licht = bevy.plaatjes.get("omgeving_licht").cloned();
        if let (Some(glans), Some(licht), Ok(cam)) = (glans, licht, camera.single()) {
            commands.entity(cam).insert(EnvironmentMapLight {
                diffuse_map: licht,
                specular_map: glans,
                intensity: 1.0,
                ..default()
            });
        }
        spel.veranderd = true;
    }

    if let Some((vierkant, kijk_naar)) = post.bord {
        let indeling = Indeling::nieuw(vierkant);
        let draai = kijk_naar.map_or(0.0, |p| indeling.kijkhoek(indeling.naar_3d(p)));
        // Hetzelfde bord blijft staan, met zijn Stenen: een nieuwe stand hupt dan (UI-overgangen). Een ander bord wordt gebouwd.
        let zelfde = GEBOUWD.get() == Some(vierkant) && !bevy.stenen.is_empty();
        if !zelfde {
            for e in &oud {
                commands.entity(e).despawn();
            }
            bouw_bord(
                &mut commands,
                bevy,
                &indeling,
                &mut meshes,
                &mut images,
                &mut standaard,
            );
            spel.stand = vec![-1; indeling.vakken.len()];
            spel.hups = vec![None; indeling.vakken.len()];
            spel.beelden = 0;
            spel.gebouwd = nu;
            KLAAR.set(false);
            GEBOUWD.set(Some(vierkant));
        }
        spel.hand = Hand::Leeg;
        spel.sleep_getoond = None;
        spel.gekozen = None;
        spel.doel = None;
        spel.onderweg = None;
        spel.verschijnt = None;
        spel.indeling = indeling;
        spel.veranderd = true;
        // Draait het bord naar een andere Speler (het begin van een Potje), dan draait de camera erheen; de voorwerpen en de
        // tekens op de Stenen draaien mee (`Kijk::toon_draai`), dus die blijven op het scherm waar ze waren.
        let glij = zacht && zelfde;
        spel.draai = draai;
        kijk.draai = draai;
        if glij && kijk.voorwerpen.is_empty() {
            // Tussen twee schermen: de tafel van het nieuwe scherm komt zo (zie `LIJST_GEDULD`).
            kijk.wacht_op_lijst = Some(klok);
        } else {
            nieuwe_camera(&mut kijk, &spel.indeling, glij.then_some(klok));
        }
    }

    if let Some(lijst) = post.voorwerpen {
        let nieuw = voorwerp::lees(&lijst);
        let leeg = nieuw.iter().all(Option::is_none);
        bouw_voorwerpen(
            &mut commands,
            bevy,
            &mut tafel,
            nieuw,
            kijk.draai,
            &mut meshes,
            &mut images,
            &mut vaste,
            zacht.then_some(klok),
        );
        kijk.voorwerpen = tafel.voorwerpen.iter().flatten().cloned().collect();
        // Een lege lijst (het scherm gaat weg) laat de camera even staan: het volgende scherm legt meestal meteen zijn eigen
        // tafel, en dan glijdt de camera daar in één keer heen (zie `LIJST_GEDULD`).
        if leeg {
            kijk.wacht_op_lijst = Some(klok);
        } else {
            kijk.wacht_op_lijst = None;
            nieuwe_camera(&mut kijk, &spel.indeling, zacht.then_some(klok));
        }
        spel.veranderd = true;
    }
    for (nummer, plek) in post.verplaats {
        if let Some(Some(v)) = tafel.voorwerpen.get_mut(nummer) {
            v.midden = plek;
            spel.veranderd = true;
        }
    }
    for (nummer, breedte, hoogte, data) in post.platen {
        let materiaal = tafel.platen.get(nummer).cloned().flatten();
        if let Some(materiaal) = materiaal
            && breedte > 0
            && hoogte > 0
            && data.len() == (breedte * hoogte * 4) as usize
            && let Some(mut m) = vaste.get_mut(&materiaal)
        {
            m.base.base_color = Color::WHITE;
            m.base.base_color_texture = Some(images.add(rechthoek(
                data,
                breedte,
                hoogte,
                TextureFormat::Rgba8UnormSrgb,
                true,
                false,
            )));
        }
    }
    for (nummer, aan) in post.druk {
        if let Some(d) = tafel.druk.get_mut(nummer) {
            d.1 = if aan { 1.0 } else { 0.0 };
        }
    }
    for (nummer, deel, aan) in post.schakelaars {
        if let Some(k) = tafel.kralen.get_mut(nummer).and_then(|k| k.get_mut(deel)) {
            k.1 = aan;
        }
    }

    if kleuren_anders {
        for speler in 0..bevy.steen.len() {
            let rgb = bevy.kleuren[speler % bevy.kleuren.len()];
            let m = steen_materiaal(bevy, speler, rgb, &mut images);
            if let Some(mut oud) = standaard.get_mut(&bevy.steen[speler]) {
                *oud = m;
            }
        }
        spel.veranderd = true;
    }

    let n = spel.indeling.vakken.len();
    if let Some(stand) = post.stand
        && stand.len() == n
    {
        // Stenen die erbij komen, weggaan of van kleur wisselen zonder Zet: ze huppen (UI-overgangen).
        if zacht {
            for h in overgang::stand_hup(&spel.stand, &stand, &spel.indeling.vakken) {
                spel.hups[h.vak] = Some(Huppend {
                    hup: h.hup,
                    begin: klok + h.wacht as f64,
                    oud: spel.stand[h.vak],
                });
            }
        }
        spel.stand = stand;
        spel.veranderd = true;
    }
    if let Some(vakken) = post.doel {
        let nieuw = doelvakje(&vakken, n);
        if nieuw != spel.doel {
            spel.doel = nieuw;
            spel.veranderd = true;
        }
    }
    if let Some(vak) = post.gekozen {
        let nieuw = usize::try_from(vak).ok().filter(|v| *v < n);
        if nieuw != spel.gekozen {
            spel.gekozen = nieuw;
            spel.veranderd = true;
        }
    }
    // Eerst de hand: is de steen net neergezet, dan hoeft de hup van die Zet niet meer.
    hand_post(&mut spel, post.sleep, post.loslaten, post.mis, nu);
    if let Some((vakken, hup_ms, minder)) = post.beweeg {
        let pad: Vec<usize> = vakken.iter().map(|v| *v as usize).collect();
        let laatste = pad.last().copied().filter(|v| *v < n);
        if spel.hand.hup_overbodig(&pad) {
            // De steen is al neergezet op zijn nieuwe vak: geen hup meer.
        } else if let Some(naar) = laatste {
            if minder {
                spel.onderweg = None;
                spel.verschijnt = Some((naar, 0.0));
            } else {
                let punten = vakken
                    .iter()
                    .filter_map(|v| spel.indeling.vakken.get(*v as usize).copied())
                    .collect();
                spel.onderweg = Huppel::nieuw(punten, hup_ms / 1000.0).map(|h| (naar, h, klok));
            }
            spel.veranderd = true;
        }
    }
    if let Some(vlak) = post.vlak {
        kijk.vlak = Some(vlak);
        kijk.venster = None;
    }
    // De vingers gaan naar `bediening`.
    commands.insert_resource(Invoer {
        vingers: post.vingers,
    });
}

/// Een plaatje van TypeScript als Bevy-plaatje, of `None` (leeg, of de maat klopt niet).
fn maak_plaatje(naam: &str, breedte: u32, hoogte: u32, data: Vec<u8>) -> Option<Image> {
    if data.is_empty() {
        return None;
    }
    if naam.starts_with("omgeving_") {
        return kubus(data, breedte);
    }
    if data.len() != (breedte * hoogte * 4) as usize
        || !breedte.is_power_of_two()
        || !hoogte.is_power_of_two()
    {
        return None;
    }
    // Alleen de kleur is sRGB; normaal, ruwheid en metaal zijn getallen.
    let formaat = if naam.ends_with("_kleur") {
        TextureFormat::Rgba8UnormSrgb
    } else {
        TextureFormat::Rgba8Unorm
    };
    let herhaal = naam.starts_with("tafel_") || naam.starts_with("rand_");
    Some(rechthoek(data, breedte, hoogte, formaat, true, herhaal))
}

/// Zet de plaatjes die er zijn in de materialen. Een plaatje dat er (nog) niet is: een effen kleur.
fn pas_plaatjes_toe(
    bevy: &Bevy,
    standaard: &mut Assets<StandardMaterial>,
    vaste: &mut Assets<VastMateriaal>,
) {
    let p = |naam: &str| bevy.plaatjes.get(naam).cloned();
    if let Some(mut v) = vaste.get_mut(&bevy.lak.tafel) {
        let m = &mut v.base;
        if let Some(k) = p("tafel_kleur") {
            m.base_color = Color::WHITE;
            m.base_color_texture = Some(k);
        }
        m.normal_map_texture = p("tafel_normaal");
        if let Some(r) = p("tafel_ruw") {
            // Groen: ruwheid; rood: hoeveel de omgeving meetelt (0,3, gebakken in `bak.js`).
            m.perceptual_roughness = 1.0;
            m.metallic_roughness_texture = Some(r.clone());
            m.occlusion_texture = Some(r);
        }
    }
    for (i, naam) in ["ster", "vierkant"].into_iter().enumerate() {
        if let Some(mut m) = standaard.get_mut(&bevy.lak.veld[i]) {
            if let Some(k) = p(&format!("{naam}_kleur")) {
                m.base_color = Color::WHITE;
                m.base_color_texture = Some(k);
            }
            m.normal_map_texture = p(&format!("{naam}_normaal"));
            if let Some(orm) = p(&format!("{naam}_orm")) {
                // Rood: holte, groen: ruwheid, blauw: metaal (het goud), zoals glTF.
                m.perceptual_roughness = 1.0;
                m.metallic = 1.0;
                m.metallic_roughness_texture = Some(orm.clone());
                m.occlusion_texture = Some(orm);
            }
        }
    }
    for (materiaal, naam) in [(&bevy.lak.rood, "rand"), (&bevy.lak.beslag, "beslag")] {
        if let Some(mut m) = standaard.get_mut(materiaal) {
            if let Some(k) = p(&format!("{naam}_kleur")) {
                m.base_color = Color::WHITE;
                m.base_color_texture = Some(k);
            }
            m.normal_map_texture = p(&format!("{naam}_normaal"));
        }
    }
}

/// Zijn alle plaatjes van dit bord binnen (of mislukt)?
fn plaatjes_klaar(bevy: &Bevy, vierkant: bool) -> bool {
    let veld = if vierkant { "vierkant" } else { "ster" };
    PLAATJES.iter().all(|n| bevy.ontvangen.contains(*n))
        && VELD_PLAATJES
            .iter()
            .all(|n| bevy.ontvangen.contains(&format!("{veld}_{n}")))
}

/// Slepen, loslaten en een Zet die niet mag.
fn hand_post(
    spel: &mut Spel,
    sleep: Option<(usize, Vec2)>,
    loslaten: Option<i32>,
    mis: Option<(usize, usize)>,
    nu: f64,
) {
    let n = spel.indeling.vakken.len();
    let bezet = |s: &Spel, v: usize| s.stand.get(v).is_some_and(|&x| x >= 0);
    if let Some((vak, plek)) = sleep
        && vak < n
    {
        if !matches!(spel.hand, Hand::Sleept { vak: v, .. } if v == vak) {
            spel.sleep_getoond = None;
        }
        spel.hand = Hand::Sleept { vak, plek };
        spel.veranderd = true;
    }
    if let Some(naar) = loslaten
        && let Hand::Sleept { vak, plek } = spel.hand
    {
        let van = spel.indeling.vakken[vak];
        let getoond = spel.sleep_getoond.take().unwrap_or(plek);
        spel.hand = match usize::try_from(naar).ok().filter(|v| *v < n) {
            Some(naar) => Hand::Valt {
                van: vak,
                naar,
                rust: van,
                val: Val::nieuw(getoond, SLEEP_HOOGTE, spel.indeling.vakken[naar]),
                sinds: nu,
            },
            None => Hand::Rolt {
                vak,
                terug: Terug::na_slepen(getoond, SLEEP_HOOGTE, van),
                sinds: nu,
            },
        };
        spel.veranderd = true;
    }
    if let Some((van, naar)) = mis
        && van < n
        && naar < n
        && bezet(spel, van)
    {
        let (a, b) = (spel.indeling.vakken[van], spel.indeling.vakken[naar]);
        // Liggen er stenen op de weg? Dan gaat hij er in een boog overheen.
        let over_stenen = (0..n).any(|v| {
            v != van && v != naar && bezet(spel, v) && {
                let p = spel.indeling.vakken[v];
                let t = ((p - a).dot(b - a) / (b - a).length_squared().max(1e-6)).clamp(0.0, 1.0);
                p.distance(a + (b - a) * t) < 0.62
            }
        });
        spel.hand = Hand::Rolt {
            vak: van,
            terug: Terug::poging(a, b, bezet(spel, naar), over_stenen),
            sinds: nu,
        };
        spel.veranderd = true;
    }
}

#[derive(Resource, Default)]
struct Invoer {
    vingers: Vec<(u64, u8, Vec2, f64)>,
}

/// Bouw het bord: speelveld, gaten, rand, beslag, nagels, de schaduw op tafel, en per vak een Steen
/// en zijn contactschaduw (onzichtbaar tot er een Steen staat).
fn bouw_bord(
    commands: &mut Commands,
    bevy: &mut Bevy,
    indeling: &Indeling,
    meshes: &mut Assets<Mesh>,
    images: &mut Assets<Image>,
    standaard: &mut Assets<StandardMaterial>,
) {
    let v = indeling.vierkant;
    let [boven, binnen, buiten] = lak::rand(v);
    let delen = [
        (
            lak::veld(v, &indeling.vakken),
            bevy.lak.veld[v as usize].clone(),
            false,
        ),
        (lak::gaten(v, &indeling.vakken), bevy.lak.gat.clone(), true),
        (boven, bevy.lak.rood.clone(), false),
        (binnen, bevy.lak.roodglad.clone(), false),
        (buiten, bevy.lak.zwart.clone(), false),
        (lak::beslag(v), bevy.lak.beslag.clone(), false),
        (lak::nagels(v), bevy.lak.messing.clone(), false),
    ];
    for (deel, materiaal, gat) in delen {
        let mut e = commands.spawn((
            BordDeel,
            Mesh3d(meshes.add(naar_mesh(deel, gat))),
            MeshMaterial3d(materiaal),
        ));
        if gat {
            // De binnenkant van een gat werpt geen schaduw: hij ligt onder het speelveld.
            e.insert(NotShadowCaster);
        }
    }

    // Een zachte schaduw van het hele bord op tafel, naast de echte schaduw van de lamp.
    let rand = indeling.plank();
    let bereik = rand.iter().map(|p| p.length()).fold(0.0, f32::max) + 3.0;
    let schaduw = images.add(afbeelding(
        textuur::plank_schaduw(128, &rand, bereik),
        128,
        TextureFormat::Rgba8UnormSrgb,
        true,
        false,
    ));
    commands.spawn((
        BordDeel,
        Mesh3d(
            meshes.add(
                Plane3d::default()
                    .mesh()
                    .size(2.0 * bereik, 2.0 * bereik)
                    .build(),
            ),
        ),
        MeshMaterial3d(standaard.add(StandardMaterial {
            base_color: Color::WHITE,
            base_color_texture: Some(schaduw),
            unlit: true,
            alpha_mode: AlphaMode::Blend,
            ..default()
        })),
        Transform::from_xyz(0.25, lak::TAFEL_Y + 0.004, 0.35),
        NotShadowCaster,
        NotShadowReceiver,
    ));

    bevy.stenen.clear();
    bevy.contacten.clear();
    for (vak, p) in indeling.vakken.iter().enumerate() {
        bevy.stenen.push(
            commands
                .spawn((
                    BordDeel,
                    Steen {
                        vak,
                        til: 0.0,
                        til_v: 0.0,
                        vorig: None,
                        kantel: Vec2::ZERO,
                        fijn: false,
                    },
                    Mesh3d(bevy.pion[0].clone()),
                    MeshMaterial3d(bevy.steen[0].clone()),
                    Transform::from_xyz(p.x, -ZAKT, p.y),
                    Visibility::Hidden,
                ))
                .id(),
        );
        bevy.contacten.push(
            commands
                .spawn((
                    BordDeel,
                    Mesh3d(bevy.contact_mesh.clone()),
                    MeshMaterial3d(bevy.contact.clone()),
                    Transform::from_xyz(p.x, 0.008, p.y),
                    Visibility::Hidden,
                    NotShadowCaster,
                    NotShadowReceiver,
                ))
                .id(),
        );
    }
}

/// De camera met overzicht over het hele bord, gedraaid met `kijk.draai`. Liggen er voorwerpen op
/// de tafel, dan over het bord en de voorwerpen samen (gezien vanaf de kant van Speler 1). Hij blijft
/// daar staan.
///
/// `glij`: de tijd nu, als de camera van waar hij in beeld is naar zijn nieuwe plek glijdt (UI-overgangen); anders staat hij er meteen.
fn nieuwe_camera(kijk: &mut Kijk, indeling: &Indeling, glij: Option<f64>) {
    kijk.glij = glij.and_then(|nu| {
        let (cam, vast) = kijk.getoond(nu)?;
        let verschil = (cam.draai - kijk.draai + std::f32::consts::PI)
            .rem_euclid(std::f32::consts::TAU)
            - std::f32::consts::PI;
        Some(Glij {
            draait: verschil.abs() > 1e-3,
            cam,
            vast,
            begin: nu,
        })
    });
    // Ook nieuwe materialen van de vaste laag (nieuwe voorwerpen) moeten de vaste camera horen.
    kijk.vast_klem = None;
    let venster = kijk
        .venster
        .unwrap_or(Venster::heel(Vec2::new(390.0, 844.0)));
    kijk.greep = None;
    kijk.cam = Some(if kijk.voorwerpen.is_empty() {
        Camera::overzicht(venster, kijk.draai, &indeling.rand(), indeling.vierkant)
    } else {
        // Het bord staat gedraaid naar de Speler; de voorwerpen liggen zoals de web-app ze neerlegt.
        let rand: Vec<Vec2> = indeling
            .rand()
            .iter()
            .map(|&p| crate::camera::draai_xz(p, -kijk.draai))
            .collect();
        Camera::tafel(
            venster,
            &voorwerp::tafel_punten(&rand, &kijk.voorwerpen),
            kijk.draai,
        )
    });
    kijk.vast = kijk.cam.clone();
}

/// Vingers en muis: tikken melden, en de camera bewegen (taak 186): knijpen zoomt naar de plek tussen
/// de vingers, ingezoomd schuift een vinger op een lege plek het beeld. Draaien, rekken, terugveren en
/// uitlopen bestaan niet: zonder vingers staat het bord stil. Uitgezoomd tot het overzicht is er niets
/// om te schuiven. Taak 190: het bord wordt gepakt (`Camera::pak`) en volgt de vingers vanaf die greep
/// (`Camera::volg`), met zacht afremmen tegen de grenzen.
fn bediening(
    mut kijk: ResMut<Kijk>,
    invoer: Option<Res<Invoer>>,
    venster: Query<&Window, With<PrimaryWindow>>,
    mut redraw: MessageWriter<RequestRedraw>,
) {
    let Ok(venster) = venster.single() else {
        return;
    };
    let scherm = Vec2::new(venster.width(), venster.height());
    if scherm.x < 1.0 || scherm.y < 1.0 {
        return;
    }
    let kijk = &mut *kijk;
    let nu = kijk.vlak.map_or(Venster::heel(scherm), |(p, m)| {
        Venster::met_vlak(scherm, p, m)
    });
    if kijk.venster != Some(nu) {
        kijk.venster = Some(nu);
        kijk.greep = None;
        if let Some(cam) = kijk.cam.as_mut() {
            cam.nieuw_venster(nu);
        }
        if let Some(cam) = kijk.vast.as_mut() {
            cam.nieuw_venster(nu);
        }
    }
    let Some(invoer) = invoer else { return };
    let mut tikken = Vec::new();
    let mut bewogen = false;
    for &(id, fase, p, t) in &invoer.vingers {
        let acties = match fase {
            0 => {
                kijk.gebaren.neer(id, p, t);
                Vec::new()
            }
            1 => kijk.gebaren.beweeg(id, p, t),
            2 => kijk.gebaren.op(id, p, t),
            _ => {
                kijk.gebaren.afgebroken(id);
                Vec::new()
            }
        };
        for actie in acties {
            match actie {
                Actie::Tik(p) => tikken.push(p),
                Actie::Pak { midden } => {
                    // Vingers op het bord: de camera staat meteen op zijn plek (de greep rekent vanaf het doel).
                    kijk.glij = None;
                    kijk.greep = kijk.cam.as_ref().and_then(|c| c.pak(midden));
                }
                Actie::Volg { midden, zoom } => {
                    if let (Some(cam), Some(greep)) = (kijk.cam.as_mut(), kijk.greep.as_mut()) {
                        let voor = (cam.afstand, cam.doel);
                        cam.volg(greep, midden, zoom);
                        bewogen |= (cam.afstand, cam.doel) != voor;
                    }
                }
            }
        }
    }
    if bewogen {
        redraw.write(RequestRedraw);
    }
    for p in tikken {
        meld_tik(p);
    }
}

fn meld_tik(plek: Vec2) {
    let f = BIJ_TIK.with_borrow(|f| f.clone());
    if let Some(f) = f {
        let _ = f.call2(
            &JsValue::NULL,
            &JsValue::from(plek.x),
            &JsValue::from(plek.y),
        );
    }
}

fn meld_camera(overzicht: bool) {
    let f = BIJ_CAMERA.with_borrow(|f| f.clone());
    if let Some(f) = f {
        let _ = f.call1(&JsValue::NULL, &JsValue::from(overzicht));
    }
}

#[allow(clippy::too_many_arguments)] // Bevy-systeem.
fn camera_bijwerken(
    mut kijk: ResMut<Kijk>,
    spel: Res<Spel>,
    klok: Res<Klok>,
    mut camera: Query<&mut Transform, (With<Camera3d>, Without<SpotLight>)>,
    mut lamp: Query<&mut Transform, (With<SpotLight>, Without<Camera3d>)>,
    venster: Query<&Window, With<PrimaryWindow>>,
    mut vaste: ResMut<Assets<VastMateriaal>>,
    mut redraw: MessageWriter<RequestRedraw>,
) {
    let kijk = &mut *kijk;
    let nu = klok.0;
    // Geen nieuwe tafel gekomen na een lege lijst: dan het bord alleen (zie `LIJST_GEDULD`).
    if let Some(sinds) = kijk.wacht_op_lijst {
        if nu - sinds < LIJST_GEDULD {
            redraw.write(RequestRedraw);
        } else {
            kijk.wacht_op_lijst = None;
            if kijk.voorwerpen.is_empty() {
                let glij = (KLAAR.get() && !MINDER.get()).then_some(nu);
                nieuwe_camera(kijk, &spel.indeling, glij);
            }
        }
    }
    // Glijdt de camera (UI-overgangen), dan elk beeld een stukje verder; daarna staat hij weer stil.
    if let Some(g) = &kijk.glij {
        if overgang::camera_voortgang((nu - g.begin) as f32, g.draait).is_none() {
            kijk.glij = None;
        } else {
            redraw.write(RequestRedraw);
        }
    }
    let Some((cam, vast)) = kijk.getoond(nu) else {
        return;
    };
    kijk.toon_draai = vast.draai;
    let cam = &cam;
    let vast = &vast;
    if let Ok(mut t) = camera.single_mut() {
        let nieuw = Transform::from_translation(cam.oog()).looking_at(cam.kijkpunt(), Vec3::Y);
        if *t != nieuw {
            *t = nieuw;
        }
    }
    // De lamp hoort bij de tafel: hij staat stil als het bord zoomt, dus licht en schaduw veranderen niet.
    if let Ok(mut t) = lamp.single_mut() {
        let nieuw = lamp_plek(vast);
        if *t != nieuw {
            *t = nieuw;
        }
    }
    // De vaste laag (tafel en voorwerpen) tekent met de vaste camera. Alleen bij een ander overzicht of venster.
    if let Ok(w) = venster.single() {
        let klem = vaste_klem(vast, w.physical_width(), w.physical_height());
        if kijk.vast_klem != Some(klem) {
            kijk.vast_klem = Some(klem);
            let oog = vast.oog().extend(1.0);
            for (_, m) in vaste.iter_mut() {
                m.extension.klem = klem;
                m.extension.oog = oog;
            }
        }
    }
    BLIK.with_borrow_mut(|b| {
        *b = Some(Blik {
            cam: cam.clone(),
            indeling_midden: spel.indeling.midden,
        })
    });
    // Ingezoomd (taak 235) zakken de voorwerpen weg (`voorwerpen_bijwerken`) en zegt de web-app hun knoppen weg: een knop zonder
    // voorwerp zou onzichtbaar over het bord liggen. De camera zit in het overzicht tot er echt is ingezoomd.
    let overzicht = !overgang::ingezoomd(cam.zoom(), kijk.gemeld_overzicht == Some(false));
    if kijk.gemeld_overzicht != Some(overzicht) {
        kijk.gemeld_overzicht = Some(overzicht);
        meld_camera(overzicht);
        redraw.write(RequestRedraw);
    }
}

/// Van de wereld naar het beeld van `cam`, precies zoals Bevy het voor zijn camera rekent (dezelfde projectie en
/// `looking_at`), op een scherm van `breedte` bij `hoogte` beeldpunten.
fn vaste_klem(cam: &Camera, breedte: u32, hoogte: u32) -> Mat4 {
    let mut projectie = PerspectiveProjection {
        fov: camera::BEELDHOEK,
        near: CAMERA_DICHTBIJ,
        far: CAMERA_VER,
        ..default()
    };
    projectie.update(breedte.max(1) as f32, hoogte.max(1) as f32);
    let zicht = Transform::from_translation(cam.oog()).looking_at(cam.kijkpunt(), Vec3::Y);
    projectie.get_clip_from_view() * zicht.to_matrix().inverse()
}

/// Een veer naar `doel`: optillen en neerzetten veren een beetje na (prototype 1b). Raakt hij het
/// bord, dan stuit hij zacht terug. Geeft `true` zolang hij beweegt.
/// Met `minder` ("minder beweging") staat hij meteen op `doel`, zonder veer.
fn veer(til: &mut f32, snel: &mut f32, doel: f32, dt: f32, minder: bool) -> bool {
    if minder {
        *til = doel;
        *snel = 0.0;
        return false;
    }
    // Twee halve stappen houden de veer rustig bij een traag beeld.
    for _ in 0..2 {
        *snel += (VEER_STIJF * (doel - *til) - VEER_DEMP * *snel) * (dt / 2.0);
        *til += *snel * (dt / 2.0);
    }
    if *til < 0.0 {
        *til = 0.0;
        *snel = snel.abs() * 0.3;
    }
    let rustig = (doel - *til).abs() < 0.002 && snel.abs() < 0.02;
    if rustig {
        *til = doel;
        *snel = 0.0;
    }
    !rustig
}

#[allow(clippy::too_many_arguments, clippy::type_complexity)] // Bevy-systeem.
fn stenen_bijwerken(
    mut spel: ResMut<Spel>,
    bevy: Res<Bevy>,
    kijk: Res<Kijk>,
    tijd: Res<Time<Real>>,
    klok: Res<Klok>,
    mut stenen: Query<(
        &mut Steen,
        &mut Transform,
        &mut Visibility,
        &mut MeshMaterial3d<StandardMaterial>,
        &mut Mesh3d,
    )>,
    mut overig: Query<(&mut Transform, &mut Visibility), (Without<Steen>, Without<Camera3d>)>,
    mut standaard: ResMut<Assets<StandardMaterial>>,
    mut redraw: MessageWriter<RequestRedraw>,
) {
    let spel = &mut *spel;
    let dt = tijd.delta_secs().min(0.05);
    let nu = tijd.elapsed_secs_f64();
    let veranderd = std::mem::take(&mut spel.veranderd);
    let mut bezig = false;
    spel.beelden = spel.beelden.saturating_add(1);
    if !KLAAR.get() && !bevy.stenen.is_empty() {
        let plaatjes =
            plaatjes_klaar(&bevy, spel.indeling.vierkant) || nu - spel.gebouwd > PLAATJES_GEDULD;
        let klaar = spel.beelden >= 8 && WACHTEND.load(Ordering::Relaxed) == 0 && plaatjes;
        KLAAR.set(klaar);
        bezig = true;
    }

    // De steen onderweg.
    let mut onderweg = None;
    if let Some((vak, huppel, begin)) = &spel.onderweg {
        let t = (klok.0 - begin) as f32;
        if huppel.klaar(t) {
            spel.onderweg = None;
        } else {
            onderweg = Some((*vak, huppel.plek(t)));
            bezig = true;
        }
    }
    let mut verschijnt = None;
    if let Some((vak, t)) = spel.verschijnt.as_mut() {
        *t += dt / 0.16;
        if *t >= 1.0 {
            spel.verschijnt = None;
        } else {
            verschijnt = Some((*vak, *t));
            bezig = true;
        }
    }

    // De steen in de hand: slepen (volgt de vinger heel kort achter), neerzetten of terugschuiven.
    let stand = spel.stand.clone();
    let bezet = |v: usize| stand.get(v).is_some_and(|&x| x >= 0);
    if spel.hand.bij(nu, bezet, spel.gekozen) {
        bezig = true;
    }
    let mut in_hand = spel.hand.steen(nu, bezet);
    if let Hand::Sleept { vak, plek } = spel.hand {
        let rust = spel.indeling.vakken.get(vak).copied().unwrap_or(plek);
        let getoond = spel.sleep_getoond.get_or_insert(rust);
        *getoond += (plek - *getoond) * (1.0 - (-dt * 32.0).exp());
        if getoond.distance(plek) > 1e-3 {
            bezig = true;
        }
        in_hand = Some((
            vak,
            beweging::Plek {
                over: *getoond,
                hoogte: SLEEP_HOOGTE,
            },
        ));
    }

    let draai_y = Quat::from_rotation_y(kijk.toon_draai);
    // De schaduwen vallen van de lamp af: naar rechts voor en naar de Speler toe.
    let van_lamp = |d: Vec2| {
        let q = draai_y * Vec3::new(d.x, 0.0, d.y);
        Vec2::new(q.x, q.z)
    };
    let mut ring_plek = None;
    // De hoogst opgetilde Steen die niet gesleept wordt: zijn zachte schaduw.
    let mut zweeft: Option<(Vec2, f32)> = None;

    let oog = kijk.cam.as_ref().map(|c| c.oog());
    let mut pionnen = Vec::with_capacity(spel.stand.len());
    for (mut steen, mut t, mut zicht, mut materiaal, mut mesh) in &mut stenen {
        let vak = steen.vak;
        // Een Steen die hupt (UI-overgangen): zolang de hup duurt, tekent hij wat de hup zegt (ook de oude Steen die weggaat).
        let huppend = spel.hups.get(vak).copied().flatten();
        let hup = huppend.and_then(|h| overgang::hup_stand(h.hup, (klok.0 - h.begin) as f32));
        if huppend.is_some() && hup.is_none() {
            spel.hups[vak] = None;
        }
        let in_stand = spel.stand.get(vak).copied().unwrap_or(-1);
        let speler = match (huppend, hup) {
            (Some(h), Some(p)) if p.oud => h.oud,
            _ => in_stand,
        };
        let hup_schaal = hup.map_or(1.0, |p| p.schaal);
        let gekozen = spel.gekozen == Some(vak) && speler >= 0;
        if veranderd || huppend.is_some() {
            let zien = speler >= 0 && hup_schaal > 0.001;
            let nieuw_zicht = if zien {
                Visibility::Inherited
            } else {
                Visibility::Hidden
            };
            if *zicht != nieuw_zicht {
                *zicht = nieuw_zicht;
            }
            if speler >= 0 {
                let nieuw = &bevy.steen[speler as usize % bevy.steen.len()];
                if materiaal.0 != *nieuw {
                    materiaal.0 = nieuw.clone();
                }
            }
        }
        if hup.is_some() {
            bezig = true;
        }
        let contact = bevy.contacten.get(vak).copied();
        if speler < 0 {
            steen.vorig = None;
            steen.kantel = Vec2::ZERO;
            steen.til = 0.0;
            steen.til_v = 0.0;
            if let Some(e) = contact
                && let Ok((_, mut z)) = overig.get_mut(e)
                && *z != Visibility::Hidden
            {
                *z = Visibility::Hidden;
            }
            continue;
        }
        let rust = spel.indeling.vakken[vak];
        let sleept = matches!(spel.hand, Hand::Sleept { vak: v, .. } if v == vak);
        let hand = in_hand.filter(|(v, _)| *v == vak).map(|(_, p)| p);
        let steen = &mut *steen;
        let (over, hoogte, beweegt) = if let Some(p) = hand {
            if sleept {
                // Optillen naar de hand, met vering.
                if veer(&mut steen.til, &mut steen.til_v, p.hoogte, dt, false) {
                    bezig = true;
                }
                (p.over, steen.til, true)
            } else {
                // Neerzetten en terugrollen: de hand bepaalt de hoogte.
                steen.til = p.hoogte;
                steen.til_v = 0.0;
                (p.over, p.hoogte, true)
            }
        } else {
            // Optillen en neerzetten: met vering.
            let doel = if gekozen { OPTILLEN } else { 0.0 };
            if veer(&mut steen.til, &mut steen.til_v, doel, dt, MINDER.get()) {
                bezig = true;
            }
            match onderweg {
                Some((v, p)) if v == vak => (p.over, steen.til + p.hoogte, true),
                _ => (rust, steen.til, false),
            }
        };
        // In beweging helt hij een beetje mee, alsof je hem bij de kop vasthoudt; in rust staat
        // hij recht. Zacht, zodat het niet trilt.
        let snelheid = match steen.vorig {
            Some(vorig) if beweegt && dt > 1e-4 => (over - vorig) / dt,
            _ => Vec2::ZERO,
        };
        steen.vorig = Some(over);
        let doel = (snelheid * KANTEL_PER_SNELHEID).clamp_length_max(KANTEL_MAX);
        let kantel = steen.kantel;
        steen.kantel = kantel + (doel - kantel) * (1.0 - (-dt * 12.0).exp());
        if steen.kantel.length() < 1e-4 && doel == Vec2::ZERO {
            steen.kantel = Vec2::ZERO;
        } else {
            bezig = true;
        }
        let schaal = match verschijnt {
            Some((v, k)) if v == vak => 0.75 + 0.25 * k,
            _ => 1.0,
        } * hup_schaal.max(0.001);
        let hoogte = hoogte + hup.map_or(0.0, |p| p.hoogte);
        let voet = Vec3::new(over.x, hoogte - ZAKT, over.y);
        // Een Steen die weghupt staat niet meer in de stand: een vinger kan hem niet pakken.
        if in_stand >= 0 {
            pionnen.push(kies::Pion { vak, speler, voet });
        }
        // Fijn of grof: met een marge, zodat hij niet heen en weer springt.
        if let Some(oog) = oog {
            let afstand = oog.distance(voet);
            let fijn = if steen.fijn {
                afstand < FIJN_TOT + 1.0
            } else {
                afstand < FIJN_TOT
            };
            if fijn != steen.fijn || mesh.0 != bevy.pion[fijn as usize] {
                steen.fijn = fijn;
                mesh.0 = bevy.pion[fijn as usize].clone();
            }
        }
        // Kantelen om de kop: daar houd je hem vast. Het teken op de kop kijkt naar de Speler.
        let kantel = steen.kantel;
        let helling = if kantel.length() > 1e-5 {
            let as_ = Vec3::Y
                .cross(Vec3::new(kantel.x, 0.0, kantel.y))
                .normalize();
            Quat::from_axis_angle(as_, kantel.length())
        } else {
            Quat::IDENTITY
        };
        let kop = Vec3::Y * (pion::HOOGTE * 0.8);
        let nieuw = Transform::from_translation(voet + kop - helling * kop)
            .with_rotation(helling * draai_y)
            .with_scale(Vec3::splat(schaal));
        if *t != nieuw {
            *t = nieuw;
        }
        if gekozen {
            // De ring ligt om het gat van de gekozen steen, ook als hij boven het bord hangt.
            ring_plek = Some(rust);
        }
        if !sleept && hup.is_none() && hoogte > 0.02 && zweeft.is_none_or(|(_, h)| hoogte > h) {
            zweeft = Some((over, hoogte));
        }

        // De contactschaduw: alleen als hij in zijn gat staat.
        if let Some(e) = contact
            && let Ok((mut st, mut sz)) = overig.get_mut(e)
        {
            let staat = !beweegt && hoogte < 0.02 && schaal > 0.9;
            let zicht = if staat {
                Visibility::Inherited
            } else {
                Visibility::Hidden
            };
            if *sz != zicht {
                *sz = zicht;
            }
            if staat {
                let p = rust + van_lamp(Vec2::new(0.09, 0.04));
                let nieuw = Transform::from_xyz(p.x, 0.008, p.y);
                if *st != nieuw {
                    *st = nieuw;
                }
            }
        }
    }

    PIONNEN.set(pionnen);

    // De zachte schaduw onder een opgetilde Steen: groter, zachter en verder van de lamp af naarmate
    // hij hoger hangt (prototype 1b). Tijdens het slepen toont de landingsschaduw waar hij valt.
    if let Ok((mut t, mut z)) = overig.get_mut(bevy.zweef) {
        match zweeft {
            Some((over, h)) => {
                let p = over + van_lamp(Vec2::new(0.5, 0.2) * h);
                *t = Transform::from_xyz(p.x, 0.011, p.y).with_scale(Vec3::splat(0.72 + h * 0.55));
                *z = Visibility::Inherited;
                if let Some(mut m) = standaard.get_mut(&bevy.zweef_materiaal) {
                    m.base_color.set_alpha(0.62 / (1.0 + h * 1.3));
                }
            }
            None => {
                if *z != Visibility::Hidden {
                    *z = Visibility::Hidden;
                }
            }
        }
    }

    // De landingsschaduw: boven het dichtstbijzijnde vak onder de gesleepte steen, welk vak ook (wat
    // mag, telt niet mee). Naast het bord (geen vak binnen bereik) valt hij nergens: geen schaduw.
    if let Ok((mut t, mut z)) = overig.get_mut(bevy.landing) {
        let doel = match spel.hand {
            Hand::Sleept { plek, .. } => landing_vak(&spel.indeling.vakken, plek),
            _ => None,
        };
        match doel {
            Some(p) => {
                let nieuw = Transform::from_xyz(p.x, 0.01, p.y);
                if *t != nieuw {
                    *t = nieuw;
                }
                *z = Visibility::Inherited;
            }
            None => *z = Visibility::Hidden,
        }
    }

    // De ring om het gat van de gekozen Steen (geen hint: alleen de steen zelf).
    if let Ok((mut t, mut z)) = overig.get_mut(bevy.ring) {
        match ring_plek {
            Some(p) => {
                *z = Visibility::Inherited;
                t.translation = Vec3::new(p.x, 0.006, p.y);
            }
            None => *z = Visibility::Hidden,
        }
    }

    // Het doelvakje van een oefening (Speluitleg). Een Potje heeft er geen.
    let doel_plek = spel.doel.and_then(|v| spel.indeling.vakken.get(v).copied());
    if let Ok((mut t, mut z)) = overig.get_mut(bevy.doelring) {
        match doel_plek {
            Some(p) => {
                *z = Visibility::Inherited;
                t.translation = Vec3::new(p.x, 0.005, p.y);
            }
            None => *z = Visibility::Hidden,
        }
    }

    if bezig {
        redraw.write(RequestRedraw);
    }
}

/// Bouw de voorwerpen van een nieuwe lijst en haal de oude weg. Elk voorwerp krijgt een eigen materiaal
/// voor zijn bovenkant (het plaatje komt met `zet_voorwerp_plaat`) en een zachte schaduw op de tafel.
///
/// `zacht`: de tijd nu, voor een overgang (UI-overgangen, `overgang::wissel`): wat in beide lijsten gelijk ligt, blijft liggen
/// (met zijn plaatje, tot het nieuwe komt); de andere oude voorwerpen zakken weg (`Tafel::vertrek`), de nieuwe komen omhoog
/// (`Tafel::komt`). Zonder: de oude zijn meteen weg en de nieuwe liggen er meteen.
#[allow(clippy::too_many_arguments)]
fn bouw_voorwerpen(
    commands: &mut Commands,
    bevy: &Bevy,
    tafel: &mut Tafel,
    voorwerpen: Vec<Option<Voorwerp>>,
    draai: f32,
    meshes: &mut Assets<Mesh>,
    images: &mut Assets<Image>,
    vaste: &mut Assets<VastMateriaal>,
    zacht: Option<f64>,
) {
    let wissel = overgang::wissel(&tafel.voorwerpen, &voorwerpen);
    let mut oude_wortels = std::mem::take(&mut tafel.entiteiten);
    let mut oude_platen = std::mem::take(&mut tafel.platen);
    let oude_druk = std::mem::take(&mut tafel.druk);
    let oude_kralen = std::mem::take(&mut tafel.kralen);
    let oude_komt = std::mem::take(&mut tafel.komt);
    let oude = std::mem::take(&mut tafel.voorwerpen);
    // Wat blijft liggen, gaat mee naar zijn nummer in de nieuwe lijst; de rest gaat weg.
    let blijft: Vec<Option<usize>> = wissel
        .nieuw
        .iter()
        .map(|k| match (zacht, k) {
            (Some(_), Some(Komst::Blijft(j))) => Some(*j),
            _ => None,
        })
        .collect();
    for (j, wortel) in oude_wortels.iter_mut().enumerate() {
        if blijft.contains(&Some(j)) {
            continue;
        }
        let (Some(wortel), plaat) = (wortel.take(), oude_platen.get_mut(j).and_then(Option::take))
        else {
            continue;
        };
        match (zacht, oude.get(j).cloned().flatten()) {
            (Some(nu), Some(voorwerp)) => tafel.vertrek.push(Vertrek {
                wortel,
                plaat,
                voorwerp,
                begin: nu,
            }),
            _ => {
                commands.entity(wortel).despawn();
                if let Some(m) = plaat {
                    vaste.remove(&m);
                }
            }
        }
    }
    let in_de_vaste_laag = |m: StandardMaterial| VastMateriaal {
        base: m,
        extension: Vast::nieuw(Vast::VOOR),
    };
    let n = voorwerpen.len();
    tafel.druk = vec![(0.0, 0.0); n];
    tafel.kralen = vec![[(1.0, true); 2]; n];
    tafel.komt = vec![None; n];
    for (nummer, v) in voorwerpen.iter().enumerate() {
        let Some(v) = v else {
            tafel.entiteiten.push(None);
            tafel.platen.push(None);
            continue;
        };
        if let Some(j) = blijft[nummer] {
            tafel.entiteiten.push(oude_wortels[j]);
            tafel.platen.push(oude_platen[j].take());
            tafel.druk[nummer] = oude_druk[j];
            tafel.kralen[nummer] = oude_kralen[j];
            tafel.komt[nummer] = oude_komt.get(j).copied().flatten();
            continue;
        }
        if let (Some(nu), Some(Komst::Komt { wacht })) = (zacht, wissel.nieuw[nummer]) {
            tafel.komt[nummer] = Some(nu + wacht as f64);
        }
        let plaat = v.soort.heeft_plaat().then(|| {
            vaste.add(in_de_vaste_laag(match v.soort {
                voorwerp::Soort::Porselein => effen(0xefece3, 0.3, 0.0),
                voorwerp::Soort::Rood => effen(0x7f180f, 0.32, 0.0),
                voorwerp::Soort::Messing => effen(0xd2ad5e, 0.32, 1.0),
                _ => effen(0x0b0807, 0.18, 0.0),
            }))
        });
        // Een voorwerp dat nog omhoog moet komen, ligt er al, maar piepklein (`voorwerpen_bijwerken`): zo maakt Bevy alles voor
        // het tekenen klaar in het beeld van de nieuwe lijst, en niet midden in de beweging (dat gaf een hapering van 160 ms).
        let plek = match tafel.komt[nummer] {
            Some(_) => wortel_plek(v, draai).with_scale(Vec3::splat(0.001)),
            None => wortel_plek(v, draai),
        };
        let wortel = commands
            .spawn((VoorwerpWortel, plek, Visibility::Inherited))
            .id();
        for o in voorwerp::onderdelen(v) {
            let materiaal = match o.stof {
                Stof::Plaat => plaat.clone(),
                stof => bevy.stoffen.get(&stof).cloned(),
            };
            let Some(materiaal) = materiaal else { continue };
            // Met de vaste camera getekend: de camera die zoomt mag hem niet wegknippen.
            let mut e = commands.spawn((
                Mesh3d(meshes.add(naar_mesh(o.deel, false))),
                MeshMaterial3d(materiaal),
                Transform::from_translation(o.plek)
                    .with_rotation(o.draai)
                    .with_scale(o.schaal),
                NoFrustumCulling,
            ));
            if !o.werpt {
                e.insert(NotShadowCaster);
            }
            if let Rol::Kraal(deel) = o.rol {
                e.insert(Kraal {
                    wortel,
                    deel,
                    plek: o.plek,
                });
            }
            let id = e.id();
            commands.entity(wortel).add_child(id);
        }
        // De zachte schaduw op de tafel, iets van de lamp af (prototype: `kaderVlek`).
        let rand = 2.0 * voorwerp::ZACHT;
        let schaduw = images.add(afbeelding(
            voorwerp::schaduw(64, v.breedte, v.diepte, v.rond()),
            64,
            TextureFormat::Rgba8UnormSrgb,
            true,
            false,
        ));
        let vlek = commands
            .spawn((
                Mesh3d(
                    meshes.add(
                        Plane3d::default()
                            .mesh()
                            .size(v.breedte + rand, v.diepte + rand)
                            .build(),
                    ),
                ),
                MeshMaterial3d(vaste.add(in_de_vaste_laag(StandardMaterial {
                    base_color: Color::WHITE,
                    base_color_texture: Some(schaduw),
                    unlit: true,
                    alpha_mode: AlphaMode::Blend,
                    ..default()
                }))),
                Transform::from_xyz(0.14, 0.005, 0.07),
                NotShadowCaster,
                NotShadowReceiver,
                NoFrustumCulling,
            ))
            .id();
        commands.entity(wortel).add_child(vlek);
        tafel.entiteiten.push(Some(wortel));
        tafel.platen.push(plaat);
    }
    tafel.voorwerpen = voorwerpen;
    tafel.gemeld.clear();
}

/// De plek van een voorwerp op de tafel, met de tafel gedraaid met `draai` (zie `Voorwerp::omtrek`).
fn wortel_plek(v: &Voorwerp, draai: f32) -> Transform {
    let m = v.wereld_midden(draai);
    Transform::from_xyz(m.x, lak::TAFEL_Y, m.y).with_rotation(Quat::from_rotation_y(draai))
}

/// Indrukken, de kralen van het telraam, voorwerpen die omhoog komen of wegzakken (UI-overgangen), en waar de voorwerpen op het
/// scherm staan (voor de HTML-knoppen).
#[allow(clippy::too_many_arguments, clippy::type_complexity)] // Bevy-systeem.
fn voorwerpen_bijwerken(
    mut commands: Commands,
    mut tafel: ResMut<Tafel>,
    kijk: Res<Kijk>,
    tijd: Res<Time<Real>>,
    klok: Res<Klok>,
    mut wortels: Query<&mut Transform, (With<VoorwerpWortel>, Without<Kraal>)>,
    mut kralen: Query<(&Kraal, &mut Transform), Without<VoorwerpWortel>>,
    mut vaste: ResMut<Assets<VastMateriaal>>,
    mut redraw: MessageWriter<RequestRedraw>,
) {
    let tafel = &mut *tafel;
    let dt = tijd.delta_secs().min(0.05);
    let nu = klok.0;
    let mut bezig = false;
    // Ingezoomd zakken de voorwerpen weg, zodat ze niet over het bord liggen (taak 235); uitzoomen brengt ze terug.
    let weg = overgang::zak_stap(tafel.weg, kijk.gemeld_overzicht == Some(false), dt);
    if weg != tafel.weg {
        tafel.weg = weg;
        bezig = true;
    }
    let zakt = overgang::zakt(weg);
    let blad = tafel
        .voorwerpen
        .iter()
        .flatten()
        .find(|v| v.soort == voorwerp::Soort::Blad)
        .cloned();
    for nummer in 0..tafel.entiteiten.len() {
        let (Some(e), Some(Some(v))) = (tafel.entiteiten[nummer], tafel.voorwerpen.get(nummer))
        else {
            continue;
        };
        let Ok(mut t) = wortels.get_mut(e) else {
            continue;
        };
        let Some(d) = tafel.druk.get_mut(nummer) else {
            continue;
        };
        let (druk, beweegt) = voorwerp::druk_stap(d.0, d.1, dt);
        let was = d.0;
        d.0 = druk;
        bezig |= beweegt;
        // Het plaatje wordt donkerder terwijl het voorwerp zakt (taak 206). Alleen als de druk verandert,
        // anders telt Bevy het materiaal elk beeld als gewijzigd.
        if druk != was
            && let Some(Some(h)) = tafel.platen.get(nummer)
            && let Some(mut m) = vaste.get_mut(h)
            && m.base.base_color_texture.is_some()
        {
            let f = voorwerp::helderheid(druk);
            m.base.base_color = Color::srgb(f, f, f);
        }
        // Omhoog komen (UI-overgangen): tot het begint is het piepklein.
        let komt = tafel.komt[nummer].and_then(|begin| overgang::komt((nu - begin) as f32));
        if komt.is_some() {
            bezig = true;
        } else {
            tafel.komt[nummer] = None;
        }
        let houding = komt.unwrap_or(overgang::Houding {
            omlaag: 0.0,
            schaal: 1.0,
        });
        // Een andere plek (de jade aanwijzer), een andere draai van de tafel, of onderweg omhoog.
        // Ingezoomd (taak 235): naamplaten, kom en zegel zakken weg; de jade aanwijzer schuift onder het blad; de rest blijft.
        let zak = if overgang::zakt_weg(v.soort) {
            zakt
        } else {
            overgang::Houding { omlaag: 0.0, schaal: 1.0 }
        };
        let mut plek = if v.soort == voorwerp::Soort::Jade && weg > 0.0 {
            let mut op_zijn_plek = v.clone();
            op_zijn_plek.midden = overgang::jade_plek(v, blad.as_ref(), weg);
            wortel_plek(&op_zijn_plek, kijk.toon_draai)
        } else {
            wortel_plek(v, kijk.toon_draai)
        };
        plek.translation.y -= houding.omlaag + zak.omlaag;
        let schaal = Vec3::new(1.0, 1.0 - voorwerp::INDRUK * druk, 1.0)
            * (houding.schaal * zak.schaal).max(0.001);
        if t.translation != plek.translation || t.rotation != plek.rotation {
            t.translation = plek.translation;
            t.rotation = plek.rotation;
            bezig = true;
        }
        if t.scale != schaal {
            t.scale = schaal;
        }
    }
    // Voorwerpen van de vorige lijst zakken weg; daarna zijn ze echt weg.
    tafel
        .vertrek
        .retain_mut(|w| match overgang::gaat((nu - w.begin) as f32) {
            Some(h) => {
                if let Ok(mut t) = wortels.get_mut(w.wortel) {
                    let mut plek = wortel_plek(&w.voorwerp, kijk.toon_draai);
                    let zak = if overgang::zakt_weg(w.voorwerp.soort) {
                        zakt
                    } else {
                        overgang::Houding { omlaag: 0.0, schaal: 1.0 }
                    };
                    plek.translation.y -= h.omlaag + zak.omlaag;
                    *t = plek.with_scale(Vec3::splat((h.schaal * zak.schaal).max(0.001)));
                }
                bezig = true;
                true
            }
            None => {
                commands.entity(w.wortel).despawn();
                if let Some(m) = &w.plaat {
                    vaste.remove(m);
                }
                false
            }
        });
    for k in tafel.kralen.iter_mut().flatten() {
        let (t, beweegt) = voorwerp::kraal_stap(k.0, k.1, dt);
        k.0 = t;
        bezig |= beweegt;
    }
    for (kraal, mut t) in &mut kralen {
        let Some(nummer) = tafel
            .entiteiten
            .iter()
            .position(|e| *e == Some(kraal.wortel))
        else {
            continue;
        };
        let (Some(Some(v)), Some(k)) = (tafel.voorwerpen.get(nummer), tafel.kralen.get(nummer))
        else {
            continue;
        };
        let voortgang = k[kraal.deel].0;
        let (uit, aan) = (v.kraal_x(kraal.deel, false), v.kraal_x(kraal.deel, true));
        let zacht = voorwerp::kraal_draai(voortgang) / std::f32::consts::PI;
        let plek = Vec3::new(uit + (aan - uit) * zacht, kraal.plek.y, kraal.plek.z);
        if t.translation != plek {
            t.translation = plek;
        }
    }

    // Waar de voorwerpen op het scherm staan. Anders dan wat de web-app weet: zeg het.
    // Met de vaste camera: de voorwerpen zoomen niet mee (taak 190), dus de knoppen blijven op hun plek.
    let vakken: Vec<f32> = match &kijk.vast {
        Some(cam) if !tafel.voorwerpen.is_empty() => tafel
            .voorwerpen
            .iter()
            .flat_map(|v| {
                v.as_ref()
                    .and_then(|v| v.scherm_vak(cam))
                    .unwrap_or([f32::NAN; 4])
            })
            .collect(),
        _ => Vec::new(),
    };
    let anders = vakken.len() != tafel.gemeld.len()
        || vakken
            .iter()
            .zip(&tafel.gemeld)
            .any(|(a, b)| !(a.is_nan() && b.is_nan()) && (a - b).abs() > 0.25);
    if anders {
        tafel.gemeld = vakken.clone();
        VAKKEN.set(vakken);
        let f = BIJ_VOORWERPEN.with_borrow(|f| f.clone());
        if let Some(f) = f {
            let _ = f.call0(&JsValue::NULL);
        }
    }
    if bezig {
        redraw.write(RequestRedraw);
    }
}
