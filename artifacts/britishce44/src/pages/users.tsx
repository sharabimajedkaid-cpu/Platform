import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../components/providers/auth-provider'

type Role = 'admin' | 'teacher' | 'student' | 'supervisor' | 'parent'
type Status = 'active' | 'inactive' | 'suspended'

interface User {
  id: number; name: string; email: string; role: Role; status: Status
  lastSeen: string; classrooms?: number; grade?: string; phone?: string
}

const MOCK_USERS: User[] = [
  { id: 1, name: 'Britishce44 Admin', email: 'britishce44@gmail.com', role: 'admin', status: 'active', lastSeen: 'Now', phone: '+967 7XX XXX XXX' },
  { id: 2, name: 'Suhair Almojahid', email: 'suhair.almojahid@britishce44.edu', role: 'teacher', status: 'active', lastSeen: '5 min ago', classrooms: 5 },
  { id: 3, name: "Wa'ad Alhammadi", email: 'waad@britishce44.edu', role: 'teacher', status: 'active', lastSeen: '1 hr ago', classrooms: 4 },
  { id: 4, name: 'Jamal Alshameeri', email: 'jamal@britishce44.edu', role: 'teacher', status: 'active', lastSeen: '2 hr ago', classrooms: 6 },
  { id: 5, name: 'Amani Alsharabi', email: 'amani@britishce44.edu', role: 'teacher', status: 'inactive', lastSeen: '3 days ago', classrooms: 3 },
  { id: 6, name: 'Supervisor Ali Hassan', email: 'ali@britishce44.edu', role: 'supervisor', status: 'active', lastSeen: '30 min ago' },
  { id: 7, name: 'Ahmed Nasser', email: 'ahmed@britishce44.edu', role: 'student', status: 'active', lastSeen: '10 min ago', grade: 'G5' },
  { id: 8, name: 'Mona Alqaiti', email: 'mona@britishce44.edu', role: 'student', status: 'active', lastSeen: '1 hr ago', grade: 'G7' },
  { id: 9, name: 'Omar Althawr', email: 'omar@britishce44.edu', role: 'student', status: 'inactive', lastSeen: '1 week ago', grade: 'G5' },
  { id: 10, name: 'Sara Almahdi', email: 'sara@britishce44.edu', role: 'student', status: 'active', lastSeen: '15 min ago', grade: 'G9' },
  { id: 11, name: 'Hassan Almakhlafi', email: 'hassan@britishce44.edu', role: 'teacher', status: 'active', lastSeen: '20 min ago', classrooms: 7 },
  { id: 12, name: 'Fatima Alomari', email: 'fatima@britishce44.edu', role: 'parent', status: 'active', lastSeen: '2 days ago' },
  { id: 13, name: 'Khaled Alghaily', email: 'khaled@britishce44.edu', role: 'student', status: 'suspended', lastSeen: '5 days ago', grade: 'G6' },
  { id: 14, name: 'Nadia Alqaiti', email: 'nadia@britishce44.edu', role: 'teacher', status: 'active', lastSeen: '45 min ago', classrooms: 5 },
  { id: 15, name: 'Ibrahim Almojahid', email: 'ibrahim@britishce44.edu', role: 'student', status: 'active', lastSeen: '3 hr ago', grade: 'G4' },
]

const ROLE_CONFIG: Record<Role, { color: string; bg: string; emoji: string }> = {
  admin:      { color: '#f0a500', bg: 'rgba(240,165,0,0.12)',    emoji: '👑' },
  teacher:    { color: '#818cf8', bg: 'rgba(129,140,248,0.12)',  emoji: '👨‍🏫' },
  supervisor: { color: '#34d399', bg: 'rgba(52,211,153,0.12)',   emoji: '🔭' },
  student:    { color: '#67e8f9', bg: 'rgba(103,232,249,0.10)',  emoji: '🎓' },
  parent:     { color: '#fb923c', bg: 'rgba(251,146,60,0.10)',   emoji: '👪' },
}

const STATUS_CONFIG: Record<Status, { color: string; dot: string }> = {
  active:    { color: '#34d399', dot: 'bg-emerald-400 animate-pulse' },
  inactive:  { color: '#6b7280', dot: 'bg-gray-500' },
  suspended: { color: '#f87171', dot: 'bg-red-400' },
}

const ROLES: (Role | 'all')[] = ['all', 'admin', 'teacher', 'supervisor', 'student', 'parent']

