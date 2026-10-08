/* ---------- essay feedback: college + prompt + essay -> AI grade ---------- */
function renderEssay(){
 if(busy.ess){V.innerHTML=head('Essay','Essay feedback')+`<div class="card" style="max-width:760px">`+ld('The AI is reading your essay like an admissions officer…')+`<p class="sub">Grading clarity, structure, fit, voice and mechanics.</p></div>`;return}
 if(state.essayError){V.innerHTML=head('Essay','Essay feedback')+`<div class="card" style="max-width:760px"><p class="err">${esc(state.essayError)}</p><button class="dk" id="eetry">Try again</button><button class="u" id="eeedit">Edit my essay</button></div>`;$('#eetry').onclick=analyzeEssay;$('#eeedit').onclick=()=>{state.essayError=null;state.lastEssay=null;persist('lastEssay');renderEssay()};return}
 if(state.lastEssay&&state.lastEssay.report&&!state.freshSession){renderEssayDash();return}
 const e=state.lastEssay||{};
 V.innerHTML=head('Essay','Essay feedback')+`
 <div class="card" style="max-width:760px"><div class="lb">Which college is this essay for?</div>
 <input class="fld" id="e-college" placeholder="e.g. Harvard, Cambridge, IIT Bombay" value="${esc(e.college||'')}" style="margin-top:8px">
 <label class="lb">Essay type</label>
 <select id="e-type">${['Personal statement','Supplemental essay','Statement of Purpose','Scholarship essay','Other'].map(o=>`<option ${e.type===o?'selected':''}>${o}</option>`).join('')}</select>
 <label class="lb">The prompt you are answering</label>
 <textarea class="fld" id="e-prompt" placeholder="Paste the exact essay prompt here">${esc(e.prompt||'')}</textarea>
 <label class="lb">Your essay</label>
 <textarea class="fld" id="e-body" style="min-height:220px" placeholder="Paste your full essay here">${esc(e.essay||'')}</textarea>
 <div class="wcount" id="e-count"></div>
 <div class="own"><button class="dk big" id="egrade">Grade with AI</button></div>
 </div>
 ${state.essays.length?`<div class="card" style="max-width:760px;margin-top:14px"><div class="lb">Previous reports</div>${state.essays.slice().reverse().map(x=>`<div class="krow"><span>${esc(x.college)} · ${esc(x.type||'')}</span><b style="display:flex;gap:12px;align-items:center">${x.report?x.report.overall+'/100':''}<button class="ch sm" data-eopen="${x.id}">Open →</button></b></div>`).join('')}</div>`:''}`;
 const cnt=()=>{const n=$('#e-body').value.trim().split(/\s+/).filter(Boolean).length;$('#e-count').textContent=n?n+' words':''};
 $('#e-body').oninput=cnt;cnt();
 $('#egrade').onclick=()=>{const c={college:$('#e-college').value.trim(),type:$('#e-type').value,prompt:$('#e-prompt').value.trim(),essay:$('#e-body').value.trim()};if(!c.college||!c.prompt||!c.essay)return say('Add the college, the prompt and your essay first.');state.lastEssay=c;persist('lastEssay');analyzeEssay()};
 $$('#v [data-eopen]').forEach(b=>b.onclick=()=>{state.lastEssay=state.essays.find(x=>String(x.id)===b.dataset.eopen)||state.lastEssay;state.freshSession=false;renderEssay()});
 bindGo()}
async function analyzeEssay(){
 const c=state.lastEssay;if(!c||!c.essay)return;
 state.freshSession=false;busy.ess=true;state.essayError=null;renderEssay();
 try{
  const r=await aiJSON(`You are an elite admissions essay coach. The student is applying to ${c.college} with a ${c.type}. The prompt they must answer: "${c.prompt}". Their essay: """${c.essay}""" Grade it honestly and specifically, referencing their actual sentences. Return JSON {"whatTheyAsk": "2-3 sentences on what this prompt and college really want to see","overall": integer 0-100,"criteria": [5 objects in this order, each {"name": "Clarity"|"Structure"|"Fit to prompt"|"Voice & originality"|"Mechanics", "score": 0-10 number, "note": one sentence}],"strengths": [3 short bullets],"improve": [4 specific actionable bullets pointing at real moments in their essay],"rewrite": "one sentence from their essay, rewritten, to show the difference","verdict": "one encouraging, honest sentence"}`,{grounded:false,temp:.4,max:2600});
  const d=r.data;if(!d||d.overall==null)throw new Error('No report came back');
  c.report=d;c.date=new Date().toLocaleDateString();c.id=c.id||Date.now();
  const ix=state.essays.findIndex(x=>x.id===c.id);if(ix>=0)state.essays[ix]=c;else state.essays.push(c);
  state.lastEssay=c;persist('essays');persist('lastEssay');recordActivity('essay');
 }catch(err){state.essayError='The AI could not grade the essay: '+err.message}
 busy.ess=false;show('essay')}
function renderEssayDash(){
 const r=state.lastEssay.report||{};
 V.innerHTML=head('Essay','Your essay report')+`
 <div class="story"><div class="lb">${esc(state.lastEssay.college||'')} · ${esc(state.lastEssay.type||'')}${state.lastEssay.date?' · '+esc(state.lastEssay.date):''}</div>
 <div style="display:flex;align-items:baseline;gap:14px;margin-top:8px"><span class="fitbig">${esc(r.overall)}<small style="font-size:14px;color:var(--mu)">/100</small></span></div>
 <div class="bar" style="margin-top:10px"><i style="width:${Math.min(100,+r.overall||0)}%"></i></div>
 <p style="margin-top:12px">${esc(r.verdict||'')}</p></div>
 <div class="actions"><button class="act" id="eedit">✎ Edit essay</button><button class="act" id="eregrade">⟳ Re-grade</button></div>
 <div class="card mxs" style="padding:18px 20px"><div class="lb">Scored on five axes</div>
 ${(r.criteria||[]).map(c=>`<div class="crit"><span>${esc(c.name)}</span><div class="bar"><i style="width:${Math.min(100,(+c.score||0)*10)}%"></i></div><b>${esc(c.score)}/10</b></div>`).join('')||'<p class="sub">No criteria returned.</p>'}
 </div>
 <div class="two" style="margin-top:14px;align-items:start">
 <div class="card" style="padding:18px 20px"><div class="lb">What they are really asking</div><p class="sub" style="margin:8px 0 0;font-size:14px">${esc(r.whatTheyAsk||'')}</p></div>
 <div class="card" style="padding:18px 20px"><div class="lb">Strengths</div>${(r.strengths||[]).map(s=>`<div class="krow"><span>${esc(s)}</span></div>`).join('')||'<p class="sub">—</p>'}</div>
 </div>
 <div class="card" style="margin-top:14px;padding:18px 20px"><div class="lb">What to improve</div>${(r.improve||[]).map((s,i)=>`<div class="krow"><span>${i+1}. ${esc(s)}</span></div>`).join('')||'<p class="sub">—</p>'}</div>
 ${r.rewrite?`<div class="card" style="margin-top:14px;padding:18px 20px"><div class="lb">One line, rewritten</div><p style="margin:8px 0 0;font-size:15px">“${esc(r.rewrite)}”</p></div>`:''}`;
 $('#eedit').onclick=()=>{state.lastEssay=Object.assign({},state.lastEssay);delete state.lastEssay.report;persist('lastEssay');renderEssay()};
 $('#eregrade').onclick=()=>{state.lastEssay=Object.assign({},state.lastEssay);delete state.lastEssay.report;persist('lastEssay');analyzeEssay()};
 bindGo()}
