/**
 * Calls `callback(element)` once per element, the first time it intersects the
 * viewport, then stops watching that element.
 *
 * @param {Iterable<Element>} elements
 * @param {(element: Element) => void} callback
 * @param {IntersectionObserverInit} [options]
 */
export function whenVisible(elements, callback, options) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      callback(entry.target);
    }
  }, options);

  for (const element of elements) observer.observe(element);
}
