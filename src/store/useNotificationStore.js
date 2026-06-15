import { create } from 'zustand'
import { subscribeToNotifications, markNotificationRead } from '../services/firestoreService'

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  unsubscribe: null,

  init: (uid) => {
    const { unsubscribe: prev } = get()
    if (prev) prev()
    const unsub = subscribeToNotifications(uid, (notifs) => {
      set({ notifications: notifs, unreadCount: notifs.filter(n => !n.read).length })
    })
    set({ unsubscribe: unsub })
  },

  markRead: async (id) => {
    await markNotificationRead(id)
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
  },

  markAllRead: () => {
    const { notifications } = get()
    notifications.forEach(n => { if (!n.read) markNotificationRead(n.id) })
    set({ notifications: [], unreadCount: 0 })
  },

  cleanup: () => {
    const { unsubscribe } = get()
    if (unsubscribe) unsubscribe()
    set({ unsubscribe: null })
  },
}))
