/* Wattlings · jeu/moteur/cibles.js
   Les cibles : où pointe la flèche d'objectif. Une seule à la fois : celle de la prochaine action (recit/objectifs.js).
   Quand elle est hors de l'écran, la flèche se pose au bord, dans sa direction (moteur/boucle.js). */

function targets(){
  if(MAPS[S.map].cibles)return MAPS[S.map].cibles();   // cartes de voyage
  const a=prochaineAction(),c=a.cible&&a.cible();
  return c?[c]:[];
}
