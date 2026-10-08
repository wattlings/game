/* Wattlings · jeu/epreuves/ems-mesurer.js
   Étape 8 · Mesurer, l'atelier : vérifier SON plan d'action (celui choisi à l'étape Agir) en comparant une année de référence
   et l'année de suivi, plus douce. Le joueur choisit comment corriger la météo, conclut, puis lit le résultat dans
   l'indicateur choisi à l'étape Cadrer (euros, kWh/m² ou CO₂).

   Le plan tient 80 % de ce qu'il promettait : il y a toujours un grain de sable (MES_GRAIN), et c'est le travail de la mesure de le trouver. */

const MES_DJU0=2435,MES_DJU1=2070,MES_TENU=.8;
const MES_GRAIN={
  ecole:"La consigne a été remontée à 21 °C en février, « juste pour une semaine », dans la salle des maîtres. La semaine dure toujours.",
  bureau:"Le réduit du week-end a été coupé pour un séminaire en mars. Personne ne l'a remis. Le séminaire, lui, est fini depuis longtemps.",
  boulangerie:"Les prises coupe-veille ont été débranchées par le livreur, pour charger son téléphone. Elles le sont restées."
};
/* le plan vérifié : celui de l'étape Agir, sinon les actions lancées, sinon la sobriété de base */
function mesPlan(){
  const p=emsGet('plan');if(p&&p.ids&&p.ids.length)return p.ids;
  const e=S.en&&S.en.acts?Object.keys(S.en.acts).filter(id=>enAct(id)):[];
  return e.length?e:['consigne','veilles','reduit'];
}
function mesChiffres(sid,ids){
  const y=enYear(sid,ids),s=SITES[sid],C0=Math.round(y.ref),chauf=s.gaz*1000*EN_PROF[sid].gHeat,adj=Math.round(C0+chauf*(MES_DJU1/MES_DJU0-1));
  const prevu=Math.round(y.kwh),reel=Math.round(prevu*MES_TENU),C1=adj-reel,elec=(y.by.veilles||0)+(y.by.led||0),gaz=prevu-elec;
  return {C0,adj,C1,prevu,reel,eur:Math.round(y.eur*MES_TENU/10)*10,co2:Math.round((elec*.052+gaz*.227)*MES_TENU/100)/10,surf:s.surface};
}
function mvStep(el,next){
  const s=site(),ids=mesPlan(),M=mesChiffres(s.id,ids),pct=v=>(Math.round(v*1000)/10).toLocaleString('fr-FR'),brut=pct((M.C0-M.C1)/M.C0);let essais=0,ajuste=null;
  const noms=ids.map(id=>enAct(id)).filter(Boolean).map(a=>a.t.split(' :')[0]);
  el.innerHTML=`<div class="ems">${emsBarre('mesure et vérification')}
    <p>Ton plan de l'arène du Chantier : <b>${esc(noms.join(', '))}</b>. Il promettait <b>${emsKwh(M.prevu)} kWh</b> par an. Un an a passé. L'hiver a été doux : <span class="num">${fmt(MES_DJU1)} DJU</span> contre <span class="num">${fmt(MES_DJU0)}</span> l'année de référence.</p>
    <canvas class="chart" width="480" height="230" aria-label="Consommation de l'année de référence, référence ajustée et année de suivi"></canvas>
    <div class="ems-diag" aria-live="polite"></div></div>`;
  const cv=el.querySelector('canvas'),x=cv.getContext('2d'),diag=el.querySelector('.ems-diag');
  const dessiner=()=>{const R=emsRepere(x,{w:480,h:230,L:84,max:M.C0*1.12,unite:'kWh'}),bw=R.W/3*.5;
    [['Référence',M.C0,'#9aa0a8'],['Référence ajustée',ajuste,'#2f6db5'],['Année de suivi',M.C1,'#2aa198']].forEach(([l,v,c],i)=>{const px=R.L+R.W*(i+.25)/3;
      x.fillStyle='#1c2440';x.textAlign='center';x.fillText(l,px+bw/2,R.T+R.H+18);if(v===null){x.fillText('?',px+bw/2,R.T+R.H-8);return}
      x.fillStyle=c;x.fillRect(px,R.Y(v),bw,R.T+R.H-R.Y(v));x.fillStyle='#1c2440';x.fillText(emsKwh(v),px+bw/2,R.Y(v)-5)})};
  /* 1. corriger la météo : seul le chauffage dépend des DJU */
  const methodes=[
    ['Comparer directement les deux années',M.C0,`−${brut} % : la météo a fait une bonne partie du travail, et tu t'en attribues tout le mérite. Le directeur adore. L'auditeur, moins.`],
    [`Corriger tout le site du rapport des DJU (${fmt(MES_DJU1)} / ${fmt(MES_DJU0)})`,Math.round(M.C0*MES_DJU1/MES_DJU0),"Tu viens de corriger de la météo l'éclairage, les ordinateurs et la machine à café. Ils ne savent pas qu'il fait doux."],
    ['Corriger seulement le chauffage du rapport des DJU',M.adj,'']];
  diag.innerHTML='<div class="ems-q"></div>';
  emsChoix(diag.querySelector('.ems-q'),methodes.map(m=>[m[0],!m[2],m[2]]),(o,e)=>{essais+=e;ajuste=M.adj;dessiner();
    diag.innerHTML=`<div class="fb ok">✔ Référence ajustée : <b>${emsKwh(M.adj)} kWh</b>, ce que le site aurait consommé cet hiver-là sans ton plan. Économie réelle : ${emsKwh(M.adj)} − ${emsKwh(M.C1)} = <b>${emsKwh(M.reel)} kWh</b>, soit −${pct(M.reel/M.adj)} % et non −${brut} %.</div>`;contBtn(diag,conclure,'Conclure')},
    {q:'Pour savoir ce que ton plan a vraiment économisé, à quoi compares-tu l’année de suivi ?',
     rendu:box=>box.querySelectorAll('.opt').forEach(b=>{const m=methodes.find(z=>z[0]===b.textContent);if(m)b.onmouseenter=b.onfocus=()=>{ajuste=m[1];dessiner()}})});
  /* 2. conclure : ça a marché, mais moins que prévu */
  const conclure=()=>{diag.innerHTML='<div class="ems-q"></div>';
    emsChoix(diag.querySelector('.ems-q'),[
      [`Ça a marché, mais ${Math.round((1-MES_TENU)*100)} % de moins que prévu : on cherche pourquoi`,1],
      [`Ça a marché au-delà des espérances : −${brut} %`,0,"Ça, c'est le chiffre brut. Corrigé de la météo, tu es sous ton plan, pas au-dessus."],
      ["Ça n'a pas marché",0,`Tu as économisé ${emsKwh(M.reel)} kWh à météo comparable. Ce n'est pas rien : c'est ${Math.round(MES_TENU*100)} % de ce que tu visais.`]],
      (o,e)=>{essais+=e;indicateur()},{q:`Le plan promettait ${emsKwh(M.prevu)} kWh. La mesure en trouve ${emsKwh(M.reel)}. Ta conclusion ?`})};
  /* 3. le grain de sable, puis l'indicateur choisi à l'étape Cadrer */
  const indicateur=()=>{const obj=emsObjectif(),O=CAD_OBJ[obj],r=M.reel/M.C0;
    const val=obj==='facture'?`<b>${fmt(M.eur)} € économisés par an</b> (valeurs fictives).`
      :obj==='decret'?`<b>${fmt(Math.round(M.C0/M.surf))} → ${fmt(Math.round((M.C0-M.reel)/M.surf))} kWh/m²</b> à météo comparable, soit −${pct(r)} %. L'objectif 2030 est −40 % : ${r>=.4?'atteint':'il reste '+Math.round((.4-r)*100)+' points à trouver, et autant de bonnes raisons de recommencer la boucle'}.`
      :`<b>${M.co2.toLocaleString('fr-FR')} tCO₂e évitées par an.</b> ${M.co2<5?'C’est modeste : les plus gros gains de CO₂ viennent du gaz.':'Le gaz économisé fait l’essentiel du chiffre.'}`;
    emsSet('mv',{prevu:M.prevu,reel:M.reel,brut});
    diag.innerHTML=`<div class="fb ok">✔ La bonne conclusion : ça marche, pas autant que prévu. Alors on va voir.</div>
      <p><b>Le grain de sable :</b> ${esc(MES_GRAIN[s.id]||MES_GRAIN.ecole)}</p>
      <p>Ton objectif, choisi à l'arène du Cadastre : <b>${esc(O.t)}</b>. Ton indicateur : ${val}</p>
      ${emsTransfert('la mesure et vérification compare le suivi à une référence ajustée (météo, occupation), jamais au chiffre brut de l’an dernier. L’outil fait le calcul ; c’est une personne qui décide si l’écart avec le plan est normal, et qui va voir sur place quand il ne l’est pas.')}`;
    gainXP(essais?5:20);contBtn(diag,next)};
  dessiner();
}
