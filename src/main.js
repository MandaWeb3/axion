import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initAuthorityLadder } from './modules/authority-ladder.js';
import { initCaseTrack } from './modules/case-track.js';
import { initCounters } from './modules/counters.js';
import { initHero } from './modules/hero.js';
import { initNav } from './modules/nav.js';
import { initNetworkCanvas } from './modules/network-canvas.js';
import { initNewsletter } from './modules/newsletter.js';
import { initOperatingStates } from './modules/operating-states.js';
import { initPartnerMedia } from './modules/partner-media.js';
import { initPointerEffects } from './modules/pointer-effects.js';
import { initReveal } from './modules/reveal.js';
import { initStackLayers } from './modules/stack-layers.js';
import { initTeam } from './modules/team.js';

gsap.registerPlugin(ScrollTrigger);

initReveal();
initHero();
initPartnerMedia();
initNav();
initPointerEffects();
initOperatingStates();
initAuthorityLadder();
initStackLayers();
initCounters();
initCaseTrack();
initNetworkCanvas();
initTeam();
initNewsletter();

// Images and fonts shift section positions as they load; re-measure scroll-linked animations.
window.addEventListener('load', () => ScrollTrigger.refresh());
