import type { PokemonStat, PokemonType } from '../types/pokemon'
import { TYPE_COLORS } from '../utils/typeColors'

const MAX_STAT = 255

export default function StatBar({ stat, typeColor }: { stat: PokemonStat; typeColor: PokemonType }) {
  const pct = Math.round((stat.value / MAX_STAT) * 100)
  const color = TYPE_COLORS[typeColor] ?? '#6390F0'

  return (
    <div className="flex items-center gap-4">
      <span className="w-12 font-bold text-label-caps text-on-surface-variant text-right uppercase">
        {stat.shortName}
      </span>
      <span className="w-8 font-semibold text-chip-text text-on-surface text-right pr-3 border-r border-outline-variant/50">
        {stat.value}
      </span>
      <div className="flex-1 h-2.5 bg-surface-variant rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
