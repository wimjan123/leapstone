//! De camera boven het bord, en het omrekenen van een plek op het scherm naar het bord.
//!
//! Alles hier is gewoon rekenwerk zonder Bevy, zodat de tests snel draaien.
//! Schermplekken zijn in CSS-pixels, met (0, 0) linksboven, zoals in de browser.
//!
//! Het canvas vult het hele scherm (de houten tafel loopt door onder de knoppen), maar het
//! bord hoort in het `vlak` tussen de knoppen. De camera schuift daarom opzij: het punt
//! waar hij naar kijkt, staat in het midden van dat vlak in plaats van in het midden van het scherm.

use glam::{Vec2, Vec3};
use std::f32::consts::{PI, TAU};

/// Kijkhoek van de camera van boven naar beneden, in radialen: 30 graden, zoals prototype 1b (taak 177).
pub const BEELDHOEK: f32 = std::f32::consts::FRAC_PI_6;

/// Dichtste afstand van de camera tot het bord: dan zie je een paar vakken groot.
pub const AFSTAND_MIN: f32 = 5.0;

/// Kanteling (hoek boven het bord) bij overzicht en bij helemaal ingezoomd. Het bord staat stil in
/// het overzicht (taak 177): 55 graden, iets schuiner dan het prototype (60), zodat gaten, rand en
/// Stenen diepte tonen.
const KANTELING_VER: f32 = 0.96;
const KANTELING_DICHT: f32 = 0.74;

/// Zoveel ruimte blijft er bij overzicht tussen de plank en de rand van het vlak.
const MARGE: f32 = 0.012;

/// Voorbij een grens rekt de camera een stukje mee, steeds stroever (zoals een elastiek),
/// en veert na het loslaten terug. Hoe ver hij hoogstens rekt: zoom (deel van de grootste
/// afstand) en schuiven (in vakken).
const REK_ZOOM: f32 = 0.22;
const REK_SCHUIF: f32 = 1.6;
/// Hoe snel hij terugveert, per seconde (na 0,2 s is 94 procent terug).
const VEER: f32 = 14.0;

/// Het scherm en het deel ervan waar het bord in moet passen, in CSS-pixels.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Venster {
    pub scherm: Vec2,
    pub vlak_min: Vec2,
    pub vlak_max: Vec2,
}

impl Venster {
    /// Het bord mag het hele scherm gebruiken.
    pub fn heel(scherm: Vec2) -> Venster {
        Venster {
            scherm,
            vlak_min: Vec2::ZERO,
            vlak_max: scherm,
        }
    }

    /// Een vlak binnen het scherm; valt het er (deels) buiten, dan het stuk dat erin valt.
    pub fn met_vlak(scherm: Vec2, links_boven: Vec2, maat: Vec2) -> Venster {
        let min = links_boven.clamp(Vec2::ZERO, scherm);
        let max = (links_boven + maat).clamp(Vec2::ZERO, scherm);
        if max.x - min.x < 20.0 || max.y - min.y < 20.0 {
            return Venster::heel(scherm);
        }
        Venster {
            scherm,
            vlak_min: min,
            vlak_max: max,
        }
    }

    fn verhouding(&self) -> f32 {
        self.scherm.x / self.scherm.y.max(1.0)
    }

    /// Het midden van het vlak, van -1 tot 1 zoals in de grafische kaart (y omhoog).
    fn midden_ndc(&self) -> Vec2 {
        let m = (self.vlak_min + self.vlak_max) / 2.0;
        Vec2::new(
            2.0 * m.x / self.scherm.x - 1.0,
            1.0 - 2.0 * m.y / self.scherm.y,
        )
    }
}

/// De camera: hij kijkt naar `doel` op het bord, vanaf `afstand`, gedraaid met `draai`.
#[derive(Debug, Clone, PartialEq)]
pub struct Camera {
    /// Het punt op het bord (x, z) dat in het midden van het vlak staat.
    pub doel: Vec2,
    pub afstand: f32,
    /// Draaiing om de y-as, in radialen. Bij 0 staat de camera aan de kant van +z.
    pub draai: f32,
    /// De draaiing bij terugzetten.
    pub start_draai: f32,
    pub afstand_max: f32,
    pub venster: Venster,
    /// De buitenrand van de plank: die past bij overzicht precies in het vlak.
    rand: Vec<Vec2>,
    /// Hoe ver het doel ingezoomd van het midden mag.
    bereik: f32,
    vierkant: bool,
    /// Het punt (x, z) waar de camera bij overzicht naar kijkt: het midden van het bord, of bij de
    /// tafel met voorwerpen (taak 178) het midden van alles wat in beeld moet.
    midden: Vec2,
    /// Een tafel met voorwerpen (`Camera::tafel`): bij een ander venster opnieuw passen.
    tafel: bool,
}

/// Een punt (x, z) om de y-as gedraaid met `hoek`, zoals `Quat::from_rotation_y(hoek)` het draait.
pub fn draai_xz(p: Vec2, hoek: f32) -> Vec2 {
    let (s, c) = hoek.sin_cos();
    Vec2::new(p.x * c + p.y * s, -p.x * s + p.y * c)
}

/// Een straal vanuit de camera: begin en richting (lengte 1).
#[derive(Debug, Clone, Copy)]
pub struct Straal {
    pub begin: Vec3,
    pub richting: Vec3,
}

impl Camera {
    /// Een camera met overzicht over het hele bord. `rand` is de buitenrand van de plank.
    pub fn overzicht(venster: Venster, draai: f32, rand: &[Vec2], vierkant: bool) -> Camera {
        let bereik = rand.iter().map(|p| p.length()).fold(0.0, f32::max) - 1.2;
        let mut cam = Camera {
            doel: Vec2::ZERO,
            afstand: AFSTAND_MIN + 1.0,
            draai,
            start_draai: draai,
            afstand_max: AFSTAND_MIN + 1.0,
            venster,
            rand: rand.to_vec(),
            bereik,
            vierkant,
            midden: Vec2::ZERO,
            tafel: false,
        };
        cam.afstand_max = cam.passende_afstand();
        cam.afstand = cam.afstand_max;
        cam
    }

