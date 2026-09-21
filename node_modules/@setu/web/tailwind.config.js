/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F4EFE6',
          light: '#FAF8F3',
          dark: '#E7DFD3'
        },
        brand: {
          black: '#111111',
          brown: '#3B2118',
          maroon: '#5A1F24',
          mustard: '#B88A28',
          gold: '#C69B45'
        }
      },
      fontFamily: {
        serif: ['Lora', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Branch', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
