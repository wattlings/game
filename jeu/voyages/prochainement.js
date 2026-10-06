/* Wattlings · jeu/voyages/prochainement.js
   Les destinations annoncées à la gare, pas encore ouvertes : une affiche dans le hall, une ligne éteinte au tableau des départs,
   une page vide dans le passeport. Quand un site est construit, sa déclaration quitte ce fichier pour son propre dossier
   (voyages/<site>/textes.js), avec ouvert:true. L'ordre des déclarations est celui du tableau des départs. */

voyDeclarer('barrage',{
  nom:'Barrage de Val-Turbine',gare:'Val-Turbine',region:'Alpes',theme:'Hydraulique',ouvert:false,
  accroche:"Un lac, un mur, une chute. La seule batterie de France qui se remplit quand il pleut."});
voyDeclarer('datacenter',{
  nom:'Data center du quai des Octets',gare:'Marseille · quai des Octets',region:'Marseille, le port',theme:'Data center',ouvert:false,
  accroche:"Des milliers de serveurs, un seul objectif : rester au frais. Vos photos de vacances y sont, et elles consomment."});