    /// Een vaste camera over een tafel met voorwerpen (taak 178): alle `punten` (x, z, op het bord
    /// tot 0,6 hoog) passen in het vlak, zo groot als kan, met boven en onder evenveel ruimte. Zo
    /// staan het bord en de voorwerpen van een scherm samen in beeld. `punten` staan zoals de Speler ze
    /// ziet (het bord al gedraaid); de camera zelf kijkt met `draai` (taak 179: de wereld is dan met
    /// dezelfde hoek gedraaid, dus op het scherm is het beeld hetzelfde als bij draai 0).
    pub fn tafel(venster: Venster, punten: &[Vec2], draai: f32) -> Camera {
        let mut cam = Camera::overzicht(venster, 0.0, punten, false);
        cam.tafel = true;
        // Het midden in z schuiven tot de ruimte boven en onder gelijk is (de camera kijkt schuin, dus
        // dat is niet het midden van de punten); daarna opnieuw passen.
        let (zmin, zmax) = punten
            .iter()
            .fold((f32::MAX, f32::MIN), |(a, b), p| (a.min(p.y), b.max(p.y)));
        if zmin > zmax {
            return cam.gedraaid(draai);
        }
        // In x het midden van de punten (taak 206): liggen de voorwerpen aan één kant van het bord (het
        // Startmenu op een breed scherm), dan staat het geheel in het midden en niet het bord.
        let (xmin, xmax) = punten
            .iter()
            .fold((f32::MAX, f32::MIN), |(a, b), p| (a.min(p.x), b.max(p.x)));
        cam.midden = Vec2::new((xmin + xmax) / 2.0, (zmin + zmax) / 2.0);
        for _ in 0..16 {
            cam.doel = cam.midden;
            cam.afstand_max = cam.passende_afstand();
            cam.afstand = cam.afstand_max;
            let ys = punten.iter().flat_map(|p| {
                [0.0, 0.6].map(|y| cam.naar_scherm(Vec3::new(p.x, y, p.y)).map(|s| s.y))
            });
            let (boven, onder) = ys
                .flatten()
                .fold((f32::MAX, f32::MIN), |(a, b), y| (a.min(y), b.max(y)));
            let ruimte_boven = boven - cam.venster.vlak_min.y;
            let ruimte_onder = cam.venster.vlak_max.y - onder;
            let verschil = (ruimte_onder - ruimte_boven) / 2.0;
            if verschil.abs() < 0.25 {
                break;
            }
            // Pixels per eenheid in z, ongeveer, bij het midden.
            let Some((_, maat)) = cam.naar_scherm_maat(cam.doel3()) else {
                break;
            };
            let per_z = maat * cam.kanteling().sin();
            // Meer ruimte onder: alles moet omlaag op het scherm, dus de camera kijkt verder naar achteren.
            cam.midden.y -= verschil / per_z.max(1e-3);
        }
        cam.doel = cam.midden;
        cam.gedraaid(draai)
    }

    /// Dezelfde camera, met de hele wereld om de y-as gedraaid met `draai`: hij kijkt vanaf een andere kant
    /// (zoals `kijk_draai` bij het overzicht), naar het meegedraaide doel.
    fn gedraaid(mut self, draai: f32) -> Camera {
        self.doel = draai_xz(self.doel, draai);
        self.midden = draai_xz(self.midden, draai);
        self.draai = draai;
        self.start_draai = draai;
        self
    }

    /// Het punt (x, z) waar de camera bij overzicht naar kijkt.
    pub fn midden(&self) -> Vec2 {
        self.midden
    }

    /// Een camera over een tafel met voorwerpen (`Camera::tafel`)?
    pub fn is_tafel(&self) -> bool {
        self.tafel
    }

    /// De overzichtscamera die hoort bij deze camera.
    pub fn terug_doel(&self) -> Camera {
        if self.tafel {
            return Camera::tafel(self.venster, &self.rand, self.start_draai);
        }
        Camera::overzicht(self.venster, self.start_draai, &self.rand, self.vierkant)
    }

    /// Het venster veranderde: houd het overzicht passend.
    pub fn nieuw_venster(&mut self, venster: Venster) {
        if self.tafel {
            *self = Camera::tafel(venster, &self.rand, self.start_draai);
            return;
        }
        let was_overzicht = self.afstand >= self.afstand_max - 1e-3;
        self.venster = venster;
        self.afstand_max = self.passende_afstand();
        if was_overzicht {
            self.afstand = self.afstand_max;
        }
        self.begrens();
    }

    /// De kleinste afstand waarop de hele plank (en een steen erop) in het vlak past.
    fn passende_afstand(&self) -> f32 {
        let past = |afstand: f32| {
            let mut c = self.clone();
            c.afstand = afstand;
            c.doel = self.midden;
            let marge = (self.venster.vlak_max - self.venster.vlak_min) * MARGE;
            let (min, max) = (self.venster.vlak_min + marge, self.venster.vlak_max - marge);
            self.rand.iter().all(|p| {
                [0.0, 0.6].iter().all(|&y| {
                    c.naar_scherm(Vec3::new(p.x, y, p.y))
                        .is_some_and(|s| s.cmpge(min).all() && s.cmple(max).all())
                })
            })
        };
        let (mut laag, mut hoog) = (AFSTAND_MIN + 1.0, 400.0);
        if past(laag) {
            return laag;
        }
        for _ in 0..40 {
            let m = (laag + hoog) / 2.0;
            if past(m) {
                hoog = m;
            } else {
                laag = m;
            }
        }
        hoog
    }

    /// Hoe ver er is ingezoomd: 0 bij overzicht, 1 bij helemaal dichtbij.
    pub fn zoom(&self) -> f32 {
        let bereik = (self.afstand_max - AFSTAND_MIN).max(1e-3);
        ((self.afstand_max - self.afstand) / bereik).clamp(0.0, 1.0)
    }

    /// Hoek boven het bord: van bijna recht boven (overzicht) naar schuiner (dichtbij).
    pub fn kanteling(&self) -> f32 {
        KANTELING_VER + (KANTELING_DICHT - KANTELING_VER) * self.zoom()
    }

    pub fn doel3(&self) -> Vec3 {
        Vec3::new(self.doel.x, 0.0, self.doel.y)
    }

    /// Van het doel naar de camera (lengte 1).
    fn terugrichting(&self) -> Vec3 {
        let k = self.kanteling();
        Vec3::new(
            k.cos() * self.draai.sin(),
            k.sin(),
            k.cos() * self.draai.cos(),
        )
    }

    /// Vooruit, rechts en omhoog van de camera, zoals `Transform::looking_at` met y omhoog.
    fn assen(&self) -> (Vec3, Vec3, Vec3) {
        let vooruit = -self.terugrichting();
        let rechts = vooruit.cross(Vec3::Y).normalize();
        let omhoog = rechts.cross(vooruit);
        (vooruit, rechts, omhoog)
    }

    /// De zijwaartse verschuiving waardoor het doel in het midden van het vlak staat.
    fn verschuiving(&self) -> Vec3 {
        let (_, rechts, omhoog) = self.assen();
        let o = self.venster.midden_ndc();
        let t = (BEELDHOEK / 2.0).tan();
        -(rechts * o.x * t * self.venster.verhouding() + omhoog * o.y * t) * self.afstand
    }

    /// Waar de camera staat.
    pub fn oog(&self) -> Vec3 {
        self.doel3() + self.terugrichting() * self.afstand + self.verschuiving()
    }

    /// Het punt waar de camera recht naar kijkt (voor `Transform::looking_at`).
    pub fn kijkpunt(&self) -> Vec3 {
        self.doel3() + self.verschuiving()
    }

