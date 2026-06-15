import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { IoEye, IoEyeOff, IoLogoGoogle, IoLogoGithub, IoLeaf } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/useAuthStore'
import { Button } from '../../components/ui/Button'

export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const { login, loginWithGoogle, loginWithGithub, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    const r = await login(data.email, data.password)
    if (r.success) { toast.success('Welcome back! 🌱'); navigate(from, { replace: true }) }
    else toast.error(r.error)
  }

  const handleGoogle = async () => {
    const r = await loginWithGoogle()
    if (r.success) { toast.success('Signed in with Google! 🌱'); navigate(from, { replace: true }) }
    else toast.error(r.error)
  }

  const handleGithub = async () => {
    const r = await loginWithGithub()
    if (r.success) { toast.success('Signed in! 🌱'); navigate(from, { replace: true }) }
    else toast.error(r.error)
  }

  return (
    <div className="glass-strong rounded-2xl border border-white/10 p-8">
      <div className="text-center mb-7">
        <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)', boxShadow: '0 0 24px rgba(34,197,94,0.4)' }}>
          <IoLeaf className="text-white" size={22} />
        </div>
        <h1 className="text-2xl font-display font-bold text-white">Welcome back</h1>
        <p className="text-slate-500 text-sm mt-1">Sign in to your EcoTrack account</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {[
          { icon: IoLogoGoogle, label: 'Google', action: handleGoogle },
          { icon: IoLogoGithub, label: 'GitHub', action: handleGithub },
        ].map(({ icon: Icon, label, action }) => (
          <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={action} type="button"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all">
            <Icon size={16} />{label}
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-slate-600">or with email</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="login-email">Email address</label>
          <input id="login-email" type="email" autoComplete="email" placeholder="you@example.com"
            className={`premium-input ${errors.email ? 'border-red-500/50' : ''}`}
            {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="login-pass">Password</label>
          <div className="relative">
            <input id="login-pass" type={showPass ? 'text' : 'password'} autoComplete="current-password"
              placeholder="Your password"
              className={`premium-input pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
              {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Toggle password">
              {showPass ? <IoEyeOff size={16} /> : <IoEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
            <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-eco-500" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-xs text-eco-400 hover:text-eco-300 transition-colors">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={isLoading}>Sign In</Button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-5">
        No account? <Link to="/signup" className="text-eco-400 font-semibold hover:text-eco-300 transition-colors">Sign up free</Link>
      </p>
    </div>
  )
}
