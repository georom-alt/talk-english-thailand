(function () {
  'use strict';
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const config = window.countryConfig;
  const label = config.advisor + ' · ' + config.title;
  const whatsapp = 'https://wa.me/' + config.whatsapp;
  const message = 'Enquiry via ' + label + '\nWebsite: https://' + config.domain + '/\n';
  const zoneLabel = document.createElement('label');
  zoneLabel.innerHTML = '<span>Local time zone</span><select name="time_zone" id="student-zone" required></select>';
  const zone = zoneLabel.querySelector('select');
  const zones = config.slug === 'indonesia'
    ? [['Asia/Jakarta','WIB · Jakarta (UTC+7)'],['Asia/Makassar','WITA · Bali / Makassar (UTC+8)'],['Asia/Jayapura','WIT · Papua (UTC+9)']]
    : [['Asia/Bangkok','ICT · Bangkok (UTC+7)']];
  zones.forEach(([value, text]) => zone.add(new Option(text,value)));
  document.getElementById('student-time').closest('label').after(zoneLabel);
  document.querySelectorAll('a[href*="zalo.me"]').forEach(link => {
    link.href = whatsapp + '?text=' + encodeURIComponent(message);
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    if (link.getAttribute('href').includes(config.info)) {
      link.href = 'mailto:' + config.info + '?subject=' + encodeURIComponent(message.split('\n')[0]);
    }
  });
  function entries() {
    const fields = [...new FormData(form).entries()].filter(([key]) => !key.startsWith('_') && key !== 'self_assessment');
    return [...fields, ['Advisor source',label],['Self-assessment',window.NLDassessment?.report() || 'Not completed'],['Suggested course',window.NLDassessment?.recommendation() || 'Discuss with George']];
  }
  function body() { return message + '\n' + entries().map(([key,value]) => key + ': ' + value).join('\n'); }
  function refresh() { const target=document.getElementById('registration-preview'); if(target) target.textContent=body(); }
  form.addEventListener('submit', () => {
    document.getElementById('registration-language').value = 'English';
    document.getElementById('registration-subject').value = label + ' · Trial request · ' + document.getElementById('student-name').value.replace(/[\r\n]/g,' ');
    document.getElementById('registration-autoresponse').disabled = true;
    let hidden=form.querySelector('[name="advisor_source"]');
    if(!hidden) { hidden=document.createElement('input');hidden.type='hidden';hidden.name='advisor_source';form.append(hidden); }
    hidden.value=label;
    showFormStatus('form_sending','sending');
  });
  document.getElementById('registration-email')?.addEventListener('click', () => {
    if (!form.reportValidity()) return;
    location.href = 'mailto:' + config.info + '?subject=' + encodeURIComponent(label + ' · Trial request') + '&body=' + encodeURIComponent(body());
    showFormStatus('form_opened');
  });
  document.getElementById('registration-copy')?.addEventListener('click', async () => {
    if (!form.reportValidity()) return;
    try { await navigator.clipboard.writeText(body());showFormStatus('form_copied'); }
    catch { document.getElementById('registration-review').open=true;showFormStatus('form_copy_failed'); }
  });
  form.addEventListener('input',refresh);
  form.addEventListener('change',refresh);
  window.addEventListener('nld-assessment-updated',refresh);
  refresh();
})();
