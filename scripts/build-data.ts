const POKEAPI = 'https://pokeapi.co/api/v2'
const TOTAL_POKEMON = 1025

const GEN_RANGES: [number, number][] = [
  [1, 151], [152, 251], [252, 386], [387, 493],
  [494, 649], [650, 721], [722, 809], [810, 905], [906, 1025],
]

function getGen(id: number): number {
  for (let i = 0; i < GEN_RANGES.length; i++) {
    if (id >= GEN_RANGES[i][0] && id <= GEN_RANGES[i][1]) return i + 1
  }
  return 9
}

interface ListEntry {
  id: number
  name: string
  types: string[]
  generation: number
  spriteUrl: string
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 5000))
        continue
      }
      throw new Error(`HTTP ${res.status}`)
    } catch (e) {
      if (i === retries - 1) throw e
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw new Error('Max retries reached')
}

async function fetchBatch(ids: number[]): Promise<ListEntry[]> {
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await fetchWithRetry(`${POKEAPI}/pokemon/${id}`)
        const data = await res.json()
        const types = data.types
          .sort((a: { slot: number }, b: { slot: number }) => a.slot - b.slot)
          .map((t: { type: { name: string } }) => t.type.name)

        return {
          id: data.id,
          name: data.name,
          types,
          generation: getGen(data.id),
          spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
        }
      } catch (e) {
        console.error(`Failed to fetch pokemon ${id}:`, e)
        return null
      }
    })
  )
  return results.filter((r): r is ListEntry => r !== null)
}

async function main() {
  console.log(`Fetching ${TOTAL_POKEMON} Pokémon from PokeAPI...`)

  const allPokemon: ListEntry[] = []
  const batchSize = 50

  for (let start = 1; start <= TOTAL_POKEMON; start += batchSize) {
    const end = Math.min(start + batchSize - 1, TOTAL_POKEMON)
    const ids = Array.from({ length: end - start + 1 }, (_, i) => start + i)

    console.log(`  Fetching ${start}-${end}...`)
    const batch = await fetchBatch(ids)
    allPokemon.push(...batch)

    if (end < TOTAL_POKEMON) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  allPokemon.sort((a, b) => a.id - b.id)

  if (allPokemon.length < TOTAL_POKEMON) {
    console.error(`ERROR: Only fetched ${allPokemon.length}/${TOTAL_POKEMON} Pokémon. Aborting.`)
    process.exit(1)
  }

  const outPath = new URL('../public/data/pokemon-list.json', import.meta.url)
  const { writeFileSync } = await import('fs')
  const { fileURLToPath } = await import('url')
  writeFileSync(fileURLToPath(outPath), JSON.stringify(allPokemon))

  console.log(`Done! Wrote ${allPokemon.length} Pokémon to public/data/pokemon-list.json`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
