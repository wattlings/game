/* Wattlings · jeu/audio/moteur.js
   Moteur sonore : synthèse, lecture des pistes, bruitages, réglage du son. */

/* ================= MUSIQUE CHIPTUNE (compositions originales) ================= */
const AUD={ctx:null,on:false,master:null,waves:{},noise:null,cur:null,curName:null,want:null,step:0,next:0,jingle:false};
try{if(localStorage.getItem(CLE_SON)==='on')AUD.on=true}catch(e){}
function audInit(){
  if(!AUD.on)return;
  if(AUD.ctx){if(AUD.ctx.state==='suspended')AUD.ctx.resume();return}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  try{
    const c=AUD.ctx=new AC();AUD.master=c.createGain();AUD.master.gain.value=AUD.on?.5:0;AUD.master.connect(c.destination);
    [['p50',.5],['p25',.25],['p12',.125]].forEach(([k,d])=>{const n=40,re=new Float32Array(n),im=new Float32Array(n);for(let i=1;i<n;i++)re[i]=(2/(i*Math.PI))*Math.sin(i*Math.PI*d);AUD.waves[k]=c.createPeriodicWave(re,im)});
    const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AUD.noise=b;
    qkInterval(schedule,25);
    if(AUD.want){const w=AUD.want;AUD.want=null;playTrack(w)}
  }catch(e){AUD.ctx=null}
}
function tone(w,f,t,dur,vol,slide){
  const c=AUD.ctx;if(!c||!f)return;const o=c.createOscillator(),g=c.createGain();
  if(w==='tri')o.type='triangle';else o.setPeriodicWave(AUD.waves[w]);
  o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.006);g.gain.setTargetAtTime(vol*.65,t+.02,.09);g.gain.setTargetAtTime(0,t+Math.max(.02,dur*.88),.025);
  o.connect(g).connect(AUD.master);o.start(t);o.stop(t+dur+.15);
}
function drum(k,t){
  const c=AUD.ctx;if(!c)return;
  if(k==='k'){tone('tri',150,t,.12,.35,40);return}
  const s=c.createBufferSource();s.buffer=AUD.noise;const f=c.createBiquadFilter(),g=c.createGain();
  f.type=k==='s'?'bandpass':'highpass';f.frequency.value=k==='s'?1800:7000;const dur=k==='s'?.12:.035;
  g.gain.setValueAtTime(k==='s'?.22:.09,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f).connect(g).connect(AUD.master);s.start(t);s.stop(t+dur+.02);
}
function schedule(){
  const c=AUD.ctx,T=AUD.cur;if(!c||!T)return;const sd=60/T.bpm/2;
  while(AUD.next<c.currentTime+.15){
    const i=AUD.step;
    T.v.forEach(v=>{const n=v.s[i%v.s.length];if(n&&n!=='-'&&n!=='.'){let len=1;while(v.s[(i+len)%v.s.length]==='-'&&len<v.s.length)len++;tone(v.w,nf(n),AUD.next,len*sd,v.vol)}});
    if(T.d){const n=T.d[i%T.d.length];if(n&&n!=='.')drum(n,AUD.next)}
    AUD.step++;AUD.next+=sd;
    if(T.once&&AUD.step>=T.len){const cb=T.cb;AUD.cur=null;qkTimeout(()=>cb&&cb(),Math.max(0,(AUD.next-c.currentTime)*1000));break}
  }
}
function playTrack(name){
  AUD.want=name;if(!AUD.ctx||AUD.jingle)return;if(AUD.curName===name&&AUD.cur)return;
  AUD.cur=TRACKS[name];AUD.curName=name;AUD.step=0;AUD.next=AUD.ctx.currentTime+.06;
}
function jingle(name,cb){
  if(!AUD.ctx){if(cb)cb();return}
  AUD.jingle=true;const T=Object.assign({},TRACKS[name]);T.cb=()=>{AUD.jingle=false;AUD.curName=null;if(AUD.want)playTrack(AUD.want);if(cb)cb()};
  AUD.cur=T;AUD.curName='#'+name;AUD.step=0;AUD.next=AUD.ctx.currentTime+.05;
}
function sndUI(){const b=ROOT.getElementById('sndBtn');if(b){b.textContent=AUD.on?'♪ Son':'♪ Muet';b.setAttribute('aria-pressed',AUD.on)}}
function setSound(on){trk('setting',{k:'son',v:on});AUD.on=on;try{localStorage.setItem(CLE_SON,on?'on':'off')}catch(e){}if(on){audInit();if(AUD.ctx){AUD.ctx.resume();AUD.master.gain.setTargetAtTime(.5,AUD.ctx.currentTime,.05)}updateMusic()}else if(AUD.master){AUD.master.gain.setTargetAtTime(0,AUD.ctx.currentTime,.05);AUD.ctx.suspend()}sndUI()}
let lastBlip=0;
function sfx(n){
  const c=AUD.ctx;if(!c||!AUD.on)return;const t=c.currentTime+.01;
  switch(n){
    case 'blip':if(t-lastBlip<.05)return;lastBlip=t;tone('p50',1180,t,.025,.035);break;
    case 'select':tone('p25',880,t,.04,.06);tone('p25',1320,t+.045,.05,.06);break;
    case 'good':tone('p50',1047,t,.07,.07);tone('p50',1319,t+.07,.07,.07);tone('p50',1568,t+.14,.14,.07);break;
    case 'bad':tone('p25',220,t,.16,.08,150);break;
    case 'bump':tone('tri',110,t,.06,.18,70);break;
    case 'roll':tone('tri',200,t,.13,.1,420);break;
    case 'door':{const s=c.createBufferSource();s.buffer=AUD.noise;const f=c.createBiquadFilter(),g=c.createGain();f.type='bandpass';f.frequency.setValueAtTime(2500,t);f.frequency.exponentialRampToValueAtTime(400,t+.2);g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);s.connect(f).connect(g).connect(AUD.master);s.start(t);s.stop(t+.25);break}
    case 'encounter':['C5','E5','G5','C6','E5','G5','C6','E6'].forEach((x,i)=>tone('p50',nf(x),t+i*.045,.045,.06));break;
    case 'wind':{const s=c.createBufferSource();s.buffer=AUD.noise;const f=c.createBiquadFilter(),g=c.createGain();f.type='bandpass';f.frequency.setValueAtTime(400,t);f.frequency.linearRampToValueAtTime(1200,t+.3);f.frequency.linearRampToValueAtTime(300,t+.7);g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(.25,t+.15);g.gain.exponentialRampToValueAtTime(.001,t+.8);s.connect(f).connect(g).connect(AUD.master);s.start(t);s.stop(t+.85);break}
    case 'secret':['C6','G5','E6','C6','G6'].forEach((x,i)=>tone('p50',nf(x),t+i*.07,.07,.07));break;
  }
}
function musicFor(){
  if(ROOT.querySelector('.title-screen'))return 'title';
  if(ROOT.querySelector('.battle'))return 'battle';
  if(S.ch===7||S.map==='cave')return 'night';
  return S.map==='town'?'town':'indoor';
}
function updateMusic(){playTrack(musicFor())}
['pointerdown','keydown'].forEach(ev=>addEventListener(ev,()=>{if(QK_HOST.hidden||!AUD.on)return;audInit();if(!AUD.cur&&!AUD.jingle)updateMusic()},{passive:true}));
