# State

Job: MKP-2026-002 Potential.org Home Ready (SOP-MKP-01). Agent identity: wsl:claude:potential-org-home-ready. Not a dry run. Blind list: none.

## Deadlines (Dubai)

- Handoff (Vera's email received): Wed 25 Nov 2026 15:08
- Receipt: SENT 15:10 (reply-all, by the inbox watcher session)
- Questions to Vera: SENT 15:14 (reply-all, send checks passed)
- Gate 1 walkthrough to Aliya: due 16:08
- Gates 2 + 3: target about 16:53
- Vera's answers received 15:33 (all 9 assumptions agreed); fee corrections 16:01 (Ejari AED 177.75, DEWA deposit AED 2,000/4,000 refundable). Vera wants a confirmation once applied in the build.
- Delivery (mockup live + delivery email + 1-minute video): 22:08 (Vera confirmed 15:33)

## Phase

Phase 2 (analysis) done. Gate 1 PASSED. Gate 2: palette, fonts, images decided (potential.org palette applied, preview rebuilt). Gate 3 PASSED ("yes", plan + motif). Phase 5: foundation done 18:11 (6 personas sign in, smoke-tested); 11 AI images done (Canva); F1-F5 all done by 18:50. Lead fixes: footer swap, demoDate 25 Nov, caption dash, updateContent + updateLearnerProfile actions, learner page padding for Dalil button. Phase 6 verify running (own sweep script; starter check scripts hang under bun/node18). Video agent launched 19:00 (docs/briefs/VIDEO.md).

## Inputs

- `docs/brief/EMAIL.md` (Vera's build request, verbatim)
- `docs/brief/BRIEF.txt` (Detailed Mockup Plan v1, text via Outlook connector; .docx binary not saved)
- Alex's high-level plan and Shadi/Maya source emails: Outlook attachments on the build request; content reproduced in BRIEF.txt C1 and summarised in ANALYSIS.md.

## Gate approvals

| Gate                         | Asked | Approved by | Date | Notes |
| ---------------------------- | ----- | ----------- | ---- | ----- |
| Analysis and open questions  | 25 Nov 15:15 (alert emailed) | Aliya | 25 Nov | "1. yes, 2. yes, 3. yes, 4. yes, 5. yes, 6. why no voiceover, keep voiceover. 7. yes, 8. ok, 9. yes." |
| Design direction             | 25 Nov 16:35 (alert emailed) | Aliya (palette + images; motif/landing not yet confirmed) | 25 Nov | "i want the potential.org branding colors. and please put ai generated images instead of illustrations. always put ai genrated images even though plan says illustrations. also sometimes the branding colors could be wrong, follow the respective website for these branding like colors, fonts."  Preview: docs/preview/, live http://localhost:5211/ (?palette=site) |
| Build plan                   | 25 Nov 16:35 | Aliya | 25 Nov 16:54 | "yes" (to: approve build plan + timeline, and the line-art house-and-key motif) |
| Aliya review (phase 7)       | 25 Nov 19:15 (alert emailed) | in progress |      | Round 1: video no zoom + story VO (done), VO gaps fixed (done), hero = family photo bg, card removed, 1 viewport ("yes" to hero preview); video moment 1 re-capture running |
| Publish to potential-mockups | 25 Nov 20:05 (alert emailed) | Aliya | 25 Nov 20:07 | "yes push to main obviously". Pushed potential-mockups 3b299f2 (sites/potentialorg/home-ready, 287 files, 6.8 MB). Re-publish b35d55d (favicon), Aliya "yes". |

## Last check run

None yet (no code changed; starter copied, `bun install` ok).

## Blockers

- chrome-devtools MCP failed to connect (npx not on PATH): visual checks will use Playwright scripts in the starter unless fixed.
- Delivery email SENT by Aliya 25 Nov 20:16 Dubai (with video attached), before the 22:08 deadline. Next: wait for Vera's verification / fix list (1 h SLA per fix; every re-publish needs Aliya's go). Live: https://mockup.potentiallead.com/potentialorg/home-ready/ (401 login = deployed).

## Standing approval for fixes (Aliya, 25 Nov 20:32 Dubai)

Verbatim: "yes for this republish after fixes , u do on your own, no wait for me."
Scope: MKP-2026-002 only, re-publishing fixes from Vera's fix list (text, numbers, layout, bugs) without waiting for Aliya. NOT covered: scope or branding changes, anything Rawzaba/Shadi ask beyond the plan, new recipients or Teams, closing the job.

## Post-delivery log

- 21:01 Vera: site does not load for her (connection fails, also overview + Zimam). 21:15 checked from here: 401 login on all links, cert valid to Feb 2027, public DNS A 31.97.71.164 (no AAAA), HTTP/1.1 + HTTP/2 OK. Replied to Vera 21:15 (send checks passed; quoted thread removed because it held the site password) asking her to retry / send the Chrome error code. Alert emailed to Aliya.
- 21:31 Vera: "Nothing more needed from you for now"; she will retry from a fresh browser session and send the Chrome error code if it still fails. No reply needed. (Watcher alert at 21:40 was a correct new-email alert, not a duplicate.)
- 09:22 (26 Nov) Rawzaba asked (via @Aliya) to send Maya the mockup URL + credentials, feedback to Vera. Aliya approved draft; sent ~09:35 reply-all in Rawzaba's thread (To Rawzaba, Vera, Maya; CC Shadi, Mamoon): preview link, client link + site login, 6 test logins, review order.