    /// De straal door een plek op het scherm.
    pub fn straal(&self, punt: Vec2) -> Straal {
        let (vooruit, rechts, omhoog) = self.assen();
        let s = self.venster.scherm;
        let t = (BEELDHOEK / 2.0).tan();
        let x = (2.0 * punt.x / s.x - 1.0) * t * self.venster.verhouding();
        let y = (1.0 - 2.0 * punt.y / s.y) * t;
        Straal {
            begin: self.oog(),
            richting: (vooruit + rechts * x + omhoog * y).normalize(),
        }
    }

    /// Een plek in de wereld naar het scherm, of `None` als hij achter de camera ligt.
    pub fn naar_scherm(&self, p: Vec3) -> Option<Vec2> {
        let (vooruit, rechts, omhoog) = self.assen();
        let d = p - self.oog();
        let diepte = d.dot(vooruit);
        if diepte <= 1e-3 {
            return None;
        }
        let t = (BEELDHOEK / 2.0).tan();
        let x = d.dot(rechts) / (diepte * t * self.venster.verhouding());
        let y = d.dot(omhoog) / (diepte * t);
        let s = self.venster.scherm;
        Some(Vec2::new((x + 1.0) / 2.0 * s.x, (1.0 - y) / 2.0 * s.y))
    }

    /// Als `naar_scherm`, plus hoeveel pixels één eenheid daar is (dwars op de kijkrichting).
    pub fn naar_scherm_maat(&self, p: Vec3) -> Option<(Vec2, f32)> {
        let diepte = (p - self.oog()).dot(self.assen().0);
        let s = self.naar_scherm(p)?;
        Some((
            s,
            self.venster.scherm.y / (2.0 * diepte * (BEELDHOEK / 2.0).tan()),
        ))
    }

    /// Waar de straal door `punt` het vlak op `hoogte` raakt, als (x, z).
    pub fn grondpunt(&self, punt: Vec2, hoogte: f32) -> Option<Vec2> {
        let s = self.straal(punt);
        if s.richting.y >= -1e-4 {
            return None;
        }
        let t = (hoogte - s.begin.y) / s.richting.y;
        let raak = s.begin + s.richting * t;
        Some(Vec2::new(raak.x, raak.z))
    }

    /// De plek op het bord (x, z) die op het scherm `vakken` vakken recht boven de vinger ligt, gemeten
    /// zoals een vak daar op het scherm groot is (dwars op de kijkrichting). Een gesleepte steen valt
    /// daar: net buiten de vingertop, bij elke zoom even ver.
    pub fn boven_vinger(&self, vinger: Vec2, vakken: f32) -> Option<Vec2> {
        let onder = self.grondpunt(vinger, 0.0)?;
        let (_, maat) = self.naar_scherm_maat(Vec3::new(onder.x, 0.0, onder.y))?;
        self.grondpunt(Vec2::new(vinger.x, vinger.y - vakken * maat), 0.0)
    }

    /// Schuif het bord mee met een vinger: wat onder `van` lag, ligt daarna onder `naar`.
    /// Voorbij de rand rekt het mee; `veer` zet het daarna terug.
    pub fn schuif(&mut self, van: Vec2, naar: Vec2) {
        if let (Some(a), Some(b)) = (self.grondpunt(van, 0.0), self.grondpunt(naar, 0.0)) {
            self.verschuif(a - b);
        }
    }

    /// Als `schuif`, maar strak (taak 186): voorbij de rand gaat het bord niet verder, zonder rek en
    /// zonder terugveren. Zo staat het bord stil zodra de vingers stilstaan.
    pub fn schuif_strak(&mut self, van: Vec2, naar: Vec2) {
        if let (Some(a), Some(b)) = (self.grondpunt(van, 0.0), self.grondpunt(naar, 0.0)) {
            self.doel += a - b;
            self.begrens();
        }
    }

    /// Als `knijp` zonder draaien, en strak (taak 186): niet verder uit dan het overzicht, niet verder
    /// in dan `AFSTAND_MIN`, en het bord onder `midden` blijft daar liggen (voor zover het bord dat toelaat).
    pub fn knijp_strak(&mut self, midden: Vec2, schaal: f32) {
        let voor = self.grondpunt(midden, 0.0);
        self.afstand = (self.afstand / schaal.max(1e-3)).clamp(AFSTAND_MIN, self.afstand_max);
        if let (Some(a), Some(b)) = (voor, self.grondpunt(midden, 0.0)) {
            self.doel += a - b;
        }
        self.begrens();
    }

    /// Pak het bord onder `midden` (taak 190): het begin van schuiven of knijpen, of een vinger erbij of eraf. Daarna houdt
    /// `volg` die plek onder de vingers. `None` als `midden` niet op het vlak van het bord valt.
    pub fn pak(&self, midden: Vec2) -> Option<Greep> {
        let onder = self.grondpunt(midden, 0.0)?;
        let doel = self.doel_ruw(self.doel);
        let (min, max) = self.lengtes();
        Some(Greep {
            punt: doel + (onder - self.doel),
            lengte: zacht_grens_terug(self.afstand.ln(), min, max, ZACHT_ZOOM),
        })
    }

    /// De vingers bewogen (taak 190): wat bij `pak` onder het midden lag, ligt nu onder `midden`, en het bord is `zoom` keer
    /// zo groot (ln van de schaal sinds `pak`; groter dan 0 is inzoomen). Tegen een grens remt het zacht af en komt het precies
    /// op de grens (zie `zacht_grens`); voorbij de grens gaat het niet. Het rekent vanaf de greep, niet stap voor stap: wat de
    /// vingers ook deden, terug op dezelfde plek is het bord weer hetzelfde (zolang er geen grens tussen zat).
    pub fn volg(&mut self, greep: &mut Greep, midden: Vec2, zoom: f32) {
        let (min, max) = self.lengtes();
        // Voorbij de zachte zone telt de vinger niet meer: de greep schuift mee, zodat terug meteen weer werkt.
        let ruw = greep.lengte - zoom;
        let binnen = ruw.clamp(min - ZACHT_ZOOM, max + ZACHT_ZOOM);
        greep.lengte += binnen - ruw;
        let l = zacht_grens(binnen, min, max, ZACHT_ZOOM);
        // Op een grens precies de grens (ln en exp terug zijn niet exact): het overzicht is dan echt het overzicht.
        self.afstand = if l >= max {
            self.afstand_max
        } else if l <= min {
            AFSTAND_MIN
        } else {
            l.exp().clamp(AFSTAND_MIN, self.afstand_max)
        };
        let voor = self.doel;
        let Some(onder) = self.grondpunt(midden, 0.0) else {
            return;
        };
        // Het doel waarbij `greep.punt` onder `midden` ligt (het bord schuift gewoon mee met het doel).
        let ruw = greep.punt - (onder - voor);
        let binnen = self.doel_binnen(ruw);
        greep.punt += binnen - ruw;
        self.doel = self.doel_zacht(binnen);
    }

    /// ln van de kleinste en de grootste afstand.
    fn lengtes(&self) -> (f32, f32) {
        (AFSTAND_MIN.ln(), self.afstand_max.max(AFSTAND_MIN).ln())
    }

