/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html','src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
        fontFamily: {
            'rubik': ['Rubik', 'sans-serif']
        }
    },
  },
  plugins: [],
}
