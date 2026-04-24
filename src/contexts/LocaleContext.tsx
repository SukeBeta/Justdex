import { createContext, useContext } from 'react'
import { useLocale, usePokemonNames, getPokemonName, t as translate } from '../utils/i18n'
import type { Locale } from '../utils/i18n'

interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
  pn: (englishName: string) => string
}

const Ctx = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useLocale()
  const names = usePokemonNames()

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: (key: string) => translate(locale, key),
    pn: (englishName: string) => getPokemonName(names, englishName, locale),
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used within LocaleProvider')
  return ctx
}
