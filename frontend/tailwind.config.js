export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563EB',
          600: '#1d4ed8',
          700: '#1e40af'
        }
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.08)',
        glow: '0 18px 50px rgba(37, 99, 235, 0.22)'
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      }
    }
  },
  plugins: []
}
