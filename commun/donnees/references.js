/**
 * Prix, taxes et facteurs d'émission utilisés dans les calculs.
 * À actualiser chaque année : la note NOTE_TARIFS indique la date de vérification.
 */
export const NOTE_TARIFS =
  "Taxes vérifiées en septembre 2026 (accise au 1er août 2026, CTA au 1er février 2026) ; prix de fourniture et d’acheminement fictifs";

export const TARIF_ELEC = {
  puissanceSouscriteKva: 60,
  cosPhi: 0.93,
  abonnementMois: 18,
  fourniture: {
    HPH: 0.168,
    HCH: 0.124,
    HPB: 0.112,
    HCB: 0.084,
  },
  turpeFixeMois: 32,
  turpePuissanceKvaAn: 13.5,
  turpeEnergie: {
    HPH: 0.052,
    HCH: 0.034,
    HPB: 0.021,
    HCB: 0.014,
  },
  penaliteDepassement: 12.4,
  acciseMWh: 26.35,
  ctaTaux: 0.15,
  tva: 0.2,
};

export const TARIF_GAZ = {
  abonnementMois: 22,
  fournitureKwh: 0.056,
  distributionFixeMois: 34,
  distributionKwh: 0.0118,
  transportKwh: 0.0042,
  acciseKwh: 0.01666,
  ctaTaux: 0.208,
  tva: 0.2,
};

export const FACTEURS_CO2 = {
  elec: 0.052,
  gaz: 0.2043,
};

export const PRIX_EVITE = {
  elec: 0.16 + TARIF_ELEC.acciseMWh / 1000,
};

export const PRIX_KWH_ELEC = 0.16 + TARIF_ELEC.acciseMWh / 1000;

export const PRIX_KWH_GAZ =
  TARIF_GAZ.fournitureKwh + TARIF_GAZ.distributionKwh + TARIF_GAZ.transportKwh + TARIF_GAZ.acciseKwh;
