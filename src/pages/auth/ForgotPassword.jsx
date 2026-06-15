import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { IoArrowBack, IoMailOutline, IoCheckmarkCircle } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/useAuthStore'
import { Button } from '../../components/ui/Button'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuthStore()
  const { register, handleSubmit, formState: { errors }, getValues } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    const r = await resetPassword(data.email)
    setLoading(false)
    if (r.success) { setSent(true); toast.success('Reset email sent!') }
    else toast.error(r.error)
  }

  if (sent) return (
    <div className="glass-strong rounded-2xl border border-white/10 p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-eco-500/10 border border-eco-500/20 flex items-center justify-center mx-auto mb-4">
        <IoCheckmarkCircle className="text-eco-400" size={32} />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
      <p className="text-slate-400 text-sm mb-6">Reset link sent to <span className="text-white">{getValues('email')}</span></p>
      <Link to="/login"><Button variant="ghost" className="w-full">Back to Sign In</Button></Link>
    </div>
  )

  return (
    <div className="glass-strong rounded-2xl border border-white/10 p-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl mx-auto mb-4 bg-eco-500/10 border border-eco-500/20 flex items-center justify-center">
          <IoMailOutline className="text-eco-400" size={22} />
        </div>
        <h1 className="text-2xl font-display font-bold text-white">Reset Password</h1>
        <p className="text-slate-500 text-sm mt-1">We'll send a reset link to your email</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="fp-email">Email address</label>
          <input id="fp-email" type="email" placeholder="you@example.com"
            className={`premium-input ${errors.email ? 'border-red-500/50' : ''}`}
            {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>Send Reset Link</Button>
      </form>
      <div className="text-center mt-4">
        <Link to="/login" className="text-sm text-eco-400 hover:text-eco-300 flex items-center justify-center gap-1 transition-colors">
          <IoArrowBack size={14} /> Back to Sign In
        </Link>
      </div>
    </div>
  )
}
