/* =============================================================
   Nourished — Contact form: validation + success state.
   Prototype: no backend. Live store wires to Shopify / email.
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // pre-select enquiry type from ?subject=
  const subj = new URLSearchParams(location.search).get('subject');
  if (subj) {
    const sel = form.querySelector('[name="subject"]');
    const map = { wholesale: 'Wholesale & stockists', subscription: 'Subscriptions' };
    if (sel && map[subj]) sel.value = map[subj];
  }

  const setError = (field, on) => field.closest('.field').classList.toggle('is-invalid', on);

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const msg = form.querySelector('[name="message"]');

    if (!name.value.trim()) { setError(name, true); ok = false; } else setError(name, false);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!emailOk) { setError(email, true); ok = false; } else setError(email, false);
    if (msg.value.trim().length < 5) { setError(msg, true); ok = false; } else setError(msg, false);

    if (!ok) { form.querySelector('.is-invalid input, .is-invalid textarea')?.focus(); return; }

    form.style.display = 'none';
    const success = document.getElementById('contact-success');
    if (success) { success.classList.add('is-visible'); success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    FX.celebrate();
  });

  // clear error as the user fixes the field
  form.querySelectorAll('input, textarea').forEach(el =>
    el.addEventListener('input', () => setError(el, false)));
});
