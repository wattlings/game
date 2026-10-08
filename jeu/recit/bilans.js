/* Wattlings · jeu/recit/bilans.js
   Après chaque badge : la carte « Dans un EMS » (ce que tu viens de faire, ce que fait un EMS à cette étape, pourquoi c'est
   important et l'erreur à éviter), rangée dans le Classeur ; puis l'auto-bilan de l'étape : trois questions de rappel, sans
   pénalité et toujours expliquées, et « Ce que je retiens », une phrase choisie parmi trois. Tout est générique : aucun
   produit réel, et compréhensible par tous les métiers.

   Pour changer un texte : BILANS[n] (n = numéro de l'étape et de l'arène). q : [question, [[réponse, juste, explication], …]] ;
   retiens : trois phrases, la juste en premier (elles sont mélangées à l'affichage). */

const BILANS={
  1:{fait:"Tu as créé ton site dans l'outil en recopiant ton carnet, tracé son périmètre et choisi un objectif.",
    ems:"Il tient le référentiel du patrimoine : sites, bâtiments, surfaces, activités, points de comptage, et l'objectif de chacun.",
    pourquoi:"Tout le reste se calcule dessus : un ratio, une comparaison entre sites, une obligation réglementaire.",
    erreur:"Une surface fausse ou un périmètre flou. Tous les kWh/m² sont faux, et personne ne le voit.",
    q:[["Le logement de fonction a son propre compteur et son propre contrat. Il entre dans le périmètre du site ?",[["Non : ce qui a son propre compteur n'est pas dans ton site",1,"Le périmètre suit les compteurs, pas les murs."],["Oui : il est dans la même enceinte",0,"Même enceinte, autre compteur, autre contrat : il fausserait tes kWh/m²."],["Oui, mais seulement l'hiver",0,"Un périmètre ne change pas avec les saisons."]]],
      ["Pourquoi l'EMS a-t-il besoin de l'adresse exacte du site ?",[["Pour trouver la station météo, et corriger la consommation du froid",1,"L'adresse donne les DJU du lieu : sans eux, impossible de comparer deux hivers."],["Pour envoyer les factures",0,"Le fournisseur s'en charge. L'EMS, lui, s'en sert pour la météo."],["Pour fixer le prix du kWh",0,"Le prix dépend du contrat, pas de la rue."]]],
      ["L'objectif (facture, décret tertiaire, CO₂) se choisit…",[["Avant de mesurer : il décide de l'indicateur qu'on suivra",1,"Choisi après coup, on choisit celui qui arrange."],["Après les premiers résultats, pour choisir le plus flatteur",0,"C'est exactement ce qu'il faut éviter."],["Jamais : on suit tout, tout le temps",0,"Tout suivre, c'est ne rien regarder."]]]],
    retiens:["Cadrer, c'est décider quoi suivre, où et pourquoi, avant de mesurer quoi que ce soit.","Cadrer, c'est poser le plus de compteurs possible.","Cadrer, c'est remplir la fiche du site une fois pour toutes."]},
  2:{fait:"Tu as raccordé tes deux points avec le consentement du titulaire, puis comparé la courbe, l'index et la facture.",
    ems:"Il collecte automatiquement les données des distributeurs et des fournisseurs, point par point, tant que le consentement est valide.",
    pourquoi:"Sans collecte continue, on pilote à l'aveugle, une facture par mois, avec un mois de retard.",
    erreur:"Oublier la date de fin du consentement : la collecte s'arrête en silence, et l'historique a un trou.",
    q:[["Qui doit consentir pour que la collecte démarre ?",[["Le titulaire du contrat du site",1,"C'est son point, ce sont ses données."],["Le fournisseur d'énergie",0,"Il vend l'énergie ; il ne consent pas à la place du client."],["Le distributeur",0,"Il reçoit le consentement, il ne le donne pas."]]],
      ["Quelle source te dit à quelle heure le site démarre le matin ?",[["La courbe de charge",1,"Seule la courbe voit les heures."],["L'index",0,"L'index est un total, comme un compteur kilométrique."],["La facture",0,"Un montant par mois ne connaît pas les heures."]]],
      ["L'index et la courbe ne donnent pas la même énergie sur la semaine. C'est…",[["Une alerte : l'une des deux sources a un problème",1,"Deux sources qui se contrôlent : un écart est un signal, pas un détail."],["Normal, on prend la plus basse",0,"La plus basse n'est pas la plus juste."],["Sans importance, seule la facture compte",0,"La facture chiffre ; elle ne contrôle pas la mesure."]]]],
    retiens:["La donnée arrive par trois canaux (courbe, index, facture), avec un consentement limité dans le temps.","La facture suffit pour piloter un bâtiment.","Le distributeur envoie les données sans rien demander."]},
  3:{fait:"Tu as traqué trous, doublons, pics et valeurs figées, et choisi leur traitement sans jamais effacer la donnée brute.",
    ems:"Des contrôles de qualité signalent et marquent les valeurs (brute, corrigée, estimée, rejetée) ; une personne valide les traitements.",
    pourquoi:"Une alerte, un bilan ou une économie calculés sur des données fausses sont faux, et coûtent la confiance de tous.",
    erreur:"Corriger en silence, ou mettre 0 dans un trou : on invente une économie.",
    q:[["Six heures sans aucune mesure. Le bon traitement ?",[["Estimer le créneau et marquer les valeurs « estimées »",1,"Le trou est comblé, et tout le monde sait que c'est une estimation."],["Mettre 0",0,"Une économie inventée."],["Recopier la veille, sans le dire",0,"Une correction sans trace n'est plus une donnée."]]],
      ["Le midi, la courbe de l'école monte d'un coup. C'est…",[["Normal : la cantine. Une donnée surprenante n'est pas forcément fausse",1,"Avant de corriger, on se demande ce que fait le bâtiment à cette heure-là."],["Un pic à rejeter",0,"Rejeter une vraie consommation, c'est effacer la réalité."],["Un doublon",0,"Un doublon double exactement un créneau, puis disparaît."]]],
      ["Après correction, la valeur d'origine…",[["Est conservée, et la valeur corrigée porte son statut",1,"On peut toujours revenir en arrière, et expliquer."],["Est effacée pour ne pas encombrer",0,"Sans elle, impossible de vérifier ou de corriger une erreur de correction."],["Est remplacée sans laisser de trace",0,"C'est la définition d'une rumeur, pas d'une donnée."]]]],
    retiens:["Une donnée corrigée garde sa trace : on sait toujours d'où elle vient et ce qu'on en a fait.","Une donnée surprenante est forcément fausse.","Le logiciel corrige tout seul, pas besoin de regarder."]},
  4:{fait:"Tu as rangé ton site dans l'arbre site → point → compteur → mesures, et tout mis en kWh par jour.",
    ems:"Il range chaque mesure dans un modèle commun, convertit les unités et agrège les pas de temps.",
    pourquoi:"C'est ce qui permet de comparer des sites, des énergies et des périodes entre eux.",
    erreur:"Additionner des m³ et des kWh, ou compter deux fois un sous-compteur.",
    q:[["Le distributeur remplace le compteur. L'historique…",[["Reste : on ajoute le nouveau compteur sous le même point, avec ses dates",1,"Le point ne change pas ; seul l'appareil change."],["Est perdu, il faut recommencer",0,"Seulement si l'on a rangé le compteur au-dessus du point."],["Passe sur un nouveau site",0,"Le site n'a pas bougé."]]],
      ["Des puissances au pas de 10 minutes. Pour avoir l'énergie de la journée…",[["On les additionne, puis on multiplie par 1/6 d'heure",1,"Énergie = puissance × durée."],["On les additionne",0,"Six fois trop : des kW ne sont pas des kWh."],["On en fait la moyenne",0,"C'est une puissance moyenne, pas une énergie."]]],
      ["Pour additionner le gaz et l'électricité du site…",[["On convertit d'abord le gaz en kWh, avec son coefficient",1,"Même unité d'abord, addition ensuite."],["On additionne les m³ et les kWh",0,"Des litres plus des euros."],["On ne peut jamais les additionner",0,"Si : en kWh, c'est même le but."]]]],
    retiens:["Ranger, c'est rendre comparable : même modèle, même unité, même pas de temps.","Ranger, c'est faire joli pour les graphiques.","Un sous-compteur s'additionne au compteur principal."]},
  5:{fait:"Tu as placé le talon de ton site et tracé sa signature énergétique, puis comparé ta droite à celle de l'EMS.",
    ems:"Il trace courbes, talon, signature et ratios, et compare le site aux sites semblables.",
    pourquoi:"L'analyse dit où part l'énergie, et donc où agir en premier.",
    erreur:"Lire une baisse sans regarder la météo : un hiver doux n'est pas une économie.",
    q:[["Le talon, c'est…",[["Ce que le bâtiment consomme quand il est vide",1,"La nuit, le week-end : ce qui tourne sans personne."],["La pointe de la journée",0,"C'est l'inverse."],["La consommation moyenne",0,"La moyenne mélange le jour et la nuit."]]],
      ["Dans la signature E = a + b × DJU, si la pente b augmente d'une année sur l'autre…",[["Le bâtiment chauffe moins bien : réglage, isolation ou chaudière à regarder",1,"Chaque degré-jour coûte plus cher qu'avant."],["Il a fait plus froid",0,"Le froid, ce sont les DJU ; la pente, c'est le bâtiment."],["La cantine consomme plus",0,"Ça, c'est le talon a."]]],
      ["Ta boulangerie consomme beaucoup plus de kWh/m² qu'un bureau. Conclusion ?",[["Un ratio se lit avec son activité : un fournil n'est pas un bureau",1,"On compare des bâtiments qui font la même chose."],["La boulangerie gaspille",0,"Pas forcément : elle cuit du pain."],["Le ratio est faux",0,"Il est juste ; c'est la comparaison qui ne l'est pas."]]]],
    retiens:["Lire une courbe, c'est séparer ce qui dort (le talon), ce qui travaille et ce qui suit la météo.","Une baisse de consommation est toujours une économie.","Le ratio en kWh/m² suffit pour comparer tous les bâtiments."]},
  6:{fait:"Tu as réglé le seuil et la persistance d'une alerte, pour attraper la dérive sans fausse alerte, et ta ronde l'a confirmée.",
    ems:"Il compare chaque jour à une référence et alerte quand l'écart dépasse un seuil, pendant une durée choisie.",
    pourquoi:"Une dérive vue en deux jours coûte deux jours ; vue sur la facture, elle coûte des mois.",
    erreur:"Régler trop sensible : au bout de la troisième fausse alerte, plus personne ne les lit.",
    q:[["Une alerte se déclenche sur une valeur de 999,9 kW. C'est…",[["Un faux positif dû à la qualité de la donnée",1,"D'où Fiabiliser avant Détecter."],["Une vraie dérive",0,"Physiquement impossible : c'est la donnée qui ment."],["Un faux négatif",0,"Un faux négatif, c'est un vrai problème sans alerte."]]],
      ["Exiger qu'un écart dure deux jours avant d'alerter sert surtout à…",[["Éviter les fausses alertes d'un seul jour",1,"Au prix d'une détection un peu plus lente."],["Détecter plus vite",0,"C'est l'inverse."],["Économiser des kWh",0,"Une alerte n'économise rien : ce qu'on en fait, si."]]],
      ["La référence d'une alerte, c'est…",[["Ce que le site aurait dû consommer, selon la météo et l'occupation",1,"On compare à l'attendu, pas au passé brut."],["La moyenne des quatre dernières semaines",0,"Elle apprend la dérive et finit par la cacher."],["Le même jour l'an dernier",0,"Autre météo, autre calendrier."]]]],
    retiens:["Une bonne alerte compare à une référence, avec un seuil et une durée réglés pour être lue.","Plus il y a d'alertes, mieux on est protégé.","Une alerte économise des kWh à elle seule."]},
  7:{fait:"Tu as réglé l'enjeu propre à ton site, puis composé un plan sous budget en partant des dérives trouvées.",
    ems:"Il tient le plan d'action : chaque action, sa raison, son coût, son gain attendu et son état.",
    pourquoi:"Un plan suivi se finance et se défend ; une liste d'idées s'oublie.",
    erreur:"Commencer par les gros travaux avant la sobriété : isoler un bâtiment qu'on chauffe le week-end.",
    q:[["Dans quel ordre agir ?",[["Sobriété, puis efficacité, puis production",1,"On réduit le besoin, on consomme mieux, puis on produit."],["Production, puis efficacité, puis sobriété",0,"Des panneaux sur un bâtiment qui gaspille, c'est produire pour gaspiller."],["Efficacité d'abord, toujours",0,"La sobriété est souvent gratuite : elle passe avant."]]],
      ["Deux actions de 10 % chacune sur le chauffage font au total…",[["19 %",1,"La seconde s'applique à ce qui reste."],["20 %",0,"Les pourcentages se multiplient."],["10 %",0,"La seconde compte aussi."]]],
      ["Pourquoi noter le gain attendu de chaque action ?",[["Pour le vérifier ensuite, à météo comparable",1,"Un gain attendu est une promesse : la mesure dira si elle est tenue."],["Pour l'afficher sur le site de la mairie",0,"Pas avant de l'avoir prouvé."],["Ça ne sert à rien",0,"Sans gain attendu, rien à vérifier."]]]],
    retiens:["Agir, c'est commencer par la sobriété, chiffrer chaque action, et noter ce qu'on en attend.","Agir, c'est lancer les plus gros travaux en premier.","Une action lancée est une économie acquise."]},
  8:{fait:"Tu as vérifié ton propre plan sur un hiver plus doux, corrigé la météo, conclu, et lu le résultat dans ton indicateur.",
    ems:"Il compare le suivi à une référence ajustée (météo, occupation) et produit les bilans et les déclarations.",
    pourquoi:"Une économie prouvée finance la suivante et répond aux obligations, comme le décret tertiaire.",
    erreur:"Comparer au chiffre brut de l'an dernier : la météo fait le travail, et on s'en attribue le mérite.",
    q:[["L'hiver a été 15 % plus doux et le chauffage a baissé de 15 %. L'action a marché ?",[["On ne sait pas encore : il faut d'abord corriger la météo",1,"Ici, la météo explique toute la baisse."],["Oui, −15 %",0,"L'hiver doux a fait le travail."],["Non",0,"Rien ne le montre non plus."]]],
      ["Pour corriger la météo, on ajuste…",[["Le chauffage, selon les DJU",1,"L'éclairage et les ordinateurs ne savent pas qu'il fait doux."],["Toute la consommation du site",0,"On corrigerait aussi ce qui ne dépend pas du froid."],["Rien, on compare directement",0,"Alors la météo signe à ta place."]]],
      ["Le plan promettait 100, la mesure en trouve 80. Que faire ?",[["Conclure que ça marche, et chercher le grain de sable",1,"Un écart avec le plan se comprend sur place."],["Annoncer 100 quand même",0,"La promesse n'est pas la preuve."],["Tout arrêter, ça n'a pas marché",0,"80 % du gain, c'est un succès à consolider."]]]],
    retiens:["Mesurer, c'est comparer à une référence ajustée, pas au chiffre brut, et aller voir quand l'écart surprend.","Une baisse de facture prouve que l'action a marché.","Une fois prouvée, une économie dure toujours."]}
};
const BILAN_RETIENS_KO="Pas tout à fait : relis les deux autres. Celle-ci est une idée reçue que l'étape vient justement de démonter.";

