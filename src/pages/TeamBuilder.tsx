import { useState, useRef, useCallback, useEffect } from 'react'
import { toPng } from 'html-to-image'
import { usePokemonList } from '../hooks/usePokemon'
import TypeBadge from '../components/TypeBadge'
import TeamCard from '../components/TeamCard'
import { analyzeTeam } from '../utils/typeChart'
import { TYPE_COLORS } from '../utils/typeColors'
import type { PokemonListItem, PokemonType } from '../types/pokemon'

const MAX_TEAM = 6
const STORAGE_KEY = 'justdex-team'

export default function TeamBuilder() {
  const { allPokemon, loading } = usePokemonList()
  const [team, setTeam] = useState<PokemonListItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return []
      const parsed = JSON.parse(saved)
      if (!Array.isArray(parsed)) return []
      return parsed.filter(
        (p: unknown): p is PokemonListItem =>
          typeof p === 'object' && p !== null &&
          'id' in p && 'name' in p && 'types' in p &&
          Array.isArray((p as PokemonListItem).types)
      )
    } catch {
      return []
    }
  })
  const [search, setSearch] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(team))
  }, [team])

  const addToTeam = useCallback((pokemon: PokemonListItem) => {
    setTeam(prev => {
      if (prev.length >= MAX_TEAM) return prev
      if (prev.some(p => p.id === pokemon.id)) return prev
      return [...prev, pokemon]
    })
    setSearch('')
    setShowPicker(false)
  }, [])

  const removeFromTeam = useCallback((id: number) => {
    setTeam(prev => prev.filter(p => p.id !== id))
  }, [])

  const clearTeam = useCallback(() => setTeam([]), [])

  const handleExport = useCallback(async () => {
    setShowShareCard(true)
    await new Promise(r => setTimeout(r, 100))
    if (!cardRef.current) return
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
      const link = document.createElement('a')
      link.download = 'justdex-team.png'
      link.href = url
      link.click()
    } catch (e) {
      console.error('Export failed:', e)
    }
  }, [])

  const handleShare = useCallback(async () => {
    setShowShareCard(true)
    await new Promise(r => setTimeout(r, 100))
    if (!cardRef.current) return
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
      const blob = await (await fetch(url)).blob()
      const file = new File([blob], 'justdex-team.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'My Pokémon Team — Justdex' })
      } else {
        const link = document.createElement('a')
        link.download = 'justdex-team.png'
        link.href = url
        link.click()
      }
    } catch (e) {
      console.error('Share failed:', e)
    }
  }, [])

  const filtered = search.length >= 2
    ? allPokemon.filter(p =>
        p.name.includes(search.toLowerCase()) || p.id.toString() === search
      ).slice(0, 20)
    : []

  const analysis = team.length > 0 ? analyzeTeam(team.map(p => p.types)) : null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant text-body-lg">Loading...</div>
      </div>
    )
  }

  return (
    <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-gutter pt-6 md:pt-24 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h1 text-on-surface">Team Builder</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Build your dream team and share it
          </p>
        </div>
        {team.length > 0 && (
          <button
            onClick={clearTeam}
            className="text-sm text-error hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Team Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: MAX_TEAM }).map((_, i) => {
          const pokemon = team[i]
          return (
            <div key={i} className="relative">
              {pokemon ? (
                <div className="bg-surface-container-lowest rounded-2xl p-4 pt-14 shadow-card border border-outline-variant/30 flex flex-col items-center relative group">
                  <button
                    onClick={() => removeFromTeam(pokemon.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-error/10 text-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                  <img
                    src={pokemon.spriteUrl}
                    alt={pokemon.name}
                    className="w-20 h-20 object-contain absolute -top-8 drop-shadow-md"
                  />
                  <span className="text-[10px] font-bold text-outline mt-1">
                    #{String(pokemon.id).padStart(3, '0')}
                  </span>
                  <span className="text-sm font-semibold text-on-surface capitalize truncate w-full text-center">
                    {pokemon.name}
                  </span>
                  <div className="flex gap-1 mt-1.5">
                    {pokemon.types.map(t => (
                      <TypeBadge key={t} type={t} />
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowPicker(true)}
                  className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-2 text-outline-variant hover:border-primary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[32px]">add</span>
                  <span className="text-xs font-medium">Add Pokémon</span>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Type Analysis */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <AnalysisCard
            title="Team Weaknesses"
            icon="warning"
            types={analysis.weaknesses}
            emptyText="No shared weaknesses"
            color="text-error"
          />
          <AnalysisCard
            title="Team Resistances"
            icon="shield"
            types={analysis.resistances}
            emptyText="No shared resistances"
            color="text-green-600"
          />
          <AnalysisCard
            title="Immunities"
            icon="block"
            types={analysis.immunities}
            emptyText="No immunities"
            color="text-surface-tint"
          />
        </div>
      )}

      {/* Share Buttons */}
      {team.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-container text-white font-semibold text-chip-text shadow-md hover:bg-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download Card
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-on-surface font-semibold text-chip-text hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share
          </button>
        </div>
      )}

      {/* Hidden Share Card (for export) */}
      {showShareCard && (
        <div className="fixed left-[-9999px] top-0">
          <TeamCard ref={cardRef} team={team} analysis={analysis} />
        </div>
      )}

      {/* Pokémon Picker Modal */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={() => setShowPicker(false)}
        >
          <div
            className="bg-surface-container-lowest w-full sm:w-[480px] sm:max-h-[80vh] max-h-[70vh] rounded-t-3xl sm:rounded-3xl p-6 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h2 text-on-surface">Add Pokémon</h2>
              <button onClick={() => setShowPicker(false)}>
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search by name or number..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
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
              {filtered.map(p => {
                const inTeam = team.some(t => t.id === p.id)
                return (
                  <button
                    key={p.id}
                    disabled={inTeam}
                    onClick={() => addToTeam(p)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                      inTeam
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-surface-variant cursor-pointer'
                    }`}
                  >
                    <img src={p.spriteUrl} alt={p.name} className="w-10 h-10 object-contain" />
                    <div className="flex-1 text-left">
                      <span className="text-sm font-semibold capitalize">{p.name}</span>
                      <span className="text-xs text-outline ml-2">#{String(p.id).padStart(3, '0')}</span>
                    </div>
                    <div className="flex gap-1">
                      {p.types.map(t => (
                        <span
                          key={t}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: TYPE_COLORS[t as PokemonType] }}
                        />
                      ))}
                    </div>
                    {inTeam && (
                      <span className="material-symbols-outlined text-[16px] text-outline">check</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function AnalysisCard({
  title,
  icon,
  types,
  emptyText,
  color,
}: {
  title: string
  icon: string
  types: PokemonType[]
  emptyText: string
  color: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30">
      <div className={`flex items-center gap-2 mb-3 ${color}`}>
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        <span className="font-bold text-label-caps uppercase tracking-wider">{title}</span>
      </div>
      {types.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {types.map(t => <TypeBadge key={t} type={t} />)}
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">{emptyText}</p>
      )}
    </div>
  )
}
