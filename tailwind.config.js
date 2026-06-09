/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: '#1e3e84',
        lime: '#73b845',
        ink: '#111111',
        charcoal: '#1a1a1a',
      },
    },
  },
  plugins: [],
}