/* la carte « Dans un EMS » d'une étape, en HTML (aussi dans le Classeur) */
const bilanCarte=n=>{const B=BILANS[n];return B?`<div class="ems-carte"><div class="ems-carte-h">Dans un EMS · ${esc(STEP_NAMES[n]||'')}</div>
  <dl><dt>Ce que tu viens de faire</dt><dd>${esc(B.fait)}</dd><dt>Ce que fait un EMS à cette étape</dt><dd>${esc(B.ems)}</dd><dt>Pourquoi c'est important</dt><dd>${esc(B.pourquoi)}</dd><dt>L'erreur à éviter</dt><dd>${esc(B.erreur)}</dd></dl>
  ${S.retiens&&S.retiens[n]?`<p class="ems-carte-r"><b>Ce que je retiens :</b> ${esc(S.retiens[n])}</p>`:''}</div>`:''};

/* en sortant de l'arène : la carte, puis l'auto-bilan (on peut le passer) */
function bilanArene(A,cb){
  const n=A.id,B=BILANS[n];if(!B)return cb();
  S.bilans=S.bilans||{};
  const carte=(el,next)=>{el.innerHTML=`<h3>Nouvelle carte : Dans un EMS</h3>${bilanCarte(n)}<p class="dnote">Rangée dans ton Classeur. Maintenant, un petit bilan de l'étape : trois questions, aucune pénalité, chaque réponse expliquée.</p><div class="row"><button class="btn" id="blOk">Faire le bilan ▸</button><button class="btn alt" id="blPasse">Passer</button></div>`;
    el.querySelector('#blOk').onclick=next;el.querySelector('#blOk').focus();el.querySelector('#blPasse').onclick=()=>{trk('setting',{k:'bilan',v:n+':passe'});closePanel();cb()}};
  const retiens=(el,next)=>{el.innerHTML=`<h3>Ce que je retiens</h3><p>De l'étape ${esc(STEP_NAMES[n]||'')}, une phrase à garder. Choisis-la.</p><div class="ems-q"></div>`;
    emsChoix(el.querySelector('.ems-q'),B.retiens.map((t,i)=>[t,i===0,BILAN_RETIENS_KO]),o=>{S.retiens=S.retiens||{};S.retiens[n]=o[0];S.bilans[n]=1;save();trk('setting',{k:'bilan',v:n+':fait'});
      el.querySelector('.ems-q').innerHTML=`<div class="fb ok">✔ Rangée sur ta carte « Dans un EMS », et sur ton diplôme.</div>`;gainXP(10);contBtn(el.querySelector('.ems-q'),next)})};
  runSteps('Bilan · '+STEP_NAMES[n],[carte,...B.q.map(([q,opts])=>choice({q,opts})),retiens],cb);
}
