import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === ''

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {isHome && <DesktopNav />}
      <Outlet />
      <BottomNav />
    </div>
  )
}

function DesktopNav() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm hidden md:flex justify-between items-center px-6 py-3">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-black tracking-tighter text-slate-900">
          Justdex
        </Link>
      </div>
      <nav className="flex items-center gap-4 uppercase text-[10px] font-semibold tracking-tight">
        <span className="text-slate-900 border-b-2 border-slate-900 pb-1">Pokedex</span>
        <span className="text-slate-400 pb-1">Teams</span>
        <span className="text-slate-400 pb-1">Regions</span>
      </nav>
    </header>
  )
}

function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-2xl bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex justify-around items-center h-16 px-4">
      <Link to="/" className="flex flex-col items-center justify-center text-slate-900">
        <span className="material-symbols-outlined icon-fill mb-1">capture</span>
        <span className="text-[10px] font-medium tracking-wide">Pokedex</span>
      </Link>
      <button className="flex flex-col items-center justify-center text-slate-400">
        <span className="material-symbols-outlined mb-1">groups</span>
        <span className="text-[10px] font-medium tracking-wide">Teams</span>
      </button>
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