    /// Hoe ver het doel zacht afremt voor het de rand bereikt, in vakken (bij weinig ruimte minder).
    fn zacht_doel_zone(&self) -> f32 {
        (self.doel_max() * 0.5).min(ZACHT_SCHUIF)
    }

    /// Het doel met de zachte rand (`ruw` in vakken voorbij `midden`; het Vierkant bord per as, het Sterbord als afstand).
    fn doel_zacht(&self, ruw: Vec2) -> Vec2 {
        self.doel_per_maat(ruw, |x, max, zone| zacht_grens(x, -max, max, zone))
    }

    /// Terug van een doel naar het ruwe doel (het omgekeerde van `doel_zacht`).
    fn doel_ruw(&self, doel: Vec2) -> Vec2 {
        self.doel_per_maat(doel, |x, max, zone| zacht_grens_terug(x, -max, max, zone))
    }

    /// Een ruw doel tot waar de zachte zone ophoudt (verder telt niet).
    fn doel_binnen(&self, ruw: Vec2) -> Vec2 {
        self.doel_per_maat(ruw, |x, max, zone| x.clamp(-max - zone, max + zone))
    }

    fn doel_per_maat(&self, doel: Vec2, f: impl Fn(f32, f32, f32) -> f32) -> Vec2 {
        let max = self.doel_max();
        let zone = self.zacht_doel_zone();
        let d = doel - self.midden;
        if max <= 1e-4 {
            return self.midden;
        }
        let d = if self.vierkant {
            Vec2::new(f(d.x, max, zone), f(d.y, max, zone))
        } else {
            let l = d.length();
            if l < 1e-6 {
                d
            } else {
                d / l * f(l, max, zone).max(0.0)
            }
        };
        self.midden + d
    }

    /// Schuif het doel `d` op, met rek voorbij de rand.
    pub fn verschuif(&mut self, d: Vec2) {
        let oud = self.doel;
        let nieuw = oud + d;
        let max = self.doel_max();
        if self.vierkant {
            self.doel = Vec2::new(
                rek(oud.x, nieuw.x, -max, max, REK_SCHUIF),
                rek(oud.y, nieuw.y, -max, max, REK_SCHUIF),
            );
        } else {
            let r = rek(oud.length(), nieuw.length(), -1.0, max, REK_SCHUIF);
            self.doel = nieuw.normalize_or_zero() * r;
        }
    }

    /// Twee vingers: zoom met `schaal` (groter dan 1 is inzoomen) en draai met `hoek`,
    /// om het punt `midden` op het scherm. Het bord onder `midden` blijft daar liggen.
    /// Voorbij de grootste of kleinste afstand rekt het mee; `veer` zet het daarna terug.
    pub fn knijp(&mut self, midden: Vec2, schaal: f32, hoek: f32) {
        let voor = self.grondpunt(midden, 0.0);
        self.zoom_draai(schaal, hoek);
        if let (Some(a), Some(b)) = (voor, self.grondpunt(midden, 0.0)) {
            self.verschuif(a - b);
        }
    }

    /// Zoom en draai om het doel zelf.
    pub fn zoom_draai(&mut self, schaal: f32, hoek: f32) {
        let nieuw = self.afstand / schaal.max(1e-3);
        let ruimte = REK_ZOOM * self.afstand_max;
        self.afstand = rek(self.afstand, nieuw, AFSTAND_MIN, self.afstand_max, ruimte);
        self.draai += hoek;
    }

    /// Hoe ver het doel van het midden mag (bij het Vierkant bord: per as).
    fn doel_max(&self) -> f32 {
        let max = self.bereik * self.zoom();
        if self.vierkant {
            max / std::f32::consts::SQRT_2
        } else {
            max
        }
    }

    /// Een camera binnen de grenzen: zoom tussen de kleinste en grootste afstand, het doel op het bord.
    fn begrensd(&self) -> (f32, Vec2) {
        let afstand = self.afstand.clamp(AFSTAND_MIN, self.afstand_max);
        let mut c = self.clone();
        c.afstand = afstand;
        let max = c.doel_max();
        let d = self.doel - self.midden;
        let d = if self.vierkant {
            d.clamp(Vec2::splat(-max), Vec2::splat(max))
        } else if d.length() > max {
            d.normalize_or_zero() * max
        } else {
            d
        };
        (afstand, self.midden + d)
    }

    /// Ligt de camera voorbij een grens (na rekken)?
    pub fn gerekt(&self) -> bool {
        let (afstand, doel) = self.begrensd();
        (afstand - self.afstand).abs() > 1e-4 || doel.distance(self.doel) > 1e-4
    }

    /// Veer `dt` seconden terug binnen de grenzen. Geeft `true` zolang hij nog terugveert.
    pub fn veer(&mut self, dt: f32) -> bool {
        if !self.gerekt() {
            return false;
        }
        let (afstand, doel) = self.begrensd();
        let k = (-VEER * dt).exp();
        self.afstand = afstand + (self.afstand - afstand) * k;
        self.doel = doel + (self.doel - doel) * k;
        if (self.afstand - afstand).abs() < 1e-3 && self.doel.distance(doel) < 1e-3 {
            self.begrens();
            return false;
        }
        true
    }

    /// Houd het doel op het bord: bij overzicht in het midden, ingezoomd tot de rand.
    fn begrens(&mut self) {
        (self.afstand, self.doel) = self.begrensd();
    }

    /// Een camera tussen `van` en `naar`, bij voortgang `k` (0 tot 1).
    /// De draaiing gaat de kortste kant op. Doel en midden gaan mee zoals de camera ze ziet (zonder zijn draai), en draaien dan
    /// mee: zo blijft wat met de camera meedraait (de voorwerpen van een tafel) op het scherm staan terwijl het bord eronder
    /// draait. Ook de grootste afstand gaat mee, zodat de kanteling (die hoort bij de zoom) tussen twee overzichten niet knikt:
    /// een camera tussen twee tafels staat ook in het overzicht.
    pub fn tussen(van: &Camera, naar: &Camera, k: f32) -> Camera {
        let mut c = naar.clone();
        if k >= 1.0 {
            return c;
        }
        let draai_van = naar.draai + (van.draai - naar.draai + PI).rem_euclid(TAU) - PI;
        c.draai = draai_van + (naar.draai - draai_van) * k;
        let zelf = |p: Vec2, cam: &Camera| draai_xz(p, -cam.draai);
        c.doel = draai_xz(zelf(van.doel, van).lerp(zelf(naar.doel, naar), k), c.draai);
        c.midden = draai_xz(
            zelf(van.midden, van).lerp(zelf(naar.midden, naar), k),
            c.draai,
        );
        c.afstand = van.afstand + (naar.afstand - van.afstand) * k;
        c.afstand_max = van.afstand_max + (naar.afstand_max - van.afstand_max) * k;
        c
    }

