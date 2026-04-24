import { useParams, Link } from 'react-router-dom'
import { usePokemonDetail } from '../hooks/usePokemon'
import { useI18n } from '../contexts/LocaleContext'
import { POKEAPI_LANG_MAP } from '../utils/i18n'
import TypeBadge from '../components/TypeBadge'
import StatBar from '../components/StatBar'
import EvolutionChain from '../components/EvolutionChain'
import { TYPE_COLORS } from '../utils/typeColors'
import type { PokemonType } from '../types/pokemon'

export default function Detail() {
  const { idOrName } = useParams<{ idOrName: string }>()
  const { data: pokemon, isLoading, error } = usePokemonDetail(idOrName ?? '')
  const { t, pn, locale } = useI18n()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant text-body-lg">{t('loading')}</div>
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-on-surface-variant text-body-lg">{t('notFound')}</div>
        <Link to="/" className="text-primary underline">{t('backToPokedex')}</Link>
      </div>
    )
  }

  const primaryType = pokemon.types[0] as PokemonType
  const typeColor = TYPE_COLORS[primaryType] ?? '#6390F0'
  const padId = `#${String(pokemon.id).padStart(3, '0')}`
  const displayName = pn(pokemon.name)
  const langKey = POKEAPI_LANG_MAP[locale]
  const flavorText = pokemon.species?.flavorTexts[langKey] ?? pokemon.species?.flavorText ?? ''

  return (
    <main className="w-full max-w-[1280px] mx-auto md:px-gutter">
      {/* Mobile Hero */}
      <section
        className="md:hidden relative pt-20 pb-12 px-6 rounded-b-[48px] overflow-hidden shadow-md"
        style={{ backgroundColor: typeColor }}
      >
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-64 h-64 rounded-full bg-black/5 blur-2xl" />

        <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-between items-center">
          <Link to="/" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <span className="material-symbols-outlined icon-fill">arrow_back</span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-full flex justify-between items-end mb-4">
            <div>
              <h1 className="text-h1 text-white capitalize">{displayName}</h1>
              <span className="font-bold text-label-caps text-white/80">{padId}</span>
            </div>
            <div className="flex gap-2">
              {pokemon.types.map(t => (
                <span key={t} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm font-semibold text-chip-text text-white border border-white/30 capitalize">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="relative w-64 h-64 mt-4 mb-[-64px]">
            <img alt={displayName} src={pokemon.artworkUrl} className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Desktop back nav */}
      <div className="hidden md:block pt-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors py-2 group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-body-md font-medium">{t('backToPokedex')}</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-margin-mobile md:px-0">
        {/* Left: Hero (desktop) */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="sticky top-8 flex flex-col gap-6">
            <div className="rounded-3xl p-8 pt-16 flex flex-col items-center justify-center relative overflow-visible h-[400px] shadow-sm"
              style={{ backgroundColor: `${typeColor}22` }}>
              <div className="absolute top-6 left-6">
                <span className="text-h2 opacity-50" style={{ color: typeColor }}>{padId}</span>
              </div>
              <img alt={displayName} src={pokemon.artworkUrl}
                className="w-[120%] max-w-[450px] object-contain drop-shadow-2xl absolute bottom-12 z-10 hover:scale-105 transition-transform duration-500 ease-out" />
            </div>
            <div className="flex flex-col items-start gap-4">
              <h1 className="text-h1 text-on-surface capitalize">{displayName}</h1>
              <div className="flex gap-2">
                {pokemon.types.map(tp => (
                  <TypeBadge key={tp} type={tp} size="md" />
                ))}
              </div>
              {flavorText && (
                <p className="text-body-lg text-on-surface-variant max-w-md mt-2">{flavorText}</p>
              )}
              <Link
                to={`/compare?a=${encodeURIComponent(pokemon.name)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant text-on-surface font-semibold text-chip-text hover:bg-surface-variant transition-colors mt-2"
              >
                <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                {t('compare')}
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className={`lg:col-span-7 flex flex-col gap-6 ${!pokemon ? '' : 'mt-16 md:mt-0'}`}>
          {/* Mobile description */}
          {flavorText && (
            <div className="lg:hidden bg-surface-container rounded-xl p-4 shadow-sm mt-16">
              <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span className="font-bold text-label-caps">{t('description')}</span>
              </div>
              <p className="text-body-md text-on-surface">{flavorText}</p>
            </div>
          )}

          {/* Info cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-variant flex flex-col gap-2">
              <span className="font-bold text-label-caps text-on-surface-variant uppercase tracking-wider">{t('height')}</span>
              <span className="text-h2 text-on-surface">{pokemon.height} m</span>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-variant flex flex-col gap-2">
              <span className="font-bold text-label-caps text-on-surface-variant uppercase tracking-wider">{t('weight')}</span>
              <span className="text-h2 text-on-surface">{pokemon.weight} kg</span>
            </div>
            {pokemon.species && pokemon.species.eggGroups.length > 0 && (
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-variant flex flex-col gap-2 col-span-2 md:col-span-1">
                <span className="font-bold text-label-caps text-on-surface-variant uppercase tracking-wider">{t('eggGroups')}</span>
                <span className="text-body-lg font-medium text-on-surface capitalize">
                  {pokemon.species.eggGroups.join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Base Stats */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-surface-variant">
            <h2 className="text-h2 text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-surface-tint">bar_chart</span>
              {t('baseStats')}
            </h2>
            <div className="flex flex-col gap-4">
              {pokemon.stats.map(stat => (
                <StatBar key={stat.name} stat={stat} typeColor={primaryType} />
              ))}
            </div>
          </div>

          {/* Abilities */}
          {pokemon.abilities.length > 0 && (
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-surface-variant">
              <h2 className="text-h2 text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-surface-tint">psychology</span>
                {t('abilities')}
              </h2>
              <div className="flex flex-col gap-6">
                {pokemon.abilities.map(ability => (
                  <div key={ability.name} className="border-b border-surface-variant pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[16px] text-on-surface capitalize">{ability.name}</h3>
                      {ability.isHidden ? (
                        <span className="font-bold text-label-caps bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded-md">{t('hidden')}</span>
                      ) : (
                        <span className="font-bold text-label-caps bg-surface-container text-on-surface-variant px-2 py-1 rounded-md">{t('primary')}</span>
                      )}
                    </div>
                    {ability.description && (
                      <p className="text-body-md text-on-surface-variant">{ability.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evolution Chain */}
          {pokemon.evolutionChain && pokemon.evolutionChain.evolvesTo.length > 0 && (
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-surface-variant">
              <h2 className="text-h2 text-on-surface mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-surface-tint">hub</span>
                {t('evolutionChain')}
              </h2>
              <EvolutionChain root={pokemon.evolutionChain} currentId={pokemon.id} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
