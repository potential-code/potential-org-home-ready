import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useLocalized } from '@/i18n'

export type LegalDoc = 'terms' | 'privacy' | 'guidelines'

const PARAS: Record<LegalDoc, string[]> = {
  terms: ['terms1', 'terms2', 'terms3', 'terms4'],
  privacy: ['privacy1', 'privacy2', 'privacy3', 'privacy4'],
  guidelines: ['guidelines1', 'guidelines2', 'guidelines3'],
}

/** Side panel with the short Terms, Privacy notice or Sponsor guidelines (C6.1 "links open in a panel"). */
export function LegalSheet({ doc, onClose }: { doc: LegalDoc | null; onClose: () => void }) {
  const { t } = useTranslation('auth')
  const { dir } = useLocalized()
  return (
    <Sheet open={doc !== null} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side={dir === 'rtl' ? 'left' : 'right'} className="w-full gap-0 sm:max-w-md">
        {doc && (
          <>
            <SheetHeader className="border-b border-border/70 p-6">
              <SheetTitle className="flex items-center gap-2 text-xl text-ink">
                <FileText className="size-5 text-brand" aria-hidden />
                {t(`legal.${doc}Title`)}
              </SheetTitle>
              <SheetDescription>{t('legal.termsUpdated')}</SheetDescription>
            </SheetHeader>
            <div className="flex-1 space-y-4 overflow-y-auto p-6 text-ink">
              {PARAS[doc].map((k) => (
                <p key={k} className="leading-relaxed">
                  {t(`legal.${k}`)}
                </p>
              ))}
            </div>
            <SheetFooter className="border-t border-border/70 p-6">
              <SheetClose asChild>
                <Button className="h-10 rounded-full">{t('legal.close')}</Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
