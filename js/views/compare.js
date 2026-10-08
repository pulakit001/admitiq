/* ---------- compare: colleges, measures, weighted scoring ---------- */
const BASEM=[{k:'feesLakh',l:'Annual fees',dir:-1,mx:12,u:'₹L'},{k:'placementLPA',l:'Median placement',dir:1,mx:30,u:'LPA'},{k:'scholarshipPct',l:'Scholarship share',dir:1,mx:60,u:'%'},{k:'internshipPct',l:'Internship rate',dir:1,mx:100,u:'%'}];
state.measures=state.measures.map(m=>Object.assign({},BASEM.find(b=>b.k===m.k)||{},m,m.custom?{dir:1}:{}));
const SUGGEST=['Campus life','Hostel quality','Startup culture','Sports facilities','Research exposure','Safety and location'];
const mOf=k=>state.measures.find(m=>m.k===k);
const mslug=l=>lkey(l);
function addMeasure(l){const k='c_'+mslug(l);if(state.measures.some(m=>m.k===k))return;state.measures=state.measures.concat([{k,l,custom:1}]);if(state.CW[k]==null)state.CW[k]=2;persist('measures');persist('CW')}
function val(c,m){if(m.custom){const s=(c.customScores||[]).find(x=>mslug(x.measure)===m.k.slice(2));return s&&s.score!=null?(+s.score||0):null}
 const v=m.k==='feesLakh'?c.feesLakhPerYear:c[m.k];return typeof v==='number'?v:(parseFloat(v)||null)}
function norm(v,m){if(v==null)return null;const x=m.custom?Math.max(0,Math.min(1,v/10)):Math.max(0,Math.min(1,v/m.mx));return m.dir>0?x:1-x}
function wsum(){return state.measures.reduce((s,m)=>s+(state.CW[m.k]||0),0)}
function score(c){const w=wsum();return w?Math.round(state.measures.reduce((s,m)=>{const x=norm(val(c,m),m);return s+(x!=null?x*(state.CW[m.k]||0):0)},0)/w*100):0}
function renderCompare(){
 if(state.cmpStage==='dash'&&(state.cmpStory||state.cmpError||busy.cmp)){renderCmpDash();return}
 V.innerHTML=head('Compare','Compare colleges')+`
 <div class="story"><div class="lb">Step 1 · The colleges</div><p class="sub" style="margin-top:6px">Type any college name and press Enter. Up to four.</p>
 <form class="own" id="caf" style="margin-top:10px"><input class="fld" id="can" placeholder="e.g. BITS Pilani" aria-label="College name"><button class="dk">Add</button></form>
 <div class="chs" style="margin-top:12px">${state.cmpList.map((n,i)=>`<span class="cchip">${esc(n)}<button data-rm="${i}" aria-label="Remove ${esc(n)}">×</button></span>`).join('')||'<span class="sub">None added yet.</span>'}</div></div>
 <div class="story" style="margin-top:14px"><div class="lb">Step 2 · What should the AI compare?</div><p class="sub" style="margin-top:6px">Keep the built-ins or add any measure you want — then weight each 0–3.</p>
 <form class="own" id="maf"><input class="fld" id="man" placeholder="Add any measure, e.g. how the campus feels" aria-label="Custom measure"><button class="dk">Add measure</button></form>
 <div style="margin-top:12px" class="chs">${state.measures.map(m=>`<span class="mchip">${esc(m.l)}<button data-mrm="${m.k}" aria-label="Remove ${esc(m.l)}">×</button></span>`).join('')||'<span class="sub">No measures yet.</span>'}</div>
 <div class="lb" style="margin:18px 0 4px">Suggested extras</div>
 <div class="chs">${SUGGEST.filter(s=>!state.measures.some(m=>mslug(m.l)===mslug(s))).map(s=>`<button class="ch sm" data-sug="${esc(s)}">+ ${esc(s)}</button>`).join('')||'<span class="sub">All suggestions added.</span>'}</div>
 <div class="lb" style="margin:18px 0 4px">How much does each matter? (0 ignores it, 3 decides)</div>
 <div style="max-width:520px">${state.measures.map(m=>`<div class="wr"><span class="lbl">${esc(m.l)}</span><input type="range" min="0" max="3" step="1" value="${state.CW[m.k]||0}" data-k="${m.k}" aria-label="${esc(m.l)} weight"><b>${state.CW[m.k]||0}</b></div>`).join('')}</div>
 <label class="lb">Anything else the AI should factor in?</label>
 <textarea class="fld" id="cctx" placeholder="e.g. I want to stay close to home, I care about coding clubs…">${esc(state.cmpCtx)}</textarea>
 </div>
 ${state.cmpStory?`<div class="card" style="margin-top:14px"><div class="lb">Previous comparison</div><p class="sub" style="margin:8px 0 0">AI picked ${esc(state.cmpStory.verdict||'—')}</p><button class="ch sm" id="prevC" style="margin-top:10px">Open last dashboard →</button></div>`:''}
 <div class="own" style="margin-top:16px"><button class="dk big" id="runC" ${state.cmpList.length<2||state.measures.length===0?'disabled':''}>Compare with AI</button><span class="sub" style="align-self:center">${state.cmpList.length<2?'Add at least two colleges.':state.measures.length===0?'Add at least one measure.':'Press Enter or the button — the dashboard replaces this page.'}</span></div>`;
 $('#caf').onsubmit=e=>{e.preventDefault();const n=$('#can').value.trim();if(!n||state.cmpList.length>=4)return;if(!state.cmpList.some(x=>lkey(x)===lkey(n)))state.cmpList.push(n);state.cmpStory=null;persist('cmpList');persist('cmpStory');renderCompare()};
 $('#maf').onsubmit=e=>{e.preventDefault();const l=$('#man').value.trim();if(!l)return;addMeasure(l);state.cmpStory=null;persist('cmpStory');renderCompare()};
 $$('#v [data-rm]').forEach(b=>b.onclick=()=>{state.cmpList.splice(+b.dataset.rm,1);state.cmpStory=null;persist('cmpList');persist('cmpStory');renderCompare()});
 $$('#v [data-mrm]').forEach(b=>b.onclick=()=>{state.measures=state.measures.filter(m=>m.k!==b.dataset.mrm);state.cmpStory=null;persist('measures');persist('cmpStory');renderCompare()});
 $$('#v [data-sug]').forEach(b=>b.onclick=()=>{addMeasure(b.dataset.sug);state.cmpStory=null;persist('cmpStory');renderCompare()});
 $$('#v .wr input').forEach(r=>r.oninput=()=>{state.CW[r.dataset.k]=+r.value;r.parentElement.querySelector('b').textContent=r.value;state.cmpStory=null;persist('CW');persist('cmpStory')});
 $('#cctx').oninput=e=>{state.cmpCtx=e.target.value;persist('cmpCtx')};
 $('#runC').onclick=runCompare;
 const pc=$('#prevC');if(pc)pc.onclick=()=>{state.freshSession=false;state.cmpStage='dash';renderCompare()}}
