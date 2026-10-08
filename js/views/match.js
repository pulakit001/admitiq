/* ---------- match: questionnaire + AI college matching ---------- */
const QS=[
{k:'field',q:'What do you want to study?',o:['Engineering and tech','Design and arts','Business and finance','Humanities and sciences','Medicine and health','Not sure yet']},
{k:'exam',q:'Which exams have you given, and how did you score?',o:['JEE — strong score','JEE — average score','CUET or board exams','SAT or another test','Not given yet']},
{k:'budget',q:'What can fees be per year?',o:['Under ₹2 lakh','₹2 to ₹5 lakh','₹5 to ₹10 lakh','Money is not the limit']},
{k:'loc',q:'Where would you like to live and study?',o:['A big city','A quiet campus town','South India','North India','Anywhere in India']},
{k:'learn',q:'How do you learn best?',o:['Building and projects','Discussion and seminars','Reading and research','A mix of everything']},
{k:'prio',q:'What matters most overall?',o:['Placements and jobs','Research and higher study','Affordability','Campus life and sports','International exposure']},
{k:'vibe',q:'What campus vibe suits you?',o:['Large and lively','Small and close-knit','Competitive and intense','Relaxed and balanced']},
{k:'hostel',q:'Hostel or day scholar?',o:['Hostel on campus','Live at home','Flexible either way']},
{k:'extra',q:'Anything else the AI should know?',o:['I need a scholarship','I play sports seriously','I love hackathons and clubs','Nothing special']}];
const ansOf=k=>state.profile&&state.profile.answers?state.profile.answers[k]||'':'';
function renderMatch(){
 if(busy.recs){V.innerHTML=head('Match','Match my college')+`<div class="card" style="max-width:680px">`+ld('The AI is researching universities that fit your answers…')+`<p class="sub">This usually takes 10–30 seconds. Your answers are being read, not stored anywhere else.</p></div>`;return}
 if(state.recsError){V.innerHTML=head('Match','Match my college')+`<div class="card" style="max-width:680px"><p class="err">${esc(state.recsError)}</p><button class="dk" id="rtry">Try again</button><button class="u" id="rq">Redo the questions</button></div>`;
  $('#rtry').onclick=findRecs;$('#rq').onclick=()=>{state.recsError=null;state.quizMode=true;renderMatch()};return}
 if(state.quizMode||!state.recs||state.freshSession){renderQuiz();return}
 renderMatchDash()}
function renderQuiz(){
 if(state.qi>=QS.length){state.quizMode=false;findRecs();return}
 const q=QS[state.qi],cur=ansOf(q.k);
 V.innerHTML=head('Match','Match my college')+`<div class="card" style="max-width:680px">
 <div class="lb">Question ${state.qi+1} of ${QS.length}</div>
 <div class="ticks">${QS.map((x,i)=>`<i class="${i<state.qi?'d':i===state.qi?'c':''}"></i>`).join('')}</div>
 <h2 class="qt">${q.q}</h2>
 <div class="chs">${q.o.map(o=>`<button class="ch" aria-pressed="${cur===o}">${o}</button>`).join('')}</div>
 <form class="own" id="qf"><input class="fld" placeholder="Or answer in your own words" value="${cur&&!q.o.includes(cur)?esc(cur):''}" aria-label="Your own answer"><button class="dk">${state.qi===QS.length-1?'Find my colleges':'Next'}</button></form>
 <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap">${state.qi>0?'<button class="ch sm" id="qb">Back</button>':''}${Object.keys((state.profile&&state.profile.answers)||{}).length>=3?'<button class="ch sm" id="qdone">Get my colleges now</button>':''}</div>
 </div>
 ${state.recs&&state.freshSession?`<div class="card" style="margin-top:14px;max-width:680px"><div class="lb">Previous result</div><p class="sub" style="margin:8px 0 0">${esc((state.recs.summary||'').slice(0,160))}${(state.recs.summary||'').length>160?'…':''}</p><button class="ch sm" id="prevM" style="margin-top:10px">Open last dashboard →</button></div>`:''}`;
 $$('#v .chs .ch').forEach(b=>b.onclick=()=>{state.profile=state.profile||{};state.profile.answers=Object.assign({},state.profile.answers,{[q.k]:b.textContent});persist('profile');state.qi++;renderMatch()});
 $('#qf').onsubmit=e=>{e.preventDefault();const t=e.target.querySelector('input').value.trim();if(!t)return;state.profile=state.profile||{};state.profile.answers=Object.assign({},state.profile.answers,{[q.k]:t});persist('profile');state.qi++;renderMatch()};
 const qb=$('#qb');if(qb)qb.onclick=()=>{state.qi--;renderMatch()};
 const qd=$('#qdone');if(qd)qd.onclick=()=>{state.quizMode=false;findRecs()};
 const pm=$('#prevM');if(pm)pm.onclick=()=>{state.freshSession=false;state.quizMode=false;renderMatch()}}
