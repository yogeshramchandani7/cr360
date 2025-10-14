/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af',
          hover: '#1e3a8a',
        },
        oracle: {
          navy: '#2C3E50',
          darkNavy: '#1E3A5F',
          red: '#C74634',
          bg: '#FBF9F8',
          bgAlt: '#F5F3F2',
          cardBg: '#FFFFFF',
          border: '#E8E6E5',
          borderMedium: '#D4D2D1',
          chatHeader: '#3A3A3A',
          chatBody: '#2A2A2A',
          chatBotAvatar: '#D66B4A',
          chatBotBubble: '#E8E2D8',
          chatAction: '#5A5A5A',
          chatActionHover: '#4A4A4A',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
    },
  },
  plugins: [],
}
