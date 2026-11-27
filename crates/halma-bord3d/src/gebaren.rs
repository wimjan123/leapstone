//! Vingers op het scherm naar camerabewegingen en tikken.
//!
//! - Eén vinger: tik, of schuiven als hij duidelijk beweegt (zie `nog_een_tik`).
//! - Twee vingers: schuiven en zoomen (knijpen) zodra dat duidelijk is (zie `ZOOM_DREMPEL`). Draaien
//!   doet het bord niet (taak 186).
//! - Taak 190: geen losse stapjes meer, maar `Pak` (het bord vastpakken onder een plek) en `Volg` (waar die plek nu
//!   hoort, en hoeveel groter): de camera rekent vanaf de greep, zodat het punt onder de vingers blijft.
//! - Een tik telt meteen bij loslaten: er is geen dubbeltik, dus niets wacht op een tweede tik.
//!
//! Gewoon rekenwerk zonder Bevy. Plekken in CSS-pixels, tijd in seconden.

use glam::Vec2;

/// Zo ver mag een vinger bewegen en toch een tik zijn, in pixels. Een vinger rolt bij een tik
/// een beetje, vooral bij het loslaten; dat mag geen schuiven of slepen worden.
pub const TIK_RUIMTE: f32 = 12.0;
/// Na zo lang (seconden) staat de vinger bewust stil: dan telt kleiner bewegen al als schuiven
/// of slepen (`TIK_RUIMTE_TRAAG` pixels). Zo voelt langzaam slepen niet stroef.
pub const TIK_SNEL: f64 = 0.18;
pub const TIK_RUIMTE_TRAAG: f32 = 6.0;
/// Zo lang mag een tik duren, in seconden. Ruim: niet iedereen tikt snel.
const TIK_DUUR: f64 = 1.0;
/// Zoveel moeten twee vingers knijpen (ln van de schaal) voor het bord zoomt: 4 procent.
pub const ZOOM_DREMPEL: f32 = 0.04;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Actie {
    /// Pak het bord onder `midden` (taak 190): een vinger begint te schuiven, of er komt een vinger bij of gaat er een af.
    Pak { midden: Vec2 },
    /// Wat bij `Pak` onder het midden lag, hoort nu onder `midden`; `zoom` is ln van hoeveel groter het bord is sinds `Pak`
    /// (groter dan 0 is inzoomen, 0 bij één vinger).
    Volg { midden: Vec2, zoom: f32 },
    /// Een tik, op de plek waar de vinger neerkwam (of losliet, als het bord een klein stukje meeschoof).
    Tik(Vec2),
}

/// Twee vingers sinds ze allebei op het scherm staan.
#[derive(Debug, Default, Clone, Copy)]
struct Twee {
    /// Afstand tussen de vingers bij het begin.
    afstand: f32,
    /// Vanaf welke waarde zoomen meetelt (`None`: nog niet).
    zoom_vanaf: Option<f32>,
}

#[derive(Debug, Default)]
pub struct Gebaren {
    vingers: Vec<(u64, Vec2)>,
    /// Begin van de eerste vinger: plek en tijd.
    begin: Option<(Vec2, f64)>,
    /// Kan dit nog een tik worden? Niet meer na een tweede vinger, of als de vinger verder dan
    /// `TIK_RUIMTE` ging. Een vinger die langzaam een klein stukje schuift, schuift het bord
    /// een beetje en blijft toch een tik.
    tik_kan: bool,
    /// Schuift de eerste vinger al?
    schuift: bool,
    /// Is het bord gepakt sinds het aantal vingers veranderde (`Actie::Pak`)?
    gepakt: bool,
    twee: Option<Twee>,
}

/// Is een vinger die `afstand` pixels van zijn begin is, `duur` seconden na het neerzetten,
/// nog een tik? Zo niet, dan schuift hij (of sleept hij een steen). De web-app rekent een
/// vinger op een steen op dezelfde manier (`nogEenTik` in `tikken.ts`).
pub fn nog_een_tik(afstand: f32, duur: f64) -> bool {
    afstand <= TIK_RUIMTE && (duur <= TIK_SNEL || afstand <= TIK_RUIMTE_TRAAG)
}

impl Gebaren {
    /// Staat er nu een vinger op het scherm?
    pub fn bezig(&self) -> bool {
        !self.vingers.is_empty()
    }

    pub fn neer(&mut self, id: u64, plek: Vec2, tijd: f64) {
        if self.vingers.is_empty() {
            self.begin = Some((plek, tijd));
            self.tik_kan = true;
            self.schuift = false;
        } else {
            self.tik_kan = false;
        }
        self.vingers.retain(|(v, _)| *v != id);
        self.vingers.push((id, plek));
        self.gepakt = false;
        self.twee = None;
        if let [(_, a), (_, b), ..] = self.vingers[..] {
            self.twee = Some(Twee {
                afstand: a.distance(b).max(1.0),
                ..Twee::default()
            });
        }
    }