    /// Waar de rustige camerabeweging aan het begin van een Potje begint:
    /// verder weg en een stukje gedraaid.
    pub fn intro_begin(&self) -> Camera {
        let mut c = self.clone();
        c.afstand = self.afstand * 1.45;
        c.draai = self.draai - 0.55;
        c
    }
}

/// Waar de vingers het bord vastpakten (taak 190, `Camera::pak` en `Camera::volg`): de plek op het bord (x, z) en ln van de
/// afstand, allebei zonder de zachte grens. Zo blijft wat onder de vingers lag eronder liggen, ook na een grens.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Greep {
    punt: Vec2,
    lengte: f32,
}

/// Zacht afremmen tegen de grenzen (taak 190): zo ver voor de grens (ln van de afstand: 18 procent) begint het bord
/// langzamer te gaan dan de vingers, en het komt precies op de grens als de vingers twee keer zo ver gaan.
const ZACHT_ZOOM: f32 = 0.18;
/// Hetzelfde voor schuiven, in vakken (hoogstens de helft van wat er te schuiven valt).
const ZACHT_SCHUIF: f32 = 1.2;

/// `x` tussen `min` en `max`, met een zachte rand van `zone` aan beide kanten: midden in gaat het gelijk op, in de laatste
/// `zone` voor een grens steeds trager (zonder knik), en `zone` voorbij de grens staat het precies op de grens.
/// `zacht_grens_terug` is het omgekeerde.
pub fn zacht_grens(x: f32, min: f32, max: f32, zone: f32) -> f32 {
    let zone = zone.min((max - min) / 2.0).max(0.0);
    if zone <= 1e-6 {
        return x.clamp(min, max);
    }
    let rand = |u: f32| {
        let u = u.clamp(0.0, 2.0);
        u - u * u / 4.0
    };
    let y = if x > max - zone {
        max - zone + zone * rand((x - (max - zone)) / zone)
    } else if x < min + zone {
        min + zone - zone * rand((min + zone - x) / zone)
    } else {
        x
    };
    y.clamp(min, max)
}

/// Het omgekeerde van `zacht_grens`: welke `x` geeft `y`? Op de grens zelf: de rand van de zachte zone.
pub fn zacht_grens_terug(y: f32, min: f32, max: f32, zone: f32) -> f32 {
    let zone = zone.min((max - min) / 2.0).max(0.0);
    if zone <= 1e-6 {
        return y.clamp(min, max);
    }
    let terug = |g: f32| 2.0 - 2.0 * (1.0 - g.clamp(0.0, 1.0)).sqrt();
    if y > max - zone {
        max - zone + zone * terug((y - (max - zone)) / zone)
    } else if y < min + zone {
        min + zone - zone * terug((min + zone - y) / zone)
    } else {
        y
    }
}

/// Hoe de camerabeweging versnelt en afremt: rustig op gang, rustig tot stilstand.
pub fn zacht(t: f32) -> f32 {
    let t = t.clamp(0.0, 1.0);
    t * t * t * (t * (6.0 * t - 15.0) + 10.0)
}

/// Snel weg en lang uitlopen, zoals iets dat je een zetje geeft: voor het begin van een Potje
/// en het terugzetten van de camera.
pub fn uitlopend(t: f32) -> f32 {
    1.0 - (1.0 - t.clamp(0.0, 1.0)).powi(4)
}

/// Rekken voorbij een grens: wat binnen `min` en `max` blijft, gaat gewoon mee; voorbij een grens
/// gaat elke stap minder ver, en nooit verder dan `ruimte` voorbij die grens.
/// `oud` mag al voorbij de grens liggen (een vorige stap rekte al).
pub fn rek(oud: f32, nieuw: f32, min: f32, max: f32, ruimte: f32) -> f32 {
    // Van "hoe ver de vinger trok" naar "hoe ver het meegaat", en terug.
    let mee = |trek: f32| ruimte * (1.0 - 1.0 / (1.0 + trek / ruimte));
    let trek = |mee: f32| {
        let f = (mee / ruimte).min(0.999);
        ruimte * (1.0 / (1.0 - f) - 1.0)
    };
    let ruw_oud = if oud > max {
        max + trek(oud - max)
    } else if oud < min {
        min - trek(min - oud)
    } else {
        oud
    };
    let ruw = ruw_oud + (nieuw - oud);
    if ruw > max {
        max + mee(ruw - max)
    } else if ruw < min {
        min - mee(min - ruw)
    } else {
        ruw
    }
}

/// Uitlopen na het loslaten: de camera beweegt nog even door met de snelheid van de vingers
/// en remt dan af. Snelheden per seconde; tijd van de vingers in seconden.
#[derive(Debug, Clone, Default)]
pub struct Uitloop {
    /// Schuiven (doel per seconde), zoomen (ln schaal per seconde) en draaien (radialen per seconde).
    schuif: Vec2,
    zoom: f32,
    draai: f32,
    /// Wanneer de vingers het laatst iets bewogen.
    laatst: Option<f64>,
    /// Loopt de camera nu uit?
    pub aan: bool,
}

/// Hoe snel het uitlopen afremt (per seconde): schuiven, zoomen, draaien.
const REM_SCHUIF: f32 = 4.2;
const REM_ZOOM: f32 = 6.5;
const REM_DRAAI: f32 = 5.0;
/// Stond de vinger zo lang stil voor het loslaten, dan loopt er niets uit.
const STIL: f64 = 0.07;

impl Uitloop {
    /// Een vinger op het scherm: stop met uitlopen.
    pub fn vast(&mut self) {
        self.aan = false;
    }

    /// De vingers bewogen de camera van `voor` naar `na`, op tijd `tijd`.
    pub fn meet(&mut self, voor: &Camera, na: &Camera, tijd: f64) {
        let dt = self
            .laatst
            .map_or(1.0 / 60.0, |t| (tijd - t) as f32)
            .clamp(1.0 / 240.0, 0.1);
        // Een nieuwe meting telt zwaar, maar een enkele uitschieter niet helemaal.
        let k = 0.55;
        let mee = |oud: f32, nieuw: f32| oud + (nieuw - oud) * k;
        let s = (na.doel - voor.doel) / dt;
        self.schuif = Vec2::new(mee(self.schuif.x, s.x), mee(self.schuif.y, s.y));
        self.zoom = mee(self.zoom, (voor.afstand / na.afstand).ln() / dt);
        self.draai = mee(self.draai, rond(na.draai - voor.draai) / dt);
        self.laatst = Some(tijd);
    }

    /// Alle vingers los op tijd `tijd`: uitlopen, tenzij de vingers al stilstonden.
    pub fn los(&mut self, tijd: f64) {
        let stil = self.laatst.is_none_or(|t| tijd - t > STIL);
        if stil {
            *self = Uitloop::default();
            return;
        }
        self.laatst = None;
        self.aan = self.schuif.length() > 0.3 || self.zoom.abs() > 0.08 || self.draai.abs() > 0.08;
    }

