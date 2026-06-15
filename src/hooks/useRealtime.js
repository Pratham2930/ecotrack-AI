import { useState, useEffect, useRef } from 'react'

/**
 * useRealtimeSubscription — manages a Firestore onSnapshot subscription
 * with loading/error state and automatic cleanup.
 */
export function useRealtimeSubscription(subscribeFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const unsubRef = useRef(null)

  useEffect(() => {
    if (!subscribeFn) { setLoading(false); return }
    setLoading(true)
    setError(null)

    try {
      unsubRef.current = subscribeFn((result) => {
        setData(result)
        setLoading(false)
      })
    } catch (err) {
      setError(err)
      setLoading(false)
    }

    return () => {
      if (unsubRef.current) { unsubRef.current(); unsubRef.current = null }
    }
  }, deps)

  return { data, loading, error }
}

/**
 * useCountUp — animates a number from 0 to target
 */
export function useCountUp(target, duration = 1500, delay = 0) {
  const [value, setValue] = useState(0)
  const frameRef = useRef()

  useEffect(() => {
    if (!target) return
    const timeout = setTimeout(() => {
      const start = performance.now()
      const from = 0
      const to = target

      const step = (now) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(from + (to - from) * eased))
        if (progress < 1) frameRef.current = requestAnimationFrame(step)
      }
      frameRef.current = requestAnimationFrame(step)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, delay])

  return value
}

/**
 * useDebounce — debounce a value
 */
export function useDebounce(value, ms = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(timer)
  }, [value, ms])
  return debounced
}

/**
 * useOnScreen — IntersectionObserver for scroll-triggered animations
 */
export function useOnScreen(ref, threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return isVisible
}