interface AddUserModalProps { onClose: () => void }
function AddUserModal({ onClose }: AddUserModalProps) {
  const [form, setForm] = useState({ name: '', email: '', role: 'student' as Role, password: '' })
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="rounded-2xl p-6 w-full max-w-md space-y-4"
        style={{ background: '#0d1425', border: '1px solid rgba(99,102,241,0.25)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">➕ Add New User</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-lg">✕</button>
        </div>
        {[
          { label: 'Full Name', key: 'name', type: 'text', placeholder: 'e.g. Ahmed Mohammed' },
          { label: 'Email', key: 'email', type: 'email', placeholder: 'user@britishce44.edu' },
          { label: 'Temporary Password', key: 'password', type: 'password', placeholder: '••••••••' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-[11px] text-gray-400 block mb-1">{f.label}</label>
            <input type={f.type} placeholder={f.placeholder}
              value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)' }} />
          </div>
        ))}
        <div>
          <label className="text-[11px] text-gray-400 block mb-1">Role</label>
          <select value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value as Role }))}
            className="w-full px-3 py-2 rounded-xl text-sm text-white focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}>
            {(['student', 'teacher', 'supervisor', 'parent', 'admin'] as Role[]).map(r => (
              <option key={r} value={r}>{ROLE_CONFIG[r].emoji} {r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm text-gray-500 hover:text-white transition"
            style={{ border: '1px solid rgba(99,102,241,0.15)' }}>Cancel</button>
          <button onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-bold transition"
            style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff', boxShadow: '0 2px 12px rgba(99,102,241,0.3)' }}>
            Create User
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function UsersPage() {
  const { user: me } = useAuth()
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const isAdmin = me?.role === 'admin'

  const filtered = useMemo(() => {
    return MOCK_USERS.filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      }
      return true
    })
  }, [roleFilter, search])

  const counts = useMemo(() => {
    const r: Partial<Record<Role | 'all', number>> = { all: MOCK_USERS.length }
    ROLES.forEach(role => { if (role !== 'all') r[role] = MOCK_USERS.filter(u => u.role === role).length })
    return r
  }, [])

  const toggleSelect = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div className="space-y-5">
      <AnimatePresence>{showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}</AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gradient-aurora">👥 User Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{MOCK_USERS.length} total users across all roles</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition"
            style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff', boxShadow: '0 2px 12px rgba(99,102,241,0.3)' }}>
            ➕ Add User
          </button>
        )}
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name or email…"
          className="flex-1 min-w-48 px-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          style={{ background: 'rgba(13,20,37,0.8)', border: '1px solid rgba(99,102,241,0.15)' }} />
        {selected.length > 0 && isAdmin && (
          <button onClick={() => setSelected([])}
            className="px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 transition"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            🗑 Remove {selected.length} selected
          </button>
        )}
      </div>

      {/* Role filter pills */}
      <div className="flex gap-2 flex-wrap">
        {ROLES.map(r => {
          const cfg = r !== 'all' ? ROLE_CONFIG[r] : null
          return (
            <button key={r} onClick={() => setRoleFilter(r)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition"
              style={roleFilter === r ? {
                background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
                color: '#fff', boxShadow: '0 2px 10px rgba(99,102,241,0.3)',
              } : {
                background: 'rgba(13,20,37,0.6)',
                color: 'rgba(156,163,175,0.8)',
                border: '1px solid rgba(99,102,241,0.12)',
              }}>
              {cfg ? <span>{cfg.emoji}</span> : '🌐'}
              {r === 'all' ? 'All Users' : r.charAt(0).toUpperCase() + r.slice(1)}
              <span className="px-1.5 py-0.5 rounded-full text-[9px]"
                style={{ background: 'rgba(255,255,255,0.1)' }}>
                {counts[r]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(99,102,241,0.12)' }}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500"
          style={{ background: 'rgba(6,11,24,0.8)', borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
          {isAdmin && <div className="col-span-1">Select</div>}
          <div className={isAdmin ? 'col-span-3' : 'col-span-4'}>Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Last Active</div>
        </div>

        {/* Rows */}
        <div>
          {filtered.map((u, i) => {
            const rc = ROLE_CONFIG[u.role]
            const sc = STATUS_CONFIG[u.status]
            const isSel = selected.includes(u.id)
            return (
              <motion.div key={u.id}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-12 gap-2 px-4 py-3 items-center transition cursor-pointer"
                style={{
                  borderBottom: '1px solid rgba(99,102,241,0.06)',
                  background: isSel ? 'rgba(99,102,241,0.06)' : 'rgba(13,20,37,0.3)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = isSel ? 'rgba(99,102,241,0.06)' : 'rgba(13,20,37,0.3)')}>
                {isAdmin && (
                  <div className="col-span-1">
                    <button onClick={() => toggleSelect(u.id)}
                      className="w-4 h-4 rounded border transition"
                      style={isSel ? { background: '#6366f1', border: 'none' } : { border: '1px solid rgba(99,102,241,0.3)' }}>
                      {isSel && <span className="text-[8px] text-white block text-center">✓</span>}
                    </button>
                  </div>
                )}
                <div className={`${isAdmin ? 'col-span-3' : 'col-span-4'} flex items-center gap-2`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.color}25` }}>
                    {u.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{u.name}</p>
                    {u.grade && <p className="text-[9px] text-gray-500">{u.grade}</p>}
                    {u.classrooms !== undefined && <p className="text-[9px] text-indigo-400/60">{u.classrooms} classrooms</p>}
                  </div>
                </div>
                <div className="col-span-3">
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: rc.bg, color: rc.color }}>
                    {rc.emoji} {u.role}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  <span className="text-[10px] capitalize" style={{ color: sc.color }}>{u.status}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-[9px] text-gray-600">{u.lastSeen}</span>
                </div>
              </motion.div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm">No users match your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['teacher', 'student', 'supervisor', 'parent'] as Role[]).map(r => {
          const cfg = ROLE_CONFIG[r]
          return (
            <div key={r} className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ background: 'rgba(13,20,37,0.6)', border: '1px solid rgba(99,102,241,0.1)' }}>
              <span className="text-2xl">{cfg.emoji}</span>
              <div>
                <p className="text-xl font-black" style={{ color: cfg.color }}>{counts[r]}</p>
                <p className="text-[10px] text-gray-500 capitalize">{r}s</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
