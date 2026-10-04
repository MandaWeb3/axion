const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Footer "AXION briefing" sign-up.
 *
 * Validation and the confirmation message are client-side only: the address is
 * not sent to a mailing-list service yet. This is intentional for now; see
 * "Newsletter sign-up" in the README before relying on it.
 */
export function initNewsletter() {
  const form = document.getElementById('nl');
  const input = document.getElementById('nlEmail');
  const message = document.getElementById('nlMsg');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = input.value.trim();
    const valid = EMAIL_PATTERN.test(email);

    message.classList.toggle('err', !valid);
    if (!valid) {
      message.textContent = 'Enter a full email address, like name@institution.org.';
      input.focus();
      return;
    }

    message.textContent = `Subscribed. The next AXION briefing will reach ${email}.`;
    form.reset();
  });
}
