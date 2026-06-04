/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0F1412',
          surface: '#1B231E',
          primary: '#81C784',
          secondary: '#A5D6A7',
          text: '#E8F5E9',
          muted: '#B0BEC5',
          alert: '#EF5350',
          alertDark: '#C62828',
          warning: '#FF8F00',
          yellow: '#F9A825',
        }
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Nunito', 'sans-serif'],
      },
      animation: {
        'pulse-danger': 'pulse-danger 1s ease-in-out infinite',
        'blink': 'blink 0.8s linear infinite',
        'scan': 'scan 2s linear infinite',
        'glow-green': 'glow-green 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-danger': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(239,83,80,0.8)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 40px rgba(239,83,80,1)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'glow-green': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(129,199,132,0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(129,199,132,0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
