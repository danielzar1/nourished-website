/* =============================================================
   Nourished — Subscription sign-up: plan picker, live price
   summary, validation + success state.
   Prototype: no backend. Live store wires to Shopify / Recharge.
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sub-form');
  if (!form) return;

  const disc = (window.STORE && STORE.subscriptionDiscount) || 0.05;
  const perBag = (window.STORE && STORE.pricePerBag) || 75;
  const fmt = window.money || (v => 'R' + Math.round(v));

  const state = { plan: 'surprise', size: 6, freq: 'Monthly' };

  /* ---- Live summary ---- */
  const planLabel = () => state.plan === 'pick' ? 'Pick-your-own' : 'Surprise box';
  function updateSummary() {
    const base = state.size * perBag;
    const payable = Math.round(base * (1 - disc));
    const save = base - payable;
    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    set('sum-line', `${state.size} bags · ${state.freq} · ${planLabel()}`);
    set('sum-price', fmt(payable));
    set('sum-was', fmt(base));
    set('sum-save', `— you save ${fmt(save)} (${Math.round(disc * 100)}%)`);
  }

  /* ---- Label the size pills with their per-delivery price ---- */
  document.querySelectorAll('#size-pills .size-pill').forEach(btn => {
    const small = btn.querySelector('small');
    if (small) small.textContent = fmt(Number(btn.dataset.size) * perBag);
  });

  /* ---- Pill groups (single-select via aria-pressed) ---- */
  function wirePills(containerId, key, parse = v => v) {
    const group = document.getElementById(containerId);
    if (!group) return;
    group.addEventListener('click', e => {
      const btn = e.target.closest('.size-pill');
      if (!btn) return;
      group.querySelectorAll('.size-pill').forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
      state[key] = parse(btn.dataset[key === 'size' ? 'size' : 'freq']);
      updateSummary();
    });
  }
  wirePills('size-pills', 'size', Number);
  wirePills('freq-pills', 'freq');

  /* ---- Plan radio cards ---- */
  form.querySelectorAll('.toggle-card').forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    card.addEventListener('click', () => {
      form.querySelectorAll('.toggle-card').forEach(c => c.setAttribute('data-active', 'false'));
      card.setAttribute('data-active', 'true');
      radio.checked = true;
      state.plan = radio.value;
      updateSummary();
    });
  });

  /* ---- Prefill from query (?size=6&plan=surprise&freq=Monthly) ---- */
  const q = new URLSearchParams(location.search);
  const qSize = q.get('size');
  if (qSize && ['3', '6', '12'].includes(qSize)) {
    document.querySelectorAll('#size-pills .size-pill').forEach(b =>
      b.setAttribute('aria-pressed', b.dataset.size === qSize ? 'true' : 'false'));
    state.size = Number(qSize);
  }
  const qPlan = q.get('plan');
  if (qPlan === 'pick' || qPlan === 'surprise') {
    const radio = form.querySelector(`input[name="plan"][value="${qPlan}"]`);
    if (radio) {
      radio.checked = true;
      form.querySelectorAll('.toggle-card').forEach(c =>
        c.setAttribute('data-active', c.contains(radio) ? 'true' : 'false'));
      state.plan = qPlan;
    }
  }
  const qFreq = q.get('freq');
  if (qFreq) {
    const fb = [...document.querySelectorAll('#freq-pills .size-pill')].find(b => b.dataset.freq === qFreq);
    if (fb) {
      document.querySelectorAll('#freq-pills .size-pill').forEach(b => b.setAttribute('aria-pressed', b === fb ? 'true' : 'false'));
      state.freq = qFreq;
    }
  }
  updateSummary();

  /* ---- Validation + success ---- */
  const setError = (el, on) => el.closest('.field').classList.toggle('is-invalid', on);
  const required = ['name', 'street', 'suburb', 'city', 'postal', 'province'];

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    const val = n => (form.querySelector(`[name="${n}"]`).value || '').trim();

    required.forEach(n => {
      const el = form.querySelector(`[name="${n}"]`);
      const bad = !val(n);
      setError(el, bad); if (bad) ok = false;
    });
    const email = form.querySelector('[name="email"]');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'));
    setError(email, !emailOk); if (!emailOk) ok = false;

    const phone = form.querySelector('[name="phone"]');
    const phoneOk = (val('phone').replace(/\D/g, '').length >= 9);
    setError(phone, !phoneOk); if (!phoneOk) ok = false;

    if (!ok) { form.querySelector('.is-invalid input, .is-invalid select')?.focus(); return; }

    const base = state.size * perBag;
    const payable = Math.round(base * (1 - disc));
    const name = val('name').split(' ')[0] || 'there';
    const success = document.getElementById('sub-success');
    if (success) {
      success.innerHTML = `🎉 You're all set, ${name}! Your <strong>${state.size}-bag ${state.freq.toLowerCase()} ${planLabel().toLowerCase()}</strong> subscription is reserved at <strong>${fmt(payable)}/delivery</strong>. We've sent a confirmation to <strong>${val('email')}</strong> to finalise your flavours and set up secure payment. Welcome to the Nourished fam! 💛`;
      success.classList.add('is-visible');
    }
    form.style.display = 'none';
    success?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (window.FX && FX.celebrate) FX.celebrate();
  });

  /* clear error as the user fixes a field */
  form.querySelectorAll('input, select, textarea').forEach(el =>
    el.addEventListener('input', () => setError(el, false)));
});
