/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#fbbf24',
        dark: '#1f2937',
        light: '#f3f4f6'
      }
    },
  },
  plugins: [],
}
