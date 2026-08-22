import { useEffect, useRef, useCallback } from 'react'

/** Track mouse position, returning normalised (x,y) in [-1, 1] range */
export function useMousePosition() {
  const pos = useRef({ x: 0, y: 0 })
  const raw = useRef({ x: 0, y: 0 })

  const handleMove = useCallback((e: MouseEvent) => {
    raw.current = { x: e.clientX, y: e.clientY }
    pos.current = {
      x: (e.clientX / window.innerWidth)  * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [handleMove])

  return { pos, raw }
}
