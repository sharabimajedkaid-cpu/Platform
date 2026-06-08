import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../components/providers/auth-provider'

interface Message { id: string; sender: string; text: string; time: string; mine: boolean; read?: boolean }
interface Contact { id: string; name: string; role: string; online: boolean; unread?: number; lastMsg?: string; lastTime?: string; avatar?: string }

const ROLE_COLORS: Record<string, string> = {
  admin: '#f0a500', teacher: '#818cf8', student: '#67e8f9', supervisor: '#34d399', parent: '#fb923c',
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', sender: 'Admin Britishce44', text: 'Good morning! Platform is running smoothly today.', time: '09:15', mine: false, read: true },
    { id: 'm2', sender: 'You', text: 'Great news! I see 5 live classrooms active.', time: '09:17', mine: true, read: true },
    { id: 'm3', sender: 'Admin Britishce44', text: 'Yes! We have 42 active users right now.', time: '09:18', mine: false, read: true },
  ],
  '2': [
    { id: 'm1', sender: 'Suhair Almojahid', text: 'Good morning! My classroom is ready for today.', time: '08:30', mine: false, read: true },
    { id: 'm2', sender: 'You', text: 'Excellent! Students are waiting.', time: '08:32', mine: true, read: true },
  ],
  '3': [
    { id: 'm1', sender: 'Shihab Alomary', text: 'Can you help me with the exam setup?', time: 'Yesterday', mine: false, read: false },
  ],
  '4': [
    { id: 'm1', sender: 'Ahmed Nasser', text: 'Teacher, I have a question about homework.', time: '10:05', mine: false, read: false },
  ],
  '5': [
    { id: 'm1', sender: 'Supervisor Ali', text: 'Monthly report has been submitted.', time: '11:30', mine: false, read: true },
  ],
}

const CONTACTS: Contact[] = [
  { id: '1', name: 'Britishce44 Admin',  role: 'admin',      online: true,  unread: 0, lastMsg: 'Platform running smoothly', lastTime: '09:18' },
  { id: '2', name: 'T.Suhair Almojahid', role: 'teacher',    online: true,  unread: 0, lastMsg: 'Classroom is ready!',       lastTime: '08:32' },
  { id: '3', name: 'T.Shihab Alomary',   role: 'teacher',    online: false, unread: 1, lastMsg: 'Help with exam setup?',     lastTime: 'Yesterday' },
  { id: '4', name: 'Ahmed Nasser',        role: 'student',    online: true,  unread: 1, lastMsg: 'Question about homework',   lastTime: '10:05' },
  { id: '5', name: 'Supervisor Ali',      role: 'supervisor', online: true,  unread: 0, lastMsg: 'Report submitted',          lastTime: '11:30' },
]

function AvatarCircle({ name, role, size = 'md' }: { name: string; role: string; size?: 'sm' | 'md' | 'lg' }) {
  const color = ROLE_COLORS[role] || '#6b7280'
  const sizeMap = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-11 h-11 text-sm' }
  return (
    <div className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{ background: `${color}18`, color, border: `1.5px solid ${color}30` }}>
      {name.charAt(0)}
    </div>
  )
}

