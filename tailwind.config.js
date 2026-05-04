import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Backgrounds */
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'bg-card': 'var(--bg-card)',
        'bg-elevated': 'var(--bg-elevated)',

        /* Text */
        'text-pri': 'var(--text-primary)',
        'text-sec': 'var(--text-secondary)',
        'text-mut': 'var(--text-muted)',
        'text-acc': 'var(--text-accent)',
        'text-inv': 'var(--text-inverse)',

        /* Borders */
        'border-def': 'var(--border)',
        'border-str': 'var(--border-strong)',

        /* Accent */
        'accent': 'var(--accent-primary)',
        'accent-h': 'var(--accent-hover)',

        /* Neon */
        'neon-cyan': 'var(--neon-cyan)',
        'neon-purple': 'var(--neon-purple)',
      },
      boxShadow: {
        'theme-sm': 'var(--shadow-sm)',
        'theme-md': 'var(--shadow-md)',
        'theme-lg': 'var(--shadow-lg)',
        'accent': '0 0 20px var(--text-accent)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'theme-sm': 'var(--shadow-sm)',
        'theme-md': 'var(--shadow-md)',
        'theme-lg': 'var(--shadow-lg)',
        'accent': '0 0 20px var(--text-accent)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [forms],
}
