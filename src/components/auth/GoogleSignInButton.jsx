import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { googleLogin } from '../../api/auth'
import useAuthStore from '../../store/authStore'

function GoogleSignInButton() {
  const buttonRef = useRef(null)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  useEffect(() => {
    if (!window.google) return

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const data = await googleLogin(response.credential)
          login({ name: data.name, email: data.email, userId: data.userId }, data.token)
          navigate('/chat')
        } catch (err) {
          console.error('Google login error:', err)
        }
      },
    })

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'filled_black',
      size: 'large',
      width: 320,
      shape: 'pill',
    })
  }, [])

  return <div ref={buttonRef} className="flex justify-center" />
}

export default GoogleSignInButton