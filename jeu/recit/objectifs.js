/* Wattlings · jeu/recit/objectifs.js
   Le texte de l'objectif affiché sous l'écran, chapitre par chapitre. */

function objectiveText(){
  const mr=missingReq();if(mr.length&&[1,2,3,4,5,6,7,8,9,10].includes(S.ch))return `Trouve ${mr.length} info${mr.length>1?'s':''} clé${mr.length>1?'s':''} (suis les flèches) : ${mr.map(f=>SRC[f.src].where).join(' ; ')}. `+objectiveText0();
  return objectiveText0();
}
function objectiveText0(){
  const s=site(),d=Object.keys(S.derives).length,A=ARENAS.find(a=>ARENA_CH[a.id]===S.ch),cur=curArena();
  const go=a=>cur===a?`${a.name} : bats les dresseurs (${[0,1,2].filter(k=>trBeaten(a,k)).length}/3), puis ${a.champ} sur l'estrade.`:`Va à l'${a.name}, ${qAu(a.id)} : 3 dresseurs, puis ${a.champ}. La carte (touche K) montre le chemin.`;
  if(S.ch===0)return "Parle à Mme Joule, dans ton bureau, place de la Donnée.";
  if(S.ch===1)return `Explore l'extérieur ${enDe(s)} : trouve l'adresse (boîte aux lettres) et la surface (fiche technique).`;
  if(S.ch===2&&!(S.flags.elec&&S.flags.gas))return `Entre dans ${s.short} et trouve les compteurs : l'électrique dans un mur, le gaz à la cave.`;
  if(S.ch===5&&!S.flags.arch)return "Récupère l'inventaire de tes données dans l'armoire à archives du bureau.";
  if(S.ch===7&&d<4)return `Ronde de nuit dans ${s.short} : trouve les 4 dérives (${d}/4).`;
  if(A)return go(A);
  if(S.ch===10)return `Hôtel de ville, place de l'Énergie (de l'autre côté du Grand pont) : analyse les 20 sites sur le PC patrimoine (${Math.min(6,S.pm||0)}/6 missions).`;
  if(S.ch>=11&&S.site){const p=enPct();if(p<.4)return `Fais baisser la consommation du parc de 40 % : ton tableau de bord Énergie s'ouvre d'un clic sur le compteur de kWh. Tu en es à −${(p*100).toFixed(1).replace('.',',')} %.`;return "Objectif atteint : −40 % sur le parc ! Tu peux rejouer avec un autre site depuis le menu."}
  return "Quête terminée ! Rejoue avec un autre site depuis le menu.";
}