    pub fn beweeg(&mut self, id: u64, plek: Vec2, tijd: f64) -> Vec<Actie> {
        let Some(i) = self.vingers.iter().position(|(v, _)| *v == id) else {
            return Vec::new();
        };
        let oud = self.vingers[i].1;
        if oud == plek {
            return Vec::new();
        }
        let mut acties = Vec::new();
        if self.vingers.len() == 1 {
            let (begin, sinds) = self.begin.unwrap_or((oud, tijd));
            if begin.distance(plek) > TIK_RUIMTE {
                self.tik_kan = false;
            }
            if !self.schuift && !nog_een_tik(begin.distance(plek), tijd - sinds) {
                // Het schuiven begint: wat bij het neerzetten onder de vinger lag, gaat mee met de vinger.
                self.schuift = true;
                self.gepakt = true;
                acties.push(Actie::Pak { midden: begin });
            } else if self.schuift && !self.gepakt {
                // Na twee vingers: de laatste vinger pakt het bord waar hij nu is.
                self.gepakt = true;
                acties.push(Actie::Pak { midden: oud });
            }
            if self.schuift {
                acties.push(Actie::Volg {
                    midden: plek,
                    zoom: 0.0,
                });
            }
            self.vingers[i].1 = plek;
            return acties;
        }

        // Twee (of meer) vingers: de eerste twee tellen.
        if i > 1 {
            self.vingers[i].1 = plek;
            return acties;
        }
        let midden_oud = (self.vingers[0].1 + self.vingers[1].1) / 2.0;
        self.vingers[i].1 = plek;
        let (a, b) = (self.vingers[0].1, self.vingers[1].1);
        let midden = (a + b) / 2.0;
        self.schuift = true;
        if !self.gepakt {
            self.gepakt = true;
            acties.push(Actie::Pak { midden: midden_oud });
        }
        let Some(twee) = self.twee.as_mut() else {
            return acties;
        };
        let zoom = (a.distance(b).max(1.0) / twee.afstand).ln();
        if twee.zoom_vanaf.is_none() && zoom.abs() > ZOOM_DREMPEL {
            twee.zoom_vanaf = Some(zoom.signum() * ZOOM_DREMPEL);
        }
        // Alleen wat na de drempel komt, zodat het bord niet ineens verspringt.
        let zoom = twee.zoom_vanaf.map_or(0.0, |v| zoom - v);
        acties.push(Actie::Volg { midden, zoom });
        acties
    }

    pub fn op(&mut self, id: u64, plek: Vec2, tijd: f64) -> Vec<Actie> {
        let mut acties = self.beweeg(id, plek, tijd);
        let waren = self.vingers.len();
        self.vingers.retain(|(v, _)| *v != id);
        if self.vingers.len() < 2 {
            self.twee = None;
        }
        if self.vingers.len() != waren {
            self.gepakt = false;
            // Van drie naar twee vingers: verder knijpen met dit paar, zonder nieuwe drempel.
            if self.vingers.len() >= 2
                && let [(_, a), (_, b), ..] = self.vingers[..]
            {
                self.twee = Some(Twee {
                    afstand: a.distance(b).max(1.0),
                    zoom_vanaf: Some(0.0),
                });
            }
        }
        if !self.vingers.is_empty() {
            return acties;
        }
        // Een tik telt waar de vinger neerkwam: bij het loslaten rolt hij nog wat. Schoof het bord
        // een klein stukje mee, dan ligt wat onder het begin lag nu onder de vinger.
        if let Some((begin, t)) = self.begin
            && self.tik_kan
            && tijd - t <= TIK_DUUR
        {
            acties.push(Actie::Tik(if self.schuift { plek } else { begin }));
        }
        self.begin = None;
        acties
    }

    /// De browser nam de vinger over (bijvoorbeeld een systeemgebaar): geen tik.
    pub fn afgebroken(&mut self, id: u64) {
        self.vingers.retain(|(v, _)| *v != id);
        self.tik_kan = false;
        self.gepakt = false;
        if self.vingers.len() < 2 {
            self.twee = None;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn v(x: f32, y: f32) -> Vec2 {
        Vec2::new(x, y)
    }

    /// De laatste `Volg` uit een rij acties: waar het gepakte punt hoort en de zoom sinds `Pak` (als schaal).
    fn laatste_volg(acties: &[Actie]) -> Option<(Vec2, f32)> {
        acties.iter().rev().find_map(|a| match a {
            Actie::Volg { midden, zoom } => Some((*midden, zoom.exp())),
            _ => None,
        })
    }

    #[test]
    fn twee_snelle_tikken_zijn_twee_tikken() {
        // Geen dubbeltik meer: een snelle tweede tik (bijvoorbeeld op het vak naast de steen) telt gewoon.
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 100.0), 0.0);
        assert_eq!(
            g.op(1, v(100.0, 100.0), 0.05),
            vec![Actie::Tik(v(100.0, 100.0))]
        );
        g.neer(1, v(110.0, 105.0), 0.15);
        assert_eq!(
            g.op(1, v(110.0, 105.0), 0.2),
            vec![Actie::Tik(v(110.0, 105.0))]
        );
    }

