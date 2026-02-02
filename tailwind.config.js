/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#1a1a2e',
        surface: '#16213e',
        card: '#252542',
        primary: '#e94560',
        secondary: '#533483',
        'priority-high': '#ef4444',
        'priority-medium': '#eab308',
        'priority-low': '#22c55e',
        'cat-meta': '#3b82f6',
        'cat-contenido': '#ec4899',
        'cat-scripts': '#22c55e',
        'cat-estrategia': '#a855f7',
        'cat-contabilidad': '#eab308',
        'cat-investigacion': '#6366f1',
      },
    },
  },
  plugins: [],
}