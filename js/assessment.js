/* Practical course guidance. A short written check does not measure speaking level. */
(function () {
'use strict';
const courses=['beginner','daily','business','interview','cruise','hotel','office-it','manufacturing-construction','maritime','massage-spa','nail','restaurant-service','warehousing-logistics','love-across-borders','corporate-a1','corporate-a2'];
function recommend(a) {
 const score=['q1','q2','q3','q4','q5','q6'].reduce((n,k)=>n+(a[k]==='1'?1:0),0);
 if(a.audience==='kids')return {course:'kids',track:'',score:null,reason:'kids',support:false,next:''};
 const independent=a.confidence==='2'&&a.experience==='independent'&&score>=5;
 let target='daily',reason='daily';
 if(a.goal==='corporate'){target=independent?'corporate-a2':'corporate-a1';reason='corporate';}
 else if(a.task==='interview'||a.goal==='interview'){target='interview';reason='interview';}
 else if(a.task==='relationship'||a.goal==='relationship'){target='love-across-borders';reason='relationship';}
 else if(courses.includes(a.sector)&&!['beginner','daily','business'].includes(a.sector)){target=a.sector;reason='sector';}
 else if(a.task==='business'||a.goal==='business'){target='business';reason='business';}
 else if(a.task==='service'){target='restaurant-service';reason='service';}
 else if(!a.task&&!a.goal&&courses.includes(a.interest)){target=a.interest;reason='interest';}
 const foundation=a.confidence==='0'||(a.skill==='start'&&a.experience==='never')||(score<=2&&a.confidence!=='2');
 const chosenBeginner=a.interest==='beginner';
 const course=foundation||chosenBeginner?'beginner':target;
 const next=course==='beginner'&&target!=='beginner'?target:'';
 return {course,next,track:course==='interview'?(independent?'advanced':'beginner'):'',score,reason:foundation?'foundation':chosenBeginner?'beginner':reason,support:foundation||a.skill==='start'||a.experience==='never'||score<3,urgent:a.urgency==='now',practice:a.practice,skill:a.skill,interest:a.interest,target};
}
if(typeof module!=='undefined'&&module.exports){module.exports={recommend};return;}
const form=document.getElementById('course-assessment');if(!form)return;
const result=document.getElementById('assessment-result'),course=document.getElementById('student-course'),track=document.getElementById('student-interview-track'),registration=document.getElementById('enquiry-form');
let current=null,answers=null;
const attempts=[];
let recordedSignature=null;
const text={
 foundation:['Bạn cho biết cần nhiều hỗ trợ để nói, hoặc câu trả lời cho thấy nên củng cố câu đơn giản trước. Bắt đầu với Beginner English, rồi tiến tới mục tiêu đã chọn. Đây là gợi ý điểm bắt đầu, không phải kết luận về trình độ nói.','Your speaking self-report or combined answers suggest building simple sentences first. Start with Beginner English, then progress toward your goal. This is a starting suggestion, not a finding about your speaking level.'],
 beginner:['Bạn muốn học nền tảng. Beginner English giúp luyện giới thiệu bản thân, câu hỏi và câu trả lời đơn giản.','You asked for foundation study. Beginner English focuses on introductions, simple questions and answers.'],
 daily:['Mục tiêu của bạn là trò chuyện hằng ngày. Luyện hội thoại ngắn, nghe câu hỏi và trả lời tiếp nối theo tình huống quen thuộc.','Your goal is everyday conversation. Practise short conversations, understanding questions and giving follow-up replies in familiar situations.'],
 business:['Bạn cần họp, email hoặc trao đổi với đồng nghiệp. Luyện cập nhật công việc, hỏi lại và diễn đạt yêu cầu đơn giản.','You need meetings, emails or colleague communication. Practise work updates, clarification and simple requests.'],
 interview:['Bạn cần ứng tuyển hoặc phỏng vấn. Luyện giới thiệu kinh nghiệm và trả lời câu hỏi; George sẽ xác nhận lộ trình qua phần nói.','You need job applications or interviews. Practise describing experience and answering questions; George will confirm the track through a speaking sample.'],
 corporate:['Bạn chọn chương trình cho nhóm doanh nghiệp. George cần xác nhận nhu cầu và khả năng giao tiếp của cả nhóm trước khi xếp lớp.','You selected corporate group learning. George needs to confirm the group’s needs and communication ability before placement.'],
 sector:['Môi trường làm việc bạn chọn quyết định chủ đề luyện tập. Đây là tiếng Anh thực tế, không phải đào tạo hay chứng chỉ nghề.','Your work setting determines the practice topics. This is practical English, not occupational training or certification.'],
 service:['Bạn cần trao đổi với khách nhưng chưa chọn ngành. Gợi ý Nhà hàng và Dịch vụ khách hàng; George sẽ xác nhận tình huống cụ thể.','You need customer communication without a specific industry. Restaurant and Customer Service is suggested; George will confirm the actual setting.'],
 relationship:['Bạn muốn giao tiếp trong mối quan hệ xuyên văn hóa. Chương trình dành cho người từ 18 tuổi, tập trung giao tiếp rõ ràng, tôn trọng và an toàn.','You want cross-cultural relationship communication. This age-18+ programme focuses on clear, respectful and safe communication.'],
 interest:['Gợi ý theo sở thích đã chọn; cần bổ sung mục tiêu và phần nói để xác nhận.','Suggested from your interest; goals and a speaking sample are needed for confirmation.'],
 kids:['Phụ huynh chọn chương trình cho trẻ. George sẽ trao đổi về nhóm tuổi, hoạt động và sự hỗ trợ phù hợp.','A parent selected the Kids programme. George will discuss age group, activities and suitable support.'],
 limit:['Câu hỏi viết ngắn không đo phát âm, nghe trực tiếp hay mức CEFR. George sẽ xác nhận điểm bắt đầu trong buổi học thử.','The short written check does not measure pronunciation, live listening or CEFR level. George will confirm the starting point in the trial.'],
 next:['Mục tiêu tiếp theo','Follow-on goal'], support:['Trọng tâm hỗ trợ','Support focus'], check:['Câu hỏi tiếng Anh','Short English check'], correct:['đúng','correct'], wrong:['cần xem lại','review needed'], noAssessment:['Chưa làm tự đánh giá; trao đổi trong buổi học thử.','No self-assessment completed; discuss during the trial.']};
const support={start:['Tạo câu đơn giản và bắt đầu nói.','Form simple sentences and start speaking.'],listen:['Nghe câu hỏi, nhận biết từ khóa và yêu cầu nói lại.','Understand questions, identify key words and ask for repetition.'],reply:['Trả lời câu hỏi tiếp nối và kéo dài hội thoại.','Answer follow-up questions and extend a conversation.'],words:['Tìm từ phù hợp và luyện cụm từ dùng trong tình huống thật.','Find useful words and practise phrases for real situations.']};
const en=()=>document.documentElement.lang==='en';
const t=k=>text[k][en()?1:0];
function label(key){return Array.from(course.options).find(o=>o.value===key)?.textContent.trim()||key;}
function description(){
 if(!current)return t('noAssessment');
 const parts=[t(current.reason)];
 if(current.next)parts.push(t('next')+': '+label(current.next)+'.');
 if(current.skill&&support[current.skill])parts.push(t('support')+': '+support[current.skill][en()?1:0]);
 if(current.score!==null)parts.push(t('check')+': '+current.score+'/6.');
 if(current.urgent)parts.push(en()?'You need English this month: discuss a focused plan with George.':'Bạn cần tiếng Anh trong tháng này: trao đổi kế hoạch tập trung với George.');
 if(current.practice==='little')parts.push(en()?'Outside practice is optional; focus on essentials in class.':'Luyện tập ngoài giờ là tự chọn; tập trung phần quan trọng trong lớp.');
 if(current.score!==null)parts.push(t('limit'));return parts.join('\n');
}
function questionLabel(sel){const root=sel.closest('label');return root?.querySelector(en()?'.assessment-en':'.assessment-vi')?.textContent.trim()||sel.name;}
function currentReport(){
 if(!current)return t('noAssessment');
 const lines=[(en()?'Suggested starting course: ':'Khóa học nên bắt đầu: ')+label(current.course)+(current.track?' — '+current.track:''),description(),''];
 form.querySelectorAll('select').forEach(sel=>{
  if(sel.disabled||!answers?.[sel.name])return;
  const opt=Array.from(sel.options).find(o=>o.value===answers[sel.name]);
  const value=(en()?opt?.dataset.assessmentEn:opt?.dataset.assessmentVi)||opt?.textContent.trim()||'';
  lines.push(questionLabel(sel)+': '+value+(/^q[1-6]$/.test(sel.name)?' ['+t(answers[sel.name]==='1'?'correct':'wrong')+']':''));
 });
 return lines.join('\n');
}
function report(){
 if(!attempts.length)return t('noAssessment');
 return attempts.map((a,i)=>(en()?'Assessment attempt ':'Lần tự đánh giá ')+(i+1)+' — '+a.time+'\n'+a.report).join('\n\n');
}
function recordAttempt(force=false){
 if(!current||!answers)return;
 const signature=JSON.stringify(answers);
 if(!force&&recordedSignature===signature)return;
 attempts.push({time:new Date().toISOString()+' (UTC)',report:currentReport(),course:current.course});
 recordedSignature=signature;
 window.dispatchEvent(new Event('nld-assessment-updated'));
}
window.NLDassessment={report,recommendation:()=>current?label(current.course):attempts.length?label(attempts[attempts.length-1].course):'',description};
function render(){
 form.querySelectorAll('[data-assessment-vi]').forEach(o=>{o.textContent=en()?o.dataset.assessmentEn:o.dataset.assessmentVi;});
 if(!current)return;
 document.getElementById('assessment-course').textContent=(en()?'Start with: ':'Nên bắt đầu với: ')+label(current.course)+(current.track?' — '+(current.track==='advanced'?'Advanced':'Beginner'):'');
 const reason=document.getElementById('assessment-reason');reason.textContent=description();reason.style.whiteSpace='pre-line';
 window.dispatchEvent(new Event('nld-assessment-updated'));
}
function clear(){current=null;answers=null;result.hidden=true;registration.querySelector('[name="self_assessment"]')?.remove();window.dispatchEvent(new Event('nld-assessment-updated'));}
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;answers=Object.fromEntries(new FormData(form));current=recommend(answers);recordAttempt(true);result.hidden=false;render();result.focus();result.scrollIntoView({behavior:'smooth',block:'center'});});
function syncAudience(){const child=form.elements.audience.value==='kids';form.querySelectorAll('[data-assessment-group]').forEach(group=>{const hide=group.dataset.assessmentGroup===(child?'adult':'child');group.hidden=hide;group.querySelectorAll('select').forEach(sel=>{sel.disabled=hide;});});}
form.addEventListener('change',()=>{clear();syncAudience();});form.addEventListener('reset',()=>{clear();setTimeout(syncAudience,0);});
syncAudience();
// Registration contains the same questions; keep one set of answers and one recommendation.
const inline=document.getElementById('registration-assessment');
if(inline){
 const summary=document.getElementById('registration-assessment-result');
 function mirror(){
  inline.querySelectorAll('[data-assessment-name]').forEach(sel=>{
   const original=form.elements.namedItem(sel.dataset.assessmentName);
   sel.value=original.value;sel.disabled=original.disabled;sel.required=false;
   sel.closest('[data-assessment-group]').hidden=original.closest('[data-assessment-group]').hidden;
  });
  summary.textContent=current?(en()?'Suggested starting course: ':'Khóa học nên bắt đầu: ')+label(current.course)+'\n'+description():'';
  summary.style.whiteSpace='pre-line';
  const status=document.getElementById('registration-assessment-status');
  status.textContent=attempts.length?(en()?'✓ Completed assessment included with registration. Attempts: ':'✓ Kết quả tự đánh giá được kèm theo đăng ký. Số lần: ')+attempts.length:'';
 }
 function completeInline(force=false){
  if(!form.checkValidity())return false;
  answers=Object.fromEntries(new FormData(form));current=recommend(answers);
  recordAttempt(force);render();mirror();return true;
 }
 document.getElementById('registration-assessment-complete').addEventListener('click',()=>{
  if(!completeInline(true)){
   summary.textContent=en()?'Answer the remaining questions to see a recommendation, or skip this section and register.':'Trả lời các câu còn lại để xem gợi ý, hoặc bỏ qua phần này và gửi đăng ký.';
  }
 });
 // Archive once before any actual payload is built, without making optional answers required.
 registration.addEventListener('submit',()=>completeInline(),true);
 registration.addEventListener('formdata',()=>completeInline(),true);
 ['registration-email','registration-copy'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>completeInline(),true));
 inline.addEventListener('change',e=>{
  const sel=e.target.closest('[data-assessment-name]');if(!sel)return;
  form.elements.namedItem(sel.dataset.assessmentName).value=sel.value;
  clear();syncAudience();
  if(form.checkValidity()){
   answers=Object.fromEntries(new FormData(form));current=recommend(answers);
   result.hidden=false;render();course.value=current.course;course.dispatchEvent(new Event('change',{bubbles:true}));
   if(track&&!track.disabled)track.value=current.track;
  }
  mirror();window.dispatchEvent(new Event('nld-assessment-updated'));
 });
 form.addEventListener('change',mirror);
 form.addEventListener('submit',mirror);
 form.addEventListener('reset',()=>setTimeout(mirror,0));
 registration.addEventListener('reset',()=>{form.reset();setTimeout(mirror,0);});
 window.addEventListener('nld-assessment-updated',mirror);
 new MutationObserver(()=>{
  inline.querySelectorAll('[data-assessment-vi]').forEach(o=>{o.textContent=en()?o.dataset.assessmentEn:o.dataset.assessmentVi;});mirror();
 }).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 mirror();
}
document.getElementById('assessment-register').addEventListener('click',()=>{if(!current)return;course.value=current.course;course.dispatchEvent(new Event('change',{bubbles:true}));if(track&&!track.disabled)track.value=current.track;document.getElementById('student-name')?.focus({preventScroll:true});});
render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();