export function MessengerPage() {
  const { user } = useAuth()
  const [activeChat, setActiveChat] = useState<string>('1')
  const [inputVal, setInputVal] = useState('')
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES)
  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState(CONTACTS)
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  const activeContact = contacts.find(c => c.id === activeChat)
  const activeMessages = messages[activeChat] || []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages])

  const handleSend = () => {
    const text = inputVal.trim()
    if (!text) return
    const userName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'You'
    const newMsg: Message = {
      id: `m${Date.now()}`, sender: 'You', text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mine: true, read: false,
    }
    setMessages(prev => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), newMsg] }))
    setContacts(prev => prev.map(c => c.id === activeChat ? { ...c, lastMsg: text, lastTime: 'Now' } : c))
    setInputVal('')

    // Simulate reply typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const reply: Message = {
        id: `m${Date.now() + 1}`,
        sender: activeContact?.name || 'User',
        text: ['Got it, thanks! 👍', 'I will check that now.', 'Understood!', 'Sure, one moment.'][Math.floor(Math.random() * 4)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mine: false, read: false,
      }
      setMessages(prev => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), reply] }))
    }, 1800)
  }

  const openChat = (id: string) => {
    setActiveChat(id)
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div className="flex h-[calc(100vh-160px)] min-h-[500px] rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(99,102,241,0.15)' }}>

      {/* ── Sidebar ── */}
      <div className="w-72 flex flex-col flex-shrink-0"
        style={{ background: 'rgba(6,11,24,0.95)', borderRight: '1px solid rgba(99,102,241,0.1)' }}>

        {/* Header */}
        <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
          <h3 className="font-black text-white text-sm flex items-center gap-2">
            <span>💬</span> CE4 Messenger
            <span className="ml-auto text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
              {contacts.filter(c => c.online).length} online
            </span>
          </h3>
          <div className="mt-2.5 relative">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts…"
              className="w-full pl-7 pr-3 py-1.5 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.15)' }} />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 text-xs">🔍</span>
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto custom-scroll">
          {filtered.map(c => (
            <button key={c.id} onClick={() => openChat(c.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition"
              style={{
                background: activeChat === c.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                borderLeft: activeChat === c.id ? '2px solid #6366f1' : '2px solid transparent',
              }}>
              <div className="relative flex-shrink-0">
                <AvatarCircle name={c.name} role={c.role} />
                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${c.online ? 'bg-emerald-400' : 'bg-gray-600'}`}
                  style={{ borderColor: '#060b18' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                  <span className="text-[9px] text-gray-600 flex-shrink-0 ml-1">{c.lastTime}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[10px] text-gray-500 truncate flex-1">{c.lastMsg}</p>
                  {(c.unread ?? 0) > 0 && (
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0 ml-1"
                      style={{ background: '#6366f1' }}>{c.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-xs text-gray-600 py-8">No contacts found</p>
          )}
        </div>

        {/* Compose new */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(99,102,241,0.08)' }}>
          <button className="w-full py-2 rounded-xl text-xs font-bold transition"
            style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(124,58,237,0.2))', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
            ✏ New Group Chat
          </button>
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0" style={{ background: 'rgba(8,15,34,0.9)' }}>

        {/* Chat header */}
        {activeContact ? (
          <div className="flex items-center gap-3 px-5 py-3.5 shrink-0"
            style={{ background: 'rgba(6,11,24,0.8)', borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
            <AvatarCircle name={activeContact.name} role={activeContact.role} size="lg" />
            <div className="flex-1">
              <p className="font-bold text-white text-sm">{activeContact.name}</p>
              <p className="text-[10px] flex items-center gap-1.5" style={{ color: 'rgba(156,163,175,0.6)' }}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeContact.online ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                {activeContact.online ? 'Online' : 'Offline'} · {activeContact.role}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {['📞', '📹', '⋯'].map(icon => (
                <button key={icon}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scroll px-5 py-4 space-y-3">
          {activeMessages.map(m => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 ${m.mine ? 'flex-row-reverse' : ''}`}>
              {!m.mine && <AvatarCircle name={m.sender} role={activeContact?.role || 'student'} size="sm" />}
              <div className="max-w-[70%]">
                <div className="px-3.5 py-2.5 rounded-2xl text-sm"
                  style={m.mine ? {
                    background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff',
                    borderBottomRightRadius: 4, boxShadow: '0 2px 10px rgba(99,102,241,0.2)',
                  } : {
                    background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)',
                    borderBottomLeftRadius: 4, border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                  {m.text}
                </div>
                <p className={`text-[9px] text-gray-600 mt-1 ${m.mine ? 'text-right' : ''}`}>
                  {m.time} {m.mine && (m.read ? '✓✓' : '✓')}
                </p>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2">
                <AvatarCircle name={activeContact?.name || '?'} role={activeContact?.role || 'student'} size="sm" />
                <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', borderBottomLeftRadius: 4 }}>
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-500"
                        animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="px-4 py-3 shrink-0 flex items-center gap-2"
          style={{ background: 'rgba(6,11,24,0.8)', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
          {['😊', '📎'].map(icon => (
            <button key={icon} className="text-gray-600 hover:text-gray-400 text-lg transition flex-shrink-0">{icon}</button>
          ))}
          <input ref={inputRef} value={inputVal} onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={`Message ${activeContact?.name || ''}…`}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.15)' }} />
          <motion.button onClick={handleSend} disabled={!inputVal.trim()}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition disabled:opacity-30"
            style={{ background: inputVal.trim() ? 'linear-gradient(135deg,#6366f1,#7c3aed)' : 'rgba(99,102,241,0.15)', color: '#fff', boxShadow: inputVal.trim() ? '0 2px 10px rgba(99,102,241,0.3)' : 'none' }}>
            ➤
          </motion.button>
        </div>
      </div>
    </div>
  )
}
