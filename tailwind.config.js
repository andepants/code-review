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
        background: '#1e1e1e',
        surface: '#252526',
        surfaceElevated: '#2d2d30',
        text: {
          primary: '#d4d4d4',
          secondary: '#a0a0a0',
          muted: '#6a6a6a',
        },
        accent: {
          primary: '#007acc',
          success: '#4caf50',
          warning: '#ff9800',
          error: '#f44336',
        },
        thread: {
          1: { DEFAULT: '#4fc3f7', light: 'rgba(79, 195, 247, 0.15)' },
          2: { DEFAULT: '#81c784', light: 'rgba(129, 199, 132, 0.15)' },
          3: { DEFAULT: '#ffb74d', light: 'rgba(255, 183, 77, 0.15)' },
          4: { DEFAULT: '#e57373', light: 'rgba(229, 115, 115, 0.15)' },
          5: { DEFAULT: '#ba68c8', light: 'rgba(186, 104, 200, 0.15)' },
          6: { DEFAULT: '#64b5f6', light: 'rgba(100, 181, 246, 0.15)' },
          7: { DEFAULT: '#ffd54f', light: 'rgba(255, 213, 79, 0.15)' },
          8: { DEFAULT: '#f06292', light: 'rgba(240, 98, 146, 0.15)' },
        },
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

