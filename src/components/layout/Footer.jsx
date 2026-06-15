import { Link } from 'react-router-dom'
import { IoLeaf, IoLogoTwitter, IoLogoLinkedin, IoLogoGithub } from 'react-icons/io5'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)' }}>
              <IoLeaf className="text-white" size={14} />
            </div>
            <span className="font-display font-bold gradient-text">EcoTrack AI</span>
          </div>
          <p className="text-sm text-slate-600">© 2024 EcoTrack AI · Built for a sustainable future 🌍</p>
          <div className="flex gap-3">
            {[IoLogoTwitter, IoLogoLinkedin, IoLogoGithub].map((Icon, i) => (
              <a key={i} href="#"
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-eco-500/15 flex items-center justify-center text-slate-500 hover:text-eco-400 transition-all duration-200"
                aria-label="Social">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
