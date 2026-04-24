import type { PokemonType } from '../types/pokemon'

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
}

export const TYPE_ICONS: Record<PokemonType, string> = {
  normal: 'circle',
  fire: 'local_fire_department',
  water: 'water_drop',
  electric: 'bolt',
  grass: 'eco',
  ice: 'ac_unit',
  fighting: 'sports_mma',
  poison: 'science',
  ground: 'landscape',
  flying: 'air',
  psychic: 'psychology',
  bug: 'bug_report',
  rock: 'diamond',
  ghost: 'ghost',
  dragon: 'whatshot',
  dark: 'dark_mode',
  steel: 'shield',
  fairy: 'auto_awesome',
}

export function textColorForType(type: PokemonType): string {
  const lightTextTypes: PokemonType[] = ['electric']
  return lightTextTypes.includes(type) ? '#1A1A2E' : '#FFFFFF'
}

export const ALL_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]
