import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Check, MapPin, UserCog } from 'lucide-react'
import { Card, Pill, SectionHeader, StatCard } from '../components/ui/Primitives'
import { FormField } from '../components/ui/FormField'
import { ThemeToggle } from '../components/layout/ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import { useUserData } from '../hooks/useUserData'
import { updateProfile } from '../services/dataService'
import { CITIES, COUNTRIES } from '../data/countries'
import { isFirebaseConfigured } from '../firebase/config'

export default function Profile() {
  const { user } = useAuth()
  const { profile, points, level, stats } = useUserData()
  const [saved, setSaved] = useState(false)
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      displayName: profile.displayName || user?.displayName || '',
      country: profile.country || '',
      city: profile.city || '',
    },
  })

  const selectedCountry = watch('country')
  const cityOptions = CITIES.filter((c) => !selectedCountry || c.country === selectedCountry)

  const onSave = async (values) => {
    await updateProfile(user.uid, values)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <SectionHeader
        icon={UserCog}
        title="Profile & Settings"
        description="Manage your details and location to unlock personalised benchmarking."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold">Your details</h2>
          <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <FormField
              id="displayName"
              label="Display name"
              placeholder="Your name"
              {...register('displayName')}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="country" className="label">Country</label>
                <select id="country" className="input" {...register('country')}>
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="label">City</label>
                <select id="city" className="input" {...register('city')}>
                  <option value="">Select city</option>
                  {cityOptions.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="btn-primary">
                {saved ? <Check size={18} /> : <MapPin size={18} />}
                {saved ? 'Saved!' : 'Save changes'}
              </button>
              {saved ? <span className="text-sm text-eco-600">Profile updated.</span> : null}
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-lg font-bold">Account</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-earth-500">Email</dt>
                <dd className="font-medium">{user?.email || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-earth-500">Mode</dt>
                <dd>
                  <Pill tone={isFirebaseConfigured ? 'eco' : 'amber'}>
                    {isFirebaseConfigured ? 'Firebase' : 'Demo (local)'}
                  </Pill>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-earth-500">Theme</dt>
                <dd><ThemeToggle /></dd>
              </div>
            </dl>
          </Card>

          <StatCard icon={UserCog} label="Eco Points" value={points} sub={level.current.name} tone="violet" />
        </div>
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 text-lg font-bold">Lifetime stats</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Mini label="Footprints" value={stats.entries} />
          <Mini label="Current streak" value={`${stats.currentStreak}d`} />
          <Mini label="Goals done" value={stats.goalsCompleted} />
          <Mini label="Trees to offset" value={stats.treesOffset} />
        </div>
      </Card>
    </div>
  )
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl bg-eco-600/10 p-3 text-center">
      <p className="text-2xl font-extrabold text-eco-700 dark:text-eco-300">{value}</p>
      <p className="text-xs text-earth-500">{label}</p>
    </div>
  )
}