    /// Loop `dt` seconden uit. Geeft `true` zolang de camera nog beweegt.
    pub fn stap(&mut self, cam: &mut Camera, dt: f32) -> bool {
        if !self.aan {
            return false;
        }
        cam.zoom_draai((self.zoom * dt).exp(), self.draai * dt);
        cam.verschuif(self.schuif * dt);
        // Voorbij een grens remt het veel harder: het elastiek houdt hem tegen.
        let extra = if cam.gerekt() { 18.0 } else { 0.0 };
        self.schuif *= (-(REM_SCHUIF + extra) * dt).exp();
        self.zoom *= (-(REM_ZOOM + extra) * dt).exp();
        self.draai *= (-(REM_DRAAI + extra) * dt).exp();
        self.aan = self.schuif.length() > 0.05 || self.zoom.abs() > 0.01 || self.draai.abs() > 0.01;
        if !self.aan {
            *self = Uitloop::default();
        }
        self.aan
    }
}

fn rond(h: f32) -> f32 {
    (h + PI).rem_euclid(TAU) - PI
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::vakken::Indeling;
    use glam::Vec4;

    const TELEFOON: Vec2 = Vec2::new(390.0, 844.0);

    /// Het vlak tussen de knoppen, zoals in het spelscherm van de app.
    fn venster() -> Venster {
        Venster::met_vlak(TELEFOON, Vec2::new(0.0, 96.0), Vec2::new(390.0, 640.0))
    }

    fn camera(bord: &Indeling, venster: Venster, draai: f32) -> Camera {
        Camera::overzicht(venster, draai, &bord.rand(), bord.vierkant)
    }

    /// Een plek in de wereld naar het scherm, met de gewone matrices van glam:
    /// een tweede rekenweg, los van `Camera::naar_scherm`.
    fn met_matrices(cam: &Camera, p: Vec3) -> Vec2 {
        let s = cam.venster.scherm;
        let proj = glam::camera::rh::proj::directx::perspective(BEELDHOEK, s.x / s.y, 0.1, 1000.0);
        let zicht = glam::camera::rh::view::look_at_mat4(cam.oog(), cam.kijkpunt(), Vec3::Y);
        let c = proj * zicht * Vec4::new(p.x, p.y, p.z, 1.0);
        let ndc = c.truncate() / c.w;
        Vec2::new((ndc.x + 1.0) / 2.0 * s.x, (1.0 - ndc.y) / 2.0 * s.y)
    }

    fn camera_gedraaid(bord: &Indeling) -> Camera {
        let mut cam = camera(bord, venster(), 0.4);
        cam.knijp(TELEFOON / 2.0, 2.5, 0.7);
        cam.schuif(Vec2::new(200.0, 400.0), Vec2::new(150.0, 480.0));
        cam
    }

    #[test]
    fn naar_scherm_klopt_met_de_matrices_van_glam() {
        for vierkant in [false, true] {
            let bord = Indeling::nieuw(vierkant);
            for cam in [camera(&bord, venster(), 0.3), camera_gedraaid(&bord)] {
                for v in &bord.vakken {
                    let p = Vec3::new(v.x, 0.24, v.y);
                    let a = cam.naar_scherm(p).unwrap();
                    let b = met_matrices(&cam, p);
                    assert!(a.distance(b) < 0.05, "{a} {b}");
                }
            }
        }
    }

    #[test]
    fn straal_door_een_vak_raakt_dat_vak() {
        for vierkant in [false, true] {
            let bord = Indeling::nieuw(vierkant);
            for cam in [camera(&bord, venster(), 0.0), camera_gedraaid(&bord)] {
                let mut geraakt = 0;
                for v in &bord.vakken {
                    let s = cam.naar_scherm(Vec3::new(v.x, 0.3, v.y)).unwrap();
                    if s.cmpge(Vec2::ZERO).all() && s.cmple(TELEFOON).all() {
                        geraakt += 1;
                        let raak = cam.grondpunt(s, 0.3).unwrap();
                        assert!(raak.distance(*v) < 1e-3, "{raak} {v}");
                    }
                }
                assert!(geraakt > 0);
            }
        }
    }

    #[test]
    fn overzicht_toont_het_hele_bord_in_het_vlak() {
        for vierkant in [false, true] {
            let bord = Indeling::nieuw(vierkant);
            for (venster, draai) in [
                (venster(), 0.3),
                (Venster::heel(TELEFOON), 1.0),
                (Venster::heel(Vec2::new(1280.0, 720.0)), 2.0),
            ] {
                let cam = camera(&bord, venster, draai);
                let mut boven = f32::MAX;
                let mut onder = f32::MIN;
                let mut links = f32::MAX;
                let mut rechts = f32::MIN;
                for p in bord.rand() {
                    let s = cam.naar_scherm(Vec3::new(p.x, 0.0, p.y)).unwrap();
                    assert!(
                        s.cmpge(venster.vlak_min).all() && s.cmple(venster.vlak_max).all(),
                        "{s}"
                    );
                    boven = boven.min(s.y);
                    onder = onder.max(s.y);
                    links = links.min(s.x);
                    rechts = rechts.max(s.x);
                }
                // De plank vult het vlak: aan minstens één kant raakt hij bijna de marge.
                let maat = venster.vlak_max - venster.vlak_min;
                let ruimte_x = (rechts - links) / maat.x;
                let ruimte_y = (onder - boven) / maat.y;
                assert!(ruimte_x.max(ruimte_y) > 0.75, "{ruimte_x} {ruimte_y}");
            }
        }
    }

    #[test]
    fn de_plek_boven_de_vinger_ligt_een_half_vak_hoger_op_het_scherm() {
        let bord = Indeling::nieuw(false);
        let mut cam = camera(&bord, venster(), 0.0);
        // Bij overzicht en ingezoomd: even ver (een half vak, op het scherm gemeten).
        for zoom in [1.0_f32, 1.8] {
            cam.knijp(Vec2::new(200.0, 450.0), zoom, 0.0);
            let vinger = Vec2::new(190.0, 480.0);
            let onder = cam.grondpunt(vinger, 0.0).unwrap();
            let (_, maat) = cam
                .naar_scherm_maat(Vec3::new(onder.x, 0.0, onder.y))
                .unwrap();
            let plek = cam.boven_vinger(vinger, 0.5).unwrap();
            let s = cam.naar_scherm(Vec3::new(plek.x, 0.0, plek.y)).unwrap();
            assert!((s.x - vinger.x).abs() < 0.1, "{s}");
            assert!((vinger.y - s.y - 0.5 * maat).abs() < 0.1, "{s} {maat}");
            // Een vak is zo groot dat een half vak meer dan een vingertop breed hoger ligt dan de vinger.
            assert!(0.5 * maat > 10.0, "{maat}");
        }
    }

    #[test]
    fn overzicht_staat_in_het_midden_van_het_vlak() {
        let bord = Indeling::nieuw(false);
        let v = venster();
        let cam = camera(&bord, v, 0.0);
        let midden = cam.naar_scherm(Vec3::ZERO).unwrap();
        assert!(
            midden.distance((v.vlak_min + v.vlak_max) / 2.0) < 0.5,
            "{midden}"
        );
    }

    #[test]
    fn terug_zet_het_overzicht_terug() {
        let bord = Indeling::nieuw(false);
        let cam = camera_gedraaid(&bord);
        assert_eq!(cam.terug_doel(), camera(&bord, venster(), 0.4));
    }

    #[test]
    fn een_ander_vlak_houdt_het_overzicht_passend() {
        let bord = Indeling::nieuw(false);
        let mut cam = camera(&bord, Venster::heel(TELEFOON), 0.0);
        cam.nieuw_venster(venster());
        assert_eq!(cam, camera(&bord, venster(), 0.0));
    }

    #[test]
    fn tussen_gaat_de_kortste_kant_op_en_komt_aan() {
        let bord = Indeling::nieuw(false);
        let mut van = camera(&bord, venster(), 6.0);
        van.afstand *= 1.5;
        let naar = camera(&bord, venster(), 0.2);
        assert_eq!(Camera::tussen(&van, &naar, 1.0), naar);
        let half = Camera::tussen(&van, &naar, 0.5);
        // Van 6,0 naar 0,2 rad is via 2 pi maar 0,48 rad: halverwege ongeveer 6,24.
        assert!(
            (half.draai.rem_euclid(TAU) - 6.2416).abs() < 1e-2,
            "{}",
            half.draai
        );
        assert_eq!(zacht(0.0), 0.0);
        assert_eq!(zacht(1.0), 1.0);
        assert!((zacht(0.5) - 0.5).abs() < 1e-6);
    }

    #[test]
    fn tussen_twee_tafels_blijft_de_camera_in_het_overzicht() {
        // UI-overgangen: de camera glijdt van de tafel van het ene scherm naar die van het andere. Onderweg hoort de kanteling
        // bij het overzicht (geen knik), en elk punt dat in beide tafels in beeld is, blijft in beeld.
        let bord = Indeling::nieuw(false);
        let mut ruim = bord.rand();
        ruim.extend([Vec2::new(-7.0, -13.0), Vec2::new(7.0, 20.0)]);
        let mut krap = bord.rand();
        krap.extend([Vec2::new(-7.0, -12.0), Vec2::new(7.0, 13.0)]);
        let van = Camera::tafel(venster(), &ruim, 0.0);
        let naar = Camera::tafel(venster(), &krap, 0.0);
        assert!(
            van.afstand > naar.afstand + 1.0,
            "{} {}",
            van.afstand,
            naar.afstand
        );
        for i in 0..=10 {
            let c = Camera::tussen(&van, &naar, i as f32 / 10.0);
            assert!(
                (c.kanteling() - KANTELING_VER).abs() < 1e-5,
                "{i}: {}",
                c.kanteling()
            );
            assert!(c.afstand <= van.afstand + 1e-4 && c.afstand >= naar.afstand - 1e-4);
            for p in bord.rand() {
                let s = c.naar_scherm(Vec3::new(p.x, 0.0, p.y)).unwrap();
                assert!(s.x > -1.0 && s.x < TELEFOON.x + 1.0, "{i}: {s}");
            }
        }
        assert_eq!(Camera::tussen(&van, &naar, 1.0), naar);
    }

    #[test]
    fn tussen_twee_gedraaide_tafels_blijft_wat_meedraait_op_het_scherm() {
        // UI-overgangen, het begin van een Potje: de tafel draait naar de eigen Speler. Een punt zoals de Speler het ziet (een
        // voorwerp) staat onderweg steeds op dezelfde plek op het scherm; het bord draait eronder.
        let bord = Indeling::nieuw(false);
        let mut punten = bord.rand();
        punten.extend([Vec2::new(-7.0, -13.0), Vec2::new(7.0, 16.0)]);
        let van = Camera::tafel(venster(), &punten, 0.0);
        let naar = Camera::tafel(venster(), &punten, 2.1);
        let voorwerp = Vec2::new(3.0, 14.0);
        let op_scherm = |c: &Camera| {
            let p = draai_xz(voorwerp, c.draai);
            c.naar_scherm(Vec3::new(p.x, 0.0, p.y)).unwrap()
        };
        let begin = op_scherm(&van);
        for i in 0..=10 {
            let c = Camera::tussen(&van, &naar, i as f32 / 10.0);
            assert!(
                op_scherm(&c).distance(begin) < 0.5,
                "{i}: {} {}",
                op_scherm(&c),
                begin
            );
        }
    }

    // ---- Taak 186: strak inzoomen en schuiven, zonder rek, uitlopen of draaien.

    #[test]
    fn voorwerpen_aan_een_kant_staan_samen_met_het_bord_in_het_midden() {
        // Taak 206: het Startmenu op een breed scherm, met een kolom voorwerpen rechts van het bord.
        let bord = Indeling::nieuw(false);
        let mut punten = bord.rand();
        punten.extend([Vec2::new(23.0, -9.0), Vec2::new(23.0, 9.0)]);
        let breed = Venster::heel(Vec2::new(1920.0, 1080.0));
        let cam = Camera::tafel(breed, &punten, 0.0);
        let xs: Vec<f32> = punten
            .iter()
            .filter_map(|p| cam.naar_scherm(Vec3::new(p.x, 0.0, p.y)).map(|s| s.x))
            .collect();
        let (links, rechts) = xs
            .iter()
            .fold((f32::MAX, f32::MIN), |(a, b), &x| (a.min(x), b.max(x)));
        // Links en rechts evenveel ruimte (op een paar procent na: de camera kijkt schuin).
        assert!(
            ((links - 0.0) - (1920.0 - rechts)).abs() < 1920.0 * 0.05,
            "{links} {rechts}"
        );
    }

    // ---- Taak 190: de plek tussen de vingers blijft onder de vingers, en zacht afremmen tegen de grenzen.

    /// Een tafel met voorwerpen zoals in het Potje: het bord, naamplaten erboven en het blad met knoppen eronder.
    fn tafel(bord: &Indeling) -> Camera {
        let mut punten = bord.rand();
        punten.extend([
            Vec2::new(-4.0, -11.0),
            Vec2::new(4.0, -11.5),
            Vec2::new(-4.0, 11.0),
            Vec2::new(4.0, 13.0),
        ]);
        Camera::tafel(Venster::heel(TELEFOON), &punten, 0.0)
    }

    fn alle_cameras() -> Vec<Camera> {
        [false, true]
            .into_iter()
            .flat_map(|vierkant| {
                let bord = Indeling::nieuw(vierkant);
                [
                    camera(&bord, venster(), 0.0),
                    camera(&bord, venster(), 1.2),
                    tafel(&bord),
                ]
            })
            .collect()
    }

    #[test]
    fn zacht_grens_en_terug_horen_bij_elkaar() {
        let (min, max, zone) = (1.0, 4.0, 0.3);
        for i in 0..=200 {
            let x = -0.5 + i as f32 * 0.03;
            let y = zacht_grens(x, min, max, zone);
            assert!((min..=max).contains(&y), "{x} {y}");
            // Midden in gaat het gelijk op.
            if (min + zone..=max - zone).contains(&x) {
                assert_eq!(y, x);
            }
            // Terug en weer heen geeft hetzelfde.
            assert!(
                (zacht_grens(zacht_grens_terug(y, min, max, zone), min, max, zone) - y).abs()
                    < 1e-5
            );
        }
        // Precies op de grens zodra de vinger een zone voorbij de grens is, en zonder knik ervoor.
        assert_eq!(zacht_grens(max + zone, min, max, zone), max);
        assert_eq!(zacht_grens(min - zone, min, max, zone), min);
        let h = 1e-3;
        let helling = |x: f32| {
            (zacht_grens(x + h, min, max, zone) - zacht_grens(x - h, min, max, zone)) / (2.0 * h)
        };
        assert!((helling(max - zone) - 1.0).abs() < 0.01);
        assert!(helling(max + zone - 2.0 * h) < 0.02);
    }

    #[test]
    fn knijpen_houdt_de_plek_tussen_de_vingers_onder_de_vingers() {
        for cam in alle_cameras() {
            let mut cam = cam;
            // Eerst wat inzoomen, zodat er ruimte is om te schuiven.
            let mut g = cam.pak(Vec2::new(195.0, 420.0)).unwrap();
            cam.volg(&mut g, Vec2::new(195.0, 420.0), 0.7);
            // Nu pakken en knijpen terwijl het midden van de vingers verschuift: in en uit, niet tot een grens.
            let begin = Vec2::new(180.0, 430.0);
            let mut g = cam.pak(begin).unwrap();
            let onder = cam.grondpunt(begin, 0.0).unwrap();
            let na_pak = cam.clone();
            for i in 1..=30 {
                let k = i as f32 / 30.0;
                let midden = begin + Vec2::new(25.0 * k, -18.0 * k);
                let zoom = 0.25 * (k * std::f32::consts::PI).sin();
                cam.volg(&mut g, midden, zoom);
                let nu = cam.grondpunt(midden, 0.0).unwrap();
                assert!(onder.distance(nu) < 2e-3, "stap {i}: {onder} {nu}");
            }
            // Weer op het begin, zonder zoom: precies dezelfde camera.
            cam.volg(&mut g, begin, 0.0);
            assert!(cam.grondpunt(begin, 0.0).unwrap().distance(onder) < 2e-3);
            assert!(cam.doel.distance(na_pak.doel) < 1e-3);
            assert!((cam.afstand - na_pak.afstand).abs() < 1e-3);
        }
    }

    #[test]
    fn pakken_verspringt_niet_ook_niet_tegen_een_grens() {
        for cam in alle_cameras() {
            let mut cam = cam;
            // Helemaal ingezoomd en naar een rand geschoven: de camera staat in de zachte zone van beide grenzen.
            let mut g = cam.pak(Vec2::new(195.0, 420.0)).unwrap();
            cam.volg(&mut g, Vec2::new(195.0, 420.0), 5.0);
            cam.volg(&mut g, Vec2::new(395.0, 820.0), 5.0);
            let voor = cam.clone();
            let mut g = cam.pak(Vec2::new(120.0, 300.0)).unwrap();
            cam.volg(&mut g, Vec2::new(120.0, 300.0), 0.0);
            assert!((cam.afstand - voor.afstand).abs() < 1e-4);
            assert!(
                cam.doel.distance(voor.doel) < 1e-4,
                "{} {}",
                cam.doel,
                voor.doel
            );
        }
    }

    #[test]
    fn tegen_de_grens_remt_het_zacht_af_zonder_sprong() {
        for cam in alle_cameras() {
            let mut cam = cam;
            let midden = Vec2::new(200.0, 440.0);
            let mut g = cam.pak(midden).unwrap();
            // Inzoomen in kleine stappen tot ver voorbij de grens: nooit verder dan de grens, geen sprong, en vlak voor
            // de grens trager dan de vingers.
            let mut vorige = cam.afstand.ln();
            let mut trager = false;
            for i in 1..=400 {
                let zoom = i as f32 * 0.01;
                cam.volg(&mut g, midden, zoom);
                let nu = cam.afstand.ln();
                assert!(cam.afstand >= AFSTAND_MIN);
                assert!(vorige - nu <= 0.01 + 1e-4, "sprong bij {zoom}");
                assert!(nu <= vorige + 1e-5, "terug bij {zoom}");
                if vorige - nu < 0.009 && cam.afstand > AFSTAND_MIN + 1e-3 {
                    trager = true;
                }
                vorige = nu;
            }
            assert!(trager);
            assert_eq!(cam.afstand, AFSTAND_MIN);
            // Terug: het bord reageert meteen weer (de greep schoof mee), zonder dode slag.
            cam.volg(&mut g, midden, 4.0 - 0.05);
            assert!(cam.afstand > AFSTAND_MIN);
            // Uitzoomen tot ver voorbij het overzicht: precies het overzicht, weer in het midden, en ook zonder sprong.
            let mut vorige_doel = cam.doel;
            for i in 1..=600 {
                let zoom = 3.95 - i as f32 * 0.01;
                cam.volg(&mut g, midden, zoom);
                assert!(
                    cam.doel.distance(vorige_doel) < 0.25,
                    "doel sprong bij {zoom}"
                );
                vorige_doel = cam.doel;
            }
            assert_eq!(cam.afstand, cam.afstand_max);
            assert!(cam.doel.distance(cam.midden()) < 1e-4);
        }
    }

    #[test]
    fn schuiven_tegen_de_rand_remt_zacht_af_en_blijft_op_het_bord() {
        for cam in alle_cameras() {
            let mut cam = cam;
            let mut g = cam.pak(Vec2::new(195.0, 420.0)).unwrap();
            cam.volg(&mut g, Vec2::new(195.0, 420.0), 1.0);
            // Eén vinger schuift het bord ver weg, in kleine stappen.
            let begin = Vec2::new(195.0, 420.0);
            let mut g = cam.pak(begin).unwrap();
            let max = cam.doel_max();
            let mut vorige = cam.doel;
            for i in 1..=300 {
                let vinger = begin + Vec2::new(-3.0, -4.0) * i as f32;
                cam.volg(&mut g, vinger, 0.0);
                let d = cam.doel - cam.midden();
                let binnen = if cam.vierkant {
                    d.abs().max_element() <= max + 1e-4
                } else {
                    d.length() <= max + 1e-4
                };
                assert!(binnen, "{d} {max}");
                assert!(cam.doel.distance(vorige) < 0.2, "sprong bij stap {i}");
                vorige = cam.doel;
            }
            // Terug schuiven werkt meteen.
            let tegen = cam.doel;
            cam.volg(&mut g, begin + Vec2::new(-3.0, -4.0) * 290.0, 0.0);
            assert!(cam.doel.distance(tegen) > 1e-4);
        }
    }
}
