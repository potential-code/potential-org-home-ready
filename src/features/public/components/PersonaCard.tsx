import type { Persona } from '@shared/types'
import { ArrowRight } from 'lucide-react'
import { Avatar } from '@/components/shared/Avatar'
import { useLocalized } from '@/i18n'

/** Demo profile card: one click signs in as this persona and opens their home. Shows the C16 username. */
export function PersonaCard({ persona, onSelect }: { persona: Persona; onSelect: () => void }) {
  const { l } = useLocalized()
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group card card-hover flex w-full items-center gap-3 p-3 text-start hover:border-brand/40"
    >
      <Avatar src={persona.image} name={l(persona.name)} size={44} className="shadow-sm" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-bold text-ink">{l(persona.name)}</span>
        <span className="block truncate text-sm text-ink-soft">{l(persona.title)}</span>
      </span>
      <span className="hidden shrink-0 rounded-full bg-tint-100 px-2.5 py-1 text-xs font-semibold text-brand-deep sm:inline">
        {persona.username}
      </span>
      <ArrowRight
        className="size-4 shrink-0 text-brand opacity-60 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 rtl-mirror"
        aria-hidden
      />
    </button>
  )
}
