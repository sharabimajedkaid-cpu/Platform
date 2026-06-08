import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

type RoomStatus = 'live' | 'scheduled' | 'empty' | 'locked'

interface Room {
  id: number; grade: string; subject: string; teacher: string
  students: number; status: RoomStatus; startTime?: string
}

const STATUS_CONFIG: Record<RoomStatus, { label: string; color: string; glow: string; bg: string; dot: string }> = {
  live:      { label: 'LIVE',      color: '#34d399', glow: '0 0 12px rgba(52,211,153,0.5)', bg: 'rgba(16,185,129,0.08)', dot: 'bg-emerald-400 animate-pulse' },
  scheduled: { label: 'Scheduled', color: '#818cf8', glow: '0 0 8px rgba(129,140,248,0.4)', bg: 'rgba(99,102,241,0.06)', dot: 'bg-indigo-400' },
  empty:     { label: 'Empty',     color: '#4b5563', glow: 'none',                           bg: 'transparent',           dot: 'bg-gray-600' },
  locked:    { label: 'Locked',    color: '#f87171', glow: '0 0 8px rgba(248,113,113,0.3)',  bg: 'rgba(239,68,68,0.05)',  dot: 'bg-red-400' },
}

const TEACHERS = [
  'Suhair Almojahid', "Wa'ad Alhammadi", 'Jamal Alshameeri',
  'Amani Alsharabi', 'Khadeejah Alghaily', 'Shihab Alomary',
  'Nadia Alqaiti', 'Hassan Almakhlafi', 'Rania Althawr',
]

const SUBJECTS = [
  'Mathematics', 'English', 'Science', 'History', 'Arabic',
  'ICT', 'Physics', 'Chemistry', 'Biology', 'Geography',
]

const START_TIMES = ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00']
const STATUSES: RoomStatus[] = ['live', 'scheduled', 'empty', 'empty', 'locked', 'live', 'scheduled', 'empty']

function buildRooms(): Room[] {
  return Array.from({ length: 240 }, (_, i) => {
    const id = i + 1
    const status = STATUSES[i % STATUSES.length]
    return {
      id,
      grade: `G${Math.ceil(id / 24)} · ${SUBJECTS[i % SUBJECTS.length]}`,
      subject: SUBJECTS[i % SUBJECTS.length],
      teacher: TEACHERS[i % TEACHERS.length],
      students: status === 'live' ? 12 + (i % 18) : status === 'scheduled' ? 0 : 0,
      status,
      startTime: status === 'scheduled' ? START_TIMES[i % START_TIMES.length] : undefined,
    }
  })
}

