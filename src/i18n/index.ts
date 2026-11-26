import config from '@config'
import type { Lang, Localized } from '@shared/types'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import arAuth from './ar/auth.json'
import arCalculator from './ar/calculator.json'
import arCommon from './ar/common.json'
import arDalil from './ar/dalil.json'
import arJourneys from './ar/journeys.json'
import arLeadership from './ar/leadership.json'
import arLearn from './ar/learn.json'
import arLearning from './ar/learning.json'
import arOwner from './ar/owner.json'
import arPublic from './ar/public.json'
import arReview from './ar/review.json'
import arSponsor from './ar/sponsor.json'
import enAuth from './en/auth.json'
import enCalculator from './en/calculator.json'
import enCommon from './en/common.json'
import enDalil from './en/dalil.json'
import enJourneys from './en/journeys.json'
import enLeadership from './en/leadership.json'
import enLearn from './en/learn.json'
import enLearning from './en/learning.json'
import enOwner from './en/owner.json'
import enPublic from './en/public.json'
import enReview from './en/review.json'
import enSponsor from './en/sponsor.json'

/**
 * Namespaces: common (shell), public (landing, static), auth (register, login, onboarding), learn
 * (learner core + tools pages), learning (LMS course view), journeys, calculator, dalil (EN + AR),
 * owner, review, leadership, sponsor (staff: English; Arabic files mirror the English text).
 * Both en/ and ar/ need the same keys (the parity test checks them).
 */
export const NAMESPACES = [
  'common',
  'public',
  'auth',
  'learn',
  'learning',
  'journeys',
  'calculator',
  'dalil',
  'owner',
  'review',
  'leadership',
  'sponsor',
] as const

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      public: enPublic,
      auth: enAuth,
      learn: enLearn,
      learning: enLearning,
      journeys: enJourneys,
      calculator: enCalculator,
      dalil: enDalil,
      owner: enOwner,
      review: enReview,
      leadership: enLeadership,
      sponsor: enSponsor,
    },
    ar: {
      common: arCommon,
      public: arPublic,
      auth: arAuth,
      learn: arLearn,
      learning: arLearning,
      journeys: arJourneys,
      calculator: arCalculator,
      dalil: arDalil,
      owner: arOwner,
      review: arReview,
      leadership: arLeadership,
      sponsor: arSponsor,
    },
  },
  lng: config.defaultLanguage,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: [...NAMESPACES],
  interpolation: { escapeValue: false },
  returnNull: false,
})

export default i18n

/**
 * Pick the active language from a Localized value. Empty Arabic text falls back to English;
 * `isPlaceholder` lets the UI label it "Arabic content placeholder" .
 */
export function useLocalized() {
  const { i18n: inst } = useTranslation()
  const lang: Lang = inst.language === 'ar' ? 'ar' : 'en'
  const l = (v: Localized | undefined) => (v ? (lang === 'ar' && v.ar ? v.ar : v.en) : '')
  const isPlaceholder = (v: Localized | undefined) => lang === 'ar' && !!v && !v.ar && !!v.en
  return { l, lang, isPlaceholder, dir: lang === 'ar' ? ('rtl' as const) : ('ltr' as const) }
}

export function formatDate(
  iso: string,
  lang: Lang,
  opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
) {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en-GB', {
    timeZone: config.timeZone,
    ...opts,
  }).format(new Date(iso))
}
export function formatTime(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en-GB', {
    timeZone: config.timeZone,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}
export function formatNumber(n: number, lang: Lang) {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar' : 'en-GB').format(n)
}
