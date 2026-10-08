/* Wattlings · jeu/moteur/cibles.js
   Les cibles : où pointe la flèche d'objectif. Une seule à la fois : celle de la prochaine action (recit/objectifs.js).
   Quand elle est hors de l'écran, la flèche se pose au bord, dans sa direction (moteur/boucle.js). */

function targets(){
  if(MAPS[S.map].cibles){   // cartes de voyage : une seule flèche, vers l'info clé la plus proche
    const T=MAPS[S.map].cibles(),d=([x,y])=>Math.abs(x-P.x)+Math.abs(y-P.y);
    return T.length>1?[T.slice().sort((a,b)=>d(a)-d(b))[0]]:T}
  const a=prochaineAction(),c=a.cible&&a.cible();
  return c?[c]:[];
}
