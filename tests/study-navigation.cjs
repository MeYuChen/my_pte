const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');
const vm=require('node:vm'),assert=require('node:assert/strict');
const nodes={content:{innerHTML:'',focus(){}},sidebar:{innerHTML:'',querySelectorAll(){return[]}},showChinese:{addEventListener(type,fn){this.change=fn;}},showHighlights:{addEventListener(type,fn){this.change=fn;}},essay:{classList:{toggle(){}}}};
let changed;const context={window:{scrollTo(){},addEventListener(type,fn){changed=fn;}},document:{getElementById(id){return nodes[id];}},location:{hash:'#index',protocol:'file:'},navigator:{}};
vm.createContext(context);vm.runInContext(read('study-data.js'),context);vm.runInContext(read('study.js'),context);
const data=context.window.WE_STUDY_DATA;assert.equal(data.length,39);assert.equal(new Set(data.map(a=>a.id)).size,39);assert.equal(new Set(data.map(a=>a.category)).size,7);
assert.equal((nodes.content.innerHTML.match(/href="#card\//g)||[]).length,39);
let count=0;
function route(hash){context.location.hash=hash;changed();return nodes.content.innerHTML;}
function links(html){return [...html.matchAll(/href="(#[^"]+)"/g)].map(m=>m[1]);}
const allLinks=new Set(links(nodes.content.innerHTML));
for(const a of data){
 const card=route('#card/'+a.id);assert(card.includes(a.topic.replace(/&/g,'&amp;').replace(/'/g,'&#39;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')));assert(card.includes('#essay/'+a.id));assert(!card.includes('生词'));links(card).forEach(l=>allLinks.add(l));
 const body=route('#essay/'+a.id);assert.equal((body.match(/<p>/g)||[]).length,4);assert(body.includes('#card/'+a.id));links(body).forEach(l=>allLinks.add(l));

 for(const paragraph of a.paragraphs)for(const s of paragraph){assert.equal(s.runs.map(r=>r.text).join(''),s.en);assert(s.cn.trim());assert(s.runs.some(r=>r.variable)||s.en==='Nevertheless, others hold different opinions.');count++;}
}
for(let i=0;i<7;i++){const c=route('#category/'+i);assert(c.includes(data.find(a=>a.category===[...new Set(data.map(a=>a.category))][i]).category));links(c).forEach(l=>allLinks.add(l));}
for(const link of allLinks){const html=route(link);assert(html&&!html.includes('undefined'),link);assert(/<h1>/.test(html),link);}
assert(route('#essay/unknown').includes('一类一类背'));assert(route('#category/-1').includes('一类一类背'));assert(route('#category/999').includes('一类一类背'));
const style=read('study.css');assert(style.includes('font-size: 11px'));assert(style.includes('@media (max-width: 720px)'));assert(style.includes('.essay.hide-cn'));
const sw=read('sw.js');for(const file of ['study.html','study.js','study.css','study-data.js'])assert(sw.includes('./'+file));
assert(read('index.html').includes('href="./study.html"'));
console.log('PASS: 39 cards, 39 four-paragraph essays, '+count+' bilingual sentences, '+allLinks.size+' navigation targets, invalid routes, homepage entry and offline assets.');
