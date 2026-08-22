import { useEffect, useRef } from 'react'

/** Custom cursor: dot + ring that follow the mouse with lag */
export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse   = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })
  const raf     = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top  = e.clientY + 'px'
      }
    }

    const onEnter = () => { ringRef.current?.classList.add('hovered') }
    const onLeave = () => { ringRef.current?.classList.remove('hovered') }

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n

    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, .12)
      ring.current.y = lerp(ring.current.y, mouse.current.y, .12)
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top  = ring.current.y + 'px'
      }
      raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)

    const interactives = document.querySelectorAll(
      'a,button,[data-cursor],[role=button]'
    )
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
