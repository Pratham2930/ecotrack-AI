import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Logo } from '../components/layout/Logo'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-eco-50 px-5 text-center dark:bg-earth-950">
      <div>
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <p className="text-7xl font-extrabold text-eco-600 dark:text-eco-400">404</p>
        <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-earth-600 dark:text-earth-300">
          This trail doesn’t lead anywhere green. Let’s get you back.
        </p>
        <Link to="/" className="btn-primary mt-6">
          <Home size={18} /> Back home
        </Link>
      </div>
    </div>
  )
}
