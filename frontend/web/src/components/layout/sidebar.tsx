'use client'

import { PageKey } from './dashboard-layout'

interface NavItem {
  page: PageKey; icon: string; label: string
}

interface SidebarProps {
  userRole: string; currentPage: PageKey; onNavigate: (page: PageKey) => void
  isOpen: boolean; onClose: () => void
}

const adminItems: NavItem[] = [
  { page: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { page: 'classrooms', icon: '🚪', label: 'Classrooms (240)' },
  { page: 'users', icon: '👥', label: 'Manage Users' },
  { page: 'teachers', icon: '👩‍🏫', label: 'Teachers (6)' },
  { page: 'ce4messenger', icon: '💬', label: 'CE4 Messenger' },
  { page: 'examsystem', icon: '📝', label: 'Exam System (100)' },
  { page: 'placementtest', icon: '🎯', label: 'Placement Test' },
  { page: 'teachereval', icon: '⭐', label: 'AI Teacher Eval' },
  { page: 'dailyperf', icon: '📋', label: 'Daily Performance' },
  { page: 'automessaging', icon: '🤖', label: 'Auto-Messaging AI' },
  { page: 'marketing', icon: '📢', label: 'Marketing Suite' },
  { page: 'videoeditor', icon: '🎬', label: 'AI Video Editor' },
  { page: 'reports', icon: '📊', label: 'Triple Reports' },
  { page: 'anticheat', icon: '🛡️', label: 'Anti-Cheat Monitor' },
  { page: 'homework', icon: '📄', label: 'Homework Dropbox' },
  { page: 'videoarchive', icon: '🎞️', label: 'Video Archive' },
  { page: 'liveanalytics', icon: '📈', label: 'Live Analytics' },
  { page: 'aidev', icon: '🧠', label: 'AI Dev Assistant' },
  { page: 'settings', icon: '⚙️', label: 'Platform Settings' },
]

const teacherItems: NavItem[] = [
  { page: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { page: 'classrooms', icon: '🚪', label: 'Classrooms' },
  { page: 'dailyperf', icon: '📋', label: 'My Performance' },
  { page: 'reports', icon: '📊', label: 'My Reports' },
  { page: 'homework', icon: '📄', label: 'Homework Dropbox' },
  { page: 'ce4messenger', icon: '💬', label: 'CE4 Messenger' },
  { page: 'videoarchive', icon: '🎞️', label: 'Video Archive' },
]

const studentItems: NavItem[] = [
  { page: 'dashboard', icon: '🏠', label: 'My Dashboard' },
  { page: 'classrooms', icon: '🚪', label: 'Classrooms' },
  { page: 'examsystem', icon: '📝', label: 'My Exams' },
  { page: 'placementtest', icon: '🎯', label: 'Placement Test' },
  { page: 'homework', icon: '📄', label: 'Homework Dropbox' },
  { page: 'ce4messenger', icon: '💬', label: 'CE4 Messenger' },
]

export function Sidebar({ userRole, currentPage, onNavigate, isOpen, onClose }: SidebarProps) {
  const items = userRole === 'admin' ? adminItems
    : userRole === 'teacher' ? teacherItems
    : userRole === 'supervisor' ? adminItems
    : studentItems

  return (
    <>
      <aside className={`
        w-60 lg:w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto custom-scroll
        transition-transform duration-300 z-20 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed lg:relative h-full shadow-2xl lg:shadow-none
      `}>
        <div className="p-3 border-b">
          <p className="font-bold text-navy text-sm">📚 Britishce44</p>
          <p className="text-[9px] text-gray-400">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Portal
          </p>
        </div>
        <nav className="flex-1 py-2 space-y-0.5 px-2">
          {items.map(item => (
            <div
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all
                ${currentPage === item.page
                  ? 'bg-gold/15 text-gold font-semibold border-l-3 border-gold'
                  : 'hover:bg-gold/5 text-gray-700'
                }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="p-2 border-t text-[10px] text-gray-400 text-center">
          © 2025 Britishce44 · v4.4
        </div>
      </aside>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-10 lg:hidden" onClick={onClose} />
      )}
    </>
  )
}
