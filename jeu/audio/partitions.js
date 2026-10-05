/* Wattlings · jeu/audio/partitions.js
   Les musiques chiptune (compositions originales), écrites note par note. */

const NI={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function nf(t){const m=/^([A-G])(#|b)?(\d)$/.exec(t);if(!m)return 0;const midi=12*(+m[3]+1)+NI[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0);return 440*Math.pow(2,(midi-69)/12)}
const tok=s=>s.replace(/\|/g,' ').trim().split(/\s+/);
const bars=(map,order)=>tok(order.split(' ').map(k=>map[k]).join(' '));
function mk(bpm,voices,drums,once){const v=voices.map(([w,vol,s])=>({w,vol,s:Array.isArray(s)?s:tok(s)}));const d=drums?tok(drums):null;return{bpm,v,d,once,len:Math.max(...v.map(x=>x.s.length),d?d.length:0)}}
const rep=(s,n)=>Array(n).fill(s).join(' ');
const TRACKS={
  title:mk(116,[
    ['p50',.10,'C5 - - - G4 - C5 - | E5 - - - D5 - C5 - | F5 - - - A5 - F5 - | G5 - - - - - . . | A5 - G5 - E5 - C5 - | F5 - E5 - D5 - C5 - | D5 - E5 - F5 - D5 - | C5 - - - - - . .'],
    ['p25',.045,bars({C:'E4 G4 C5 G4 E4 G4 C5 G4',F:'F4 A4 C5 A4 F4 A4 C5 A4',G:'D4 G4 B4 G4 D4 G4 B4 G4',Am:'E4 A4 C5 A4 E4 A4 C5 A4'},'C C F G Am F G C')],
    ['tri',.16,bars({C:'C3 - - - G2 - - -',F:'F2 - - - C3 - - -',G:'G2 - - - D3 - - -',Am:'A2 - - - E2 - - -'},'C C F G Am F G C')]],rep('k . h . s . h .',8)),
  town:mk(138,[
    ['p50',.10,'E5 - G5 - C6 - B5 A5 | G5 - E5 - C5 - D5 E5 | F5 - A5 - C6 - A5 F5 | G5 - - - D5 - . . | E5 - G5 - C6 - D6 E6 | D6 - C6 - A5 - G5 A5 | F5 - A5 - G5 - F5 D5 | C5 - - - . . . .'],
    ['p12',.05,bars({C:'. G4 . E4 . G4 . E4',Am:'. A4 . E4 . A4 . E4',F:'. A4 . F4 . A4 . F4',G:'. B4 . G4 . B4 . D5'},'C Am F G C Am F G')],
    ['tri',.16,bars({C:'C3 . C4 . G2 . C3 .',Am:'A2 . A3 . E2 . A2 .',F:'F2 . F3 . C3 . F2 .',G:'G2 . G3 . D3 . G2 .'},'C Am F G C Am F G')]],rep('k . h . s . h h',8)),
  indoor:mk(108,[
    ['p25',.09,'A4 - C5 - F5 - E5 - | D5 - - - A4 - - - | D5 - F5 - Bb5 - A5 G5 | A5 - G5 - E5 - - - | A4 - C5 - F5 - G5 A5 | Bb5 - A5 - F5 - D5 - | G5 - Bb5 - A5 - G5 E5 | F5 - - - - - . .'],
    ['p12',.035,bars({F:'F4 A4 C5 A4 F4 A4 C5 A4',Dm:'D4 F4 A4 F4 D4 F4 A4 F4',Bb:'D4 F4 Bb4 F4 D4 F4 Bb4 F4',C:'E4 G4 C5 G4 E4 G4 C5 G4'},'F Dm Bb C F Dm Bb C')],
    ['tri',.15,bars({F:'F2 - - - C3 - - -',Dm:'D2 - - - A2 - - -',Bb:'Bb1 - - - F2 - - -',C:'C2 - - - G2 - - -'},'F Dm Bb C F Dm Bb C')]],rep('h . . . h . . .',8)),
  night:mk(92,[
    ['p25',.08,'A4 - - - C5 - B4 - | G#4 - - - E4 - - - | A4 - - - C5 - D5 - | E5 - - - D5 C5 B4 G#4 | A4 - E5 - - - D5 C5 | D5 - F5 - - - E5 D5 | C5 - B4 - A4 - G#4 - | B4 - - - - - . .'],
    ['p12',.035,bars({Am:'A3 C4 E4 C4 A3 C4 E4 C4',E:'G#3 B3 E4 B3 G#3 B3 E4 B3',F:'A3 C4 F4 C4 A3 C4 F4 C4',Dm:'A3 D4 F4 D4 A3 D4 F4 D4'},'Am E F E Am Dm Am E')],
    ['tri',.14,bars({Am:'A2 - - - - - - -',E:'E2 - - - - - - -',F:'F2 - - - - - - -',Dm:'D2 - - - - - - -'},'Am E F E Am Dm Am E')]],rep('k . . . . . h .',8)),
  battle:mk(172,[
    ['p50',.10,'E5 - G5 - B5 - A5 G5 | F#5 - D5 - E5 - - - | E5 - G5 - C6 - B5 A5 | B5 - - - F#5 - D5 - | E6 - D6 - B5 - G5 - | A5 - G5 - E5 - C5 - | A5 - C6 - B5 - A5 G5 | F#5 - - - D#5 - B4 -'],
    ['p25',.045,bars({Em:'E4 G4 B4 G4 E4 G4 B4 G4',C:'E4 G4 C5 G4 E4 G4 C5 G4',D:'F#4 A4 D5 A4 F#4 A4 D5 A4',Am:'E4 A4 C5 A4 E4 A4 C5 A4',B:'F#4 B4 D#5 B4 F#4 B4 D#5 B4'},'Em Em C D Em C Am B')],
    ['tri',.17,bars({Em:'E2 E3 E2 E3 E2 E3 E2 E3',C:'C2 C3 C2 C3 C2 C3 C2 C3',D:'D2 D3 D2 D3 D2 D3 D2 D3',Am:'A1 A2 A1 A2 A1 A2 A1 A2',B:'B1 B2 B1 B2 B1 B2 B1 B2'},'Em Em C D Em C Am B')]],rep('k h s h k k s h',8)),
  victory:mk(150,[['p50',.11,'C5 E5 G5 C6 - - G5 - C6 - - - - - . .'],['p25',.05,'E4 G4 C5 E5 - - C5 - E5 - - - - - . .'],['tri',.16,'C3 - - - - - G2 - C3 - - - - - . .']],'k . . . s . . . k . . . . . . .',true),
  badge:mk(140,[['p50',.11,'G5 - G5 G5 C6 - - - E6 - D6 - C6 - - - . .'],['p25',.05,'E5 - E5 E5 G5 - - - C6 - B5 - G5 - - - . .'],['tri',.16,'C3 - - - C3 - - - G2 - G2 - C3 - - - . .']],null,true),
  evo:mk(130,[['p50',.10,'C5 E5 G5 C6 D5 F5 A5 D6 E5 G5 B5 E6 F5 A5 C6 F6 G5 - B5 - D6 - G6 - - - - - - - . .'],['tri',.16,'C3 - - - D3 - - - E3 - - - F3 - - - G2 - - - G2 - - - C3 - - - - - . .']],'. . . . . . . . . . . . . . . . s . s . s . k . . . . . . . . .',true)
};
