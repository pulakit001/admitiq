/* ---------- motion system: reveal-on-scroll, rotating hint ---------- */
const obs=('IntersectionObserver'in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)}}),{threshold:.08}):null;
function animateIn(){if(!obs)return;
 V.querySelectorAll('.card,.story,.tile,.mcard,.vd,.stat,.tabs,.actions,.fnc').forEach((el,i)=>{if(el.dataset.seen)return;el.dataset.seen=1;el.classList.add('reveal');el.style.transitionDelay=(Math.min(i%14,12)*55)+'ms';obs.observe(el)})}
const ROT=['Ask anything — AI answers with research','Which college fits me best and why?','Compare two colleges on what matters to you','What career suits my interests?','Grade my application essay','How do I strengthen my application?'];
(function(){const bx=document.querySelector('.bx');if(!bx)return;const h=document.createElement('span');h.id='cinHint';bx.appendChild(h);const inp=$('#cin');let i=0;h.textContent=ROT[0];
 const rot=()=>{if(document.activeElement===inp||inp.value){h.classList.add('hid');return}h.classList.remove('hid');h.classList.add('swap');setTimeout(()=>{i=(i+1)%ROT.length;h.textContent=ROT[i];h.classList.remove('swap')},460)};
 setInterval(rot,4200);
 inp.addEventListener('focus',()=>h.classList.add('hid'));
 inp.addEventListener('input',()=>h.classList.toggle('hid',!!inp.value||document.activeElement===inp));
 inp.addEventListener('blur',()=>h.classList.toggle('hid',!!inp.value))})();
