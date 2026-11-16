// Kabel-Helfer: Daten + Rechenlogik (ohne Oberfläche, damit testbar)
(function (root) {
  'use strict';

  // ---------- Kabelfamilien (Klartext für Einsteiger) ----------
  const FAM = {
    NYM: {
      name: 'NYM-J', kurz: 'Mantelleitung (Installationskabel)',
      use: 'Innen, fest verlegt: Wand, Decke, Kabelkanal, Technikraum. Auch Feuchträume.',
      not: 'NICHT im Erdreich, NICHT im Freien in der Sonne.',
      dec: [['N', 'nach VDE-Norm gebaut'], ['Y', 'Isolierung aus PVC (Kunststoff)'], ['M', 'Mantelleitung: Adern + gemeinsamer Mantel'], ['-J', 'mit grün-gelber Ader (Erdung / Schutzleiter)']]
    },
    NYY: {
      name: 'NYY-J', kurz: 'Erdkabel / Außenkabel',
      use: 'Im Erdreich, im Freien, auf Kabelpritsche und Mast. Der „robuste“ Standard für draußen.',
      not: 'Nicht beweglich (nicht ständig bewegen / aufrollen).',
      dec: [['N', 'nach VDE-Norm gebaut'], ['Y', 'Isolierung aus PVC'], ['Y', 'Mantel aus PVC (robust, wetterfest)'], ['-J', 'mit grün-gelber Ader (Schutzleiter)'], ['-O', 'ohne grün-gelbe Ader (kein Schutzleiter!)']]
    },
    NYCWY: {
      name: 'NYCWY', kurz: 'Erdkabel mit konzentrischem Leiter',
      use: 'Erdreich / Netzanschluss. Der „Wellenleiter“ rundherum dient als Schirm und Schutzleiter (Störungen, Blitz).',
      not: 'Nur dort einsetzen, wo es verlangt wird (Netzbetreiber / DFMG-Vorgabe).',
      dec: [['N', 'nach VDE-Norm gebaut'], ['Y', 'Isolierung aus PVC'], ['CW', 'konzentrischer Leiter, wellenförmig (Kupfer-Schirm rundherum)'], ['Y', 'Mantel aus PVC'], ['re/rm/sm', 'Bauform des Leiters (rund eindrähtig / rund mehrdrähtig / Sektor)']]
    },
    H07RN: {
      name: 'H07RN-F', kurz: 'Gummischlauchleitung (flexibel)',
      use: 'Beweglich und provisorisch: Baustrom, Generator, Verlängerung, Anschluss an wechselnde Geräte. Draußen ok.',
      not: 'Nicht als Dauerinstallation für fest verlegte Leitungen.',
      dec: [['H', 'nach europäischer Norm (harmonisiert)'], ['07', 'bis 450/750 Volt'], ['R', 'Isolierung aus Gummi'], ['N', 'Mantel aus Chloropren-Gummi (robust, Öl/Wetter)'], ['-F', 'flexibel: feindrähtig, lässt sich biegen']]
    },
    H07VU: {
      name: 'H07V-U', kurz: 'Aderleitung, starr eindrähtig',
      use: 'NUR geschützt: im Schaltschrank, Verteiler, Installationsrohr, Geräte. Einzelne Ader ohne Mantel.',
      not: 'Nicht frei verlegen, nicht im Erdreich, nicht beweglich.',
      dec: [['H', 'europäische Norm'], ['07', 'bis 450/750 Volt'], ['V', 'Isolierung aus PVC'], ['-U', 'eindrähtig (ein dicker Draht, starr)']]
    },
    H07VR: {
      name: 'H07V-R', kurz: 'Aderleitung, starr mehrdrähtig',
      use: 'NUR geschützt: Schaltschrank, Verteiler, Rohr. Große Querschnitte (16–35 mm²) für Einspeisungen.',
      not: 'Nicht frei verlegen, nicht im Erdreich, nicht beweglich.',
      dec: [['H', 'europäische Norm'], ['07', 'bis 450/750 Volt'], ['V', 'Isolierung aus PVC'], ['-R', 'mehrdrähtig, rund (aus vielen Drähten, wenig biegsam)']]
    },
    H07VK: {
      name: 'H07V-K', kurz: 'Aderleitung, flexibel feindrähtig',
      use: 'NUR geschützt: Schaltschrank, Verteiler, enge Biegungen. Weich und gut zu verdrahten.',
      not: 'Nicht frei verlegen, nicht im Erdreich.',
      dec: [['H', 'europäische Norm'], ['07', 'bis 450/750 Volt'], ['V', 'Isolierung aus PVC'], ['-K', 'feindrähtig, flexibel']]
    },
    JY: {
      name: 'JY(St)Y', kurz: 'Fernmelde- / Meldekabel (geschirmt)',
      use: 'Innen: Signal, Alarm, Telefon, Steuerung. Verdrillte Paare mit Schirm gegen Störungen.',
      not: 'KEIN Strom (nur Kleinspannung/Signal). Nicht im Erdreich.',
      dec: [['J', 'Installationskabel für Fernmelde-/Signaltechnik'], ['Y', 'Isolierung aus PVC'], ['(St)', 'Schirm aus Metallfolie (gegen Störungen)'], ['Y', 'Mantel aus PVC'], ['4x2x0,6', '4 Paare (= 8 Adern), je 0,6 mm Drahtdurchmesser']]
    },
    A2YF: {
      name: 'A2YF(L)2Y', kurz: 'Fernmelde-Außenkabel (Erdkabel für Signale)',
      use: 'Außen und im Erdreich: Telefon, Signale, Alarm über längere Strecken. Wasserdicht gefüllt.',
      not: 'KEIN Strom. Leiter aus Aluminium/Kupfer je nach Typ — nur nach Vorgabe einsetzen.',
      dec: [['A', 'Außenkabel / Aluminium-Teile (laut Bezeichnung)'], ['2Y', 'Isolierung aus Polyethylen'], ['F', 'mit Füllmasse (hält Wasser fern)'], ['(L)', 'Schichtenmantel mit Alu-Schirm'], ['2Y', 'Mantel aus Polyethylen (UV- und wetterfest)']]
    },
    SPEZ: {
      name: 'Sonderkabel', kurz: 'Hersteller-/Projektkabel',
      use: 'Herstellerspezifisch. Datenblatt und Projektvorgabe (DFMG/Telekom) beachten.',
      not: 'Nicht auf Verdacht verwenden: immer Datenblatt prüfen.',
      dec: []
    }
  };

  // ---------- Deine Kabeltabelle (aus dem Bild) ----------
  // [Nr, Familie, Typ-Text, Adern, mm²]
  const T = [
    [10, 'NYM', 'NYM-J 1x16', 1, 16], [11, 'NYM', 'NYM-J 1x25', 1, 25], [12, 'NYM', 'NYM-J 3x1,5', 3, 1.5],
    [13, 'NYM', 'NYM-J 3x2,5', 3, 2.5], [14, 'NYM', 'NYM-J 5x1,5', 5, 1.5], [15, 'NYM', 'NYM-J 5x2,5', 5, 2.5],
    [16, 'NYM', 'NYM-J 5x4', 5, 4], [17, 'NYM', 'NYM-J 5x6', 5, 6], [18, 'NYM', 'NYM-J 5x16', 5, 16],

    [20, 'NYY', 'NYY-J 1x16', 1, 16], [21, 'NYY', 'NYY-J 1x25', 1, 25], [22, 'NYY', 'NYY-J 3x1,5', 3, 1.5],
    [23, 'NYY', 'NYY-J 3x2,5', 3, 2.5], [24, 'NYY', 'NYY-O 4x16', 4, 16], [25, 'NYY', 'NYY-J 5x1,5', 5, 1.5],
    [26, 'NYY', 'NYY-J 5x2,5', 5, 2.5], [27, 'NYY', 'NYY-J 5x4', 5, 4], [28, 'NYY', 'NYY-J 5x6', 5, 6],
    [29, 'NYY', 'NYY-J 5x16', 5, 16], [30, 'NYY', 'NYY-J 5x25', 5, 25], [31, 'NYY', 'NYY-J 5x35', 5, 35],

    [40, 'NYCWY', 'NYCWY 4x16 / re16', 4, 16], [41, 'NYCWY', 'NYCWY 4x25 / rm16', 4, 25], [42, 'NYCWY', 'NYCWY 4x35 / sm16', 4, 35],

    [50, 'H07RN', 'H07RN-F 1x2,5', 1, 2.5], [51, 'H07RN', 'H07RN-F 1x4', 1, 4], [52, 'H07RN', 'H07RN-F 1x6', 1, 6],
    [53, 'H07RN', 'H07RN-F 1x16', 1, 16], [54, 'H07RN', 'H07RN-F 1x25', 1, 25], [55, 'H07RN', 'H07RN-F 1x35', 1, 35],
    [56, 'H07RN', 'H07RN-F 2x2,5', 2, 2.5], [57, 'H07RN', 'H07RN-F 2x4', 2, 4], [58, 'H07RN', 'H07RN-F 2x6', 2, 6],
    [59, 'H07RN', 'H07RN-F 2x16', 2, 16], [60, 'H07RN', 'H07RN-F 2x25', 2, 25],

    [70, 'H07VU', 'H07V-U 1x6', 1, 6], [71, 'H07VR', 'H07V-R 1x16', 1, 16], [72, 'H07VR', 'H07V-R 1x25', 1, 25],
    [73, 'H07VR', 'H07V-R 1x35', 1, 35], [74, 'H07VK', 'H07K 1x16', 1, 16],

    [80, 'JY', 'JY(St)Y 4x2x0,6', 0, 0, 4], [81, 'JY', 'JY(St)Y 2x2x0,8', 0, 0, 2], [82, 'JY', 'JY(St)Y 4x2x0,6', 0, 0, 4],
    [83, 'JY', 'JY(St)Y 6x2x0,6', 0, 0, 6], [84, 'JY', 'JY(St)Y 10x2x0,8', 0, 0, 10],
    [85, 'A2YF', 'A2YF(L)2Y 10x2x0,8', 0, 0, 10],
    [86, 'SPEZ', 'Raycap MPSC 1x12x6', 0, 0, 0],
    [87, 'NYCWY', 'NYCWY 2x6', 2, 6],
    [88, 'SPEZ', 'SL2C6MM2FRNC-S-BK-R', 0, 0, 0]
  ].map(r => ({ nr: r[0], fam: r[1], typ: r[2], n: r[3], mm2: r[4], paare: r[5] || 0 }));

  const BY_NR = {}; T.forEach(c => { BY_NR[c.nr] = c; });

  // Hinweise zu einzelnen Nummern (ehrlich: wo ich es nicht sicher weiß, steht das drin)
  const NOTE = {
    24: 'Hat KEINEN grün-gelben Schutzleiter (-O). Nur verwenden, wenn der Schutzleiter anders geführt wird.',
    80: 'Steht in deiner Tabelle doppelt (Nr. 80 und 82 sind identisch). Evtl. Tippfehler, bei Gelegenheit klären.',
    82: 'Steht in deiner Tabelle doppelt (Nr. 80 und 82 sind identisch). Evtl. Tippfehler, bei Gelegenheit klären.',
    74: 'In der Tabelle als „H07K“ geschrieben, gemeint ist vermutlich H07V-K.',
    86: 'Raycap-Sonderkabel. Genaue Verwendung steht nicht in der Tabelle, Datenblatt/Projektvorgabe prüfen.',
    88: 'Sonderkabel (Bezeichnung nach Hersteller). Genaue Verwendung unklar, Datenblatt/Projektvorgabe prüfen.',
    87: '2-adrig mit Schirm, 6 mm². Wofür es bei DFMG gedacht ist, bitte mit der Vorgabe abgleichen.',
    40: 'Der Zusatz „re16“ bezeichnet den Schirm/konzentrischen Leiter (16 mm²).',
    41: 'Der Zusatz „rm16“ bezeichnet den Schirm/konzentrischen Leiter (16 mm²).',
    42: 'Der Zusatz „sm16“ bezeichnet den Schirm/konzentrischen Leiter (16 mm²).'
  };

  // ---------- Elektrik-Grundwerte (vereinfacht & konservativ) ----------
  const FUSES = [10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];
  // Dauerstrom in Ampere je Querschnitt (Kupfer, bewusst vorsichtig angesetzt)
  const IZ = {
    innen:  { 1.5: 16, 2.5: 21, 4: 28, 6: 36, 10: 49, 16: 65, 25: 85, 35: 105 },
    erde:   { 1.5: 24, 2.5: 32, 4: 42, 6: 53, 10: 70, 16: 91, 25: 116, 35: 139 },
    gummi:  { 2.5: 25, 4: 34, 6: 43, 16: 80, 25: 105, 35: 125 }
  };
  const KAPPA = 56; // Kupfer, m/(Ohm*mm²)
  const COS = 0.95;

  // Welche Kabel kommen wo in Frage (Reihenfolge = klein nach groß)
  const CANDS = {
    innen:    { ac1: [12, 13, 16, 17, 18], ac3: [14, 15, 16, 17, 18], dc: [10, 11] },
    schrank:  { ac1: [70, 71, 72, 73],     ac3: [70, 71, 72, 73],     dc: [70, 71, 72, 73] },
    erde:     { ac1: [22, 23, 27, 28, 29, 30, 31], ac3: [25, 26, 27, 28, 29, 30, 31], dc: [87, 20, 21] },
    frei:     { ac1: [22, 23, 27, 28, 29, 30, 31], ac3: [25, 26, 27, 28, 29, 30, 31], dc: [87, 20, 21] },
    beweglich:{ ac1: [50, 51, 52, 53, 54, 55],     ac3: [50, 51, 52, 53, 54, 55],     dc: [56, 57, 58, 59, 60] }
  };
  const IZKEY = { innen: 'innen', schrank: 'innen', frei: 'innen', erde: 'erde', beweglich: 'gummi' };

  const ORT_NAME = {
    innen: 'Innen, fest verlegt', schrank: 'Schaltschrank / Verteiler', erde: 'Im Erdreich',
    frei: 'Außen frei (Mast, Pritsche)', beweglich: 'Beweglich / Baustrom'
  };
  const ART_NAME = { ac1: '230 V Wechselstrom (Steckdosen-Strom)', ac3: '400 V Drehstrom', dc: 'Gleichstrom (z. B. -48 V)' };

  function strom(art, einheit, wert, vdc) {
    if (einheit === 'A') return wert;
    const w = wert * 1000; // Eingabe in kW
    if (art === 'ac1') return w / (230 * COS);
    if (art === 'ac3') return w / (Math.sqrt(3) * 400 * COS);
    return w / vdc;
  }

  function spannungsfall(art, I, L, mm2, vdc) {
    if (art === 'ac1') return (2 * L * I * COS) / (KAPPA * mm2) / 230 * 100;
    if (art === 'ac3') return (Math.sqrt(3) * L * I * COS) / (KAPPA * mm2) / 400 * 100;
    return (2 * L * I) / (KAPPA * mm2) / vdc * 100;
  }

  function adernfarben(art, c) {
    if (art === 'dc') return 'Farben bei Gleichstrom richten sich nach Vorgabe DFMG/Betreiber. Vor dem Anschluss klären, nicht raten.';
    const einzel = c.n === 1;
    if (art === 'ac1') return (einzel ? 'Je Leiter ein eigenes Kabel: ' : '') + 'Braun = Außenleiter (L, Strom führend) · Blau = Neutralleiter (N) · Grün-Gelb = Schutzleiter (PE, Erdung).';
    return (einzel ? 'Je Leiter ein eigenes Kabel: ' : '') + 'Braun / Schwarz / Grau = die drei Außenleiter L1, L2, L3 (Strom führend) · Blau = N · Grün-Gelb = PE (Erdung).';
  }

  // Hauptfunktion: Stromkabel auswählen
  function empfehleStrom(p) {
    // p: {ort, art, einheit, wert, laenge, drop, vdc}
    const out = { ok: false, notes: [], warn: [] };
    const I = strom(p.art, p.einheit, p.wert, p.vdc);
    out.I = I;
    if (!(I > 0) || !(p.laenge > 0)) { out.msg = 'Bitte Strom und Länge eintragen.'; return out; }
    const In = FUSES.find(f => f >= I);
    out.In = In;
    if (!In) { out.msg = `Mit ca. ${I.toFixed(0)} A ist das mehr, als die Kabel in deiner Tabelle abdecken (max. 125 A Absicherung bei 35 mm²). Bitte Elektrofachkraft/DFMG fragen oder auf mehrere Leitungen aufteilen.`; return out; }

    const list = CANDS[p.ort][p.art].map(n => BY_NR[n]);
    const iz = IZ[IZKEY[p.ort]];
    const tried = [];
    const good = [];
    for (const c of list) {
      const izv = iz[c.mm2];
      if (!izv) continue;
      const drop = spannungsfall(p.art, I, p.laenge, c.mm2, p.vdc);
      const okI = izv >= In, okD = drop <= p.drop;
      tried.push({ c, izv, drop, okI, okD });
      if (okI && okD) good.push({ c, izv, drop });
    }
    if (!good.length) {
      const last = tried[tried.length - 1];
      out.msg = last
        ? `Kein Kabel aus deiner Tabelle schafft das (${I.toFixed(0)} A über ${p.laenge} m). Das größte, ${last.c.typ}, hat ${last.drop.toFixed(1)} % Spannungsfall bei erlaubten ${p.drop} %. Elektrofachkraft/DFMG fragen (z. B. zwei Leitungen parallel oder höhere Spannung).`
        : 'Für diese Kombination gibt es in deiner Tabelle kein Kabel.';
      return out;
    }
    const pick = good[0];
    const c = pick.c;
    const anzahl = c.n === 1 ? (p.art === 'ac1' ? 3 : p.art === 'ac3' ? 5 : 2) : 1;
    out.ok = true;
    out.rec = { ...c, izv: pick.izv, drop: pick.drop, anzahl };
    out.alt = good.slice(1, 3).map(g => ({ ...g.c, izv: g.izv, drop: g.drop }));
    // Warum nicht kleiner?
    const kleiner = tried.filter(t => t.c.mm2 < c.mm2 || (t.c.mm2 === c.mm2 && t.c.nr < c.nr)).pop();
    if (kleiner) out.warumNicht = `${kleiner.c.typ} wäre zu klein: ${!kleiner.okI ? 'verträgt nur ca. ' + kleiner.izv + ' A (nötig: ' + In + ' A Sicherung)' : ''}${!kleiner.okI && !kleiner.okD ? ' und ' : ''}${!kleiner.okD ? 'Spannungsfall ' + kleiner.drop.toFixed(1) + ' % (erlaubt ' + p.drop + ' %)' : ''}.`;

    out.farben = adernfarben(p.art, c);

    // Hinweise
    if (c.n === 1) out.notes.push(`Einzelader-Kabel: du brauchst ${anzahl} Stück (${p.art === 'dc' ? 'Hin- und Rückleiter' : p.art === 'ac1' ? 'L, N, PE' : 'L1, L2, L3, N, PE'}), jeweils in voller Länge. Die Leitungen eng zusammen verlegen.`);
    if (p.art === 'ac1' && c.n === 5) out.notes.push('Ein 3-adriger Typ in dieser Größe steht nicht in deiner Tabelle. Deshalb 5-adrig nehmen: nur braun, blau, grün-gelb benutzen, die übrigen Adern isoliert und beschriftet als Reserve lassen.');
    if (p.art === 'ac1' && (c.n === 4 || c.n === 2)) out.warn.push('Prüfen, ob ein Schutzleiter vorhanden ist.');
    if (p.art === 'ac3' && (p.ort === 'erde' || p.ort === 'frei') && c.mm2 >= 16) out.notes.push('Alternative für Erdreich: NYCWY 4xN (Nr. 40–42) mit Schirm. Nur nehmen, wenn die DFMG-Vorgabe oder der Netzbetreiber es verlangt.');
    if (p.ort === 'erde') out.notes.push('Erdkabel: üblich ca. 60 cm tief (unter Fahrwegen ca. 80 cm), Sandbett und Warnband darüber. Richtwerte, die Vorgabe vor Ort gilt.');
    if (p.ort === 'frei') out.notes.push('Draußen frei verlegt: Kabel UV- und wetterfest halten, gegen Zug und Knicken sichern, auf Pritsche/Rohr führen.');
    if (p.ort === 'innen') out.notes.push('Nicht im Erdreich einsetzen. Für Durchführungen nach außen auf NYY-J wechseln.');
    if (p.ort === 'schrank') out.notes.push('Aderleitungen (H07V) nur geschützt im Schaltschrank, Verteiler oder Rohr. Nicht frei an der Wand oder in der Kabelrinne.');
    if (p.ort === 'beweglich') out.notes.push('Beweglich/Provisorisch: Kabel nicht aufgerollt unter Last betreiben (wird heiß) und vor Beschädigung schützen.');
    if (NOTE[c.nr]) out.warn.push(NOTE[c.nr]);
    if (pick.drop > p.drop * 0.8) out.notes.push('Spannungsfall ist knapp am Limit. Ein Kabel größer wäre sicherer, wenn die Strecke länger wird.');
    return out;
  }

  // Signalkabel
  function empfehleSignal(p) {
    // p: {sigOrt: 'innen'|'aussen', paare}
    const out = { ok: false, notes: [], warn: [] };
    if (!(p.paare > 0)) { out.msg = 'Bitte Anzahl Paare eintragen.'; return out; }
    const list = (p.sigOrt === 'innen' ? [81, 80, 83, 84] : [85]).map(n => BY_NR[n]);
    const c = list.find(x => x.paare >= p.paare);
    if (!c) { out.msg = `${p.paare} Paare sind mehr als in deiner Tabelle (max. ${list[list.length - 1].paare}). Mehrere Kabel nehmen oder bei DFMG nachfragen.`; return out; }
    out.ok = true;
    out.rec = { ...c, anzahl: 1 };
    out.alt = list.filter(x => x.nr !== c.nr && x.paare >= p.paare && x.nr !== 82).slice(0, 2);
    out.notes.push('Ein Paar = 2 Adern. Plane 1–2 Reserve-Paare ein, nachträglich ziehen ist teuer.');
    out.notes.push('Signalkabel mit Abstand zu Stromkabeln führen, sonst gibt es Störungen. Kreuzungen im 90°-Winkel.');
    out.notes.push('Der Schirm gehört nach Vorgabe aufgelegt (Erdung). Nicht einfach abschneiden.');
    if (p.sigOrt === 'aussen') out.notes.push('Draußen / im Erdreich: JY(St)Y ist dafür NICHT geeignet, deshalb das A2YF(L)2Y.');
    if (p.paare === 4 && p.sigOrt === 'innen') out.warn.push('Für 4 Paare steht in der Tabelle zweimal derselbe Typ (Nr. 80 und 82). Nimm Nr. 80 und kläre das Duplikat.');
    if (NOTE[c.nr] && !(p.paare === 4 && p.sigOrt === 'innen')) out.warn.push(NOTE[c.nr]);
    return out;
  }

  const api = { FAM, T, BY_NR, NOTE, FUSES, IZ, ORT_NAME, ART_NAME, strom, spannungsfall, empfehleStrom, empfehleSignal };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KH = api;
})(this);
