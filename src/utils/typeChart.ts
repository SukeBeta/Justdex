import type { PokemonType } from '../types/pokemon'
import { ALL_TYPES } from './typeColors'

// Defensive multiplier: TYPE_CHART[attacking][defending]
// 0 = immune, 0.5 = resists, 1 = neutral, 2 = weak
const E: Record<string, Record<string, number>> = {
  normal:   { rock: .5, ghost: 0, steel: .5 },
  fire:     { fire: .5, water: .5, grass: 2, ice: 2, bug: 2, rock: .5, dragon: .5, steel: 2 },
  water:    { fire: 2, water: .5, grass: .5, ground: 2, rock: 2, dragon: .5 },
  electric: { water: 2, electric: .5, grass: .5, ground: 0, flying: 2, dragon: .5 },
  grass:    { fire: .5, water: 2, grass: .5, poison: .5, ground: 2, flying: .5, bug: .5, rock: 2, dragon: .5, steel: .5 },
  ice:      { fire: .5, water: .5, grass: 2, ice: .5, ground: 2, flying: 2, dragon: 2, steel: .5 },
  fighting: { normal: 2, ice: 2, poison: .5, flying: .5, psychic: .5, bug: .5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: .5 },
  poison:   { grass: 2, poison: .5, ground: .5, rock: .5, ghost: .5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: .5, poison: 2, flying: 0, bug: .5, rock: 2, steel: 2 },
  flying:   { electric: .5, grass: 2, fighting: 2, bug: 2, rock: .5, steel: .5 },
  psychic:  { fighting: 2, poison: 2, psychic: .5, dark: 0, steel: .5 },
  bug:      { fire: .5, grass: 2, fighting: .5, poison: .5, flying: .5, psychic: 2, ghost: .5, dark: 2, steel: .5, fairy: .5 },
  rock:     { fire: 2, ice: 2, fighting: .5, ground: .5, flying: 2, bug: 2, steel: .5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: .5 },
  dragon:   { dragon: 2, steel: .5, fairy: 0 },
  dark:     { fighting: .5, psychic: 2, ghost: 2, dark: .5, fairy: .5 },
  steel:    { fire: .5, water: .5, electric: .5, ice: 2, rock: 2, steel: .5, fairy: 2 },
  fairy:    { fire: .5, fighting: 2, poison: .5, dragon: 2, dark: 2, steel: .5 },
}

function getEffectiveness(atkType: string, defType: string): number {
  return E[atkType]?.[defType] ?? 1
}

export function getDefensiveMultiplier(atkType: PokemonType, defTypes: string[]): number {
  let mult = 1
  for (const dt of defTypes) {
    mult *= getEffectiveness(atkType, dt)
  }
  return mult
}

export interface TeamAnalysis {
  weaknesses: PokemonType[]
  resistances: PokemonType[]
  immunities: PokemonType[]
  uncovered: PokemonType[]
}

export function analyzeTeam(teamTypes: string[][]): TeamAnalysis {
  const weakCount: Record<string, number> = {}
  const resistCount: Record<string, number> = {}
  const immuneCount: Record<string, number> = {}

  for (const atkType of ALL_TYPES) {
    for (const memberTypes of teamTypes) {
      const mult = getDefensiveMultiplier(atkType, memberTypes)
      if (mult >= 2) weakCount[atkType] = (weakCount[atkType] ?? 0) + 1
      if (mult > 0 && mult <= 0.5) resistCount[atkType] = (resistCount[atkType] ?? 0) + 1
      if (mult === 0) immuneCount[atkType] = (immuneCount[atkType] ?? 0) + 1
    }
  }

  const weaknesses: PokemonType[] = []
  const resistances: PokemonType[] = []
  const immunities: PokemonType[] = []
  const uncovered: PokemonType[] = []

  for (const t of ALL_TYPES) {
    const w = weakCount[t] ?? 0
    const r = resistCount[t] ?? 0
    const im = immuneCount[t] ?? 0

    if (im > 0) immunities.push(t)
    else if (r === 0 && w >= 2) weaknesses.push(t)
    else if (r >= 2 && w === 0) resistances.push(t)

    if (r === 0 && im === 0 && w === 0) uncovered.push(t)
  }

  return { weaknesses, resistances, immunities, uncovered }
}
