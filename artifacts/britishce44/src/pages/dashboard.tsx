
import { useAuth } from '@/components/providers/auth-provider'

const STAT_COLORS = [
  { from: '#6366f1', to: '#7c3aed', glow: 'rgba(99,102,241,0.20)' },
  { from: '#0891b2', to: '#0e7490', glow: 'rgba(8,145,178,0.20)' },
  { from: '#f0a500', to: '#c47d00', glow: 'rgba(240,165,0,0.20)' },
  { from: '#059669', to: '#047857', glow: 'rgba(5,150,105,0.20)' },
]

interface StatCardProps {
  label: string; value: string; icon: string; idx: number; sub?: string
}

function StatCard({ label, value, icon, idx, sub }: StatCardProps) {
  const c = STAT_COLORS[idx % STAT_COLORS.length]
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden transition-all duration-200 hover:-translate-y-1 cursor-default"
      style={{
        background: 'white',
        border: '1px solid rgba(230,235,255,0.9)',
        boxShadow: `0 2px 12px rgba(8,15,34,0.06), 0 0 0 1px rgba(230,235,255,0.5)`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = `0 8px 28px ${c.glow}, 0 2px 8px rgba(8,15,34,0.08)`
        el.style.borderColor = c.from + '40'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = `0 2px 12px rgba(8,15,34,0.06), 0 0 0 1px rgba(230,235,255,0.5)`
        el.style.borderColor = 'rgba(230,235,255,0.9)'
      }}>
      {/* Gradient corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10"
        style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
          style={{ background: `linear-gradient(135deg, ${c.from}18, ${c.to}28)`, border: `1px solid ${c.from}25` }}>
          {icon}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ color: c.from, background: `${c.from}12` }}>
          Live
        </span>
      </div>
      <p className="text-3xl font-black mb-0.5"
        style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {value}
      </p>
      <p className="text-xs font-semibold text-gray-600">{label}</p>
      {sub && <p className="text-[9px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function QuickActionBtn({ label, color }: { label: string; color: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
      style={{
        background: `${color}10`,
        border: `1px solid ${color}25`,
        color: color,
        boxShadow: `0 2px 8px ${color}10`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background = `${color}20`
        el.style.boxShadow = `0 4px 16px ${color}20`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background = `${color}10`
        el.style.boxShadow = `0 2px 8px ${color}10`
      }}>
      {label}
    </button>
  )
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()

  if (user?.role === 'admin' || user?.role === 'supervisor') {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Hero header */}
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #080f22 0%, #131f40 50%, #1a2550 100%)',
            border: '1px solid rgba(99,102,241,0.20)',
            boxShadow: '0 8px 32px rgba(8,15,34,0.25)',
          }}>
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
          <div className="absolute top-0 right-0 w-64 h-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at right, #6366f1, transparent)' }} />
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
                style={{ background: 'linear-gradient(135deg, #c47d00, #f0a500)', color: '#060b18', boxShadow: '0 4px 16px rgba(240,165,0,0.30)' }}>
                B
              </div>
              <div>
                <p className="text-xs text-indigo-300/50 uppercase tracking-widest">Admin Control Panel</p>
                <h2 className="text-xl font-bold text-white leading-tight">Welcome back, {user.firstName}</h2>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Britishce44 Online Digital School · Taiz, Yemen · All systems operational
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Platform Online
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-indigo-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                240 Classrooms Ready
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                AI Systems Active
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value="60+" icon="👥" idx={0} sub="Active accounts" />
          <StatCard label="Students" value="50" icon="🎓" idx={1} sub="Enrolled" />
          <StatCard label="Teachers" value="9" icon="👩‍🏫" idx={2} sub="Active faculty" />
          <StatCard label="Classrooms" value="240" icon="🚪" idx={3} sub="WebRTC enabled" />
        </div>

        {/* Quick actions + overview */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 bg-white border border-gray-100/80"
            style={{ boxShadow: '0 2px 12px rgba(8,15,34,0.05)' }}>
            <SectionHeader title="⚡ Quick Actions" sub="Most-used admin tools" />
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '👥 Manage Users', color: '#6366f1' },
                { label: '🚪 Classrooms', color: '#7c3aed' },
                { label: '💬 CE4 Messenger', color: '#059669' },
                { label: '📝 Exam System', color: '#f0a500' },
                { label: '⭐ Teacher Eval', color: '#0891b2' },
                { label: '⚙️ Settings', color: '#6b7280' },
              ].map(b => (
                <QuickActionBtn key={b.label} label={b.label} color={b.color} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white border border-gray-100/80"
            style={{ boxShadow: '0 2px 12px rgba(8,15,34,0.05)' }}>
            <SectionHeader title="📋 Platform Overview" sub="Real-time platform status" />
            <div className="space-y-2.5">
              {[
                { icon: '🎓', label: 'Students', value: '50 enrolled', color: '#0891b2' },
                { icon: '👩‍🏫', label: 'Teachers', value: '9 active', color: '#6366f1' },
                { icon: '🚪', label: 'Classrooms', value: '240 rooms · WebRTC', color: '#7c3aed' },
                { icon: '📝', label: 'Exams', value: '100 tests · AI proctored', color: '#f0a500' },
                { icon: '🛡️', label: 'Anti-Cheat', value: 'Active · Real-time', color: '#e11d48' },
                { icon: '📊', label: 'Reports', value: 'Triple reports enabled', color: '#059669' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition group">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 flex-1">{item.label}</span>
                  <span className="text-[10px] font-medium" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl p-5 bg-white border border-gray-100/80"
          style={{ boxShadow: '0 2px 12px rgba(8,15,34,0.05)' }}>
          <SectionHeader title="🔔 Recent Activity" sub="Latest platform events" />
          <div className="space-y-2">
            {[
              { icon: '✅', text: 'Class A1 — English session completed', time: '2 min ago', color: '#059669' },
              { icon: '📝', text: 'Exam #47 submitted by 12 students', time: '8 min ago', color: '#6366f1' },
              { icon: '👤', text: 'New student registered: Sara Ahmed', time: '15 min ago', color: '#0891b2' },
              { icon: '⭐', text: 'Teacher evaluation report generated', time: '1 hr ago', color: '#f0a500' },
              { icon: '📢', text: 'Marketing newsletter sent · 340 recipients', time: '2 hr ago', color: '#7c3aed' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5"
                  style={{ background: `${a.color}12` }}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700">{a.text}</p>
                </div>
                <span className="text-[9px] text-gray-400 shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (user?.role === 'teacher') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #080f22, #1a2550)', border: '1px solid rgba(99,102,241,0.20)', boxShadow: '0 8px 32px rgba(8,15,34,0.25)' }}>
          <h2 className="text-xl font-bold text-white">👩‍🏫 Teacher Dashboard</h2>
          <p className="text-sm text-indigo-300/60 mt-1">Welcome back, {user.firstName} · Ready to teach</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="My Classes" value="8" icon="🚪" idx={0} />
          <StatCard label="Students" value="24" icon="🎓" idx={1} />
          <StatCard label="Homework" value="6" icon="📄" idx={2} sub="Pending review" />
          <StatCard label="Exams" value="3" icon="📝" idx={3} sub="This week" />
        </div>
        <div className="rounded-2xl p-5 bg-white border border-gray-100/80" style={{ boxShadow: '0 2px 12px rgba(8,15,34,0.05)' }}>
          <SectionHeader title="🎯 Today's Schedule" />
          <div className="space-y-2">
            {['09:00 — English Grammar · Class A1', '11:00 — Reading & Writing · Class B2', '14:00 — Conversation Practice · Class C3'].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                <span className="text-sm text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #080f22, #0d1a3a)', border: '1px solid rgba(99,102,241,0.20)', boxShadow: '0 8px 32px rgba(8,15,34,0.25)' }}>
        <h2 className="text-xl font-bold text-white">
          {user?.role === 'parent' ? '👨‍👩‍👧 Parent Dashboard' : '🎓 Student Dashboard'}
        </h2>
        <p className="text-sm text-indigo-300/60 mt-1">Welcome, {user?.firstName} · Britishce44 Digital School</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="My Courses" value="5" icon="📚" idx={0} />
        <StatCard label="Completed" value="12" icon="✅" idx={1} />
        <StatCard label="Upcoming" value="3" icon="📅" idx={2} sub="This week" />
        <StatCard label="Grade" value="A+" icon="⭐" idx={3} />
      </div>
      <div className="rounded-2xl p-5 bg-white border border-gray-100/80" style={{ boxShadow: '0 2px 12px rgba(8,15,34,0.05)' }}>
        <SectionHeader title="📚 My Courses" />
        <div className="space-y-2">
          {['English Grammar — Advanced', 'Reading & Writing — Intermediate', 'Conversation Practice — Beginner'].map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition cursor-pointer">
              <div className="w-2 h-8 rounded-full" style={{ background: STAT_COLORS[i].from }} />
              <span className="text-sm text-gray-700 font-medium">{c}</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${[75, 50, 30][i]}%`, background: STAT_COLORS[i].from }} />
                </div>
                <span className="text-[9px] text-gray-400">{[75, 50, 30][i]}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
