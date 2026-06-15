import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth, googleProvider, githubProvider } from '../lib/firebase'
import { createUserProfile, subscribeToUserProfile, updateUserProfile } from '../services/firestoreService'

export const useAuthStore = create(
  subscribeWithSelector((set, get) => ({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: true,
    profileUnsubscribe: null,

    // Initialize auth listener
    initAuth: () => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          set({ user: firebaseUser, isAuthenticated: true, isLoading: false })
          // Subscribe to Firestore profile
          const profileUnsub = subscribeToUserProfile(firebaseUser.uid, (profile) => {
            set({ profile })
          })
          set({ profileUnsubscribe: profileUnsub })
        } else {
          const { profileUnsubscribe } = get()
          if (profileUnsubscribe) profileUnsubscribe()
          set({ user: null, profile: null, isAuthenticated: false, isLoading: false, profileUnsubscribe: null })
        }
      })
      return unsubscribe
    },

    login: async (email, password) => {
      set({ isLoading: true })
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        // Update last active
        await updateUserProfile(user.uid, { lastActiveAt: new Date() }).catch(() => {})
        return { success: true }
      } catch (error) {
        set({ isLoading: false })
        return { success: false, error: getAuthError(error.code) }
      }
    },

    signup: async (name, email, password) => {
      set({ isLoading: true })
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(user, { displayName: name })
        await createUserProfile(user.uid, { name, email, photoURL: user.photoURL })
        return { success: true }
      } catch (error) {
        set({ isLoading: false })
        return { success: false, error: getAuthError(error.code) }
      }
    },

    loginWithGoogle: async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider)
        const { user } = result
        await createUserProfile(user.uid, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
        return { success: true }
      } catch (error) {
        return { success: false, error: getAuthError(error.code) }
      }
    },

    loginWithGithub: async () => {
      try {
        const result = await signInWithPopup(auth, githubProvider)
        const { user } = result
        await createUserProfile(user.uid, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
        return { success: true }
      } catch (error) {
        return { success: false, error: getAuthError(error.code) }
      }
    },

    logout: async () => {
      const { profileUnsubscribe } = get()
      if (profileUnsubscribe) profileUnsubscribe()
      await signOut(auth)
      set({ user: null, profile: null, isAuthenticated: false, profileUnsubscribe: null })
    },

    resetPassword: async (email) => {
      try {
        await sendPasswordResetEmail(auth, email)
        return { success: true }
      } catch (error) {
        return { success: false, error: getAuthError(error.code) }
      }
    },

    updateProfile: async (updates) => {
      const { user } = get()
      if (!user) return
      await updateUserProfile(user.uid, updates)
    },
  }))
)

function getAuthError(code) {
  const errors = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return errors[code] || 'Authentication failed. Please try again.'
}
