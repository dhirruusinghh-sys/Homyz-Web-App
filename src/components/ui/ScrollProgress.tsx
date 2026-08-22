import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin animated scroll progress bar at the very top of the page */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
  )
}

/** Back-to-top button that appears after scrolling 300px */
export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return
      ref.current.style.opacity  = window.scrollY > 300 ? '1' : '0'
      ref.current.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      ref={ref}
      className="back-to-top"
      style={{ opacity: 0, pointerEvents: 'none', transition: 'opacity .3s, transform .3s, box-shadow .3s' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}
