# Build plan: MKP-2026-002 Home Ready

Delivery 22:08 Dubai (Wed 25 Nov 2026). Source of truth: `docs/brief/BRIEF.txt` (C1 to C17), Vera's answers and fee corrections and Aliya's Gate 1 answers in `docs/ASSUMPTIONS.md`.

## Timeline (Dubai)

| Time | Step |
|---|---|
| until ~16:55 | Gate 2 preview (palette options) + this plan → Aliya (Gates 2 + 3) |
| 17:00–17:45 | Foundation (one agent), then frozen |
| 17:45–20:00 | Five feature agents in parallel |
| 20:00–20:45 | Verify: checks, sweep 1440/375, RTL, walkthrough of the click-path, fix round |
| 20:15–21:15 | Executive video (voice-over + captions) from screen captures of the finished screens |
| 21:15–21:30 | Aliya review round |
| 21:30–21:50 | Gate 4 publish + delivery email draft for Aliya's OK |
| by 22:08 | Delivery email sent (after Aliya's OK) |

If any step slips past 21:30, Vera gets a "new expected time" reply-all (send checks apply) and Aliya an alert.

## 1. Foundation (one agent, then frozen)

- **Roles** (`shared/types.ts`, `mockup.config.ts`): `learner`, `owner`, `reviewer`, `leadership`, `sponsor` (replace `trainer`, `admin`). Six personas from C16 with usernames; sign-in by username or email, password `password`.
- **Routes** follow C4: `/`, `/register`, `/login`, `/forgot-password`, `/onboarding/1..4`, `/learn/*`, `/admin/*`, `/review/*`, `/leadership/*`, `/sponsor/*`, static pages.
- **Seed data** (`src/data`): tracks and units (C9, Track A in full, Track B shorter, written by us and marked draft), quizzes (pre 5 + post 10 per track), journeys (C11.1), calculator defaults with source + "checked on" (C11.2 + fee register), checklists (C11.6, full items), offers, events, badges and points (C11.5), Dalil scripted answers (C10, EN + AR), source register (C8.3), review items, sponsors and placements, email templates (C14), KPI aggregates (C13/C15), 12 learners for tables. **Fee register** is one file; every screen reads from it (Ejari AED 177.75, DEWA deposit AED 2,000/4,000 refundable, JVC AED 93,377.75 vs renew AED 99,750).
- **Rules** (`src/domain`, unit tested): calculator maths for 3 tabs (break-even computed: year 3 at defaults), journey scoring, points and badges, track progress and certificate rule (5/5 + 70%), KPI maths so landing counters, Maya's Overview and Leadership match.
- **Store actions**: journeys (answer, save next action, save checklist), calculator save/compare, checklist tick/note, shortlist add, reminders CRUD, partner consent give/withdraw, event register, review approve/request changes, publish, placement add/pause, nudge, announcement, audit log, notifications.
- **i18n namespaces**: `public`, `auth`, `learn`, `journeys`, `calculator`, `dalil`, `owner`, `review`, `leadership`, `sponsor`. Arabic for public, auth and learner namespaces; staff namespaces English (Arabic keys mirror English to satisfy parity, marked "Arabic draft for review" in Content).
- **DemoGuide** steps = C16 click-path (11 steps).

## 2. Feature areas (parallel agents, one owner each)

| Agent | Area | Screens | Done when |
|---|---|---|---|
| F1 | Public + auth | Landing 14 sections (C5), register (C6.1 validation, marketing unticked, 18+), login with persona cards, forgot password, invite/set password, onboarding 1–4 (incl. pre-quiz), static pages | All C5 copy EN + AR, counters animate, register creates learner and lands in onboarding |
| F2 | Learner core | Home (active + new-user empty state), Tracks + course view (D2 layout) + unit pages + quizzes + certificate, Achievements, Profile & privacy (consents, withdraw, download data) | Aisha and Rohan states as C8.1; certificate issues at 5/5 + 70% |
| F3 | Learner tools | Decision journeys (2 players + results), Calculator (3 tabs, line chart + year table), My checklists, My homes, Reminders, Events, Offers + consent dialog, Ask Dalil (page + floating button) | Click-path steps 5–8 run; figures match the fee register |
| F4 | Programme owner + reviewer | Maya: Overview, Learners (+ drawer, "no useful action" filter, Send nudge), Content (EN/AR, source, check date, status), Approvals, Sponsors & placements, Communications, Reports, Settings + audit log. Khalid: queue, side-by-side item, sources | Khalid approves → Maya publishes → status changes; placement pause hides it for learners and sponsor |
| F5 | Leadership + sponsor | Hessa: Impact (K1–K4 tiles, charts, impact story, filters), Funnel, Reports. Oasis: placements, performance (aggregates only), guidelines | C13 values exact; no personal data in sponsor views |

Each agent owns `src/features/<area>/**`, `src/routes/<role>/**`, `src/i18n/*/<ns>.json`. Shared pieces stay frozen.

## 3. Modules not in the starter

- Events: adapt `potential-template/templates/events/` layout (list cards + register).
- Dalil chat: adapt the starter shell + `assessment-and-ai` reference layout; scripted answers, no network.
- Journeys, calculator, checklists, shortlist, offers/consent: custom (no template), on design system v2.

## 4. Images (AI-generated photoreal, `image-gen` skill; Aliya at Gate 2, deviation D3)

Hero (couple at their new apartment door holding keys, generic Dubai-style skyline, replaces the SVG illustration), "Who it is for" x4 (mover with boxes, tenant reading a renewal letter, renter looking at a villa, family with keys), track covers x2 (towers / townhouses), journey covers x2, auth panel, Dalil avatar (house-shaped icon with key, brand colours; icon, not a photo), 8 badge medals (BadgeMedal), certificate frame. Fictional people; no real buildings, brands or real people. Logged in `docs/ASSET-INVENTORY.md`.

## 5. Golden path (walkthroughs test it)

C16 click-path, with Vera's updates: step 5 JVC AED 93,377.75 vs AED 99,750; step 8 break-even year 3, horizon 8 → 4 changes totals and chart.

## 6. Executive video

55–65 s, 1080p H.264, file `MKP-2026-002_Potential.org_Executive-Video.mp4`, the 7 C16 moments with outcome captions, closing frame, light music, **voice-over** (Aliya, deviation D1). Built with HyperFrames from Playwright captures of the finished mockup.

## My calls (not told)

- Staff namespaces keep English text in the Arabic files (parity test) rather than machine Arabic.
- Track B readings kept to about 150 words per unit.
- Downloads (XLSX/PDF) generated client-side as CSV or print view; "Report prepared" toast where a file makes no sense.
- 12 named learners in tables; totals stay the C15 aggregates.
