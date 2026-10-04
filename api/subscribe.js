import nodemailer from 'nodemailer';

/** Inbox that receives a notification for every new briefing subscriber. */
const NOTIFY_TO = 'Info@agiledynamics.co';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_EMAIL_LENGTH = 254;
const REQUIRED_ENV = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
/** Keep well inside the function time limit if the mail server is slow or unreachable. */
const SMTP_TIMEOUTS = { connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000 };

const MESSAGES = {
  badRequest: 'We could not read that request. Please try again.',
  invalidEmail: 'Enter a full email address, like name@institution.org.',
  unavailable: 'Sign-ups are temporarily unavailable. Please try again later.',
  sendFailed: 'We could not complete your subscription. Please try again in a moment.',
};

/**
 * POST /api/subscribe (Vercel Function)
 *
 * Body: JSON `{ email, website }`. `website` is a honeypot field that is hidden
 * from people, so any value in it marks the request as a bot.
 *
 * Sends a "new subscriber" email to NOTIFY_TO through the mailbox configured by
 * SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS, with Reply-To set to the subscriber.
 */
export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: MESSAGES.badRequest });
  }

  // Acknowledge bots without sending anything, so the trap is not revealed.
  if (typeof payload?.website === 'string' && payload.website.trim() !== '') {
    return json(200, { ok: true });
  }

  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return json(400, { error: MESSAGES.invalidEmail });
  }

  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.error(`subscribe: SMTP is not configured (missing ${missing.join(', ')})`);
    return json(503, { error: MESSAGES.unavailable });
  }

  try {
    await sendNotification(email, request.headers);
  } catch (error) {
    console.error('subscribe: failed to send the notification email', error);
    return json(502, { error: MESSAGES.sendFailed });
  }

  return json(200, { ok: true });
}

function sendNotification(email, headers) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const port = Number(SMTP_PORT);
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    // Port 465 uses implicit TLS; any other port must upgrade with STARTTLS
    // before credentials are sent.
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    ...SMTP_TIMEOUTS,
  });

  return transport.sendMail({
    // Mail servers such as Microsoft 365 only accept a From matching the signed-in mailbox.
    from: { name: 'AXION website', address: SMTP_USER },
    to: NOTIFY_TO,
    replyTo: email,
    subject: 'New user has subscribed to the AXION briefing',
    text: notificationBody(email, headers),
  });
}

function notificationBody(email, headers) {
  const city = decodeGeoHeader(headers.get('x-vercel-ip-city'));
  const country = headers.get('x-vercel-ip-country');
  const location = [city, country].filter(Boolean).join(', ') || 'Unknown';

  return [
    'A new user has subscribed to the AXION briefing.',
    '',
    `Email:      ${email}`,
    `Subscribed: ${new Date().toUTCString()}`,
    `Location:   ${location}`,
    `Page:       ${headers.get('referer') ?? 'Unknown'}`,
    `Browser:    ${headers.get('user-agent') ?? 'Unknown'}`,
    '',
    'Reply to this email to contact the subscriber directly.',
  ].join('\n');
}

/** Vercel URL-encodes geolocation headers (e.g. "San%20Francisco"); show the raw value if it is malformed. */
function decodeGeoHeader(value) {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function json(status, body) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}
