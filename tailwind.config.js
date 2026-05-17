/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0f1a',
          800: '#111827',
          700: '#1a2236',
          600: '#243049',
        },
        amber: {
          400: '#D4875A',
          500: '#C47A4E',
          600: '#B06D42',
        },
      },
    },
  },
  plugins: [],
}
