const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/@nextui-org/theme/dist/components/(table|checkbox|spacer).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
}