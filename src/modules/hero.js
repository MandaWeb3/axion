import { gsap } from 'gsap';
import heroVideoUrl from '../assets/video/hero-hong-kong.mp4';
import { prefersReducedMotion, prefersSavedData } from './preferences.js';

/** Delay after window load before fetching the hero video, so it never competes with first paint. */
const VIDEO_START_DELAY_MS = 60;

export function initHero() {
  if (prefersReducedMotion) return;
  if (!prefersSavedData) loadBackgroundVideo();
  playIntro();
}

/**
 * Swaps the still hero image for the looping drone video once the page has
 * loaded. If the browser refuses to play it (e.g. low-power mode), the video
 * stays hidden and the still image remains.
 */
function loadBackgroundVideo() {
  const still = document.querySelector('#heroMedia img');
  const video = document.getElementById('heroVideo');
  let started = false;

  const showStill = () => video.classList.remove('ready');
  const play = () => video.play().catch(showStill);

  const start = () => {
    started = true;
    video.poster = still.currentSrc || still.src;
    video.src = heroVideoUrl;
    video.addEventListener(
      'canplay',
      () => {
        video.classList.add('ready');
        play();
      },
      { once: true },
    );
    video.load();
  };

  const startSoon = () => setTimeout(start, VIDEO_START_DELAY_MS);
  if (document.readyState === 'complete') startSoon();
  else window.addEventListener('load', startSoon, { once: true });

  document.addEventListener('visibilitychange', () => {
    if (!started) return;
    if (document.hidden) video.pause();
    else play();
  });
}

/** Headline words rise in, then the supporting copy fades up; the hero drifts on scroll. */
function playIntro() {
  gsap
    .timeline({ delay: 0.25 })
    .fromTo(
      '#heroTitle .w > span',
      { yPercent: 110, y: 0 },
      { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07 },
    )
    .fromTo(
      '.hfade',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 },
      '-=.6',
    );

  gsap.to('#heroMedia', {
    yPercent: 5,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero-in', {
    y: -24,
    opacity: 0.6,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true },
  });
}
