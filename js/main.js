/* ---------- routing, theme, command bar ---------- */
const SG=()=>({dash:['Match my college','Compare two colleges','What career suits me?'],match:['Start the questions','How do I pick an exam?'],compare:['Which of my colleges is best?','Is this college worth the fees?'],career:['What career suits my interests?','Which careers are growing in India?'],essay:['Grade my college essay','What makes a personal statement strong?'],insights:['Show my data','Show my analytics']});
function show(v){state.view=v;$$('.ib[data-v]').forEach(t=>t.setAttribute('aria-current',t.dataset.v===v));$('#toast').hidden=true;
 ({dash:renderDash,match:renderMatch,compare:renderCompare,career:renderCareer,essay:renderEssay,insights:renderInsights})[v]();
 $('.sg').innerHTML=SG()[v].map(s=>`<button>${s}</button>`).join('');$$('.sg button').forEach(b=>b.onclick=()=>cmd(b.textContent));scrollTo(0,0);animateIn()}
function cmd(t){t=t.trim();if(!t)return;const l=t.toLowerCase();
 if(/match|questionnair|find my colleg/.test(l))return show('match');
 if(/compar|vs\b/.test(l)&&!/what|which of my/.test(l))return show('compare');
 if(/career|interest|hobb/.test(l)&&/suit|compass|what career/.test(l))return show('career');
 if(/essay|grade my/.test(l))return show('essay');
 if(/insight|analytic|my data/.test(l))return show('insights');
 openAI(t)}
$$('.ib[data-v]').forEach(t=>t.onclick=()=>{state.freshSession=false;show(t.dataset.v)});
$('#th').onclick=()=>{const d=document.body.dataset;d.t=d.t==='light'?'dark':'light';state.theme=d.t;persist('theme')};
$('#cf').onsubmit=e=>{e.preventDefault();const i=$('#cin');cmd(i.value);i.value=''};
$('#hp').onclick=()=>openAI();
document.body.dataset.t=state.theme;
show('dash');

/* ---------- splash: draw-on, fade-out ---------- */
(function(){const sp=$('#splash');if(!sp)return;
 const out=()=>{if(sp.classList.contains('out'))return;sp.classList.add('out');setTimeout(()=>sp.remove(),800)};
 sp.addEventListener('click',out);
 setTimeout(out,2400)})();
