import { prefersReducedMotion } from './preferences.js';

/** Previous/next buttons scroll the business-case track by one card. */
export function initCaseTrack() {
  const track = document.getElementById('track');
  const behavior = prefersReducedMotion ? 'auto' : 'smooth';

  const cardStep = () => {
    const card = track.querySelector('.case');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  document.getElementById('prevCase').addEventListener('click', () => {
    track.scrollBy({ left: -cardStep(), behavior });
  });
  document.getElementById('nextCase').addEventListener('click', () => {
    track.scrollBy({ left: cardStep(), behavior });
  });
}
