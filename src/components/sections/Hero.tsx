import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import AnimatedCounter from '../ui/AnimatedCounter'

// ── Animated heading word split
function AnimHeading({ text, accent, delay = 0 }: { text: string; accent?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const words = text.split(' ')

  return (
    <span ref={ref} className="block overflow-hidden">
      {words.map((w, i) => (
        <motion.span
          key={i}
          className={`inline-block mr-4 ${accent && w === accent ? 'text-white' : ''}`}
          initial={{ y: '100%', opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: delay + i * .07, duration: .7, ease: [.16,1,.3,1] }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero() {

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16 bg-[#0B0C10]">
      {/* ── Background Effects */}
      <div className="absolute inset-0 z-0">
        <svg className="absolute inset-0 w-full h-full opacity-[.03]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M-100 400 Q200 100 500 350 T1100 200" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M-100 500 Q300 200 600 450 T1300 300" stroke="white" strokeWidth="1" fill="none"/>
          <path d="M200 -50 Q500 300 800 100 T1400 400" stroke="white" strokeWidth="1" fill="none"/>
        </svg>
        {/* Glow behind the arch */}
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{ background:'rgba(232,115,22,.15)', width:400, height:400, top:'10%', right:'5%' }}
          animate={{ scale:[1,1.1,1] }}
          transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }}
        />
        <div className="absolute inset-0 opacity-[.02]"
          style={{ backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-8 md:mt-0">
          
          {/* ── Left Content */}
          <div className="text-left pt-4 lg:pt-0">
            {/* Heading */}
            <h1 className="font-display font-bold text-white leading-[1.1] mb-5"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
              <AnimHeading text="Discover" />
              <div className="flex items-center gap-4">
                <AnimHeading text="Most Suitable" delay={0.15} />
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-accent mt-2 flex-shrink-0"
                />
              </div>
              <AnimHeading text="Property" delay={0.3} />
            </h1>

            {/* Subtext */}
            <motion.p
              className="text-white/50 text-base md:text-lg max-w-lg mb-8 leading-relaxed"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.5, duration:.7, ease:[.16,1,.3,1] }}
            >
              Find a variety of properties that suit you very easily. 
              Forget all difficulties in finding a residence for you.
            </motion.p>

            {/* ── Search Box Pill */}
            <motion.div
              className="bg-white p-2 md:p-2.5 rounded-full flex items-center w-full max-w-xs sm:max-w-md lg:max-w-xl mb-12 shadow-2xl"
              initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.6, duration:.7, ease:[.16,1,.3,1] }}
            >
              <div className="flex-1 flex items-center gap-2 md:gap-3 px-3 md:px-4">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search by location..." 
                  className="w-full bg-transparent border-none outline-none text-dark font-medium placeholder:text-gray-400 placeholder:font-normal text-sm md:text-base min-w-0" 
                />
              </div>
              <MagneticButton className="btn-primary !rounded-full !px-5 md:!px-8 py-2.5 md:py-3.5 flex-shrink-0 !text-sm md:!text-base">
                Search
              </MagneticButton>
            </motion.div>

            {/* ── Stats */}
            <motion.div
              className="flex items-center gap-8 md:gap-14"
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              transition={{ delay:.85, duration:.8 }}
            >
              {[
                { n: 18, suf: 'K+', label: 'Premium Product' },
                { n: 10, suf: 'K+', label: 'Happy Customer' },
                { n: 21, suf: '+',  label: 'Awards Winning' },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-display font-bold text-white text-3xl md:text-4xl tracking-tight mb-1">
                    <AnimatedCounter to={s.n} suffix={s.suf} />
                  </div>
                  <div className="text-white/50 text-xs md:text-sm font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right Image (Arch) */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:.4, duration:1, ease:[.16,1,.3,1] }}
          >
            <div className="relative mx-auto w-full max-w-lg" style={{ aspectRatio: '4/5' }}>
              <div className="absolute inset-0 rounded-t-[250px] overflow-hidden border-4 border-white/5 bg-dark">
                <img 
                  src="/house2.png" 
                  alt="Modern House" 
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </div>
            

          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
