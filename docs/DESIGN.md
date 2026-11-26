> **Decided at Gate 2 (25 Nov 2026):** potential.org palette only (palette B below, the `?palette` switch is removed), Track A violet #6D28D9 / ink #5B21B6 / soft #F3EEFE, site amber #FBBF24 for CTAs, fonts per the site (Plus Jakarta Sans body and headings (site system stack varies by OS), IBM Plex Sans Arabic for Arabic), AI-generated photoreal images instead of illustrations. Palette A and Inter below are kept only as history. See DEVIATIONS D2, D3.

# Design

Home Ready · by Potential.org (MKP-2026-002). Gate 2 preview with two palettes; switch with `?palette=site` (palette B) or `?palette=plan` (palette A, default). Only `src/styles/tokens.css` holds colour values.

## Source

- Brief C3 (Detailed Mockup Plan v1): palette A, typography, imagery, tone, Sponsored label.
- potential.org live CSS (`docs/sources/brand/site/main.css`, `home.html`): palette B (dark ink header #10141A / #080A0B, emerald #059669, violet #A78BFA, pink #F472B6 accents).
- Logo: official white logo, `docs/sources/brand/potential-org-white.svg` (C3 link potential.org/brand/potential-org-white.2026-10-27.svg), copied unchanged to `public/brand/potential-org-white.svg`.
- Gate 1 answer 9: primary and secondary from the live site, the rest from C3. Both options are shown so Aliya can choose.

## Palette A "plan" (default)

| Token | Value | Contrast | Where it is used |
|---|---|---|---|
| `--brand-deep` | #2E1A47 deep purple | 15.50:1 white | Header band, footer, sidebar (gradient end), hero background, headings on light (`text-brand-deep`), "Calculator results" stat card |
| `--brand-deep-900` | #1E1030 | | Hero gradient start, sidebar bottom |
| `--brand-primary` | #7B4FD6 violet | 5.34:1 white / on white | Links, eyebrows, active states, sidebar gradient top, next-action card, "Renting progress" stat card, inline icons |
| `--brand-grad-start` | #7B4FD6 | | Start of `bg-grad-brand` (white text sits on it) |
| `--brand-accent` | #B79CF2 lavender | 7.30:1 ink | Hero skyline, auth eyebrow on dark, "Points" stat card (ink text) |
| `--brand-highlight` | #F2A541 amber | 8.25:1 ink; 7.55:1 on deep | Primary CTAs (Join free, Sign in), headline second line on dark, the key in the hero, "Checklists" stat card |
| `--brand-warm` | #8A5A00 | 5.93:1 white | Secondary accent, avatar tone |
| Track A | #1F8A70 (text #166B57, soft #E6F4EF) | 4.26:1 white (large only); 6.41:1 text | Track A card band (gradient from the text shade), unit tags, Preview button |
| Track B | #2F6FDE (text #2559B8, soft #E9F0FC) | 4.72:1 white; 6.56:1 text | Track B card band, unit tags, Preview button |
| Sponsored | bg #FFF4D6, text #8A5A00 | 5.41:1 | "Sponsored" / "مُموَّل" label, always top-start of the slot |
| Surfaces | page #FAF8F5, cards #FFFFFF, dividers #ECE7F3 | | All screens |
| Text | #1F1B24 body, #6B6475 secondary | 15.97:1 / 5.35:1 on page | All screens |
| Status | success #2E9E6A, warning #E07B26, error #C0392B | | Icons and fills (`--status-*`). For small text, success uses #1F7A55 and warning #9A4A0C (C3 values fail as small text: 3.38:1 and 2.99:1) |
| Tints | #F8F5FD / #EEE7FB / #DDD0F6 | | Section background (Programme content), hero arch, chips |

## Palette B "site" (`?palette=site`)

Overrides only these tokens; track, status, Sponsored, page, card and text colours stay as C3.

| Token | Value | Contrast | Where it is used |
|---|---|---|---|
| `--brand-deep` | #10141A ink (900: #080A0B) | 18.47:1 white | Header band, footer, sidebar end, hero, headings |
| `--brand-primary` | #047857 emerald 700 | 5.48:1 white / on white | Links, active states, buttons, sidebar top, next-action card. The site's #059669 is 3.77:1 (too light for small text), so the darker shade is used |
| `--brand-grad-start` | #065F46 | | Gradient start |
| `--brand-accent` | #A78BFA violet | 6.22:1 ink | Hero skyline, "Points" stat card |
| `--brand-pop` | #F472B6 pink | | Hero illustration only (shirt) |
| `--brand-highlight` | #F2A541 amber (kept from C3) | 9.00:1 on ink | Primary CTAs |
| Tints | #F3FBF7 / #E3F6ED / #C6ECD9, border #E4E7EA | | Section background, hero arch |

Known clash in B: track A green #1F8A70 sits next to emerald #047857 (sidebar, next-action card and Track A card all read green). Proposed fix for B only: track A violet (#6D28D9, text #5B21B6, soft #F3EEFE); track B stays blue. Not applied; for the Gate 2 decision.

## Typography

- Inter 400 and 700 (`@fontsource/inter`), headings 700, body 400.
- IBM Plex Sans Arabic 400 and 600 (`@fontsource/ibm-plex-sans-arabic`) for Arabic; `html[lang="ar"]` puts it first.
- Self-hosted through `src/styles/app.css`; no Google Fonts links. Noto removed from the font setup.

## Logo and motif

- Only a white Potential.org logo exists, so the logo image appears only on dark surfaces: header band, menu sheet, sidebar, auth brand panel and footer. It is never squeezed (height-driven, width auto; rendered at 135% of the row height to offset the file's built-in clear space).
- Lockup: logo, a thin divider, then "Home Ready" (جاهز للسكن in Arabic) in Inter Bold. The sidebar and menu sheet use a stacked version (logo above the wordmark) to fit. Header link label: "Home Ready · by Potential.org".
- On light surfaces (mobile top bar) the lockup is text: "Home Ready" + "by Potential.org", no image.
- Motif: potential.org has no motif, so an original line-art motif was drawn (redrawn/original, from the plan imagery): `HomeMark` (two apartment towers, a villa with an arched door, a townhouse roof line, a key) and `KeyMark` (the key alone), in `src/components/brand/HomeMark.tsx`, used through `Motif`:
  - `sidebar`: HomeMark at the bottom of the sidebar
  - `auth`: large HomeMark on the sign-in brand panel
  - `banner`: section corner (Programme content)
  - `card`: track card bands, next-action card
  - `corner`: KeyMark on stat cards and the reminder card
  - Hero: HomeMark bottom-start on desktop
- No blobs, glows or rings.

## Imagery

Flat, warm illustration (C3). The hero illustration is an original inline SVG (`src/features/public/components/HeroIllustration.tsx`): a woman in a headscarf and a man at their new villa door holding up the key, moving boxes, a plant and a generic skyline (no real buildings) inside a warm arch. It is coloured from the tokens, so it follows the active palette. Further illustrations come with the build.

## Tone and motion

- Public landing, auth and learner screens are energetic: dark header band, bold type, colour-banded track cards, coloured stat cards. Staff screens will be calm and data-first.
- Landing (heavy motion): Lenis smooth scroll; hero headline word-by-word rise (SplitWords), staggered copy and art entrance (Motion), GSAP ScrollTrigger drift of copy and art at different speeds; Programme content reveals the cards one by one, then each unit row (GSAP timeline, once).
- Portal (light motion): Stagger reveals, `card-hover` lifts, MotionPage transitions.
- Reduced motion is respected through the presenter toggle (`useReducedMotion`).
- Copy is plain, warm and practical, in the second person, with no hype (C3).

## Decisions

- Two palettes are built so Aliya can choose at Gate 2 (Gate 1 answer 9 vs C3).
- Status and track text colours are darker than the C3 values where those fail WCAG AA as small text; the C3 values are kept for fills and icons.
- The palette B primary is emerald 700 (#047857), not the site's #059669, for text contrast.
- Gate 2 preview maps the six C16 personas onto the starter's three roles (learner; reviewer = trainer; programme owner, leadership and sponsor = admin). Proper roles come with the build plan.
