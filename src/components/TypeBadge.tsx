import type { PokemonType } from '../types/pokemon'
import { TYPE_COLORS, textColorForType } from '../utils/typeColors'

export default function TypeBadge({ type, size = 'sm' }: { type: string; size?: 'sm' | 'md' }) {
  const color = TYPE_COLORS[type as PokemonType] ?? '#A8A77A'
  const textColor = textColorForType(type as PokemonType)

  if (size === 'md') {
    return (
      <span
        className="px-4 py-2 rounded-full font-semibold text-chip-text shadow-sm inline-flex items-center gap-1"
        style={{ backgroundColor: color, color: textColor }}
      >
        {type}
      </span>
    )
  }

  return (
    <span
      className="px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider"
      style={{ backgroundColor: color, color: textColor }}
    >
      {type}
    </span>
  )
}
