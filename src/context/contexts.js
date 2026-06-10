import { createContext } from 'react'

/**
 * Context objects live in their own module so provider files can export only
 * components (required for React Fast Refresh / react-refresh lint rule).
 */
export const AuthContext = createContext(null)
export const ThemeContext = createContext(null)
export const UserDataContext = createContext(null)
