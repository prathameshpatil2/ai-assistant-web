import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../api/auth'
import useAuthStore from '../store/authStore'
import Orb from '../components/common/Orb'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'
import useColdStartPing from '../hooks/useColdStartPing'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [slowLoading, setSlowLoading] = useState(false)

  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  useColdStartPing()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const slowTimer = setTimeout(() => setSlowLoading(true), 4000)
    try {
      const data = await loginApi(email, password)
      login({ name: data.name, email: data.email, userId: data.userId }, data.token)
      navigate('/chat')
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      clearTimeout(slowTimer)
      setLoading(false)
      setSlowLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute top-6 left-6 flex items-center gap-2 text-[var(--color-text-muted)] text-sm font-medium tracking-wide">
        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
        AI ASSISTANT
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 pointer-events-none">
        <Orb size={520} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass relative rounded-2xl p-10 w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-1">Welcome back</h1>
        <p className="text-[var(--color-text-muted)] mb-8 text-sm">Log in to continue to your chats</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-2.5 text-[var(--color-text)] text-sm outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-2.5 text-[var(--color-text)] text-sm outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-text)] text-[var(--color-bg)] rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {slowLoading ? 'Waking up the server…' : loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-text-muted)]">OR</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        <GoogleSignInButton />

        <div className="mt-6 text-center text-sm text-[var(--color-text-muted)] space-y-2">
          <p>
            <Link to="/forgot-password" className="hover:text-[var(--color-text)] transition-colors">
              Forgot password?
            </Link>
          </p>
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--color-text)] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage