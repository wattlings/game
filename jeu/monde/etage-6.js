/* Wattlings · jeu/monde/etage-6.js
   Le 6e étage du bâtiment « Bureau » : 73 cases sur 42, d'après le plan fourni. 55 places.
   On arrive par les ascenseurs dans le sas (parties communes) ; au bout du couloir, les portes coulissantes et le badge.
   (Moteur commun et légende des plans : monde/etage.js ; dessin : rendu/etage.js.) */
etageDeclarer('etage6',{num:6,resume:"Le Bidouillab (les capteurs), l'Amphi Watt, la Vitrine.",
  plan:[
'WWwwwWWwwwWWWwwwWWwwwWWwwwWWwwwWWwwwWWWWWWWWWWWWWwwwWWwwwWWwwwWWWxxxxxxxx',
'wooooooooooWooooooooooooooooooooooooooWooooooooWooooooooooooooooWxxxxxxxx',
'wooooooooooWooooooooooooooooooooooooooWooooooooWoooooooooooooooowxxxxxxxx',
'WooooooooooWooooooooooooooooooooooooooWooooooooWoooooooooooooooowxxxxxxxx',
'WooooooooooWooooooooooooooooooooooooooWooooooooWooooooooooooooooWxxxxxxxx',
'WooooooooooWooooooooooooooooooooooooooWooooooooWooooooooooooooooWxxxxxxxx',
'WooooooooooWooooooooooooooooooooooooooWooooooooWoooooooooooooooowxxxxxxxx',
'wooooooooooWooooooooooooooooooooooooooWooooooooWoooooooooooooooowxxxxxxxx',
'woooooooooodooooooooooooooooooooooooooWooooooooWooooooooooooooooWxxxxxxxx',
'WWWWWWWWWWWWooooooooooooooooooooooooooWWWWWWWWdWooooooooooooooooWWWWWWWWW',
'WoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooWrrrrrrrW',
'WooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooohrrrrrrrW',
'BBBBBBBdWWWWWWWWWWWWBBBBBBoooWWWWWWccWWWWWWWWWWoooooooWWWWWWWWWWWrrrrrrrW',
'BBBBBBBoorrrrrrrrrroBBBBBBoooWccccWccWcccWooooWoooooooWoooooooooWrrrrrrrW',
'BPPBPPBoorrrrrrrrrroBBBBBBoooWccccWccWcccWooooWWWWWWooWooooooooowrrrrrrrW',
'WoooooWooWWWWWWWWWWoBBBBBBoooWccccWccWcccWooooWooooWooWooooooooowrrrrrrrW',
'WoooooWoorrrrrrrrrroBBPPBBoooWccccdccdcccWooooWooooWooWoooooooooWrrrrrrrW',
'WoooooWoorrrrrrrrrroBBooBBoooWWWWWWdWWWWWWooooWooooWooWoooooooooWrrrrrrrW',
'WoooooWWWWWWWWWWWWWWBBooBBoooWccccccWccccWooooWooooWoooooooooooowrrrrrrrW',
'WoooooooooooooooooooBBooBBoooWccccccWccccWooooWooooWoooooooooooowrrrrrrrW',
'WoooooooooooooooooooBBooBBoooWccccccWccccWooooWoooodooooooooooooWrrrrrrrW',
'WoooooooooooooooooooBBooBBoooWccccccWccccWooooWooooWooWWWWWWWWWWWWWWWWWWW',
'WWWWWWWWWgggWWWWWWWWBBooBBoooWWWWWWWWWdWWWWWhWWWWWWWoodoooooooooWxxxxxxxx',
'WoooooooooooooooooooooooooooooooooooooooooooooooooooooWooooooooowxxxxxxxx',
'WooooooooooooooooooooooooooWWWWdWdWWWWWWooooooooooooooWooooooooowxxxxxxxx',
'WWWWWWWWWWWWWWWWWWWWWooooooWooooWooooooWooooooooooooooWoooooooooWxxxxxxxx',
'xxxxxxWooooooooooooWWWWWoooWooooWooooooWooooooooooooooWWWWWWWWWWWxxxxxxxx',
'xxxxxxwoooooooooooooooWWoooWooooWooooooWooooooooooooooooooooooooWxxxxxxxx',
'xxxxxxwooooooooooooooooooooWooooWooooooWoooooooooooooooooooooooowxxxxxxxx',
'xxxxxxWooooooooooooooooooooWooooWooooooWoooooooooooooooooooooooowxxxxxxxx',
'xxxxxxWoooooooooooooooWWdWWWWWWWWWWWWWWWooooooooooooooooooooooooWxxxxxxxx',
'xxxxxxwoooooooooooooooWoooooooooWooooooWoooooooooooooooooooooooowxxxxxxxx',
'xxxxxxwoooooooooooooooWoooooooooWoooooodoooooooooooooooooooooooowxxxxxxxx',
'xxxxxxWooooooooooooooWWoooooooooWooooooWooooooooooooooooooooooooWxxxxxxxx',
'xxxxxxWWwwwWWWWWoooooWWoooooooooWooooooWWWwwwWWwwwWWwwwWWwwwWwwWWxxxxxxxx',
'xxxxxxxxxxxxxxxWWWWooWWoooooooooWooooooWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
'xxxxxxxxxxxxxxxxxxWWWWWoooooooooWoooooWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
'xxxxxxxxxxxxxxxxxxxxxxWWWWooooooWoooooWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
'xxxxxxxxxxxxxxxxxxxxxxxxxWWWWWooWoooooWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxWWWWooooWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxWWWWWWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxWWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'],
  meubles(){
    const {M,m,poste,ilot,seul,chaises}=etageAtelier();
    // ---- espaces de bureaux (50 postes)
    ilot(14,3,7,[3,5,7]);ilot(21,3,7,[3,5,7]);ilot(29,3,7,[3,5,7]);                // nord
    ilot(52,3,5,[3,5]);ilot(58,3,5,[3,5]);m('table',58,8,{w:4,h:3,bois:1});poste(57,9,'right');poste(62,9,'left');   // nord-est
    [42,48].forEach(x=>{m('table',x,28,{w:4,h:6,bois:1});[30,32].forEach(y=>{poste(x-1,y,'right');poste(x+4,y,'left')});poste(x+1,27,'down')});   // sud-est
    m('table',56,29,{w:6,h:4,bois:1});[57,60].forEach(x=>{poste(x,28,'down');poste(x,33,'up')});
    m('table',9,28,{w:4,h:6,bois:1});[29,32].forEach(y=>{poste(8,y,'right');poste(13,y,'left')});   // sud-ouest
    m('ilotBiais',16,28,{cx:18.2,cy:30.3,ang:18.4,w:5,h:4});                                          // l'îlot posé en biais : 4 postes
    // ---- le Bidouillab : le labo du bureau d'étude, où l'on teste les capteurs IoT (consommation, température) ; 5 tabourets
    m('etabli',39,2,{w:2,h:5});m('etabli',41,7,{w:5,h:2});
    chaises([[41,2],[41,4],[41,6]],'left','tabouret');chaises([[43,6],[45,6]],'down','tabouret');
    m('panneauCapteurs',42,1,{w:3});m('fournitures',45,1,{w:2});
    // ---- salles de réunion
    m('table',3,3,{w:5,h:4});chaises([[4,2],[6,2]],'down');chaises([[4,7],[6,7]],'up');chaises([[8,4],[8,5]],'left');m('ecran',0,4,{h:2,mur:'w'});   // Grand Circuit
    m('table',29,26,{w:2,h:2});chaises([[28,26],[28,27]],'right');chaises([[29,25],[30,25]],'down');m('ecran',29,30,{w:2,mur:'s'});   // Court Circuit
    m('table',57,23,{w:4,h:2});chaises([[58,22],[59,22]],'down');chaises([[56,23]],'right');chaises([[61,23]],'left');m('ecran',57,26,{w:4,mur:'s'});   // Fusible
    // l'Amphi Watt (l'agora) : des gradins blancs avec des coussins, face à un très grand écran au mur sud
    m('gradins',55,13,{w:9,h:3});m('ecran',56,21,{w:7,mur:'s'});
    // la Vitrine (le showroom) : fauteuils et poufs, écran à l'est
    chaises([[25,32],[25,34],[26,36]],'right','verte');m('tbasse',27,33);m('pouf',28,32,{col:'#e2573b'});m('pouf',28,35,{col:'#f2c12e'});m('pouf',30,34,{col:'#3f9a62'});m('ecran',32,32,{h:2,mur:'e'});
    // ---- reprographie, local CSE, casiers
    m('imprimante',34,25,{w:2});m('fournitures',37,25,{w:2});
    seul(35,31,'down');chaises([[34,34],[36,34]],'up');m('fournitures',33,31);m('affichage',36,30,{w:2});
    m('casiers',47,15,{w:4,d:'down'});m('casiers',47,21,{w:3,d:'up'});
    // ---- sanitaires : hommes (ouest), femmes (sud), PMR (est), douche
    m('cabine',30,13,{w:2,h:2,porte:'s'});m('urinoir',33,13);m('lavabos',30,16,{w:2,mur:'s',n:2,savon:0});
    m('cabine',30,18,{w:2,h:2,porte:'s'});m('cabine',32,18,{w:2,h:2,porte:'s'});m('lavabos',31,21,{w:2,mur:'s',n:2,savon:0});
    m('pmr',39,13);m('lavabos',40,16,{w:1,mur:'s',n:1,savon:0});
    m('douche',39,18,{w:2,h:2});m('banc',37,18,{h:2});
    return M;
  },
  salles:[[1,1,10,8],[12,1,37,9],[39,1,46,8],[48,1,63,11],[1,13,19,21],[28,25,31,29],[33,25,38,29],[33,31,38,40],[22,31,31,40],[7,26,21,33],[40,27,63,33],[55,22,63,25],[55,13,63,20],[47,15,50,21],[42,13,45,21]],
  plaques:[['GRAND CIRCUIT',1,9],['LE BIDOUILLAB',38,9],['COURT CIRCUIT',27,24],['REPRO',34,24],['LA VITRINE',25,30],['CSE',39,31],['FUSIBLE',55,26],['AMPHI WATT',56,12],
    ['WC H',30,12],['PMR',38,12],['WC F',30,22],['DOUCHE',39,22],['SERVEUR',42,22],['CASIERS',47,22]],
  // la façade sud en biais (trois fenêtres), le mur est du local CSE, le mur ouest de la Vitrine, le mur nord de l'espace sud-ouest
  biais:[{a:[12.5,34.4],b:[37.4,41.4],fen:[[.08,.3],[.45,.68],[.8,.93]]},{a:[39.7,34.4],b:[37.4,41.4]},{a:[22.8,30.6],b:[21.5,36.9]},{a:[17.5,25.3],b:[23.5,27.2]}],
  dehors:[[[12.5,34.6],[37.4,41.7],[37.4,42.5],[6,42.5],[6,34.6]],[[39.9,34.6],[73,34.6],[73,42.5],[37.4,42.5],[37.6,41.4]]],
  arrivee:[3,16],ascenseurs:[[1,14],[2,14],[4,14],[5,14]],service:[[22,16],[23,16]],
  sas:{portes:[9,11,22],lecteur:[12,22]},
  fermes:{'44,22':["Local serveur. Fermé à clé.","Derrière la porte, des ventilateurs soufflent fort. Les serveurs chauffent le local toute l'année : en hiver, c'est la pièce la plus convoitée de l'étage."],
    '64,11':["Issue de secours : l'escalier extérieur. La porte ne s'ouvre qu'en cas d'alarme.","Par la vitre, on voit l'escalier métallique descendre six étages. Le vent y fait des courants d'air gratuits, et sans compteur."]},
  escalier:x=>x>=65?["L'escalier de secours extérieur, en métal. Six étages à pied, par tous les temps."]:["Escalier de secours. Il ne sert qu'en cas d'alarme.","Au 6e, ceux qui le prennent pour garder la forme arrivent en haut avec une courbe de charge cardiaque très instructive."],
  objets(o,dire){
    // les établis du Bidouillab : les capteurs en test
    const labo=dire(["Les établis du Bidouillab : un sous-compteur électrique, une sonde de température, une pince ampèremétrique, et des petits boîtiers qui clignotent.",
      "Ici, le bureau d'étude teste les capteurs IoT avant de les poser dans les bâtiments. Un capteur qui ment, c'est une donnée fausse dans l'EMS : mieux vaut le démasquer sur l'établi que dans un rapport."]);
    for(let y=2;y<=6;y++)for(const x of [39,40])o.push({x,y,kind:'none',solid:1,act:labo});
    for(let x=41;x<=45;x++)for(const y of [7,8])o.push({x,y,kind:'none',solid:1,act:labo});
  }
});
