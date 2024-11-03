/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./client/src/**/*.{js,jsx,ts,tsx}', './client/src/index.html'],
  theme: {
    container: {
      center: true,
      padding: {
        default: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
    },
    extend: {},
  },
  plugins: [],
};
