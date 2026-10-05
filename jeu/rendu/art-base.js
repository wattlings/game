/* Wattlings · jeu/rendu/art-base.js
   Rendu détaillé : outils communs (teinte, petits canevas). */

/* ================= RENDU DÉTAILLÉ =================
   Même grille (cases de 16 px) que le reste du jeu, mais chaque élément est travaillé au pixel : dégradés à plusieurs tons,
   contours, lumière venant du haut à gauche, textures. Les arbres dépassent sur la case du dessus (on passe derrière leur cime),
   les personnages et les objets reçoivent un contour et une ombre de volume. Tous les dessins sont générés ici, par le code. */
const _tc={};
function tint(h,k){
  const key=h+'|'+k;if(_tc[key])return _tc[key];if(h.length===4)h='#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3];
  const n=parseInt(h.slice(1),16);if(isNaN(n))return h;const f=v=>{v=k>=0?v+(255-v)*k:v*(1+k);return Math.max(0,Math.min(255,Math.round(v)))};
  return _tc[key]='#'+((1<<24)|(f(n>>16)<<16)|(f((n>>8)&255)<<8)|f(n&255)).toString(16).slice(1);
}
const mkc=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const ART={tree:null,bush:null,rock:null};
