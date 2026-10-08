/* ---------- insights: Responses + General analytics only ---------- */
function renderInsights(){
 V.innerHTML=head('Insights','Your analytics')+`<div class="tabs"><button data-t="resp" aria-pressed="${state.insTab!=='ana'}">Responses</button><button data-t="ana" aria-pressed="${state.insTab==='ana'}">General analytics</button></div><div id="ins">${insBox()}</div>`;
 $$('.tabs button').forEach(t=>t.onclick=()=>{state.insTab=t.dataset.t;$$('.tabs button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.t===state.insTab));$('#ins').innerHTML=insBox();animateIn()});
 $$('#ins [data-e]').forEach(b=>b.onclick=()=>{state.quizMode=true;state.qi=+b.dataset.e;show('match')});
 $$('#ins [data-eres]').forEach(b=>b.onclick=()=>{state.essayError=null;state.lastEssay=state.essays.find(x=>String(x.id)===b.dataset.eres)||state.lastEssay;persist('lastEssay');state.freshSession=false;show('essay')});
 $('#clr').onclick=()=>{['profile','recs','research','cmpList','measures','CW','cmpStory','cmpCtx','hobbies','career','aiCount','essays','lastEssay'].forEach(k=>store.del(k));
  state.profile=null;state.recs=null;state.research={};state.cmpList=[];state.cmpStory=null;state.cmpCtx='';state.hobbies=[];state.career=null;state.aiCount=0;state.essays=[];state.lastEssay=null;
  state.CW={feesLakh:2,placementLPA:3,scholarshipPct:2,internshipPct:2};persist('CW');state.qi=0;state.quizMode=false;state.cmpStage='setup';say('Cleared. Starting fresh.');renderInsights()};
 bindGo();animateIn()}
function insBox(){
 if(state.insTab==='ana'){
  const runs=state.aiCount,reports=(state.recs?1:0)+Object.keys(state.research).length+(state.cmpStory?1:0)+((state.career&&state.career.paths.length)?1:0)+state.essays.length;
  const q=aiQuota();
  return `<div class="stats">${statCards()}<div class="stat"><small>AI research runs</small><b>${runs}</b></div><div class="stat"><small>Arisa AI quota left</small><b>${q.left}/${AI_QUOTA}</b></div><div class="stat"><small>Active API key</small><b>#${state.keyIdx+1}</b></div><div class="stat"><small>Reports generated</small><b>${reports}</b></div></div>
 <div class="card" style="margin-top:14px;padding:18px 20px"><div class="lb">Activity summary</div>
  <div class="krow"><span>College matches generated</span><b>${state.recs&&state.recs.colleges?state.recs.colleges.length:0}</b></div>
  <div class="krow"><span>Colleges deeply researched</span><b>${Object.values(state.research).filter(d=>d&&!d._error).length}</b></div>
  <div class="krow"><span>Comparisons run</span><b>${state.cmpStory?1:0}</b></div>
  <div class="krow"><span>Career paths mapped</span><b>${state.career&&state.career.paths?state.career.paths.length:0}</b></div>
  <div class="krow"><span>Essay reports</span><b>${state.essays.length}</b></div>
  <div class="krow"><span>Last activity</span><b>${state.lastActivity?esc(state.lastActivity.tool)+' · '+new Date(state.lastActivity.at).toLocaleDateString():'—'}</b></div>
 </div>`}
 const pf=state.profile&&state.profile.answers?QS.filter(q=>ansOf(q.k)).map(q=>[q.q,ansOf(q.k)]):[];
 return `<div class="stats">${statCards()}<div class="stat"><small>AI research runs</small><b>${state.aiCount}</b></div></div>
 <div class="card" style="padding:18px 20px"><div class="lb">Your answers</div><div class="xw" style="margin-top:10px"><table class="xt"><thead><tr><th>Question</th><th>Your answer</th><th style="width:80px"></th></tr></thead><tbody>
 ${QS.map((q,i)=>ansOf(q.k)?`<tr><td class="sub">${q.q}</td><td>${esc(ansOf(q.k))}</td><td><button class="u" data-e="${i}" style="margin:0">Edit</button></td></tr>`:'').join('')||'<tr><td colspan="3"><span class="sub">No answers yet.</span></td></tr>'}
 </tbody></table></div></div>
 <div class="card" style="margin-top:14px;padding:18px 20px"><div class="lb">Colleges the AI has researched</div><div class="xw" style="margin-top:10px"><table class="xt"><thead><tr><th>College</th><th>Fees</th><th>Placement</th><th>Exam</th><th>Confidence</th></tr></thead><tbody>
 ${Object.values(state.research).filter(d=>d&&!d._error).map(d=>`<tr><td>${esc(d.name)}<br><span class="sub">${esc(d.city||'')}</span></td><td>${d.feesLakhPerYear!=null?'₹'+esc(d.feesLakhPerYear)+'L':'—'}</td><td>${d.placementLPA!=null?esc(d.placementLPA)+' LPA':'—'}</td><td>${esc(d.admissionExam||'—')}</td><td class="sub">${esc(d.confidence||'—')}${d.studentVoice?'<br>voice: '+esc(d.studentVoice.sentiment||''):''}</td></tr>`).join('')||'<tr><td colspan="5"><span class="sub">Nothing researched yet.</span></td></tr>'}
 </tbody></table></div></div>
 <div class="card" style="margin-top:14px;padding:18px 20px"><div class="lb">Essay reports</div>
 ${state.essays.length?state.essays.map(x=>`<div class="krow"><span>${esc(x.college)} · ${esc(x.type||'')} · ${esc(x.date||'')}</span><b style="display:flex;gap:12px;align-items:center">${x.report?x.report.overall+'/100':''}<button class="ch sm" data-eres="${x.id}">Open →</button></b></div>`).join(''):'<p class="sub">No essay reports yet.</p>'}
 </div>
 <div class="card" style="margin-top:14px;padding:18px 20px"><div class="lb">Career analysis</div>
 ${state.career&&state.career.paths.length?`<p class="sub" style="margin:8px 0 0">${state.career.paths.length} paths from: ${esc(state.career.hobbies.join(', '))}</p>`:'<p class="sub">No career analysis yet.</p>'}
 <button class="u" id="clr" style="margin-top:10px">Clear everything and start over</button></div>`;
}
