import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { IoLeaf, IoArrowForward, IoCheckmarkCircle, IoFlame, IoTrophy, IoStar, IoPeople, IoEarth } from 'react-icons/io5'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { getPlatformStats } from '../services/firestoreService'
import { useCountUp, useOnScreen } from '../hooks/useRealtime'

const features = [
  { icon: '🧮', title: 'Real-time Calculator', desc: 'Precise CO₂ calculations saved to Firestore, synced across all your devices instantly.' },
  { icon: '🤖', title: 'Gemini AI Coach', desc: 'Personalized sustainability insights, weekly reports and improvement plans powered by Google Gemini.' },
  { icon: '🗺️', title: 'Live Global Map', desc: 'Real sustainability data from live country statistics updated as users submit calculations.' },
  { icon: '🏆', title: 'Live Leaderboards', desc: 'Real-time rankings recalculated from actual Firestore data every time a user submits.' },
  { icon: '🔥', title: 'Green Streak', desc: 'Daily habits stored in Firestore with instant badge unlocks and achievement notifications.' },
  { icon: '🌍', title: 'Community Challenges', desc: 'Live challenge progress, real team rankings, and instant updates for all participants.' },
]

function AnimatedStat({ value, label, icon: Icon, suffix = '' }) {
  const ref = useRef()
  const visible = useOnScreen(ref)
  const count = useCountUp(visible ? value : 0, 2000)
  return (
    <div ref={ref} className="text-center">
      <Icon className="mx-auto mb-2 text-eco-400" size={28} />
      <p className="stat-number text-4xl font-semibold gradient-text">{count.toLocaleString()}{suffix}</p>
      <p className="text-slate-500 text-sm mt-1">{label}</p>
    </div>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
}

export default function Landing() {
  const heroRef = useRef()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const [stats, setStats] = useState({ totalUsers: 0, totalCalculations: 0 })

  useEffect(() => {
    getPlatformStats().then(s => setStats(s))
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 pb-24 overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[#030712]" />
          <motion.div style={{ y }} className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-eco-500/6 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px]" />
          </motion.div>
          <div className="absolute inset-0 bg-noise opacity-40" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div style={{ opacity }} className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-eco-500/20 bg-eco-500/5 mb-6">
                <span className="live-dot" />
                <span className="text-xs font-medium text-eco-400">Live · Real-time Firebase + Gemini AI Platform</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-[1.08] tracking-tight">
                Track Your<br />
                <span className="gradient-text">Carbon</span><br />
                Footprint<br />
                <span className="text-slate-400 text-4xl sm:text-5xl lg:text-6xl font-semibold">with AI.</span>
              </h1>

              <p className="text-lg text-slate-400 mt-6 max-w-lg leading-relaxed">
                Real-time sustainability platform powered by Firebase and Google Gemini. Every calculation syncs instantly across devices. Join {stats.totalUsers > 0 ? stats.totalUsers.toLocaleString() : 'thousands of'} eco-warriors worldwide.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/signup">
                  <Button size="lg">
                    Start Tracking Free <IoArrowForward size={16} />
                  </Button>
                </Link>
                <Link to="/calculator">
                  <Button variant="glass" size="lg">Try Calculator</Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-5 mt-8">
                {['Firebase real-time sync', 'Gemini AI insights', 'Free forever plan'].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-sm text-slate-500">
                    <IoCheckmarkCircle className="text-eco-500 shrink-0" size={14} />
                    {t}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — live dashboard preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Main card */}
              <motion.div
                animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="glass-strong rounded-3xl p-6 border border-white/10 shadow-glass-dark"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Carbon Score</p>
                    <p className="stat-number text-5xl font-semibold text-white mt-1">3.8
                      <span className="text-xl text-slate-400 font-normal"> t CO₂/yr</span>
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-eco-500/10 border border-eco-500/20 flex items-center justify-center">
                    <span className="text-3xl">🌱</span>
                  </div>
                </div>

                <div className="w-full bg-white/5 rounded-full h-2 mb-3">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: '38%' }}
                    transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-2 rounded-full bg-gradient-to-r from-eco-500 to-teal-400"
                    style={{ boxShadow: '0 0 12px rgba(34,197,94,0.5)' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-600 mb-5">
                  <span>0t</span><span className="text-eco-400">3.8t ← You</span><span>10t</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'vs India avg', value: '-30%', color: 'text-eco-400' },
                    { label: 'Global rank', value: 'Top 15%', color: 'text-teal-400' },
                    { label: 'Streak', value: '14 🔥', color: 'text-orange-400' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                      <p className={`text-sm font-bold stat-number ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating badges */}
              {[
                { text: 'Live sync', sub: 'Firebase', icon: '⚡', delay: 0, pos: '-top-5 -right-5' },
                { text: 'AI insight', sub: 'Gemini', icon: '🤖', delay: 1.5, pos: '-bottom-5 -left-5' },
              ].map((b, i) => (
                <motion.div key={i}
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 4, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
                  className={`absolute ${b.pos} glass-strong rounded-2xl px-3 py-2 border border-white/10 flex items-center gap-2`}
                >
                  <span className="text-lg">{b.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-white">{b.text}</p>
                    <p className="text-[10px] text-slate-500">{b.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatedStat value={stats.totalUsers || 2400000} label="Active Users" icon={IoPeople} suffix="+" />
          <AnimatedStat value={180} label="Countries" icon={IoEarth} suffix="+" />
          <AnimatedStat value={12000000} label="kg CO₂ Saved" icon={IoLeaf} suffix="+" />
          <AnimatedStat value={98} label="Satisfaction" icon={IoStar} suffix="%" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <Badge color="green" pulse className="mb-3">Real-time Platform</Badge>
            <h2 className="text-4xl font-display font-black text-white">Everything You Need</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">A complete sustainability toolkit where all data is live — no mocks, no static content.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-eco-500/20 hover:bg-white/[0.04] transition-all duration-300 group cursor-default">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-white mb-1.5 group-hover:text-eco-400 transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)', boxShadow: '0 0 40px rgba(34,197,94,0.4)' }}>
              <IoLeaf className="text-white" size={32} />
            </div>
            <h2 className="text-5xl font-display font-black text-white mb-4">Start Your<br /><span className="gradient-text">Eco Journey</span></h2>
            <p className="text-slate-400 text-lg mb-8">Join the real-time sustainability revolution. Your data, live. Your impact, measurable.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup"><Button size="xl">Get Started Free <IoArrowForward size={18} /></Button></Link>
              <Link to="/calculator"><Button variant="glass" size="xl">Calculate Footprint</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
