import typography from '@tailwindcss/typography'

export default {
  content: [
    './extend/**/*.{js,ts,jsx,tsx,mdx}',
    './core/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        default: 'var(--color-default)',
        error: 'var(--color-error)',
        info: 'var(--color-info)'
      }
    }
  },
  plugins: [typography]
}
