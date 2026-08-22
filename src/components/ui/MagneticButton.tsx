import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface Props {
  children: ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  as?: 'button' | 'a'
  href?: string
}

/**
 * Magnetic button – element is attracted toward the cursor when hovered.
 * Also adds a ripple on click.
 */
export default function MagneticButton({ children, className = '', strength = 0.35, onClick, as: Tag = 'button', href }: Props) {
  const ref = useRef<HTMLElement>(null)
  const x   = useMotionValue(0)
  const y   = useMotionValue(0)
  const sx  = useSpring(x, { stiffness: 300, damping: 25 })
  const sy  = useSpring(y, { stiffness: 300, damping: 25 })

  const addRipple = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const r  = document.createElement('span')
    const d  = Math.max(el.clientWidth, el.clientHeight)
    const rect = el.getBoundingClientRect()
    r.style.cssText = `
      position:absolute;border-radius:50%;background:rgba(255,255,255,.3);
      width:${d}px;height:${d}px;
      left:${e.clientX - rect.left - d/2}px;
      top:${e.clientY  - rect.top  - d/2}px;
      transform:scale(0);animation:ripple-anim .6s linear;pointer-events:none;
    `
    el.appendChild(r)
    setTimeout(() => r.remove(), 650)
    onClick?.()
  }

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    x.set((e.clientX - left - width  / 2) * strength)
    y.set((e.clientY - top  - height / 2) * strength)
  }
  const onMouseLeave = () => { x.set(0); y.set(0) }

  const commonProps = {
    ref:          ref as any,
    className:    `ripple-btn ${className}`,
    style:        { x: sx, y: sy },
    onMouseMove,
    onMouseLeave,
    onClick:      addRipple,
  }

  if (Tag === 'a') {
    return <motion.a href={href} {...commonProps}>{children}</motion.a>
  }
  return <motion.button {...commonProps}>{children}</motion.button>
}
