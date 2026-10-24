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
        cyber: {
          bg: '#020617',
          surface: '#0b1120',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(30, 41, 59, 0.8)',
          cyan: '#06b6d4',
          'cyan-bright': '#22d3ee',
          emerald: '#10b981',
          'emerald-bright': '#34d399',
          amber: '#f59e0b',
          'amber-bright': '#fbbf24',
          rose: '#ef4444',
          'rose-bright': '#f87171',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'neon-rose': '0 0 25px -3px rgba(239, 68, 68, 0.45)',
        'neon-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'neon-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
      }
    },
  },
  plugins: [],
}
