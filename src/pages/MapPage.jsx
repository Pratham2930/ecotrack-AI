import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Map as MapIcon } from 'lucide-react'
import { Card, SectionHeader } from '../components/ui/Primitives'
import { ScoreLineChart } from '../components/charts/Charts'
import { COUNTRIES } from '../data/countries'
import { formatKg } from '../utils/carbon'

function scoreColor(score) {
  if (score >= 75) return '#10b981'
  if (score >= 60) return '#84cc16'
  if (score >= 45) return '#f59e0b'
  if (score >= 30) return '#f97316'
  return '#ef4444'
}

const LEGEND = [
  { color: '#10b981', label: 'Excellent (75+)' },
  { color: '#84cc16', label: 'Good (60–74)' },
  { color: '#f59e0b', label: 'Fair (45–59)' },
  { color: '#f97316', label: 'Poor (30–44)' },
  { color: '#ef4444', label: 'Critical (<30)' },
]

export default function MapPage() {
  const [selected, setSelected] = useState(
    () => [...COUNTRIES].sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)[0],
  )

  // Synthetic regional trend for the selected country (deterministic).
  const trend = useMemo(() => {
    if (!selected) return []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map((label, i) => ({
      label,
      score: Math.max(
        0,
        Math.min(100, Math.round(selected.sustainabilityScore - 4 + ((i * 7 + selected.code.length) % 9))),
      ),
    }))
  }, [selected])

  return (
    <div>
      <SectionHeader
        icon={MapIcon}
        title="Carbon Footprint World Map"
        description="Explore country sustainability scores, renewable adoption and regional carbon trends."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden p-0 lg:col-span-2">
          <div className="h-[500px] w-full">
            <MapContainer
              center={[20, 10]}
              zoom={2}
              minZoom={2}
              scrollWheelZoom
              style={{ height: '100%', width: '100%' }}
              worldCopyJump
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {COUNTRIES.map((c) => (
                <CircleMarker
                  key={c.code}
                  center={[c.lat, c.lng]}
                  radius={8 + (100 - c.sustainabilityScore) / 8}
                  pathOptions={{
                    color: scoreColor(c.sustainabilityScore),
                    fillColor: scoreColor(c.sustainabilityScore),
                    fillOpacity: 0.6,
                    weight: 2,
                  }}
                  eventHandlers={{ click: () => setSelected(c) }}
                >
                  <Tooltip>{`${c.flag} ${c.name} — score ${c.sustainabilityScore}`}</Tooltip>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">
                        {c.flag} {c.name}
                      </p>
                      <p>Avg footprint: {formatKg(c.monthlyAvgKg)}/mo</p>
                      <p>Renewables: {c.renewablePct}%</p>
                      <p>Score: {c.sustainabilityScore}/100</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </Card>

        {/* Side panel */}
        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-earth-500">Legend</h2>
            <ul className="space-y-2">
              {LEGEND.map((l) => (
                <li key={l.label} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-full" style={{ background: l.color }} />
                  {l.label}
                </li>
              ))}
            </ul>
          </Card>

          {selected ? (
            <Card>
              <h2 className="text-lg font-bold">
                <span aria-hidden="true">{selected.flag}</span> {selected.name}
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <Stat label="Avg footprint" value={formatKg(selected.monthlyAvgKg)} />
                <Stat label="Renewables" value={`${selected.renewablePct}%`} />
                <Stat label="Per-capita/yr" value={`${selected.perCapitaAnnualT} t`} />
                <Stat label="Score" value={`${selected.sustainabilityScore}/100`} />
              </div>
              <h3 className="mt-4 text-sm font-semibold">Regional score trend</h3>
              <ScoreLineChart data={trend} />
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-eco-600/10 p-2">
      <p className="text-[11px] text-earth-500">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  )
}
