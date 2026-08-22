import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1B56FD', dark: '#1347E8', light: '#4B78FD', 50: '#EEF3FF' },
        accent:  { DEFAULT: '#E87316', light: '#F5A254', dark: '#C5620E' },
        dark:    { DEFAULT: '#0F1117', 800: '#1A1D2E', 700: '#2D3048' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':   'linear-gradient(135deg,#1B56FD 0%,#1347E8 60%,#0D2EA0 100%)',
        'blue-glow':       'radial-gradient(ellipse at 50% 0%,rgba(27,86,253,.5) 0%,transparent 70%)',
        'accent-gradient': 'linear-gradient(135deg,#E87316 0%,#F5A254 100%)',
        'card-shine':      'linear-gradient(145deg,rgba(255,255,255,.08) 0%,rgba(255,255,255,0) 60%)',
      },
      boxShadow: {
        'card':      '0 4px 30px rgba(0,0,0,.06)',
        'card-hover':'0 20px 60px rgba(27,86,253,.15)',
        'blue-glow': '0 0 60px rgba(27,86,253,.35)',
        'btn':       '0 8px 32px rgba(27,86,253,.35)',
        'glass':     '0 8px 32px rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.6)',
      },
      borderRadius: { '2xl':'1rem','3xl':'1.5rem','4xl':'2rem','5xl':'2.5rem' },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'pulse-slow':   'pulse 4s cubic-bezier(.4,0,.6,1) infinite',
        'marquee':      'marquee 28s linear infinite',
        'marquee2':     'marquee2 28s linear infinite',
        'spin-slow':    'spin 8s linear infinite',
        'aurora':       'aurora 20s ease infinite alternate',
        'blob1':        'blob 18s ease infinite',
        'blob2':        'blob 22s ease infinite reverse',
        'shimmer':      'shimmer 2.5s linear infinite',
        'slide-in-up':  'slideInUp .6s cubic-bezier(.16,1,.3,1) both',
        'scale-in':     'scaleIn .5s cubic-bezier(.16,1,.3,1) both',
        'fade-in':      'fadeIn .5s ease both',
      },
      keyframes: {
        float:      { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-18px)' } },
        marquee:    { '0%':{ transform:'translateX(0)' }, '100%':{ transform:'translateX(-50%)' } },
        marquee2:   { '0%':{ transform:'translateX(50%)' }, '100%':{ transform:'translateX(0)' } },
        aurora:     { '0%':{ backgroundPosition:'0% 50%' }, '50%':{ backgroundPosition:'100% 50%' }, '100%':{ backgroundPosition:'0% 50%' } },
        blob:       { '0%,100%':{ borderRadius:'60% 40% 30% 70%/60% 30% 70% 40%' }, '33%':{ borderRadius:'30% 60% 70% 40%/50% 60% 30% 60%' }, '66%':{ borderRadius:'50% 60% 30% 60%/30% 40% 70% 50%' } },
        shimmer:    { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
        slideInUp:  { from:{ opacity:'0', transform:'translateY(40px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        scaleIn:    { from:{ opacity:'0', transform:'scale(.9)' }, to:{ opacity:'1', transform:'scale(1)' } },
        fadeIn:     { from:{ opacity:'0' }, to:{ opacity:'1' } },
      },
      transitionTimingFunction: { 'spring':'cubic-bezier(.16,1,.3,1)', 'bounce-in':'cubic-bezier(.6,-.28,.735,.045)' },
    },
  },
  plugins: [],
} satisfies Config