    #[test]
    fn vinger_die_schuift_is_geen_tik() {
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 100.0), 0.0);
        // Het bord wordt gepakt waar de vinger neerkwam, en volgt de vinger.
        assert_eq!(
            g.beweeg(1, v(130.0, 100.0), 0.0),
            vec![
                Actie::Pak {
                    midden: v(100.0, 100.0)
                },
                Actie::Volg {
                    midden: v(130.0, 100.0),
                    zoom: 0.0
                }
            ]
        );
        assert_eq!(
            g.op(1, v(140.0, 100.0), 0.2),
            vec![Actie::Volg {
                midden: v(140.0, 100.0),
                zoom: 0.0
            }]
        );
    }

    #[test]
    fn twee_vingers_uit_elkaar_zoomt_in() {
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 400.0), 0.0);
        g.neer(2, v(200.0, 400.0), 0.0);
        let mut acties = Vec::new();
        // Uit elkaar, met een klein beetje draaien (5 graden), zoals een echte hand.
        for k in 1..=20 {
            let f = k as f32 / 20.0;
            let r = 100.0 + 100.0 * f;
            let h = 0.087 * f;
            acties.extend(g.beweeg(2, v(100.0 + r * h.cos(), 400.0 + r * h.sin()), 0.0));
        }
        // Eerst pakken, tussen de vingers waar ze neerkwamen.
        assert_eq!(
            acties[0],
            Actie::Pak {
                midden: v(150.0, 400.0)
            }
        );
        assert_eq!(
            acties
                .iter()
                .filter(|a| matches!(a, Actie::Pak { .. }))
                .count(),
            1
        );
        // Twee keer zo ver uit elkaar; alleen de drempel van 4 procent gaat eraf.
        let (midden, schaal) = laatste_volg(&acties).unwrap();
        assert!((schaal - 2.0 / ZOOM_DREMPEL.exp()).abs() < 1e-3, "{schaal}");
        // Het midden van de vingers gaat mee: daar hoort het gepakte punt.
        assert!(midden.x > 140.0);
        // Geen tik bij loslaten.
        assert!(
            !g.op(2, v(300.0, 400.0), 0.1)
                .iter()
                .any(|a| matches!(a, Actie::Tik(_)))
        );
        assert!(
            !g.op(1, v(100.0, 400.0), 0.1)
                .iter()
                .any(|a| matches!(a, Actie::Tik(_)))
        );
    }

    #[test]
    fn twee_vingers_naar_elkaar_zoomt_uit() {
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 400.0), 0.0);
        g.neer(2, v(300.0, 400.0), 0.0);
        let acties = g.beweeg(2, v(200.0, 400.0), 0.0);
        let (_, schaal) = laatste_volg(&acties).unwrap();
        assert!(
            (schaal - 0.5 / (-ZOOM_DREMPEL).exp()).abs() < 1e-3,
            "{schaal}"
        );
    }

    #[test]
    fn twee_vingers_draaien_doet_niets() {
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 400.0), 0.0);
        g.neer(2, v(200.0, 400.0), 0.0);
        let mut acties = Vec::new();
        // Vinger 2 draait een kwartslag om vinger 1, op dezelfde afstand: geen zoom, en draaien bestaat niet.
        for k in 1..=30 {
            let h = std::f32::consts::FRAC_PI_2 * k as f32 / 30.0;
            acties.extend(g.beweeg(2, v(100.0 + 100.0 * h.cos(), 400.0 + 100.0 * h.sin()), 0.0));
        }
        assert!((laatste_volg(&acties).unwrap().1 - 1.0).abs() < 1e-3);
    }

    #[test]
    fn na_twee_vingers_schuift_de_laatste_vinger_verder() {
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 400.0), 0.0);
        g.neer(2, v(200.0, 400.0), 0.0);
        g.op(2, v(200.0, 400.0), 0.2);
        // De laatste vinger pakt het bord waar hij is (niet tussen de twee vingers): niets verspringt.
        assert_eq!(
            g.beweeg(1, v(120.0, 400.0), 0.0),
            vec![
                Actie::Pak {
                    midden: v(100.0, 400.0)
                },
                Actie::Volg {
                    midden: v(120.0, 400.0),
                    zoom: 0.0
                }
            ]
        );
        assert!(
            !g.op(1, v(120.0, 400.0), 0.3)
                .iter()
                .any(|a| matches!(a, Actie::Tik(_)))
        );
        assert!(!g.bezig());
    }

    #[test]
    fn lang_vasthouden_is_geen_tik() {
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 100.0), 0.0);
        assert_eq!(g.op(1, v(100.0, 100.0), 1.2), vec![]);
    }

    #[test]
    fn een_rustige_tik_telt_ook() {
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 100.0), 0.0);
        assert_eq!(
            g.op(1, v(101.0, 100.0), 0.8),
            vec![Actie::Tik(v(100.0, 100.0))]
        );
    }

    #[test]
    fn tik_of_schuiven() {
        // Snel: tot 12 px rollen is nog een tik.
        assert!(nog_een_tik(0.0, 0.0));
        assert!(nog_een_tik(11.5, 0.1));
        assert!(!nog_een_tik(12.5, 0.1));
        // Na 0,18 s stilstaan telt 6 px al als schuiven of slepen.
        assert!(nog_een_tik(5.5, 0.4));
        assert!(!nog_een_tik(6.5, 0.4));
        assert!(!nog_een_tik(40.0, 0.4));
    }

    #[test]
    fn een_vinger_die_bij_een_snelle_tik_rolt_blijft_een_tik() {
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 100.0), 0.0);
        assert_eq!(g.beweeg(1, v(106.0, 103.0), 0.05), vec![]);
        assert_eq!(g.beweeg(1, v(110.0, 104.0), 0.09), vec![]);
        assert_eq!(
            g.op(1, v(110.0, 104.0), 0.11),
            vec![Actie::Tik(v(100.0, 100.0))]
        );
    }

    #[test]
    fn langzaam_schuiven_begint_al_na_een_klein_stukje() {
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 100.0), 0.0);
        assert_eq!(g.beweeg(1, v(104.0, 100.0), 0.25), vec![]);
        assert_eq!(
            g.beweeg(1, v(107.0, 100.0), 0.3),
            vec![
                Actie::Pak {
                    midden: v(100.0, 100.0)
                },
                Actie::Volg {
                    midden: v(107.0, 100.0),
                    zoom: 0.0
                }
            ]
        );
        // Losgelaten binnen 12 px: toch een tik (een langzame tik op een trage telefoon), op de
        // plek van loslaten: het bord schoof mee, dus daar ligt nu wat bij het begin onder de vinger lag.
        assert_eq!(
            g.op(1, v(107.0, 100.0), 0.4),
            vec![Actie::Tik(v(107.0, 100.0))]
        );
        // Verder geschoven: geen tik meer, ook niet als hij terugkomt.
        g.neer(1, v(100.0, 100.0), 1.0);
        g.beweeg(1, v(130.0, 100.0), 1.3);
        g.beweeg(1, v(101.0, 100.0), 1.5);
        assert!(
            !g.op(1, v(101.0, 100.0), 1.6)
                .iter()
                .any(|a| matches!(a, Actie::Tik(_)))
        );
    }

    #[test]
    fn een_tweede_vinger_tijdens_schuiven_pakt_opnieuw_tussen_de_vingers() {
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 400.0), 0.0);
        g.beweeg(1, v(140.0, 400.0), 0.1);
        g.neer(2, v(240.0, 400.0), 0.2);
        let acties = g.beweeg(2, v(243.0, 400.0), 0.25);
        // Gepakt tussen de vingers zoals ze stonden (140 en 240), en geen zoom onder de drempel.
        assert_eq!(
            acties[0],
            Actie::Pak {
                midden: v(190.0, 400.0)
            }
        );
        assert_eq!(laatste_volg(&acties), Some((v(191.5, 400.0), 1.0)));
    }

    #[test]
    fn het_midden_tussen_de_vingers_blijft_het_gepakte_punt() {
        // Twee vingers schuiven samen opzij en uit elkaar: elke `Volg` noemt het echte midden en de schaal sinds het pakken.
        let mut g = Gebaren::default();
        g.neer(1, v(100.0, 400.0), 0.0);
        g.neer(2, v(200.0, 400.0), 0.0);
        let mut acties = Vec::new();
        for k in 1..=10 {
            let f = k as f32 / 10.0;
            acties.extend(g.beweeg(1, v(100.0 + 30.0 * f - 20.0 * f, 400.0 - 10.0 * f), 0.0));
            acties.extend(g.beweeg(2, v(200.0 + 30.0 * f + 20.0 * f, 400.0 - 10.0 * f), 0.0));
        }
        let (midden, schaal) = laatste_volg(&acties).unwrap();
        assert!(midden.distance(v(180.0, 390.0)) < 1e-3, "{midden}");
        assert!((schaal - 1.4 / ZOOM_DREMPEL.exp()).abs() < 1e-3, "{schaal}");
    }
}
