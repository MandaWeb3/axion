import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './preferences.js';

/** Small lead so each state lights just before the rail fill reaches its dot. */
const LIGHT_LEAD = 0.02;

/** Fills the ANDRA rail with scroll progress and lights each operating state as it is reached. */
export function initOperatingStates() {
  const states = [...document.querySelectorAll('#states .state')];
  const railFill = document.getElementById('railFill');

  if (prefersReducedMotion) {
    for (const state of states) state.classList.add('lit');
    return;
  }

  railFill.style.setProperty('--p', '0');
  ScrollTrigger.create({
    trigger: '#states',
    start: 'top 80%',
    end: 'bottom 45%',
    scrub: 0.6,
    onUpdate: ({ progress }) => {
      railFill.style.setProperty('--p', progress.toFixed(3));
      states.forEach((state, index) => {
        state.classList.toggle('lit', progress >= index / (states.length - 1) - LIGHT_LEAD);
      });
    },
  });
}
