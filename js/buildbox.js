/* =============================================================
   Nourished — Build-a-Box (Pick & Mix). Choose 3/6/12, mix
   individual bags, watch the box fill, confetti when complete.
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('bab');
  if (!root) return;

  const heroImg = document.getElementById('bab-hero');
  if (heroImg && window.BOX_HERO_IMG) heroImg.src = BOX_HERO_IMG;

  const flavours = mixableProducts();
  let size = STORE.boxSizes[1]; // default 6
  let picks = {};               // { sku: count }

  const slotsEl = root.querySelector('#bab-slots');
  const counterEl = root.querySelector('#bab-counter');
  const priceEl = root.querySelector('#bab-price');
  const addBtn = root.querySelector('#bab-add');
  const ringEl = root.querySelector('#bab-ring-fill');
  const boxEl = root.querySelector('#bab-box');

  const total = () => Object.values(picks).reduce((a, b) => a + b, 0);
  const price = () => size * STORE.pricePerBag;

  /* flavour picker grid */
  root.querySelector('#bab-flavours').innerHTML = flavours.map(p => `
    <div class="panel bab-flavour" data-sku="${p.sku}" style="padding:.7rem;text-align:center">
      <img src="${productImg(p,'front')}" alt="${p.name}" loading="lazy" style="width:100%;border-radius:var(--r-sm);aspect-ratio:1;object-fit:cover">
      <div style="font-family:var(--font-display);font-weight:600;font-size:.82rem;margin:.4rem 0 .5rem;line-height:1.15">${p.name}</div>
      <div class="qty" style="margin:0 auto;width:fit-content">
        <button data-dec="${p.sku}" aria-label="Remove one ${p.name}">−</button>
        <span data-count="${p.sku}">0</span>
        <button data-inc="${p.sku}" aria-label="Add one ${p.name}">+</button>
      </div>
    </div>`).join('');

  function renderSlots() {
    let html = '';
    const flat = [];
    Object.entries(picks).forEach(([sku, n]) => { for (let i = 0; i < n; i++) flat.push(sku); });
    for (let i = 0; i < size; i++) {
      const sku = flat[i];
      const p = sku && getProduct(sku);
      html += `<div class="bab-slot${p ? ' is-filled' : ''}" style="${p ? `--c:${p.accent}` : ''}">
        ${p ? `<img src="${productImg(p,'front')}" alt="${p.name}">` : '<span>+</span>'}</div>`;
    }
    slotsEl.innerHTML = html;
    slotsEl.style.gridTemplateColumns = `repeat(${size === 6 ? 3 : size === 12 ? 4 : 6}, 1fr)`;
  }

  function refresh() {
    const t = total();
    counterEl.textContent = `${t} / ${size}`;
    priceEl.textContent = money(price());
    flavours.forEach(p => { root.querySelector(`[data-count="${p.sku}"]`).textContent = picks[p.sku] || 0; });
    const pct = (t / size) * 100;
    if (ringEl) ringEl.style.strokeDashoffset = String(283 - (283 * Math.min(1, t / size)));
    const full = t === size;
    addBtn.disabled = !full;
    addBtn.textContent = full ? `Add box to bag · ${money(price())}` : `Pick ${size - t} more`;
    renderSlots();
    if (full) celebrateBox();
  }

  let wasFull = false;
  function celebrateBox() {
    if (!wasFull) { FX.celebrate(); FX.pop(700); jiggle(); }
    wasFull = true;
  }
  function jiggle() {
    if (FX.motion && typeof gsap !== 'undefined') gsap.fromTo(boxEl, { rotation: -2 }, { rotation: 2, duration: .1, repeat: 5, yoyo: true, ease: 'sine.inOut', onComplete: () => gsap.to(boxEl, { rotation: 0, duration: .15 }) });
  }

  function inc(sku) {
    if (total() >= size) { boxEl.classList.add('shake'); setTimeout(() => boxEl.classList.remove('shake'), 400); return; }
    picks[sku] = (picks[sku] || 0) + 1;
    if (total() < size) wasFull = false;
    FX.pop(480 + Object.keys(picks).length * 20);
    refresh();
  }
  function dec(sku) {
    if (!picks[sku]) return;
    picks[sku]--; if (!picks[sku]) delete picks[sku];
    wasFull = false; refresh();
  }

  root.addEventListener('click', e => {
    const i = e.target.closest('[data-inc]'); if (i) return inc(i.dataset.inc);
    const d = e.target.closest('[data-dec]'); if (d) return dec(d.dataset.dec);
  });

  /* size selector */
  root.querySelectorAll('[data-size]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(Number(btn.dataset.size) === size));
    btn.addEventListener('click', () => {
      size = Number(btn.dataset.size);
      if (total() > size) picks = {}; // reset if now over capacity
      wasFull = false;
      root.querySelectorAll('[data-size]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      refresh();
    });
  });

  /* surprise me — fill one of each flavour first, then duplicate at random */
  root.querySelector('#bab-surprise')?.addEventListener('click', () => {
    picks = {}; wasFull = false;
    const shuffled = flavours.slice().sort(() => Math.random() - 0.5);
    // at least one of each (up to the box size) before any duplicates
    shuffled.slice(0, Math.min(size, shuffled.length)).forEach(p => { picks[p.sku] = 1; });
    // fill any remaining slots with random duplicates
    while (total() < size) {
      const p = flavours[Math.floor(Math.random() * flavours.length)];
      picks[p.sku] = (picks[p.sku] || 0) + 1;
    }
    refresh();
  });

  /* subscribe toggle */
  let subscribe = false;
  root.querySelector('#bab-sub')?.addEventListener('change', e => { subscribe = e.target.checked; });

  /* add to cart */
  addBtn.addEventListener('click', () => {
    if (total() !== size) return;
    const contents = Object.entries(picks)
      .map(([sku, n]) => `${n}× ${getProduct(sku).name}`).join(', ');
    const boxKey = 'BOX' + size + '_' + Object.entries(picks).sort().map(([s, n]) => s + n).join('');
    Cart.add({
      kind: 'box', boxKey, name: `Build-Your-Own Box (${size} bags)`,
      unitPrice: price(), contents, img: productImg(getProduct(Object.keys(picks)[0]), 'front'), subscribe
    });
    FX.flyToCart(boxEl, productImg(getProduct(Object.keys(picks)[0]), 'front'));
    FX.celebrate();
    picks = {}; wasFull = false; refresh();
    Cart.open();
  });

  refresh();
  FX.setAccent('#8A6FD1', 'rgba(138,111,209,.14)');
});
