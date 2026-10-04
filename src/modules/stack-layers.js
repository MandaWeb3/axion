import { gsap } from 'gsap';
import { hasFinePointer, prefersReducedMotion } from './preferences.js';

/** Resting tilt of the isometric stack; keep in sync with `.iso` in build.css. */
const BASE_TILT_X = 58;
const BASE_TILT_Z = -40;
/** Maximum extra tilt, in degrees, across the full width/height of the stack area. */
const TILT_RANGE_X = 8;
const TILT_RANGE_Z = 10;

/** Highlights an architecture layer in the isometric stack when its description is chosen. */
export function initStackLayers() {
  const slabs = [...document.querySelectorAll('.slab')];
  const buttons = [...document.querySelectorAll('.layer-btn')];

  const select = (layer) => {
    for (const slab of slabs) slab.classList.toggle('on', slab.dataset.l === layer);
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.l === layer));
  };

  for (const button of buttons) {
    const { l: layer } = button.dataset;
    button.addEventListener('click', () => select(layer));
    button.addEventListener('focus', () => select(layer));
    if (hasFinePointer) button.addEventListener('mouseenter', () => select(layer));
  }

  if (hasFinePointer && !prefersReducedMotion) tiltWithPointer();
}

/** Tilts the stack slightly toward the pointer while it moves over the section. */
function tiltWithPointer() {
  const iso = document.getElementById('iso');
  const isoBox = iso.parentElement;
  // The tilt properties are declared in deg on `.iso`, so GSAP keeps that unit.
  const tweenOptions = { duration: 0.8, ease: 'power2.out' };
  const tiltX = gsap.quickTo(iso, '--tilt-x', tweenOptions);
  const tiltZ = gsap.quickTo(iso, '--tilt-z', tweenOptions);

  isoBox.closest('.stack-wrap').addEventListener('pointermove', (event) => {
    const rect = isoBox.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltX(BASE_TILT_X - y * TILT_RANGE_X);
    tiltZ(BASE_TILT_Z + x * TILT_RANGE_Z);
  });
}
