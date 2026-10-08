/* ---------- overview dashboard ---------- */
const ICONS={
 match:'<path d="M5 6h14M5 12h14M5 18h8"/>',
 compare:'<rect x="4" y="5" width="7" height="14" rx="2"/><rect x="13" y="5" width="7" height="14" rx="2"/>',
 career:'<circle cx="12" cy="12" r="8"/><path d="M15 9l-2 5-4 1 2-5z"/>',
 essay:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>'};
function renderDash(){
 const d=new Date(),hr=d.getHours(),greet=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
 const date=d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
 const pf=state.profile?Object.values(state.profile.answers||{}).filter(v=>String(v||'').trim()).length:0;
 const profilePct=pf?Math.round(pf/QS.length*100):0;
 const reports=(state.recs?1:0)+Object.keys(state.research).length+(state.cmpStory?1:0)+((state.career&&state.career.paths.length)?1:0)+state.essays.length;
 let step='Complete your college match profile.',go='match',cta='Start match';
 if(pf&&!state.recs){step='Get your first set of college matches.';go='match';cta='Find colleges'}
 else if(pf&&state.recs&&!state.cmpStory){step='Compare your top matches side by side.';go='compare';cta='Open compare'}
 else if(pf&&state.recs&&state.cmpStory&&!(state.career&&state.career.paths.length)){step='Map your interests to real careers.';go='career';cta='Open careers'}
 else if(pf&&state.recs&&state.cmpStory&&state.career&&state.career.paths.length){step='Grade an application essay with AI feedback.';go='essay';cta='Grade an essay'}
 const T=[['match','<path d="M5 6h14M5 12h14M5 18h8"/>','FIT-FINDING ENGINE','Match my college',pf?('Questionnaire · '+pf+' of '+QS.length+' answered'):'A guided questionnaire, then AI-matched universities'],
 ['compare','<rect x="4" y="5" width="7" height="14" rx="2"/><rect x="13" y="5" width="7" height="14" rx="2"/>','DECISION MATRIX','Compare colleges',state.cmpStory?('Last verdict · '+(state.cmpStory.verdict||'')):'Name colleges, weight measures, see the verdict'],
 ['career','<circle cx="12" cy="12" r="8"/><path d="M15 9l-2 5-4 1 2-5z"/>','INTEREST MAPPING','Career Compass',(state.career&&state.career.paths.length)?(state.career.paths.length+' paths · '+state.career.hobbies.join(', ')):'List your interests, get mapped career paths'],
 ['essay','<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>','AI GRADER','Essay feedback',state.essays.length?(state.essays.length+' report'+(state.essays.length>1?'s':'')+' · latest '+(state.essays[state.essays.length-1].report?state.essays[state.essays.length-1].report.overall+'/100':'—')):'Grade college essays with detailed AI feedback']];
 V.innerHTML=head('Overview','Overview')+`
 <div class="card hero2">
  <div>
   <div class="sub" style="font-size:14px">${date}</div>
   <div class="greet">${greet}</div>
   <p class="sub" style="font-size:15px;margin:12px 0 18px">Matches, comparisons, chances, essay work and career planning — all from one dashboard.</p>
   <div class="ministats">
   <div class="mstat"><small>Profile</small><b>${profilePct}%</b><span>${pf} of ${QS.length} fields</span></div>
   <div class="mstat"><small>Reports</small><b>${reports}</b><span>total generated</span></div>
   </div>
  </div>
  <div class="brief">
   <div style="display:flex;justify-content:space-between;align-items:center"><span class="lb">Quick access</span><svg width="18" height="18" viewBox="0 0 24 24" style="stroke:var(--mu);fill:none;stroke-width:1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div>
   <div class="lb" style="margin-top:20px">Next best step</div>
   <div class="step">Match yourself to your perfect university.</div>
   <button class="cta" data-go2="match">Start Match <span class="arr">→</span></button>
  </div>
 </div>
 <div class="lb" style="margin-top:26px">Workspace</div>
 <p class="sub" style="margin-top:2px">Launch any admissions tool from the portal.</p>
 <div class="tools" style="margin-top:10px">
 ${T.map(t=>`<button class="tile" data-go2="${t[0]}"><div class="ti"><svg viewBox="0 0 24 24">${t[1]}</svg></div><span class="tl2">${t[2]}</span><b>${t[3]}</b><span>${t[4]}</span></button>`).join('')}
 </div>`;
 bindGo();$$('#v [data-go2]').forEach(b=>b.onclick=()=>{state.freshSession=false;show(b.dataset.go2)})}
function statCards(){const st=(l,v)=>`<div class="stat"><small>${l}</small><b>${v}</b></div>`;
 const pf=state.profile?Object.values(state.profile.answers||{}).filter(v=>String(v||'').trim()).length:0;
 return st('Profile',pf?Math.round(pf/QS.length*100)+'%':'—')+st('My colleges',state.recs&&state.recs.colleges.length?state.recs.colleges.length:'—')+st('Researched',Object.keys(state.research).length)+st('Career paths',state.career&&state.career.paths.length?state.career.paths.length:'—')+st('Interests',state.hobbies.length||'—')}
