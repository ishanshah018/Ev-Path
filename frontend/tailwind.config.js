/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fefdfb',
          100: '#fdf8f0',
          200: '#fbf1e1',
          300: '#f8e8d1',
          400: '#f5dfc2',
          500: '#f2d6b3',
          600: '#efc2a4',
          700: '#e5ad95',
          800: '#d99986',
          900: '#cd8577',
        },
      },
      fontFamily: {
        sans: ['Signika', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'signika': ['Signika', 'sans-serif'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'normal': '0',
        'wide': '0.01em',
        'wider': '0.02em',
        'widest': '0.03em',
      },
    },
  },
  plugins: [],
};
