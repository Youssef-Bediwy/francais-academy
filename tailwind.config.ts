import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF6ED', 100: '#FFEAD5', 200: '#FED7AA', 300: '#FDBA74',
          400: '#FB923C', 500: '#F97316', 600: '#EA580C', 700: '#C2410C',
          800: '#9A3412', 900: '#7C2D12', 950: '#431407',
        },
        ink: {
          50: '#F8F7F5', 100: '#EFEDE9', 200: '#DDD9D2', 300: '#BFB9AE',
          400: '#9C9488', 500: '#7D7568', 600: '#635C52', 700: '#4A443D',
          800: '#302C27', 900: '#1C1A17', 950: '#0F0E0C',
        },
        teal: {
          50: '#EFFCF8', 100: '#D3F6EC', 300: '#7BE0C5', 500: '#14B88A',
          600: '#0E9A73', 700: '#0B7A5C',
        },
        sun: { 100: '#FEF6D8', 300: '#FADF6E', 500: '#F5C518', 600: '#D9A800' },
        berry: { 100: '#FDE7EF', 300: '#F7A8C4', 500: '#E5447F', 600: '#C42D66' },
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-muted': 'rgb(var(--surface-muted) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        'foreground-muted': 'rgb(var(--foreground-muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'Tahoma', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(28,26,23,.04), 0 8px 24px -12px rgba(28,26,23,.12)',
        lift: '0 2px 4px rgba(28,26,23,.05), 0 18px 40px -18px rgba(28,26,23,.22)',
        ring: '0 0 0 4px rgba(249,115,22,.18)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        pop: { '50%': { transform: 'scale(1.06)' } },
      },
      animation: {
        'fade-in': 'fade-in .25s ease-out both',
        'slide-up': 'slide-up .3s cubic-bezier(.22,1,.36,1) both',
        'scale-in': 'scale-in .2s cubic-bezier(.22,1,.36,1) both',
        shimmer: 'shimmer 1.6s infinite',
        pop: 'pop .35s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
