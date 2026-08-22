import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  decimals?: number
}

/** Counts from 0 to `to` when it enters the viewport */
export default function AnimatedCounter({ to, duration = 2000, prefix = '', suffix = '', className = '', decimals = 0 }: Props) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const start     = performance.now()
    const easeOut   = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(parseFloat((to * easeOut(progress)).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to, duration, decimals])

  return (
    <span ref={ref} className={className}>
      {prefix}{decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}{suffix}
    </span>
  )
}
