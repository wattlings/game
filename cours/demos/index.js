/**
 * Le registre des démos : l'identifiant utilisé dans le contenu (demo: { id }) et la fonction qui l'affiche.
 */
import { demoAgir } from "./agir.js";
import { demoAgregationSite } from "./agregation-site.js";
import { demoAnalyser } from "./analyser.js";
import { demoAnatomieFacture } from "./anatomie-facture.js";
import { demoAutoconso } from "./autoconso.js";
import { demoCadrer } from "./cadrer.js";
import { demoCasIndex } from "./cas-index.js";
import { demoChangementHeure } from "./changement-heure.js";
import { demoCollecter } from "./collecter.js";
import { demoConsentement } from "./consentement.js";
import { demoDecretTertiaire } from "./decret-tertiaire.js";
import { demoDetecter } from "./detecter.js";
import { demoEcartSources } from "./ecart-sources.js";
import { demoFiabiliser } from "./fiabiliser.js";
import { demoHorodatage } from "./horodatage.js";
import { demoIdentifiants } from "./identifiants.js";
import { demoIndicateurs } from "./indicateurs.js";
import { demoMesurer } from "./mesurer.js";
import { demoPerimetre } from "./perimetre.js";
import { demoProfils } from "./profils.js";
import { demoPuissance } from "./puissance.js";
import { demoRattachement } from "./rattachement.js";
import { demoSeuilDetection } from "./seuil-detection.js";
import { demoSignature } from "./signature.js";
import { demoStructurer } from "./structurer.js";
import { demoTroisVoies } from "./trois-voies.js";
import { demoUsages } from "./usages.js";

export const DEMOS = {
  cadrer: demoCadrer,
  collecter: demoCollecter,
  fiabiliser: demoFiabiliser,
  structurer: demoStructurer,
  analyser: demoAnalyser,
  detecter: demoDetecter,
  agir: demoAgir,
  mesurer: demoMesurer,
  perimetre: demoPerimetre,
  usages: demoUsages,
  identifiants: demoIdentifiants,
  consentement: demoConsentement,
  troisVoies: demoTroisVoies,
  casIndex: demoCasIndex,
  anatomieFacture: demoAnatomieFacture,
  changementHeure: demoChangementHeure,
  ecartSources: demoEcartSources,
  horodatage: demoHorodatage,
  agregationSite: demoAgregationSite,
  rattachement: demoRattachement,
  profils: demoProfils,
  signature: demoSignature,
  puissance: demoPuissance,
  seuilDetection: demoSeuilDetection,
  autoconso: demoAutoconso,
  decretTertiaire: demoDecretTertiaire,
  indicateurs: demoIndicateurs,
};
