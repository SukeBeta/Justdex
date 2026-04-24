import { forwardRef } from 'react'
import type { PokemonListItem, PokemonType } from '../types/pokemon'
import type { TeamAnalysis } from '../utils/typeChart'
import { TYPE_COLORS, textColorForType } from '../utils/typeColors'

interface TeamCardProps {
  team: PokemonListItem[]
  analysis: TeamAnalysis | null
}

const TeamCard = forwardRef<HTMLDivElement, TeamCardProps>(({ team, analysis }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: 1200,
        height: 630,
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        padding: 48,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 300, height: 300, borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -60,
        width: 200, height: 200, borderRadius: '50%',
        background: 'rgba(255,255,255,0.02)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
            Justdex
          </span>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
            Team Builder
          </span>
        </div>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
          sukebeta.github.io/Justdex
        </span>
      </div>

      {/* Team Grid */}
      <div style={{ display: 'flex', gap: 16, flex: 1 }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const pokemon = team[i]
          if (!pokemon) {
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  border: '2px dashed rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 32, color: 'rgba(255,255,255,0.1)' }}>?</span>
              </div>
            )
          }

          const primaryColor = TYPE_COLORS[pokemon.types[0] as PokemonType] ?? '#666'

          return (
            <div
              key={pokemon.id}
              style={{
                flex: 1,
                borderRadius: 16,
                background: `linear-gradient(180deg, ${primaryColor}33 0%, ${primaryColor}11 100%)`,
                border: `1px solid ${primaryColor}44`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px 8px 16px',
                position: 'relative',
              }}
            >
              {/* Sprite */}
              <img
                src={pokemon.spriteUrl}
                alt={pokemon.name}
                crossOrigin="anonymous"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                  marginBottom: 8,
                }}
              />

              {/* Number */}
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.05em',
                marginBottom: 2,
              }}>
                #{String(pokemon.id).padStart(3, '0')}
              </span>

              {/* Name */}
              <span style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                textTransform: 'capitalize',
                textAlign: 'center',
                marginBottom: 8,
              }}>
                {pokemon.name}
              </span>

              {/* Type Badges */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                {pokemon.types.map(t => (
                  <span
                    key={t}
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '3px 8px',
                      borderRadius: 999,
                      backgroundColor: TYPE_COLORS[t as PokemonType] ?? '#666',
                      color: textColorForType(t as PokemonType),
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer: Type Analysis */}
      {analysis && (
        <div style={{
          display: 'flex',
          gap: 24,
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          {analysis.weaknesses.length > 0 && (
            <AnalysisRow label="Weak to" types={analysis.weaknesses} />
          )}
          {analysis.resistances.length > 0 && (
            <AnalysisRow label="Resists" types={analysis.resistances} />
          )}
          {analysis.immunities.length > 0 && (
            <AnalysisRow label="Immune" types={analysis.immunities} />
          )}
        </div>
      )}
    </div>
  )
})

TeamCard.displayName = 'TeamCard'

function AnalysisRow({ label, types }: { label: string; types: PokemonType[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: 3 }}>
        {types.map(t => (
          <span
            key={t}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: TYPE_COLORS[t],
              display: 'inline-block',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
            title={t}
          />
        ))}
      </div>
    </div>
  )
}

export default TeamCard
