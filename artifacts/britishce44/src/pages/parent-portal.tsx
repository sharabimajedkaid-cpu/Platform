import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

const CHILDREN = [
  { id: 1, name: 'Sara Al-Mansoori', grade: 'Grade 9', avatar: 'S', color: '#2563eb', attendance: 96, avg: 88, fees: 'Paid' },
  { id: 2, name: 'Yusuf Al-Mansoori', grade: 'Grade 6', avatar: 'Y', color: '#00ae74', attendance: 82, avg: 74, fees: 'Due' },
]

const SUBJECTS: Record<number, { subject: string; grade: number; color: string }[]> = {
  1: [
    { subject: 'English', grade: 92, color: '#34d399' },
    { subject: 'Mathematics', grade: 85, color: '#2563eb' },
    { subject: 'Science', grade: 90, color: '#67e8f9' },
    { subject: 'ICT', grade: 84, color: '#7dd3fc' },
  ],
  2: [
    { subject: 'English', grade: 70, color: '#fb923c' },
    { subject: 'Mathematics', grade: 78, color: '#2563eb' },
    { subject: 'Science', grade: 76, color: '#67e8f9' },
    { subject: 'Arabic', grade: 72, color: '#00ae74' },
  ],
}

const TIMELINE: Record<number, { icon: string; text: string; time: string; color: string }[]> = {
  1: [
    { icon: '🏆', text: 'Scored 95% on English mid-term', time: 'Today', color: '#34d399' },
    { icon: '✅', text: 'Submitted Science homework', time: 'Yesterday', color: '#2563eb' },
    { icon: '🎓', text: 'Attended all 5 live classes this week', time: '2 days ago', color: '#00ae74' },
  ],
  2: [
    { icon: '⚠️', text: 'Missed Mathematics live class', time: 'Today', color: '#f87171' },
    { icon: '💳', text: 'Tuition payment due in 3 days', time: 'Today', color: '#fb923c' },
    { icon: '✅', text: 'Completed vocabulary quiz', time: 'Yesterday', color: '#2563eb' },
  ],
}

export function ParentPortalPage() {
  const { t } = useI18n()
  const [active, setActive] = useState(CHILDREN[0].id)
  const child = CHILDREN.find(c => c.id === active)!

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-gradient-aurora">👨‍👩‍👧 {t('nav.parentportal')}</h2>
        <p className="text-sm text-gray-500 mt-0.5">Follow your child’s journey — grades, attendance, behaviour & fees</p>
      </div>

      {/* Child switcher */}
      <div className="flex items-center gap-3">
        {CHILDREN.map(c => (
          <button key={c.id} onClick={() => setActive(c.id)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-2xl transition-all"
            style={{ background: active === c.id ? `${c.color}1f` : 'rgba(26, 19, 92,0.7)', border: `1px solid ${active === c.id ? `${c.color}55` : 'rgba(255,255,255,0.06)'}` }}>
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: c.color }}>{c.avatar}</span>
            <div className="text-left">
              <p className="text-xs font-bold text-white">{c.name.split(' ')[0]}</p>
              <p className="text-[9px] text-gray-500">{c.grade}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Attendance', value: `${child.attendance}%`, color: child.attendance >= 90 ? '#34d399' : '#fb923c' },
          { label: 'Average Grade', value: `${child.avg}%`, color: '#2563eb' },
          { label: 'Tuition', value: child.fees, color: child.fees === 'Paid' ? '#34d399' : '#f87171' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden" style={{ background: 'rgba(26, 19, 92,0.7)', border: `1px solid ${s.color}20` }}>
            <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: `linear-gradient(90deg,transparent,${s.color},transparent)` }} />
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-black mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Subjects */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(26, 19, 92,0.7)', border: '1px solid rgba(37,99,235,0.18)' }}>
          <p className="text-xs font-bold text-white mb-3">📚 Subject Performance</p>
          <div className="space-y-2.5">
            {SUBJECTS[active].map(s => (
              <div key={s.subject} className="flex items-center gap-3">
                <span className="text-[10px] text-gray-400 w-24">{s.subject}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div key={active} initial={{ width: 0 }} animate={{ width: `${s.grade}%` }} transition={{ duration: 1 }}
                    className="h-full rounded-full" style={{ background: s.color }} />
                </div>
                <span className="text-[10px] font-bold text-white w-8 text-right">{s.grade}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(26, 19, 92,0.7)', border: '1px solid rgba(0, 174, 116,0.18)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(0, 174, 116,0.1)' }}>
            <p className="text-xs font-bold text-white">🕒 Recent Activity</p>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(0, 174, 116,0.06)' }}>
            {TIMELINE[active].map((e, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="px-4 py-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: `${e.color}1a`, border: `1px solid ${e.color}33` }}>{e.icon}</span>
                <p className="text-[11px] text-white/85 flex-1">{e.text}</p>
                <span className="text-[9px] text-gray-600 flex-shrink-0">{e.time}</span>
              </motion.div>
            ))}
          </div>
          <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(0, 174, 116,0.06)' }}>
            <button className="w-full py-2 rounded-xl text-[11px] font-bold text-white" style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)' }}>
              💬 Message {child.name.split(' ')[0]}’s teacher
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
