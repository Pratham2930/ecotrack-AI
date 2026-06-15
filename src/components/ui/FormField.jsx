import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

/**
 * Accessible text/number input with label, hint and error message.
 * Designed to spread react-hook-form's register() onto the input.
 */
export const FormField = forwardRef(function FormField(
  { label, id, error, hint, type = 'text', className, suffix, ...props },
  ref,
) {
  const describedBy = []
  if (hint) describedBy.push(`${id}-hint`)
  if (error) describedBy.push(`${id}-error`)
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="label">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={type}
          className={cn('input', error && 'border-red-500 focus:ring-red-500/40', suffix && 'pr-12')}
          aria-invalid={!!error}
          aria-describedby={describedBy.join(' ') || undefined}
          {...props}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-earth-500 dark:text-earth-400">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-earth-500 dark:text-earth-400">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
})
