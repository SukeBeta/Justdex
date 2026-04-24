export interface PokemonListItem {
  id: number
  name: string
  types: string[]
  generation: number
  spriteUrl: string
}

export interface PokemonDetail {
  id: number
  name: string
  types: string[]
  height: number
  weight: number
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  species: PokemonSpecies | null
  evolutionChain: EvolutionNode | null
  spriteUrl: string
  artworkUrl: string
}

export interface PokemonStat {
  name: string
  shortName: string
  value: number
}

export interface PokemonAbility {
  name: string
  isHidden: boolean
  description: string
}

export interface PokemonSpecies {
  flavorText: string
  flavorTexts: Record<string, string>
  eggGroups: string[]
  generation: number
}

export interface EvolutionNode {
  id: number
  name: string
  spriteUrl: string
  trigger: string | null
  minLevel: number | null
  evolvesTo: EvolutionNode[]
}

export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy'

export type SortOption = 'id' | 'name' | 'stats'
