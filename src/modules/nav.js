/** Scroll offset after which the transparent nav gains its solid backdrop. */
const SOLID_AFTER_PX = 40;

export function initNav() {
  const nav = document.getElementById('nav');
  const menuButton = document.getElementById('menuBtn');
  const links = [...document.querySelectorAll('#navlinks a')];

  const updateBackdrop = () => nav.classList.toggle('solid', window.scrollY > SOLID_AFTER_PX);
  updateBackdrop();
  window.addEventListener('scroll', updateBackdrop, { passive: true });

  const isMenuOpen = () => nav.classList.contains('menu-open');
  const setMenuOpen = (open) => {
    nav.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
  };

  menuButton.addEventListener('click', () => setMenuOpen(!isMenuOpen()));
  for (const link of links) link.addEventListener('click', () => setMenuOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isMenuOpen()) return;
    setMenuOpen(false);
    menuButton.focus();
  });

  highlightCurrentSection(links);
}

/** Marks the nav link whose section crosses the middle of the viewport. */
function highlightCurrentSection(links) {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const hash = `#${entry.target.id}`;
        for (const link of links) link.classList.toggle('on', link.getAttribute('href') === hash);
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );

  for (const link of links) {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) spy.observe(section);
  }
}
