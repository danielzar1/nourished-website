const FX = (() => {
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = { motion: !mqReduce.matches, sound: false };
  mqReduce.addEventListener('change', e => { state.motion = !e.matches; });

  const hasGSAP = () => typeof window.gsap !== 'undefined';

  function celebrate(opts = {}) {
    if (!state.motion || typeof confetti === 'undefined') return;
    const colors = ['#FF4D7E', '#3FA66A', '#FFB23E', '#8A6FD1', '#34BBD0'];
    const base = { spread: 70, startVelocity: 45, colors, disableForReducedMotion: true };
    confetti({ ...base, particleCount: 80, origin: { y: .7 }, ...opts });
    setTimeout(() => confetti({ ...base, particleCount: 50, angle: 60, origin: { x: 0, y: .8 } }), 120);
    setTimeout(() => confetti({ ...base, particleCount: 50, angle: 120, origin: { x: 1, y: .8 } }), 120);
  }

  function setAccent(hex, soft) {
    const root = document.documentElement;
    root.style.setProperty('--accent', hex);
  }

  function initReveals(root = document) {
    const els = root.querySelectorAll('.reveal');
    if (!state.motion) { els.forEach(el => el.classList.add('is-in')); return; }
  }

  function initTilt(root = document) {
    if (!state.motion) return;
  }

  return { state, celebrate, setAccent, initReveals, initTilt, get motion() { return state.motion; } };
})();
window.FX = FX;
