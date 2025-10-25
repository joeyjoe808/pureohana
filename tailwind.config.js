/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Typography - Elegant and refined
      fontFamily: {
        display: ['Playfair Display', 'Cormorant Garamond', 'serif'], // Luxury headings
        serif: ['Cormorant Garamond', 'serif'], // Secondary headings
        sans: ['Inter', 'Montserrat', 'sans-serif'], // Body text
        mono: ['IBM Plex Mono', 'monospace'], // Technical text
      },

      fontSize: {
        'hero': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'heading-1': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-2': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.25', letterSpacing: '-0.008em' }],
        'heading-3': ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
        'body-xl': ['1.25rem', { lineHeight: '1.7', letterSpacing: '0' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0' }],
        'body': ['1rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
      },

      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },

      letterSpacing: {
        'luxury': '0.15em',
        'relaxed': '0.05em',
      },

      // Color System - Sophisticated and emotional
      colors: {
        // Neutrals - Warm and elegant
        cream: {
          50: '#FDFCFB',
          100: '#FAF8F6',
          200: '#F5F1ED',
          300: '#EBE5DD',
          400: '#DDD5CA',
          500: '#C9BDB0',
          600: '#9F8A73',
          700: '#7A6854',
          800: '#5C4F3E',
          900: '#3E352C',
        },

        // Primary - Sophisticated blacks and grays
        charcoal: {
          50: '#F7F7F7',
          100: '#EFEFEF',
          200: '#DCDCDC',
          300: '#BDBDBD',
          400: '#989898',
          500: '#7C7C7C',
          600: '#656565',
          700: '#525252',
          800: '#464646',
          900: '#3D3D3D',
          950: '#1A1A1A',
        },

        // Accent - Hawaiian sunset & ocean
        sunset: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },

        ocean: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },

        // Gold - Luxury accent
        gold: {
          50: '#FFFBEB',
          100: '#FFF3C4',
          200: '#FFE58A',
          300: '#FFD24D',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
        },

        // Emotion colors - Subtle and refined
        passion: '#FF6B7A', // Warm coral
        serenity: '#95C7E1', // Soft blue
        joy: '#FFD93D', // Warm yellow
        elegance: '#DCC9E2', // Lavender
      },

      // Spacing - Generous and breathable
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        'section': '6rem',
        'section-lg': '8rem',
        'section-xl': '10rem',
      },

      // Container - Responsive and centered
      container: {
        center: true,
        padding: {
          DEFAULT: '1.5rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },

      // Effects and Shadows - Soft and sophisticated
      boxShadow: {
        'luxury-sm': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'luxury': '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)',
        'luxury-lg': '0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
        'luxury-xl': '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)',
        'luxury-inner': 'inset 0 2px 8px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(250, 204, 21, 0.3)',
      },

      dropShadow: {
        'luxury': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'luxury-lg': '0 10px 40px rgba(0, 0, 0, 0.15)',
      },

      // Gradients - Elegant and subtle
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, rgba(250, 204, 21, 0.15) 0%, transparent 50%)',
        'sunset-gradient': 'linear-gradient(135deg, #FF6B7A 0%, #FFD93D 100%)',
        'ocean-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #7DD3FC 100%)',
        'elegant-gradient': 'linear-gradient(135deg, #DCC9E2 0%, #95C7E1 100%)',
        'dark-overlay': 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
        'light-overlay': 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
      },

      // Border Radius - Refined curves
      borderRadius: {
        'luxury': '2px',
        'luxury-md': '4px',
        'luxury-lg': '8px',
        'luxury-xl': '12px',
      },

      // Transitions - Smooth and elegant
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },

      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'luxury-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'luxury-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // Animation - Purposeful and refined
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 3s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
      },

      // Backdrop blur - For overlays
      backdropBlur: {
        'luxury': '12px',
      },
    },
  },
  plugins: [],
};
