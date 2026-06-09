import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

type Channel = 'inapp' | 'email' | 'sms' | 'whatsapp' | 'telegram'
type Cat = 'all' | 'academic' | 'exams' | 'finance' | 'system'

const CHANNELS: { key: Channel; icon: string; label: string; color: string; on: boolean }[] = [
  { key: 'inapp', icon: '🔔', label: 'In-App', color: '#2563eb', on: true },
  { key: 'email', icon: '📧', label: 'Email', color: '#c8940a', on: true },
  { key: 'sms', icon: '📱', label: 'SMS', color: '#34d399', on: false },
  { key: 'whatsapp', icon: '🟢', label: 'WhatsApp', color: '#25d366', on: true },
  { key: 'telegram', icon: '✈️', label: 'Telegram', color: '#229ed9', on: false },
]

const FEED = [
  { id: 1, cat: 'exams', icon: '📝', color: '#a78bfa', title: 'Mid-term English exam scheduled', body: 'Grade 7 · Sunday 9:00 AM · Room #12', time: '2m ago', unread: true },
  { id: 2, cat: 'academic', icon: '🎓', color: '#2563eb', title: 'New recording available', body: 'Mathematics G5 — “Fractions Mastery” by Suhair', time: '18m ago', unread: true },
  { id: 3, cat: 'finance', icon: '💳', color: '#c8940a', title: 'Tuition reminder sent to 24 guardians', body: 'WhatsApp + Email · June cycle', time: '1h ago', unread: true },
  { id: 4, cat: 'system', icon: '🛡️', color: '#34d399', title: 'Anti-cheat flag resolved', body: 'Classroom #3 · reviewed by supervisor', time: '3h ago', unread: false },
  { id: 5, cat: 'academic', icon: '📋', color: '#67e8f9', title: 'Daily performance reports generated', body: '186 students · auto-delivered to parents', time: '5h ago', unread: false },
  { id: 6, cat: 'exams', icon: '✅', color: '#34d399', title: 'Placement test results ready', body: '12 new students placed across levels', time: 'Yesterday', unread: false },
]

const CATS: { key: Cat; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'academic', label: 'Academic' },
  { key: 'exams', label: 'Exams' }, { key: 'finance', label: 'Finance' }, { key: 'system', label: 'System' },
]

export function NotificationsPage() {
  const { t } = useI18n()
  const [channels, setChannels] = useState(CHANNELS)
  const [cat, setCat] = useState<Cat>('all')
  const [feed, setFeed] = useState(FEED)

  const visible = cat === 'all' ? feed : feed.filter(f => f.cat === cat)
  const unread = feed.filter(f => f.unread).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gradient-aurora">🔔 {t('nav.notifications')}</h2>
          <p className="text-sm text-gray-500 mt-0.5">One hub for every alert — in-app, email, SMS, WhatsApp & Telegram</p>
        </div>
        <button onClick={() => setFeed(f => f.map(x => ({ ...x, unread: false })))}
          className="text-[11px] font-bold px-3 py-2 rounded-xl text-white"
          style={{ background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(37,99,235,0.3)' }}>
          Mark all read · {unread} unread
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Channels */}
        <div className="rounded-2xl p-4 relative overflow-hidden"
          style={{ background: 'rgba(13,20,37,0.7)', border: '1px solid rgba(200,148,10,0.2)' }}>
          <div className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{ background: 'linear-gradient(90deg,transparent,#c8940a,transparent)' }} />
          <p className="text-xs font-bold text-white mb-3">📡 Delivery Channels</p>
          <div className="space-y-2">
            {channels.map(c => (
              <button key={c.key}
                onClick={() => setChannels(cs => cs.map(x => x.key === c.key ? { ...x, on: !x.on } : x))}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
                style={{ background: c.on ? `${c.color}1a` : 'rgba(255,255,255,0.03)', border: `1px solid ${c.on ? `${c.color}40` : 'rgba(255,255,255,0.05)'}` }}>
                <span className="text-base">{c.icon}</span>
                <span className="text-[11px] font-semibold text-white flex-1 text-left">{c.label}</span>
                <span className="w-9 h-5 rounded-full relative transition-all flex-shrink-0"
                  style={{ background: c.on ? c.color : 'rgba(255,255,255,0.1)' }}>
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: c.on ? '18px' : '2px' }} />
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/5">
            <p className="text-[9px] text-gray-500">Quiet hours · 10 PM – 6 AM (Yemen)</p>
          </div>
        </div>

        {/* Feed */}
        <div className="md:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(13,20,37,0.7)', border: '1px solid rgba(37,99,235,0.18)' }}>
          <div className="px-4 py-3 border-b flex items-center gap-2 flex-wrap" style={{ borderColor: 'rgba(37,99,235,0.1)' }}>
            {CATS.map(c => (
              <button key={c.key} onClick={() => setCat(c.key)}
                className="text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-all"
                style={{ background: cat === c.key ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.04)', color: cat === c.key ? '#fff' : '#94a3b8' }}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(37,99,235,0.06)' }}>
            {visible.map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="px-4 py-3 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: `${n.color}1a`, border: `1px solid ${n.color}33` }}>{n.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">{n.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{n.body}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[9px] text-gray-600">{n.time}</span>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
