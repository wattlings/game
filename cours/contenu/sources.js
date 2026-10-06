/**
 * Les sources du cours.
 *
 * Le registre de toutes les références est dans commun/donnees/sources.js ; un texte du cours cite une source avec [[cle]].
 * Ici :
 *  - SOURCES_DEMOS : les sources de chaque démo (ses textes sont écrits dans son fichier, la liste s'affiche sous la démo) ;
 *  - sourcesData et sourcesEnergie : les anciennes listes de liens en bas du niveau « Approfondir », gardées pour les étapes
 *    qui ne sont pas encore référencées information par information (l'étape 2 l'est : elle n'utilise plus sourcesData).
 */

/** Pour chaque démo (son identifiant dans demos/index.js) : les clés des sources de ce qu'elle affirme. */
export const SOURCES_DEMOS = {
  collecter: ["enedis-nmo-cf-015e", "enedis-guide-flux-r6x", "grdf-adict-faq", "mne-coefficient-conversion", "mne-elements-facture", "ministere-guide-fiscalite-2026"],
  consentement: ["enedis-nmo-cf-015e", "enedis-contrat-data-connect"],
  casIndex: ["enedis-turpe7-brochure"],
  anatomieFacture: ["ministere-guide-fiscalite-2026", "enedis-turpe7-brochure", "cnieg-cta-note", "mne-elements-facture", "mne-prix-pro", "enedis-facturation-acheminement", "cre-atrd7", "minefi-tva"],
};

export const sourcesData = {
  type: "sources",
  date: "septembre 2026",
  liens: [
    {
      t: "EDF Entreprises : taxes et contributions électricité et gaz 2026",
      url: "https://www.edf.fr/entreprises/decryptages/normes-et-reglementations/taxes-et-contributions-electricite-des-entreprises-evolutions-2026",
    },
    {
      t: "EDF Entreprises : le TURPE évolue au 1er août 2026",
      url: "https://www.edf.fr/entreprises/decryptages/normes-et-reglementations/le-turpe-evolue-au-1er-aout-2026",
    },
    {
      t: "CTA électricité et gaz : taux 2026",
      url: "https://www.fournisseurs-electricite.com/contrat-electricite-gaz/taxes/cta",
    },
    {
      t: "Accise sur le gaz naturel 2026",
      url: "https://www.fournisseurs-electricite.com/contrat-electricite-gaz/taxes/accise-gaz",
    },
    {
      t: "API GRDF ADICT (data.gouv.fr)",
      url: "https://www.data.gouv.fr/dataservices/api-grdf-adict",
    },
    {
      t: "Consometers : retour d’expérience Enedis Data Connect",
      url: "https://github.com/consometers/data-connect",
    },
    {
      t: "Consometers : retour d’expérience Enedis SGE Tiers",
      url: "https://github.com/consometers/sge-tiers",
    },
    {
      t: "Bascule Enedis Data Connect du 28/09/2026 (projet open source)",
      url: "https://github.com/c-fevre/homey.enedis.connect.proxy/pull/1",
    },
  ],
};

export const sourcesEnergie = {
  type: "sources",
  date: "septembre 2026",
  liens: [
    {
      t: "Veolia : décret tertiaire 2026, obligations et OPERAT",
      url: "https://www.industries.veolia.com/fr/expertises/energie-travaux-defficacite/reglementations/decret-tertiaire-2026-obligations-operat",
    },
    {
      t: "Hellio : quelle année de référence pour le décret tertiaire ?",
      url: "https://www.hellio.com/actualites/reglementation/annee-reference-decret-tertiaire",
    },
    {
      t: "Lowit : guide de la déclaration OPERAT 2026",
      url: "https://www.lowit.fr/guide-declaration-operat-2026/",
    },
    {
      t: "Ministère de la Transition écologique : la norme NF ISO 50001",
      url: "https://www.ecologie.gouv.fr/politiques-publiques/lamelioration-performance-energetique-norme-nf-iso-50001",
    },
    {
      t: "EN ISO 50001:2018/A1:2024 (amendement changement climatique)",
      url: "https://standards.iteh.ai/catalog/standards/cen/a1b0e0ec-f97c-4aba-8284-9e4600ca9b96/en-iso-50001-2018-a1-2024",
    },
    {
      t: "Selectra : émissions de CO2 par source d’énergie (Base Empreinte ADEME)",
      url: "https://climate.selectra.com/fr/empreinte-carbone/energie",
    },
  ],
};
