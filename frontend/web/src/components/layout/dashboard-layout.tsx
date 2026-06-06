'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from './sidebar'
import { TopBar } from './topbar'
import { DashboardPage } from '@/pages/dashboard'
import { ClassroomsPage } from '@/pages/classrooms'
import { MessengerPage } from '@/pages/messenger'
import { ExamSystemPage } from '@/pages/exam-system'
import { HomeworkPage } from '@/pages/homework'
import { VideoArchivePage } from '@/pages/video-archive'
import { TeacherEvalPage } from '@/pages/teacher-eval'
import { DailyPerfPage } from '@/pages/daily-perf'
import { ReportsPage } from '@/pages/reports'
import { AnticheatPage } from '@/pages/anticheat'
import { PlacementsPage } from '@/pages/placements'
import { SettingsPage } from '@/pages/settings'
import { UsersPage } from '@/pages/users'
import { LiveAnalyticsPage } from '@/pages/live-analytics'
import { AiDevPage } from '@/pages/ai-dev'
import { MarketingPage } from '@/pages/marketing'
import { AutoMessagingPage } from '@/pages/auto-messaging'
import { VideoEditorPage } from '@/pages/video-editor'
import { ClassroomRoom } from '@/components/classroom/classroom-room'

export type PageKey =
  | 'dashboard' | 'classrooms' | 'users' | 'teachers' | 'students' | 'mystudents'
  | 'ce4messenger' | 'examsystem' | 'placementtest' | 'teachereval' | 'dailyperf'
  | 'automessaging' | 'marketing' | 'videoeditor' | 'reports' | 'anticheat'
  | 'subscriptions' | 'liveanalytics' | 'homework' | 'chat' | 'meetlive'
  | 'videoarchive' | 'examroom' | 'aidev' | 'settings'

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [classroomOpen, setClassroomOpen] = useState<number | null>(null)

  const renderPage = () => {
    if (classroomOpen !== null) {
      return <ClassroomRoom roomId={classroomOpen} onClose={() => setClassroomOpen(null)} />
    }
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />
      case 'classrooms': return <ClassroomsPage onEnterClassroom={(id) => setClassroomOpen(id)} />
      case 'users': return <UsersPage />
      case 'ce4messenger': return <MessengerPage />
      case 'examsystem': return <ExamSystemPage />
      case 'placementtest': return <PlacementsPage />
      case 'teachereval': return <TeacherEvalPage />
      case 'dailyperf': return <DailyPerfPage />
      case 'homework': return <HomeworkPage />
      case 'videoarchive': return <VideoArchivePage />
      case 'reports': return <ReportsPage />
      case 'anticheat': return <AnticheatPage />
      case 'liveanalytics': return <LiveAnalyticsPage />
      case 'settings': return <SettingsPage />
      case 'aidev': return <AiDevPage />
      case 'marketing': return <MarketingPage />
      case 'automessaging': return <AutoMessagingPage />
      case 'videoeditor': return <VideoEditorPage />
      default: return <DashboardPage />
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <TopBar
        user={user}
        onLogout={logout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          userRole={user?.role || 'student'}
          currentPage={currentPage}
          onNavigate={(page) => { setCurrentPage(page); setSidebarOpen(false) }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto custom-scroll bg-[#f0f2f5] p-4 md:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
