import { Download, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { formatDate, useLocalized } from '@/i18n'
import { now } from '@/lib/clock'
import { getDb } from '@/store/db'
import { useMe } from '@/store/hooks'

/** Everything the platform holds about one learner, as a JSON download (C14 data rights). */
function myData(id: string) {
  const db = getDb()
  const mine = <T extends { learnerId: string }>(xs: T[]) => xs.filter((x) => x.learnerId === id)
  return {
    exportedAt: now(),
    profile: db.learners.find((l) => l.personaId === id),
    consents: db.consents.find((c) => c.learnerId === id),
    partnerConsents: mine(db.partnerConsents),
    onboarding: db.onboarding[id],
    enrollments: mine(db.enrollments),
    journeys: mine(db.journeyRuns),
    calculatorResults: mine(db.calcResults),
    checklists: mine(db.checklists),
    reminders: mine(db.reminders),
    homes: mine(db.shortlist),
    points: mine(db.activity),
    badges: mine(db.badges),
    eventRegistrations: mine(db.eventRegistrations),
    assistantChat: mine(db.chat),
  }
}

/** Download my data (JSON) and Delete account (confirm, then a dated request). */
export function DataCard() {
  const { t } = useTranslation('learn')
  const { lang } = useLocalized()
  const me = useMe()
  const [deleteAt, setDeleteAt] = useState<string | null>(null)
  const download = () => {
    const blob = new Blob([JSON.stringify(myData(me.id), null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `home-ready-my-data-${me.id}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    toast.success(t('profile.data.downloaded'))
  }
  return (
    <section aria-labelledby="data-title" className="card grid gap-4 p-5 sm:p-6">
      <h2 id="data-title" className="text-lg">
        {t('profile.data.title')}
      </h2>
      <div className="grid gap-3 rounded-xl bg-tint-50 px-4 py-3">
        <p className="text-sm text-ink-soft">{t('profile.data.downloadBody')}</p>
        <Button variant="outline" className="justify-self-start rounded-full" onClick={download}>
          <Download aria-hidden /> {t('profile.data.download')}
        </Button>
      </div>
      <div className="grid gap-3 rounded-xl border border-danger/30 px-4 py-3">
        <p className="text-sm text-ink-soft">{t('profile.data.deleteBody')}</p>
        {deleteAt ? (
          <div className="flex flex-wrap items-center gap-3">
            <p role="status" className="text-sm font-semibold text-danger">
              {t('profile.data.deleteRequested', { date: formatDate(deleteAt, lang) })}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDeleteAt(null)
                toast.success(t('profile.data.deleteCancelled'))
              }}
            >
              {t('profile.data.deleteCancel')}
            </Button>
          </div>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="justify-self-start rounded-full">
                <Trash2 aria-hidden /> {t('profile.data.delete')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('profile.data.confirmTitle')}</AlertDialogTitle>
                <AlertDialogDescription>{t('profile.data.confirmBody')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('profile.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => {
                    setDeleteAt(now())
                    toast.success(t('profile.data.deleteToast'))
                  }}
                >
                  {t('profile.data.confirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </section>
  )
}