const needsResearch=n=>{const d=state.research[lkey(n)];if(!d||d._error)return true;const cust=state.measures.filter(m=>m.custom);if(!cust.length)return false;const have=(d.customScores||[]).map(s=>mslug(s.measure));return !cust.every(m=>have.includes(mslug(m.l)))};
async function researchIf(name){const k=lkey(name);if(state.research[k]&&!state.research[k]._error&&!needsResearch(name))return Promise.resolve();busy[k]=true;renderCompare();
 try{const r=await researchCollege(name);state.research[k]=r;persist('research')}
 catch(e){state.research[k]={_error:e.message,name};persist('research')}
 busy[k]=false}
async function researchCollege(name){
 const cm=state.measures.filter(m=>m.custom).map(m=>m.l);
 const r=await aiJSON(`Research the real Indian college or university "${name}". If the name is ambiguous pick the most well-known and say which in "note". Return JSON with keys: name (official), city, state, established (founding year, number), feesLakhPerYear (typical UG annual fees in ₹ lakh, number), placementLPA (median placement in LPA, number, 0 if unknown), scholarshipPct (number), internshipPct (number), studentsPerTeacher (number), admissionExam, cutoff (typical entrance cut-off for a general-category student, short string), campusFacilities (array up to 5: hostels, labs, library, sports and so on), hostelQuality (one short phrase), topPrograms (array up to 5), notableFor (one sentence), topCareerOutcomes (array up to 4 job fields), studentVoice ({sentiment: "positive"|"mixed"|"negative", themes: array up to 4 short recurring themes from student discussions and forums such as Reddit — treat as a supporting signal only, not fact}), website, confidence ("high"|"medium"|"low"), note (one short sentence)${cm.length?`, customScores (array with exactly ${cm.length} items, in this order): the measures are ${JSON.stringify(cm)} — return each as {"measure": <the exact measure string>, "score": <0-10 number judging this college on it>, "note": <one sentence>}`:''}`,{grounded:true,max:1900});
 const d=r.data;if(!d||!d.name)throw new Error('No usable data');d._live=r.live;return d}
