/** Infinite horizontal marquee strip */
const ITEMS = [
  'Premium Properties', 'Luxury Villas', 'Smart Investments',
  'Expert Agents', 'Dream Homes', 'City Penthouses',
  'Beachfront Living', 'New Projects',
]

const DOT = <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />

export default function Marquee() {
  const track = [...ITEMS, ...ITEMS]

  return (
    <div className="py-5 border-y border-gray-100 bg-white overflow-hidden">
      <div className="marquee-wrapper">
        {[0, 1].map(t => (
          <div key={t} className="marquee-track" aria-hidden={t === 1}>
            {track.map((item, i) => (
              <span key={i} className="flex items-center gap-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {DOT}
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
