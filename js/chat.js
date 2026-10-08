/* ---------- Ask Anything popup — markdown-rendered answers ---------- */
const AICH=['Which college fits me best and why?','What career suits my interests?','Best colleges for my budget','What should I do next?'];
function openAI(q){$('#aim').hidden=false;$('#aiIn').focus();if(q)askAI(q)}
function closeAI(){$('#aim').hidden=true}
function ctxText(){return JSON.stringify({answers:state.profile&&state.profile.answers,matches:state.recs&&state.recs.colleges?state.recs.colleges.slice(0,6).map(c=>({name:c.name,fit:c.fitScore,feesLakh:c.feesLakhPerYear})):null,comparing:state.cmpList,measures:state.measures.map(m=>[m.l,state.CW[m.k]||0]),interests:state.hobbies,careerPaths:state.career&&state.career.paths?state.career.paths.map(p=>p.title):null,essayReports:state.essays.slice(-3).map(e=>({college:e.college,overall:e.report&&e.report.overall}))})}
async function askAI(q){q=(q||'').trim();if(!q)return;const log=$('#aiLog');
 log.insertAdjacentHTML('beforeend',`<div class="am me">${esc(q)}</div><div class="am ai" data-busy="1">Researching…</div>`);log.scrollTop=log.scrollHeight;$('#aiIn').value='';
 const busyEl=log.querySelector('[data-busy]');
 try{const r=await aiAsk(`Here is the user's current saved data: ${ctxText()}\n\nQuestion: ${q}`,{grounded:true,temp:.6,max:1200,sys:CHATSYS});
  busyEl.outerHTML=`<div class="am ai md">${mdToHtml(r.text.trim())}</div>`;
  state.chats=state.chats.concat([{q,a:r.text.trim(),at:Date.now()}]).slice(-50);persist('chats')}
 catch(e){busyEl.outerHTML=`<div class="am ai">Sorry, the AI is unreachable right now${e?' ('+esc(e.message)+')':''}. Check the API key or try again.`}
 log.scrollTop=log.scrollHeight}
$('#aix').onclick=closeAI;$('#aim').onclick=e=>{if(e.target.id==='aim')closeAI()};
$('#aiF').onsubmit=e=>{e.preventDefault();askAI($('#aiIn').value)};
$('#aiCh').innerHTML=AICH.map(c=>`<button type="button">${c}</button>`).join('');
$$('#aiCh button').forEach(b=>b.onclick=()=>askAI(b.textContent));
addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#aim').hidden)closeAI();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openAI()}});
