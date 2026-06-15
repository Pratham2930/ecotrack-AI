import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoCart, IoStar, IoLeaf, IoSearch } from 'react-icons/io5'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import toast from 'react-hot-toast'

const PRODUCTS = [
  { id: 'p1', name: 'Reusable Steel Water Bottle', category: 'Lifestyle', replaces: 'Plastic Bottle', price: 899, ogPrice: 1299, score: 94, saving: 52, rating: 4.8, reviews: 1284, img: '🍶', badge: 'Top Pick', badgeColor: 'green', impact: 'Saves ~200 plastic bottles/year', desc: 'Premium stainless steel, keeps cold 24h/hot 12h', tags: ['Zero Waste', 'BPA Free'] },
  { id: 'p2', name: 'Electric Scooter / E-Bike', category: 'Transport', replaces: 'Petrol Scooter', price: 45000, ogPrice: 60000, score: 91, saving: 580, rating: 4.7, reviews: 892, img: '⚡', badge: 'High Impact', badgeColor: 'blue', impact: 'Save 580 kg CO₂/year', desc: 'Zero-emission EV with 80km range per charge', tags: ['Zero Emission', 'Smart Tech'] },
  { id: 'p3', name: 'Home Solar Panel Kit 2kW', category: 'Energy', replaces: 'Grid Electricity', price: 35000, ogPrice: 45000, score: 98, saving: 1200, rating: 4.9, reviews: 456, img: '☀️', badge: 'Best ROI', badgeColor: 'yellow', impact: 'Generate clean energy, save ₹8000/month', desc: '2kW rooftop kit with installation & warranty', tags: ['Renewable', 'Govt Subsidy'] },
  { id: 'p4', name: 'LED Smart Bulb Pack (10)', category: 'Energy', replaces: 'Incandescent Bulbs', price: 1200, ogPrice: 2000, score: 86, saving: 92, rating: 4.6, reviews: 3421, img: '💡', badge: 'Budget Pick', badgeColor: 'green', impact: '80% less energy use', desc: 'Smart bulbs, app-controlled, 15,000hr lifespan', tags: ['Smart Home', 'Energy Saving'] },
  { id: 'p5', name: 'Bamboo Toothbrush Set (4)', category: 'Personal', replaces: 'Plastic Toothbrush', price: 299, ogPrice: 499, score: 88, saving: 2, rating: 4.5, reviews: 2180, img: '🎋', badge: 'Eco Choice', badgeColor: 'green', impact: 'Biodegradable, zero plastic', desc: 'Charcoal-infused bristles, 100% biodegradable', tags: ['Zero Plastic', 'Natural'] },
  { id: 'p6', name: 'Kitchen Compost Bin', category: 'Waste', replaces: 'Landfill Food Waste', price: 1499, ogPrice: 2200, score: 90, saving: 180, rating: 4.7, reviews: 678, img: '🌱', badge: 'Zero Waste', badgeColor: 'green', impact: 'Convert 50kg waste into compost annually', desc: 'Odour-free bokashi kitchen compost system', tags: ['Zero Waste', 'Organic'] },
  { id: 'p7', name: 'Reusable Shopping Bags (5)', category: 'Lifestyle', replaces: 'Plastic Bags', price: 399, ogPrice: 599, score: 82, saving: 18, rating: 4.4, reviews: 5640, img: '👜', badge: 'Popular', badgeColor: 'blue', impact: 'Replace 500+ plastic bags/year', desc: 'Foldable jute bags, 15kg capacity each', tags: ['Zero Waste', 'Reusable'] },
  { id: 'p8', name: 'Rainwater Harvesting Kit', category: 'Water', replaces: 'Municipal Water', price: 8500, ogPrice: 12000, score: 87, saving: 95, rating: 4.6, reviews: 234, img: '💧', badge: 'Water Save', badgeColor: 'blue', impact: 'Save up to 30,000L water/year', desc: 'Rooftop system with filter and storage', tags: ['Water Saving', 'DIY Install'] },
]

const CATEGORIES = ['All', 'Energy', 'Transport', 'Lifestyle', 'Waste', 'Personal', 'Water']

export default function Marketplace() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('impact')
  const [cart, setCart] = useState([])

  const addToCart = (p) => { setCart(c => [...c, p]); toast.success(`${p.name} added to cart! 🛒`) }

  const filtered = PRODUCTS
    .filter(p => category === 'All' || p.category === category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'impact' ? b.saving - a.saving : sort === 'rating' ? b.rating - a.rating : a.price - b.price)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <IoCart className="text-eco-400" /> Eco Impact Marketplace
            </h1>
            <p className="text-slate-500 text-sm mt-1">Sustainable alternatives with verified carbon savings.</p>
          </div>
          {cart.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-eco-500/10 border border-eco-500/20">
              <IoCart className="text-eco-400" size={16} />
              <span className="text-sm font-semibold text-eco-400">{cart.length} items</span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search eco products..."
            className="premium-input pl-9 text-sm" aria-label="Search" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="premium-input sm:w-40 text-sm" aria-label="Sort">
          <option value="impact">Most Impact</option>
          <option value="rating">Top Rated</option>
          <option value="price">Lowest Price</option>
        </select>
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${category === cat ? 'text-white border border-eco-500/30' : 'text-slate-500 bg-white/[0.03] border border-white/[0.06] hover:border-white/20'}`}
            style={category === cat ? { background: 'linear-gradient(135deg, rgba(22,163,74,0.2), rgba(13,148,136,0.2))' } : {}}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-white/[0.02] rounded-2xl border border-white/[0.06] overflow-hidden hover:border-eco-500/20 hover:shadow-eco-sm transition-all duration-300 flex flex-col">
            <div className="relative bg-gradient-to-br from-eco-950/30 to-teal-950/30 p-6 flex items-center justify-center">
              <span className="text-6xl">{p.img}</span>
              <div className="absolute top-3 left-3">
                <Badge color={p.badgeColor || 'green'}>{p.badge}</Badge>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-white text-sm leading-tight">{p.name}</h3>
              <p className="text-xs text-slate-600 mt-0.5 mb-2">Replaces: <span className="line-through">{p.replaces}</span></p>
              <p className="text-xs text-slate-500 leading-relaxed mb-3 flex-1">{p.desc}</p>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Sustainability</span><span className="text-eco-400 stat-number font-medium">{p.score}/100</span></div>
                <ProgressBar value={p.score} max={100} color="gradient" size="xs" />
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-eco-500/5 rounded-xl border border-eco-500/10 mb-3">
                <IoLeaf className="text-eco-500 shrink-0" size={13} />
                <p className="text-xs text-eco-400 leading-snug flex-1">{p.impact}</p>
                <span className="stat-number text-xs font-bold text-eco-400 shrink-0">-{p.saving}kg/yr</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {p.tags.map(t => <Badge key={t} color="gray" className="text-[10px]">{t}</Badge>)}
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="stat-number text-lg font-bold text-white">₹{p.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-600 line-through ml-1.5">₹{p.ogPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IoStar className="text-yellow-400" size={12} />
                  <span className="text-xs font-semibold text-slate-400 stat-number">{p.rating}</span>
                </div>
              </div>
              <Button className="w-full" size="sm" icon={<IoCart size={13} />} onClick={() => addToCart(p)}>Add to Cart</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
