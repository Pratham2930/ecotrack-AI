import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import { AuthContext, UserDataContext } from '../context/contexts'
import { getLevel } from '../utils/gamification'
import { offsetEquivalents } from '../utils/carbon'

function renderDashboard(userData) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: { uid: 'u1', email: 'a@b.com' } }}>
        <UserDataContext.Provider value={userData}>
          <Dashboard />
        </UserDataContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

const baseData = {
  loading: false,
  entries: [],
  latest: null,
  totalMonthly: 0,
  score: 0,
  offsets: offsetEquivalents(0),
  streak: { currentStreak: 0, longestStreak: 0 },
  level: getLevel(0),
  points: 0,
}

describe('Dashboard', () => {
  it('shows a loader while data loads', () => {
    renderDashboard({ ...baseData, loading: true })
    expect(screen.getByText(/loading your dashboard/i)).toBeInTheDocument()
  })

  it('renders the empty state when no footprint is logged', () => {
    renderDashboard(baseData)
    expect(screen.getByText(/no footprint logged yet/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open calculator/i })).toBeInTheDocument()
  })

  it('renders KPIs once a footprint exists', () => {
    const latest = {
      date: '2024-05-01',
      total: 320,
      score: 84,
      inputs: { transport: { car: 100 }, energy: {}, diet: 'vegan', waste: {} },
    }
    renderDashboard({
      ...baseData,
      entries: [latest],
      latest,
      totalMonthly: 320,
      score: 84,
      offsets: offsetEquivalents(320),
      points: 150,
      level: getLevel(150),
    })
    expect(screen.getByRole('heading', { name: /^Dashboard$/i })).toBeInTheDocument()
    expect(screen.getByText('84/100')).toBeInTheDocument()
    expect(screen.getByText(/eco points/i)).toBeInTheDocument()
  })
})
