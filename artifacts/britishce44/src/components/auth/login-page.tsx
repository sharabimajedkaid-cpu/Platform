
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
    <div className="h-screen flex items-center justify-center navy-gradient p-4">
      <div className="glass-panel max-w-md w-full rounded-2xl p-8 shadow-2xl animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-navy font-black text-2xl">B44</span>
          </div>
          <h1 className="text-2xl font-bold text-navy">Britishce44</h1>
          <p className="text-sm text-gray-500">Online Digital School · Taiz Yemen</p>
          <p className="text-xs text-gray-400 mt-1">The First British Center Online</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold outline-none"
              placeholder="britishce44@gmail.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold outline-none"
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full gold-gradient text-navy font-bold py-2.5 rounded-xl shadow-md hover:shadow-lg transition text-sm disabled:opacity-50">
            {loading ? 'Signing in...' : ' Sign In to Platform'}
          </button>
          <div className="text-center">
            <button type="button" onClick={() => setShowRegister(true)}
              className="text-xs text-royal-blue underline hover:text-gold">
              New Student or Parent? Register Here
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Demo: britishce44@gmail.com / admin123<br />
            Teachers: suhair.almojahid / teacher123
          </p>
        </form>
      </div>
    </div>
  )
}

function RegisterForm({ onBack }: { onBack: () => void }) {
  const { register } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'student', phone: '', address: '' })
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

  return (
    <div className="min-h-screen flex items-center justify-center navy-gradient p-4">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 shadow-2xl my-4 animate-fade-in">
        <h2 className="text-xl font-bold text-navy mb-4 text-center"> Student / Parent Registration</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 text-sm">
          <input placeholder="First Name *" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2 sm:col-span-1" />
          <input placeholder="Last Name *" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2 sm:col-span-1" />
          <input type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2" />
          <input type="password" placeholder="Password *" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2 sm:col-span-1" />
          <input type="password" placeholder="Confirm Password *" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2 sm:col-span-1" />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2">
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
          <input placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2" />
          <textarea placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2" rows={2} />
          <div className="flex gap-3 col-span-2 mt-2">
            <button type="button" onClick={onBack}
              className="flex-1 border rounded-xl py-2 text-sm hover:bg-gray-50 transition">← Back to Login</button>
            <button type="submit" disabled={loading}
              className="flex-1 gold-gradient text-navy font-bold rounded-xl py-2 text-sm hover:shadow-md transition disabled:opacity-50">
              {loading ? 'Registering...' : '✅ Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
