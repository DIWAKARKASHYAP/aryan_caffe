import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function AdminLogin() {
  const { loginAdmin } = useApp()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginAdmin(password)) {
      setError(true)
      return
    }
    setError(false)
  }

  return (
    <div className="min-h-dvh bg-cream flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-5 animate-fade-in"
      >
        <div className="text-center">
          <span className="text-4xl">☕</span>
          <h1 className="font-display text-2xl font-bold text-espresso mt-2">Admin Login</h1>
          <p className="text-sm text-espresso/50 mt-1">Brew & Bean Dashboard</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-espresso/60 uppercase tracking-wide">
            Password
          </label>
          <div className="relative mt-1">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/30" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="Enter admin password"
              className="w-full rounded-xl border border-espresso/15 bg-cream pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber/30"
            />
          </div>
          {error && <p className="text-red-600 text-xs mt-1">Incorrect password</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-espresso text-cream py-3 font-semibold hover:bg-espresso/90"
        >
          Sign In
        </button>

        <p className="text-center text-xs text-espresso/30">Demo password: admin123</p>
      </form>
    </div>
  )
}
