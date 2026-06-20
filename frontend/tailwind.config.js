/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kinetic Carbon Design System
        'cs-bg':           '#0f131d',
        'cs-surface':      '#111827',
        'cs-surface-high': '#1c1f2a',
        'cs-surface-top':  '#262a35',
        'cs-border':       'rgba(255,255,255,0.08)',
        'cs-border-active':'rgba(16,185,129,0.5)',
        'cs-primary':      '#10B981',
        'cs-primary-light':'#34D399',
        'cs-primary-dim':  '#4edea3',
        'cs-secondary':    '#45dfa4',
        'cs-blue':         '#60A5FA',
        'cs-text':         '#dfe2f1',
        'cs-text-muted':   '#86948a',
        'cs-text-dim':     '#bbcabf',
        'cs-error':        '#ffb4ab',
      },
      fontFamily: {
        'geist':  ['Geist', 'system-ui', 'sans-serif'],
        'inter':  ['Inter', 'system-ui', 'sans-serif'],
        'mono':   ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        'data-xl':  ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'data-lg':  ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'data-md':  ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '500' }],
        'label':    ['12px', { lineHeight: '16px', letterSpacing: '0.05em',  fontWeight: '600' }],
      },
      borderRadius: {
        'cs': '4px',
        'cs-lg': '8px',
      },
      boxShadow: {
        'neon':       '0 0 8px rgba(16,185,129,0.3)',
        'neon-lg':    '0 0 20px rgba(16,185,129,0.2)',
        'neon-focus': '0 0 0 2px rgba(16,185,129,0.5)',
        'card':       'inset 0 0 0 1px rgba(255,255,255,0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'glow':       'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        glow:    { '0%': { boxShadow: '0 0 4px rgba(16,185,129,0.2)' }, '100%': { boxShadow: '0 0 16px rgba(16,185,129,0.5)' } },
      },
    },
  },
  plugins: [],
}
