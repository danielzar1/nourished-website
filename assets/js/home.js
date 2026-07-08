document.addEventListener('DOMContentLoaded', () => {
  const pm = document.getElementById('pillars');
  if (pm) pm.innerHTML = PILLARS.map((p, i) => `<div class="pillar reveal" data-delay="${i * 70}"><h3>${p.title}</h3><p>${p.blurb}</p></div>`).join('');

  const fg = document.getElementById('featured-grid');
  if (fg) fg.innerHTML = PRODUCTS.slice(0, 8).map(renderCard).join('');
});
