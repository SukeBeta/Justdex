import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useMemo } from 'react'
import { fetchPokemonDetail } from '../api/pokeapi'
import type { PokemonListItem, PokemonType, SortOption } from '../types/pokemon'

export function usePokemonList() {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/pokemon-list.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: PokemonListItem[]) => {
        setAllPokemon(data)
        setLoading(false)
      })
      .catch((e: Error) => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  return { allPokemon, loading, error }
}

export function useFilteredPokemon(
  allPokemon: PokemonListItem[],
  search: string,
  typeFilter: PokemonType | null,
  genFilter: number | null,
  sort: SortOption,
) {
  return useMemo(() => {
    let result = allPokemon

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        p => p.name.includes(q) || p.id.toString() === q
      )
    }

    if (typeFilter) {
      result = result.filter(p => p.types.includes(typeFilter))
    }

    if (genFilter) {
      result = result.filter(p => p.generation === genFilter)
    }

    if (sort === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'id') {
      result = [...result].sort((a, b) => a.id - b.id)
    }

    return result
  }, [allPokemon, search, typeFilter, genFilter, sort])
}

export function usePokemonDetail(idOrName: string) {
  return useQuery({
    queryKey: ['pokemon-detail', idOrName],
    queryFn: () => fetchPokemonDetail(idOrName),
    enabled: !!idOrName,
  })
}
