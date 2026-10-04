const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SUBSCRIBE_ENDPOINT = '/api/subscribe';

const MESSAGES = {
  invalidEmail: 'Enter a full email address, like name@institution.org.',
  network: 'We could not reach the server. Check your connection and try again.',
  failed: 'We could not complete your subscription. Please try again in a moment.',
};

/**
 * Footer "AXION briefing" sign-up. Posts the address to /api/subscribe, which
 * emails a new-subscriber notification to the foundation's inbox. The success
 * message is only shown once the server confirms the email was sent.
 */
export function initNewsletter() {
  const form = document.getElementById('nl');
  const input = document.getElementById('nlEmail');
  const honeypot = document.getElementById('nlWebsite');
  const message = document.getElementById('nlMsg');
  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.querySelector('span');
  const idleLabel = buttonLabel.textContent;

  const showMessage = (text, isError) => {
    message.classList.toggle('err', isError);
    message.textContent = text;
  };

  const setPending = (pending) => {
    button.disabled = pending;
    form.setAttribute('aria-busy', String(pending));
    buttonLabel.textContent = pending ? 'Subscribing…' : idleLabel;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return;

    const email = input.value.trim();
    if (!EMAIL_PATTERN.test(email)) {
      showMessage(MESSAGES.invalidEmail, true);
      input.focus();
      return;
    }

    setPending(true);
    showMessage('', false);
    try {
      const error = await subscribe(email, honeypot.value);
      if (error) {
        showMessage(error, true);
        return;
      }
      showMessage(`Subscribed. The next AXION briefing will reach ${email}.`, false);
      form.reset();
    } finally {
      setPending(false);
    }
  });
}

/** Resolves to `null` on success, or to the message to show the visitor. */
async function subscribe(email, website) {
  let response;
  try {
    response = await fetch(SUBSCRIBE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, website }),
    });
  } catch {
    return MESSAGES.network;
  }

  if (response.ok) return null;
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json() : null;
  return body?.error ?? MESSAGES.failed;
}
