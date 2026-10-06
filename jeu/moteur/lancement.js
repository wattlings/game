/* Wattlings · jeu/moteur/lancement.js
   Lancement d'une partie : remet le joueur en place à partir de la sauvegarde (boot). */

function boot(){
  if(!MAPS[S.map]){S.map='office';S.x=5;S.y=6}
  if((S.v||1)<4){if(S.map==='town'){const f=front('office');S.x=f[0];S.y=f[1];S.dir='down'}S.v=4} // nouvelle ville : on repart de la porte du bureau
  S.arena=S.arena||{};AR.lock=false;if(curArena())arenaInit(curArena());EN_ON=true;EN_V.v='';enSync();skyUpdate(true);
  rebuildMaps();P.x=S.x;P.y=S.y;P.px=S.x*TS;P.py=S.y*TS;P.dir=S.dir||'up';P.moving=false;
  if(isSolid(P.x,P.y)){const f={office:[5,6],town:front('office'),rdc:[7,9],cave:[2,2]}[S.map]||MAPS[S.map].depart||(curArena()?[7,10]:[5,6]);P.x=f[0];P.y=f[1];P.px=P.x*TS;P.py=P.y*TS}
  lastObj=null;hud();fadeIn();applySobriete();updateMusic();
  if(S.ch===0&&S.map==='office')qkTimeout(()=>{if(!busy&&!dlg.open)say([{t:"Ton premier jour. Mme Joule, l'energy manager senior, t'attend à droite. Approche-toi et appuie sur A (Espace)."},{t:"Ton objectif, ton carnet, les options et le retour au cours sont dans le menu (touche M, ou bouton MENU en haut à droite). Le bouton « ← Cours » te ramène au cours à tout moment."},{t:"La ville est une boucle de huit quartiers, un par étape. Pour t'y retrouver, ouvre la carte : touche K, ou bouton CARTE."}])},500);
}
