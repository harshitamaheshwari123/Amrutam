/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sage-green': '#a3b18a',
        'light-beige': '#f5f5dc',
        'muted-gold': '#d4af37'
      }
    },
  },
  plugins: [],
}
