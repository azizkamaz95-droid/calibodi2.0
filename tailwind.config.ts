import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cali: {
          blue: '#00D4FF',      // Hydratation
          electric: '#FF3366',  // Rose électrique
          red: '#FF2D55',       // Rouge vif (site: secondary)
          orange: '#FF6B35',    // Orange (site: primary accent)
          yellow: '#FF8C42',    // Orange clair (remplace jaune)
          green: '#00FF87',     // Vert neon (nutrition)
          purple: '#BF5AF2',    // Violet flash (sommeil)
          pink: '#FF375F',      // Rose vif
          dark: '#0A0A0F',      // Fond (identique site)
          card: '#0F0F18',      // Carte (aligné site: rgba(255,255,255,0.03))
          surface: '#16162A',   // Surface (aligné site: rgba(255,255,255,0.05))
          'light-text': '#C8C8D0', // Texte lisible (remplace gris trop sombre)
        },
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundColor: {
        'theme':         'var(--bg)',
        'theme-card':    'var(--bg-card)',
        'theme-surface': 'var(--bg-surface)',
      },
      textColor: {
        'primary':   'var(--text-primary)',
        'secondary': 'var(--text-secondary)',
        'tertiary':  'var(--text-tertiary)',
      },
      borderColor: {
        'theme':       'var(--border)',
        'theme-strong':'var(--border-strong)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'ring-fill': 'ringFill 1.5s ease-out forwards',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68,-0.55,0.27,1.55)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        ringFill: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--ring-offset)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
