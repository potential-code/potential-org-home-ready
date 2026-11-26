# Executive video brief (MKP-2026-002 Home Ready)

Deliverable: `MKP-2026-002_Potential.org_Executive-Video.mp4`, 55–65 s, MP4 H.264, 1920x1080 16:9, light background music, VOICE-OVER (Aliya's decision, deviation D1 in docs/DEVIATIONS.md), on-screen outcome captions, closing frame, demo data only. Save the final file to `/home/aliya/Projects/work/potential-org-home-ready/docs/video/` and keep the project source under `/home/aliya/Projects/work/potential-org-home-ready/video/` (not inside src/). Under 20 MB if possible.

Read first: the `hyperframes` skill (mandatory entry point; it routes you), the `media-use` skill for voice-over and music (prefer a calm, warm, neutral English voice; local/free TTS if HeyGen is not available), docs/brief/BRIEF.txt section C16 (video storyline) and docs/DESIGN.md (brand: ink #10141A, emerald #047857, amber #FBBF24, Plus Jakarta Sans; logo `public/brand/potential-org-white.svg` on dark only).

Footage: real screen captures of the running mockup at http://127.0.0.1:5211/ (hash routing, e.g. `#/login`; sign in with username + `password`). Capture with Playwright (executablePath `$HOME/.cache/ms-playwright/chromium_headless_shell-1252/chrome-headless-shell-linux64/chrome-headless-shell`, run with `NODE_PATH=/home/aliya/Projects/work/potential-org-home-ready/node_modules ~/.bun/bin/bun script.mjs`), viewport 1920x1080 (or 1440x810 scaled), video recording or frame sequences. Do NOT change any app code.

Seven moments, in order, each with its outcome caption (verbatim):
1. Landing hero (EN), quick flip to Arabic (language switch in header) — "A free UAE programme for better home decisions"
2. Aisha's Home (`aisha.renter`, `#/learn/home`) with the renewal next-action card — "Every learner gets a clear next step"
3. Renew-or-move journey (`#/learn/journeys/renew-or-move`): Rental Index step, then result 78/100 and saved checklist — "Decisions made with official sources, not guesswork"
4. Rohan's rent-vs-buy calculator (`rohan.buyer`, `#/learn/calculator?tab=rent-vs-buy`): edit horizon 8 → 4, chart recalculates; break-even stays year 3 — "See the real cost of renting versus buying"
5. Offers (`#/learn/offers`): labelled sponsor offer and the separate consent dialog (box unticked) — "Sponsors fund it; users stay in control of their data"
6. Maya (`maya.owner`): Content (`#/admin/content`, EN/AR and check dates) and Approvals (`#/admin/approvals`) — "Every fact reviewed, dated and bilingual"
7. Hessa (`hessa.leadership`, `#/leadership/impact`): K1–K4 and funnel (`#/leadership/funnel`) — "Track first useful actions and returning users"
Closing frame: "Home Ready – by Potential.org" with the Potential.org logo and "Powered by Potential.com".

Voice-over script (about 130 words; keep figures exactly):
"Meet Home Ready, a free programme from Potential.org that helps people in the UAE decide whether to rent or buy. Every learner starts with a clear next step. Aisha's tenancy renews soon, so she runs the renew-or-move journey, checks the official Rental Index, and saves a personal checklist. Rohan compares buying a home with renting. He changes his assumptions and the calculator updates instantly. Sponsors help keep Home Ready free, with clear labels, and no data is shared without a separate yes. Every fee and rule is reviewed, dated and available in English and Arabic. And leadership can track first useful actions and returning users. Home Ready, by Potential.org. Powered by Potential.com."

Style: calm, premium, cross-fades only, NO zoom or pan (full frame, full sidebar visible); story-style first-person VO (see standing answers), captions as clean lower-thirds on a dark ink band with amber accent, no flashing. Legible at 1080p. Fictional data only.

Check before done: duration 55–65 s (ffprobe), 1920x1080, H.264, audio present (VO + music, VO clearly louder), captions match verbatim, no typos, no real people/brands. Extract 7 frames (one per moment) + the closing frame as PNGs into docs/video/frames/ and LOOK at each.

Rules: no commits, no changes to app source, no installs beyond what the hyperframes/media-use skills set up in their own project folder, no publishing anywhere. Cannot write docs/*.md: return any notes in your final message. Final report: file path, duration, size, how VO and music were made, frame paths, anything not done.
