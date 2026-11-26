import { Printer } from 'lucide-react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PrintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
}

// While a report is open, printing shows only the report copy (the "PDF" of the brief).
const PRINT_CSS =
  '@media print { body > :not([data-report-print]) { display: none !important; } body > [data-report-print] { display: block !important; } }'

/** Report preview with "Print or save as PDF". The print copy is a body-level portal. */
export function PrintDialog({ open, onOpenChange, title, children }: PrintDialogProps) {
  const { t } = useTranslation('leadership')
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{t('reports.printHint')}</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl border border-border/70 bg-white p-4 shadow-md sm:p-6">
          {children}
        </div>
        <DialogFooter>
          <Button className="rounded-full" onClick={() => window.print()}>
            <Printer aria-hidden />
            {t('reports.print')}
          </Button>
        </DialogFooter>
      </DialogContent>
      {open &&
        createPortal(
          <div data-report-print className="hidden bg-white p-8 text-ink">
            <style>{PRINT_CSS}</style>
            {children}
          </div>,
          document.body,
        )}
    </Dialog>
  )
}
