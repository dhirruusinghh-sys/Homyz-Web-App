import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, MessageCircle, Video, Mail, ArrowRight } from 'lucide-react'

const CONTACTS = [
  {
    icon: Phone,
    label: 'Call',
    value: '021.123.145.14',
    action: 'Call Now',
    featured: false,
    color: 'text-primary bg-primary/10',
  },
  {
    icon: MessageCircle,
    label: 'Chat',
    value: '021.123.145.14',
    action: 'Chat Now',
    featured: true,
    color: 'text-white bg-white/20',
  },
  {
    icon: Video,
    label: 'Video Call',
    value: '021.123.145.14',
    action: 'Video Call Now',
    featured: false,
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Mail,
    label: 'Message',
    value: '021.123.145.14',
    action: 'Message Now',
    featured: false,
    color: 'text-primary bg-primary/10',
  },
]

export default function Contact() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text + contact cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .7, ease: [.16, 1, .3, 1] }}
          >
            <p className="eyebrow mb-3">Contact Us</p>
            <h2 className="section-heading mb-4">
              Easy to contact us<span className="orange-dot">.</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-md">
              Is there a problem finding your dream home? Need a guide in buying your first home? Or need a consultation on residential issues? Just contact us.
            </p>

            {/* 2x2 contact cards grid */}
            <div className="grid grid-cols-2 gap-4">
              {CONTACTS.map((c, i) => (
                <motion.div
                  key={c.label}
                  className={`contact-card ${c.featured ? 'featured' : ''}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: .2 + i * .1, duration: .5, ease: [.16, 1, .3, 1] }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                    <c.icon className="w-5 h-5" />
                  </div>
                  <p className={`font-display font-bold text-sm mb-1 ${c.featured ? 'text-white' : 'text-dark'}`}>{c.label}</p>
                  <p className={`text-xs mb-3 ${c.featured ? 'text-white/70' : 'text-gray-400'}`}>{c.value}</p>
                  <button className={`flex items-center gap-1.5 text-xs font-semibold font-display transition-all group
                    ${c.featured ? 'text-white' : 'text-primary'}`}>
                    {c.action}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: arch house image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .8, delay: .15, ease: [.16, 1, .3, 1] }}
          >
            <div className="arch-container shadow-2xl relative max-w-md mx-auto lg:mx-0 ml-auto">
              <img
                src="/house3.png"
                alt="Luxury property for contact"
                loading="lazy"
                className="w-full object-cover"
                style={{ aspectRatio: '3/4' }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent" />

              {/* Floating overlay card */}
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-card-hover p-4 w-56"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white font-bold">
                    A
                  </div>
                  <div>
                    <p className="font-display font-semibold text-dark text-sm">Agent Available</p>
                    <p className="text-gray-400 text-xs">Response in &lt; 2 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-600 font-medium">Online now</span>
                </div>
              </motion.div>
            </div>

            {/* Decorative circle */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-primary/5 -z-10" />
            <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-accent/8 -z-10" />
          </motion.div>
        </div>

        {/* ── Contact form */}
        <motion.div
          className="mt-20 bg-white rounded-3xl shadow-card p-8 md:p-12"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: .4, duration: .7, ease: [.16, 1, .3, 1] }}
        >
          <div className="text-center mb-10">
            <h3 className="font-display font-bold text-dark text-2xl mb-2">Send Us a Message</h3>
            <p className="text-gray-400 text-sm">We'll respond within 24 hours.</p>
          </div>

          <form onSubmit={e => e.preventDefault()} className="grid md:grid-cols-2 gap-5">
            {[
              { id: 'fname', label: 'First Name', placeholder: 'John', type: 'text' },
              { id: 'lname', label: 'Last Name',  placeholder: 'Doe',  type: 'text' },
              { id: 'email', label: 'Email',       placeholder: 'john@example.com', type: 'email' },
              { id: 'phone', label: 'Phone',        placeholder: '+1 000 000 0000',  type: 'tel' },
            ].map(f => (
              <div key={f.id}>
                <label htmlFor={f.id} className="block text-sm font-semibold text-dark mb-2">{f.label}</label>
                <input
                  id={f.id} type={f.type} placeholder={f.placeholder}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-dark text-sm
                    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
                    transition-all placeholder:text-gray-300 bg-gray-50 hover:bg-white"
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label htmlFor="interest" className="block text-sm font-semibold text-dark mb-2">I'm Interested In</label>
              <select id="interest"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-dark text-sm
                  focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
                  transition-all bg-gray-50 hover:bg-white appearance-none">
                <option value="">Select an option...</option>
                <option>Buying a Property</option>
                <option>Selling My Property</option>
                <option>Renting</option>
                <option>Investment Advice</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-sm font-semibold text-dark mb-2">Message</label>
              <textarea id="message" rows={4} placeholder="Tell us what you're looking for..."
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-dark text-sm
                  focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
                  transition-all placeholder:text-gray-300 bg-gray-50 hover:bg-white resize-none" />
            </div>

            <div className="md:col-span-2 flex justify-center">
              <motion.button
                type="submit"
                className="btn-primary px-10 py-4 text-base"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: .97 }}
              >
                Send Message
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
