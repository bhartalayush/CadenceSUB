/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poster: ['"Unbounded"', '"Panchang"', 'sans-serif'],
        display: ['"Google Sans"', '"Google Sans Text"', '"Product Sans"', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Google Sans"', '"Google Sans Text"', '"Product Sans"', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Google Sans"', '"Google Sans Text"', '"Product Sans"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Google Sans"', '"Google Sans Text"', '"Product Sans"', '"Plus Jakarta Sans"', 'sans-serif'],
        googlesans: ['"Google Sans"', '"Google Sans Text"', '"Product Sans"', '"Plus Jakarta Sans"', 'sans-serif'],
        cambria: ['"Google Sans"', '"Google Sans Text"', '"Product Sans"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF8F3',
          200: '#F3EDE0',
          300: '#EAE1D0',
          400: '#DDD1BC',
        },
        sage: {
          50: '#F4F7EF',
          100: '#E7EED9',
          200: '#D2DEC0',
          300: '#BACCA2',
          400: '#A1B785',
          500: '#7F995D',
          600: '#647D43',
          700: '#4D6133',
          800: '#384724',
        },
        bark: {
          50: '#F7F6F4',
          100: '#ECE9E4',
          200: '#D9D4CC',
          300: '#BCB5AA',
          400: '#948B7E',
          500: '#72685B',
          600: '#554C41',
          700: '#3E362D',
          800: '#28221B',
          900: '#14120F',
          950: '#0A0907',
        },
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(20, 18, 15, 0.03)',
        'card': '0 2px 8px -2px rgba(20, 18, 15, 0.04), 0 1px 3px -1px rgba(20, 18, 15, 0.02)',
        'elevated': '0 20px 40px -15px rgba(20, 18, 15, 0.07), 0 1px 3px 0 rgba(20, 18, 15, 0.03)',
        'pill': '0 1px 2px rgba(20, 18, 15, 0.05)',
      },
      letterSpacing: {
        'poster': '-0.04em',
        'tighter': '-0.025em',
        'tight': '-0.015em',
        'normal': '0em',
        'wide': '0.04em',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
