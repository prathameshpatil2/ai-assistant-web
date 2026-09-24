import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword, resetPassword } from '../api/auth'
import Orb from '../components/common/Orb'

function ForgotPasswordPage() {
  const [step, setStep] = useState('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const inputClass =
    'w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-2.5 text-[var(--color-text)] text-sm outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all'

  const handleRequestCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setStep('reset')
    } catch (err) {
      setError('Could not send reset code. Check the email and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email, code, newPassword)
      navigate('/login')
    } catch (err) {
      setError('Invalid or expired code. Please try again.')
    } finally {
      setLoading(false)
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
        {step === 'request' ? (
          <>
            <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-1">Reset password</h1>
            <p className="text-[var(--color-text-muted)] mb-8 text-sm">
              Enter your email and we'll send you a reset code
            </p>

            <form onSubmit={handleRequestCode} className="space-y-4">
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

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--color-text)] text-[var(--color-bg)] rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send reset code'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-1">Enter reset code</h1>
            <p className="text-[var(--color-text-muted)] mb-8 text-sm">
              We sent a 6-digit code to {email}. It expires in 15 minutes.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Reset code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={inputClass}
                  placeholder="123456"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">New password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="At least 6 characters"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--color-text)] text-[var(--color-bg)] rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Resetting…' : 'Reset password'}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          <p>
            Remembered your password?{' '}
            <Link to="/login" className="text-[var(--color-text)] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordPage