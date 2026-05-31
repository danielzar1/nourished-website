/* =============================================================
   Nourished — Product page: render from ?sku=, gallery,
   subscribe toggle, qty, add-to-cart, related.
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('product-mount');
  if (!mount) return;

  const sku = new URLSearchParams(location.search).get('sku');
  const p = getProduct(sku) || PRODUCTS[0];
  document.title = `${p.name} — Nourished`;
  FX.setAccent(p.accent);

  let qty = 1;
  let subscribe = false;

  const badges = [
    p.vegan ? `<span class="chip chip--vegan">🌱 Vegan</span>` : '',
    p.tags.includes('sour') ? `<span class="chip chip--sour">⚡ Sour</span>` : '',
    `<span class="chip">🚫🍬 No added sugar</span>`,
    `<span class="chip">🌾 Gluten free</span>`
  ].join('');

  mount.innerHTML = `
    <div class="split" style="align-items:flex-start">
      <div class="split__media">
        <div class="panel" style="padding:1rem">
          <img id="pdp-main" src="${productImg(p,'front')}" alt="${p.name}" data-tilt
               style="width:100%;border-radius:var(--r-md)" width="600" height="600">
          <div style="display:flex;gap:.6rem;margin-top:.8rem">
            <button class="pdp-thumb" data-img="${productImg(p,'front')}" aria-label="Front of pack"
              style="flex:1;border-radius:var(--r-sm);overflow:hidden;outline:2px solid var(--accent)">
              <img src="${productImg(p,'front')}" alt="" style="width:100%"></button>
            <button class="pdp-thumb" data-img="${productImg(p,'pack')}" aria-label="Multipack"
              style="flex:1;border-radius:var(--r-sm);overflow:hidden;outline:2px solid transparent">
              <img src="${productImg(p,'pack')}" alt="" style="width:100%"></button>
          </div>
        </div>
      </div>
      <div>
        <a href="shop.html" class="muted" style="font-size:.85rem">← Back to shop</a>
        <h1 style="font-size:clamp(2rem,4vw,2.8rem);margin:.6rem 0">${p.name}</h1>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem">${badges}</div>
        <div class="card__price" style="font-size:2rem" id="pdp-price">${money(p.price)}</div>
        <p class="muted" style="margin-bottom:1.2rem">${p.packDesc} · ${money(Math.round(p.price/12)) } per bag</p>
        <p class="lead" style="font-size:1.05rem;margin-bottom:1.5rem">${p.description}</p>

        <div class="stack" style="margin-bottom:1.4rem">
          <label class="toggle-card" data-active="true" data-mode="one">
            <input type="radio" name="purchase" value="one" checked>
            <span><span class="toggle-card__title">One-time purchase</span><br><span class="muted">${money(p.price)} — delivered once</span></span>
          </label>
          <label class="toggle-card" data-mode="sub">
            <input type="radio" name="purchase" value="sub">
            <span><span class="toggle-card__title">↻ Subscribe &amp; Save <span class="save-flag">5%</span></span><br>
            <span class="muted">${money(Math.round(p.price*0.95))} / month — skip or cancel anytime</span></span>
          </label>
        </div>

        <div style="display:flex;gap:.8rem;align-items:center;flex-wrap:wrap">
          <div class="qty" style="padding:.4rem">
            <button id="q-dec" aria-label="Decrease quantity">−</button>
            <span id="q-val">1</span>
            <button id="q-inc" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn--lg" id="pdp-add" style="flex:1;min-width:200px">Add to bag · <span id="pdp-add-total">${money(p.price)}</span></button>
        </div>

        <div class="grid pillars" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr));margin-top:2rem"></div>
      </div>
    </div>`;

  // mini pillars
  mount.querySelector('.pillars').innerHTML = PILLARS.slice(0,4).map(pl =>
    `<div class="pillar" style="padding:1rem .6rem"><h3 style="font-size:.92rem">${pl.title}</h3></div>`).join('');

  // gallery thumbs
  const main = document.getElementById('pdp-main');
  mount.querySelectorAll('.pdp-thumb').forEach(t => t.addEventListener('click', () => {
    main.src = t.dataset.img;
    mount.querySelectorAll('.pdp-thumb').forEach(o => o.style.outlineColor = 'transparent');
    t.style.outlineColor = 'var(--accent)';
  }));

  // purchase mode
  function refreshTotal() {
    const unit = subscribe ? Math.round(p.price * 0.95) : p.price;
    document.getElementById('pdp-add-total').textContent = money(unit * qty);
  }
  mount.querySelectorAll('input[name="purchase"]').forEach(r => r.addEventListener('change', e => {
    subscribe = e.target.value === 'sub';
    mount.querySelectorAll('.toggle-card').forEach(c => c.dataset.active = String(c.dataset.mode === e.target.value));
    refreshTotal();
  }));

  // qty
  document.getElementById('q-inc').addEventListener('click', () => { qty++; document.getElementById('q-val').textContent = qty; refreshTotal(); });
  document.getElementById('q-dec').addEventListener('click', () => { qty = Math.max(1, qty-1); document.getElementById('q-val').textContent = qty; refreshTotal(); });

  // add to cart
  document.getElementById('pdp-add').addEventListener('click', (e) => {
    Cart.add({ kind:'product', sku:p.sku, name:p.name, packDesc:p.packDesc,
      unitPrice:p.price, qty, img:productImg(p,'front'), subscribe });
    FX.flyToCart(main, productImg(p,'front'));
    FX.pop(560); FX.celebrate({ particleCount: 40 });
    Cart.open();
  });

  // related
  const rel = document.getElementById('related-grid');
  if (rel) {
    const related = PRODUCTS.filter(x => x.sku !== p.sku && x.tags.some(t => p.tags.includes(t))).slice(0,4);
    const list = related.length ? related : PRODUCTS.filter(x => x.sku !== p.sku).slice(0,4);
    rel.innerHTML = list.map(renderCard).join('');
    FX.initReveals(rel);
  }
  FX.initTilt(mount);
});
