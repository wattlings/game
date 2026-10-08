/* Wattlings · jeu/rendu/palettes.js
   Les palettes nommées du jeu. Pour changer une ambiance de couleurs (peaux, vêtements, herbe des saisons, pierre et fleurs des régions…), c'est ici.
   Les dessins (les autres fichiers de rendu/) gardent leurs propres couleurs, écrites sur place : pour retoucher un dessin précis, ouvrir son fichier. */

/* ---- personnages : teints de peau, cheveux, hauts, bas (dans l'ordre proposé par l'écran de l'avatar) ---- */
const SKINS=['#f6d3b3','#f1c7a1','#e0ac7e','#c68a5c','#9a6440','#6b4128'];
/* les teints proposés par l'écran de l'avatar, du plus clair au plus foncé (SKINS garde son ordre : les anciennes sauvegardes y renvoient par numéro) */
const SKIN_CHOIX=['#fbe3d0','#f6d3b3','#f1c7a1','#e8b98f','#e0ac7e','#d19a6a','#c68a5c','#a8714a','#9a6440','#7a4e30','#6b4128','#4a2c1c'];
const HAIRC=['#2b1d14','#5a3a22','#8a5a2b','#d9a441','#b8431f','#9a9aa2','#ece6d6','#3a5fc0','#c94f8a','#141216'];   // à la fin : les anciennes sauvegardes y renvoient par numéro
const TOPS=['#7a8594','#c43d3d','#2f6db5','#2f9e7a','#e2a13a','#8a3b8f','#f7f0dc','#2c2c34','#e57399'];
const BOTS=['#2f3a5c','#333338','#6b4a2b','#6d7896','#8a3b3b','#2f6d34','#c9b28a'];

/* ---- garde-robe de l'avatar : les couleurs proposées pour chaque vêtement ---- */
const CLOTH=['#f7f0dc','#ece6d6','#9a9aa2','#7a8594','#59627c','#2c2c34','#1c2440','#27325a','#2f6db5','#8ec9e8','#2aa198','#2f9e7a','#2f6d34','#f2c12e','#e2a13a','#e2573b','#c43d3d','#8a3b3b','#e57399','#8a3b8f','#6b4a2b','#8a5a2b','#c9b28a'];

/* ---- le garde du carton (clin d'œil) ---- */
const GUARD_PAL={shirt:'#39426a',pants:'#1c2440',hair:'#2b1d14',hat:'#1c2440'};

/* ---- herbe. GSEASON : une ligne par saison (printemps, été, automne, hiver), GSNOW sous la neige ; chaque ligne = trois verts de l'herbe puis les deux couleurs des touffes.
   GCOL (herbe) et GT (touffes) sont les couleurs en cours : la saison les remplace au démarrage ---- */
const GCOL=['#73bf65','#7cc56a','#86cc72'];
const GSEASON=[['#7ccb68','#84d06f','#8fd67a','#5aad52','#a8e694'],['#73bf65','#7cc56a','#86cc72','#58a551','#9bdc88'],['#93b862','#9cbd66','#a8c56f','#7a9c4c','#c4d88a'],['#86aa74','#8eb07a','#98b884','#6c9160','#b2caa0']],
  GSNOW=['#e3eaf1','#eef3f8','#f8fbfd','#cdd9e5','#ffffff'];
const GT=['#58a551','#9bdc88'];

/* ---- feuilles mortes et rideaux des fenêtres ---- */
const LEAFC=['#d9903a','#b8642a','#e2c14a','#8a5a2b','#c9742f'];
const CURT=['#e2573b','#f2c12e','#8a3b8f','#2f9e7a','#e9679a','#4a78c9','#f7f0dc'];

/* ---- régions : teinte de l'herbe (couleur, dosage), pierre des murets, fleurs, allées, crépis d'Alsace et ocres de Provence ---- */
const REG_GRASS={auvergne:['#4f9a58',.24],nord:['#8fb47c',.22],normandie:['#45b84a',.3],alsace:['#86d46c',.14],bourgogne:['#a9c85c',.22],bretagne:['#38a468',.3],provence:['#d6c56c',.46],savoie:['#6fdc8c',.26]};
const REG_STONE={auvergne:['#5a5a64','#66666f','#4d4d56','#74747d','#8e8e96','#33333a'],nord:['#a4472f','#b3543a','#93402a','#bd6248','#e6ddd0','#5f2a1c'],bourgogne:['#d9c9a0','#e4d6b0','#cbb98c','#eee2c0','#f6eed6','#8a7a54'],
  bretagne:['#9a968c','#aaa69c','#8a867c','#b8b4a8','#d5d1c6','#55524a'],provence:['#d2a56c','#deb47c','#c2955c','#e8c490','#f2d8ac','#7a5a30'],savoie:['#a8a395','#b9b4a6','#9a9588','#c4bfb0','#dcd8cc','#5f5b51']};
const STONE0=['#a8a395','#b9b4a6','#9a9588','#c4bfb0','#dcd8cc','#5f5b51'];
const REG_FLOWERS={auvergne:['#f2c12e','#f7e36b','#f2a33a'],nord:['#e2483b','#e2483b','#f7d84a'],normandie:['#ffffff','#f7d84a','#ffffff'],alsace:['#e2483b','#e9679a','#ffffff'],bretagne:['#f2c12e','#a56ad6','#e9679a'],savoie:['#3f6fe0','#ffffff','#3f6fe0']};
const REG_PATH={auvergne:['#c08a70','#a8765e','#8f6450','#d6a48a'],nord:['#b9b6ad','#a3a097','#8a877f','#cfccc4'],alsace:['#dcb0a0','#c89a8a','#b08272','#ecc8ba'],bourgogne:['#ece2c4','#d6caa6','#bfb38e','#f8f2dc'],
  bretagne:['#dcd9cf','#c4c1b6','#aaa79c','#eeebe2'],provence:['#e2b676','#cfa062','#b98a50','#f0cc94'],savoie:['#cbbfa8','#b3a78f','#9a8e78','#ddd3bf']};
const ALS_COL=['#f0d27a','#e9a0a8','#9cc3dd','#b5d6a0','#e8b48a'],OCRES=['#e6bc84','#dba06a','#efd0a0','#e2ac7e'];

/* ---- vaches (robe, taches, tête) ---- */
const COWS=[{b:'#8a3b22',p:null,h:'#7a3018',horn:1},{b:'#f4f1e8',p:'#7a4a2a',h:'#7a4a2a'},{b:'#f1ead8',p:null,h:'#e6dcc6'},{b:'#9a4a2a',p:'#f4f1e8',h:'#f4f1e8',bell:1}];

/* ---- couleurs des obstacles dans les arènes ---- */
const A_COLS=['#c0503a','#4a78c9','#8a3b8f','#f2a33a','#2aa198','#7a8594'];

/* ---- graphiques du tableau de bord du patrimoine dans le jeu (e : électricité, g : gaz…) ---- */
const GC={e:'#00968a',g:'#d4502f',over:'#c2410c',under:'#1a73c9',bar:'#3a4a7a',ink:'#1c2440',muted:'#5b6380',warn:'#a35d00',good:'#2f7d46'};
