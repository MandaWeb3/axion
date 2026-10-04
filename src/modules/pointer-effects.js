import { hasFinePointer, prefersReducedMotion } from './preferences.js';

/** Fraction of the remaining distance the glow covers each frame. */
const GLOW_EASING = 0.14;
/** Stop animating once the glow is within this many pixels of the pointer. */
const GLOW_REST_PX = 0.1;
/** Matches the `.btn.settling` transition duration. */
const SETTLE_MS = 500;

/** Cursor glow and magnetic buttons, for mouse and trackpad users only. */
export function initPointerEffects() {
  if (!hasFinePointer || prefersReducedMotion) return;
  document.body.classList.add('has-pointer');
  followPointer(document.querySelector('.cursor-glow'));
  document.querySelectorAll('.magnetic').forEach(makeMagnetic);
}

/** Eases the glow toward the pointer, running frames only while it is catching up. */
function followPointer(glow) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let targetX = x;
  let targetY = y;
  let frameId = 0;

  const frame = () => {
    x += (targetX - x) * GLOW_EASING;
    y += (targetY - y) * GLOW_EASING;
    glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    const resting = Math.abs(targetX - x) < GLOW_REST_PX && Math.abs(targetY - y) < GLOW_REST_PX;
    frameId = resting ? 0 : requestAnimationFrame(frame);
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!frameId) frameId = requestAnimationFrame(frame);
    },
    { passive: true },
  );

  // Place the glow at the viewport centre until the pointer first moves.
  frameId = requestAnimationFrame(frame);
}

/** Pulls a button (and, a little less, its label) toward the pointer. */
function makeMagnetic(button) {
  const label = button.querySelector('span');
  let settleTimer = 0;

  button.addEventListener('pointermove', (event) => {
    const rect = button.getBoundingClientRect();
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
    if (label) label.style.transform = `translate(${dx * 0.12}px, ${dy * 0.15}px)`;
  });

  button.addEventListener('pointerleave', () => {
    clearTimeout(settleTimer);
    button.classList.add('settling');
    button.style.transform = '';
    if (label) label.style.transform = '';
    settleTimer = setTimeout(() => button.classList.remove('settling'), SETTLE_MS);
  });
}
