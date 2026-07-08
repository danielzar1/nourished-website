(() => {
  const hSlot = document.getElementById('header-slot');
  const fSlot = document.getElementById('footer-slot');

  const header = `<div class="announce">Premium better-for-you sweets, all the fun 🍬</div>
    <header class="site-header"><div class="container nav">
      <a class="nav__logo" href="/" aria-label="Nourished home">Nourished</a>
      <nav class="nav__links" aria-label="Primary">
        <a href="#shop">Shop</a>
        <a href="#about">About</a>
      </nav>
      <div class="nav__actions">
        <button class="icon-btn" id="cart-open" data-cart-target aria-label="Open cart">🛒 <span class="cart-count" data-cart-count>0</span></button>
      </div>
    </div></header>`;

  const year = document.documentElement.getAttribute('data-year') || new Date().getFullYear();
  const footer = `<footer class="site-footer"><div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <p>Natural and fun snacks for South Africa. Better-for-you sweets with no added sugar.</p>
      </div>
      <div><h4>Shop</h4><ul><li><a href="#shop">All Products</a></li></ul></div>
      <div><h4>Learn</h4><ul><li><a href="#about">About</a></li></ul></div>
    </div>
    <div class="footer-bottom"><span>© ${year} Nourished. All rights reserved.</span></div>
  </div></footer>`;

  const drawer = `<div class="overlay" id="overlay"></div>
    <aside class="cart-drawer" id="cart-drawer" role="dialog" aria-label="Shopping cart" aria-hidden="true">
      <div class="cart-drawer__head"><h2>Your bag</h2><button class="icon-btn" id="cart-close" aria-label="Close cart">✕</button></div>
      <div class="cart-items" id="cart-items"></div>
      <div class="cart-drawer__foot">
        <div class="cart-row"><span>Subtotal</span><span data-sum-subtotal>R0</span></div>
        <div class="cart-row"><span>Delivery</span><span data-sum-shipping>R0</span></div>
        <div class="cart-row cart-row--total"><span>Total</span><span data-sum-total>R0</span></div>
        <button class="btn btn--lg btn--block" id="checkout-btn">Checkout</button>
      </div>
    </aside>`;

  if (hSlot) hSlot.innerHTML = header;
  if (fSlot) fSlot.innerHTML = footer;
  document.body.insertAdjacentHTML('beforeend', drawer);

  const $ = s => document.querySelector(s);
  $('#cart-open')?.addEventListener('click', () => Cart.open());
  $('#cart-close')?.addEventListener('click', () => Cart.close());
  $('#overlay')?.addEventListener('click', () => Cart.close());

  Cart.render();
})();
