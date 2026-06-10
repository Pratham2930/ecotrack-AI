import { useCallback, useEffect, useMemo, useState } from 'react'
import { onAuthChange, signIn, signOutUser, signUp } from '../services/authService'
import { ensureUserData } from '../services/dataService'
import { AuthContext } from './contexts'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u)
      setLoading(false)
      if (u) ensureUserData(u.uid, u).catch(() => {})
    })
    return () => {
      if (typeof unsub === 'function') unsub()
    }
  }, [])

  const register = useCallback(async (email, password, displayName) => {
    const u = await signUp(email, password, displayName)
    await ensureUserData(u.uid, u)
    return u
  }, [])

  const login = useCallback((email, password) => signIn(email, password), [])
  const logout = useCallback(() => signOutUser(), [])

  const value = useMemo(
    () => ({ user, loading, register, login, logout }),
    [user, loading, register, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
