import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home } from 'lucide-react'

/** Premium loading screen with animated house icon and progress bar */
export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [text, setText] = useState('Finding your dream home...')
  const done = useRef(false)

  useEffect(() => {
    const msgs = [
      'Finding your dream home...',
      'Loading premium listings...',
      'Preparing your experience...',
    ]
    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 22 + 8
      if (p >= 100) { p = 100; clearInterval(id) }
      setProgress(Math.min(p, 100))
      setText(msgs[Math.floor(p / 34)])
    }, 180)

    const tid = setTimeout(() => {
      if (!done.current) { done.current = true; onDone() }
    }, 2400)

    return () => { clearInterval(id); clearTimeout(tid) }
  }, [onDone])

  return (
    <motion.div
      className="loader-screen"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: .7, ease: [.16,1,.3,1] }}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />

      {/* Animated blobs */}
      <div className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background:'rgba(255,255,255,.25)', top:'-10%', left:'-10%', animation:'blob 8s ease infinite' }} />
      <div className="absolute w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{ background:'rgba(255,200,100,.3)', bottom:'-5%', right:'-5%', animation:'blob 10s ease infinite reverse' }} />

      <motion.div
        initial={{ scale: .7, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        transition={{ duration: .6, ease: [.16,1,.3,1] }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        {/* Logo icon */}
        <div className="loader-house">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
            <Home className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Logo text */}
        <div className="font-display text-3xl font-bold text-white tracking-tight">
          H<span className="text-white/80">omyz</span>
        </div>

        {/* Progress bar */}
        <div className="loader-bar-track">
          <motion.div
            className="loader-bar-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: .3, ease: 'easeOut' }}
          />
        </div>

        {/* Loading text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-white/60 text-sm font-medium"
          >
            {text}
          </motion.p>
        </AnimatePresence>

        <p className="text-white/30 text-xs font-mono">{Math.round(progress)}%</p>
      </motion.div>
    </motion.div>
  )
}