async function findRecs(){
 if(!state.profile||!state.profile.answers||!Object.keys(state.profile.answers).length){state.quizMode=true;state.qi=0;renderMatch();return}
 busy.recs=true;state.recsError=null;renderMatch();
 try{
  const r=await aiJSON(`Here are a student's answers about what they want: ${JSON.stringify(state.profile.answers)}. First apply their hard constraints: exclude any college whose fees clearly exceed the stated budget or whose entrance bar is clearly out of reach of their exam performance — mention in "summary" what got excluded. Then recommend 6 real Indian colleges/universities that genuinely fit, mixing ambitious, target and safe choices, using current information on fees, placements and admissions. Return JSON {"summary": "2 sentences on this student, what they should aim for, and what was filtered out", "colleges": [{"name","city","fitScore" (0-100 integer),"reach": "Ambitious"|"Target"|"Safe","feesLakhPerYear","placementLPA","admissionExam","programs" (array up to 4 things they can study there),"why" (1-2 sentences on why it fits THESE answers),"hostel" (short note),"scholarship" (short note),"voice": {"sentiment": "positive"|"mixed"|"negative", "themes": [up to 3 short recurring themes from student discussions and forums]},"note" (one practical tip like cutoff or admission window)}]}`,{grounded:true,max:3400});
  const l=(r.data&&r.data.colleges)||r.list;
  if(!l||!l.length)throw new Error('No recommendations came back');
  state.recs={summary:(r.data&&r.data.summary)||'',colleges:l,src:r.src||[],live:r.live};persist('recs');state.quizMode=false;state.freshSession=false;
 }catch(e){state.recsError='The AI could not build matches: '+e.message}
 busy.recs=false;show('match')}
function renderMatchDash(){
 const RC=state.recs.colleges;
 V.innerHTML=head('Match','Your colleges')+`
 <div class="story"><div class="lb">AI read of your answers</div><p>${esc(state.recs.summary||'')}</p></div>
 <div class="actions"><button class="act" id="rq2">↺ Redo questionnaire</button><button class="act" id="rref2">⟳ Fresh AI matches</button>${state.recs.live===false?'<span class="sub" style="align-self:center">from AI knowledge — live search unavailable</span>':''}</div>
 <div class="mgrid">${RC.map((c,i)=>`
 <div class="mcard"><header><b>${esc(c.name)}</b><span style="display:flex;gap:6px;align-items:center">${c.reach?`<span class="reach reach-${String(c.reach).toLowerCase()}">${esc(c.reach)}</span>`:''}<span>${esc(c.city||'')}</span></span></header>
 <div style="display:flex;align-items:baseline;gap:12px"><span class="fitbig">${esc(c.fitScore)}<small style="font-size:14px;color:var(--mu)">% fit</small></span></div>
 <div class="bar"><i style="width:${Math.min(100,+c.fitScore||0)}%"></i></div>
 <div class="numrow">${c.feesLakhPerYear!=null&&c.feesLakhPerYear!==''?`<span>₹${esc(c.feesLakhPerYear)}L/yr</span>`:''}${c.placementLPA!=null&&c.placementLPA!==''?`<span>${esc(c.placementLPA)} LPA</span>`:''}${c.admissionExam?`<span>${esc(c.admissionExam)}</span>`:''}</div>
 <p><b>Why you:</b> ${esc(c.why||'')}</p>
 ${c.voice?`<p class="sub"><b style="color:var(--ink)">Students say:</b> ${esc(c.voice.sentiment||'')}${c.voice.themes&&c.voice.themes.length?' · '+esc(c.voice.themes.join(', ')):''}</p>`:''}
 <details><summary class="sub" style="cursor:pointer">What you can go for, hostel, aid</summary>
  <div style="margin-top:10px">${(c.programs||[]).map(p=>`<span class="pl hot">${esc(p)}</span>`).join('')}</div>
  ${c.hostel?`<p class="sub" style="margin-top:8px"><b style="color:var(--ink)">Hostel:</b> ${esc(c.hostel)}</p>`:''}
  ${c.scholarship?`<p class="sub"><b style="color:var(--ink)">Aid:</b> ${esc(c.scholarship)}</p>`:''}
  ${c.note?`<p class="sub"><b style="color:var(--ink)">Tip:</b> ${esc(c.note)}</p>`:''}</details>
 <div class="chs" style="margin-top:6px"><button class="ch sm" data-res="${i}">Deep research</button><button class="ch sm" data-ai="${i}">Ask AI about this</button></div>
 </div>`).join('')}</div>`;
 $('#rq2').onclick=()=>{state.quizMode=true;state.qi=0;renderMatch()};
 $('#rref2').onclick=()=>{state.recs=null;persist('recs');findRecs()};
 $$('#v [data-res]').forEach(b=>b.onclick=()=>{const c=RC[+b.dataset.res];state.research[lkey(c.name)]=Object.assign({},c);persist('research');say('Saved '+c.name+' — full data lands in Compare and Insights.');researchIf(c.name)});
 $$('#v [data-ai]').forEach(b=>b.onclick=()=>{const c=RC[+b.dataset.ai];openAI(`Tell me much more about ${c.name}: admission process, cutoffs, hostel, campus life, placements — and whether it truly suits a student with these answers: ${JSON.stringify(state.profile&&state.profile.answers)}.`)})}
