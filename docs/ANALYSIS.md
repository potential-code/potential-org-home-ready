# Analysis: MKP-2026-002 Potential.org Home Ready

Source of truth: `docs/brief/BRIEF.txt` (Detailed Mockup Plan v1, sections C1 to C17) and `docs/brief/EMAIL.md`.

## 1. In one paragraph

Home Ready is a free, self-paced Potential.org programme that helps people in the UAE (Dubai first) decide whether to rent, renew, move or buy a home. Learners follow two tracks (Renting, Buying) of five short video units each, play scored "decision journeys", use one calculator with three tabs, save checklists and set reminders, and ask an AI guide called Dalil where to verify a rule. Fictional sponsors fund it through clearly labelled slots that never block the journey or take data without a separate opt-in. The demo must prove three things (C1 "Must show"): the Rent journey end to end, the Buy calculator recalculating, and EN/AR switching with a labelled sponsor slot; plus that staff can review and approve sourced, dated, bilingual content and leadership can see K1 to K4.

## 2. Roles and portals

| Role | Demo person | Portal | Can do |
|---|---|---|---|
| Learner (renter) | Aisha Rahman, `aisha.renter` | `/learn/*` | Tracks, journeys, calculator, checklists, shortlist, reminders, events, offers, Dalil, achievements, profile and consents |
| Learner (buyer) | Rohan Mehta, `rohan.buyer` | `/learn/*` | Same portal, Track B state (rent-vs-buy, due diligence) |
| Programme owner | Maya, `maya.owner` | `/admin/*` | Overview, learners, content (EN/AR, sources, check dates), approvals, sponsors and placements, communications, reports, settings and audit log |
| Qualified reviewer | Khalid Al Mansoori, `khalid.reviewer` | `/review/*` | Review queue, side-by-side EN/AR item review, approve or request changes, source register |
| Leadership | Hessa Al Suwaidi, `hessa.leadership` | `/leadership/*` | Read-only Impact (K1 to K4), Funnel, Reports |
| Sample sponsor | Oasis Home Finance, `oasis.sponsor` | `/sponsor/*` | Own placements, aggregate performance only, guidelines |

Public: landing `/`, `/register`, `/login`, `/forgot-password`, onboarding 1 to 4, static pages (`/faq`, `/terms`, `/privacy`, `/contact`, `/editorial-policy`). Staff and sponsor accounts are invited only (C6.2).

## 3. User journeys

**Aisha (renter, golden path)**
1. Landing: hero, two tracks, Dalil card, labelled partner tile; switch to Arabic and back.
2. Join free: form with marketing unticked, 18+ check; then sign in as Aisha.
3. Home: "Your tenancy in Al Barsha renews in 84 days".
4. Track A, unit A4: video placeholder, reading with source and check date.
5. Renew-or-move journey: 5 screens, Rental Index step (5%, AED 99,750), true-cost comparison with JVC (AED 93,377.75), result 78/100, save checklist, set renewal reminder.
6. Ask Dalil "Can my landlord raise my rent at renewal?".
7. Offers: open a sponsored offer, open the separate consent dialog, do not tick.

**Rohan (buyer)**
1. Calculator, Rent vs buy tab: change horizon 8 to 4 years, recalculate, chart and break-even change, save result.
2. Open the due-diligence step and the DLD Title Deed Verification link.
3. (Home shows Buying 2 of 5, journey 71/100, checklist 3 of 12, pre-approval reminder.)

**New learner (registration)**
1. `/register` (fields in C6.1) then onboarding: situation, pick track, 5-question pre-quiz, meet Dalil with a suggested first action.
2. Lands on an empty-state Home with "Start your first step".

**Maya (programme owner)**
1. Overview KPI tiles and content status.
2. Content: items with EN/AR versions, source, check date, status.
3. Approvals: publish the item Khalid approved.
4. Sponsors and placements: inventory, "Sample, not contracted", label preview.
5. Reports: scorecard. Also Learners table with the "no useful action" filter and "Send nudge".

**Khalid (reviewer)**: queue of 4 items, open "Unit A4 The contract", compare EN | AR, check claims and dates, approve. Item appears in Maya's Approvals.

**Hessa (leadership)**: Impact view K1 to K4, funnel, impact story, charts, report downloads.

**Oasis (sponsor)**: placements with label preview; performance aggregates only (no names); guidelines.

## 4. How portals connect

