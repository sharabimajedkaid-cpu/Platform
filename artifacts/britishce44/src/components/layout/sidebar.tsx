import { PageKey } from './dashboard-layout'
import { useMaintenanceMode } from '../maintenance/maintenance-provider'

interface NavItem { page: PageKey; icon: string; label: string; color?: string }
interface SidebarProps {
  userRole: string; currentPage: PageKey; onNavigate: (page: PageKey) => void
  isOpen: boolean; onClose: () => void
}

const adminItems: NavItem[] = [
  { page: 'dashboard', icon: '🏠', label: 'Dashboard', color: 'from-indigo-500 to-indigo-600' },
  { page: 'classrooms', icon: '🚪', label: 'Classrooms (240)', color: 'from-violet-500 to-violet-600' },
  { page: 'users', icon: '👥', label: 'Manage Users', color: 'from-blue-500 to-blue-600' },
  { page: 'ce4messenger', icon: '💬', label: 'CE4 Messenger', color: 'from-emerald-500 to-emerald-600' },
  { page: 'examsystem', icon: '📝', label: 'Exam System (100)', color: 'from-amber-500 to-amber-600' },
  { page: 'placementtest', icon: '🎯', label: 'Placement Test', color: 'from-orange-500 to-orange-600' },
  { page: 'teachereval', icon: '⭐', label: 'AI Teacher Eval', color: 'from-yellow-500 to-yellow-600' },
  { page: 'dailyperf', icon: '📋', label: 'Daily Performance', color: 'from-cyan-500 to-cyan-600' },
  { page: 'automessaging', icon: '🤖', label: 'Auto-Messaging AI', color: 'from-sky-500 to-sky-600' },
  { page: 'marketing', icon: '📢', label: 'Marketing Suite', color: 'from-pink-500 to-pink-600' },
  { page: 'videoeditor', icon: '🎬', label: 'AI Video Editor', color: 'from-rose-500 to-rose-600' },
  { page: 'reports', icon: '📊', label: 'Triple Reports', color: 'from-teal-500 to-teal-600' },
  { page: 'anticheat', icon: '🛡️', label: 'Anti-Cheat Monitor', color: 'from-red-500 to-red-600' },
  { page: 'homework', icon: '📄', label: 'Homework Dropbox', color: 'from-lime-500 to-lime-600' },
  { page: 'videoarchive', icon: '🎞️', label: 'Video Archive', color: 'from-fuchsia-500 to-fuchsia-600' },
  { page: 'liveanalytics', icon: '📈', label: 'Live Analytics', color: 'from-green-500 to-green-600' },
  { page: 'academicroom', icon: '🏛️', label: 'Academic Mgmt Room', color: 'from-amber-600 to-yellow-600' },
  { page: 'aidev', icon: '🧠', label: 'AI Dev Assistant', color: 'from-purple-500 to-purple-600' },
  { page: 'settings', icon: '⚙️', label: 'Platform Settings', color: 'from-gray-500 to-gray-600' },
]

const teacherItems: NavItem[] = [
  { page: 'dashboard', icon: '🏠', label: 'Dashboard', color: 'from-indigo-500 to-indigo-600' },
  { page: 'classrooms', icon: '🚪', label: 'My Classrooms', color: 'from-violet-500 to-violet-600' },
  { page: 'dailyperf', icon: '📋', label: 'My Performance', color: 'from-cyan-500 to-cyan-600' },
  { page: 'reports', icon: '📊', label: 'My Reports', color: 'from-teal-500 to-teal-600' },
  { page: 'homework', icon: '📄', label: 'Homework Dropbox', color: 'from-lime-500 to-lime-600' },
  { page: 'ce4messenger', icon: '💬', label: 'CE4 Messenger', color: 'from-emerald-500 to-emerald-600' },
  { page: 'videoarchive', icon: '🎞️', label: 'Video Archive', color: 'from-fuchsia-500 to-fuchsia-600' },
]

const studentItems: NavItem[] = [
  { page: 'dashboard', icon: '🏠', label: 'My Dashboard', color: 'from-indigo-500 to-indigo-600' },
  { page: 'classrooms', icon: '🚪', label: 'Classrooms', color: 'from-violet-500 to-violet-600' },
  { page: 'examsystem', icon: '📝', label: 'My Exams', color: 'from-amber-500 to-amber-600' },
  { page: 'placementtest', icon: '🎯', label: 'Placement Test', color: 'from-orange-500 to-orange-600' },
  { page: 'homework', icon: '📄', label: 'Homework Dropbox', color: 'from-lime-500 to-lime-600' },
  { page: 'ce4messenger', icon: '💬', label: 'CE4 Messenger', color: 'from-emerald-500 to-emerald-600' },
]

const SECTION_DIVIDERS: Partial<Record<PageKey, string>> = {
  examsystem: 'Academic Tools',
  automessaging: 'AI & Marketing',
  reports: 'Analytics & Reports',
  academicroom: 'Management',
  aidev: 'Platform Admin',
}

export function Sidebar({ userRole, currentPage, onNavigate, isOpen, onClose }: SidebarProps) {
  const items = userRole === 'admin' || userRole === 'supervisor' ? adminItems
    : userRole === 'teacher' ? teacherItems
    : studentItems

  const { isMaintenanceMode, setShowDesignKit, showDesignKit } = useMaintenanceMode()
  const isAdmin = userRole === 'admin' || userRole === 'supervisor'

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        w-64 flex-shrink-0 flex flex-col z-20 transition-transform duration-300
        bg-[#060b18] border-r border-white/5
        fixed lg:relative h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-2xl shadow-black/50
      `}>

        {/* Brand header */}
        <div className="p-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-none">Britishce44</p>
              <p className="text-[9px] text-indigo-300/50 mt-0.5">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto custom-scroll space-y-0.5">
          {items.map(item => {
            const divider = SECTION_DIVIDERS[item.page]
            const isActive = currentPage === item.page
            return (
              <div key={item.page}>
                {divider && (
                  <div className="px-3 pt-4 pb-1.5">
                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{divider}</p>
                  </div>
                )}
                <button
                  onClick={() => { onNavigate(item.page); onClose() }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group
                    ${isActive
                      ? 'bg-gradient-to-r from-indigo-600/70 to-violet-600/40 text-white shadow-lg shadow-indigo-500/10'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition
                    ${isActive
                      ? `bg-gradient-to-br ${item.color || 'from-indigo-500 to-violet-500'} shadow-sm`
                      : 'bg-white/5 group-hover:bg-white/10'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-medium truncate flex-1">{item.label}</span>
                  {isActive && <span className="w-1 h-5 rounded-full bg-amber-400 flex-shrink-0" />}
                </button>
              </div>
            )
          })}
        </nav>

        {/* Maintenance mode tools in sidebar */}
        {isMaintenanceMode && isAdmin && (
          <div className="px-2 pb-2 shrink-0">
            <button onClick={() => setShowDesignKit(!showDesignKit)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all
                ${showDesignKit
                  ? 'bg-violet-600 text-white'
                  : 'bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20'}`}>
              <span className="text-base">🎨</span>
              <span className="text-[11px] font-bold">Design Studio Kit</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0
              ${userRole === 'admin' ? 'bg-gradient-to-br from-amber-400 to-orange-600'
                : userRole === 'teacher' ? 'bg-gradient-to-br from-indigo-400 to-indigo-600'
                : 'bg-gradient-to-br from-emerald-400 to-emerald-600'}`}>
              {userRole.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-white/70 uppercase tracking-widest">{userRole}</p>
              <p className="text-[8px] text-gray-600">Platform v2.1</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
