/* Wattlings · jeu/monde/objets.js
   Les objets posés sur chaque carte (qui est où, selon l'avancement) et le mobilier. */

/* ================= OBJETS PAR CARTE ================= */
function objsFor(id){
  const s=site(),o=[];
  if(id==='town'){
    BLD.forEach(b=>{if(!SITES[b.id])return;const d=b.door,sd=SITES[b.id];
      o.push({x:d[0]+2,y:d[1]+1,kind:'mailbox',solid:1,act:()=>actMailbox(b.id)});
      o.push({x:d[0]-2,y:d[1]+1,kind:'panel',solid:1,act:()=>actPanel(b.id)});});
    o.push({x:TP(58,26)[0],y:TP(58,26)[1],kind:'sign',solid:1,act:()=>say([{t:"Ampère-sur-Loire (45) · Zone climatique H1 · Station météo de référence : Orléans-Bricy."},{t:"« Ville cyclable : ici, tout se fait à vélo. Une boucle, huit quartiers, une rivière. La carte (touche K) montre où tu es. »"}])});
    {const K=L.park.gate,rdy=S.ch>=4&&!missingReq(4).length;o.push({x:rdy?K[0]+2:K[0],y:rdy?K[1]-1:K[1],kind:'npc',solid:1,who:'Technicien',glow:FICHES.some(f=>f.src==='tech'&&fAvail(f)&&!fGot(f.id)),pal:{skin:'#c68a5c',shirt:'#2aa198',pants:'#333',hair:'#222',hat:'#e2573b',hatType:'cap',vest:1,prop:'tablet'},dir:'up',act:actTech})}
    o.push({x:SRC.agentEnedis.x,y:SRC.agentEnedis.y,kind:'npc',solid:1,glow:FICHES.some(f=>f.src==='agentEnedis'&&fAvail(f)&&!fGot(f.id)),who:'Agent Enedis',pal:{skin:'#f1c7a1',shirt:'#2f6db5',pants:'#274f8f',overall:'#274f8f',hair:'#a0602a',hat:'#f2c12e',hatType:'helmet',prop:'tablet'},dir:'down',act:srcAct('agentEnedis',()=>say([{w:'Agent Enedis',t:"Je pose et je relève les compteurs électriques : je suis le distributeur. La facture, c'est le fournisseur qui l'envoie. Deux métiers, deux entreprises !"},{w:'Agent Enedis',t:"Au-dessus de 36 kVA, les données passent par le SGE. En dessous, avec un Linky, par Data Connect."}]))});
    o.push({x:TP(85,31)[0],y:TP(85,31)[1],kind:'npc',solid:1,who:'Releveur GRDF',pal:{skin:'#e0ac7e',shirt:'#1c7a9a',pants:'#333',hair:'#333',hat:'#1c6fb3',hatType:'cap',bag:'#6b4a2b',prop:'clipboard'},dir:'left',act:()=>say([{w:'Releveur GRDF',t:"Un compteur gaz mesure un volume, en m³. Pour avoir des kWh, on multiplie par le coefficient de conversion : entre 9 et 12,5 kWh/m³ selon la commune et le mois."}])});
    o.push({x:SRC.retraite.x,y:SRC.retraite.y,kind:'npc',solid:1,glow:FICHES.some(f=>f.src==='retraite'&&fAvail(f)&&!fGot(f.id)),who:'Retraité',pal:{skin:'#f6d3b3',shirt:'#f7f0dc',pants:'#5a3a22',jacket:'#8a6a4a',hair:'#ddd',hat:'#3a3a44',hatType:'beret',glasses:1,prop:'cane'},dir:'left',act:srcAct('retraite',()=>say([{w:'Retraité',t:"De mon temps, on relevait les index à la main. Une fois j'ai lu 404 989 au lieu de 413 989... la consommation était négative !"}]))});
  }
  if(id==='office'){
    o.push({x:2,y:2,kind:'pc',solid:1,act:actPC},{x:1,y:2,kind:'desk',solid:1,act:()=>secret('postit',["Un post-it collé sur le bureau : « Mot de passe du portail Enedis : NE PAS L'ÉCRIRE SUR UN POST-IT ».","Au dos : le mot de passe. Évidemment."])},{x:3,y:2,kind:'desk',solid:1,act:actPC});
    if(S.ch===9&&!missingReq(9).length)o.push({x:8,y:4,kind:'desk',solid:1,act:()=>say([{t:"Un mot sur le bureau de Mme Joule : « Partie à l'Arène de la Preuve. Viens me montrer ce que tu sais. »"}])});
    else o.push({x:8,y:4,kind:'npc',solid:1,who:'Mme Joule',pal:{skin:'#e0ac7e',shirt:'#8a3b8f',pants:'#2f3a5c',hair:'#9a9aa2',style:'carre',bun:1,glasses:1,scarf:'#f2a33a',lash:1,prop:'tablet'},dir:'left',act:actJoule});
    o.push({x:10,y:2,kind:'shelf',solid:1,act:actArchives},{x:9,y:2,kind:'shelf',solid:1,act:actArchives});
    o.push({x:6,y:1,kind:'mapwall',act:()=>say([{t:"Plan d'Ampère-sur-Loire. Trois sites y sont épinglés : l'école Jean-Jaurès, les bureaux Le Carré et la boulangerie du Moulin."}])});
    {const pl=()=>secret('plante',["Une plante verte. Consommation : 0 kWh. Production : de l'oxygène.","Meilleur ratio du bâtiment, et de loin. Elle n'a jamais réclamé la clim, contrairement à la direction."]);o.push({x:1,y:6,kind:'plant',solid:1,act:pl},{x:10,y:7,kind:'plant',solid:1,act:pl})}
  }
  if(id==='rdc'){
    o.push({x:11,y:1,kind:'coffret',act:actElec},{x:2,y:1,kind:'submeter',act:actSub});
    furniture(o);
    if(S.ch===7)o.push({x:13,y:1,kind:'derive',did:'light',act:()=>actDerive('light')},{x:3,y:3,kind:'derive',did:'rdc',solid:1,act:()=>actDerive('rdc')});
  }
  if(id==='mairie'){
    o.push({x:2,y:2,kind:'bigpc',solid:1,act:openDashboard},{x:3,y:2,kind:'bigpc2',solid:1,act:openDashboard},{x:1,y:2,kind:'desk',solid:1,act:openDashboard});
    o.push({x:10,y:4,kind:'npc',solid:1,who:'Maire',pal:{skin:'#f1c7a1',shirt:'#1c2440',pants:'#1c2440',hair:'#9a9aa2',tie:'#c43d3d',sash:1,beard:'#9a9aa2'},dir:'left',act:actMaire});
    o.push({x:8,y:1,kind:'flag',act:()=>say([{t:"Un tableau d'affichage : « Plan pluriannuel d'investissement 2026-2032 ». Il reste une ligne vide, intitulée « Énergie (à compléter) »."}])},{x:1,y:7,kind:'plant',solid:1},{x:12,y:7,kind:'plant',solid:1},{x:12,y:2,kind:'shelf',solid:1});
  }
  if(id==='cave'){
    o.push({x:8,y:1,kind:'gasmeter',act:actGas});
    o.push({x:4,y:3,kind:'boiler',solid:1,act:S.ch===7?()=>actDerive('boiler'):()=>say([{t:"La chaudière gaz. Elle chauffe tout le bâtiment : c'est elle qui fait tourner le compteur gaz l'hiver."}])},{x:5,y:3,kind:'boiler2',solid:1,act:S.ch===7?()=>actDerive('boiler'):null});
    {const cr=()=>secret('carton',["Un carton : « PLAN DE COMPTAGE 2003 – NE PAS JETER ».","Dedans : trois PDL de bâtiments démolis, un index noté au crayon et un sandwich. Le sandwich a mieux vieilli que les données."]);o.push({x:9,y:5,kind:'crate',solid:1,act:cr},{x:10,y:5,kind:'crate',solid:1,act:cr})}
    if(S.ch===7)o.push({x:2,y:6,kind:'derive',did:'cave',solid:1,act:()=>actDerive('cave')});
  }
  if(id==='local')localDecor(o);
  if(id==='town'){for(let x=L.pv.x0;x<=L.pv.x1;x++)L.pv.rows.forEach(y=>o.push({x,y,kind:'pv',solid:1,act:srcAct('installateur')}));o.push({x:SRC.marchand.x-1,y:SRC.marchand.y,kind:'stall',solid:1,act:()=>{if(!srcTry('marchand'))eggDofus()}},{x:TP(SRC.plombier.lx-2,SRC.plombier.ly)[0],y:TP(SRC.plombier.lx-2,SRC.plombier.ly)[1],kind:'watermeter',solid:1,act:srcAct('plombier')})}
  savoirObjs(id,o);
  if(id==='town'){o.push({x:L.machine[0],y:L.machine[1],kind:'machine',solid:1,act:actMachine},{x:L.machine[0]+1,y:L.machine[1],kind:'none',solid:1,act:actMachine});[[95,8],[100,13],[103,20],[96,25],[101,31],[94,37],[102,45],[97,51],[103,57],[95,63],[100,67],[98,39],[94,47]].forEach(([x,y])=>o.push({x,y,kind:'turbine',solid:1}))}
  secretObjs(id,o);
  eggObjs(id,o);
  if(MAPS[id]&&MAPS[id].arena)arenaObjs(MAPS[id].arena,o);
  lifeObjs(id,o);decorObjs(id,o);
  if(MAPS[id]&&MAPS[id].objets)MAPS[id].objets(o);   // cartes de voyage : chacune fournit ses objets (jeu/voyages/)
  return o;
}
function furniture(o){
  const t=S.site;
  if(t==='ecole'){for(const y of [4,6])for(const x of [8,10,12])o.push({x,y,kind:'schooldesk',solid:1});o.push({x:9,y:1,kind:'board',solid:0,act:actMobilier},{x:1,y:5,kind:'stove',solid:1},{x:2,y:5,kind:'stove',solid:1})}
  if(t==='bureau'){for(const x of [8,9,12,13])o.push({x,y:4,kind:'officedesk',solid:1,act:actMobilier});for(const x of [8,9,12,13])o.push({x,y:7,kind:'officedesk',solid:1});o.push({x:1,y:5,kind:'rack',solid:1},{x:2,y:5,kind:'rack',solid:1},{x:14,y:8,kind:'plant',solid:1})}
  if(t==='boulangerie'){for(const x of [8,9,10,11,12])o.push({x,y:6,kind:'counter',solid:1,act:actMobilier});o.push({x:1,y:5,kind:'oven',solid:1},{x:2,y:5,kind:'oven',solid:1},{x:3,y:5,kind:'oven',solid:1},{x:13,y:3,kind:'plant',solid:1})}
}
