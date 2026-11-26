# Functional vs simulated

Front-end only (playbook A5). All state lives in the browser demo store (localStorage); "Reset demo" restores the seed.

## Works in the browser

- Registration form with validation (C6.1), marketing unticked, 18+ required; onboarding 4 steps incl. pre-quiz; creates a new learner in the demo store.
- Sign-in by username for the 6 demo accounts, plus demo profile cards; role-based routing and access (C7).
- Language switch EN | AR with full RTL layout.
- Track A: 5 units, mark complete, progress, pre-quiz and 10-question post-quiz with 70% pass, certificate issued and viewable/downloadable (print to PDF).
- Both decision journeys: 5 screens, options, instant feedback, score, result with "what to check" list, save next action, save checklist, set reminder.
- Calculator: 3 tabs, every input editable, instant recalculation, chart and year table, save and compare results.
- Checklists: tick, add note; My homes: add, compare, run true cost; reminders: set, edit, delete, channel.
- Offers: separate consent dialog (unticked); confirm records a consent (withdrawable in Profile) and +1 on sponsor's aggregate count.
- Events: register.
- Points, badges, milestones computed from actions.
- Staff: review approve / request changes; publish after approval; add / pause placement; send nudge; schedule announcement; settings save; audit log entries.
- In-platform notifications from actions (C14 in-platform triggers).

## Simulated (labelled where the user would notice)

| What | How it is faked |
|---|---|
| Dalil AI assistant | Scripted answers for the 5 C10 prompts (EN and AR); other questions get a polite fallback that points to the source register and "Talk to a person". Typing indicator for realism. |
| Email (welcome, verification, reminders, certificate, partner confirmation) | Not sent. Shown as an email preview in Maya's Communications and as an in-platform notification. Email verification is auto-confirmed. |
| Videos | Titled 16:9 poster frames with duration and "Video coming soon – animated explainer" (C9.1). |
| DLD Rental Index, Title Deed Verification, other official services | Plain links that open the public DLD pages in a new tab (C17 "opens the public DLD pages only"). |
| Downloads (XLSX/PDF reports, checklist PDF, my data, sponsor report) | Generated client-side (CSV/print view) or a toast "Report prepared"; decide in build plan. |
| Partner hand-off to sponsors | Count only; nothing leaves the browser. |
| Forgot password, invite / set password | Screens work; no email is sent. |
| SMS reminders | Not shown (needs scoping); email + in-platform only. |
| KPI totals (1,240 learners etc.) | Seeded aggregate values; live actions add to them. |
