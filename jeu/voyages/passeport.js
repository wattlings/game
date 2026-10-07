/* Wattlings · jeu/voyages/passeport.js
   Le passeport des énergies : un tampon par site visité, et tout ce qu'on y a appris.
   Il s'ouvre depuis le menu → Carnet, poche Passeport, une fois reçu au guichet de la gare. */

/* ---- l'encre de chaque tampon ---- */
const PASSEPORT_ENCRE={solaire:'#c8502a',eolien:'#2f6db5',nucleaire:'#6a3fa0',barrage:'#1f8f7a',datacenter:'#3a4050'};

/* ---- le motif au centre du tampon (dessiné autour du point 24,24) ---- */
const PASSEPORT_MOTIF={
  solaire(c,e){c.fillStyle=e;c.beginPath();c.arc(24,24,6,0,7);c.fill();for(let k=0;k<8;k++){const a=k*Math.PI/4;c.save();c.translate(24,24);c.rotate(a);c.fillRect(-1,-13,2,5);c.restore()}},
  eolien(c,e){R(c,23,22,2,14,e);R(c,20,35,8,2,e);c.strokeStyle=e;c.lineWidth=2;c.lineCap='round';for(let k=0;k<3;k++){const a=-1.2+k*2.094;c.beginPath();c.moveTo(24,22);c.lineTo(24+Math.cos(a)*11,22+Math.sin(a)*11);c.stroke()}},
  nucleaire(c,e){c.fillStyle=e;c.fillRect(17,22,14,14);c.beginPath();c.arc(24,22,7,Math.PI,0);c.fill();c.fillRect(11,28,5,8);c.fillRect(33,30,5,6);c.clearRect(23,27,2,6)},
  barrage(c,e){c.fillStyle=e;c.beginPath();c.moveTo(20,14);c.lineTo(27,14);c.lineTo(33,36);c.lineTo(20,36);c.fill();for(let k=0;k<3;k++)R(c,11,18+k*5,7,2,e);R(c,34,33,5,2,e)},
  datacenter(c,e){for(let k=0;k<3;k++){R(c,14+k*7,14,6,22,e);c.clearRect(15+k*7,17,4,1);c.clearRect(15+k*7,21,4,1);c.clearRect(15+k*7,25,4,1)}}
};

/* ---- dessiner un tampon dans un canvas de 48 × 48 : posé (à l'encre) ou vide (l'emplacement en pointillés) ---- */
function passeportTampon(c,sid,pose){
  c.clearRect(0,0,48,48);
  if(!pose){c.strokeStyle='#b5a980';c.lineWidth=1;c.setLineDash([3,3]);c.beginPath();c.arc(24,24,20,0,7);c.stroke();c.setLineDash([]);return}
  const e=PASSEPORT_ENCRE[sid]||'#1c2440';
  c.save();c.translate(24,24);c.rotate(-.14+wh(sid.length,sid.charCodeAt(0),930)*.28);c.translate(-24,-24);
  c.strokeStyle=e;c.lineWidth=2;c.beginPath();c.arc(24,24,21,0,7);c.stroke();c.lineWidth=1;c.beginPath();c.arc(24,24,17.5,0,7);c.stroke();
  for(let k=0;k<24;k++){const a=k*Math.PI/12;c.fillStyle=e;c.fillRect(24+Math.cos(a)*19.3-.5,24+Math.sin(a)*19.3-.5,1,1)}
  (PASSEPORT_MOTIF[sid]||(()=>{}))(c,e);c.restore();
  // un tampon n'est jamais parfaitement encré
  for(let k=0;k<70;k++)c.clearRect((wh(k,sid.length,931)*48)|0,(wh(sid.length,k,932)*48)|0,1+((k%5)===0?1:0),1);
}

/* ---- le contenu de l'onglet Passeport ---- */
function passeportHTML(){
  const v=voyEtat(),nT=Object.keys(v.tampons).length,N=VOY.ordre.length;
  const visa=id=>{const s=VOY.sites[id],t=v.tampons[id],n=s.infos.length?voyInfosVues(id).length:0;
    return `<div class="voy-visa${t?' pose':''}"><canvas width="48" height="48" data-s="${id}"></canvas><b>${esc(s.gare)}</b><small>${esc(s.theme)} · ${esc(s.region)}</small><small>${t?'Tamponné le '+new Date(t).toLocaleDateString('fr-FR'):s.ouvert?`${n} / ${s.infos.length} informations`:'Ligne à venir'}</small></div>`};
  const page=id=>{const s=VOY.sites[id],vues=voyInfosVues(id);
    return `<div class="cls"><div class="cls-h"><b>${esc(s.nom)}</b><span>${vues.length}/${s.infos.length}</span></div>
      ${s.infos.map(f=>voyInfoVue(id,f.id)?`<div class="fiche mini${f.cle?' req':''}"><b>${esc(f.t)}</b><p>${esc(f.x)}</p>${f.retiens?`<p class="voy-retiens"><b>À retenir :</b> ${esc(f.retiens)}</p>`:''}${refsHTML(f.refs)}</div>`
        :`<div class="fiche mini unk"><b>???${f.cle?' · info clé':''}</b><p>${f.ou?'Indice : '+esc(f.ou):'À trouver sur place.'}</p></div>`).join('')}
      ${vues.length&&refsSite(id).length?`<details class="voy-sources"><summary>Toutes les sources de ce site (${refsSite(id).length})</summary><p>Le site est inventé ; ses ordres de grandeur sont réels. Chaque information porte ses propres sources ; les voici réunies, avec celles de ce que disent les habitants.</p>${refsListe(refsSite(id))}</details>`
        :s.sources&&vues.length?`<details class="voy-sources"><summary>D'où viennent les chiffres</summary><p>Le site est inventé ; ses ordres de grandeur sont réels.</p><ul>${s.sources.map(([l,u])=>`<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(l)} ↗</a></li>`).join('')}</ul></details>`:''}</div>`};
  return `<p>Passeport des énergies de <b>${esc(S.name)}</b> : ${nT} / ${N} tampon${nT>1?'s':''}. Un tampon se gagne sur place, en relevant le défi du responsable du site. Les trains partent de la gare d'Ampère-sur-Loire.</p>
    <div class="voy-pass">${VOY.ordre.map(visa).join('')}</div>${VOY.ordre.filter(id=>VOY.sites[id].ouvert).map(page).join('')}`;
}
/* à appeler une fois l'onglet affiché : dessine les tampons */
function passeportLier(el){el.querySelectorAll('canvas[data-s]').forEach(c=>passeportTampon(c.getContext('2d'),c.dataset.s,voyTampon(c.dataset.s)))}
