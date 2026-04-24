import { POKEAPI_BASE, STAT_SHORT_NAMES, getArtworkUrl, getSpriteUrl } from '../utils/constants'
import type { PokemonDetail, PokemonStat, PokemonAbility, PokemonSpecies, EvolutionNode } from '../types/pokemon'

interface PokeAPIPokemon {
  id: number
  name: string
  height: number
  weight: number
  types: { slot: number; type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  abilities: { ability: { name: string; url: string }; is_hidden: boolean }[]
  species: { url: string }
}

export async function fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon/${idOrName}`)
  if (!res.ok) throw new Error(`Pokemon not found: ${idOrName}`)
  const data: PokeAPIPokemon = await res.json()

  const types = data.types
    .sort((a, b) => a.slot - b.slot)
    .map(t => t.type.name)

  const stats: PokemonStat[] = data.stats.map(s => ({
    name: s.stat.name,
    shortName: STAT_SHORT_NAMES[s.stat.name] ?? s.stat.name,
    value: s.base_stat,
  }))

  const abilities = await fetchAbilities(data.abilities)
  const species = await fetchSpecies(data.species.url)
  const evolutionChain = species ? await fetchEvolutionChain(data.species.url) : null

  return {
    id: data.id,
    name: data.name,
    types,
    height: data.height / 10,
    weight: data.weight / 10,
    stats,
    abilities,
    species,
    evolutionChain,
    spriteUrl: getSpriteUrl(data.id),
    artworkUrl: getArtworkUrl(data.id),
  }
}

async function fetchAbilities(
  abilities: PokeAPIPokemon['abilities']
): Promise<PokemonAbility[]> {
  const results = await Promise.all(
    abilities.map(async (a) => {
      try {
        const res = await fetch(a.ability.url)
        const data = await res.json()
        const entry = data.effect_entries?.find(
          (e: { language: { name: string } }) => e.language.name === 'en'
        )
        return {
          name: a.ability.name.replace(/-/g, ' '),
          isHidden: a.is_hidden,
          description: entry?.short_effect ?? '',
        }
      } catch {
        return {
          name: a.ability.name.replace(/-/g, ' '),
          isHidden: a.is_hidden,
          description: '',
        }
      }
    })
  )
  return results
}

const FLAVOR_LANGS = ['en', 'ja', 'zh-hans', 'ko', 'fr', 'de']

async function fetchSpecies(speciesUrl: string): Promise<PokemonSpecies | null> {
  try {
    const res = await fetch(speciesUrl)
    const data = await res.json()

    const flavorTexts: Record<string, string> = {}
    for (const entry of data.flavor_text_entries ?? []) {
      const lang: string = entry.language.name
      if (FLAVOR_LANGS.includes(lang) && !flavorTexts[lang]) {
        flavorTexts[lang] = entry.flavor_text?.replace(/\f|\n/g, ' ') ?? ''
      }
    }

    const genMatch = data.generation?.url?.match(/\/(\d+)\/$/)
    return {
      flavorText: flavorTexts['en'] ?? '',
      flavorTexts,
      eggGroups: data.egg_groups?.map((g: { name: string }) =>
        g.name.replace(/-/g, ' ')
      ) ?? [],
      generation: genMatch ? parseInt(genMatch[1]) : 1,
    }
  } catch {
    return null
  }
}

async function fetchEvolutionChain(speciesUrl: string): Promise<EvolutionNode | null> {
  try {
    const speciesRes = await fetch(speciesUrl)
    const speciesData = await speciesRes.json()
    const chainRes = await fetch(speciesData.evolution_chain.url)
    const chainData = await chainRes.json()
    return buildEvolutionTree(chainData.chain)
  } catch {
    return null
  }
}

interface ChainLink {
  species: { name: string; url: string }
  evolution_details: {
    trigger?: { name: string }
    min_level?: number | null
    item?: { name: string } | null
  }[]
  evolves_to: ChainLink[]
}

function buildEvolutionTree(chain: ChainLink): EvolutionNode {
  const idMatch = chain.species.url.match(/\/(\d+)\/$/)
  const id = idMatch ? parseInt(idMatch[1]) : 0
  const detail = chain.evolution_details[0]

  return {
    id,
    name: chain.species.name,
    spriteUrl: getArtworkUrl(id),
    trigger: detail?.trigger?.name ?? null,
    minLevel: detail?.min_level ?? null,
    evolvesTo: chain.evolves_to.map(child => buildEvolutionTree(child)),
  }
}
