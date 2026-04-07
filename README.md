# Aurora Studio — Web Template

A boutique agency website template built with warm editorial aesthetics, confident motion, and a multi-step client intake flow. Zero dependencies beyond Vite.

---

## Preview

| Home | Start a Project |
|---|---|
| Hero with parallax scene, tilt cards, animated stats | 4-step intake form with animated transitions |

**Live locally:** `http://localhost:5173`

---

## Features

- **Warm editorial design** — cream/beige palette (`#f6efe6`), orange accent (`#ef6c4d`), Syne + Manrope type pairing
- **Animated hero scene** — layered halo blobs with pointer parallax, two floating tilt-cards, orbit rings
- **Scroll reveal system** — `data-animate` attribute drives `IntersectionObserver` reveals across every section
- **Magnetic buttons** — subtle pointer-follow effect on all CTAs using `data-strength`
- **3D tilt cards** — `perspective()` + `rotateX/Y` on hover for tactile depth
- **Animated counters** — cubic-ease count-up triggered when stats scroll into view
- **Logo marquee** — infinite CSS scroll strip with orange dot separators
- **Multi-step intake form** — 4-step state machine with progress bar, per-step validation, enter/exit slide animations, and a success panel
- **Smooth page transitions** — shared beige overlay fades out on load and fades in on any same-origin navigation
- **Cursor glow** — ambient radial gradient that follows the pointer, CSS-variable driven
- **Grain texture** — subtle SVG noise layer over the entire surface

---

## Pages

| File | Route | Description |
|---|---|---|
| `index.html` | `/` | Main marketing page — hero, services, work, process, stats, CTA |
| `start.html` | `/start.html` | Client intake form — project type, details, budget/timeline, contact |

---

## File Structure

```
aurora-site/
├── index.html        # Landing page
├── start.html        # Project intake form
├── style.css         # Shared design system — tokens, layout, all components
├── start.css         # Start-page-specific styles (form, steps, type cards)
├── main.js           # Index page animations (scroll reveal, tilt, parallax, counters)
├── start.js          # Form state machine (steps, validation, progress bar)
├── transitions.js    # Shared page-transition overlay (fade in/out on navigate)
├── package.json      # Vite config
└── vite.config.js    # (optional — Vite works zero-config for this project)
```

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies (only Vite)
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
# Production build → dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## Design Tokens

All design decisions live in the `:root` block at the top of `style.css`:

```css
--bg: #f6efe6          /* warm cream background          */
--accent: #ef6c4d      /* orange — primary CTA, gradients */
--accent-warm: #f2b35b /* gold — gradient midpoint        */
--accent-cool: #3a8fb7 /* slate blue — gradient endpoint  */
--text: #1a1715        /* near-black body text            */
--text-muted: #6c6056  /* warm brown secondary text       */
```

To retheme, change those six values. Everything else — gradients, glows, borders, shadows — inherits from them.

---

## Motion System

### Scroll Reveals
Add `data-animate` to any element. Supported values: `up`, `fade`, `zoom`.

```html
<section data-animate="up">...</section>
<div data-animate="fade" data-delay="150">...</div>
```

The `data-delay` attribute (in ms) staggers sibling elements.

### Magnetic Buttons
Add class `magnetic` and a `data-strength` attribute (lower = stronger pull):

```html
<a class="btn btn-primary magnetic" data-strength="20" href="...">CTA</a>
```

### Tilt Cards
Add class `tilt-card` to any surface for 3D hover depth:

```html
<article class="tilt-card">...</article>
```

### Page Transitions
Automatic. Any same-origin `<a href>` triggers the fade overlay before navigation. Hash links and `mailto:` are excluded.

---

## Form Steps

`start.html` walks clients through four steps:

| Step | Slug | Fields |
|---|---|---|
| 01 | Project Type | Radio type-cards: Landing Page, Campaign Site, Brand + Web, Something Else |
| 02 | Project Details | Textarea with live character count |
| 03 | Scope | Timeline select + Budget range select |
| 04 | Contact | Name, Email, Company (optional) |

On submit, the form hides and a success panel fades in. No backend required — wire the `#projectForm submit` event in `start.js` to any endpoint (Formspree, Netlify Forms, etc.).

---

## Customisation Notes

| What to change | Where |
|---|---|
| Studio name | `index.html` → `.brand`, `<title>`, `<meta name="description">` |
| Accent color | `style.css` → `--accent` |
| Fonts | `<link>` in both HTML `<head>` tags + `font-family` in `style.css` |
| Nav links | `<nav class="navbar">` in `index.html` |
| Stats counters | `data-count` attributes in the `.stats-band` section |
| Marquee clients | `.marquee-track span` text in `index.html` |
| Form fields | `start.html` step sections + validation in `start.js` |

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). The `:has()` selector used for type-card checked state requires Safari 15.4+ / Chrome 105+. Graceful fallback: cards still function, just without the selected ring style.

`prefers-reduced-motion` is respected — all animations and transitions are disabled when the system preference is set.

---

## License

MIT — use it, fork it, ship it.