async function runCompare(){if(state.cmpList.length<2)return;state.cmpStage='dash';state.freshSession=false;state.cmpError=null;busy.cmp=true;renderCompare();
 try{
  for(const n of state.cmpList){const k=lkey(n);if(needsResearch(n)){await researchCollege(n).then(d=>{state.research[k]=d;persist('research')}).catch(e=>{state.research[k]={_error:e.message,name:n};persist('research')})}}
  state.cmpStory=await aiCompareStory();persist('cmpStory');
 }catch(e){state.cmpError='The AI could not finish the comparison: '+e.message}
 busy.cmp=false;show('compare')}
async function aiCompareStory(){
 const got=state.cmpList.map(n=>({n,d:state.research[lkey(n)]})).filter(x=>x.d&&!x.d._error);
 const ms=state.measures.filter(m=>state.CW[m.k]>0).map(m=>({measure:m.l,weight:state.CW[m.k]}));
 const r=await aiJSON(`A student is choosing between these Indian colleges. Researched data: ${JSON.stringify(got.map(x=>Object.assign({college:x.d.name},x.d)))}. The measures that matter and their weights (0-3): ${JSON.stringify(ms)}.${state.profile&&state.profile.answers?' The student\u2019s own answers: '+JSON.stringify(state.profile.answers)+'.':''}${state.cmpCtx?' Extra context from the student: '+state.cmpCtx+'.':''}
 Compute nothing yourself — judge from the data. Return JSON {"summary": "2-3 sentences: what the numbers say overall","verdict": "<name of the winning college>","whyLeader": "2-3 sentences on why it is the right pick for THIS student","takes": [one object per college: {"name","take" (2 sentences: how well it fits this student),"vs" (1 sentence: how it stands against the leader, or 'this is the leader')}],"watchOut": "1 sentence: the biggest trade-off to keep in mind"}`,{grounded:false,temp:.4,max:1600});
 const d=r.data;if(!d||!d.verdict)throw new Error('No analysis came back');d._live=r.live;return d}
