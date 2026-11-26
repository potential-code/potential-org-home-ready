# F1 public + auth (dev port 5221)

Brief sections: C3, C4, C5 (ALL 14 landing sections, copy verbatim), C6.1, C6.2, C10 greeting, C15, C16.
Own: src/features/public/**, routes /, /register, /login, /forgot-password, invite, /onboarding/1-4, /faq, /terms, /privacy, /contact, /editorial-policy; src/i18n/{en,ar}/{public,auth}.json (full Arabic). The hero, Programme content section and login with persona cards exist: extend.

- Landing: all 14 C5 sections in order, exact copy, EN + AR (RTL). hero.jpg replaces the inline SVG hero illustration (delete it). who-mover/who-renewal/who-renter-buyer/who-first-buyer.jpg on the 4 "Who it is for" cards ("Start here" goes to /register?path=<x>). track-renting/track-buying.jpg on the track cards. cta-band.jpg behind the final CTA (dark scrim, white text). Dalil card with sample Q&A (C5.8), key dates timeline (C5.9), Partners with two styled "Sample sponsor (fictional)" tiles + editorial policy link (C5.10), impact counters animated from useKpis() (C5.11), FAQ accordion 8 items, final CTA, footer C5.14 with "Powered by Potential.com" wordmark. Nav links scroll to sections. Motion: Lenis + GSAP ScrollTrigger revealing title, text, items one by one per section (load the `gsap` skill), smooth, no flicker. Motif in several sections. Premium, little empty white space.
- /register: C6.1 fields and validation, Terms unticked, marketing UNTICKED, 18+ required, links open in a panel; `path` query preselects "What brings you here?"; registerLearner then /onboarding/1. auth-panel.jpg on the auth brand panel (register and login).
- Onboarding 1-4 (C6.1): situation, pick track, 5-question pre-quiz (submitPreQuiz), Meet Dalil + suggested first action, finishOnboarding, /learn/home.
- Forgot password, invite/set password (toast, no email).
- Static: FAQ, Terms, Privacy, Contact (hello@potential.org), Editorial policy: short real-looking copy consistent with C5/C17.
Store: registerLearner, saveOnboarding, submitPreQuiz, finishOnboarding, signInWithCredentials, useOnboarding, useKpis, DALIL_GREETING.
Shots: every screen 1440 + 375 EN; landing + register 375 AR.
