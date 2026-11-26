# Assumptions

## Known from earlier work

- MemPalace search for Potential.org (25 Nov 2026): no client facts in the knowledge graph. SMEEP (Potential.org Foundation) mockup exists in `potential-smeep`; the plan names SMEEP as the reference model. Read only, not changed.

## Vera's answers (email 25 Nov 2026 15:33 Dubai, "Answers in the same order") — binding

1. Break-even: calculator shows what the formula gives (year 3). Update Rohan's saved result, the click-path text and any video caption to match. Changing the horizon only changes the totals and the chart.
2. Journey 1 costs: keep the comparison with the note "one-off and rent costs only; utilities similar in both homes". (Figure corrected at 16:01, see below.)
3. Ejari and DEWA deposit "check with source" values: superseded by the 16:01 corrections.
4. Missing content (Track B readings and pre-quiz, remaining quiz questions, full checklists): Iris writes them in the same style; shown as drafts for Maya and the reviewer in Maya's Content view.
5. Arabic: Iris's translation, marked "Arabic draft for review" in the Content view only; "the Arabic/RTL switch stays on learner screens".
6. Logo: dark version from potential.org if published there; otherwise the white logo on dark bands only.
7. Video captions: the on-screen outcome captions listed in C16, no voice-over.
8. Sign-in: username or email.
9. Delivery: 22:08 Dubai (22:20 was a slip).

## Vera's fee corrections (email 25 Nov 2026 16:01 Dubai, from Alex's source check) — binding

1. Ejari: AED 177.75 (online / Dubai REST; AED 220 at a trustee centre), replacing the AED 650 demo value. Source: https://dubailand.gov.ae/en/eservices/register-renew-tenancy-contract/
2. DEWA move-in deposit: refundable, AED 2,000 apartment / AED 4,000 villa. Shown under upfront cash as a refundable item, separate from activation fees and outside the cost comparison. Source: https://dewa.gov.ae/en/consumer/supply-management/activation-of-electricity-water-move-in
3. Must match everywhere: calculator True cost tab, Aisha's saved Journey 1 result, Dalil's upfront-cost answer, click-path, video captions. Vera asked for a confirmation when done (send after build, as a small-fix style reply).

## Figures register (single source for the build; put these in `src/data`, never retype per screen)

| Figure | Value | Where it shows | Source tag |
|---|---|---|---|
| Ejari registration | AED 177.75 (AED 220 at a trustee centre) | True cost tab default, Journey 1 step 3, Dalil upfront answer, A1/A4 readings | DLD register/renew tenancy contract, checked on 25 Nov 2026 |
| DEWA move-in deposit | AED 2,000 apartment / AED 4,000 villa, refundable | True cost tab "upfront cash, refundable" line (not in cost total), Dalil upfront answer, A1 reading | DEWA activation move-in, checked on 25 Nov 2026 |
| Journey 1 JVC first-year | AED 93,377.75 = 82,000 rent + 4,100 agency + 4,100 security deposit + 3,000 moving + 177.75 Ejari | Journey 1 step 3, Aisha's saved result, click-path, video caption 3 | note "one-off and rent costs only; utilities similar in both homes" |
| Journey 1 renew | AED 99,750 (5% allowed increase on AED 95,000) | Journey 1 steps 2 and 3, Aisha's saved result | DLD Rental Index / Decree No. 43 of 2013 |
| Rent vs buy break-even | Year 3 at C11.2 defaults (computed by the formula, not hardcoded) | Calculator, Rohan's saved result ("buying costs less from year 3 at the defaults"), click-path step 8, video caption 4 | formula C11.2 |
| Security deposit | 5% unfurnished / 10% furnished (market practice) | True cost tab, Dalil | market practice, not a rule |

Open point for the build: the True cost tab formula (C11.2) includes the security deposit in "refundable" only; Journey 1 counts it in its one-off figure per the plan. Both stay as Vera confirmed (answer 2).

## Aliya's Gate 1 answers (25 Nov 2026, verbatim)

"1. yes, 2. yes, 3. yes, 4. yes, 5. yes, 6. why no voiceover, keep voiceover. 7. yes, 8. ok, 9. yes."

Applied as:
1. Arabic/RTL on landing, auth and learner screens only; staff views English.
2. Staff views also responsive (375 px).
3. AI-generated flat, warm illustrations (plan C3), no photos.
4. All six demo accounts use password `password`.
5. Keep "Sponsored", "(fictional sample)" and "Video coming soon" labels, styled premium.
6. Executive video WITH voice-over (deviation from C16 and Vera's 15:33 answer 7; see DEVIATIONS.md). On-screen outcome captions stay.
7. Build everything; Track B shorter.
8. Repo `potential-org-home-ready`, client slug `potentialorg`, mockup slug `home-ready`.
9. Primary/secondary colours from potential.org live site; rest from C3.
