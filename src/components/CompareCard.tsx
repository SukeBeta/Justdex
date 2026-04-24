import { forwardRef } from 'react'
import { RadarChartStatic } from './RadarChart'
import type { PokemonDetail, PokemonType } from '../types/pokemon'
import { TYPE_COLORS, textColorForType } from '../utils/typeColors'

interface CompareCardProps {
  a: PokemonDetail
  b: PokemonDetail
}

const CompareCard = forwardRef<HTMLDivElement, CompareCardProps>(({ a, b }, ref) => {
  const colorA = TYPE_COLORS[a.types[0] as PokemonType] ?? '#6390F0'
  const colorB = TYPE_COLORS[b.types[0] as PokemonType] ?? '#EE8130'
  const totalA = a.stats.reduce((s, v) => s + v.value, 0)
  const totalB = b.stats.reduce((s, v) => s + v.value, 0)

  return (
    <div
      ref={ref}
      style={{
        width: 1200, height: 630,
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
        fontFamily: 'Inter, sans-serif',
        display: 'flex', flexDirection: 'column',
        padding: 48, position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>Justdex</span>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Compare</span>
        </div>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
          sukebeta.github.io/Justdex
        </span>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flex: 1, gap: 32, alignItems: 'center' }}>
        {/* Left Pokémon */}
        <PokemonSide pokemon={a} color={colorA} total={totalA} />

        {/* VS + Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: '0 0 280px' }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em' }}>
            VS
          </span>
          <RadarChartStatic statsA={a.stats} statsB={b.stats} colorA={colorA} colorB={colorB} />
          <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
            <Legend color={colorA} label={a.name} />
            <Legend color={colorB} label={b.name} />
          </div>
        </div>

        {/* Right Pokémon */}
        <PokemonSide pokemon={b} color={colorB} total={totalB} />
      </div>
    </div>
  )
})

CompareCard.displayName = 'CompareCard'

function PokemonSide({ pokemon, color, total }: { pokemon: PokemonDetail; color: string; total: number }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      background: `linear-gradient(180deg, ${color}22 0%, ${color}08 100%)`,
      borderRadius: 20, padding: '24px 16px', border: `1px solid ${color}33`,
    }}>
      <img
        src={pokemon.artworkUrl} alt={pokemon.name} crossOrigin="anonymous"
        style={{ width: 140, height: 140, objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))' }}
      />
      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
        #{String(pokemon.id).padStart(3, '0')}
      </span>
      <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>
        {pokemon.name}
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {pokemon.types.map(t => (
          <span key={t} style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
            padding: '3px 10px', borderRadius: 999,
            backgroundColor: TYPE_COLORS[t as PokemonType] ?? '#666',
            color: textColorForType(t as PokemonType),
          }}>
            {t}
          </span>
        ))}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
        BST {total}
      </span>
      {/* Individual stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', marginTop: 4 }}>
        {pokemon.stats.map(s => (
          <div key={s.shortName} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', width: 32, textAlign: 'right' }}>
              {s.shortName}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', width: 28, textAlign: 'right' }}>
              {s.value}
            </span>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{
                height: '100%', borderRadius: 2, backgroundColor: color,
                width: `${Math.min((s.value / 200) * 100, 100)}%`,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, display: 'inline-block' }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{label}</span>
    </div>
  )
}

export default CompareCard
