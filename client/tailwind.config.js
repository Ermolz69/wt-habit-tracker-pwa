/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        primary: '#0f766e',
        primarySoft: '#c7f0eb',
        accent: '#f97316',
        dark: '#182430',
        muted: '#667688',
        danger: '#dc2626',
        success: '#15803d',
        warning: '#d97706',
        background: '#f6f1e8',
        surface: '#fffaf2',
        card: '#fffdfa',
      },
      boxShadow: {
        'soft': '0 18px 45px -28px rgba(24, 36, 48, 0.35)',
        'glow': '0 18px 40px -22px rgba(15, 118, 110, 0.45)',
        'panel': '0 24px 60px -32px rgba(24, 36, 48, 0.24)',
      },
      animation: {
        blob: "blob 7s infinite",
        float: "float 5s ease-in-out infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
    },
  },
  plugins: [],
}
