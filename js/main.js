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

/* ---------- splash: logo draw-on, word slide-in, fade-out ---------- */
(function(){
 const sp=$('#splash'),stage=sp&&sp.querySelector('.stage');
 if(!sp||!stage)return;
 const spSpan=stage.querySelector('.word span');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 async function play(){
  stage.classList.remove('play','done');
  // Force the exact splash font (600-weight Inter Tight) to finish loading
  // before measuring, so the reveal width never clips the wordmark on any
  // orientation or screen size.
  await Promise.race([
    Promise.all([document.fonts.load('600 40px "Inter Tight"'), document.fonts.ready]).catch(()=>{}),
    wait(1200)
  ]);
  measure();
  document.fonts.ready.then(()=>{ if(sp.isConnected&&!finished) measure(); });
  void stage.offsetWidth;
  stage.classList.add('play');
  if(reduce)return finish(400);
  setTimeout(()=>stage.classList.add('done'),1800);
  setTimeout(finish,2200);
 }
 function measure(){
  if(!sp.isConnected)return;
  const fs=parseFloat(getComputedStyle(sp).fontSize)||40;
  stage.style.setProperty('--w',(sp.offsetWidth+fs*0.12)+'px');
 }
 function finish(delay){
  stage.classList.add('done');
  sp.classList.add('out');
  window.dispatchEvent(new Event('splash:done'));
  setTimeout(()=>sp.remove(),(delay||0)+450);
 }
 play();
})();
