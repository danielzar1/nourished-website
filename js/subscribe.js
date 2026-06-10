/* =============================================================
   Nourished — Subscription sign-up: plan picker, live price
   summary, validation + success state.
   Prototype: no backend. Live store wires to Shopify / Recharge.
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sub-form');
  if (!form) return;

  const disc = (window.STORE && STORE.subscriptionDiscount) || 0.10;
  const perBag = (window.STORE && STORE.pricePerBag) || 75;
  const fmt = window.money || (v => 'R' + Math.round(v));

  const state = { plan: 'surprise', size: 6, freq: 'Monthly', packs: {} };

  // Full-pack subscription options = the whole-flavour 12-bag boxes (gummies & chews).
  const packProducts = (window.PRODUCTS || []).filter(p => p.type === 'gummy' || p.type === 'chew');

  /* ---- Live summary ---- */
  const planLabel = () => state.plan === 'pick' ? 'Pick-your-own'
    : state.plan === 'packs' ? 'Full packs' : 'Surprise box';
  const packCount = () => Object.values(state.packs).reduce((a, b) => a + b, 0);
  function baseTotal() {
    if (state.plan === 'packs') {
      return Object.entries(state.packs).reduce((sum, [sku, n]) => {
        const p = getProduct(sku); return sum + (p ? p.price * n : 0);
      }, 0);
    }
    return state.size * perBag;
  }
  function updateSummary() {
    const base = baseTotal();
    const payable = Math.round(base * (1 - disc));
    const save = base - payable;
    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    const line = state.plan === 'packs'
      ? `${packCount() || 'No'} pack${packCount() === 1 ? '' : 's'} · ${state.freq} · Your flavours`
      : `${state.size} bags · ${state.freq} · ${planLabel()}`;
    set('sum-line', line);
    set('sum-price', fmt(payable));
    set('sum-was', fmt(base));
    set('sum-save', base > 0 ? `— you save ${fmt(save)} (${Math.round(disc * 100)}%)` : '');
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

  /* ---- Plan-dependent UI (bags per delivery vs full packs) ---- */
  const bagsBlock = document.getElementById('bags-block');
  const packsBlock = document.getElementById('packs-block');
  function syncPlanUI() {
    const isPacks = state.plan === 'packs';
    if (bagsBlock) bagsBlock.hidden = isPacks;
    if (packsBlock) packsBlock.hidden = !isPacks;
  }

  /* ---- Plan radio cards ---- */
  form.querySelectorAll('.toggle-card').forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    card.addEventListener('click', () => {
      form.querySelectorAll('.toggle-card').forEach(c => c.setAttribute('data-active', 'false'));
      card.setAttribute('data-active', 'true');
      radio.checked = true;
      state.plan = radio.value;
      syncPlanUI();
      updateSummary();
    });
  });

  /* ---- Full-pack picker (subscribe to whole 12-bag packs, multiple flavours) ---- */
  const packPicker = document.getElementById('pack-picker');
  if (packPicker) {
    packPicker.innerHTML = packProducts.map(p => `
      <div class="panel bab-flavour" data-sku="${p.sku}" style="padding:.7rem;text-align:center">
        <img src="${productImg(p,'front')}" alt="${p.name}" loading="lazy" style="width:100%;border-radius:var(--r-sm);aspect-ratio:1;object-fit:cover">
        <div style="font-family:var(--font-display);font-weight:600;font-size:.8rem;margin:.4rem 0 .3rem;line-height:1.15">${p.name}</div>
        <div class="qty" style="margin:0 auto .35rem;width:fit-content">
          <button type="button" data-pdec="${p.sku}" aria-label="One less pack of ${p.name}">−</button>
          <span data-pcount="${p.sku}">0</span>
          <button type="button" data-pinc="${p.sku}" aria-label="One more pack of ${p.name}">+</button>
        </div>
        <div class="muted" style="font-size:.74rem">${fmt(p.price)} / pack</div>
      </div>`).join('');
    const setCount = sku => { const el = packPicker.querySelector(`[data-pcount="${sku}"]`); if (el) el.textContent = state.packs[sku] || 0; };
    packPicker.addEventListener('click', e => {
      const inc = e.target.closest('[data-pinc]');
      const dec = e.target.closest('[data-pdec]');
      if (inc) { const s = inc.dataset.pinc; state.packs[s] = (state.packs[s] || 0) + 1; setCount(s); }
      else if (dec) { const s = dec.dataset.pdec; if (state.packs[s]) { state.packs[s]--; if (!state.packs[s]) delete state.packs[s]; setCount(s); } }
      else return;
      document.getElementById('packs-err')?.setAttribute('style', 'display:none');
      updateSummary();
    });
  }

  /* ---- Prefill from query (?size=6&plan=surprise&freq=Monthly) ---- */
  const q = new URLSearchParams(location.search);
  const qSize = q.get('size');
  if (qSize && ['3', '6', '12'].includes(qSize)) {
    document.querySelectorAll('#size-pills .size-pill').forEach(b =>
      b.setAttribute('aria-pressed', b.dataset.size === qSize ? 'true' : 'false'));
    state.size = Number(qSize);
  }
  const qPlan = q.get('plan');
  if (qPlan === 'pick' || qPlan === 'surprise' || qPlan === 'packs') {
    const radio = form.querySelector(`input[name="plan"][value="${qPlan}"]`);
    if (radio) {
      radio.checked = true;
      form.querySelectorAll('.toggle-card').forEach(c =>
        c.setAttribute('data-active', c.contains(radio) ? 'true' : 'false'));
      state.plan = qPlan;
    }
  }
  syncPlanUI();
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

    const packsErr = document.getElementById('packs-err');
    if (state.plan === 'packs' && packCount() === 0) { ok = false; if (packsErr) packsErr.style.display = ''; }
    else if (packsErr) packsErr.style.display = 'none';

    if (!ok) {
      if (state.plan === 'packs' && packCount() === 0) document.getElementById('packs-block')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else form.querySelector('.is-invalid input, .is-invalid select')?.focus();
      return;
    }

    const base = baseTotal();
    const payable = Math.round(base * (1 - disc));
    const name = val('name').split(' ')[0] || 'there';
    const planDesc = state.plan === 'packs'
      ? `${packCount()}-pack ${state.freq.toLowerCase()} subscription — ${Object.entries(state.packs).map(([s, n]) => `${n}× ${getProduct(s).name}`).join(', ')}`
      : `${state.size}-bag ${state.freq.toLowerCase()} ${planLabel().toLowerCase()} subscription`;
    const success = document.getElementById('sub-success');
    if (success) {
      success.innerHTML = `🎉 You're all set, ${name}! Your <strong>${planDesc}</strong> is reserved at <strong>${fmt(payable)}/delivery</strong>. We've sent a confirmation to <strong>${val('email')}</strong> to finalise your plan and set up secure payment. Welcome to the Nourished fam! 💛`;
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
