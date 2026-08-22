import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import AnimatedCounter from '../ui/AnimatedCounter'

const FAQ = [
  {
    q: 'Best interest rates on the market',
    a: 'We partner with 50+ leading banks and financial institutions to offer the most competitive mortgage rates available. Our AI-powered rate comparison engine finds the perfect fit for your financial profile.',
  },
  {
    q: 'Prevent unstable prices',
    a: 'Price stability is the best for you. We guarantee no price changes on your acquired listing from various unexpected costs that may come. Our price lock feature protects your investment.',
  },
  {
    q: 'Best price on the market',
    a: 'Our data-driven pricing engine analyses thousands of comparable transactions in real time, ensuring you always get the fairest and most competitive price for every property.',
  },
  {
    q: 'Security of your data',
    a: 'Your privacy is paramount. We use bank-grade AES-256 encryption, are fully GDPR compliant, and never sell your data to third parties. Your trust is our most valued asset.',
  },
]

function FAQItem({ item, open, onToggle }: { item: typeof FAQ[0]; open: boolean; onToggle: () => void }) {
  return (
    <div className="faq-item">
      <button
        className={`faq-question ${open ? 'open' : ''}`}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          {item.q}
        </span>
        <span className="faq-icon">+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, paddingTop: 16, paddingBottom: 16 }}
            exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
            transition={{ duration: .35, ease: [.16, 1, .3, 1] }}
          >
            {item.a}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Value() {
  const [openIdx, setOpenIdx] = useState<number | null>(1) // second item open by default
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: arch image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .8, ease: [.16, 1, .3, 1] }}
          >
            {/* Arch-shaped image */}
            <div className="arch-container relative max-w-sm mx-auto lg:mx-0 shadow-2xl">
              <img
                src="/house2.png"
                alt="Premium property"
                loading="lazy"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '3/4' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/30 via-transparent to-transparent" />
            </div>

            {/* Floating stat card */}
            <motion.div
              className="absolute bottom-8 -right-4 lg:right-0 bg-white rounded-2xl shadow-card-hover p-4 flex items-center gap-3 max-w-[200px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🏢</span>
              </div>
              <div>
                <p className="font-display font-bold text-dark text-lg leading-none">
                  <AnimatedCounter to={1200} suffix="+" />
                </p>
                <p className="text-gray-400 text-xs mt-0.5">Premium Projects</p>
              </div>
            </motion.div>

            {/* Award badge */}
            <motion.div
              className="absolute top-6 -right-4 lg:right-4 bg-accent rounded-xl shadow-lg p-3"
              animate={{ rotate: [0, -3, 3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="text-white text-xs font-bold text-center leading-tight">
                ⭐ Best Platform<br/>2025
              </p>
            </motion.div>

            {/* Years pill */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0
                            bg-primary text-white px-5 py-3 rounded-full font-display font-bold shadow-btn
                            flex items-center gap-2 whitespace-nowrap">
              <span className="text-xl font-black">15+</span>
              <span className="text-sm opacity-80">Years of Excellence</span>
            </div>
          </motion.div>

          {/* ── Right: text + FAQ */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .8, delay: .15, ease: [.16, 1, .3, 1] }}
          >
            <div>
              <p className="eyebrow mb-3">Our Value</p>
              <h2 className="section-heading mb-4">
                Value We Give<br />To You<span className="orange-dot">.</span>
              </h2>
              <p className="text-gray-500 leading-relaxed text-sm max-w-md">
                We are always ready to help by providing the best service for you. We believe a good place to live can make your life better.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-3 mt-8">
              {FAQ.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: .3 + i * .1, duration: .5, ease: [.16, 1, .3, 1] }}
                >
                  <FAQItem
                    item={item}
                    open={openIdx === i}
                    onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              {[
                { n: 18000, suf: '+', label: 'Listings' },
                { n: 9200,  suf: '+', label: 'Deals Closed' },
                { n: 500,   suf: '+', label: 'Expert Agents' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-display font-bold text-dark text-2xl">
                    <AnimatedCounter to={s.n} suffix={s.suf} />
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
