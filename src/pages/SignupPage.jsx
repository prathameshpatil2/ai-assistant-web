import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { signup as signupApi } from '../api/auth'
import useAuthStore from '../store/authStore'
import Orb from '../components/common/Orb'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'
import useColdStartPing from '../hooks/useColdStartPing'

function SignupPage() {
  const [name, setName] = useState('')
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
      const data = await signupApi(name, email, password)
      login({ name: data.name, email: data.email, userId: data.userId }, data.token)
      navigate('/chat')
    } catch (err) {
      setError('Could not create account. Try a different email.')
    } finally {
      clearTimeout(slowTimer)
      setLoading(false)
      setSlowLoading(false)
    }
  }

  const inputClass =
    'w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-2.5 text-[var(--color-text)] text-sm outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all'

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
        <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-1">Create your account</h1>
        <p className="text-[var(--color-text-muted)] mb-8 text-sm">Start chatting in a few seconds</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="At least 6 characters"
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
            {slowLoading ? 'Waking up the server…' : loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-text-muted)]">OR</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        <GoogleSignInButton />

        <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--color-text)] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default SignupPage