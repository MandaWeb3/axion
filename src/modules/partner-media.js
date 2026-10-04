import partnerVideoUrl from '../assets/video/partner-globe.mp4';
import { prefersReducedMotion, prefersSavedData } from './preferences.js';
import { whenVisible } from './when-visible.js';

/**
 * The partner section's globe video preloads as it approaches, plays once when
 * the section is in view, then cross-fades to a still end frame. Any failure
 * (reduced motion, data saver, playback or network error) goes straight to
 * the end frame.
 */
export function initPartnerMedia() {
  const media = document.getElementById('partnerMedia');
  const video = document.getElementById('partnerVideo');
  const showEndFrame = () => media.classList.add('done');

  if (prefersReducedMotion || prefersSavedData) {
    showEndFrame();
    return;
  }

  let loaded = false;
  let played = false;

  const load = () => {
    if (loaded) return;
    loaded = true;
    video.src = partnerVideoUrl;
    video.load();
  };

  const play = () => {
    if (played) return;
    played = true;
    load();
    media.classList.add('playing');
    video.play().catch(showEndFrame);
  };

  video.addEventListener('ended', showEndFrame);
  video.addEventListener('error', showEndFrame);

  whenVisible([media], load, { rootMargin: '800px 0px' });
  whenVisible([media], play, { threshold: 0.35 });

  document.addEventListener('visibilitychange', () => {
    if (!played || media.classList.contains('done')) return;
    if (document.hidden) video.pause();
    else video.play().catch(showEndFrame);
  });
}
