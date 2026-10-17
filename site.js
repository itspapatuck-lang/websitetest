(()=>{
const root=document.documentElement,header=document.querySelector('.header');
const toggle=document.getElementById('motion-toggle'),replay=document.getElementById('motion-replay');
const buttons=[...document.querySelectorAll('.button')],entrants=buttons.filter(b=>!b.classList.contains('header-call'));
const seenGlints=new Set(),timers=new Set();let observer,headerTimer;
function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn()},ms);timers.add(id);return id}
function glint(button){if(seenGlints.has(button)||button.classList.contains('secondary'))return;seenGlints.add(button);later(()=>{if(root.dataset.motion==='on')button.classList.add('button-glint')},2000)}
buttons.forEach(button=>button.addEventListener('animationend',e=>{
if(e.target!==button)return;
if(e.animationName==='button-glint'){button.classList.remove('button-glint');return}
if(e.animationName==='soft-entrance'||e.animationName==='header-entrance'){button.classList.remove('motion-enter');glint(button)}
}));
function stop(){header.classList.remove('intro-playing');buttons.forEach(b=>b.classList.remove('motion-enter','button-glint'));if(observer)observer.disconnect();timers.forEach(clearTimeout);timers.clear();clearTimeout(headerTimer)}
function run(){
stop();if(root.dataset.motion!=='on')return;
void header.offsetWidth;header.classList.add('intro-playing');
headerTimer=setTimeout(()=>glint(document.querySelector('.header-call')),1600);
if(!('IntersectionObserver' in window)){entrants.forEach(b=>glint(b));return}
observer=new IntersectionObserver(entries=>entries.filter(e=>e.isIntersecting).forEach((e,i)=>{
e.target.style.setProperty('--entrance-delay',(180+Math.min(i,3)*110)+'ms');
e.target.classList.add('motion-enter');observer.unobserve(e.target);
}),{threshold:.25});
entrants.forEach(b=>observer.observe(b));
}
header.addEventListener('animationend',e=>{if(e.target===header){header.classList.remove('intro-playing');glint(document.querySelector('.header-call'))}});
const video=document.getElementById('hero-video'),videoToggle=document.getElementById('video-toggle');let videoPausedByUser=false,heroVisible=true;
function syncVideo(){if(!video)return;if(document.hidden||!heroVisible||videoPausedByUser||root.dataset.motion==='off'){video.pause();videoToggle.textContent='Play video'}else{video.muted=true;video.play().then(()=>videoToggle.textContent='Pause video').catch(()=>videoToggle.textContent='Play video')}}
if(video){
videoToggle.addEventListener('click',()=>{videoPausedByUser=!video.paused;syncVideo()});
if('IntersectionObserver' in window)new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;syncVideo()},{threshold:.05}).observe(video);
syncVideo();
}
const word=document.getElementById('flip-word');let wordIndex=0,flipTimer,wordTimer;
const words=['phone call','click','text'];
function setWordWidth(text){if(!word)return;const measure=document.createElement('span');measure.className='flip-measure';measure.textContent=text;word.parentElement.append(measure);word.parentElement.style.width=(measure.getBoundingClientRect().width+4)+'px';measure.remove()}
function flip(){if(!word||document.hidden||root.dataset.motion!=='on')return;word.classList.remove('flip-in');word.classList.add('flip-out');wordTimer=setTimeout(()=>{wordIndex=(wordIndex+1)%words.length;setWordWidth(words[wordIndex]);word.textContent=words[wordIndex];word.classList.remove('flip-out');word.classList.add('flip-in')},200)}
function startFlip(){clearInterval(flipTimer);if(word&&root.dataset.motion==='on'&&!document.hidden)flipTimer=setInterval(flip,3600)}
function setMotion(on){root.dataset.motion=on?'on':'off';toggle.textContent='Motion: '+(on?'on':'off');toggle.setAttribute('aria-pressed',String(on));if(on){run();startFlip()}else{stop();clearInterval(flipTimer);clearTimeout(wordTimer);if(word)word.classList.remove('flip-in','flip-out')}syncVideo()}
toggle.addEventListener('click',()=>setMotion(root.dataset.motion!=='on'));
replay.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'instant'});seenGlints.clear();setMotion(true)});
let started=false;
function visible(){if(!document.hidden&&!started){started=true;requestAnimationFrame(()=>requestAnimationFrame(run))}syncVideo();startFlip()}
document.addEventListener('visibilitychange',visible);
window.addEventListener('pageshow',e=>{if(e.persisted)run()});
window.addEventListener('resize',()=>{if(word)setWordWidth(word.textContent)});
if(word)setWordWidth(word.textContent);
visible();
})();
