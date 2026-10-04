import { prefersReducedMotion } from './preferences.js';
import { whenVisible } from './when-visible.js';

const COUNT_DURATION_MS = 1800;

const formatNumber = (value) => Math.round(value).toLocaleString('en-US');
const easeOutQuart = (t) => 1 - (1 - t) ** 4;

/**
 * Fund figures count up from zero when they scroll into view. The markup holds
 * the final values, so they read correctly without JavaScript.
 */
export function initCounters() {
  const counters = [...document.querySelectorAll('.num[data-to]')];

  for (const counter of counters) {
    renderValue(counter, prefersReducedMotion ? Number(counter.dataset.to) : 0);
  }
  if (prefersReducedMotion) return;

  whenVisible(counters, countUp, { threshold: 0.5 });
}

function countUp(counter) {
  const target = Number(counter.dataset.to);
  const startedAt = performance.now();

  const step = (now) => {
    const progress = Math.min(1, (now - startedAt) / COUNT_DURATION_MS);
    renderValue(counter, target * easeOutQuart(progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Renders `value` with its optional prefix/suffix (e.g. "US$", "M", "+") highlighted. */
function renderValue(counter, value) {
  const { pre, suf } = counter.dataset;
  const parts = [formatNumber(value)];
  if (pre) parts.unshift(createUnit(pre));
  if (suf) parts.push(createUnit(suf));
  counter.replaceChildren(...parts);
}

function createUnit(text) {
  const unit = document.createElement('span');
  unit.className = 'u';
  unit.textContent = text;
  return unit;
}
