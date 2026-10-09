/**
 * Illustration : une facture d'électricité type, générique (sans fournisseur réel), avec ses zones numérotées.
 * Les montants sont fictifs (un mois de l'école, prix du cours) : ils ne correspondent à aucune vraie facture.
 */
const t = (x, y, s, a = "") => `<text x="${x}" y="${y}" font-family="var(--f-body)" font-size="10.5" ${/fill=/.test(a) ? "" : 'fill="#1c2440"'} ${a}>${s}</text>`;
const m = (x, y, s, a = "") => `<text x="${x}" y="${y}" font-family="var(--f-mono)" font-size="10" ${/fill=/.test(a) ? "" : 'fill="#1c2440"'} ${a}>${s}</text>`;
const repere = (x, y, n) =>
  `<circle cx="${x}" cy="${y}" r="9" fill="var(--energie)"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-family="var(--f-display)" font-weight="800" font-size="11" fill="var(--on-energie)">${n}</text>`;
const ligne = (y, a, b) => `${t(46, y, a)}${m(330, y, b, 'text-anchor="end"')}`;

export default () => `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration : une facture d'électricité type. 1, en haut, le titulaire et le numéro PDL du point de livraison. 2, la période facturée et le type de relevé, réel ou estimé. 3, la consommation, calculée à partir de deux index. 4, les lignes du prix : fourniture, abonnement, acheminement. 5, les taxes : accise, CTA et TVA. 6, le total à payer, toutes taxes comprises.">
  <rect x="30" y="10" width="320" height="282" rx="6" fill="#ffffff" stroke="#1c2440" stroke-width="1.5"/>
  <rect x="30" y="10" width="320" height="34" rx="6" fill="#e3ebf7"/>
  ${t(46, 32, "FACTURE D’ÉLECTRICITÉ · fournisseur", 'font-weight="700"')}
  ${t(46, 62, "Titulaire : Commune · École Jean-Jaurès")}${m(46, 76, "PDL 30001234567890")}
  ${t(46, 98, "Période : du 1er au 28 février")}${m(46, 112, "Relevé réel (pas une estimation)")}
  <line x1="40" y1="122" x2="340" y2="122" stroke="#d6deea"/>
  ${t(46, 140, "Index : 54 355 → 62 917 kWh")}${m(330, 140, "8 562 kWh", 'text-anchor="end" font-weight="700"')}
  <line x1="40" y1="150" x2="340" y2="150" stroke="#d6deea"/>
  ${ligne(168, "Fourniture (prix du kWh)", "1 370 €")}${ligne(184, "Abonnement", "32 €")}${ligne(200, "Acheminement (réseau)", "384 €")}
  <line x1="40" y1="210" x2="340" y2="210" stroke="#d6deea"/>
  ${ligne(228, "Accise sur l’électricité", "226 €")}${ligne(244, "CTA · TVA 20 %", "440 €")}
  <rect x="40" y="256" width="300" height="26" rx="4" fill="#1c2440"/>
  ${t(50, 273, "TOTAL À PAYER (TTC)", 'fill="#ffffff" font-weight="700"')}${m(330, 273, "2 452 €", 'text-anchor="end" fill="#ffffff" font-weight="700" font-size="12"')}
  ${repere(362, 68, 1)}${repere(362, 104, 2)}${repere(362, 140, 3)}${repere(362, 184, 4)}${repere(362, 236, 5)}${repere(362, 269, 6)}
</svg>`;
