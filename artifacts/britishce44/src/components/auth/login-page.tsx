
import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import toast from 'react-hot-toast'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('britishce44@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please enter email and password'); return }
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome to Britishce44!')
    } catch (err: any) {
      toast.error(err.message || 'Login failed')
    } finally { setLoading(false) }
  }

  if (showRegister) return <RegisterForm onBack={() => setShowRegister(false)} />

  return (
    <div className="h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 90% 90%, rgba(124,58,237,0.10) 0%, transparent 50%), linear-gradient(160deg, #060b18 0%, #0d1830 40%, #080f28 70%, #050a15 100%)' }}>

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f0a500, transparent)', filter: 'blur(40px)' }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Card */}
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(13, 20, 45, 0.80)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(99,102,241,0.18)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>

          {/* Top accent bar */}
          <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400" />

          <div className="p-8">
            {/* Logo + title */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #c47d00, #f0a500, #ffd166)', boxShadow: '0 8px 24px rgba(240,165,0,0.30)' }}>
                  <span className="text-[#060b18] font-black text-xl">B44</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2"
                  style={{ borderColor: '#0d1430', boxShadow: '0 0 8px rgba(52,211,153,0.6)' }} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Britishce44</h1>
              <p className="text-sm text-indigo-300/60 mt-1">Online Digital School · Taiz, Yemen</p>
              <p className="text-[10px] text-gray-600 mt-0.5">The First British Center Online</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-indigo-300/70 mb-1.5 uppercase tracking-widest">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.55)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.25)'}
                  placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-indigo-300/70 mb-1.5 uppercase tracking-widest">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.55)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.25)'}
                  placeholder="••••••••" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all mt-2"
                style={{
                  background: loading ? 'rgba(240,165,0,0.6)' : 'linear-gradient(135deg, #c47d00, #f0a500, #ffd166)',
                  color: '#060b18',
                  boxShadow: '0 4px 20px rgba(240,165,0,0.25)',
                }}>
                {loading ? '⚙ Signing in…' : '→ Sign In to Platform'}
              </button>

              <div className="text-center pt-1">
                <button type="button" onClick={() => setShowRegister(true)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition underline underline-offset-2">
                  New Student or Parent? Register Here
                </button>
              </div>

              {/* Demo credentials */}
              <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
                <p className="text-[9px] text-indigo-400/70 text-center font-mono">
                  Demo Admin: britishce44@gmail.com / admin123
                </p>
                <p className="text-[9px] text-gray-600 text-center font-mono mt-0.5">
                  Teacher: suhair.almojahid / teacher123
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[9px] text-gray-700 mt-4">
          Britishce44 Platform v2.1 · Taiz, Yemen · Est. 2020
        </p>
      </div>
    </div>
  )
}

function RegisterForm({ onBack }: { onBack: () => void }) {
  const { register } = useAuth()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    role: 'student', phone: '', address: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error('Please fill all required fields'); return
    }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register({ ...form, role: form.role as 'admin' | 'supervisor' | 'teacher' | 'student' | 'parent' })
      toast.success('Registration successful! Please login.')
      onBack()
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none transition bg-white/5 border border-indigo-500/20 placeholder-gray-600 focus:border-indigo-500/50"

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, #060b18 0%, #0d1830 50%, #060b18 100%)' }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden animate-slide-up"
        style={{ background: 'rgba(13,20,45,0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(99,102,241,0.18)', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}>
        <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400" />
        <div className="p-6">
          <h2 className="text-lg font-bold text-white mb-5 text-center">🎓 Student / Parent Registration</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 text-sm">
            <input placeholder="First Name *" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className={`${inputCls} col-span-1`} />
            <input placeholder="Last Name *" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className={`${inputCls} col-span-1`} />
            <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`${inputCls} col-span-2`} />
            <input type="password" placeholder="Password *" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={`${inputCls} col-span-1`} />
            <input type="password" placeholder="Confirm Password *" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className={`${inputCls} col-span-1`} />
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className={`${inputCls} col-span-2 bg-[#0d1430]`}>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
            <input placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={`${inputCls} col-span-2`} />
            <textarea placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
              className={`${inputCls} col-span-2`} rows={2} />
            <div className="flex gap-3 col-span-2 mt-2">
              <button type="button" onClick={onBack}
                className="flex-1 rounded-xl py-2.5 text-sm text-gray-400 hover:text-white transition border border-white/10 hover:border-white/20">
                ← Back to Login
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold transition"
                style={{ background: 'linear-gradient(135deg, #c47d00, #f0a500)', color: '#060b18' }}>
                {loading ? '⚙ Registering…' : '✅ Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
