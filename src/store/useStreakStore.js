import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { habitsList } from '../data/streakData'

const todayStr = () => new Date().toISOString().split('T')[0]

export const useStreakStore = create(
  persist(
    (set, get) => ({
      currentStreak: 14,
      longestStreak: 31,
      ecoPoints: 4280,
      completedHabits: { [todayStr()]: ['h1', 'h2', 'h3'] },
      lastActiveDate: todayStr(),

      toggleHabit: (habitId) => {
        const today = todayStr()
        const { completedHabits } = get()
        const todayHabits = completedHabits[today] || []
        const habit = habitsList.find(h => h.id === habitId)

        let newTodayHabits
        let pointsDelta = 0

        if (todayHabits.includes(habitId)) {
          newTodayHabits = todayHabits.filter(h => h !== habitId)
          pointsDelta = -(habit?.points || 0)
        } else {
          newTodayHabits = [...todayHabits, habitId]
          pointsDelta = habit?.points || 0
        }

        set(state => ({
          completedHabits: { ...state.completedHabits, [today]: newTodayHabits },
          ecoPoints: Math.max(0, state.ecoPoints + pointsDelta),
        }))
      },

      getTodayHabits: () => {
        const { completedHabits } = get()
        return completedHabits[todayStr()] || []
      },

      getTodayProgress: () => {
        const today = get().getTodayHabits()
        return { completed: today.length, total: habitsList.length, percent: Math.round((today.length / habitsList.length) * 100) }
      },
    }),
    { name: 'ecotrack-streak' }
  )
)
