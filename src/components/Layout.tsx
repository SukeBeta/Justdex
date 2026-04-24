import { Outlet, Link, useLocation } from 'react-router-dom'
import { useI18n } from '../contexts/LocaleContext'
import { LOCALE_NAMES } from '../utils/i18n'
import type { Locale } from '../utils/i18n'

export default function Layout() {
  const { pathname } = useLocation()
  const isDetail = pathname.startsWith('/pokemon/')

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {!isDetail && <DesktopNav />}
      <Outlet />
      <BottomNav />
    </div>
  )
}

function DesktopNav() {
  const { pathname } = useLocation()
  const { locale, setLocale } = useI18n()
  const isHome = pathname === '/' || pathname === ''
  const isTeam = pathname === '/team'
  const isCompare = pathname === '/compare'

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm hidden md:flex justify-between items-center px-6 py-3">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-black tracking-tighter text-slate-900">
          Justdex
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-4 uppercase text-[10px] font-semibold tracking-tight">
          <Link to="/" className={`pb-1 transition-colors ${isHome ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Pokedex</Link>
          <Link to="/team" className={`pb-1 transition-colors ${isTeam ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Teams</Link>
          <Link to="/compare" className={`pb-1 transition-colors ${isCompare ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Compare</Link>
        </nav>
        <div className="h-4 w-px bg-outline-variant mx-1" />
        <LocaleSwitcher locale={locale} setLocale={setLocale} />
      </div>
    </header>
  )
}

function BottomNav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/' || pathname === ''
  const isTeam = pathname === '/team'
  const isCompare = pathname === '/compare'

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-2xl bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex justify-around items-center h-16 px-4">
      <Link to="/" className={`flex flex-col items-center justify-center ${isHome ? 'text-slate-900' : 'text-slate-400'}`}>
        <span className={`material-symbols-outlined mb-1 ${isHome ? 'icon-fill' : ''}`}>capture</span>
        <span className="text-[10px] font-medium tracking-wide">Pokedex</span>
      </Link>
      <Link to="/team" className={`flex flex-col items-center justify-center ${isTeam ? 'text-slate-900' : 'text-slate-400'}`}>
        <span className={`material-symbols-outlined mb-1 ${isTeam ? 'icon-fill' : ''}`}>groups</span>
        <span className="text-[10px] font-medium tracking-wide">Teams</span>
      </Link>
      <Link to="/compare" className={`flex flex-col items-center justify-center ${isCompare ? 'text-slate-900' : 'text-slate-400'}`}>
        <span className={`material-symbols-outlined mb-1 ${isCompare ? 'icon-fill' : ''}`}>compare_arrows</span>
        <span className="text-[10px] font-medium tracking-wide">Compare</span>
      </Link>
      <LocaleSwitcherMobile />
    </nav>
  )
}

function LocaleSwitcher({ locale, setLocale }: { locale: Locale; setLocale: (l: Locale) => void }) {
  return (
    <select
      value={locale}
      onChange={e => setLocale(e.target.value as Locale)}
      className="appearance-none bg-transparent text-[10px] font-semibold uppercase tracking-tight text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none border-none p-0"
    >
      {Object.entries(LOCALE_NAMES).map(([code, name]) => (
        <option key={code} value={code}>{name}</option>
      ))}
    </select>
  )
}

function LocaleSwitcherMobile() {
  const { locale, setLocale } = useI18n()
  return (
    <div className="flex flex-col items-center justify-center text-slate-400">
      <select
        value={locale}
        onChange={e => setLocale(e.target.value as Locale)}
        className="appearance-none bg-transparent text-[10px] font-medium tracking-wide text-slate-400 cursor-pointer focus:outline-none border-none p-0 w-12 text-center"
      >
        {Object.entries(LOCALE_NAMES).map(([code, name]) => (
          <option key={code} value={code}>{name}</option>
        ))}
      </select>
    </div>
  )
}
