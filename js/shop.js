/* =============================================================
   Nourished — Shop grid: cards, filters, hover swap,
   flavour theming, add-to-cart. Also exposes renderCard()
   for reuse on home + related sections.
   ============================================================= */
function badgeHTML(p) {
  let b = '';
  if (p.vegan) b += `<span class="chip chip--vegan">🌱 Vegan</span>`;
  if (p.tags.includes('sour')) b += `<span class="chip chip--sour">⚡ Sour</span>`;
  return b;
}

function renderCard(p) {
  return `
  <article class="card reveal" data-accent="${p.accent}" data-sku="${p.sku}">
    <div class="card__media">
      <div class="card__badges">${badgeHTML(p)}</div>
      <img class="img-front" src="${productImg(p, 'front')}" alt="${p.name} pack" loading="lazy" width="600" height="600">
      <img class="img-pack" src="${productImg(p, 'pack')}" alt="${p.name} ${p.packDesc}" loading="lazy" width="600" height="600">
    </div>
    <div class="card__body">
      <h3 class="card__name">${p.name}</h3>
      <p class="card__desc">${p.short}</p>
      <div class="card__foot">
        <div class="card__price">${money(p.price)}<small>${p.packDesc}</small></div>
        <button class="add-btn" data-add="${p.sku}" aria-label="Add ${p.name} to bag">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      <a class="card__link" href="product.html?sku=${p.sku}" aria-label="View ${p.name}"></a>
    </div>
  </article>`;
}

/* Add a product to cart with fly animation + flavour-tinted confetti */
function addProductToCart(sku, fromEl, subscribe = false) {
  const p = getProduct(sku); if (!p) return;
  Cart.add({
    kind: 'product', sku: p.sku, name: p.name, packDesc: p.packDesc,
    unitPrice: p.price, img: productImg(p, 'front'), subscribe
  });
  FX.flyToCart(fromEl, productImg(p, 'front'));
  FX.pop(560);
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#shop-grid');
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  let activeFilter = params.get('filter') || 'all';

  function paint() {
    const list = activeFilter === 'all' ? PRODUCTS
      : activeFilter === 'vegan' ? PRODUCTS.filter(p => p.vegan)
      : PRODUCTS.filter(p => p.tags.includes(activeFilter));
    grid.innerHTML = list.map(renderCard).join('');
    FX.initReveals(grid);
    // flavour theming on card hover
    grid.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointerenter', () => FX.setAccent(card.dataset.accent));
    });
  }

  // filter pills
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.dataset.filter === activeFilter));
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-pill').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      paint();
    });
  });

  paint();
});

/* Global delegate for any [data-add] button across the site */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-add]');
  if (btn) { addProductToCart(btn.dataset.add, btn); }
});

window.renderCard = renderCard;
window.addProductToCart = addProductToCart;
