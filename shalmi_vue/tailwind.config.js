module.exports = {
  purge: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#003366',
        secondary: '#8B0000',
        white: '#ffffff',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}