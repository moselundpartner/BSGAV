/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: { 950: '#030a18', 900: '#061226', 800: '#0A1D36', 700: '#0B2A3F' },
        petrol: { 700: '#0B3F4C', 600: '#0E4D5C', 500: '#13707F', 400: '#1C93A3', 300: '#4FC3CF' },
        signal: { DEFAULT: '#FF7A1A', dark: '#D95F05', light: '#FFA25C' },
        gold: '#FFC940',
        ok: '#2EE6A6',
        bad: '#FF4D5E',
        ink: '#F2F7FA',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        btn: '0 6px 0 0 #B34A00, 0 10px 24px -6px rgba(255,122,26,.55)',
        'btn-pressed': '0 2px 0 0 #B34A00, 0 4px 12px -4px rgba(255,122,26,.5)',
        card: '0 10px 30px -10px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08)',
      },
    },
  },
  plugins: [],
}
