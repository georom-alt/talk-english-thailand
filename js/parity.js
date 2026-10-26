/* Profile interaction restored from the reference design. */
(() => {
  let active = null, opener = null;
  const close = () => {
    if (!active) return;
    active.classList.remove('is-open');
    active.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    active = null;
    opener?.focus();
  };
  document.querySelectorAll('[data-profile-open]').forEach(button => {
    button.addEventListener('click', () => {
      close();
      const dialog = document.getElementById(button.dataset.profileOpen);
      if (!dialog) return;
      opener = button;
      active = dialog;
      dialog.setAttribute('aria-hidden', 'false');
      dialog.classList.add('is-open');
      document.body.classList.add('modal-open');
      dialog.querySelector('button[data-profile-close]')?.focus();
    });
  });
  document.querySelectorAll('[data-profile-close]').forEach(button => button.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (!active) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const controls = [...active.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]')].filter(x => !x.disabled && x.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
})();
