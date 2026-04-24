export const POKEAPI_BASE = 'https://pokeapi.co/api/v2'

export const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export function getArtworkUrl(id: number): string {
  return `${SPRITE_BASE}/other/official-artwork/${id}.png`
}

export function getSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/${id}.png`
}

export const GENERATION_RANGES: [number, number][] = [
  [1, 151],
  [152, 251],
  [252, 386],
  [387, 493],
  [494, 649],
  [650, 721],
  [722, 809],
  [810, 905],
  [906, 1025],
]

export const GENERATION_NAMES = [
  'Gen I (Kanto)',
  'Gen II (Johto)',
  'Gen III (Hoenn)',
  'Gen IV (Sinnoh)',
  'Gen V (Unova)',
  'Gen VI (Kalos)',
  'Gen VII (Alola)',
  'Gen VIII (Galar)',
  'Gen IX (Paldea)',
]

export function getGeneration(id: number): number {
  for (let i = 0; i < GENERATION_RANGES.length; i++) {
    if (id >= GENERATION_RANGES[i][0] && id <= GENERATION_RANGES[i][1]) {
      return i + 1
    }
  }
  return 9
}

export const STAT_SHORT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SATK',
  'special-defense': 'SDEF',
  speed: 'SPD',
}