function ClassroomCard({ room, onEnter }: { room: Room; onEnter: (id: number) => void }) {
  const s = STATUS_CONFIG[room.status]
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => room.status !== 'locked' && onEnter(room.id)}
      className="relative rounded-xl overflow-hidden cursor-pointer transition-all select-none"
      style={{
        background: `linear-gradient(135deg, #0d1425 0%, #111827 100%)`,
        border: `1px solid ${room.status === 'live' ? 'rgba(52,211,153,0.25)' : 'rgba(99,102,241,0.12)'}`,
        boxShadow: room.status === 'live' ? s.glow : undefined,
      }}>

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{ background: room.status === 'live'
          ? 'linear-gradient(90deg,transparent,#34d399,transparent)'
          : room.status === 'locked'
            ? 'linear-gradient(90deg,transparent,#f87171,transparent)'
            : 'linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)' }} />

      <div className="p-3">
        {/* Header row */}
        <div className="flex items-start justify-between mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{
              background: room.status === 'live'
                ? 'linear-gradient(135deg,#064e3b,#065f46)'
                : room.status === 'locked'
                  ? 'linear-gradient(135deg,#450a0a,#7f1d1d)'
                  : 'linear-gradient(135deg,#150529,#312e81)',
              color: s.color, boxShadow: s.glow !== 'none' ? s.glow : undefined,
            }}>
            {room.status === 'locked' ? '🔒' : room.id}
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: s.color }}>
              {s.label}
            </span>
          </div>
        </div>

        {/* Subject + grade */}
        <p className="text-[10px] font-bold text-white leading-tight truncate">{room.grade}</p>
        <p className="text-[9px] mt-0.5 truncate" style={{ color: 'rgba(165,180,252,0.5)' }}>
          {room.teacher.split(' ').slice(0, 2).join(' ')}
        </p>

        {/* Footer */}
        <div className="mt-2.5 flex items-center justify-between">
          {room.status === 'live' && (
            <span className="text-[8px] text-emerald-400 flex items-center gap-1">
              <span>👥</span>{room.students}
            </span>
          )}
          {room.status === 'scheduled' && (
            <span className="text-[8px] text-indigo-400/70">⏰ {room.startTime}</span>
          )}
          {room.status === 'empty' && (
            <span className="text-[8px] text-gray-600">Available</span>
          )}
          {room.status === 'locked' && (
            <span className="text-[8px] text-red-400/70">Restricted</span>
          )}

          {room.status !== 'locked' && (
            <button onClick={e => { e.stopPropagation(); onEnter(room.id) }}
              className="text-[8px] px-2 py-0.5 rounded-full font-bold transition"
              style={{
                background: room.status === 'live' ? 'rgba(52,211,153,0.15)' : 'rgba(99,102,241,0.15)',
                color: s.color, border: `1px solid ${s.color}30`,
              }}>
              {room.status === 'live' ? 'Join →' : room.status === 'scheduled' ? 'Schedule' : 'Enter →'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const GRADES = ['All Grades', ...Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`)]
const FILTERS: { id: RoomStatus | 'all'; label: string; emoji: string }[] = [
  { id: 'all',       label: 'All',       emoji: '🏫' },
  { id: 'live',      label: 'Live',      emoji: '🔴' },
  { id: 'scheduled', label: 'Scheduled', emoji: '📅' },
  { id: 'empty',     label: 'Available', emoji: '✅' },
  { id: 'locked',    label: 'Locked',    emoji: '🔒' },
]

const ALL_ROOMS = buildRooms()
const PAGE_SIZE = 48

export function ClassroomsPage({ onEnterClassroom }: { onEnterClassroom: (id: number) => void }) {
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all')
  const [gradeFilter, setGradeFilter] = useState('All Grades')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    return ALL_ROOMS.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (gradeFilter !== 'All Grades') {
        const gNum = gradeFilter.replace('Grade ', '')
        if (!r.grade.startsWith(`G${gNum} ·`)) return false
      }
      if (search) {
        const q = search.toLowerCase()
        return r.subject.toLowerCase().includes(q) || r.teacher.toLowerCase().includes(q) || String(r.id).includes(q)
      }
      return true
    })
  }, [statusFilter, gradeFilter, search])

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const counts = useMemo(() => ({
    live: ALL_ROOMS.filter(r => r.status === 'live').length,
    scheduled: ALL_ROOMS.filter(r => r.status === 'scheduled').length,
    empty: ALL_ROOMS.filter(r => r.status === 'empty').length,
    locked: ALL_ROOMS.filter(r => r.status === 'locked').length,
  }), [])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-gradient-aurora">🏫 Virtual Classrooms</h2>
          <p className="text-sm text-gray-500 mt-0.5">240 classrooms across 10 grades — click to enter live</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />{counts.live} Live</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400" />{counts.scheduled} Soon</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-600" />{counts.empty} Open</span>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
          placeholder="🔍 Search by subject, teacher or room number…"
          className="flex-1 min-w-48 px-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          style={{ background: 'rgba(13,20,37,0.8)', border: '1px solid rgba(99,102,241,0.15)' }} />

        <select value={gradeFilter} onChange={e => { setGradeFilter(e.target.value); setPage(0) }}
          className="px-3 py-2 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          style={{ background: 'rgba(13,20,37,0.8)', border: '1px solid rgba(99,102,241,0.15)' }}>
          {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => { setStatusFilter(f.id); setPage(0) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition"
            style={statusFilter === f.id ? {
              background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
              color: '#fff', boxShadow: '0 2px 10px rgba(99,102,241,0.3)',
            } : {
              background: 'rgba(13,20,37,0.6)',
              color: 'rgba(156,163,175,0.8)',
              border: '1px solid rgba(99,102,241,0.12)',
            }}>
            <span>{f.emoji}</span>{f.label}
            {f.id !== 'all' && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: 'rgba(255,255,255,0.1)' }}>
                {f.id === 'live' ? counts.live : f.id === 'scheduled' ? counts.scheduled : f.id === 'empty' ? counts.empty : counts.locked}
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-600 self-center">{filtered.length} classrooms</span>
      </div>

      {/* Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
          {paginated.map(r => (
            <ClassroomCard key={r.id} room={r} onEnter={onEnterClassroom} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-600">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm">No classrooms match your filters</p>
          <button onClick={() => { setSearch(''); setStatusFilter('all'); setGradeFilter('All Grades') }}
            className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition">
            Clear filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-3 py-1.5 rounded-xl text-xs transition disabled:opacity-30"
            style={{ background: 'rgba(13,20,37,0.8)', color: 'rgba(165,180,252,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
            ← Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pageNum = totalPages <= 7 ? i : Math.max(0, Math.min(totalPages - 7, page - 3)) + i
            return (
              <button key={pageNum} onClick={() => setPage(pageNum)}
                className="w-8 h-8 rounded-xl text-xs font-medium transition"
                style={page === pageNum ? {
                  background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff',
                } : {
                  background: 'rgba(13,20,37,0.6)', color: 'rgba(156,163,175,0.7)',
                  border: '1px solid rgba(99,102,241,0.1)',
                }}>
                {pageNum + 1}
              </button>
            )
          })}
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
            className="px-3 py-1.5 rounded-xl text-xs transition disabled:opacity-30"
            style={{ background: 'rgba(13,20,37,0.8)', color: 'rgba(165,180,252,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