- Khalid approves or returns an item, it moves in Maya's Approvals; Maya publishes it, status changes in Content, audit log entry, and the learner sees the updated unit.
- Maya adds or pauses a sponsor placement, it appears or disappears on learner screens and in Oasis's placements.
- Learner saves a checklist, calculator result or journey result, Home, Achievements (points, badges), Maya's learner profile drawer and the KPI counters update (+1 on the demo totals).
- Learner sets a reminder, it shows in Reminders, in-platform notification, and the reminder opt-in counts.
- Learner confirms a partner request (ticked consent), Profile consents list, Oasis's "consented partner requests" count (+1, count only), Maya's Sponsors view.
- Learner registers for an event, event status changes and Maya sees the registration count.
- Finishing a track and the quiz issues a certificate (Potential.courses with Potential.org).

## 5. Screens list

| Role | Screen | Plan section |
|---|---|---|
| Public | Landing (14 sections) | C5 |
| Public | Register; Login (learner + invited); Forgot password; Accept invite / set password | C4, C6 |
| Public | Onboarding steps 1 to 4 | C6.1 |
| Public | FAQ, Terms, Privacy, Contact, Editorial policy | C4 |
| Learner | Home (active and new-user empty states) | C8.1 |
| Learner | Tracks list; Track A course view (5 units: video placeholder, reading, action); Track B course view (5 units, shorter content); pre-quiz, post-quiz; certificate | C8.1, C9 |
| Learner | Journeys list; Renew-or-move player + result; Keep-renting-or-buy player + result | C11.1 |
| Learner | Calculator (True cost, Rent vs buy with chart and table, What can I afford) | C11.2 |
| Learner | My checklists list + checklist detail | C8.1, C11.6 |
| Learner | My homes (shortlist + comparison) | C8.1 |
| Learner | Reminders | C8.1 |
| Learner | Events; Offers + partner consent dialog | C11.3, C11.4 |
| Learner | Ask Dalil (full page + floating button) | C10 |
| Learner | Achievements (points, 8 badges, certificates) | C11.5 |
| Learner | Profile and privacy (consents, withdraw, download data) | C8.1 |
| Programme owner | Overview, Learners (+ profile drawer), Content, Approvals, Sponsors & placements, Communications, Reports, Settings (+ audit log) | C8.2, C12 |
| Reviewer | Review queue, Review item, Sources | C8.3 |
| Leadership | Impact, Funnel, Reports | C8.4, C13 |
| Sponsor | My placements, Performance, Guidelines | C8.5 |
| All | Notifications bell (C14 in-platform messages) | C14 |

About 45 screens. Track A in full; Track B units listed with video placeholders and short readings.

## 6. Reference map (`potential-template` branch `mockup-references`, `mockup-references/platform/`)

| Screen | Reference folder |
|---|---|
| Shell, sidebar, top bar, notifications | `shell-and-navigation/` |
| Login, register, onboarding, invite | `auth-and-onboarding/` |
| Learner Home, Maya Overview, Leadership Impact/Funnel, Sponsor Performance | `dashboards/` |
| Tracks, course view, unit player, quizzes, certificate | `learning/` (starter LMS) |
| Dalil chat, quizzes | `assessment-and-ai/` |
| Events | `events/` |
| Profile and privacy, Settings | `profile-and-settings/` |
| Learners table, Content, Approvals, Sponsors, Communications, Review queue | `admin-management/` |
| Empty states | `common-states/` |
| Achievements, badges | `competition/` (gamification) |

No direct reference: decision journey player, calculator (three tabs + chart), checklists, My homes comparison, reminders, offers with consent dialog, sponsor placement label previews, review side-by-side EN | AR. These get custom layouts in the brand style.

## 7. Functional vs simulated

See `docs/FUNCTIONAL-VS-SIMULATED.md`.

## 8. Data needed (lean, from C15)

- 12 named fictional learners shown in the Learners table (the 1,240 total is a count, the table pages a sample); Aisha and Rohan fully seeded.
- Staff: Maya, Khalid, Hessa; sponsors Oasis Home Finance, SwiftMove, SafeNest (all "fictional sample").
- 2 tracks, 10 units, 2 journeys, 1 calculator, 5 checklist templates, 3 offers, 3 events, 8 badges, 4 review items, source register (about 9 sources), 7 email templates.
- KPI values exactly as C13 everywhere (landing counters, Maya Overview, Leadership): 1,240 joined; 672 first useful action (54%); 251 of 922 returned (27%); 412 reminders; 486 journeys; 3,915 saves; 214 certificates; 37 consented requests; 0 unconsented; 64 of 64 claims sourced.

