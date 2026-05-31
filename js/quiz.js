/* =============================================================
   Nourished — "Find Your Flavour" quiz. Light-hearted 4-question
   flow that scores flavour tags and reveals matched sweets.
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('quiz');
  if (!root) return;

  const QUESTIONS = [
    { q: 'First things first — how do you like it?', a: [
      { t: 'Sweet & juicy 🍓', tags: ['fruity'] },
      { t: 'Sour & zingy ⚡', tags: ['sour'] },
      { t: 'Smooth & creamy 🍦', tags: ['creamy'] } ] },
    { q: 'Pick your snack-time mood.', a: [
      { t: 'Adventurous — surprise me 🎉', tags: ['adventurous', 'fruity'] },
      { t: 'Comfort classics 🧸', tags: ['classic'] } ] },
    { q: 'Chewy or… chewier?', a: [
      { t: 'Bouncy gummies 🐻', tags: ['fruity'] },
      { t: 'Proper taffy chews 🍮', tags: ['chews', 'creamy'] },
      { t: 'A lasting lollipop 🍭', tags: ['sour', 'fruity'] } ] },
    { q: 'Last one — keeping it plant-based?', a: [
      { t: 'Yes, vegan please 🌱', vegan: true },
      { t: "I'm easy 😋", vegan: false } ] }
  ];

  let step = 0;
  const score = {};
  let veganOnly = false;

  function tally(ans) {
    (ans.tags || []).forEach(t => score[t] = (score[t] || 0) + 1);
    if (ans.vegan) veganOnly = true;
  }

  function render() {
    const total = QUESTIONS.length;
    if (step < total) {
      const Q = QUESTIONS[step];
      root.innerHTML = `
        <div class="panel reveal" style="max-width:640px;margin-inline:auto">
          <div class="ship-bar__track" style="margin-bottom:1.5rem"><div class="ship-bar__fill" style="width:${(step/total)*100}%"></div></div>
          <p class="muted" style="font-weight:700">Question ${step+1} of ${total}</p>
          <h2 style="font-size:clamp(1.5rem,4vw,2.2rem);margin:.4rem 0 1.5rem">${Q.q}</h2>
          <div class="stack">
            ${Q.a.map((a,i) => `<button class="toggle-card quiz-opt" data-i="${i}" style="width:100%;text-align:left;cursor:pointer">
              <span class="toggle-card__title" style="font-size:1.1rem">${a.t}</span></button>`).join('')}
          </div>
        </div>`;
      FX.initReveals(root);
      root.querySelectorAll('.quiz-opt').forEach(b => b.addEventListener('click', () => {
        tally(Q.a[Number(b.dataset.i)]); FX.pop(560); step++; render();
      }));
    } else {
      results();
    }
  }

  function results() {
    // rank products by tag overlap with score
    let pool = veganOnly ? PRODUCTS.filter(p => p.vegan) : PRODUCTS;
    if (!pool.length) pool = PRODUCTS;
    const ranked = pool.map(p => {
      let s = 0;
      p.tags.concat(p.flavourProfile).forEach(t => { if (score[t]) s += score[t]; });
      return { p, s };
    }).sort((a, b) => b.s - a.s);
    const top = ranked.slice(0, 3).map(r => r.p);
    const hero = top[0];
    FX.setAccent(hero.accent);
    FX.celebrate();

    root.innerHTML = `
      <div class="center reveal" style="max-width:760px;margin-inline:auto">
        <span class="eyebrow">Your flavour match</span>
        <h2 style="font-size:clamp(1.8rem,5vw,2.8rem);margin:.4rem 0 1.5rem">You're a <span style="color:var(--accent)">${hero.name}</span> kind of human 🎉</h2>
        <p class="lead" style="margin-inline:auto 0;margin-bottom:2rem">${hero.short} Here are your top matches:</p>
        <div class="grid product-grid">${top.map(renderCard).join('')}</div>
        <div style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap;margin-top:2.5rem">
          <a class="btn btn--lg" href="product.html?sku=${hero.sku}">Shop your match</a>
          <a class="btn btn--lg btn--ghost" href="build-a-box.html">Build a box with these</a>
          <button class="btn btn--ghost" id="quiz-restart">↺ Retake quiz</button>
        </div>
      </div>`;
    FX.initReveals(root);
    root.querySelectorAll('.card').forEach(card => card.addEventListener('pointerenter', () => FX.setAccent(card.dataset.accent)));
    document.getElementById('quiz-restart').addEventListener('click', () => {
      step = 0; veganOnly = false; Object.keys(score).forEach(k => delete score[k]); render();
    });
  }

  render();
});
