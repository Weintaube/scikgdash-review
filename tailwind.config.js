// tailwind.config.js

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e86161',
        secondary: '#80869b',
        light: '#e9ebf2',
        'lighter': '#f8f9fb',
        'light-darker': '#dbdde5',
        dark: '#5b6176',
      },
    },
  },
  variants: {},
  plugins: [],
}
