'use client'

import { useAuth } from '@/components/providers/auth-provider'

export function DashboardPage() {
  const { user } = useAuth()

  if (user?.role === 'admin') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-navy">🏠 Admin Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome, {user.firstName}.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: '60+', color: 'text-navy' },
            { label: 'Students', value: '50', color: 'text-royal-blue' },
            { label: 'Teachers', value: '9', color: 'text-gold' },
            { label: 'Classrooms', value: '240', color: 'text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow">
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-semibold mb-2">⚡ Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '👥 Manage Users', action: 'users' },
                { label: '🚪 Classrooms', action: 'classrooms' },
                { label: '💬 Messenger', action: 'ce4messenger' },
                { label: '📝 Exams', action: 'examsystem' },
                { label: '⭐ Teacher Eval', action: 'teachereval' },
                { label: '⚙️ Settings', action: 'settings' },
              ].map(b => (
                <button key={b.label}
                  className="bg-navy text-white p-3 rounded-xl text-sm hover:bg-opacity-90 transition">
                  {b.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-semibold mb-2">📋 Overview</h3>
            <p className="text-xs">• 9 teachers · 50 students</p>
            <p className="text-xs">• 240 classrooms · 100 exams · AI anti-cheat active</p>
            <p className="text-xs">• CE4 Messenger · Live Analytics</p>
            <p className="text-xs">• Triple Reports · Marketing Suite</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy">🎓 {user?.role === 'parent' ? 'Parent' : 'Student'} Dashboard</h2>
      <p className="text-sm text-gray-500">Welcome, {user?.firstName}.</p>
      <div className="bg-ivory rounded-xl p-5 border border-champagne">
        <h3 className="font-semibold text-navy">📖 The First British Center · Taiz Yemen</h3>
        <p className="text-sm text-gray-600 mt-2">
          Premier online educational institution providing world-class English language education through innovative virtual classrooms.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'My Classroom', value: user?.classroomId ? `Classroom ${user.classroomId}` : 'Not assigned' },
          { label: 'Homework', value: 'View submissions' },
          { label: 'Videos', value: 'My archive' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-lg font-bold text-navy">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
