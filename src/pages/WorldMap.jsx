import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoMap } from 'react-icons/io5'
import { subscribeToCountryStats } from '../services/firestoreService'
import { Badge } from '../components/ui/Badge'

const STATIC_DATA = [
  { name: 'India', lat: 20.5937, lng: 78.9629, score: 76, emissions: 1.9, renewable: 42, trend: 'improving' },
  { name: 'China', lat: 35.8617, lng: 104.1954, score: 52, emissions: 8.1, renewable: 29, trend: 'improving' },
  { name: 'USA', lat: 37.0902, lng: -95.7129, score: 38, emissions: 14.5, renewable: 22, trend: 'stable' },
  { name: 'Germany', lat: 51.1657, lng: 10.4515, score: 65, emissions: 7.9, renewable: 46, trend: 'improving' },
  { name: 'Brazil', lat: -14.235, lng: -51.9253, score: 72, emissions: 2.7, renewable: 83, trend: 'stable' },
  { name: 'UK', lat: 55.3781, lng: -3.436, score: 61, emissions: 5.6, renewable: 43, trend: 'improving' },
  { name: 'Japan', lat: 36.2048, lng: 138.2529, score: 55, emissions: 9.0, renewable: 20, trend: 'stable' },
  { name: 'Australia', lat: -25.2744, lng: 133.7751, score: 34, emissions: 15.2, renewable: 28, trend: 'improving' },
  { name: 'Norway', lat: 60.472, lng: 8.4689, score: 88, emissions: 7.5, renewable: 98, trend: 'improving' },
  { name: 'Sweden', lat: 60.1282, lng: 18.6435, score: 86, emissions: 3.5, renewable: 54, trend: 'improving' },
  { name: 'Ethiopia', lat: 9.145, lng: 40.4897, score: 91, emissions: 0.1, renewable: 91, trend: 'stable' },
  { name: 'Canada', lat: 56.1304, lng: -106.3468, score: 36, emissions: 13.6, renewable: 67, trend: 'stable' },
  { name: 'France', lat: 46.2276, lng: 2.2137, score: 67, emissions: 5.2, renewable: 20, trend: 'stable' },
  { name: 'Russia', lat: 61.524, lng: 105.3188, score: 29, emissions: 11.4, renewable: 18, trend: 'declining' },
  { name: 'Denmark', lat: 56.2639, lng: 9.5018, score: 84, emissions: 5.8, renewable: 80, trend: 'improving' },
]

function scoreColor(s) {
  if (s >= 80) return '#16a34a'
  if (s >= 60) return '#22c55e'
  if (s >= 40) return '#eab308'
  if (s >= 20) return '#f97316'
  return '#ef4444'
}

