# AXION Technology Foundation website

Single-page marketing site for the [AXION Technology Foundation](https://axiontechnology.foundation/): sovereign-grade blockchain, trusted AI and the ANDRA method, from Hyperchain and Agile Dynamics.

Built with [Vite](https://vite.dev/) and plain ES modules, with no UI framework. Motion uses [GSAP](https://gsap.com/) (ScrollTrigger), and Roboto / Roboto Condensed are self-hosted through [Fontsource](https://fontsource.org/).

## Getting started

Requires Node.js `^20.19.0 || >=22.12.0`.

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint
```

## Project structure

```
index.html                 Page markup, SEO meta and JSON-LD
api/
  subscribe.js             Vercel Function: emails new-subscriber notifications (see below)
public/                    Copied to the site root as-is
  favicon.png, apple-touch-icon.png
  logo.png                 Organization logo referenced by JSON-LD
  og-image.jpg             1200×630 social preview (Open Graph / Twitter)
  robots.txt, sitemap.xml
src/
  main.js                  Entry: registers GSAP plugins and initialises each module
  modules/                 One module per behaviour
    preferences.js         Reduced-motion, fine-pointer and data-saver checks
    when-visible.js        IntersectionObserver helper ("run once when on screen")
    nav.js                 Sticky nav, mobile menu, current-section highlight
    hero.js                Headline intro, background video, scroll parallax
    reveal.js              Scroll-in reveals for .rv elements
    operating-states.js    ANDRA four-state rail
    authority-ladder.js    R1–R5 agent authority tabs
    stack-layers.js        L1–L3 isometric architecture stack
    counters.js            Digital Future Fund count-up figures
    network-canvas.js      Animated node network behind the fund section
    case-track.js          Business-case carousel controls
    partner-media.js       Partner globe video (plays once, holds on end frame)
    pointer-effects.js     Cursor glow and magnetic buttons
    team.js                Keyboard expansion of team bios
    newsletter.js          Footer briefing form; posts to /api/subscribe
  styles/
    main.css               Imports fonts, base styles and every section stylesheet
    base.css               Design tokens (light + dark), reset, typography
    buttons.css, nav.css
    sections/*.css         One stylesheet per page section
  assets/
    images/                Section imagery, team portraits, partner photos
    video/                 Hero and partner background videos
```

Vite fingerprints everything under `src/assets/` at build time, so those files can be cached indefinitely. The `public/` files keep stable names because the social and SEO meta tags reference them by absolute URL on `https://axiontechnology.foundation/`.

## Motion and accessibility

- `prefers-reduced-motion: reduce` turns off the intro, parallax, counters, background videos and the canvas animation. All content still renders in its final state.
- Background videos are skipped when the browser reports data-saver mode.
- Hover-only details (pillar "why it matters", case capabilities, partner descriptions, full bios) are shown inline on touch screens.
- The scroll reveals and the hero intro only hide content once an inline head script has flagged JavaScript as available, so the page stays readable without scripts.

## Deployment (Vercel)

Import the repository in Vercel with the **Vite** framework preset (build command `npm run build`, output directory `dist`). Vercel deploys `api/subscribe.js` as a serverless function automatically. Then set the newsletter environment variables below and redeploy.

`npm run build` alone produces the static site in `dist/`; the sign-up form needs the `/api/subscribe` function, so other hosts must provide an equivalent endpoint. Give `/assets/*` a long-lived `Cache-Control: public, max-age=31536000, immutable` header, since those filenames are content-hashed.

## Newsletter sign-up

When a visitor subscribes in the footer, `api/subscribe.js` emails **Info@agiledynamics.co** (subject "New user has subscribed to the AXION briefing") with the subscriber's address, time, approximate location (from Vercel's geolocation headers), the page and browser. Reply-To is set to the subscriber. The email is sent over SMTP through your own mailbox; no third-party email service is involved. The visitor only sees "Subscribed" after the email has been accepted by the mail server, and a hidden honeypot field drops bot submissions.

### Environment variables (Vercel → Project → Settings → Environment Variables)

| Name | Value for the Info@agiledynamics.co mailbox (Microsoft 365) |
|---|---|
| `SMTP_HOST` | `smtp.office365.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `Info@agiledynamics.co` |
| `SMTP_PASS` | The mailbox password, or an app password if the account uses MFA |

Until these are set, the form tells visitors that sign-ups are temporarily unavailable, and the function logs which variables are missing.

### Microsoft 365 requirements

- **SMTP AUTH must be enabled for the mailbox.** In the Microsoft 365 admin center: Users → Active users → Info@agiledynamics.co → Mail → Manage email apps → tick **Authenticated SMTP**. If the tenant uses Entra ID *security defaults*, those block password-based SMTP and must be adjusted.
- **Microsoft is retiring password-based SMTP AUTH.** It is scheduled to be disabled by default for existing tenants at the end of December 2026 (an admin can turn it back on); a final removal date is due in 2027. When that happens, point the four variables at any other mailbox that supports SMTP; no code changes are needed.

### Testing locally

`npm run dev` serves only the static site, so the form shows an error there. Run `vercel dev` (Vercel CLI) with the variables in `.env.local` to exercise the function locally.
