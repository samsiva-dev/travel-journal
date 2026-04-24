import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        journal: {
          50: '#fdf8f0',
          100: '#faefd8',
          200: '#f4daa8',
          300: '#ebbf6f',
          400: '#e0a03d',
          500: '#d4861f',
          600: '#bc6a17',
          700: '#9c5016',
          800: '#7f4019',
          900: '#69351a',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
