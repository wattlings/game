/* Wattlings · jeu/voyages/prochainement.js
   Les destinations annoncées à la gare, pas encore ouvertes : une affiche dans le hall, une ligne éteinte au tableau des départs,
   une page vide dans le passeport. Quand un site est construit, sa déclaration quitte ce fichier pour son propre dossier
   (voyages/<site>/textes.js), avec ouvert:true. L'ordre des déclarations est celui du tableau des départs. */

/* Les cinq destinations prévues sont ouvertes : il n'y a plus rien à annoncer ici.
   Pour annoncer une future ligne (affiche dans le hall, ligne éteinte au tableau des départs, page vide dans le passeport) :

   voyDeclarer('geothermie',{nom:'…',gare:'…',region:'…',theme:'…',ouvert:false,accroche:"…"});

   Avec pays:[longitude, latitude] et rail:[[longitude, latitude]…], la ligne apparaît aussi, en gris, sur la carte du pays (touche K, puis dézoomer). */
