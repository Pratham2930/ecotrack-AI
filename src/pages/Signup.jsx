import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { AuthLayout } from '../components/auth/AuthLayout'
import { FormField } from '../components/ui/FormField'
import { useAuth } from '../hooks/useAuth'
import { rules } from '../utils/validation'

export default function Signup() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' })

  const onSubmit = async (values) => {
    setFormError('')
    try {
      await registerUser(values.email, values.password, values.displayName)
      navigate('/app', { replace: true })
    } catch (err) {
      setFormError(err.message || 'Unable to create account.')
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start measuring and reducing your carbon footprint today."
      footer={
        <p className="text-earth-600 dark:text-earth-300">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-eco-600 hover:underline dark:text-eco-400">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {formError ? (
          <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
            {formError}
          </div>
        ) : null}

        <FormField
          id="displayName"
          label="Full name"
          autoComplete="name"
          placeholder="Jane Green"
          error={errors.displayName?.message}
          {...register('displayName', rules.displayName)}
        />

        <FormField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', rules.email)}
        />

        <FormField
          id="password"
          label="Password"
          type={showPw ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint="Use 8+ characters with a mix of letters and numbers."
          error={errors.password?.message}
          suffix={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((s) => !s)}
              className="pointer-events-auto text-earth-500 hover:text-eco-600"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          {...register('password', rules.password)}
        />

        <FormField
          id="confirmPassword"
          label="Confirm password"
          type={showPw ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (v) => v === watch('password') || 'Passwords do not match',
          })}
        />

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          <UserPlus size={18} />
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
