/* Wattlings · jeu/monde/barrieres.js
   Barrières de quartier : ce qu'on dit au joueur quand un quartier est encore fermé. */

/* ---- barrières de quartier ---- */
function gateMsg(q){
  if(q===10)return [{t:"Le pont du Nord est barré. Un panneau : « La boucle se refermera quand tu auras les 8 badges. »"}];
  if(q===9)return [{t:"Le pont est barré. Un panneau : « Rive Énergie : réservée aux Energy Managers. » Il te faut le badge Structurer."}];
  const Q=QUARTERS[q],prev=BLAB(BADGES[q-2]);
  return [{t:`Piste barrée. Un panneau : « ${Q.name}, étape ${Q.step}. Ouverture avec le badge ${prev}. »`},{t:"Chaque quartier s'ouvre quand l'arène précédente est gagnée. La carte (touche K) montre où tu en es."}];
}
