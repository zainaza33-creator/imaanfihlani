/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'charcoal': '#1B1A19',
        'charcoal-alt': '#1E1C1A',
        'ivory': '#F2ECE6',
        'ivory-alt': '#EFE7DE',
        'gold': '#C2A46D',
        'gold-rich': '#B8975E',
        'bronze': '#8F7A52',
        'text-dark': '#F6F2EE',
        'text-light': '#3A3734',
        'text-muted': '#9E948A',
      },
      fontFamily: {
        'luxury': ['"Playfair Display"', 'Georgia', 'serif'], // Main luxury font
        'sans': ['"Helvetica Neue"', 'Arial', 'sans-serif'], // Secondary font
        'vogue': ['"Bodoni MT"', 'Didot', 'serif'], // Vogue-like font
        'instyle': ['"Futura"', 'Helvetica', 'sans-serif'], // InStyle-like font
        'cosmo': ['"Times New Roman"', 'Times', 'serif'], // Cosmopolitan-like
        'elle': ['"Garamond"', 'serif'], // Elle-like font
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee2': 'marquee2 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}