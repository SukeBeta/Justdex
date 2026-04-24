const POKEAPI = 'https://pokeapi.co/api/v2'
const TOTAL = 1025
const LANGS = ['ja', 'zh-hans', 'ko', 'fr', 'de']

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
      if (res.status === 429) { await new Promise(r => setTimeout(r, 5000)); continue }
      throw new Error(`HTTP ${res.status}`)
    } catch (e) {
      if (i === retries - 1) throw e
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw new Error('Max retries reached')
}

async function fetchNamesBatch(ids: number[]): Promise<Record<string, Record<string, string>>> {
  const result: Record<string, Record<string, string>> = {}

  await Promise.all(ids.map(async (id) => {
    try {
      const res = await fetchWithRetry(`${POKEAPI}/pokemon-species/${id}`)
      const data = await res.json()
      const englishName: string = data.name

      const names: Record<string, string> = {}
      for (const entry of data.names ?? []) {
        const lang: string = entry.language.name
        if (LANGS.includes(lang)) {
          names[lang] = entry.name
        }
      }

      if (Object.keys(names).length > 0) {
        result[englishName] = names
      }
    } catch (e) {
      console.error(`Failed to fetch species ${id}:`, e)
    }
  }))

  return result
}

async function main() {
  console.log(`Fetching localized names for ${TOTAL} Pokémon...`)

  const allNames: Record<string, Record<string, string>> = {}
  const batchSize = 50

  for (let start = 1; start <= TOTAL; start += batchSize) {
    const end = Math.min(start + batchSize - 1, TOTAL)
    const ids = Array.from({ length: end - start + 1 }, (_, i) => start + i)

    console.log(`  Fetching species ${start}-${end}...`)
    const batch = await fetchNamesBatch(ids)
    Object.assign(allNames, batch)

    if (end < TOTAL) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  const count = Object.keys(allNames).length
  if (count < TOTAL * 0.9) {
    console.error(`ERROR: Only got names for ${count}/${TOTAL}. Aborting.`)
    process.exit(1)
  }

  const outPath = new URL('../public/data/pokemon-names.json', import.meta.url)
  const { writeFileSync } = await import('fs')
  const { fileURLToPath } = await import('url')
  writeFileSync(fileURLToPath(outPath), JSON.stringify(allNames))

  console.log(`Done! Wrote ${count} localized name entries to public/data/pokemon-names.json`)
}

main().catch((e) => { console.error(e); process.exit(1) })
