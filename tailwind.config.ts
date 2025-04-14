import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#ffffff',
        'secondary1': '#c8e6b9d7',
        'secondary2': '#c8e6b9d7',
        'secondary3': '#c8e6b9d7',
        'secondary4': '#c8e6b9d7',
        'secondary5': '#c8e6b9d7',
        'secondary6': '#c8e6b9d7',
      },
    },
  },
  plugins: [],

} satisfies Config