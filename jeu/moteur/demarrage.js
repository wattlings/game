/* Wattlings · jeu/moteur/demarrage.js
   Démarrage de la page : ce fichier est chargé en dernier, une fois tout le reste en place.
   Il dessine la ville, lance la boucle de jeu, affiche l'écran titre, puis regarde ce que demande l'adresse de la page. */

skyUpdate(true);rebuildMaps();hud();qkRAF(loop);titleScreen();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{});
$('sndBtn').onclick=()=>setSound(!AUD.on);sndUI();
/* tout est chargé : que demande l'adresse de la page ? (jeu/#chapitre-3, jeu/#reprendre…) */
qkTimeout(qkRoute,0);
