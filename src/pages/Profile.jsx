import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoPerson, IoLeaf, IoTrophy, IoPencil, IoCheckmarkCircle } from 'react-icons/io5'
import { useAuthStore } from '../store/useAuthStore'
import { Badge } from '../components/ui/Badge'
import { ProgressBar, CircularProgress } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'

const ACHIEVEMENTS = [
  { id: 'a1', name: 'Beginner Eco Hero', icon: '🌱', unlocked: true },
  { id: 'a2', name: 'Green Explorer', icon: '🌿', unlocked: true },
  { id: 'a3', name: 'Sustainability Champion', icon: '🏆', unlocked: false },
  { id: 'a4', name: 'Climate Guardian', icon: '🛡️', unlocked: false },
  { id: 'a5', name: 'Earth Protector', icon: '🌍', unlocked: false },
]

export default function Profile() {
  const { user, profile, updateProfile } = useAuthStore()
  const [editBio, setEditBio] = useState(false)
  const [bio, setBio] = useState(profile?.bio || '')
  const [saving, setSaving] = useState(false)

  const saveBio = async () => {
    setSaving(true)
    await updateProfile({ bio })
    setSaving(false)
    setEditBio(false)
    toast.success('Profile updated!')
  }

  const avatar = profile?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`
  const levelPct = ((profile?.ecoPoints || 0) % 1000) / 10

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <IoPerson className="text-eco-400" /> My Profile
        </h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          <span className="live-dot" /> Data synced from Firestore in real-time
        </p>
      </motion.div>

      {/* Profile hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="h-28 relative" style={{ background: 'linear-gradient(135deg, #052e16, #0d9488, #1e1b4b)' }}>
          <div className="absolute inset-0 bg-noise opacity-30" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <img src={avatar} alt="" className="w-20 h-20 rounded-2xl border-4 border-[#030712] object-cover shadow-lg" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{profile?.name || user?.displayName || 'User'}</h2>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge color="green">📍 {profile?.location || 'India'}</Badge>
                <Badge color="teal">Lvl {profile?.ecoLevel || 1} · {profile?.ecoLevelName || 'Beginner'}</Badge>
              </div>
            </div>
            <Button variant="secondary" size="sm" icon={<IoPencil size={13} />} onClick={() => toast('Edit coming soon!')}>Edit</Button>
          </div>
          <div className="mt-4">
            {editBio ? (
              <div className="space-y-2">
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2}
                  className="premium-input resize-none text-sm" placeholder="Your eco bio..." />
                <div className="flex gap-2">
                  <Button size="sm" loading={saving} onClick={saveBio}>Save</Button>
                  <Button variant="secondary" size="sm" onClick={() => setEditBio(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <p className="text-slate-400 text-sm flex-1">{bio || profile?.bio || 'No bio yet. Add one!'}</p>
                <button onClick={() => setEditBio(true)} className="text-slate-600 hover:text-eco-400 transition-colors shrink-0">
                  <IoPencil size={13} />
                </button>
              </div>
            )}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Level {profile?.ecoLevel || 1} Progress</span>
              <span className="stat-number">{levelPct.toFixed(0)}% · {(profile?.ecoPoints || 0) % 1000}/1000 XP</span>
            </div>
            <ProgressBar value={levelPct} max={100} color="gradient" size="md" glowColor="rgba(34,197,94,0.4)" />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { l: 'Carbon Score', v: `${(profile?.carbonScore || 0).toFixed(1)}t`, icon: '🌱' },
          { l: 'CO₂ Saved', v: `${(profile?.totalCO2Saved || 0).toFixed(0)}kg`, icon: '♻️' },
          { l: 'Current Streak', v: `${profile?.currentStreak || 0}d`, icon: '🔥' },
          { l: 'Global Rank', v: `#${(profile?.globalRank || 999999).toLocaleString()}`, icon: '🏆' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-4 text-center">
            <div className="text-3xl mb-1.5">{s.icon}</div>
            <p className="stat-number text-xl font-semibold text-white">{s.v}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><IoTrophy className="text-yellow-400" /> Achievements</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {ACHIEVEMENTS.map((a, i) => (
            <div key={a.id} className={`p-3 rounded-2xl border text-center ${a.unlocked ? 'border-eco-500/25 bg-eco-500/5' : 'border-white/[0.04] bg-white/[0.01] opacity-40'}`}>
              <div className={`text-3xl mb-1 ${!a.unlocked ? 'grayscale' : ''}`}>{a.unlocked ? a.icon : '🔒'}</div>
              <p className="text-[10px] font-medium text-slate-400 leading-tight">{a.name}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sustainability score */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #052e16, #0d9488)', border: '1px solid rgba(34,197,94,0.15)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl">Sustainability Score</h2>
            <p className="text-eco-200 text-sm mt-1">Based on your Firestore calculations</p>
          </div>
          <div className="text-center">
            <p className="stat-number text-5xl font-black">{profile?.sustainabilityScore || 0}</p>
            <p className="text-eco-200/60 text-xs">/ 100</p>
          </div>
        </div>
        <div className="mt-4 flex gap-4 flex-wrap">
          {[
            { l: 'Trees Equivalent', v: Math.floor((profile?.totalCO2Saved || 0) / 20), icon: '🌳' },
            { l: 'Challenges Done', v: profile?.completedChallenges || 0, icon: '🏆' },
            { l: 'Longest Streak', v: `${profile?.longestStreak || 0}d`, icon: '🔥' },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <div className="text-xl mb-0.5">{s.icon}</div>
              <p className="stat-number font-bold">{s.v}</p>
              <p className="text-xs text-eco-200/50">{s.l}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
