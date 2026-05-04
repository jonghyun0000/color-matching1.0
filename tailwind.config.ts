import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { blossom: '#fce7f3', point: '#ec4899' }
    }
  },
  plugins: []
} satisfies Config;
