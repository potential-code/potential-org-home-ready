import { ListTree } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useLocalized } from '@/i18n'

/** Below lg the course menu opens in a sheet from the start side. */
export function CourseMenuSheet({
  position,
  children,
}: {
  position: string
  children: (close: () => void) => ReactNode
}) {
  const { t } = useTranslation('learning')
  const { lang } = useLocalized()
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-white lg:hidden">
          <span className="flex items-center gap-2">
            <ListTree aria-hidden /> {t('view.openMenu')}
          </span>
          <span className="truncate text-xs text-ink-soft">{position}</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side={lang === 'ar' ? 'right' : 'left'}
        className="w-[88vw] max-w-sm overflow-y-auto p-4"
      >
        <SheetTitle className="sr-only">{t('view.menu')}</SheetTitle>
        <div className="pt-8">{children(() => setOpen(false))}</div>
      </SheetContent>
    </Sheet>
  )
}
