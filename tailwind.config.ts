// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e86161',
        secondary: '#80869b',
        light: '#e9ebf2',
        'light-lighter': '#f8f9fb',
        'light-darker': '#dbdde5',
        dark: '#5b6176',
      },
    },
  },
  plugins: [],
};
