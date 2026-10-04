/** User and device preferences that gate motion, media and pointer effects. */

export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** True when the browser reports a data-saver mode, so heavy video is skipped. */
export const prefersSavedData = Boolean(navigator.connection?.saveData);
