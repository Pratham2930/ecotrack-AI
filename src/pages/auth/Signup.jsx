import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { IoEye, IoEyeOff, IoLogoGoogle, IoLogoGithub, IoCheckmarkCircle } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/useAuthStore'
import { Button } from '../../components/ui/Button'

export default function Signup() {
  const [showPass, setShowPass] = useState(false)
  const { signup, loginWithGoogle, loginWithGithub, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    const r = await signup(data.name, data.email, data.password)
    if (r.success) { toast.success('Account created! Welcome 🌱'); navigate('/dashboard') }
    else toast.error(r.error)
  }
  const handleGoogle = async () => {
    const r = await loginWithGoogle()
    if (r.success) { toast.success('Account created! 🌱'); navigate('/dashboard') }
    else toast.error(r.error)
  }

  return (
    <div className="glass-strong rounded-2xl border border-white/10 p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Join EcoTrack AI</h1>
        <p className="text-slate-500 text-sm mt-1">Start your real-time sustainability journey</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {[
          { icon: IoLogoGoogle, label: 'Google', action: handleGoogle },
          { icon: IoLogoGithub, label: 'GitHub', action: loginWithGithub },
        ].map(({ icon: Icon, label, action }) => (
          <button key={label} onClick={action} type="button"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all">
            <Icon size={16} />{label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-slate-600">or with email</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="su-name">Full name</label>
          <input id="su-name" type="text" autoComplete="name" placeholder="Jane Smith"
            className={`premium-input ${errors.name ? 'border-red-500/50' : ''}`}
            {...register('name', { required: 'Name required', minLength: { value: 2, message: 'Min 2 chars' } })} />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="su-email">Email</label>
          <input id="su-email" type="email" autoComplete="email" placeholder="you@example.com"
            className={`premium-input ${errors.email ? 'border-red-500/50' : ''}`}
            {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="su-pass">Password</label>
          <div className="relative">
            <input id="su-pass" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
              className={`premium-input pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
              {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors" aria-label="Toggle">
              {showPass ? <IoEyeOff size={16} /> : <IoEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="su-confirm">Confirm password</label>
          <input id="su-confirm" type={showPass ? 'text' : 'password'} placeholder="Repeat password"
            className={`premium-input ${errors.confirm ? 'border-red-500/50' : ''}`}
            {...register('confirm', { required: 'Please confirm', validate: v => v === password || 'Passwords do not match' })} />
          {errors.confirm && <p className="mt-1 text-xs text-red-400">{errors.confirm.message}</p>}
        </div>
        <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">
          <input type="checkbox" required className="mt-0.5 w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-eco-500" />
          I agree to the <a href="#" className="text-eco-400 hover:underline">Terms</a> and <a href="#" className="text-eco-400 hover:underline">Privacy Policy</a>
        </label>
        <Button type="submit" className="w-full" size="lg" loading={isLoading}>Create Account</Button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-5">
        Have an account? <Link to="/login" className="text-eco-400 font-semibold hover:text-eco-300">Sign in</Link>
      </p>
    </div>
  )
}
