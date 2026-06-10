import { useContext } from 'react'
import { UserDataContext } from '../context/contexts'

export function useUserData() {
  const ctx = useContext(UserDataContext)
  if (ctx === null) throw new Error('useUserData must be used within a UserDataProvider')
  return ctx
}
