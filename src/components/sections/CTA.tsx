import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Play, ArrowRight } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'

export default function CTA() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="services" className="py-0 overflow-hidden">
      {/* ── Blue CTA section (matching Homyz screenshot) */}
      <div className="relative bg-primary overflow-hidden py-32">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-[.07]"
          style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'rgba(255,200,80,.4)' }}
          animate={{ scale:[1,1.3,1], x:[0,40,0] }}
          transition={{ duration:14, repeat:Infinity, ease:'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: 'rgba(100,200,255,.3)' }}
          animate={{ scale:[1.2,1,1.2], x:[0,-30,0] }}
          transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }}
        />

        <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity:0, y:30 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:.7, ease:[.16,1,.3,1] }}
          >
            {/* Homyz logo icon */}
            <div className="w-20 h-20 bg-white/15 backdrop-blur-xl rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/20 shadow-2xl">
              <svg viewBox="0 0 48 48" fill="white" className="w-10 h-10">
                <path d="M24 4L4 20v24h14V30h12v14h14V20L24 4z" />
              </svg>
            </div>

            <h2 className="font-display font-bold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
              Get started with Homyz
            </h2>
            <p className="text-white/70 text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              Subscribe and find super attractive price quotes from us. Find your dream home now!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton
                className="btn-white text-base px-8 py-4"
                onClick={() => {}}
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </MagneticButton>

              {/* Play button — video CTA */}
              <motion.button
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: .97 }}
              >
                <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/25
                                flex items-center justify-center group-hover:bg-white/25 transition-all
                                relative">
                  {/* Pulsing ring */}
                  <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-50" />
                  <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Watch Demo</p>
                  <p className="text-white/50 text-xs">0:19 min</p>
                </div>
              </motion.button>
            </div>

            {/* Trust badges */}
            <motion.div
              className="flex items-center justify-center gap-6 mt-12 flex-wrap"
              initial={{ opacity:0 }}
              animate={inView ? { opacity:1 } : {}}
              transition={{ delay:.4, duration:.6 }}
            >
              {['🔒 Secure Platform', '⚡ Instant Access', '🌍 200+ Cities', '✅ Verified Listings'].map(b => (
                <span key={b} className="text-white/50 text-xs font-medium">{b}</span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Services grid below */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">What We Offer</p>
            <h2 className="section-heading">Everything Under<span className="orange-dot"> One Roof.</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon:'🏠', title:'Buy a Home',        desc:'Browse 18,000+ verified listings and get step-by-step agent guidance from search to signing.' },
              { icon:'💰', title:'Sell Your Property', desc:'AI-powered pricing engine + our buyer network ensures you close at the best possible price.' },
              { icon:'🗝️', title:'Rent a Space',       desc:'Find flexible rentals from studios to villas — no hidden fees, no surprises.' },
              { icon:'📈', title:'Smart Investment',   desc:'Real-time ROI analysis and curated investment-grade properties to grow your portfolio.' },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary/30 hover:bg-primary/[.02] transition-all hover:shadow-card-hover group cursor-pointer"
                initial={{ opacity:0, y:30 }}
                animate={inView ? { opacity:1, y:0 } : {}}
                transition={{ delay: .2 + i*.1, duration:.5, ease:[.16,1,.3,1] }}
                whileHover={{ y: -6 }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{s.icon}</div>
                <h3 className="font-display font-bold text-dark text-base mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                  Explore
                  <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
