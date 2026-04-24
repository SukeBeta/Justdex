import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  const isDetail = location.pathname.startsWith('/pokemon/')

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
  const isHome = pathname === '/' || pathname === ''
  const isTeam = pathname === '/team'

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm hidden md:flex justify-between items-center px-6 py-3">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-black tracking-tighter text-slate-900">
          Justdex
        </Link>
      </div>
      <nav className="flex items-center gap-4 uppercase text-[10px] font-semibold tracking-tight">
        <Link
          to="/"
          className={`pb-1 transition-colors ${isHome ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Pokedex
        </Link>
        <Link
          to="/team"
          className={`pb-1 transition-colors ${isTeam ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Teams
        </Link>
        <span className="text-slate-400 pb-1">Regions</span>
      </nav>
    </header>
  )
}

function BottomNav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/' || pathname === ''
  const isTeam = pathname === '/team'

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
      <button className="flex flex-col items-center justify-center text-slate-400">
        <span className="material-symbols-outlined mb-1">map</span>
        <span className="text-[10px] font-medium tracking-wide">Regions</span>
      </button>
      <button className="flex flex-col items-center justify-center text-slate-400">
        <span className="material-symbols-outlined mb-1">settings</span>
        <span className="text-[10px] font-medium tracking-wide">Settings</span>
      </button>
    </nav>
  )
}
