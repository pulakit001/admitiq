/* ---------- career compass ---------- */
function renderCareer(){
 if(busy.car){V.innerHTML=head('Career','Career Compass')+`<div class="card" style="max-width:680px">`+ld('The AI is analyzing all your interests together…')+`<p class="sub">Reading every hobby as one picture — this shapes the dashboard.</p></div>`;return}
 if(state.careerError){V.innerHTML=head('Career','Career Compass')+`<div class="card" style="max-width:680px"><p class="err">${esc(state.careerError)}</p><button class="dk" id="catry">Try again</button><button class="u" id="caedit">Edit my interests</button></div>`;
  $('#catry').onclick=analyzeCareer;$('#caedit').onclick=()=>{state.careerError=null;state.career=null;persist('career');renderCareer()};return}
 if(state.career&&state.career.paths&&state.career.paths.length&&!state.freshSession){renderCareerDash();return}
 V.innerHTML=head('Career','Career Compass')+`
 <div class="card" style="max-width:720px"><div class="lb">Your interests — the AI reads them all together</div>
 <p class="sub" style="margin:6px 0 0">Add everything you enjoy, then press Enter once — the AI reads them as one picture.</p>
 <form class="own" id="haf"><input class="fld" id="han" placeholder="e.g. chess, guitar, football, coding…" aria-label="Add an interest"><button class="dk">Add</button></form>
 <div class="chs" style="margin-top:14px">${state.hobbies.map((h,i)=>`<span class="cchip">${esc(h)}<button data-hrm="${i}" aria-label="Remove ${esc(h)}">×</button></span>`).join('')||'<span class="sub">Nothing added yet.</span>'}</div>
 ${state.hobbies.length?`<div class="own"><button class="dk big" id="arun">Analyze ${state.hobbies.length===1?'this':state.hobbies.length+' interests'} with AI</button></div>`:''}
 </div>
 ${state.career&&state.career.paths.length?`<div class="card" style="max-width:720px;margin-top:14px"><div class="lb">Previous analysis</div><p class="sub" style="margin:8px 0 0">${esc((state.career.synthesis||'').slice(0,150))}…</p><button class="ch sm" id="prevK" style="margin-top:10px">Open last dashboard →</button></div>`:''}`;
 $('#haf').onsubmit=e=>{e.preventDefault();const h=$('#han').value.trim();if(!h||state.hobbies.length>=6)return;if(!state.hobbies.some(x=>lkey(x)===lkey(h)))state.hobbies.push(h);persist('hobbies');renderCareer()};
 $$('#v [data-hrm]').forEach(b=>b.onclick=()=>{state.hobbies.splice(+b.dataset.hrm,1);state.career=null;persist('hobbies');persist('career');renderCareer()});
 const a=$('#arun');if(a)a.onclick=analyzeCareer;
 const pk=$('#prevK');if(pk)pk.onclick=()=>{state.freshSession=false;renderCareer()};bindGo()}
async function analyzeCareer(){if(!state.hobbies.length)return;state.freshSession=false;busy.car=true;state.careerError=null;renderCareer();
 try{
  const r=await aiJSON(`A student enjoys these things: ${JSON.stringify(state.hobbies)}. Analyze them TOGETHER as one picture of this person, not one by one. Use current information on the Indian job market. Return JSON {"synthesis": "2-3 sentences connecting the interests into a profile","paths": [5 objects: {"title" (career name),"fit" (0-100 integer),"jobNames" (array of 2-3 real job titles),"whyYou" (2 sentences tying it to these exact interests),"whatToDo" (array up to 4: courses, skills, exams to pursue),"market" {"outlook": "growing"|"stable"|"declining","note": one sentence on the future market in India},"salaryIndia" (short string, early-career pay),"roadmap" (array of 4 steps {"when","what"} from today to first job),"firstStep" (one concrete thing for the next month)}]}`,{grounded:true,max:3200});
  const l=(r.data&&r.data.paths)||r.list;if(!l||!l.length)throw new Error('No paths came back');
  state.career={hobbies:state.hobbies.slice(),synthesis:(r.data&&r.data.synthesis)||'',paths:l,src:r.src||[],live:r.live};persist('career');
 }catch(e){state.careerError='The AI could not analyze your interests: '+e.message}
 busy.car=false;show('career')}
function renderCareerDash(){
 const MK=c=>({growing:'g',stable:'s',declining:'d'}[String(c||'').toLowerCase()]||'n');
 V.innerHTML=head('Career','Your career dashboard')+`
 <div class="story"><div class="lb">How your interests connect${state.career.live===false?' · from AI knowledge':''}</div><p>${esc(state.career.synthesis||'')}</p></div>
 <div class="actions"><button class="act" id="caredit">✎ Edit interests</button><button class="act" id="carerefresh">⟳ Regenerate</button></div>
 <div class="mgrid">${state.career.paths.map(p=>`
 <div class="mcard"><header><b>${esc(p.title)}</b><span class="mkt ${MK(p.market&&p.market.outlook)}">${esc(p.market&&p.market.outlook||'—')}</span></header>
 <div style="display:flex;align-items:baseline;gap:12px"><span class="fitbig">${esc(p.fit)}<small style="font-size:14px;color:var(--mu)">% fit</small></span><span class="sub">${esc(p.salaryIndia||'')}</span></div>
 <div class="bar"><i style="width:${Math.min(100,+p.fit||0)}%"></i></div>
 <p><b>Why you:</b> ${esc(p.whyYou||'')}</p>
 <div>${(p.jobNames||[]).map(j=>`<span class="pl hot">${esc(j)}</span>`).join('')}</div>
 ${p.market&&p.market.note?`<p class="sub"><b style="color:var(--ink)">Market:</b> ${esc(p.market.note)}</p>`:''}
 <details><summary class="sub" style="cursor:pointer">Roadmap &amp; what to do</summary>
 <ul class="tl">${(p.roadmap||[]).map(s=>`<li><b>${esc(s.when)}</b>${esc(s.what)}</li>`).join('')}</ul>
 <div style="margin-top:6px">${(p.whatToDo||[]).map(w=>`<span class="pl">${esc(w)}</span>`).join('')}</div>
 <p class="sub" style="margin-top:8px"><b style="color:var(--ink)">First step:</b> ${esc(p.firstStep||'')}</p></details>
 <div class="chs" style="margin-top:6px"><button class="ch sm" data-cai="${esc(p.title)}">Ask AI about this path</button></div>
 </div>`).join('')}</div>`;
 $('#caredit').onclick=()=>{state.career=null;persist('career');renderCareer()};
 $('#carerefresh').onclick=analyzeCareer;
 $$('#v [data-cai]').forEach(b=>b.onclick=()=>openAI(`Give me a deep dive on becoming a ${b.dataset.cai} in India, starting from these interests: ${JSON.stringify(state.hobbies)}. Skills, exams, top colleges, first jobs, and realistic salaries.`))}
