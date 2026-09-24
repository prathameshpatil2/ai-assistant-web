import { useEffect, useState } from 'react'
import { API_URL } from '../api/config'

function useColdStartPing() {
  const [awake, setAwake] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then(() => setAwake(true))
      .catch(() => setAwake(false))
  }, [])

  return awake
}

export default useColdStartPing