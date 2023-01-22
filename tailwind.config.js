/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ub: ['Ubuntu', 'sans-serif',],
      },
      colors: {
        primary: '#00A365',
      },
    },
  },
  plugins: [],
}
