import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Bed, Bath, Maximize2, Heart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const PROPERTIES = [
  {
    id: 1,
    image:    '/house1.png',
    badge:    'For Sale',
    price:    '₹37,63,440',
    name:     'Aliva Priva Jardin',
    address:  'Jakarta Garden City Street, Cakung, Pulo Gadung, Jakarta Timur, DKI Jakarta',
    beds: 4, baths: 3, sqft: 4200,
    tag: 'Villa',
  },
  {
    id: 2,
    image:    '/house2.png',
    badge:    'For Sale',
    price:    '₹53,08,240',
    name:     'Asatti Garden City',
    address:  'Pahlawan Street XVII No 215, Cinangka, Sawangan, Depok, Jawa Barat',
    beds: 5, baths: 4, sqft: 5600,
    tag: 'Villa',
    featured: true,
  },
  {
    id: 3,
    image:    '/house3.png',
    badge:    'For Sale',
    price:    '₹28,46,800',
    name:     'Citraland Puri Serang',
    address:  'Ruko Puri Indah Residence Blok A7, Lingkar Street, Ciracas, Serang, Banten',
    beds: 3, baths: 2, sqft: 3100,
    tag: 'Apartment',
  },
  {
    id: 4,
    image:    '/house1.png',
    badge:    'For Rent',
    price:    '₹6,80,000/mo',
    name:     'Skyline Penthouse',
    address:  '500 5th Avenue, Manhattan, New York City, NY',
    beds: 3, baths: 2, sqft: 2800,
    tag: 'Penthouse',
  },
  {
    id: 5,
    image:    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    badge:    'For Sale',
    price:    '₹9,60,00,000',
    name:     'Beverly Hills Mansion',
    address:  '90210 Beverly Hills, Los Angeles, California',
    beds: 6, baths: 5, sqft: 8500,
    tag: 'Villa',
  },
  {
    id: 6,
    image:    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    badge:    'For Rent',
    price:    '₹9,60,000/mo',
    name:     'Oceanview Modern Villa',
    address:  '123 Pacific Coast Highway, Malibu, CA',
    beds: 4, baths: 4, sqft: 5200,
    tag: 'Villa',
  },
  {
    id: 7,
    image:    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    badge:    'For Sale',
    price:    '₹6,80,00,000',
    name:     'Urban Loft Apartment',
    address:  '45 Downtown St, Seattle, WA',
    beds: 2, baths: 2, sqft: 1800,
    tag: 'Apartment',
    featured: true,
  },
  {
    id: 8,
    image:    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
    badge:    'For Sale',
    price:    '₹3,60,00,000',
    name:     'Cozy Suburban Home',
    address:  '789 Maple Drive, Austin, TX',
    beds: 3, baths: 2, sqft: 2100,
    tag: 'Villa',
  },
  {
    id: 9,
    image:    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    badge:    'For Rent',
    price:    '₹4,00,000/mo',
    name:     'Luxury City Penthouse',
    address:  'Highrise Ave, Chicago, IL',
    beds: 3, baths: 3, sqft: 3500,
    tag: 'Penthouse',
  },
  {
    id: 10,
    image:    '/house2.png',
    badge:    'For Sale',
    price:    '₹1,20,00,000',
    name:     'Sunset Boulevard Villa',
    address:  'West Hollywood, Los Angeles, CA',
    beds: 4, baths: 3, sqft: 4000,
    tag: 'Villa',
  },
  {
    id: 11,
    image:    '/house3.png',
    badge:    'For Rent',
    price:    '₹1,50,000/mo',
    name:     'Downtown Studio',
    address:  'Main St, San Francisco, CA',
    beds: 1, baths: 1, sqft: 800,
    tag: 'Apartment',
  }
]

function PropertyCard({ p, index }: { p: typeof PROPERTIES[0]; index: number }) {
  const [fav, setFav] = useState(false)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const tilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = ((e.clientX - left) / width  - .5) * 14
    const y = ((e.clientY - top)  / height - .5) * 14
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-8px)`
  }
  const resetTilt = () => { if (ref.current) ref.current.style.transform = '' }

  return (
    <motion.div
      ref={ref}
      className={`prop-card flex-shrink-0 w-72 md:w-80 ${p.featured ? 'ring-2 ring-primary' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * .12, duration: .6, ease: [.16, 1, .3, 1] }}
      onMouseMove={tilt}
      onMouseLeave={resetTilt}
      style={{ transition: 'transform .25s cubic-bezier(.16,1,.3,1)', willChange: 'transform' }}
    >
      <div className="relative overflow-hidden">
        <img src={p.image} alt={p.name} loading="lazy" className="prop-card-img" />
        <span className={`absolute top-3 left-3 text-xs font-bold font-display px-3 py-1.5 rounded-lg
          ${p.badge === 'For Rent' ? 'bg-accent text-white' : 'bg-primary text-white'}`}>
          {p.badge}
        </span>
        <button
          className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all hover:scale-110"
          onClick={() => setFav(v => !v)} aria-label="Favourite"
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        {p.featured && <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent pointer-events-none" />}
      </div>

      <div className="p-5">
        <span className={`text-xs font-semibold font-display px-2.5 py-1 rounded-md
          ${p.tag === 'Villa' ? 'bg-emerald-50 text-emerald-600'
          : p.tag === 'Penthouse' ? 'bg-purple-50 text-purple-600'
          : 'bg-blue-50 text-primary'}`}>
          {p.tag}
        </span>
        <p className="font-display font-bold text-dark text-2xl mt-3 mb-1">{p.price}</p>
        <h3 className="font-display font-semibold text-dark text-base mb-2 leading-snug">{p.name}</h3>
        <div className="flex items-start gap-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{p.address}</p>
        </div>
        <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
          <span className="flex items-center gap-1.5 text-gray-500 text-xs"><Bed className="w-3.5 h-3.5" /> {p.beds} Beds</span>
          <span className="flex items-center gap-1.5 text-gray-500 text-xs"><Bath className="w-3.5 h-3.5" /> {p.baths} Baths</span>
          <span className="flex items-center gap-1.5 text-gray-500 text-xs"><Maximize2 className="w-3.5 h-3.5" /> {p.sqft.toLocaleString()} sqft</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Properties() {
  const [idx, setIdx] = useState(0)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const maxIdx = PROPERTIES.length - 1

  return (
    <section id="properties" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: .6, ease: [.16, 1, .3, 1] }}
        >
          <div>
            <p className="eyebrow mb-2">Best Choice</p>
            <h2 className="section-heading">Popular Residences<span className="orange-dot">.</span></h2>
            <p className="text-gray-500 mt-3 max-w-md text-sm leading-relaxed">
              Handpicked premium properties across prime locations — verified, priced right, and ready for you.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIdx(i => Math.max(0, i - 1))}
                disabled={idx === 0}
                className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all
                  ${idx === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIdx(i => Math.min(maxIdx, i + 1))}
                disabled={idx === maxIdx}
                className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all
                  ${idx === maxIdx ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="overflow-hidden -mx-6 px-6">
          <motion.div
            className="flex gap-6"
            animate={{ x: `-${idx * 336}px` }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            {PROPERTIES.map((p, i) => <PropertyCard key={p.id} p={p} index={i} />)}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {PROPERTIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`rounded-full transition-all ${i === idx ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-gray-300'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
