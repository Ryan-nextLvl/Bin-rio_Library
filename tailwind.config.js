/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './**/templates/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        'hacker-black':       '#0A0A0A', // Fundo principal
        'hacker-card':        '#0F0F0F', // Fundo dos cards
        'hacker-border':      '#1F1F1F', // Bordas padrão
        'hacker-green-light': '#C0FFC0', // Texto principal
        'hacker-neon':        '#00FF41', // Destaques e botões
        'hacker-binary':      '#00CC33', // Binários decorativos
      },
      fontFamily: {
        mono: ['"Fira Code"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 8px #00FF41, 0 0 20px #00FF4166',
      },
    },
  },
  plugins: [],
}