## 9. Acceptance

C17 checklist copied to `docs/CHECKLIST.md`, plus SOP 8.2 self-check.

## 10. Gaps and contradictions

Resolved by Vera 15:33 and 16:01 (see `ASSUMPTIONS.md`); journey JVC figure is now AED 93,377.75, break-even year 3, Ejari AED 177.75, DEWA deposit AED 2,000/4,000 refundable.

1. **Deadline**: Vera's email and C2 say 22:20; SOP SLA 3 (7 h from the 15:08 handoff) gives 22:08, which is what the receipt promised. Plan to 22:08.
2. **Rent vs buy break-even**: with the C11.2 defaults and the stated formula (payments + costs − equity, price growth 2%), buying becomes cheaper in year 3, not year 6 as the plan's demo values say (C8.1 Rohan, C11.2). Also break-even does not depend on the horizon, so "change horizon 8 to 4, break-even moves" (C16 step 8) does not happen with the stated formula; only the totals and chart length change.
3. **Journey 1 figures vs calculator formula**: AED 93,850 for JVC = rent 82,000 + agency 4,100 + deposit 4,100 + moving 3,000 + about AED 650 Ejari; it counts the refundable deposit and leaves out utilities and housing fee, while the True-cost tab formula excludes the deposit and adds utilities and the 5% housing fee (about AED 110,500 for the same home). Renewing at AED 99,750 is rent only. Same home, two different "true cost" numbers on two screens.
4. **Ejari fee and DEWA deposit** are "flat demo values flagged check with source" but no numbers given.
5. **Content not supplied**: Track B readings; post-quiz questions 7 to 10 (Track A) and all 10 for Track B; pre-quiz for Track B; full checklist items (18, 9, 12, 10, 12 given only partly); badge art; Arabic text for everything.
6. **Executive video**: a 55 to 65 s 1080p MP4 is a delivery item (C16, C17, SOP 8.3) and is not in the mockup skill flow. "Captions" in C17 vs "no voice-over": read as on-screen outcome captions.
7. **Logo**: only a white SVG is given; light surfaces (sign-in form side, cards) need a dark version.
8. **Colours**: C3 palette is a fallback; brief says match potential.org's live header for primary and secondary.
9. **Passwords**: C16 says Iris sets them and returns them in the delivery email; playbook E3 says `password` for in-mockup demo accounts. Page access login is handled by potential-mockups.
10. **Usernames**: sign-in is by username (`aisha.renter`), while registration asks for email.
11. Vera's email is not CC'd to Alex (SOP step 4 says CC Alex). No action; reply-all keeps the thread as is.

## 11. Brief vs playbook conflicts (Aliya decides at Gate 1)

| # | Plan says | Playbook says | Default (plan) |
|---|---|---|---|
| P1 | Arabic with full RTL on every page, language switch everywhere (C2) | E6: Arabic only landing, auth, learner; staff stay English | Full Arabic everywhere |
| P2 | Mobile 375 px; "Mobile-Responsive Experience" module on | D5: 390 px; admin not responsive | 375 px for public and learner; staff views usable on mobile? |
| P3 | Flat, warm illustrations, no real photos (C3 Imagery) | B13: photoreal AI images | Flat illustrations (AI-generated) |
| P4 | Partners section: "two grey placeholder tiles labelled Sample sponsor (fictional)" (C5.10) | E2: no placeholder labels; B1 premium | Styled sample tiles, labelled as the plan says |
| P5 | Sponsored label and "(fictional sample)" on every sponsor slot | E2: no demo tags on cards | Keep the labels: they are a product feature (labelling) |
| P6 | Video placeholders with "Video coming soon – animated explainer" | E2: no "placeholder video" labels | Plan wording, styled as a poster frame |
| P7 | Passwords set by Iris, returned in the delivery email | E3: demo password `password` | Ask |
| P8 | Google Fonts Inter and IBM Plex Sans Arabic | F1: self-hosted fonts | Same fonts, self-hosted (no conflict in look) |
| P9 | Landing copy uses en dashes ("Video coming soon – animated explainer", key dates) | E5: no em dashes | Keep en dashes as given; no em dashes |
