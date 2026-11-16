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
        terminal: {
          bg: '#0d1117',
          panel: '#161b22',
          border: '#30363d',
          green: '#2ea043',
          brightGreen: '#3fb950',
          blue: '#58a6ff',
          yellow: '#d29922',
          purple: '#bc8cff',
          red: '#f85149',
          muted: '#8b949e',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
