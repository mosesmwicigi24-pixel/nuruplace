# The Good News Mission — Website

Website for [The Good News Mission](https://nuruplace.org), a missionary sending
church on Kangundo Road, Saika Estate, Nairobi.

Built with **Next.js 16.2.10** (App Router), **React 19.2.4** and **TypeScript**.
Styling is **one hand-authored `globals.css`** — no Tailwind, no CSS-in-JS, no
utility vocabulary to learn before you can change a colour. Bilingual:
**English and Kiswahili**.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Responsive + accessibility suite (builds and serves first) |

---

## Editing the site

**Almost all text lives in `src/content/`.** You do not need to touch React
components to change wording, add a sermon, or publish a blog post.

Every piece of content carries both languages side by side:

```ts
name: { en: "Ablaze Worship", sw: "Ibada ya Ablaze" },
```

A missing translation is a TypeScript error rather than a page that silently
falls back to English, so nothing goes stale unnoticed. UI chrome (buttons,
labels) lives in `src/i18n/dictionary.ts`.

| File | Controls |
|---|---|
| `site.ts` | Church name, tagline, phone, email, address, giving links, social links, and the navigation menu |
| `services.ts` | Sunday and midweek service times |
| `ministries.ts` | The seven ministries — each becomes a card and a `/ministries/<slug>` page |
| `events.ts` | Events, split automatically into upcoming and past by date |
| `sermons.ts` | Sermon archive |
| `posts.ts` | Blog articles — each becomes a `/blog/<slug>` page |
| `leadership.ts` | Names, roles and bios on `/our-leadership` |
| `pages.ts` | Long-form pages: About, Our Faith, Statutes, Strategic Plan, the Pastor's and First Lady's messages, Resources |
| `visit.ts` | Plan Your Visit — the questions a first-time guest actually asks |
| `photos.ts` | Photograph slots; see `public/photos/README.md` for the shot list |

### Adding a blog post

Add an entry to the `posts` array in `src/content/posts.ts`:

```ts
{
  slug: "a-url-friendly-name",
  title: "Your Title",
  author: "The Good News Mission",
  date: "2026-08-19",          // ISO — used for sorting
  excerpt: "One or two sentences shown on the blog listing.",
  body: ["First paragraph.", "Second paragraph."],
}
```

The listing page, the article page, and the sitemap all pick it up automatically.

Events, sermons and ministries work the same way.

---

## Project structure

```
src/
├─ app/                    App Router pages — one folder per route
│  ├─ layout.tsx           Root layout: fonts, header, footer, metadata
│  ├─ page.tsx             Home page
│  ├─ globals.css          Tailwind import + brand palette
│  ├─ sitemap.ts           Generated from the content files
│  └─ robots.ts
├─ components/
│  ├─ site-header.tsx      Top bar, logo, desktop nav
│  ├─ mobile-nav.tsx       Mobile menu (the only client component)
│  ├─ site-footer.tsx
│  ├─ ui.tsx               PageHero, SectionHeading, Scripture, Button, …
│  └─ cards.tsx            Ministry / event / sermon / post cards
├─ content/                ← edit the site here
└─ lib/utils.ts            cn(), formatDate(), byDateDesc()
```

### Brand colours

Taken from the current nuruplace.org stylesheet and defined as Tailwind theme
tokens in `src/app/globals.css`:

| Token | Hex | Use |
|---|---|---|
| `brand-600` | `#060eff` | Primary blue — buttons, links |
| `brand-700` | `#2428a6` | Deep blue — scripture band |
| `accent-500` | `#dc2b0f` | Accent red — Give button, giving section |
| `ink-900` | `#0b1020` | Near-black — hero and footer |

Fonts are **Montserrat** (body and headings) and **Merienda** (scripture and
display accents), loaded through `next/font`.

---

## Status

This is a rebuild of nuruplace.org. The current live site runs on a PHP
CodeIgniter CMS whose source is not available, so the structure, wording and
brand colours were reproduced from the live pages.

**Complete:** Home, About, Our Faith, Our Strategic Plan, Message From Our
Pastor, Our Leadership, Ministries (listing + 7 detail pages), Sermons, Events,
Blog (listing + articles), Contact, plus sitemap and robots.

**Still needs real content:**

- `our-statutes` and `message-from-our-first-lady` — placeholder text in `pages.ts`
- `our-leadership` — real names, roles and photographs
- `announcements`, `gallery`, `videos`, `shop` — placeholder pages
- Photography throughout. No images are bundled: the hero and cards use colour
  and type rather than hotlinking assets from the live site. Drop photographs
  into `public/` and reference them from the content files.
- The contact page describes where a form would go but does not ship one — a
  form needs a destination (an email service or a route handler) so submissions
  are not silently lost.

---

## Deploying

The site runs on the church VPS alongside neema-ai and bethanyhouse, using the
same pull-based arrangement those already use — **[deploy/README.md](deploy/README.md)
is the full guide.**

```
push to main → ci.yml (green) → deploy.yml pushes image to GHCR
             → VPS timer pulls every 2 min → host nginx (TLS) → 127.0.0.1:3001
```

CI does not deploy; the box pulls. That is not a preference — the host edge
intermittently drops GitHub-runner IPs on port 22, so Actions→box SSH pushes
are unreliable. neema-ai hit this first and this repo inherits the fix.

Run the production image locally:

```bash
docker compose up --build      # http://localhost:3001
```

The old CodeIgniter site is served by a different nginx block on the same box.
Cutover is enabling this one instead; rollback is the reverse. Nothing about
the old site is deleted.

---

## Languages

Every page lives under a locale segment: `/en/...` and `/sw/...`. A request
without one is redirected by `src/proxy.ts`, which picks the language from a
remembered cookie first, then the browser's `Accept-Language`, then English.

`hreflang` tags and per-URL sitemap alternates tell search engines the two
versions are the same page, so neither outranks the other by accident.

To add a third language: add it to `locales` in `src/i18n/config.ts` and
TypeScript will list every string that still needs translating.

> **The Kiswahili has not been reviewed by a first-language speaker.** It was
> written for the rebuild and reads correctly, but have someone in the church
> read it before launch — especially **Our Faith**, where doctrinal precision
> matters more than fluency.

---

## The contact form

`/plan-your-visit` and `/contact-us` share one connection card. It has a
honeypot field for spam, validates server-side, and **refuses to submit unless
a destination is configured** — a church form that silently drops a message is
worse than no form, because someone reaches out at a hard moment and hears
nothing back.

Copy `.env.example` to `.env.local` and set **one** of:

```bash
# Option A — POST the submission to an endpoint you own
CONTACT_WEBHOOK_URL=https://example.org/hooks/website-contact

# Option B — hand off to an email provider that accepts a simple POST
CONTACT_EMAIL_TO=pastor@thegoodnewsmission.org
CONTACT_EMAIL_API=https://api.resend.com/emails
CONTACT_EMAIL_KEY=re_xxxxxxxxxxxx
```

Until then the form tells visitors to call or WhatsApp instead, and logs an
error server-side. That is deliberate: it fails where you can see it.

---

## Performance

Measured on a cold mobile load (390px, compressed over the wire):

| Page | Transferred |
|---|---|
| Home | ~286 KB |
| Plan Your Visit | ~271 KB |

About 86 KB of that is the two font families. Kenyan mobile data runs several
times European prices, so that is a real trade — dropping Merienda (used only
for scripture pull-quotes and eyebrow text) would save roughly 35 KB. It is a
brand decision, not a bug, so it has been left alone.

`axe-core` reports **zero accessibility violations** across both languages.
Keep it that way: run the audit before shipping visual changes.

---

## Before this goes live

- [ ] Have a first-language Kiswahili speaker review the translations
- [ ] Confirm the Plan Your Visit specifics — parking, crèche ages, how long the service really runs
- [ ] Add the three photographs in `public/photos/README.md`
- [ ] Configure a contact destination (above), then send a real test message
- [ ] Fill in leadership names, roles and portraits
- [ ] Supply Our Statutes and the First Lady's message
- [ ] Register with the ODPC and complete a data protection impact assessment before collecting anything — the form takes names, phone numbers and prayer requests, and Kenya's Data Protection Act treats religious belief as sensitive personal data

---

## Responsiveness, checked by machine

Resizing a browser by hand catches the obvious breakages and misses the rest.
`npm test` runs the real production build across **eleven viewports from 320px
to 2560px**, in both languages, and fails on three things that actually reach
users:

- **Horizontal scroll.** Any page wider than its viewport fails, and the error
  names the offending elements with their positions — so the fix is obvious
  rather than a hunt.
- **Tap targets under 24×24 px** (WCAG 2.5.8), on phone and tablet widths.
  Inline links inside body text are exempt, as the spec allows.
- **Accessibility violations** (axe-core, WCAG 2.1 A + AA) at a narrow and a
  wide viewport, because reflow and focus-order bugs only appear at one.

```bash
npm test                 # everything
npm run test:responsive  # layout only
npm run test:a11y        # accessibility only
```

The suite builds and serves the production output itself — no dev server, so
what it measures is what visitors get. GitHub Actions runs it on every push and
pull request.

320px is deliberately the floor. Low-end Androids are common in Nairobi, and
they belong to exactly the people this church most wants to reach.

### How the layout scales

Two containers, doing two different jobs:

| Class | Used for | Behaviour |
|---|---|---|
| `.shell` | Card grids, header, footer | Grows with the screen: 1280 → 1472 → 1696 → 1920px |
| `.measure` | Running prose | Stays at ~72 characters, on purpose |

Headings use `clamp()` rather than breakpoint jumps, so there is no width at
which they look wrong. Card grids go to four columns at 1536px and above.

Wide screens were a real gap: the previous site put everything in a fixed
centre column, so a 1920px display showed a 1280px website between two grey
margins. Prose still stays narrow — that is readability, not neglect.

---

## Styling

One file: `src/app/globals.css`. No framework.

It is ordered so you can find things: **tokens → reset → layout primitives →
typography → components**. Everything is plain CSS with custom properties, so
changing the brand blue means editing `--brand-600` once, and adding a page
means reusing `.shell`, `.section` and `.card` rather than remembering twelve
utility classes.

Two rules the stylesheet must not break, because `npm test` enforces them:

- interactive targets are at least **24×24px** (`--tap`)
- text on the accent red is **pure white** — 4.78:1, and softening it to
  `rgba(255,255,255,0.9)` drops it to 4.11:1 and fails AA

Class naming is semantic rather than utility: `.card`, `.nav-link`,
`.list-divided`. A handful of single-purpose helpers (`.center`, `.muted`,
`.sr-only`) exist where a class name for the concept would be worse than the
property itself.

### Why not Tailwind

Nothing was wrong with it. But this site is a brochure with one interactive
component, it will be maintained by whoever is around rather than by a
front-end team, and plain CSS is the thing most likely to still be readable to
that person in three years. It also removes three dependencies from the build.
