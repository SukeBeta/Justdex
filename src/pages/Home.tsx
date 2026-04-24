import { useState, useCallback } from 'react'
import PokemonCard from '../components/PokemonCard'
import TypeBadge from '../components/TypeBadge'
import { usePokemonList, useFilteredPokemon } from '../hooks/usePokemon'
import { useI18n } from '../contexts/LocaleContext'
import { ALL_TYPES } from '../utils/typeColors'
import { GENERATION_NAMES } from '../utils/constants'
import type { PokemonType, SortOption } from '../types/pokemon'

const PAGE_SIZE = 40

export default function Home() {
  const { t } = useI18n()
  const { allPokemon, loading, error } = usePokemonList()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null)
  const [genFilter, setGenFilter] = useState<number | null>(null)
  const [sort, setSort] = useState<SortOption>('id')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useFilteredPokemon(allPokemon, search, typeFilter, genFilter, sort)
  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const loadMore = useCallback(() => {
    setVisibleCount(c => c + PAGE_SIZE)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant text-body-lg">{t('loading')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-error text-body-lg">{t('loadError')}: {error}</div>
      </div>
    )
  }

  return (
    <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-gutter pt-6 md:pt-24">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-black tracking-tighter">Justdex</h1>
        <div className="flex items-center gap-3">
          <button
            className="text-slate-900"
            onClick={() => {
              const el = document.getElementById('search-input')
              el?.focus()
            }}
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          <span className="material-symbols-outlined text-slate-400">tune</span>
        </div>
      </div>

      {/* Search - Desktop */}
      <div className="hidden md:block mb-6">
        <div className="relative max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
            search
          </span>
          <input
            id="search-input-desktop"
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE) }}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-full text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-card placeholder:text-[#ADB5BD]"
          />
        </div>
      </div>

      {/* Search - Mobile (hidden until search icon tapped) */}
      <input
        id="search-input"
        type="text"
        placeholder={t('search')}
        value={search}
        onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE) }}
        className="md:hidden w-full h-10 px-4 mb-4 bg-surface-container-lowest border border-outline-variant rounded-full text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-card placeholder:text-[#ADB5BD]"
      />

      {/* Filters */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Type Chips */}
        <div className="flex overflow-x-auto gap-2 no-scrollbar -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0 md:flex-wrap">
          <button
            onClick={() => { setTypeFilter(null); setVisibleCount(PAGE_SIZE) }}
            className={`px-4 py-2 rounded-full font-semibold text-chip-text whitespace-nowrap transition-colors ${
              !typeFilter
                ? 'bg-primary-container text-white'
                : 'border border-outline text-on-surface hover:bg-surface-variant'
            }`}
          >
            {t('allTypes')}
          </button>
          {ALL_TYPES.map(t => (
            <button
              key={t}
              onClick={() => { setTypeFilter(typeFilter === t ? null : t); setVisibleCount(PAGE_SIZE) }}
              className="whitespace-nowrap"
            >
              <TypeBadge type={t} size={typeFilter === t ? 'md' : 'sm'} />
            </button>
          ))}
        </div>

        {/* Gen & Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="relative">
            <select
              value={genFilter ?? 0}
              onChange={e => { setGenFilter(Number(e.target.value) || null); setVisibleCount(PAGE_SIZE) }}
              className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg pl-4 pr-10 py-2 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
            >
              <option value={0}>{t('allGens')}</option>
              {GENERATION_NAMES.map((name, i) => (
                <option key={i} value={i + 1}>{name}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
              expand_more
            </span>
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg pl-4 pr-10 py-2 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
            >
              <option value="id">{t('sortNumber')}</option>
              <option value="name">{t('sortName')}</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
              sort
            </span>
          </div>
        </div>
      </section>

      {/* Results count */}
      <p className="text-on-surface-variant text-sm mb-4">
        {filtered.length} {t('found')}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-gutter gap-y-14 mt-8">
        {visible.map(p => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={loadMore}
            className="px-8 py-3 rounded-full bg-primary-container text-white font-semibold text-chip-text shadow-md hover:bg-primary transition-colors"
          >
            {t('loadMore')}
          </button>
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-20 text-on-surface-variant text-body-lg">
          {t('noResults')}
        </div>
      )}
    </main>
  )
}
