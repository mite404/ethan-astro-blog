/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        ticker: 'ticker 20s linear infinite'
      }
    }
  },
  plugins: []
}
