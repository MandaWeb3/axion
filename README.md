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
    newsletter.js          Footer briefing form (see below)
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

## Deployment

`npm run build` outputs a fully static site in `dist/`. Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3 with CloudFront). Serve it from the domain root, and give `/assets/*` a long-lived `Cache-Control: public, max-age=31536000, immutable` header, since those filenames are content-hashed.

## Newsletter sign-up

The footer "Get the AXION briefing" form validates the email address and shows a confirmation message, but **it does not send the address anywhere yet**. No mailing-list service is connected. Before launch, connect `src/modules/newsletter.js` to a real provider (for example a serverless function that calls Resend, Mailchimp or Buttondown, with the API key kept server-side), or remove the form.
