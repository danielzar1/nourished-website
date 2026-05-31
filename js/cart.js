/* =============================================================
   Nourished — Cart: localStorage state, totals, shipping,
   subscription discount, drawer rendering, free-ship bar.
   ============================================================= */
const Cart = (() => {
  const KEY = 'nourished_cart_v1';
  let items = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    render();
  }

  /* signature so identical lines merge (same product + subscribe + box config) */
  function sig(it) { return [it.kind, it.sku || it.boxKey, it.subscribe ? 'sub' : 'one'].join('|'); }

  function add(item) {
    const it = Object.assign({ qty: 1, subscribe: false, kind: 'product' }, item);
    const existing = items.find(x => sig(x) === sig(it));
    if (existing) existing.qty += it.qty;
    else items.push(it);
    save();
  }
  function setQty(i, qty) { if (items[i]) { items[i].qty = Math.max(1, qty); save(); } }
  function remove(i) { items.splice(i, 1); save(); }
  function clear() { items = []; save(); }
  function count() { return items.reduce((n, it) => n + it.qty, 0); }

  /* ---- totals ---- */
  function totals() {
    let subtotal = 0, saved = 0;
    items.forEach(it => {
      const line = it.unitPrice * it.qty;
      if (it.subscribe) { const d = line * STORE.subscriptionDiscount; saved += d; subtotal += line - d; }
      else subtotal += line;
    });
    const empty = items.length === 0;
    const freeShip = subtotal >= STORE.freeShippingThreshold;
    const shipping = empty ? 0 : (freeShip ? 0 : STORE.shippingFee);
    return { subtotal, saved, shipping, freeShip, total: subtotal + shipping, empty };
  }

  /* ---- rendering ---- */
  function render() {
    // header counts
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      const n = count();
      el.textContent = n;
      el.classList.toggle('is-visible', n > 0);
    });
    const drawer = document.querySelector('#cart-items');
    if (drawer) renderInto(drawer);
    // standalone cart page
    const pageMount = document.querySelector('#cart-page-items');
    if (pageMount) renderInto(pageMount, true);
    document.dispatchEvent(new CustomEvent('cart:change', { detail: totals() }));
  }

  function lineMeta(it) {
    if (it.kind === 'box' && it.contents) return it.contents;
    return it.packDesc || '';
  }

  function renderInto(mount, isPage) {
    const t = totals();
    if (t.empty) {
      mount.innerHTML = `<div class="cart-empty"><div class="big">🍬</div>
        <p>Your bag is empty — let's fix that!</p>
        <a class="btn" href="shop.html" style="margin-top:1rem">Shop the sweets</a></div>`;
      updateSummaries(t);
      return;
    }
    mount.innerHTML = items.map((it, i) => `
      <div class="cart-item">
        <img class="cart-item__img" src="${it.img}" alt="" loading="lazy">
        <div>
          <div class="cart-item__name">${it.name}</div>
          <div class="cart-item__meta">${lineMeta(it)}</div>
          ${it.subscribe ? `<div class="cart-item__sub">↻ Subscribe &amp; Save 5%</div>` : ''}
          <div class="qty" data-i="${i}">
            <button data-act="dec" aria-label="Decrease quantity">−</button>
            <span>${it.qty}</span>
            <button data-act="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <div class="cart-item__name">${money(it.unitPrice * it.qty * (it.subscribe ? 1 - STORE.subscriptionDiscount : 1))}</div>
          <button class="cart-item__remove" data-remove="${i}">Remove</button>
        </div>
      </div>`).join('');
    updateSummaries(t);
  }

  function updateSummaries(t) {
    document.querySelectorAll('[data-sum-subtotal]').forEach(e => e.textContent = money(t.subtotal));
    document.querySelectorAll('[data-sum-shipping]').forEach(e => e.textContent = t.freeShip ? 'FREE' : money(t.shipping));
    document.querySelectorAll('[data-sum-total]').forEach(e => e.textContent = money(t.total));
    document.querySelectorAll('[data-sum-saved]').forEach(e => {
      e.closest('[data-saved-row]') && e.closest('[data-saved-row]').style.setProperty('display', t.saved > 0 ? 'flex' : 'none');
      e.textContent = '−' + money(t.saved);
    });
    // free-shipping progress bar
    const remaining = Math.max(0, STORE.freeShippingThreshold - t.subtotal);
    const pct = Math.min(100, (t.subtotal / STORE.freeShippingThreshold) * 100);
    document.querySelectorAll('[data-ship-fill]').forEach(e => e.style.width = pct + '%');
    document.querySelectorAll('[data-ship-msg]').forEach(e => {
      e.innerHTML = t.empty ? `Spend ${money(STORE.freeShippingThreshold)} for free delivery`
        : t.freeShip ? `🎉 You've unlocked <strong>FREE delivery!</strong>`
        : `You're <strong>${money(remaining)}</strong> away from FREE delivery 🚚`;
    });
  }

  /* ---- drawer open/close ---- */
  function open() {
    document.querySelector('#cart-drawer')?.classList.add('is-open');
    document.querySelector('#overlay')?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.querySelector('#cart-drawer')?.setAttribute('aria-hidden', 'false');
  }
  function close() {
    document.querySelector('#cart-drawer')?.classList.remove('is-open');
    document.querySelector('#overlay')?.classList.remove('is-open');
    document.body.style.overflow = '';
    document.querySelector('#cart-drawer')?.setAttribute('aria-hidden', 'true');
  }

  /* delegated events for qty/remove inside any cart mount */
  document.addEventListener('click', e => {
    const dec = e.target.closest('[data-act]');
    if (dec) {
      const wrap = dec.closest('.qty'); const i = Number(wrap.dataset.i);
      setQty(i, items[i].qty + (dec.dataset.act === 'inc' ? 1 : -1)); return;
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) { remove(Number(rm.dataset.remove)); return; }
  });

  return { add, setQty, remove, clear, count, totals, render, open, close, get items() { return items; } };
})();
window.Cart = Cart;
