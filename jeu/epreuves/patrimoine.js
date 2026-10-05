/* Wattlings · jeu/epreuves/patrimoine.js
   Chapitre 10 · Patrimoine : les six missions du PC patrimoine et le maire. */

/* ---------- missions ---------- */
function missions(){
  const P=pareto('mwh'),top4=P.list[3].cum,rm=rankOf('mwh'),re=rankOf('eur'),rc=rankOf('co2');
  const gain=r2=>PSITES.map(s=>({s,d:rm[s.n]-r2[s.n]})).sort((a,b)=>b.d-a.d);
  const ge=gain(re),gc=gain(rc),nope=l=>l.filter(x=>x.d<=0).slice(-3).map(x=>x.s.n);
  const A=byActivity('mwh').rows,G=PSITES.slice().sort((a,b)=>gis(b)-gis(a)),GT=PSITES.reduce((a,s)=>a+gis(s),0),over=PSITES.filter(s=>ecart(s)>=.2);
  const cand=PSITES.filter(s=>!over.includes(s)&&s.a!=='pisc').sort((a,b)=>ecart(b)-ecart(a)).slice(0,3);
  return [
    {t:'Périmètre',steps:[
      {tab:'inv',f:info(`<h3>Mission 1 · Le périmètre</h3><p>Avant de classer quoi que ce soit, on vérifie ce qu'on classe. Voici l'inventaire : 20 sites, électricité et gaz.</p>`)},
      {tab:'inv',f:choice({q:'La Boulangerie du Moulin, que tu connais bien, doit-elle entrer dans ce patrimoine ?',opts:[['Non : c\'est un commerce privé, la ville n\'en paie pas l\'énergie',1,'Un patrimoine, c\'est ce que le propriétaire gère et paie. Le Carré, lui, est entré dans le périmètre : la ville y loue ses bureaux annexes.'],['Oui, elle est dans la ville',0,'Être sur le territoire ne suffit pas : il faut que la ville en soit propriétaire ou gestionnaire.'],['Oui, pour faire grossir les chiffres',0,'Un périmètre gonflé fausse toutes les comparaisons.']]})},
      {tab:'inv',f:choice({q:'La piscine a 3 000 m² de bâtiment et 500 m² de bassin. Quelle surface garder pour la comparer aux autres piscines ?',opts:[['La surface de bassin : c\'est l\'eau chauffée qui consomme',1,'Les références de piscines s\'expriment en kWh par m² de bassin.'],['La surface du bâtiment, comme pour les autres sites',0,'Pour une piscine, le bâtiment compte moins que le volume d\'eau à chauffer.'],['Aucune : une piscine ne se compare pas',0,'Elle se compare, à d\'autres piscines.']]})}]},
    {t:'Pareto des consommations',steps:[
      {tab:'pareto',ind:'mwh',f:info(`<h3>Mission 2 · Le Pareto</h3><p>Le graphique classe les sites du plus gros au plus petit, et cumule leur part du total. Survole une ligne pour le détail.</p>`)},
      {tab:'pareto',ind:'mwh',f:choice({q:'Quel site consomme le plus ?',opts:[[P.list[0].s.n,1,`${pct(P.list[0].share)} du patrimoine à lui seul. Une piscine, c'est souvent autant que plusieurs écoles.`],[P.list[2].s.n,0,'Regarde la première ligne.'],['Hôtel de ville',0,'Il est loin derrière.']]})},
      {tab:'pareto',ind:'mwh',f:choice({q:'Combien de sites font 80 % de la consommation ?',opts:[[`${P.n80} sites`,1,`${P.n80} sites sur 20, soit ${pct(P.n80/20)}. La « règle des 80/20 » est un ordre de grandeur, pas une loi.`],['4 sites',0,'4 sites, c\'est moins que ça : regarde la ligne pointillée.'],['16 sites',0,'Beaucoup moins : regarde la ligne pointillée.']]})},
      {tab:'pareto',ind:'mwh',f:choice({q:'Et les 4 premiers sites, soit 20 % du patrimoine ?',opts:[[`Environ ${pct(top4)} de la consommation`,1,'Suivre de près ces quelques sites, c\'est déjà suivre plus de la moitié de l\'énergie.'],['Environ 20 %',0,'Les gros sites pèsent bien plus que leur nombre.'],['Environ 95 %',0,'Pas à ce point.']]})}]},
    {t:'Coût et CO₂',steps:[
      {tab:'pareto',ind:'eur',f:info(`<h3>Mission 3 · Changer d'indicateur</h3><p>Même patrimoine, autre question. En euros, l'électricité pèse plus lourd (≈ 186 €/MWh contre ≈ 89 €/MWh pour le gaz). En CO₂, c'est l'inverse (≈ 0,052 t/MWh contre ≈ 0,204 t/MWh). Le graphique est passé en €.</p>`)},
      {tab:'pareto',ind:'eur',f:choice({q:'En €, quel site gagne le plus de places par rapport au classement en MWh ?',opts:[[ge[0].s.n,1,`Il passe de la ${rm[ge[0].s.n]}e à la ${re[ge[0].s.n]}e place : sa consommation est surtout électrique, l'énergie la plus chère.`],...nope(ge).slice(0,2).map(n=>[n,0,'Ce site ne monte pas en €. Compare les deux classements.'])]})},
      {tab:'pareto',ind:'co2',f:choice({q:'Passe en tCO₂e. Quel site gagne le plus de places ?',opts:[[gc[0].s.n,1,`De la ${rm[gc[0].s.n]}e à la ${rc[gc[0].s.n]}e place : il est chauffé au gaz, l'énergie la plus émettrice.`],...nope(gc).slice(0,2).map(n=>[n,0,'Ce site ne monte pas en CO₂.'])]})},
      {tab:'pareto',ind:'co2',f:choice({q:'Pourquoi le classement change-t-il d\'un indicateur à l\'autre ?',opts:[['Chaque énergie a son prix et son facteur d\'émission : le mix du site change son poids',1,'D\'où la question à poser avant tout Pareto : on cherche à réduire quoi ? La facture, le CO₂, ou les kWh du décret tertiaire ?'],['Parce que les données sont fausses',0,'Les données sont les mêmes.'],['Parce que les sites changent de surface',0,'La surface ne joue pas ici.']]})}]},
    {t:'Par activité',steps:[
      {tab:'act',ind:'mwh',f:info(`<h3>Mission 4 · Regrouper par activité</h3><p>On additionne les sites de même activité. Le graphique montre le poids de chaque famille de bâtiments.</p>`)},
      {tab:'act',ind:'mwh',f:choice({q:'Quelle activité pèse le plus en MWh ?',opts:[[A[0].lab,1,`${pct(A[0].share)} avec ${A[0].n} site${A[0].n>1?'':''}. ${A[0].n===1?'Un seul équipement pèse plus que toute une famille de bâtiments.':''}`],[A[2].lab,0,'Regarde la première ligne.'],[A[A.length-1].lab,0,'C\'est la plus petite.']]})},
      {tab:'act',ind:'mwh',f:choice({q:'Pour comparer les cinq écoles entre elles, quel indicateur ?',opts:[['Le ratio kWh/m², entre sites de même activité',1,'On neutralise la taille. Et on compare une école à des écoles, pas à une piscine.'],['Les MWh totaux',0,'La plus grande école serait toujours « la pire ».'],['Les euros',0,'Les euros dépendent aussi du mix et des prix.']]})}]},
    {t:'Bâtiments similaires',steps:[
      {tab:'bench',bm:'ecart',f:info(`<h3>Mission 5 · Comparer à des bâtiments similaires</h3><p>Chaque site est comparé à la référence nationale de son activité (en kWh/m²/an, climat corrigé). Survole une ligne : tu vois aussi la médiane des sites de même activité dans ton patrimoine.</p>`)},
      {tab:'bench',bm:'ecart',f:multi({q:'Coche les sites qui consomment au moins 20 % de plus que la référence de leur activité.',items:[...over.map(s=>[s.n,true,`${sgn(ecart(s))}`]),...cand.map(s=>[s.n,false,`${sgn(ecart(s))} : dans la norme`]),['Piscine Aqualoire',false,`${sgn(ecart(PSITES[10]))} : au-dessus, mais sous le seuil de 20 %`]],okMsg:'Ce sont les sites « à investiguer ». Première question sur place : horaires, régulation, réduit de nuit et de week-end.'})},
      {tab:'bench',bm:'ecart',f:choice({q:'La Résidence Les Glycines est 2e du Pareto. Est-elle mal gérée ?',opts:[['Non : son ratio est dans la référence, elle est grande et occupée jour et nuit',1,'Gros ne veut pas dire inefficace. Le Pareto dit où regarder, le benchmark dit s\'il y a un problème.'],['Oui, puisqu\'elle consomme beaucoup',0,'Rapporte sa consommation à sa surface et à son activité.'],['On ne peut pas comparer une résidence',0,'Si, à d\'autres résidences.']]})},
      {tab:'bench',bm:'act',act:'pe',f:choice({q:'Vue « Par activité », petite enfance : la médiane du patrimoine repose sur 2 crèches. Que faut-il en penser ?',opts:[['Avec 2 sites, la médiane interne est fragile : on s\'appuie sur la référence nationale',1,'La médiane d\'un groupe de 2, c\'est la moyenne des deux… dont celui qui dérive.'],['C\'est la meilleure référence possible',0,'Deux sites, c\'est trop peu.'],['On ne compare pas les crèches',0,'Si : à d\'autres crèches.']]})},
      {tab:'bench',bm:'ecart',f:choice({q:'Tous tes sites sont à Ampère-sur-Loire. Pour les comparer entre eux, faut-il corriger du climat ?',opts:[['Non entre eux (même météo), mais oui pour les comparer à une référence nationale',1,'Les références nationales sont corrigées du climat : on compare à conditions égales.'],['Oui, toujours',0,'Même ville, même météo : entre eux, pas besoin.'],['Jamais',0,'Face à une référence nationale, si.']]})}]},
    {t:'Priorités',steps:[
      {tab:'bench',bm:'gis',f:info(`<h3>Mission 6 · Prioriser</h3><p>Le gisement estime ce qu'on économiserait si chaque site revenait à la référence de son activité : (ratio − référence) × surface.</p>`)},
      {tab:'bench',bm:'gis',f:choice({q:'Quel site a le plus gros gisement en MWh ?',opts:[[G[0].n,1,`${fmt(Math.round(gis(G[0])))} MWh/an, avec un écart de seulement ${sgn(ecart(G[0]))}. Un petit écart sur un énorme volume pèse plus qu'un gros écart sur un petit site.`],[G[3].n,0,'Regarde la première ligne.'],['Crèche Pom’Pouce',0,'Gros écart, mais petite crèche : petit gisement.']]})},
      {tab:'bench',bm:'gis',f:choice({q:'Quel est le gisement total du patrimoine ?',opts:[[`≈ ${fmt(Math.round(GT/10)*10)} MWh/an, soit ${pct(GT/P.T)} de la consommation`,1,'C\'est l\'ordre de grandeur de ce qu\'on peut viser par l\'optimisation, avant même de parler de rénovation lourde.'],[`≈ ${fmt(Math.round(P.T/10)*10)} MWh/an`,0,'Ça, c\'est la consommation totale.'],['≈ 50 MWh/an',0,'Additionne les lignes.']]})},
      {tab:'bench',bm:'gis',f:choice({q:'Le maire demande un plan. Par où commencer ?',opts:[['Sobriété sur tout le patrimoine, puis audits sur les plus gros gisements assujettis au décret tertiaire',1,'On combine ce qui est gratuit partout, ce qui rapporte le plus, et ce qui est obligatoire.'],['Isoler en priorité la crèche qui a le pire ratio',0,'Pire ratio, mais petit gisement : ce n\'est pas là que se jouent les MWh.'],['Fermer la piscine',0,'Politiquement explosif, et ce n\'est pas le rôle de l\'energy manager.']]})}]}
  ];
}
function openDashboard(){
  if(S.ch===10&&(S.pm||0)<6&&gate(10))return;
  const ov=openPanel('PC patrimoine · Ampère-sur-Loire'),panel=ov.querySelector('.panel'),b=ov.querySelector('.pbody');panel.classList.add('wide');
  b.innerHTML=`<div class="dtabs menu-tabs" role="tablist">${[['inv','Inventaire'],['pareto','Pareto'],['act','Par activité'],['bench','Bâtiments similaires']].map(([k,l])=>`<button type="button" role="tab" data-tab="${k}">${l}</button>`).join('')}</div>
  <div class="dash-grid"><section class="mission" aria-live="polite"></section><section class="dview"></section></div><div class="row"><button class="btn alt" id="dClose">Fermer le PC</button></div>`;
  const view=b.querySelector('.dview'),mp=b.querySelector('.mission');
  b.querySelectorAll('.dtabs button').forEach(x=>x.onclick=()=>{DSH.tab=x.dataset.tab;sfx('select');renderDash(view)});
  b.querySelector('#dClose').onclick=()=>{closePanel();if(S.ch===10&&S.pm>=6)finishPatrimoine()};
  const M=missions();S.pm=S.pm||0;let si=0;
  const head=()=>`<div class="mhead"><span class="tag">Mission ${Math.min(S.pm+1,M.length)} / ${M.length}</span> ${M.map((m,i)=>`<span class="mdot${i<S.pm?' done':i===S.pm?' cur':''}" title="${esc(m.t)}"></span>`).join('')}</div>`;
  const step=()=>{
    if(S.ch!==10||S.pm>=M.length){mp.innerHTML=head()+`<h3>Exploration libre</h3><p>Les 6 missions sont terminées. Change d'onglet, d'indicateur ou d'activité, et survole les lignes pour le détail.</p><div class="kpis"><div><b>${fmt(Math.round(pareto('mwh').T))}</b> MWh/an</div><div><b>${fmt(Math.round(pareto('eur').T/1000))} k€</b> HT/an</div><div><b>${fmt(Math.round(pareto('co2').T))}</b> tCO₂e/an</div></div>`;if(S.ch===10){const f=document.createElement('button');f.className='btn';f.textContent='Présenter le plan au maire ▸';f.onclick=()=>{closePanel();finishPatrimoine()};mp.appendChild(f)}else if(S.ch>=11){const f=document.createElement('button');f.className='btn';f.textContent='Piloter le parc : suivi, travaux, objectif −40 % ▸';f.onclick=()=>{closePanel();EN_V.v='parc';openMenu('energie')};mp.appendChild(f)}renderDash(view);return}
    const m=M[S.pm],st=m.steps[si];
    ['tab','ind','bm','act'].forEach(k=>{if(st[k])DSH[k]=st[k]});renderDash(view);
    mp.innerHTML=head();const inner=document.createElement('div');mp.appendChild(inner);
    st.f(inner,()=>{si++;if(si>=m.steps.length){si=0;S.pm++;trk('mission',{n:S.pm,titre:m.t});save();hud();sfx('good');toast(`Mission « ${m.t} » terminée !`);gainXP(30)}step()});
  };
  step();
}
function finishPatrimoine(){
  if(S.ch!==10)return;
  say([{w:'Maire',t:"Alors, ce tableau de bord ? Il y a des flèches vertes ?"},{w:'Maire',t:"…Un Pareto, un benchmark et une liste de priorités chiffrée. C'est encore mieux que des flèches vertes. Je vous nomme officiellement gestionnaire du patrimoine."},{w:'Maire',t:"Et puisque vos économies remplissent le fonds de travaux, je vous confie celui de toute la ville. Vingt bâtiments : à vous de choisir où mettre le premier euro. L'objectif, vous le connaissez : moins 40 %."},{w:'Mme Joule',t:"Je n'ai plus rien à t'apprendre, {name}. Enfin si : pense à renouveler les mandats Enedis avant qu'ils expirent."},{w:'Mme Joule',t:"Ton compteur couvre maintenant tout le parc. Commence par mettre les plus gros sites sous suivi : ça ne fait économiser aucun kWh, mais sans données tu n'auras ni alerte ni gisement."}],()=>{S.ch=11;enSync();EN_V.v='parc';save();hud();endScreen()});
}
function actMaire(){
  const M='Maire';
  if(S.ch>=10&&srcTry('maire'))return;
  if(S.ch<10)return say([{w:M,t:"Bonjour ! Je suis très occupé : j'inaugure un rond-point. Revenez quand vous gérerez tout le patrimoine."}]);
  if(S.ch===10&&!S.pm)return say([{w:M,t:"Ah, notre nouvelle recrue ! Vingt bâtiments, une facture qui grimpe, et un conseil municipal dans trois semaines."},{w:M,t:"Je veux savoir où ça consomme, où ça coûte, et où agir en premier. Avec un graphique. Les élus adorent les graphiques."},{w:M,t:"Le PC patrimoine est là, à gauche. Et on ne touche pas à la piscine sans m'en parler : c'est électoral."}]);
  if(S.ch===10&&S.pm>=6)return finishPatrimoine();
  if(S.ch>=11&&Math.random()<.6){const p=enPct();return say([{w:M,t:p>=.4?"Moins 40 % ! Je vais pouvoir l'annoncer au conseil municipal. Avec un graphique. Un très grand graphique.":`Où en est-on ? ${(p*100).toFixed(1).replace('.',',')} % de moins sur le parc, à météo comparable. L'objectif, c'est 40. Le fonds de travaux est entre vos mains : ouvrez votre tableau de bord.`}])}
  const Q=["Vous savez ce qui consomme le plus dans cette mairie ? Les réunions. Mais on n'a pas de sous-compteur.","Mon prédécesseur avait un tableau de bord. Un fichier Excel de 47 onglets. On ne l'a jamais retrouvé.","Si le Pareto dit que la piscine consomme beaucoup, on peut changer le Pareto ?"];
  say([{w:M,t:Q[Math.floor(Math.random()*Q.length)]}]);
}