function renderCmpDash(){
 const got=state.cmpList.map(n=>({n,d:state.research[lkey(n)]}));
 const ok=got.filter(x=>x.d&&!x.d._error),missing=got.filter(x=>!x.d||x.d._error||needsResearch(x.n));
 let top='';
 if(busy.cmp)top=`<div class="story">`+ld('The AI is researching and judging your colleges…')+`<p class="sub">Researching ${esc(got.filter(x=>!x.d||!x.d.customScores&&state.measures.some(m=>m.custom)).map(x=>x.n).join(', ')||'your measures')}. This page becomes the dashboard when it is done.</p></div>`;
 else if(state.cmpError)top=`<div class="story"><p class="err">${esc(state.cmpError)}</p><button class="dk" id="crtry">Try again</button></div>`;
 else if(state.cmpStory)top=`<div class="story"><div class="lb">The AI's call${state.cmpStory._live===false?' · from AI knowledge':''}</div><div class="verdict">${esc(state.cmpStory.verdict)}</div><p>${esc(state.cmpStory.summary||'')}</p><p><b>Why it is right for you:</b> ${esc(state.cmpStory.whyLeader||'')}</p>${state.cmpStory.watchOut?`<p class="sub"><b style="color:var(--ink)">Watch out:</b> ${esc(state.cmpStory.watchOut)}</p>`:''}</div>`;
 else top=`<div class="story"><p class="sub">Run the comparison to get the AI's call.</p><button class="dk" id="crtry">Run comparison</button></div>`;
 V.innerHTML=head('Compare','Your comparison')+top+`
 <div class="actions">
 <button class="act" id="cedit">✎ Edit setup</button>
 <button class="act" id="crewrite">✍ Rewrite AI analysis</button>
 ${missing.length?'<button class="act" id="crerun">⟳ Re-research missing data</button>':''}
 </div>
 ${ok.length?`<div class="vgrid" style="grid-template-columns:repeat(${Math.min(ok.length,4)},1fr)">${(()=>{const scores=ok.map(x=>score(x.d)),best=Math.max(...scores);return ok.map((x,j)=>`<div class="vd"><div class="lb">${esc(x.d.name)}</div><div class="mid">${scores[j]}%</div><div class="bar"><i class="${scores[j]===best?'w':''}" style="width:${scores[j]}%"></i></div></div>`).join('')})()}</div>
 <div class="card mxs" style="margin-top:14px;padding:18px 20px">
 <div class="lb">Measure by measure ${state.measures.length?'· sliders on the setup page re-weight':''}</div>
 <div class="row h" style="display:grid;grid-template-columns:130px repeat(${ok.length},1fr)"><span class="lb">Measure</span>${ok.map(x=>`<b>${esc(x.d.name)}</b>`).join('')}</div>
 ${state.measures.map(m=>{const vs=ok.map(x=>val(x.d,m)),defined=vs.map((v,i)=>({v,i})).filter(z=>z.v!=null),t=defined.length?(m.custom?Math.max(...defined.map(z=>z.v)):(m.dir>0?Math.max(...defined.map(z=>z.v)):Math.min(...defined.map(z=>z.v)))):null;
  return`<div class="row" style="grid-template-columns:130px repeat(${ok.length},1fr)"><span class="lb">${esc(m.l)}${m.custom?' <span class="sub">(AI-scored /10)</span>':''}<br><small class="sub">weight ×${state.CW[m.k]||0}</small></span>${ok.map((x,j)=>{const v=vs[j];
   return v==null?'<div class="v sub">—</div>':`<div class="${t!=null&&v===t?'best':''}"><div class="v">${m.custom?v+'<small>/10</small>':v+'<small>'+(m.u||'')+'</small>'}</div><div class="bar"><i style="width:${m.custom?v*10:Math.min(100,v/m.mx*100)}%"></i></div>${m.custom&&((x.d.customScores||[]).find(s=>mslug(s.measure)===m.k.slice(2))||{}).note?`<div class="sub" style="font-size:12px;margin-top:4px">${esc((x.d.customScores||[]).find(s=>mslug(s.measure)===m.k.slice(2)).note)}</div>`:''}</div>`}).join('')}</div>`}).join('')}
 </div>
 <div class="card" style="margin-top:14px;padding:18px 20px"><div class="lb">The AI on each college</div>
 ${state.cmpStory&&(state.cmpStory.takes||[]).length?state.cmpStory.takes.map(t=>`<div style="padding:12px 0;border-top:1px solid var(--ln)"><b style="font-weight:500">${esc(t.name)}</b><p class="sub" style="margin:4px 0 0">${esc(t.take||'')}</p><p class="sub" style="margin:4px 0 0"><b style="color:var(--ink)">vs:</b> ${esc(t.vs||'')}</p></div>`).join(''):'<p class="sub">Run the comparison to get per-college takes.</p>'}
 <div class="lb" style="margin-top:16px">Career comparison</div>
 ${ok.map(x=>`<div class="krow"><span>${esc(x.d.name)}</span><b>${(x.d.topCareerOutcomes||[]).join(', ')||'—'}</b></div>`).join('')}
 </div>`:`<div class="card" style="margin-top:14px"><p class="sub">${missing.length?'Some colleges are still missing research.':'Add colleges on the setup page.'}</p></div>`}`;
 const e1=$('#cedit');if(e1)e1.onclick=()=>{state.cmpStage='setup';renderCompare()};
 const e2=$('#crewrite');if(e2)e2.onclick=async()=>{state.cmpStory=null;busy.cmp=true;renderCmpDash();try{state.cmpStory=await aiCompareStory();persist('cmpStory')}catch(err){state.cmpError='Rewrite failed: '+err.message}busy.cmp=false;renderCompare()};
 const e3=$('#crerun');if(e3)e3.onclick=()=>{missing.forEach(x=>{delete state.research[lkey(x.n)]});persist('research');runCompare()};
 const e4=$('#crtry');if(e4)e4.onclick=()=>{state.cmpError=null;runCompare()};
 bindGo()}
