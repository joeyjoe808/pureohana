/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        gold: {
          50: '#FFF9EB',
          100: '#FFF3D6',
          200: '#FFE7AE',
          300: '#FFDA85',
          400: '#FFCE5D',
          500: '#FACC15',
          600: '#EAA307',
          700: '#C47D06',
          800: '#9F580A',
          900: '#7C400E',
        }
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(to right, rgba(250, 204, 21, 0.2), transparent)',
      }
    },
  },
  plugins: [],
};