import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, ChevronRight } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../../app/store'
import { logout } from '../../features/auth/authSlice'

const NAV_LINKS = [
  { label: 'Home',       href: '#home' },
  { label: 'Property',   href: '#properties' },
  { label: 'About',      href: '#about' },
  { label: 'Services',   href: '#services' },
  { label: 'Contact',    href: '#contact' },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [activeLink,  setActiveLink]  = useState('home')
  const [menuOpen,    setMenuOpen]    = useState(false)
  const ticking = useRef(false)
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  const updateScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20)
        ticking.current = false
      })
      ticking.current = true
    }
  }, [])

  // Active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveLink(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px' }
    )
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateScroll)
  }, [updateScroll])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href) as HTMLElement
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const handleDashboard = () => {
    if (user?.role === 'admin') navigate('/dashboard/admin/dashboard');
    else if (user?.role === 'agent') navigate('/dashboard/agent/dashboard');
    else navigate('/dashboard/customer/dashboard');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : 'hero-bg'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" onClick={e => { e.preventDefault(); scrollTo('#home') }}
             className="flex items-center gap-2 z-10">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors
              ${scrolled ? 'bg-primary text-white' : 'bg-white/20 text-white backdrop-blur-sm border border-white/30'}`}>
              <Home className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className={`font-display text-xl font-bold transition-colors ${scrolled ? 'text-dark' : 'text-white'}`}>
              H<span className={scrolled ? 'text-primary' : 'text-white/80'}>omyz</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); scrollTo(link.href) }}
                className={`nav-link ${activeLink === link.href.slice(1) ? 'active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button 
                  onClick={handleDashboard}
                  className={`text-sm font-semibold font-display transition-colors px-4 py-2 rounded-xl
                  ${scrolled ? 'text-dark hover:text-primary' : 'text-white/80 hover:text-white'}`}>
                  Dashboard
                </button>
                <MagneticButton
                  className={`btn-primary text-sm py-2.5 px-5 ${!scrolled ? 'bg-white !text-primary shadow-xl' : ''}`}
                  onClick={handleLogout}
                >
                  Logout
                </MagneticButton>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className={`text-sm font-semibold font-display transition-colors px-4 py-2 rounded-xl
                  ${scrolled ? 'text-dark hover:text-primary' : 'text-white/80 hover:text-white'}`}>
                  Sign In
                </Link>
                <MagneticButton
                  className={`btn-primary text-sm py-2.5 px-5 ${!scrolled ? 'bg-white !text-primary shadow-xl' : ''}`}
                  onClick={() => scrollTo('#contact')}
                >
                  List Property
                </MagneticButton>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-xl transition-colors z-[999]
              ${scrolled ? 'text-dark' : 'text-white'} ${menuOpen ? '!text-dark' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen
                ? <motion.div key="x"    initial={{ rotate:-90,opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:90,opacity:0 }} transition={{ duration:.2 }}><X className="w-6 h-6" /></motion.div>
                : <motion.div key="menu" initial={{ rotate:90, opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:-90,opacity:0 }} transition={{ duration:.2 }}><Menu className="w-6 h-6" /></motion.div>
              }
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-dark">H<span className="text-primary">omyz</span></span>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={e => { e.preventDefault(); scrollTo(link.href) }}
                  className={`mobile-nav-link flex items-center justify-between ${activeLink === link.href.slice(1) ? 'active' : ''}`}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0,  opacity: 1 }}
                  transition={{ delay: i * .07, duration: .4, ease: [.16,1,.3,1] }}
                >
                  {link.label}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-8 border-t border-gray-100">
              {user ? (
                <>
                  <button 
                    className="btn-ghost w-full justify-center"
                    onClick={() => { setMenuOpen(false); handleDashboard(); }}
                  >
                    Dashboard
                  </button>
                  <MagneticButton className="btn-primary w-full justify-center" onClick={() => { setMenuOpen(false); handleLogout(); }}>
                    Logout
                  </MagneticButton>
                </>
              ) : (
                <>
                  <button 
                    className="btn-ghost w-full justify-center"
                    onClick={() => { setMenuOpen(false); navigate('/login'); }}
                  >
                    Sign In
                  </button>
                  <MagneticButton className="btn-primary w-full justify-center" onClick={() => { setMenuOpen(false); scrollTo('#contact'); }}>
                    List Property
                  </MagneticButton>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
