/* =============================================================
   Nourished — Home page: pillars, featured grid, stockists,
   hero motion. (Placeholder stockists until the real list lands.)
   ============================================================= */
const PILLAR_ICONS = {
  'no-sugar': '<path d="M12 2v20M5 5l14 14"/><circle cx="12" cy="12" r="9"/>',
  'no-alcohol': '<path d="M12 3C8.5 8 7 11 7 14a5 5 0 0 0 10 0c0-3-1.5-6-5-11z"/><line x1="4" y1="4" x2="20" y2="20"/>',
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

  // Stockists strip (real retailers — see stockists.html for the full list)
  const ss = document.getElementById('stockist-strip');
  if (ss) {
    const stores = ['Pantry Jan Smuts', 'Pantry Hazelwood', 'Pantry Bassonia', 'Mastro Craighall', 'Melrose Arch Flower Market'];
    ss.innerHTML = stores.map(s => `
      <div class="panel" style="padding:1rem;text-align:center;font-family:var(--font-display);font-weight:600;color:var(--ink-soft)">${s}</div>`).join('');
  }

  // Hero: static lifestyle box image (embedded base64 — file:// safe on Drive)
  const hp = document.getElementById('hero-product');
  if (hp) hp.src = BOX_HERO_IMG;
});
