/* =============================================================
   Nourished — FX: motion, confetti, sound, scroll reveals.
   Central reduced-motion guard: every effect checks FX.motion.
   ============================================================= */
const FX = (() => {
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = { motion: !mqReduce.matches, sound: false };
  mqReduce.addEventListener('change', e => { state.motion = !e.matches; });

  const hasGSAP = () => typeof window.gsap !== 'undefined';

  /* ---- Confetti celebration ---- */
  function celebrate(opts = {}) {
    if (!state.motion || typeof confetti === 'undefined') return;
    const colors = ['#FF4D7E', '#3FA66A', '#FFB23E', '#8A6FD1', '#34BBD0'];
    const base = { spread: 70, startVelocity: 45, colors, disableForReducedMotion: true };
    confetti({ ...base, particleCount: 80, origin: { y: .7 }, ...opts });
    setTimeout(() => confetti({ ...base, particleCount: 50, angle: 60, origin: { x: 0, y: .8 } }), 120);
    setTimeout(() => confetti({ ...base, particleCount: 50, angle: 120, origin: { x: 1, y: .8 } }), 120);
  }

  /* ---- Tiny WebAudio "pop" (no asset needed); off by default ---- */
  let actx;
  function pop(freq = 520) {
    if (!state.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      o.connect(g); g.connect(actx.destination);
      g.gain.setValueAtTime(.0001, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(.18, actx.currentTime + .01);
      g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + .22);
      o.start(); o.stop(actx.currentTime + .24);
    } catch (e) { /* no-op */ }
  }
  function toggleSound(on) { state.sound = on ?? !state.sound; return state.sound; }

  /* ---- Fly product image into the cart icon ---- */
  function flyToCart(fromEl, imgSrc) {
    const target = document.querySelector('[data-cart-target]');
    if (!state.motion || !fromEl || !target) return;
    const s = fromEl.getBoundingClientRect(), t = target.getBoundingClientRect();
    const tok = document.createElement('img');
    tok.src = imgSrc; tok.className = 'fly-token';
    tok.style.left = s.left + s.width / 2 - 30 + 'px';
    tok.style.top = s.top + s.height / 2 - 30 + 'px';
    document.body.appendChild(tok);
    const dx = (t.left + t.width / 2) - (s.left + s.width / 2);
    const dy = (t.top + t.height / 2) - (s.top + s.height / 2);
    if (hasGSAP()) {
      gsap.to(tok, { duration: .8, ease: 'power1.in',
        keyframes: [
          { x: dx * .35, y: dy - 120, scale: 1.1, duration: .35, ease: 'power2.out' },
          { x: dx, y: dy, scale: .2, opacity: .4, duration: .45, ease: 'power2.in' }
        ],
        onComplete: () => { tok.remove(); bounce(target); pop(620); }
      });
    } else {
      tok.style.transition = 'transform .7s cubic-bezier(.5,0,.5,1), opacity .7s';
      requestAnimationFrame(() => { tok.style.transform = `translate(${dx}px,${dy}px) scale(.2)`; tok.style.opacity = '.3'; });
      setTimeout(() => { tok.remove(); bounce(target); }, 720);
    }
  }
  function bounce(el) {
    if (!el) return;
    if (hasGSAP() && state.motion) gsap.fromTo(el, { scale: 1 }, { scale: 1.35, duration: .18, yoyo: true, repeat: 1, ease: 'power2.out' });
  }

  /* ---- Scroll reveals (IntersectionObserver) ---- */
  function initReveals(root = document) {
    const els = root.querySelectorAll('.reveal');
    if (!state.motion) { els.forEach(el => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          const el = en.target;
          setTimeout(() => el.classList.add('is-in'), (Number(el.dataset.delay) || 0));
          io.unobserve(el);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ---- 3D tilt on hover (pointer only) ---- */
  function initTilt(root = document) {
    if (!state.motion || window.matchMedia('(hover: none)').matches) return;
    root.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(700px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---- Floating candy bits in a container ---- */
  function floatBits(container, emojis = ['🍓','🍬','🐻','🍭','🍑','🐸']) {
    if (!state.motion || !container || !hasGSAP()) return;
    emojis.forEach((e, i) => {
      const b = document.createElement('span');
      b.className = 'candy-bit'; b.textContent = e; b.setAttribute('aria-hidden', 'true');
      b.style.left = (8 + (i * 15) % 84) + '%';
      b.style.top = (10 + (i * 27) % 70) + '%';
      container.appendChild(b);
      gsap.to(b, { y: '+=18', rotation: (i % 2 ? 12 : -12), duration: 2 + i * .3,
        repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * .2 });
    });
  }

  /* set the global accent (flavour theming) */
  function setAccent(hex, soft) {
    const root = document.documentElement;
    root.style.setProperty('--accent', hex);
    if (soft) root.style.setProperty('--accent-soft', soft);
    else root.style.setProperty('--accent-soft', hexToSoft(hex));
  }
  function hexToSoft(hex) {
    const h = hex.replace('#',''); const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},0.14)`;
  }

  return { state, celebrate, pop, toggleSound, flyToCart, bounce, initReveals, initTilt, floatBits, setAccent,
    get motion() { return state.motion; } };
})();
window.FX = FX;
