/* Browser-only simulation; no access to Codex tasks or credentials. */
const pet=document.getElementById('pet'), traveler=document.getElementById('traveler');
const stage=document.getElementById('stage'), label=document.getElementById('state');
const detail=document.getElementById('detail'), delay=document.getElementById('delay');
let mode='idle', timer=null, revision=0, movement=null;
const WALK_MS=960;
const assets={idle:'idle.gif',work:'work.gif',waiting:'waiting.gif',left:'walk-left.gif',right:'walk-left.gif',complete:'celebrate-draft.gif',sleep:'fall-asleep.gif',waving:'waving.gif',jumping:'jumping.gif',review:'review.gif',failed:'failed.gif'};
const labels={idle:'空闲中',work:'正在工作',waiting:'需要你的回答',left:'向左移动',right:'向右移动',complete:'任务完成 · 庆祝草稿',sleep:'困了，躺一会儿…',waving:'挥手打招呼',jumping:'开心跳一下',review:'检查刚完成的工作',failed:'遇到问题 · 有点失落'};
assets.look='look-loop.webp';labels.look='视线跟随';
function show(file){pet.src='../assets/'+file.replace(/\.gif$/,'.webp')+'?edges=2&play='+revision+'-'+Date.now();}
function later(ms,fn){const current=revision;timer=setTimeout(()=>{if(current===revision)fn();},ms);}
function walkDistance(width){return Math.max(0,Math.min(96,(width-192)/2-12));}
function enter(next){
 clearTimeout(timer);if(movement)movement.cancel();movement=null;
 revision++;mode=next;pet.classList.toggle('right',next==='right');show(assets[next]);
 label.textContent=labels[next];detail.textContent=next==='waiting'?'等你回答，不会自动睡着':next==='work'?'工作中，不启动睡眠计时':'等待下一条指令';
 document.querySelectorAll('[data-state]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.state===next)));
 if(next==='left'||next==='right'){
  const distance=walkDistance(stage.clientWidth),sign=next==='left'?-1:1;
  detail.textContent=`移动 ${Math.round(distance)}px · 960ms · 左右对称`;
  movement=traveler.animate([{transform:'translateX(0)'},{transform:`translateX(${sign*distance}px)`}],{duration:WALK_MS,easing:'linear',fill:'forwards'});
  // Stop at the end of one cycle without sliding back to the center.
  later(WALK_MS,()=>{show('idle.gif');detail.textContent='到达 · 点击动作继续';});
 }
 if(next==='idle')later(Number(delay.value),()=>enter('sleep'));
 if(next==='sleep')later(1950,()=>{show('sleep.gif');label.textContent='睡着了 · zzz';detail.textContent='新指令会唤醒他';});
 if(next==='complete')later(3670,()=>enter('idle'));
 if(next==='look')detail.textContent='在角色周围移动指针 · 16个方向';
}
function choose(next){
 if(mode==='sleep'&&next!=='sleep'){
  clearTimeout(timer);revision++;mode='waking';show('wake-up.gif');label.textContent='醒来啦…';later(950,()=>enter(next));
 }else enter(next);
}
document.querySelectorAll('[data-state]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.state)));
delay.addEventListener('change',()=>{if(mode==='idle')enter('idle');});
document.getElementById('background').addEventListener('click',()=>stage.classList.toggle('dark'));
function gazeIndex(dx,dy){return Math.round((Math.atan2(dx,-dy)*180/Math.PI+360)%360/22.5)%16;}
stage.addEventListener('pointermove',event=>{
 if(mode!=='look')return;
 const bounds=stage.getBoundingClientRect();
 const dx=event.clientX-(bounds.left+bounds.width/2),dy=event.clientY-(bounds.top+bounds.height/2-40);
 if(Math.hypot(dx,dy)<24){pet.src='../assets/idle.webp?edges=2';return;}
 const index=gazeIndex(dx,dy);
 const source='../assets/look-'+String(index).padStart(2,'0')+'.png';
 if(pet.getAttribute('src')!==source)pet.src=source;
});
stage.addEventListener('pointerleave',()=>{if(mode==='look')pet.src='../assets/idle.webp?edges=2';});
enter('idle');

// Dedicated gaze demo: independent from the animation state machine.
const gazePet=document.getElementById('gaze-pet');
if(gazePet){
 const gazeToggle=document.getElementById('gaze-toggle'),status=document.getElementById('gaze-status');
 let tracking=true,lastDirection=-1;
 const directionButtons=[];
 function setDirection(index){
  if(index===lastDirection)return;
  lastDirection=index;gazePet.src='../assets/look-'+String(index).padStart(2,'0')+'.png';
  status.textContent='视线方向 '+(index+1)+'/16 · '+(index*22.5)+'°';
  directionButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
 }
 for(let i=0;i<16;i++){
  const button=document.createElement('button');button.type='button';button.textContent=(i*22.5)+'°';
  button.setAttribute('aria-label','视线方向 '+(i*22.5)+' 度，0 度为上方，顺时针');
  button.addEventListener('click',()=>setDirection(i));
  document.getElementById('directions').appendChild(button);directionButtons.push(button);
 }
 document.addEventListener('pointermove',event=>{
  if(!tracking||event.target.closest('#directions'))return;
  const rect=gazePet.getBoundingClientRect();
  const dx=event.clientX-(rect.left+rect.width/2),dy=event.clientY-(rect.top+rect.height*.35);
  if(Math.hypot(dx,dy)>12)setDirection(gazeIndex(dx,dy));
 });
 document.getElementById('gaze-stage').addEventListener('pointerdown',event=>{
  if(!tracking)return;const rect=gazePet.getBoundingClientRect();
  setDirection(gazeIndex(event.clientX-rect.left-rect.width/2,event.clientY-rect.top-rect.height*.35));
 });
 gazeToggle.addEventListener('click',()=>{tracking=!tracking;gazeToggle.setAttribute('aria-pressed',String(tracking));gazeToggle.textContent='眼神跟随：'+(tracking?'开启':'暂停');});
 setDirection(0);
 const motions=[['idle','idle','空闲','原生'],['work','work','抱着电脑工作','原生'],['waiting','waiting','等待回答','原生'],['left','walk-left','向左移动','原生'],['right','walk-right','向右移动','原生'],['waving','waving','挥手','原生'],['jumping','jumping','跳跃','原生'],['failed','failed','遇到问题','原生'],['review','review','检查工作','原生'],['complete','celebrate-draft','完成庆祝','扩展 · 草稿'],['sleep','sleep-preview','躺下与睡觉','扩展']];
 motions.forEach(([state,file,title,kind])=>{
  const button=document.createElement('button');button.className='motion-card';button.type='button';
  const img=document.createElement('img');img.src='../assets/'+file+'.webp';img.alt=title;img.loading='eager';img.width=144;img.height=156;
  const name=document.createElement('strong');name.textContent=title;
  const badge=document.createElement('small');badge.textContent=kind+' · 点击播放';
  button.append(img,name,badge);button.addEventListener('click',()=>{choose(state);document.getElementById('motions').scrollIntoView({block:'start'});});
  document.getElementById('gallery').appendChild(button);
 });
}
