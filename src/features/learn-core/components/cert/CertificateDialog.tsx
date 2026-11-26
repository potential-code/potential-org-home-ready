import { Download } from 'lucide-react'
import { type ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { type CertificateData, CertificateView } from './CertificateView'

/** Opens the certificate in a print view so the learner can save it as PDF. */
function printNode(node: HTMLElement, title: string) {
  const w = window.open('', '_blank', 'width=1000,height=760')
  if (!w) return false
  w.document.title = title
  for (const el of document.head.querySelectorAll('style, link[rel="stylesheet"]'))
    w.document.head.appendChild(el.cloneNode(true))
  w.document.documentElement.dir = document.documentElement.dir
  w.document.documentElement.lang = document.documentElement.lang
  w.document.body.className = 'bg-white p-8'
  w.document.body.innerHTML = node.outerHTML
  w.setTimeout(() => w.print(), 400)
  return true
}

/** Certificate dialog (C9) with "Download" (print view). */
export function CertificateDialog({
  data,
  trigger,
}: {
  data: CertificateData
  trigger: ReactNode
}) {
  const { t } = useTranslation('learning')
  const ref = useRef<HTMLDivElement>(null)
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('cert.dialogTitle')}</DialogTitle>
          <DialogDescription>{t('cert.dialogBody')}</DialogDescription>
        </DialogHeader>
        <CertificateView ref={ref} {...data} />
        <Button
          className="justify-self-start rounded-full"
          onClick={() => {
            if (ref.current && printNode(ref.current, t('cert.dialogTitle')))
              toast.success(t('cert.printing'))
            else toast.error(t('cert.popupBlocked'))
          }}
        >
          <Download aria-hidden /> {t('cert.download')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
