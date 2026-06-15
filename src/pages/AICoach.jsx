import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChatbubbleEllipses, IoSend, IoLeaf, IoRefresh } from 'react-icons/io5'
import { useAuthStore } from '../store/useAuthStore'
import { saveChatMessage, subscribeToChat } from '../services/firestoreService'
import { generateChatResponse, generateWeeklyReport, generateMonthlyRoadmap } from '../lib/gemini'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const SUGGESTIONS = [
  'How can I reduce my transport emissions?',
  'Give me food habit tips',
  'What\'s my biggest opportunity to reduce emissions?',
  'Create a 7-day eco challenge for me',
]

export default function AICoach() {
  const [tab, setTab] = useState('chat')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [weeklyReport, setWeeklyReport] = useState('')
  const [roadmap, setRoadmap] = useState('')
  const [loadingReport, setLoadingReport] = useState(false)
  const endRef = useRef()
  const { user, profile } = useAuthStore()

  // Load chat from Firestore
  useEffect(() => {
    if (!user?.uid) return
    const unsub = subscribeToChat(user.uid, (msgs) => {
      if (msgs.length === 0) {
        // Add welcome message
        setMessages([{
          id: 'welcome', role: 'ai',
          text: `Hi ${profile?.name?.split(' ')[0] || 'Eco Warrior'}! 🌱 I'm your AI Climate Coach powered by Google Gemini. I can see your footprint data and help you reduce your emissions. Ask me anything about sustainability!`,
          timestamp: new Date(),
        }])
      } else {
        setMessages(msgs.map(m => ({ ...m, timestamp: m.createdAt?.toDate?.() || new Date() })))
      }
    })
    return () => unsub()
  }, [user?.uid])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const userProfile = {
    name: profile?.name || 'User',
    totalCO2: (profile?.carbonScore || 0) * 1000,
    sustainabilityScore: profile?.sustainabilityScore || 50,
    currentStreak: profile?.currentStreak || 0,
    location: profile?.location || 'India',
    topCategory: 'Transportation',
  }

  const sendMessage = async (text) => {
    if (!text.trim() || thinking) return
    const userMsg = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setThinking(true)

    // Save user message to Firestore
    if (user?.uid) {
      await saveChatMessage(user.uid, { role: 'user', text }).catch(() => {})
    }

    const response = await generateChatResponse(text, messages.slice(-6), userProfile)
    const aiMsg = { id: (Date.now() + 1).toString(), role: 'ai', text: response, timestamp: new Date() }
    setMessages(prev => [...prev, aiMsg])

    // Save AI response to Firestore
    if (user?.uid) {
      await saveChatMessage(user.uid, { role: 'ai', text: response }).catch(() => {})
    }
    setThinking(false)
  }

  const loadWeeklyReport = async () => {
    setLoadingReport(true)
    const report = await generateWeeklyReport({
      totalCO2: (profile?.carbonScore || 0) * 1000 / 52,
      changePercent: -8,
      habitsCompleted: profile?.currentStreak ? 5 : 0,
      totalHabits: 7,
      topCategory: 'Transportation',
    }, userProfile)
    setWeeklyReport(report)
    setLoadingReport(false)
  }

  const loadRoadmap = async () => {
    setLoadingReport(true)
    const r = await generateMonthlyRoadmap({ weakestCategory: 'Transportation', strongestCategory: 'Food' }, userProfile)
    setRoadmap(r)
    setLoadingReport(false)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <IoChatbubbleEllipses className="text-eco-400" /> AI Climate Coach
        </h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          <span className="live-dot" /> Powered by Google Gemini · Chat history saved to Firestore
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl w-fit">
        {[['chat', '💬 Chat'], ['report', '📊 Weekly Report'], ['roadmap', '🗺️ Roadmap']].map(([t, l]) => (
          <button key={t} onClick={() => { setTab(t); if (t === 'report' && !weeklyReport) loadWeeklyReport(); if (t === 'roadmap' && !roadmap) loadRoadmap() }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-eco-500/15 text-eco-400 border border-eco-500/25' : 'text-slate-500 hover:text-slate-300'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'chat' && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col" style={{ height: 560 }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.05]">
            <div className="w-9 h-9 rounded-xl bg-eco-500/15 border border-eco-500/25 flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="text-sm font-semibold text-white">EcoTrack AI Coach</p>
              <div className="flex items-center gap-1.5">
                <span className="live-dot" />
                <span className="text-xs text-eco-400">Gemini AI · Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-eco-500/15 flex items-center justify-center shrink-0 mt-0.5">
                      <IoLeaf className="text-eco-400" size={13} />
                    </div>
                  )}
                  <div className={`max-w-sm lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-tr-sm'
                      : 'bg-white/[0.04] border border-white/[0.06] text-slate-300 rounded-tl-sm'
                  }`}
                    style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #16a34a, #0d9488)' } : {}}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {thinking && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-eco-500/15 flex items-center justify-center shrink-0">
                    <IoLeaf className="text-eco-400" size={13} />
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-eco-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 py-2 border-t border-white/[0.04]">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="shrink-0 px-3 py-1.5 text-xs bg-eco-500/8 border border-eco-500/15 text-eco-400 rounded-full hover:bg-eco-500/15 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/[0.05]">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
                placeholder="Ask your AI climate coach anything..."
                className="premium-input flex-1 text-sm" aria-label="Chat message" />
              <Button onClick={() => sendMessage(input)} disabled={!input.trim() || thinking} size="md" className="shrink-0 px-3">
                <IoSend size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {(tab === 'report' || tab === 'roadmap') && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-6">
          {loadingReport ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <LoadingSpinner size="lg" />
              <p className="text-slate-400 text-sm">Generating with Gemini AI...</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white">{tab === 'report' ? '📊 Weekly Sustainability Report' : '🗺️ Monthly Improvement Roadmap'}</h2>
                <Button variant="secondary" size="sm" icon={<IoRefresh size={13} />}
                  onClick={() => { if (tab === 'report') { setWeeklyReport(''); loadWeeklyReport() } else { setRoadmap(''); loadRoadmap() } }}>
                  Regenerate
                </Button>
              </div>
              <div className="space-y-2">
                {(tab === 'report' ? weeklyReport : roadmap).split('\n').filter(Boolean).map((line, i) => (
                  <p key={i} className={`text-sm leading-relaxed ${line.startsWith('•') || line.startsWith('Week') ? 'text-slate-200' : 'text-slate-400'}`}>
                    {line}
                  </p>
                ))}
              </div>
              <div className="mt-4 p-3 bg-eco-500/5 border border-eco-500/15 rounded-xl">
                <p className="text-xs text-eco-400/70">Generated by Google Gemini based on your Firestore profile data. Update your profile for more personalized insights.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
