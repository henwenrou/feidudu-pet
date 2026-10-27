const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'docs/app.js'),'utf8');
function harness(){
 let serial=0;const tasks=new Map(),moves=[];
 const elements={};
 for(const id of ['pet','traveler','stage','state','detail','delay','background']){
  const classes=new Set();
  elements[id]={src:'',textContent:'',value:'300000',clientWidth:600,
   classList:{toggle(k,enabled){const on=enabled===undefined?!classes.has(k):enabled;if(on)classes.add(k);else classes.delete(k);},contains(k){return classes.has(k);}},
   addEventListener(){},animate(frames,options){const a={frames,options,cancelled:false,cancel(){this.cancelled=true;}};moves.push(a);return a;}};
 }
 const context=vm.createContext({Date,Math,Number,String,
  document:{getElementById:id=>elements[id],querySelectorAll:()=>[]},
  setTimeout:(fn,ms)=>{tasks.set(++serial,{fn,ms});return serial;},clearTimeout:id=>tasks.delete(id)});
 vm.runInContext(code,context);
 return {elements,tasks,moves,run:s=>vm.runInContext(s,context),fire(){const [id,t]=[...tasks.entries()][0];tasks.delete(id);t.fn();}};
}
const h=harness();
assert.equal([...h.tasks.values()][0].ms,300000);
h.run("enter('left')");const l=h.moves.at(-1);
h.run("enter('right')");const r=h.moves.at(-1);
assert.equal(l.options.duration,960);assert.equal(r.options.duration,960);
assert.equal(l.frames[1].transform,'translateX(-96px)');assert.equal(r.frames[1].transform,'translateX(96px)');
assert(h.elements.pet.classList.contains('right'));
for(const width of [250,320,600]){
 h.elements.stage.clientWidth=width;
 h.run("enter('left')");const a=h.moves.at(-1).frames[1].transform;
 h.run("enter('right')");const b=h.moves.at(-1).frames[1].transform;
 assert.equal(Math.abs(parseFloat(a.match(/-?[\d.]+/)[0])),Math.abs(parseFloat(b.match(/-?[\d.]+/)[0])));
}
h.run("enter('work')");assert.equal(h.tasks.size,0);
h.run("enter('waiting')");assert.equal(h.tasks.size,0);
h.run("enter('idle')");const stale=[...h.tasks.values()][0].fn;
h.run("enter('work')");stale();assert.equal(h.run('mode'),'work');
h.run("enter('idle')");h.fire();assert.equal(h.run('mode'),'sleep');
h.fire();assert.match(h.elements.pet.src,/sleep.webp/);
h.run("choose('work')");assert.equal(h.run('mode'),'waking');h.fire();assert.equal(h.run('mode'),'work');
h.run("enter('complete')");assert.equal([...h.tasks.values()][0].ms,3670);h.fire();assert.equal(h.run('mode'),'idle');
assert.equal(h.run('gazeIndex(0,-100)'),0);
assert.equal(h.run('gazeIndex(100,0)'),4);
assert.equal(h.run('gazeIndex(0,100)'),8);
assert.equal(h.run('gazeIndex(-100,0)'),12);
h.run("enter('look')");assert.equal(h.tasks.size,0);
for(const filename of ['idle.gif','work.gif','waiting.gif','walk-left.gif','celebrate-draft.gif','fall-asleep.gif','sleep.gif','wake-up.gif'])assert(fs.existsSync(path.join(root,'assets',filename)));
console.log('PASS: symmetric distance/cadence, small screens, work/input guards, sleep/wake, stale timers, celebration return, assets.');
