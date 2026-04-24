import { useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { usePokemonList, usePokemonDetail } from '../hooks/usePokemon'
import RadarChart from '../components/RadarChart'
import CompareCard from '../components/CompareCard'
import TypeBadge from '../components/TypeBadge'
import { TYPE_COLORS } from '../utils/typeColors'
import { getDefensiveMultiplier } from '../utils/typeChart'
import { ALL_TYPES } from '../utils/typeColors'
import type { PokemonListItem, PokemonType } from '../types/pokemon'

export default function Compare() {
  const [searchParams] = useSearchParams()
  const { allPokemon, loading: listLoading } = usePokemonList()
  const [pickA, setPickA] = useState<string | null>(searchParams.get('a'))
  const [pickB, setPickB] = useState<string | null>(searchParams.get('b'))
  const [pickerSlot, setPickerSlot] = useState<'a' | 'b' | null>(null)
  const [search, setSearch] = useState('')
  const [showShareCard, setShowShareCard] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const { data: detailA, isLoading: loadingA } = usePokemonDetail(pickA ?? '')
  const { data: detailB, isLoading: loadingB } = usePokemonDetail(pickB ?? '')

  const selectPokemon = useCallback((pokemon: PokemonListItem) => {
    if (pickerSlot === 'a') setPickA(pokemon.name)
    else setPickB(pokemon.name)
    setPickerSlot(null)
    setSearch('')
  }, [pickerSlot])

  const handleExport = useCallback(async () => {
    if (!detailA || !detailB) return
    setShowShareCard(true)
    await new Promise(r => setTimeout(r, 300))
    if (!cardRef.current) return
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
      const blob = await (await fetch(url)).blob()
      const file = new File([blob], 'justdex-compare.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${detailA.name} vs ${detailB.name} — Justdex` })
      } else {
        const link = document.createElement('a')
        link.download = 'justdex-compare.png'
        link.href = url
        link.click()
      }
    } catch (e) {
      console.error('Export failed:', e)
    }
  }, [detailA, detailB])

  const filtered = search.length >= 2
    ? allPokemon.filter(p => p.name.includes(search.toLowerCase()) || p.id.toString() === search).slice(0, 20)
    : []

  if (listLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant text-body-lg">Loading...</div>
      </div>
    )
  }

  const colorA = detailA ? (TYPE_COLORS[detailA.types[0] as PokemonType] ?? '#6390F0') : '#6390F0'
  const colorB = detailB ? (TYPE_COLORS[detailB.types[0] as PokemonType] ?? '#EE8130') : '#EE8130'

  return (
    <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-gutter pt-6 md:pt-24 pb-24">
      <h1 className="text-h1 text-on-surface mb-2">Compare</h1>
      <p className="text-body-md text-on-surface-variant mb-8">Pick two Pokémon to compare stats and matchups</p>

      {/* Selection Slots */}
      <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
        <SlotButton
          pokemon={detailA}
          loading={loadingA}
          color={colorA}
          onPick={() => { setPickerSlot('a'); setSearch('') }}
          label="Pick first"
        />
        <SlotButton
          pokemon={detailB}
          loading={loadingB}
          color={colorB}
          onPick={() => { setPickerSlot('b'); setSearch('') }}
          label="Pick second"
        />
      </div>

      {/* Comparison Content */}
      {detailA && detailB && (
        <>
          {/* Radar Chart */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/30 mb-6">
            <h2 className="text-h2 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-surface-tint">bar_chart</span>
              Stats Comparison
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <RadarChart
                  statsA={detailA.stats} statsB={detailB.stats}
                  colorA={colorA} colorB={colorB}
                  labelA={detailA.name} labelB={detailB.name}
                />
              </div>
              {/* Side-by-side stat bars */}
              <div className="flex-1 w-full space-y-3">
                {detailA.stats.map((statA, i) => {
                  const statB = detailB.stats[i]
                  const winner = statA.value > statB.value ? 'a' : statB.value > statA.value ? 'b' : null
                  return (
                    <div key={statA.shortName} className="flex items-center gap-2">
                      <span className={`w-8 text-right text-xs font-bold ${winner === 'a' ? '' : 'text-on-surface-variant'}`}
                        style={winner === 'a' ? { color: colorA } : undefined}>
                        {statA.value}
                      </span>
                      <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden flex flex-row-reverse">
                        <div className="h-full rounded-full" style={{ width: `${Math.min((statA.value / 200) * 100, 100)}%`, backgroundColor: colorA }} />
                      </div>
                      <span className="w-10 text-center text-[10px] font-bold text-on-surface-variant uppercase">
                        {statA.shortName}
                      </span>
                      <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.min((statB.value / 200) * 100, 100)}%`, backgroundColor: colorB }} />
                      </div>
                      <span className={`w-8 text-left text-xs font-bold ${winner === 'b' ? '' : 'text-on-surface-variant'}`}
                        style={winner === 'b' ? { color: colorB } : undefined}>
                        {statB.value}
                      </span>
                    </div>
                  )
                })}
                {/* Total */}
                <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/30">
                  <span className="w-8 text-right text-xs font-bold" style={{ color: colorA }}>
                    {detailA.stats.reduce((s, v) => s + v.value, 0)}
                  </span>
                  <div className="flex-1" />
                  <span className="w-10 text-center text-[10px] font-bold text-on-surface uppercase">Total</span>
                  <div className="flex-1" />
                  <span className="w-8 text-left text-xs font-bold" style={{ color: colorB }}>
                    {detailB.stats.reduce((s, v) => s + v.value, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Type Matchup */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/30 mb-6">
            <h2 className="text-h2 text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-surface-tint">swap_horiz</span>
              Type Matchup
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MatchupPanel attacker={detailA} defender={detailB} color={colorA} />
              <MatchupPanel attacker={detailB} defender={detailA} color={colorB} />
            </div>
          </div>

          {/* Physical */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <InfoCompare label="Height" valA={`${detailA.height} m`} valB={`${detailB.height} m`} />
            <InfoCompare label="Weight" valA={`${detailA.weight} kg`} valB={`${detailB.weight} kg`} />
          </div>

          {/* Share */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-container text-white font-semibold text-chip-text shadow-md hover:bg-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share Comparison
            </button>
          </div>

          {showShareCard && (
            <div className="fixed left-[-9999px] top-0">
              <CompareCard ref={cardRef} a={detailA} b={detailB} />
            </div>
          )}
        </>
      )}

      {/* Picker Modal */}
      {pickerSlot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={() => setPickerSlot(null)}>
          <div className="bg-surface-container-lowest w-full sm:w-[480px] sm:max-h-[80vh] max-h-[70vh] rounded-t-3xl sm:rounded-3xl p-6 flex flex-col"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h2 text-on-surface">Choose Pokémon</h2>
              <button onClick={() => setPickerSlot(null)}>
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
              <input
                type="text" placeholder="Search by name or number..." value={search}
                onChange={e => setSearch(e.target.value)} autoFocus
                className="w-full h-10 pl-10 pr-4 bg-surface-container border border-outline-variant rounded-full text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-[#ADB5BD]"
              />
            </div>
            <div className="overflow-y-auto flex-1 -mx-2">
              {filtered.length === 0 && search.length >= 2 && (
                <p className="text-center text-on-surface-variant py-8">No results</p>
              )}
              {search.length < 2 && (
                <p className="text-center text-on-surface-variant py-8">Type at least 2 characters</p>
              )}
              {filtered.map(p => (
                <button key={p.id} onClick={() => selectPokemon(p)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-variant cursor-pointer transition-colors">
                  <img src={p.spriteUrl} alt={p.name} className="w-10 h-10 object-contain" />
                  <div className="flex-1 text-left">
                    <span className="text-sm font-semibold capitalize">{p.name}</span>
                    <span className="text-xs text-outline ml-2">#{String(p.id).padStart(3, '0')}</span>
                  </div>
                  <div className="flex gap-1">
                    {p.types.map(t => (
                      <span key={t} className="w-3 h-3 rounded-full" style={{ backgroundColor: TYPE_COLORS[t as PokemonType] }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function SlotButton({ pokemon, loading, color, onPick, label }: {
  pokemon: { name: string; id: number; types: string[]; artworkUrl: string } | undefined
  loading: boolean; color: string; onPick: () => void; label: string
}) {
  if (loading) {
    return <div className="h-48 rounded-2xl bg-surface-variant animate-pulse" />
  }

  if (!pokemon) {
    return (
      <button onClick={onPick}
        className="h-48 rounded-2xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-2 text-outline-variant hover:border-primary hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-[40px]">add_circle_outline</span>
        <span className="text-sm font-medium">{label}</span>
      </button>
    )
  }

  return (
    <button onClick={onPick}
      className="relative rounded-2xl p-4 pt-6 flex flex-col items-center gap-2 shadow-card border transition-shadow hover:shadow-card-hover"
      style={{ backgroundColor: `${color}11`, borderColor: `${color}33` }}>
      <img src={pokemon.artworkUrl} alt={pokemon.name}
        className="w-24 h-24 object-contain drop-shadow-md" />
      <span className="text-[10px] font-bold text-outline">#{String(pokemon.id).padStart(3, '0')}</span>
      <span className="text-lg font-bold text-on-surface capitalize">{pokemon.name}</span>
      <div className="flex gap-1.5">
        {pokemon.types.map(t => <TypeBadge key={t} type={t} />)}
      </div>
      <span className="absolute top-2 right-2 material-symbols-outlined text-[16px] text-outline-variant">edit</span>
    </button>
  )
}

function MatchupPanel({ attacker, defender, color }: {
  attacker: { name: string; types: string[] }; defender: { types: string[] }; color: string
}) {
  const superEffective: PokemonType[] = []
  const notVeryEffective: PokemonType[] = []
  const immune: PokemonType[] = []

  for (const atkType of ALL_TYPES) {
    if (!attacker.types.includes(atkType)) continue
    const mult = getDefensiveMultiplier(atkType, defender.types)
    if (mult >= 2) superEffective.push(atkType)
    else if (mult > 0 && mult < 1) notVeryEffective.push(atkType)
    else if (mult === 0) immune.push(atkType)
  }

  return (
    <div>
      <p className="text-sm font-semibold mb-3 capitalize" style={{ color }}>
        {attacker.name}'s STAB moves vs opponent
      </p>
      {superEffective.length > 0 && (
        <div className="mb-2">
          <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Super effective</span>
          <div className="flex gap-1.5 mt-1">
            {superEffective.map(t => <TypeBadge key={t} type={t} />)}
          </div>
        </div>
      )}
      {notVeryEffective.length > 0 && (
        <div className="mb-2">
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Not very effective</span>
          <div className="flex gap-1.5 mt-1">
            {notVeryEffective.map(t => <TypeBadge key={t} type={t} />)}
          </div>
        </div>
      )}
      {immune.length > 0 && (
        <div className="mb-2">
          <span className="text-[10px] font-bold text-error uppercase tracking-wider">No effect</span>
          <div className="flex gap-1.5 mt-1">
            {immune.map(t => <TypeBadge key={t} type={t} />)}
          </div>
        </div>
      )}
      {superEffective.length === 0 && notVeryEffective.length === 0 && immune.length === 0 && (
        <p className="text-sm text-on-surface-variant">Neutral matchup</p>
      )}
    </div>
  )
}

function InfoCompare({ label, valA, valB }: { label: string; valA: string; valB: string }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30">
      <span className="font-bold text-label-caps text-on-surface-variant uppercase tracking-wider">{label}</span>
      <div className="flex justify-between mt-2">
        <span className="text-h2 text-on-surface">{valA}</span>
        <span className="text-h2 text-on-surface">{valB}</span>
      </div>
    </div>
  )
}
