function badgeHTML(p) {
  let b = '';
  if (p.vegan) b += `<span class="chip chip--vegan">🌱 Vegan</span>`;
  if (p.tags.includes('sour')) b += `<span class="chip chip--sour">⚡ Sour</span>`;
  return b;
}

function renderCard(p) {
  return `<article class="card reveal" data-accent="${p.accent}" data-sku="${p.sku}">
    <div class="card__media"><div class="card__badges">${badgeHTML(p)}</div></div>
    <div class="card__body">
      <h3 class="card__name">${p.name}</h3>
      <p class="card__desc">${p.short}</p>
      <div class="card__foot">
        <div class="card__price">${money(p.price)}</div>
        <button class="add-btn" data-add="${p.sku}" aria-label="Add ${p.name} to bag">+</button>
      </div>
    </div>
  </article>`;
}

function addProductToCart(sku, fromEl, subscribe = false) {
  const p = getProduct(sku); if (!p) return;
  Cart.add({
    kind: 'product', sku: p.sku, name: p.name, packDesc: p.packDesc,
    unitPrice: p.price, img: productImg(p, 'front'), subscribe
  });
  if (FX) FX.celebrate && FX.celebrate({ particleCount: 30 });
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#shop-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(renderCard).join('');
});

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-add]');
  if (btn) { addProductToCart(btn.dataset.add, btn); }
});

window.renderCard = renderCard;
window.addProductToCart = addProductToCart;
