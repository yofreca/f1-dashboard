/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'f1-red': '#E10600',
        'f1-black': '#15151E',
        'f1-gray': '#38383F',
      },
      fontFamily: {
        'f1': ['Formula1', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
