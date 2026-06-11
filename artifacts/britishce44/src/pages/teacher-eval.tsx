import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CARD = 'rgba(11,22,62,0.85)'
const BORDER = 'rgba(37,99,235,0.18)'
const GOLD = '#00ae74'
const ROYAL = '#2563eb'

const TEACHERS = [
  { id: 't1', name: 'Suhair Almojahid',  subject: 'Mathematics', grade: 'G5–G8', overall: 91, trend: +3,  sessions: 48, students: 85,  avatar: 'SA' },
  { id: 't2', name: "Wa'ad Alhammadi",   subject: 'English',     grade: 'G6–G9', overall: 87, trend: +1,  sessions: 44, students: 72,  avatar: 'WA' },
  { id: 't3', name: 'Jamal Alshameeri',  subject: 'Science',     grade: 'G7–G10',overall: 83, trend: -1,  sessions: 40, students: 68,  avatar: 'JA' },
  { id: 't4', name: 'Amani Alsharabi',   subject: 'Arabic',      grade: 'G4–G7', overall: 79, trend: +4,  sessions: 36, students: 60,  avatar: 'AA' },
  { id: 't5', name: 'Hassan Almakhlafi', subject: 'ICT',         grade: 'G8–G10',overall: 88, trend: +2,  sessions: 42, students: 55,  avatar: 'HA' },
  { id: 't6', name: 'Nadia Alqaiti',     subject: 'Chemistry',   grade: 'G9–G10',overall: 85, trend: 0,   sessions: 38, students: 48,  avatar: 'NA' },
]

const CRITERIA = [
  { label: 'Lesson Preparation',       labelAr: 'تحضير الدرس',            icon: '📋', scores: [95, 88, 82, 76, 90, 86] },
  { label: 'Classroom Management',     labelAr: 'إدارة الفصل',            icon: '🏫', scores: [88, 85, 80, 74, 86, 83] },
  { label: 'Student Engagement',       labelAr: 'تفاعل الطلاب',           icon: '🎯', scores: [92, 89, 83, 81, 88, 85] },
  { label: 'Assessment & Feedback',    labelAr: 'التقييم والتغذية الراجعة',icon: '📊', scores: [90, 86, 84, 78, 87, 84] },
  { label: 'Communication Skills',     labelAr: 'مهارات التواصل',         icon: '💬', scores: [94, 88, 85, 80, 90, 87] },
  { label: 'Professional Development', labelAr: 'التطوير المهني',         icon: '🌟', scores: [88, 84, 82, 79, 86, 81] },
]

const AI_INSIGHTS: string[] = [
  'Lesson preparation scores are consistently high — recommend sharing best practices across the team.',
  "Wa'ad Alhammadi's English classes show the highest speaking activity rates (94%) this month.",
  'Student engagement improved by 7% platform-wide compared to last month.',
  "Amani Alsharabi\u2019s Arabic grades show a strong +4 trend \u2014 recognize and reward improvement.",
  'Schedule professional development workshop on formative assessment methodology for G7–G9 teachers.',
  'Classroom management dipped in two sessions last week — suggest peer observation pairing.',
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const MONTHLY_SCORES = [
  [82, 85, 87, 88, 90, 91],
  [80, 81, 83, 85, 86, 87],
  [78, 79, 80, 81, 82, 83],
  [72, 74, 76, 77, 78, 79],
  [83, 84, 85, 86, 87, 88],
  [80, 81, 82, 83, 84, 85],
]

function ScoreGauge({ score }: { score: number }) {
  const r = 48; const circ = 2 * Math.PI * r
  const pct = score / 100
  const color = score >= 90 ? '#34d399' : score >= 80 ? GOLD : '#f87171'
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" transform="rotate(-90 60 60)"
        style={{ filter: `drop-shadow(0 0 8px ${color}80)` }} />
      <text x="60" y="56" textAnchor="middle" fill={color} fontSize="22" fontWeight="900">{score}</text>
      <text x="60" y="72" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10">/ 100</text>
    </svg>
  )
}

type Tab = 'criteria' | 'history' | 'ai'

