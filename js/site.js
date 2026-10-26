/* Shared country-site behavior. No student account or production database changes. */
(function () {
'use strict';
const courseKeys=['beginner','daily','business','interview','cruise','hotel','office-it','manufacturing-construction','maritime','massage-spa','nail','restaurant-service','warehousing-logistics','love-across-borders','corporate-a1','corporate-a2','kids'];
function recommend(a){
 const score=['q1','q2','q3','q4','q5','q6'].reduce((n,k)=>n+(a[k]==='1'?1:0),0);
 if(a.audience==='kids')return {course:'kids',target:'kids',next:'',track:'',score:null,reason:'kids'};
 const independent=a.confidence==='2'&&a.experience==='independent'&&score>=5;
 let target='daily';
 if(a.task==='corporate'||a.goal==='corporate'||String(a.interest).startsWith('corporate-'))target=independent?'corporate-a2':'corporate-a1';
 else if(a.task==='interview'||a.interest==='interview')target='interview';
 else if(a.task==='relationship'||a.interest==='love-across-borders')target='love-across-borders';
 else if(courseKeys.includes(a.sector))target=a.sector;
 else if(courseKeys.includes(a.interest)&&!['beginner','daily','business'].includes(a.interest))target=a.interest;
 else if(a.task==='business'||a.interest==='business')target='business';
 else if(a.task==='service')target='restaurant-service';
 const foundation=a.confidence==='0'||(a.skill==='start'&&a.experience==='never')||(score<=2&&a.confidence!=='2');
 const course=foundation||a.interest==='beginner'?'beginner':target;
 return {course,target,next:course==='beginner'&&target!=='beginner'?target:'',track:course==='interview'?(independent?'advanced':'beginner'):'',score,reason:course==='beginner'?'foundation':'target',urgent:a.urgency==='now',practice:a.practice,skill:a.skill};
}
if(typeof module!=='undefined'&&module.exports){module.exports={recommend,courseKeys};return;}
const cfg=window.TALK_ENGLISH_CONFIG, words=window.TALK_ENGLISH_WORDS;
if(!cfg||!words)return;
let language=cfg.lang;
const t=k=>words[k]?.[language]||words[k]?.en||k;
function setLanguage(lang){
 language=lang===cfg.lang?cfg.lang:'en';document.documentElement.lang=language;document.querySelector('.menu-toggle')?.setAttribute('aria-label',t('menu'));document.querySelector('nav')?.setAttribute('aria-label',language==='th'?'เมนูหลัก':language==='id'?'Navigasi utama':'Main navigation');document.querySelector('.language-switcher')?.setAttribute('aria-label',language==='th'?'ภาษา':language==='id'?'Bahasa':'Language');
 document.querySelectorAll('[data-i18n]').forEach(e=>{const key=e.dataset.i18n;if(['ref_hero_title','ref_philosophy_title','ref_final_title'].includes(key))e.innerHTML=t(key);else e.textContent=t(key);});
 const heading=document.querySelector('.hero-content h1');
 if(heading?.dataset.i18n==='hero'){const parts=t('hero').match(/^(.+?[.!?])\s+(.+)$/);if(parts){heading.replaceChildren(document.createTextNode(parts[1]));const accent=document.createElement('span');accent.textContent=parts[2];heading.append(accent);}else if(language==='th'){heading.replaceChildren(document.createTextNode('สร้างความมั่นใจ'));const accent=document.createElement('span');accent.textContent='เปิดโอกาสใหม่';heading.append(accent);}}
 const trust=document.querySelector('.hero-trust');if(trust){trust.replaceChildren(...t('trust').split('·').map(s=>{const pill=document.createElement('span');pill.textContent='✓ '+s.trim();return pill;}));}

 document.querySelectorAll('[data-language]').forEach(e=>{const selected=e.dataset.language===language;e.setAttribute('aria-pressed',String(selected));e.classList.toggle('is-active',selected);});
 document.title=t(document.body.dataset.pageTitle)+' | Talk English '+cfg.country;
 document.querySelector('meta[name="description"]')?.setAttribute('content',t('intro'));
 document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
 document.querySelector('meta[property="og:description"]')?.setAttribute('content',t('intro'));
 document.querySelector('meta[property="og:locale"]')?.setAttribute('content',language==='en'?'en_CA':cfg.locale);
 try{localStorage.setItem('talkEnglishLanguage-'+cfg.country,language);}catch{}
 renderResult();refreshPreview();
}
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.main-navigation');
menu?.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('is-open',!expanded);});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu?.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('is-open')){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.focus();}});
document.querySelectorAll('[data-language]').forEach(e=>e.addEventListener('click',()=>setLanguage(e.dataset.language)));
const roots=[...document.querySelectorAll('[data-assessment-root]')];
const standalone=document.getElementById('course-assessment'),registration=document.getElementById('enquiry-form');
let answers={},current=null,signature=null;
const attempts=[];
function assessmentSelects(root){return [...root.querySelectorAll('[data-assessment-name]')];}
function syncAudience(){
 const child=answers.audience==='kids';
 roots.forEach(root=>root.querySelectorAll('[data-group]').forEach(label=>{
  const hide=label.dataset.group===(child?'adult':'child');label.hidden=hide;
  label.querySelectorAll('select').forEach(sel=>{sel.disabled=hide;sel.required=!hide&&root===standalone;});
 }));
}
function syncAnswers(){roots.forEach(root=>assessmentSelects(root).forEach(sel=>{sel.value=answers[sel.dataset.assessmentName]||'';}));syncAudience();}
function completeAnswers(){return roots.length>0&&assessmentSelects(standalone).filter(s=>!s.disabled).every(s=>s.value!=='');}
function readAnswers(){return Object.fromEntries(assessmentSelects(standalone).filter(s=>!s.disabled).map(s=>[s.dataset.assessmentName,s.value]));}
function describe(r){
 if(!r)return t('noAssessment');
 const parts=[t(r.reason==='kids'?'kidsReason':r.reason==='foundation'?'foundationReason':'targetReason')];
 if(r.next)parts.push(t('next')+': '+t('course_'+r.next)+'.');
 if(r.track)parts.push(t('track')+': '+(r.track==='advanced'?t('advanced'):t('beginnerLevel'))+'.');
 if(r.score!==null)parts.push(t('shortCheck')+': '+r.score+'/6.');
 if(r.practice==='little')parts.push(t('optionalPractice'));
 parts.push(t('limit'));return parts.join('\n');
}
function answerReport(a,r){
 const lines=[t('recommendation')+': '+t('course_'+r.course),describe(r)];
 assessmentSelects(standalone).filter(s=>!s.disabled).forEach(s=>{
  const op=[...s.options].find(o=>o.value===a[s.dataset.assessmentName]);
  const label=s.closest('label').querySelector('[data-i18n]').textContent;
  lines.push(label+': '+(op?.textContent||''));
 });return lines.join('\n');
}
function recordAttempt(force=false,applySelection=false){
 if(!completeAnswers())return false;
 const a=readAnswers();const sig=JSON.stringify(a);current=recommend(a);
 if(force||sig!==signature){attempts.push({time:new Date().toISOString(),language,answers:{...a},course:current.course,report:answerReport(a,current)});signature=sig;}
 if(applySelection)document.getElementById('student-course').value=current.course;
 if(applySelection&&current.track)document.getElementById('student-track').value=current.track;
 if(applySelection&&current.course==='kids')document.getElementById('student-goal').value='kids';
 syncTrack();renderResult();return true;
}
function renderResult(){
 if(!standalone)return;
 const box=document.getElementById('assessment-result');box.hidden=!current;
 document.getElementById('assessment-course').textContent=current?t('course_'+current.course):'';
 document.getElementById('assessment-reason').textContent=current?describe(current):'';
 document.getElementById('registration-assessment-result').textContent=current?t('recommendation')+': '+t('course_'+current.course)+'\n'+describe(current):'';
 document.getElementById('registration-assessment-status').textContent=attempts.length?t('attempts')+': '+attempts.length:'';
}
roots.forEach(root=>root.addEventListener('change',e=>{
 if(!e.target.matches('[data-assessment-name]'))return;
 answers[e.target.dataset.assessmentName]=e.target.value;current=null;syncAnswers();renderResult();refreshPreview();
}));
standalone?.addEventListener('submit',e=>{e.preventDefault();if(!standalone.reportValidity())return;if(recordAttempt(true,true)){const box=document.getElementById('assessment-result');box.focus();box.scrollIntoView({behavior:'smooth',block:'center'});refreshPreview();}});
standalone?.addEventListener('reset',()=>{answers={};current=null;setTimeout(()=>{syncAnswers();renderResult();refreshPreview();},0);});
document.getElementById('registration-assessment-complete')?.addEventListener('click',()=>{
 if(!recordAttempt(true,true))document.getElementById('registration-assessment-result').textContent=t('incomplete');refreshPreview();
});
document.getElementById('assessment-register')?.addEventListener('click',()=>{recordAttempt(false,true);document.getElementById('student-name').focus({preventScroll:true});refreshPreview();});
function syncTrack(){if(!registration)return;const sel=document.getElementById('student-track');sel.disabled=document.getElementById('student-course').value!=='interview';sel.closest('label').hidden=sel.disabled;}
document.querySelectorAll('[data-course-select]').forEach(a=>a.addEventListener('click',()=>{
 document.getElementById('student-course').value=a.dataset.courseSelect;
 if(a.dataset.courseSelect==='kids')document.getElementById('student-goal').value='kids';syncTrack();refreshPreview();
}));
function entries(){
 if(!registration)return [];
 const val=n=>registration.elements.namedItem(n)?.value?.trim()||'';
 const selected=n=>registration.elements.namedItem(n)?.selectedOptions?.[0]?.textContent?.trim()||'';
 const title=n=>t(n);
 return [
 ['Country',cfg.country],['Advisor source',cfg.advisor+' - '+cfg.title],['Website','https://'+cfg.domain+'/'],
 [title('name'),val('name')],[title('phone'),val('phone')],[title('email'),val('email')],
 [title('referred'),val('referred_by')],[title('level'),selected('level')],
 [title('courseInterest'),val('course')?selected('course'):t('unsure')],[title('track'),val('course')==='interview'?selected('track'):t('unsure')],
 [title('goal'),selected('goal')],[title('zone'),selected('timezone')],[title('time'),selected('time')],[title('message'),val('message')],
 ['Consent',registration.elements.namedItem('consent').checked?'Agreed':'Not agreed'],['Website language',language],
 ['Assessment attempts',attempts.length?attempts.map((a,i)=>'Attempt '+(i+1)+' - '+a.time+' (UTC) - '+a.language+'\n'+a.report).join('\n\n'):t('noAssessment')]
 ];
}
function requestText(){return '['+cfg.country+' Advisor - '+cfg.advisor+'] '+cfg.title+'\nFree trial request\n\n'+entries().map(([k,v])=>k+': '+v).join('\n');}
function refreshPreview(){if(registration)document.getElementById('registration-preview').textContent=requestText();}
function formReady(){if(!registration.reportValidity())return false;recordAttempt();refreshPreview();return true;}
function showStatus(key){document.getElementById('form-status').textContent=t(key);}
registration?.addEventListener('change',()=>{syncTrack();refreshPreview();});
registration?.addEventListener('input',refreshPreview);
document.getElementById('registration-review')?.addEventListener('toggle',refreshPreview);
registration?.addEventListener('submit',e=>{
 if(!formReady()){e.preventDefault();return;}
 // Use native POST so third-party activation/error pages cannot be mistaken for local success.
 showStatus('sending');
});
registration?.addEventListener('formdata',e=>{
 recordAttempt();
 const data=e.formData;
 data.set('_subject','['+cfg.country+' Advisor - '+cfg.advisor+'] Free trial - '+String(registration.elements.name.value).replace(/[\r\n]/g,' ').slice(0,100));
 data.set('request_details',requestText());
 const email=registration.elements.namedItem('email');
 if(email.value.trim()&&email.validity.valid)data.set('_autoresponse',t('success')+'\n'+cfg.info+'\nhttps://'+cfg.domain+'/');
 else data.delete('_autoresponse');
 // Inline finder controls are optional input UI, not unlabelled duplicate fields in the submission.
 document.querySelectorAll('#registration-assessment select').forEach(s=>data.delete(s.name));
});
document.getElementById('registration-email')?.addEventListener('click',()=>{
 if(!formReady())return;
 window.location.href='mailto:'+cfg.info+'?subject='+encodeURIComponent('['+cfg.country+' Advisor - '+cfg.advisor+'] Free trial request')+'&body='+encodeURIComponent(requestText());showStatus('draftOpened');
});
document.getElementById('registration-copy')?.addEventListener('click',async()=>{
 if(!formReady())return;
 try{await navigator.clipboard.writeText(requestText());showStatus('copied');}catch{document.getElementById('registration-review').open=true;showStatus('copyError');}
});
// Discard unsent personal form data on reset; the language preference remains local.
registration?.addEventListener('reset',()=>{answers={};attempts.length=0;current=null;signature=null;setTimeout(()=>{syncAnswers();syncTrack();renderResult();refreshPreview();},0);});
syncAnswers();syncTrack();
let saved;try{saved=localStorage.getItem('talkEnglishLanguage-'+cfg.country);}catch{}
setLanguage(saved||cfg.lang);
if(registration&&new URLSearchParams(window.location.search).get('registration')==='success')showStatus('success');
})();
