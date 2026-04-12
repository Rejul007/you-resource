/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#110703',
        'bg-solid': '#130804',
        cream: '#E8D5C0',
        'cream-sub': '#9A7A62',
        'cream-muted': '#5a3828',
        'cream-heading': '#C8956A',
        accent: '#C17F3A',
        'accent-hi': '#D4923F',
      },
      fontFamily: {
        heading: ['var(--font-syne)', 'Syne', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'accent-grad': 'linear-gradient(90deg, #C17F3A, #A86B2E)',
        'accent-grad-hi': 'linear-gradient(135deg, #D4923F, #C17F3A)',
      },
      boxShadow: {
        glass: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
        'accent-glow': '0 4px 20px rgba(193,127,58,0.4)',
        deep: '0 16px 60px rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [],
};
