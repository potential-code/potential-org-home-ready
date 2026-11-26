# Arabic for every screen (Aliya, 26 Nov 2026: "option 2")

Goal: in Arabic mode, every screen of the Home Ready mockup is fully Arabic and RTL, including the staff portals (Maya `/admin/*`, Khalid `/review/*`, Hessa `/leadership/*`, Oasis `/sponsor/*`). Today these show English UI inside RTL (13-44 English text blocks per page).

Read first: ~/.claude/skills/mockup/playbook.md, the mockup CLAUDE.md (architecture; the "Frozen" list is lifted for this task for exactly the files named below), docs/DESIGN.md, docs/ASSUMPTIONS.md.

Do:
1. Translate `src/i18n/ar/{owner,review,leadership,sponsor}.json` into proper Modern Standard Arabic (same keys as en; keep placeholders like `{{name}}` intact; numbers stay Western digits as in the learner screens; brand names Potential.org, Home Ready ("جاهز للسكن" where it is the programme name in prose, as the learner screens do), DLD, RERA, DEWA, Ejari stay as the learner screens render them).
2. Hardcoded English in staff feature code (`src/features/{owner,review,leadership,sponsor}/**`): move to the namespaces (en + ar).
3. Seed data shown on staff screens that is English-only (e.g. `src/data/staff-seed.ts`: content titles, review items, claims, templates, announcements, audit entries, alerts; `src/data/catalogue.ts`: sponsor/placement/slot labels; `src/data/sources.ts` labels if shown in English): make them `Localized` (`L(en, ar)`) and render with `useLocalized().l()`. Update `shared/types.ts` accordingly. Keep ids and numbers unchanged. KPI labels/definitions from `src/data/figures.ts` too if they show in English.
4. Learner seeded notes (Aisha's checklist notes in `src/data/checklists.ts`/learner-seed, My homes notes in `src/data/learner-seed.ts`): make Localized and render with `l()`. Text the user types live stays as typed.
5. Charts: axis labels, legends, tooltips and table views in Arabic; date labels via the i18n formatters; check bar/line charts and progress bars read correctly in RTL (no reversed fills, no clipped labels).
6. Demo shell for staff: greetings ("Good morning, Maya"), role titles, empty states, toasts, dialogs, print/report views, CSV headers may stay English (file content) but the buttons and dialogs are Arabic.

Check (must pass): `bun run typecheck`, `bun run test` (i18n parity), `bun --bun run check:rules`, `bunx biome check --write <changed paths>`. Build is done by the lead.
Arabic audit: run a dev server on port 5226 (`bunx --bun vite --port 5226 --strictPort`), then `NODE_PATH=$PWD/node_modules ~/.bun/bin/bun scripts/ar-audit.mjs scripts/ar-audit-routes.json /tmp/ar-out.json` after changing the base URL in that script to http://127.0.0.1:5226/ (copy it to your scratch dir first; do not change the original). Target: 0 English text blocks on every staff route other than names, emails, usernames, URLs and brand names. Then screenshot every staff route in Arabic at 1440 and 375 (Playwright, executablePath `$HOME/.cache/ms-playwright/chromium_headless_shell-1252/chrome-headless-shell-linux64/chrome-headless-shell`), save to `.checks/shots/ar-staff/`, LOOK at each and fix RTL layout issues. Also re-check English mode still reads correctly on 3 staff pages.

Rules: no commits, no installs, no image generation, work only in this folder, stop your dev server when done. Report: files changed, audit result per route (before/after counts), screenshot paths, anything left in English and why.
