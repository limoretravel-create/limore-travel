/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFFFFF',
          dark: '#1a1a1a',
        },
        secondary: {
          DEFAULT: '#E8F4F8',
          dark: '#1E3A8A',
        },
        accent: {
          DEFAULT: '#DC2626',
          dark: '#EF4444',
        },
        'accent-blue': {
          DEFAULT: '#1E40AF',
          dark: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

