/* Wattlings · jeu/monde/regions-decor.js
   Pose du décor régional sur la carte. */

/* ---- pose du décor régional (appelée par decorBuild) ---- */
function regDecorBuild(o,D,F){
  const one=t=>()=>say([{t}]),S2=(x,y,kind,extra,nx,ny)=>{D(x,y,kind,1,extra);for(let j=0;j<(ny||1);j++)for(let i=0;i<nx;i++)if(i||j)D(x+i,y-j,'none',1,{act:extra&&extra.act})};
  // Auvergne
  S2(REG_SPOT.puy[0],REG_SPOT.puy[1],'puy',{act:one("Un puy : un ancien volcan, éteint depuis longtemps. De là-haut, on embrasse tout le terrain d'un seul regard. Cadrer, c'est ça : prendre de la hauteur avant de mesurer.")},3,2);
  S2(REG_SPOT.buron[0],REG_SPOT.buron[1],'buron',{act:one("Un buron : la cabane de pierre où l'on fabriquait le fromage d'estive. Murs épais, toit de lauze, une seule ouverture. Zéro chauffage, et le fromage s'en porte très bien.")},2,1);
  F(64,13,'cow',{v:0,act:one("Une vache Salers, robe acajou et cornes en lyre. Elle te regarde comme on regarde un compteur mal placé.")});F(51,15,'cow',{v:0,act:one("Meuh. (Elle rumine. C'est sa consommation de base : régulière, jour et nuit.)")});
  F(66,13,'etal',{v:'fromage',act:one("Un étal de fromages d'Auvergne. Sur l'ardoise : « Affinés en cave : 10 °C, été comme hiver. Une consigne qui ne dérive jamais. »")});
  // Nord
  D(REG_SPOT.beffroi[0],REG_SPOT.beffroi[1],'beffroi',1,{act:()=>say([{t:`Le beffroi de la Cité. Son horloge indique ${skyHM()}. Il sonne chaque heure, sans jamais en sauter une : une mesure à pas régulier, c'est déjà une courbe de charge.`}])});
  D(REG_SPOT.moulin[0],REG_SPOT.moulin[1],'moulin',1,{act:()=>say([{t:`Un moulin à vent sur pivot, comme en Flandre. ${SKY.wind>.6?'Ses ailes tournent à vive allure':SKY.wind<.15?'Ses ailes bougent à peine':'Ses ailes tournent tranquillement'} : ${Math.round(SKY.wind*62)} km/h de vent. L'ancêtre des éoliennes, de l'autre côté de la forêt.`}])});
  S2(REG_SPOT.terril[0],REG_SPOT.terril[1],'terril',{act:one("Un terril : la montagne de ce qu'on a remonté de la mine, avec son vieux chevalement. Toute l'énergie d'une époque est passée par ici. Aujourd'hui, l'herbe y repousse.")},3,1);
  F(85,43,'etal',{v:'frites',act:one("Une baraque à frites. Sur l'ardoise : « La friteuse est le plus gros poste de ma facture. Entre deux services, je la baisse : elle remonte en dix minutes. »")});
  // Normandie
  S2(REG_SPOT.chaumiere[0],REG_SPOT.chaumiere[1],'chaumiere',{act:one("Une chaumière. Quarante centimètres de roseau sur le toit : chaud l'hiver, frais l'été. L'isolation par l'extérieur ne date pas d'hier. Des iris poussent sur le faîtage.")},2,2);
  F(79,57,'pressoir',{act:one("Un pressoir à cidre. On y trie les pommes avant de presser : une seule pomme gâtée, et toute la cuvée s'en ressent. Les données, c'est pareil.")});F(75,57,'pommes',{solid:0});
  F(84,46,'cow',{v:1,act:one("Une vache normande, blanche à lunettes brunes. Elle broute en ligne droite, de haie en haie.")});F(77,53,'cow',{v:1,act:one("Meuh. (Le bocage est bien clos : aucune ne manque à l'appel. Le fermier les compte chaque soir.)")});
  // Alsace
  F(59,57,'puits',{act:one("Un puits fleuri de géraniums. Sur la margelle, une date gravée et, dessous, les relevés du niveau d'eau, année après année. Ici, on range même les souvenirs.")});
  F(64,60,'etal',{v:'bretzel',act:one("Un étal de bretzels. Trois boucles, toujours nouées dans le même ordre : une structure, c'est ce qui permet de s'y retrouver sans réfléchir.")});
  // Bourgogne
  D(REG_SPOT.cabotte[0],REG_SPOT.cabotte[1],'cabotte',1,{act:one("Une cabotte : l'abri de pierre du vigneron, au milieu des rangs. On y garde les outils… et les carnets de vendange, un par année.")});
  F(31,57,'tonneau',{act:one("Des fûts de chêne. Sur chacun, à la craie : l'année, la parcelle, le degré. Sans étiquette, un tonneau n'est qu'un mystère.")});F(34,61,'tonneau');F(35,56,'cow',{v:2,act:one("Une vache charolaise, toute blanche. Elle surveille les vignes d'un œil distrait.")});
  [[27,63],[33,61],[36,62],[24,58]].forEach(([x,y])=>F(x,y,'escargot',{solid:0}));
  // Bretagne
  D(REG_SPOT.phare[0],REG_SPOT.phare[1],'phare',1,{act:()=>say([{t:SKY.lamps?"Le phare de l'Anse. Son faisceau balaie la nuit : rien ne lui échappe. Veiller toute la nuit, c'est son métier. Ce n'est pas celui d'un bâtiment vide.":"Le phare de l'Anse. Le jour, il se repose. La nuit, il veille : c'est à ce moment-là qu'on voit ce qui reste allumé."}])});
  F(13,47,'calvaire',{act:one("Un calvaire de granit, usé par le vent d'ouest. Il a vu passer des siècles de tempêtes, et pas un seul relevé de compteur.")});
  [[8,56],[10,56],[12,56]].forEach(([x,y])=>F(x,y,'menhir',{act:one("Un alignement de menhirs. Plantés là il y a cinq mille ans, parfaitement espacés. Les premiers points de mesure à pas régulier ?")}));
  F(9,60,'barque',{act:one("Une barque tirée au sec, avec ses filets qui sèchent. Elle s'appelle « Talon ». Son propriétaire a de l'humour, ou un compteur.")});F(12,60,'casier');
  F(11,57,'etal',{v:'crepes',act:one("Une crêperie ambulante. Sur l'ardoise : « La galettière chauffe à 230 °C. Je l'allume un quart d'heure avant le service, pas à l'aube. »")});
  // Provence
  D(11,39,'boules',0,{flat:1,solid:0});D(12,39,'none',0,{act:one("Un terrain de pétanque. Le cochonnet est tout près d'une boule : il va falloir mesurer.")});
  F(15,20,'fontaineP',{act:one("Une fontaine moussue. Elle coule toute l'année, à débit constant. Les anciens disent qu'on peut y lire les années sèches rien qu'en regardant la mousse.")});
  [[16,15],[17,15],[18,16]].forEach(([x,y])=>F(x,y,'ruche',{act:one("Une ruche. Les abeilles butinent la lavande d'à côté. Dans la ruche, il fait 35 °C toute l'année, sans thermostat connecté.")}));
  // Savoie
  S2(REG_SPOT.bergerie[0],REG_SPOT.bergerie[1],'bergerie',{act:one("La bergerie de l'alpage. Sur la porte, une ardoise : « Montée : 142. Descente : 142. » Le berger compte ses bêtes deux fois, de la même façon. C'est comme ça qu'on prouve.")},2,2);
  [[30,9],[31,8],[29,10],[32,10]].forEach(([x,y],i)=>F(x,y,'mouton',{act:one(i%2?"Bêêê. (Elle porte une boucle numérotée à l'oreille. Chaque brebis a son identifiant.)":"Un mouton d'alpage. Il broute, imperturbable.")}));
  F(26,10,'patou',{act:one("Un patou, le grand chien blanc des bergers. Il ne dort que d'un œil : c'est lui qui détecte les anomalies du troupeau.")});
  F(33,13,'bassin',{act:one("Un bassin taillé dans un tronc. L'eau de la source y arrive à 6 °C, hiver comme été. On y met le lait à rafraîchir : zéro kWh.")});F(33,18,'tasbois');F(41,20,'tasbois');
  F(38,14,'cow',{v:3,act:one("Une vache d'Abondance, sa cloche au cou. On l'entend de loin : pas besoin de capteur pour savoir où elle est.")});
}
