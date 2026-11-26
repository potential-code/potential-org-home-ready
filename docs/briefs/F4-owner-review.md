# F4 programme owner + reviewer (dev port 5224)

Brief sections: C7, C8.2, C8.3, C12, C13 (KPI values), C14, C15.
References: run `~/.claude/skills/mockup/scripts/export-references.sh /home/aliya/Projects/work/potential-org-home-ready/.checks/refs platform/admin-management platform/dashboards` and OPEN the images; layout only.
Own: src/features/owner/**, src/features/review/**, routes /admin/* (overview, learners, content, approvals, sponsors, communications, reports, settings) and /review/* (queue, item/$id, sources); src/i18n/{en,ar}/{owner,review}.json (English in both).
Staff views are calm and data-first, and responsive at 375 too (Aliya's answer).

- Maya Overview: StatCard row K1-K4 + sign-ups last 30 days (318) from useKpis; content status (10 published, 4 in review, 6 draft AR); alert "2 fees expire their check date in 14 days"; Go to approvals.
- Learners: DataTable (name, emirate, track, progress, first useful action Y/N + date, last active, reminders, consents), filters (track, emirate, source, activated, returned), saved filter "Signed up 7+ days ago, no useful action" (214) with Send nudge (dialog with C14 template, toast, audit), profile drawer with journey history, Export (CSV).
- Content: items with EN/AR versions ("Arabic draft for review" marker here only), source, checked-on date, status; Edit (dialog), Submit for review, Publish (approved only).
- Approvals: queue per C8.2; Publish, Return to author; reflects Khalid's actions live.
- Sponsors & placements: inventory (track sponsor, video sponsor, calculator powered by, offers area, event sponsor, partner requests), 3 fictional sponsors "Sample – not contracted", label preview, rule "no personal data, label always visible"; Add placement (dialog), Pause/Resume (paused hides it for learners and sponsor), Preview.
- Communications: C14 templates (edit dialog), reminder schedule, announcement "New: Dubai rent increase rules explained" (schedule).
- Reports: scorecard per C8.2 (pipeline/agreements/money "0 – pre-launch"; cost per activated user vs sponsor revenue "not yet available"); Download XLSX/PDF (CSV or print view, logExport).
- Settings: languages, emirates (Dubai on; Abu Dhabi, Sharjah "coming soon"), reviewer assignment, check-date expiry 90 days, Save; audit log of publish and consent events.
- Reviewer Khalid: queue (4 items, submitted and due dates), item page with side-by-side EN | AR, claims with source link and checked-on field (Update check date), comment box, Approve / Request changes (updates Maya's approvals + notification), Sources register with last-checked dates (add/update dialog).
Store: useKpis, useContentCounts, useLearners, useContent, useApprovals, usePlacements, useTemplates, useAnnouncements, useAudit, useSettings, publishContent, returnToAuthor, submitForReview, addPlacement, setPlacementStatus, sendNudge, scheduleAnnouncement, updateTemplate, saveSettings, logExport, useReviews, useReview, approveReview, requestChanges, updateClaimCheckDate, SOURCES.
Shots: every Maya and Khalid screen 1440 + 375; the approve then publish flow.