export function TeacherEvalPage() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [tab, setTab] = useState<Tab>('criteria')
  const teacher = TEACHERS[selectedIdx]
  const criteriaScores = CRITERIA.map(c => c.scores[selectedIdx])
  const monthlyData = MONTHLY_SCORES[selectedIdx]

  const scoreColor = (s: number) => s >= 90 ? '#34d399' : s >= 80 ? GOLD : '#f87171'

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gradient-aurora">⭐ AI Teacher Evaluation</h2>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(147,197,253,0.55)' }}>
            Real-time AI scoring across 6 professional criteria
          </p>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-full font-semibold"
          style={{ background: 'rgba(0, 174, 116,0.12)', color: GOLD, border: `1px solid ${GOLD}30` }}>
          🤖 AI Analysis: Updated today
        </div>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Teacher list */}
        <div className="lg:w-56 flex-shrink-0 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(147,197,253,0.4)' }}>Select Teacher</p>
          {TEACHERS.map((t, i) => (
            <button key={t.id} onClick={() => setSelectedIdx(i)}
              className="w-full text-left p-3 rounded-xl transition-all flex items-center gap-3"
              style={selectedIdx === i ? {
                background: 'linear-gradient(135deg,#2620a8,#1e3fa8)',
                border: '1px solid rgba(37,99,235,0.50)',
                boxShadow: '0 4px 16px rgba(37,99,235,0.25)',
              } : {
                background: CARD, border: `1px solid ${BORDER}`,
              }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: selectedIdx === i ? 'rgba(0, 174, 116,0.20)' : 'rgba(37,99,235,0.15)', color: selectedIdx === i ? GOLD : 'rgba(147,197,253,0.7)' }}>
                {t.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{t.name.split(' ')[0]}</p>
                <p className="text-[9px] truncate" style={{ color: 'rgba(147,197,253,0.5)' }}>{t.subject}</p>
              </div>
              <div className="ml-auto text-xs font-black flex-shrink-0" style={{ color: scoreColor(t.overall) }}>{t.overall}</div>
            </button>
          ))}
        </div>

        {/* Evaluation panel */}
        <div className="flex-1 space-y-4">
          {/* Teacher overview card */}
          <div className="rounded-2xl p-5 flex items-center gap-6 flex-wrap"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <ScoreGauge score={teacher.overall} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-black text-white">{teacher.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ background: teacher.trend >= 0 ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)', color: teacher.trend >= 0 ? '#34d399' : '#f87171' }}>
                  {teacher.trend >= 0 ? '↑' : '↓'} {Math.abs(teacher.trend)} pts
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: 'rgba(147,197,253,0.7)' }}>{teacher.subject} · {teacher.grade}</p>
              <div className="flex gap-4 mt-3">
                {[
                  { label: 'Sessions', value: teacher.sessions, icon: '🎓' },
                  { label: 'Students', value: teacher.students, icon: '👥' },
                  { label: 'Rank', value: `#${selectedIdx + 1}`, icon: '🏆' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-base font-black text-white">{s.icon} {s.value}</p>
                    <p className="text-[9px]" style={{ color: 'rgba(147,197,253,0.45)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(11,22,62,0.60)', border: `1px solid ${BORDER}` }}>
            {(['criteria', 'history', 'ai'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                style={tab === t ? {
                  background: 'linear-gradient(135deg,#2620a8,#2563eb)', color: '#fff',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.30)',
                } : { color: 'rgba(147,197,253,0.55)' }}>
                {t === 'criteria' ? '📊 Criteria' : t === 'history' ? '📅 History' : '🤖 AI Insights'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              {tab === 'criteria' && (
                <div className="space-y-3">
                  {CRITERIA.map((c, i) => {
                    const score = criteriaScores[i]
                    const color = scoreColor(score)
                    return (
                      <div key={c.label} className="rounded-xl p-3.5"
                        style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{c.icon}</span>
                            <div>
                              <p className="text-xs font-bold text-white">{c.label}</p>
                              <p className="text-[9px]" style={{ color: 'rgba(147,197,253,0.4)', fontFamily: 'Tajawal, sans-serif' }}>{c.labelAr}</p>
                            </div>
                          </div>
                          <span className="text-sm font-black" style={{ color }}>{score}<span className="text-[9px] font-normal text-gray-600">/100</span></span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div className="h-full rounded-full"
                            initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.7, delay: i * 0.07 }}
                            style={{ background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 8px ${color}50` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {tab === 'history' && (
                <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <p className="text-xs font-bold text-white mb-4">Monthly Score Trend — {teacher.name.split(' ')[0]}</p>
                  <div className="flex items-end gap-2 h-36">
                    {monthlyData.map((score, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold" style={{ color: scoreColor(score) }}>{score}</span>
                        <motion.div className="w-full rounded-t-lg"
                          initial={{ height: 0 }} animate={{ height: `${((score - 60) / 40) * 100}%` }}
                          transition={{ duration: 0.6, delay: i * 0.08 }}
                          style={{ background: `linear-gradient(to top, #2620a880, #2563eb)`, maxHeight: '100%', minHeight: '8px' }} />
                        <span className="text-[8px] text-gray-600">{MONTHS[i]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 p-3 rounded-xl"
                    style={{ background: 'rgba(0, 174, 116,0.08)', border: `1px solid ${GOLD}25` }}>
                    <span className="text-sm">📈</span>
                    <p className="text-xs" style={{ color: GOLD }}>
                      Overall improvement of <strong>+{monthlyData[5] - monthlyData[0]} pts</strong> over 6 months
                    </p>
                  </div>
                </div>
              )}

              {tab === 'ai' && (
                <div className="space-y-3">
                  <div className="rounded-xl p-4" style={{ background: 'rgba(0, 174, 116,0.07)', border: `1px solid ${GOLD}25` }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>🤖 AI-Generated Insights</p>
                    <div className="space-y-2.5">
                      {AI_INSIGHTS.map((ins, i) => (
                        <div key={i} className="flex gap-2.5">
                          <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ background: i % 2 === 0 ? GOLD : ROYAL, height: '14px' }} />
                          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{ins}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Recommend Workshop', icon: '🎓', color: ROYAL },
                      { label: 'Send Commendation', icon: '🏅', color: GOLD },
                      { label: 'Schedule Review',   icon: '📅', color: '#34d399' },
                    ].map(a => (
                      <button key={a.label} className="rounded-xl p-3 text-center text-xs font-semibold transition-all hover:opacity-90"
                        style={{ background: `${a.color}15`, border: `1px solid ${a.color}30`, color: a.color }}>
                        <span className="text-lg block mb-1">{a.icon}</span>{a.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
