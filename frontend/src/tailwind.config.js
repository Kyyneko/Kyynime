/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#60a5fa',
        },
        accent: {
          DEFAULT: '#10b981',
          orange: '#f59e0b',
        },
        dark: {
          DEFAULT: '#0a0e27',
          light: '#151b3d',
          card: '#1e2749',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#cbd5e1',
          muted: '#94a3b8',
        },
        border: {
          DEFAULT: '#334155',
          light: '#475569',
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'slide-up': {
          'from': { 
            transform: 'translateY(20px)',
            opacity: '0',
          },
          'to': { 
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'scale-in': {
          'from': { 
            transform: 'scale(0.9)',
            opacity: '0',
          },
          'to': { 
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}