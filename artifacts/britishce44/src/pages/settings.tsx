import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../components/providers/auth-provider'

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void }
function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button onClick={() => onChange(!checked)}
      className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
      style={{ background: checked ? 'linear-gradient(135deg,#6366f1,#7c3aed)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
        style={{ left: checked ? '18px' : '2px' }} />
    </button>
  )
}

interface SectionCardProps { icon: string; title: string; children: React.ReactNode }
function SectionCard({ icon, title, children }: SectionCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(13,20,37,0.7)', border: '1px solid rgba(99,102,241,0.12)' }}>
      <div className="px-5 py-3.5 border-b" style={{ borderColor: 'rgba(99,102,241,0.08)', background: 'rgba(6,11,24,0.5)' }}>
        <h3 className="font-bold text-white text-sm flex items-center gap-2"><span>{icon}</span>{title}</h3>
      </div>
      <div className="px-5 py-4 space-y-4">{children}</div>
    </div>
  )
}

function SettingRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-white/80">{label}</p>
        {hint && <p className="text-[10px] text-gray-600 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

const inputCls = "px-3 py-1.5 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', minWidth: 130 }

export function SettingsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  // Settings state
  const [twoFactor, setTwoFactor] = useState(true)
  const [aiAntiCheat, setAiAntiCheat] = useState(true)
  const [arabicDetection, setArabicDetection] = useState(true)
  const [autoLogout, setAutoLogout] = useState(30)
  const [emailReports, setEmailReports] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [liveAttendance, setLiveAttendance] = useState(true)
  const [recordByDefault, setRecordByDefault] = useState(false)
  const [allowStudentUpload, setAllowStudentUpload] = useState(true)
  const [language, setLanguage] = useState('English')
  const [timezone, setTimezone] = useState('AST (UTC+3)')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gradient-aurora">⚙️ Platform Settings</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure Britishce44 system-wide settings {!isAdmin && '(View only — Admin access required)'}
          </p>
        </div>
        <motion.button onClick={handleSave}
          whileTap={{ scale: 0.95 }}
          disabled={!isAdmin}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-40"
          style={{ background: saved ? 'linear-gradient(135deg,#059669,#065f46)' : 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff', boxShadow: '0 2px 12px rgba(99,102,241,0.3)' }}>
          {saved ? '✓ Saved!' : '💾 Save Changes'}
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        {/* Institution Info */}
        <SectionCard icon="🏫" title="Institution Info">
          <SettingRow label="School Name">
            <input className={inputCls} defaultValue="The First British Center" style={inputStyle} readOnly={!isAdmin} />
          </SettingRow>
          <SettingRow label="City / Country">
            <input className={inputCls} defaultValue="Taiz, Yemen" style={inputStyle} readOnly={!isAdmin} />
          </SettingRow>
          <SettingRow label="Timezone">
            <select className={inputCls} value={timezone} onChange={e => setTimezone(e.target.value)} style={inputStyle} disabled={!isAdmin}>
              <option>AST (UTC+3)</option>
              <option>UTC+0</option>
              <option>UTC+1</option>
              <option>UTC+4</option>
            </select>
          </SettingRow>
          <SettingRow label="Language">
            <select className={inputCls} value={language} onChange={e => setLanguage(e.target.value)} style={inputStyle} disabled={!isAdmin}>
              <option>English</option>
              <option>Arabic</option>
              <option>Bilingual</option>
            </select>
          </SettingRow>
          <SettingRow label="Max Classrooms">
            <input type="number" defaultValue={240} className={inputCls} style={{ ...inputStyle, minWidth: 80 }} readOnly={!isAdmin} />
          </SettingRow>
        </SectionCard>

        {/* Security */}
        <SectionCard icon="🔐" title="Security & Access">
          <SettingRow label="Two-Factor Auth" hint="All admin accounts must confirm OTP on login">
            <Toggle checked={twoFactor} onChange={isAdmin ? setTwoFactor : () => {}} />
          </SettingRow>
          <SettingRow label="AI Anti-Cheat Monitor" hint="Detects suspicious exam behavior via camera">
            <Toggle checked={aiAntiCheat} onChange={isAdmin ? setAiAntiCheat : () => {}} />
          </SettingRow>
          <SettingRow label="Arabic Language Detection" hint="Auto-alert teacher when student speaks Arabic">
            <Toggle checked={arabicDetection} onChange={isAdmin ? setArabicDetection : () => {}} />
          </SettingRow>
          <SettingRow label="Auto-Logout (minutes)" hint="Inactive sessions will be logged out">
            <input type="number" value={autoLogout} onChange={e => setAutoLogout(+e.target.value)}
              className={inputCls} style={{ ...inputStyle, minWidth: 80 }} disabled={!isAdmin} />
          </SettingRow>
          <SettingRow label="IP Whitelist" hint="Restrict to specific network ranges">
            <button className="text-[10px] text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-lg border border-indigo-500/20 transition">
              Configure →
            </button>
          </SettingRow>
        </SectionCard>

        {/* Notifications */}
        <SectionCard icon="🔔" title="Notifications">
          <SettingRow label="Email Reports" hint="Weekly performance reports via email">
            <Toggle checked={emailReports} onChange={isAdmin ? setEmailReports : () => {}} />
          </SettingRow>
          <SettingRow label="Push Notifications" hint="Browser push alerts for new messages">
            <Toggle checked={pushNotif} onChange={isAdmin ? setPushNotif : () => {}} />
          </SettingRow>
          <SettingRow label="SMS Alerts" hint="Critical alerts sent via SMS gateway">
            <Toggle checked={smsAlerts} onChange={isAdmin ? setSmsAlerts : () => {}} />
          </SettingRow>
          <SettingRow label="Notification Email">
            <input className={inputCls} defaultValue="admin@britishce44.edu" style={inputStyle} readOnly={!isAdmin} />
          </SettingRow>
          <SettingRow label="SMS Provider">
            <select className={inputCls} style={inputStyle} disabled={!isAdmin}>
              <option>Twilio</option><option>AWS SNS</option><option>Custom</option>
            </select>
          </SettingRow>
        </SectionCard>

        {/* Classroom Settings */}
        <SectionCard icon="🎓" title="Classroom Defaults">
          <SettingRow label="Auto-Record Sessions" hint="All classroom sessions are saved automatically">
            <Toggle checked={recordByDefault} onChange={isAdmin ? setRecordByDefault : () => {}} />
          </SettingRow>
          <SettingRow label="Live Attendance Tracking" hint="AI marks attendance from camera">
            <Toggle checked={liveAttendance} onChange={isAdmin ? setLiveAttendance : () => {}} />
          </SettingRow>
          <SettingRow label="Student File Upload" hint="Students can upload homework in classroom">
            <Toggle checked={allowStudentUpload} onChange={isAdmin ? setAllowStudentUpload : () => {}} />
          </SettingRow>
          <SettingRow label="Max Students / Room">
            <input type="number" defaultValue={40} className={inputCls} style={{ ...inputStyle, minWidth: 80 }} disabled={!isAdmin} />
          </SettingRow>
          <SettingRow label="Default Video Quality">
            <select className={inputCls} style={inputStyle} disabled={!isAdmin}>
              <option>1080p</option><option>720p</option><option>480p</option><option>Auto</option>
            </select>
          </SettingRow>
        </SectionCard>

        {/* AI Settings */}
        <SectionCard icon="🤖" title="AI Features">
          {[
            { label: 'AI Teacher Evaluation', hint: 'Automatically grade teacher performance', val: true },
            { label: 'Auto-Messaging AI', hint: 'AI sends progress alerts to parents', val: true },
            { label: 'AI Video Editor', hint: 'Auto-edit and trim classroom recordings', val: false },
            { label: 'Smart Exam Generator', hint: 'AI generates exam questions from syllabus', val: true },
            { label: 'Placement Test AI', hint: 'Adaptive placement test powered by AI', val: true },
          ].map(item => {
            const [on, setOn] = useState(item.val)
            return (
              <SettingRow key={item.label} label={item.label} hint={item.hint}>
                <Toggle checked={on} onChange={isAdmin ? setOn : () => {}} />
              </SettingRow>
            )
          })}
        </SectionCard>

        {/* Storage & Backup */}
        <SectionCard icon="💾" title="Storage & Backup">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Storage used</span><span className="text-white font-bold">142 GB / 500 GB</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: '28%', background: 'linear-gradient(90deg,#6366f1,#7c3aed)' }} />
            </div>
            <p className="text-[10px] text-gray-600">28% used · 358 GB remaining</p>
          </div>
          <SettingRow label="Auto-Backup">
            <Toggle checked={true} onChange={() => {}} />
          </SettingRow>
          <SettingRow label="Backup Frequency">
            <select className={inputCls} style={inputStyle} disabled={!isAdmin}>
              <option>Daily</option><option>Weekly</option><option>Hourly</option>
            </select>
          </SettingRow>
          <SettingRow label="Retention Period">
            <select className={inputCls} style={inputStyle} disabled={!isAdmin}>
              <option>90 days</option><option>180 days</option><option>1 year</option><option>Forever</option>
            </select>
          </SettingRow>
          {isAdmin && (
            <button className="w-full py-2 rounded-xl text-sm font-medium transition text-emerald-400 hover:text-emerald-300"
              style={{ border: '1px solid rgba(52,211,153,0.2)', background: 'rgba(52,211,153,0.04)' }}>
              🗄 Run Manual Backup Now
            </button>
          )}
        </SectionCard>
      </div>

      {/* Danger zone */}
      {isAdmin && (
        <div className="rounded-2xl p-5 space-y-3"
          style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <h3 className="text-sm font-bold text-red-400">⚠ Danger Zone</h3>
          <div className="flex flex-wrap gap-3">
            {[
              'Clear All Sessions', 'Reset Exam Results', 'Wipe Recordings', 'Factory Reset',
            ].map(action => (
              <button key={action}
                className="px-4 py-1.5 rounded-xl text-xs font-medium text-red-400 hover:text-white transition"
                style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.05)' }}>
                {action}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
