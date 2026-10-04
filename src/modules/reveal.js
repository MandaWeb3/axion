import { whenVisible } from './when-visible.js';

/** Fades `.rv` elements up into place the first time they scroll into view. */
export function initReveal() {
  whenVisible(document.querySelectorAll('.rv'), (element) => element.classList.add('in'), {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12,
  });
}
