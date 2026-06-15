import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoSettings, IoMoon, IoSunny, IoNotifications, IoAccessibility, IoTrash } from 'react-icons/io5'
import { useAuthStore } from '../store/useAuthStore'
import { useThemeStore } from '../store/useThemeStore'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'

function Toggle({ checked, onChange, id, label, description }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-slate-200 cursor-pointer">{label}</label>
        {description && <p className="text-xs text-slate-600 mt-0.5">{description}</p>}
      </div>
      <button id={id} role="switch" aria-checked={checked} onClick={onChange}
        className={`relative w-10 h-5.5 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-eco-500 ${checked ? 'bg-eco-500' : 'bg-white/10'}`}
        style={{ height: '22px' }}>
        <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4.5' : ''}`}
          style={{ width: '17px', height: '17px', transform: checked ? 'translateX(18px)' : 'translateX(0)' }} />
      </button>
    </div>
  )
}

export default function Settings() {
  const { profile, updateProfile } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()
  const [prefs, setPrefs] = useState(profile?.preferences || {})
  const [name, setName] = useState(profile?.name || '')
  const [location, setLocation] = useState(profile?.location || '')

  const updatePref = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] }
    setPrefs(updated)
    updateProfile({ preferences: updated })
    toast.success('Setting saved to Firestore!')
  }

  const saveProfile = async () => {
    await updateProfile({ name, location })
    toast.success('Profile saved!')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <IoSettings className="text-eco-400" /> Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Preferences saved to Firestore · sync across devices</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
        <h2 className="font-semibold text-white mb-4">👤 Profile Settings</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="premium-input text-sm" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} className="premium-input text-sm" placeholder="City, Country" />
          </div>
          <Button size="sm" onClick={saveProfile}>Save to Firestore</Button>
        </div>
      </motion.div>

      {[
        {
          title: '🎨 Appearance', delay: 0.1,
          items: [{ label: 'Dark Mode', desc: 'Use dark theme', checked: isDark, onChange: toggleTheme }],
        },
        {
          title: '🔔 Notifications', delay: 0.15,
          items: [
            { label: 'Push Notifications', desc: 'Habit reminders and challenge updates', checked: !!prefs.notifications, onChange: () => updatePref('notifications') },
            { label: 'Weekly Email Reports', desc: 'Sustainability summary every Sunday', checked: !!prefs.emailReports, onChange: () => updatePref('emailReports') },
          ],
        },
        {
          title: '♿ Accessibility', delay: 0.2,
          items: [
            { label: 'Reduce Motion', desc: 'Minimize animations for accessibility', checked: !!prefs.reducedMotion, onChange: () => updatePref('reducedMotion') },
            { label: 'Large Text', desc: 'Increase base font size', checked: !!prefs.largeText, onChange: () => updatePref('largeText') },
          ],
        },
      ].map(section => (
        <motion.div key={section.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: section.delay }}
          className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
          <h2 className="font-semibold text-white mb-1">{section.title}</h2>
          {section.items.map((item, i) => <Toggle key={i} id={`${section.title}-${i}`} {...item} />)}
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-red-500/5 rounded-2xl border border-red-500/15 p-5">
        <h2 className="font-semibold text-red-400 mb-2 flex items-center gap-2"><IoTrash size={16} /> Danger Zone</h2>
        <p className="text-xs text-red-400/70 mb-4">Irreversible actions. Proceed with caution.</p>
        <div className="flex gap-3 flex-wrap">
          <Button variant="danger" size="sm" onClick={() => toast.error('Export coming soon!')}>Export My Data</Button>
          <Button variant="danger" size="sm" onClick={() => toast.error('Deletion disabled in demo')}>Delete Account</Button>
        </div>
      </motion.div>
    </div>
  )
}
