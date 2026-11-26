# F5 leadership + sponsor (dev port 5225)

Brief sections: C8.4, C8.5, C13 (every KPI with definition, target, demo value, trend; charts; impact story; filters; reports), C15, C11.3 labels.
References: run `~/.claude/skills/mockup/scripts/export-references.sh /home/aliya/Projects/work/potential-org-home-ready/.checks/refs platform/dashboards` and OPEN the images; layout only.
Own: src/features/leadership/**, src/features/sponsor/**, routes /leadership/impact, /leadership/funnel, /leadership/reports, /sponsor/placements, /sponsor/performance, /sponsor/guidelines; src/i18n/{en,ar}/{leadership,sponsor}.json (English in both). Calm, data-first, responsive at 375 too. Read the dataviz skill before writing charts; use src/components/charts.

- Hessa Impact: four StatCards K1-K4 with definition (hint), target, demo value and trend exactly per C13 (from useKpis); charts: sign-ups weekly last 12 weeks by source (WEEKLY_SIGNUPS), track and video completion (A 38%, B 24%), pre vs post confidence 2.4 to 4.1, journey score distribution (SCORE_DISTRIBUTION), sponsor summary (aggregate); impact story panel (C13 text); filters (date range, track, emirate, source, household, language) that visibly change the view or show a "filtered" state. Read-only.
- Funnel: 1,240 joined → 1,105 onboarded → 672 first useful action → 251 returned within 30 days → 412 reminder opt-ins (FUNNEL), with conversion rates.
- Reports: "Home Ready scorecard" (XLSX = CSV), "Leadership summary" (PDF = print view), "Sponsor aggregate report" (PDF); logExport.
- Oasis placements: Track A partner badge, calculator "powered by" slot, offer "Free mortgage pre-approval check"; label preview + live status (paused placements hidden: useSponsorPlacements('SP-OASIS')); Preview.
- Performance: aggregates only (impressions 18,420; calculator runs 1,106; offer views 642; consented partner requests 37, count only) from KPI.sponsor/useKpis; banner "Personal data is never shared without the user's separate opt-in. Requests are passed by Potential.org."; Download report (PDF print view). No names, emails or phones anywhere.
- Guidelines: editorial independence, labelling, no influence on content or rankings.
Store: useKpis, FUNNEL, WEEKLY_SIGNUPS, SCORE_DISTRIBUTION, MIX, KPI.sponsor, useSponsorPlacements, logExport.
Shots: every Hessa and Oasis screen 1440 + 375.
