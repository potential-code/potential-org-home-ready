/**
 * Landing sections the header nav scrolls to (brief C5 menu: Tracks · Decision journeys ·
 * Calculator · Events · FAQ). Hash routing owns the URL hash, so in-page links never use `#id`
 * hrefs. i18n label: public:nav.<id>. Mapping to C5 bands: tracks = 7 Programme content,
 * journeys = 6 How it works (scored journeys), calculator = 4 Why it matters (true-cost view),
 * events = 9 Key dates, faq = 12 FAQ.
 */
export const SECTIONS = ['tracks', 'journeys', 'calculator', 'events', 'faq'] as const
export type SectionId = (typeof SECTIONS)[number]

/** The two tracks on the landing (C5.7, unit titles from C9). i18n: public:tracks.<key>. */
export const TRACKS = [
  {
    key: 'renting',
    letter: 'A',
    units: ['A1', 'A2', 'A3', 'A4', 'A5'],
    sponsored: true,
    image: 'images/generated/track-renting.jpg',
  },
  {
    key: 'buying',
    letter: 'B',
    units: ['B1', 'B2', 'B3', 'B4', 'B5'],
    sponsored: false,
    image: 'images/generated/track-buying.jpg',
  },
] as const
export type TrackConfig = (typeof TRACKS)[number]

/** "Who it is for" cards (C5.5). `path` is the /register?path= value that preselects the form. */
export const AUDIENCES = [
  { path: 'mover', image: 'images/generated/who-mover.jpg' },
  { path: 'renewal', image: 'images/generated/who-renewal.jpg' },
  { path: 'renter-buyer', image: 'images/generated/who-renter-buyer.jpg' },
  { path: 'first-buyer', image: 'images/generated/who-first-buyer.jpg' },
] as const
export type AudiencePath = (typeof AUDIENCES)[number]['path']

/** "How it works" steps (C5.6). i18n: public:steps.<key>. */
export const STEPS = ['join', 'pick', 'watch', 'decide', 'save'] as const

/** Key dates timeline (C5.9); `done` marks items already reached on the demo date. */
export const KEY_DATES = [
  { key: 'mock', done: true },
  { key: 'outlines', done: false },
  { key: 'playbook', done: false },
  { key: 'pilot', done: false },
  { key: 'more', done: false },
] as const

/** Number of landing FAQ items (C5.12). i18n: public:faq.items.<i>.{q,a}. */
export const FAQ_COUNT = 8
