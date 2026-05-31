/* =============================================================
   Nourished — Home page: pillars, featured grid, stockists,
   hero motion. (Placeholder stockists until the real list lands.)
   ============================================================= */
const PILLAR_ICONS = {
  'no-sugar': '<path d="M12 2v20M5 5l14 14"/><circle cx="12" cy="12" r="9"/>',
  'fibre':    '<path d="M12 2C8 6 8 10 12 12s4 6 0 10"/><path d="M5 12h14"/>',
  'natural':  '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  'gluten':   '<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94z"/><circle cx="12" cy="12" r="9" opacity=".25"/>',
  'vegan':    '<path d="M2 22s4-10 12-10c0 0-1 10-9 10z"/><path d="M14 12c2-5 6-7 8-7 0 6-3 9-6 9.5"/>'
};

document.addEventListener('DOMContentLoaded', () => {
  // Pillars
  const pm = document.getElementById('pillars');
  if (pm) pm.innerHTML = PILLARS.map((p, i) => `
    <div class="pillar reveal" data-delay="${i * 70}">
      <div class="pillar__icon"><svg viewBox="0 0 24 24" aria-hidden="true">${PILLAR_ICONS[p.icon] || ''}</svg></div>
      <h3>${p.title}</h3><p>${p.blurb}</p>
    </div>`).join('');
  if (pm) FX.initReveals(pm);

  // Featured products (first 8)
  const fg = document.getElementById('featured-grid');
  if (fg) {
    fg.innerHTML = PRODUCTS.slice(0, 8).map(renderCard).join('');
    FX.initReveals(fg);
    fg.querySelectorAll('.card').forEach(card =>
      card.addEventListener('pointerenter', () => FX.setAccent(card.dataset.accent)));
  }

  // Stockists strip (placeholder retailers — replace with real list)
  const ss = document.getElementById('stockist-strip');
  if (ss) {
    const stores = ['Wellness Co.', 'Pharma Plus', 'Natural Foods Market', 'GreenGrocer', 'FuelUp Stores'];
    ss.innerHTML = stores.map(s => `
      <div class="panel" style="padding:1rem;text-align:center;font-family:var(--font-display);font-weight:600;color:var(--ink-soft)">${s}</div>`).join('');
  }

  // Hero: gentle bob + cycle product image
  const hp = document.getElementById('hero-product');
  if (hp) hp.src = productImg('FUN1001', 'front'); // embedded data URI (file:// safe)
  if (hp && FX.motion && typeof gsap !== 'undefined') {
    gsap.to(hp, { y: -16, rotation: 2, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    const skus = PRODUCTS.filter(p => p.type !== 'lollipop');
    let i = 0;
    setInterval(() => {
      i = (i + 1) % skus.length;
      gsap.to(hp, { opacity: 0, scale: .9, duration: .35, onComplete: () => {
        hp.src = productImg(skus[i], 'front');
        FX.setAccent(skus[i].accent);
        gsap.to(hp, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(1.6)' });
      }});
    }, 2600);
  }
});
