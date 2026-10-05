/* Wattlings · jeu/recit/arenes/_regles.js
   Arènes : dimensions, chapitre de chaque arène, et le raccourci Q() pour écrire une question. */

/* ================= ARÈNES : une par étape, trois dresseurs, un champion, un badge ================= */
const AW=15,AH=12;
const ARENA_CH={1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9};       // chapitre pendant lequel chaque arène se joue
const POSTS=[[4,9,'right'],[10,7,'left'],[4,5,'right']]; // postes des trois dresseurs
const GAPS={8:9,6:5,4:7};                                // passages dans les trois rangées d'obstacles
const BLAB=b=>b==='Piloter'?'Mesurer':b;
const Q=(q,ok,fb,k1,f1,k2,f2)=>({q,o:[[ok,1,fb],[k1,0,f1],[k2,0,f2]]});
