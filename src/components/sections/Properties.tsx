import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Bed, Bath, Maximize2, Heart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../app/store'
import { getProperties } from '../../features/properties/propertySlice'
import { toggleSavedProperty } from '../../features/auth/authSlice'
import { Link } from 'react-router-dom'

function PropertyCard({ p, index }: { p: any; index: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  
  // Check if property is in user's savedProperties
  const isSaved = user?.savedProperties?.some((savedProp: any) => 
    typeof savedProp === 'object' ? savedProp._id === p._id : savedProp === p._id
  ) || false;

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

  const handleToggleSave = () => {
    if (!user) {
      alert("Please login to save properties");
      return;
    }
    dispatch(toggleSavedProperty(p._id));
  }

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
        <img src={p.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'} alt={p.title} loading="lazy" className="prop-card-img" />
        <span className={`absolute top-3 left-3 text-xs font-bold font-display px-3 py-1.5 rounded-lg
          ${p.propertyType === 'rent' ? 'bg-accent text-white' : 'bg-primary text-white'}`}>
          For {p.propertyType === 'rent' ? 'Rent' : 'Sale'}
        </span>
        <button
          className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
          onClick={handleToggleSave} aria-label="Favourite"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        {p.featured && <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent pointer-events-none" />}
      </div>

      <div className="p-5">
        <span className={`text-xs font-semibold font-display px-2.5 py-1 rounded-md
          ${p.propertyType === 'commercial' ? 'bg-purple-50 text-purple-600'
          : p.propertyType === 'residential' ? 'bg-blue-50 text-primary'
          : 'bg-emerald-50 text-emerald-600'}`}>
          {p.propertyType?.toUpperCase()}
        </span>
        <p className="font-display font-bold text-dark text-2xl mt-3 mb-1">${p.price?.toLocaleString()}</p>
        <Link to={`/properties/${p._id}`}>
          <h3 className="font-display font-semibold text-dark text-base mb-2 leading-snug hover:text-primary transition-colors cursor-pointer">{p.title}</h3>
        </Link>
        <div className="flex items-start gap-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{p.address}, {p.city}</p>
        </div>
        <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
          <span className="flex items-center gap-1.5 text-gray-500 text-xs"><Bed className="w-3.5 h-3.5" /> {p.bedrooms} Beds</span>
          <span className="flex items-center gap-1.5 text-gray-500 text-xs"><Bath className="w-3.5 h-3.5" /> {p.bathrooms} Baths</span>
          <span className="flex items-center gap-1.5 text-gray-500 text-xs"><Maximize2 className="w-3.5 h-3.5" /> {p.area} sqft</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Properties() {
  const dispatch = useDispatch<AppDispatch>()
  const { properties, isLoading } = useSelector((state: RootState) => state.property)
  const [idx, setIdx] = useState(0)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    dispatch(getProperties(''));
  }, [dispatch]);

  // If there are no real properties, use a fallback layout or just show a message.
  const displayProperties = properties?.length > 0 ? properties.slice(0, 8) : [];
  const maxIdx = displayProperties.length > 0 ? displayProperties.length - 1 : 0;

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
                disabled={idx === 0 || displayProperties.length === 0}
                className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all
                  ${idx === 0 || displayProperties.length === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIdx(i => Math.min(maxIdx, i + 1))}
                disabled={idx === maxIdx || displayProperties.length === 0}
                className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all
                  ${idx === maxIdx || displayProperties.length === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Link to="/properties" className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Cards */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : displayProperties.length > 0 ? (
          <>
            <div className="overflow-hidden -mx-6 px-6">
              <motion.div
                className="flex gap-6"
                animate={{ x: `-${idx * 336}px` }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              >
                {displayProperties.map((p: any, i: number) => <PropertyCard key={p._id} p={p} index={i} />)}
              </motion.div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {displayProperties.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-full transition-all ${i === idx ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-gray-300'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No properties found. Please run the backend seed script or add properties via Admin.
          </div>
        )}
      </div>
    </section>
  )
}
