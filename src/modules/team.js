/** Keyboard users expand a team member's full bio with Enter or Space. */
export function initTeam() {
  for (const card of document.querySelectorAll('.team .person')) {
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      card.classList.toggle('open');
    });
  }
}