export default function WorldMap() {
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('score')
  const [liveStats, setLiveStats] = useState([])
  const [LeafletMap, setLeafletMap] = useState(null)

  useEffect(() => {
    const unsub = subscribeToCountryStats((stats) => setLiveStats(stats))
    return () => unsub()
  }, [])

  useEffect(() => {
    import('react-leaflet').then(mod => setLeafletMap(mod)).catch(() => {})
  }, [])

  // Merge static + live data
  const mergedData = STATIC_DATA.map(c => {
    const live = liveStats.find(s => s.country === c.name)
    return { ...c, liveUsers: live?.totalUsers || 0, liveCO2Avg: live ? (live.totalCO2 / live.totalUsers).toFixed(1) : null }
  })

  const getColor = (c) => mode === 'score' ? scoreColor(c.score) : scoreColor(100 - Math.min(100, c.emissions * 5))
  const getRadius = (c) => mode === 'emissions' ? Math.min(40, c.emissions * 2 + 8) : 18

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <IoMap className="text-eco-400" /> Carbon Footprint World Map
        </h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          <span className="live-dot" /> Country user stats from Firestore · updates as users submit calculations
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1.5 bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl">
          {[['score', '🌱 Sustainability Score'], ['emissions', '🌡️ CO₂ Emissions']].map(([m, l]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-eco-500/15 text-eco-400 border border-eco-500/25' : 'text-slate-500 hover:text-slate-300'}`}>
              {l}
            </button>
          ))}
        </div>
        <Badge color="green" pulse>{liveStats.length} countries with live data</Badge>
      </div>

      {/* Map container */}
      <div className="rounded-2xl overflow-hidden border border-white/[0.06] relative" style={{ height: 440 }}>
        {LeafletMap ? (
          <LeafletMap.MapContainer center={[25, 10]} zoom={2} className="w-full h-full" style={{ background: '#030712' }}>
            <LeafletMap.TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap' />
            {mergedData.map((c, i) => (
              <LeafletMap.CircleMarker key={i} center={[c.lat, c.lng]} radius={getRadius(c)}
                pathOptions={{ fillColor: getColor(c), color: getColor(c), fillOpacity: 0.75, weight: 2 }}
                eventHandlers={{ click: () => setSelected(c) }}>
                <LeafletMap.Tooltip direction="top" opacity={0.95}>
                  <b>{c.name}</b><br />
                  {mode === 'score' ? `Score: ${c.score}/100` : `${c.emissions}t CO₂/yr`}
                  {c.liveUsers > 0 && <><br />{c.liveUsers} EcoTrack users</>}
                </LeafletMap.Tooltip>
              </LeafletMap.CircleMarker>
            ))}
          </LeafletMap.MapContainer>
        ) : (
          <div className="w-full h-full bg-[#030712] flex items-center justify-center">
            <div className="text-center text-slate-600">
              <div className="text-6xl mb-3">🗺️</div>
              <p className="font-semibold text-slate-400">Loading interactive map...</p>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] rounded-2xl border border-eco-500/20 p-5 shadow-eco-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-white">{selected.name}</h3>
            <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white text-xl">×</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { l: 'Sustainability Score', v: `${selected.score}/100`, c: scoreColor(selected.score) },
              { l: 'CO₂ per capita', v: `${selected.emissions}t/yr`, c: scoreColor(100 - selected.emissions * 5) },
              { l: 'Renewable Energy', v: `${selected.renewable}%`, c: '#22c55e' },
              { l: 'EcoTrack Users', v: selected.liveUsers > 0 ? selected.liveUsers.toLocaleString() : 'None yet', c: '#14b8a6' },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-xl p-3">
                <p className="text-xs text-slate-500">{item.l}</p>
                <p className="stat-number font-bold text-lg mt-0.5 capitalize" style={{ color: item.c }}>{item.v}</p>
              </div>
            ))}
          </div>
          {selected.liveUsers > 0 && selected.liveCO2Avg && (
            <div className="mt-3 p-3 bg-eco-500/5 rounded-xl border border-eco-500/15">
              <p className="text-xs text-eco-400">📊 EcoTrack data: Average user footprint in {selected.name} = <strong>{selected.liveCO2Avg}t CO₂/yr</strong></p>
            </div>
          )}
        </motion.div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {[...mergedData].sort((a, b) => b.score - a.score).map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            onClick={() => setSelected(c)}
            className="bg-white/[0.02] rounded-xl border border-white/[0.05] p-3.5 cursor-pointer hover:border-eco-500/20 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-200">{c.name}</span>
              <span className="text-xs stat-number" style={{ color: scoreColor(c.score) }}>#{i + 1}</span>
            </div>
            <div className="flex gap-2 mb-1.5">
              <div><p className="text-[10px] text-slate-600">Score</p><p className="stat-number text-sm font-bold" style={{ color: scoreColor(c.score) }}>{c.score}</p></div>
              <div><p className="text-[10px] text-slate-600">CO₂/yr</p><p className="stat-number text-sm font-bold text-slate-400">{c.emissions}t</p></div>
              {c.liveUsers > 0 && <div><p className="text-[10px] text-slate-600">Users</p><p className="stat-number text-sm font-bold text-eco-400">{c.liveUsers}</p></div>}
            </div>
            <div className="w-full bg-white/5 rounded-full h-1">
              <div className="h-1 rounded-full" style={{ width: `${c.score}%`, backgroundColor: scoreColor(c.score) }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
