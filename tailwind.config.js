/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hospital-green': '#2D5F3F',
        'hospital-gold': '#D4AF37',
        primary: {
          green: '#2D5F3F',
          gold: '#D4AF37',
        },
        role: {
          admissions: '#3B82F6',
          doctor: '#10B981',
          dietitian: '#8B5CF6',
          purchasing: '#F59E0B',
          kitchen: '#EF4444',
          foodserver: '#06B6D4',
        }
      },
      fontFamily: {
        'georgia': ['Georgia', 'serif'],
        'candal': ['Candal', 'sans-serif'],
        'caprasimo': ['Caprasimo', 'serif'],
        'dm-sans': ['"DM Sans"', 'sans-serif'],
        'dm-mono': ['"DM Mono"', 'monospace'],
        'dm-serif': ['"DM Serif Display"', 'serif'],
      },
    },
  },
  plugins: [],
}