
interface TopBarProps {
  user: { firstName: string; lastName: string; role: string } | null
  onLogout: () => void
  onToggleSidebar: () => void
}

export function TopBar({ user, onLogout, onToggleSidebar }: TopBarProps) {
  return (
    <header className="h-12 navy-gradient flex items-center justify-between px-3 md:px-5 flex-shrink-0 z-30 shadow-lg">
      <div className="flex items-center gap-2">
        <button onClick={onToggleSidebar} className="lg:hidden text-white p-1 hover:bg-white/10 rounded" aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="w-7 h-7 gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-navy font-black text-xs">B</span>
        </div>
        <span className="text-white font-bold text-sm hidden sm:inline">Britishce44</span>
        <span className="text-champagne/60 text-[10px] hidden md:inline">| The First British Center · Taiz</span>
      </div>
      <div className="flex items-center gap-2">
        {user && (
          <>
            <span className="text-white/70 text-[10px] hidden md:inline px-2 py-0.5 rounded-full bg-white/10">
              {user.role.toUpperCase()}
            </span>
            <span className="text-white text-xs font-medium hidden sm:inline">
              {user.firstName} {user.lastName}
            </span>
            <button className="text-white/60 hover:text-gold text-xs px-2 py-1 rounded-full border border-white/20 hover:border-gold/50 transition"
              title="Notifications">🔔</button>
            <button onClick={onLogout}
              className="text-white/60 hover:text-red-400 text-xs px-2 py-1 rounded-full border border-white/20 hover:border-red-400/50 transition">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  )
}
