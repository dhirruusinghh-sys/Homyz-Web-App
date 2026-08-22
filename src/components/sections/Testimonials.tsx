import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const REVIEWS = [
  {
    name: 'James & Sarah Collins',
    role: 'Bought a Villa in Jakarta',
    avatar: 'J',
    color: 'from-primary to-blue-400',
    rating: 5,
    text: 'Homyz completely changed how we approached buying our first home. The search was effortless, our agent was brilliant, and we closed in just 3 weeks. I genuinely cannot recommend them enough!',
  },
  {
    name: 'Ravi Sharma',
    role: 'Real Estate Investor, Depok',
    avatar: 'R',
    color: 'from-emerald-400 to-cyan-400',
    rating: 5,
    text: "As a real estate investor, I've tried every platform available. Homyz is on another level — the ROI tools and market data saved me months of research. Best investment tool I've ever used.",
  },
  {
    name: 'Amelia Park',
    role: 'Sold Property in Serang',
    avatar: 'A',
    color: 'from-accent to-yellow-400',
    rating: 5,
    text: 'Sold my property for 12% above asking price thanks to the pricing insights and their incredible network of buyers. Absolutely phenomenal service from start to finish!',
  },
]

export default function Testimonials() {
  const [idx, setIdx] = useState(0)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const max    = REVIEWS.length - 1

  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: .6, ease: [.16, 1, .3, 1] }}
        >
          <p className="eyebrow mb-3">Client Stories</p>
          <h2 className="section-heading">
            What Our Clients Say<span className="orange-dot">.</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
            Real experiences from homeowners, investors, and renters who found their perfect match with Homyz.
          </p>
        </motion.div>

        {/* Main review */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              className="testimonial-card relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: .5, ease: [.16, 1, .3, 1] }}
            >
              {/* Quote icon */}
              <div className="absolute -top-5 -left-2 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Quote className="w-6 h-6 text-primary" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array(REVIEWS[idx].rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-gray-600 text-lg leading-relaxed mb-8 italic font-medium">
                "{REVIEWS[idx].text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${REVIEWS[idx].color} flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0`}>
                  {REVIEWS[idx].avatar}
                </div>
                <div>
                  <p className="font-display font-bold text-dark">{REVIEWS[idx].name}</p>
                  <p className="text-gray-400 text-sm">{REVIEWS[idx].role}</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIdx(i => Math.max(0, i - 1))}
                      disabled={idx === 0}
                      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all
                        ${idx === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIdx(i => Math.min(max, i + 1))}
                      disabled={idx === max}
                      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all
                        ${idx === max ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i === idx ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-gray-200'}`}
                aria-label={`Review ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mini cards row */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {REVIEWS.map((r, i) => (
            <motion.button
              key={i}
              onClick={() => setIdx(i)}
              className={`testimonial-card text-left cursor-pointer transition-all
                ${i === idx ? 'ring-2 ring-primary shadow-card-hover' : 'opacity-60 hover:opacity-100'}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: i === idx ? 1 : .6, y: 0 } : {}}
              transition={{ delay: .15 + i * .1, duration: .5, ease: [.16, 1, .3, 1] }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white font-bold font-display`}>
                  {r.avatar}
                </div>
                <div>
                  <p className="font-display font-semibold text-dark text-sm">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.role}</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">"{r.text}"</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
