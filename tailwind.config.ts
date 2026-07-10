import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: 'var(--gold)', 'gold-dim': 'var(--gold-dim)',
        'bg-base': 'var(--bg-base)', 'bg-raised': 'var(--bg-raised)',
        'bg-overlay': 'var(--bg-overlay)', 'bg-hover': 'var(--bg-hover)',
        'border-1': 'var(--border-1)', 'border-2': 'var(--border-2)', 'border-gold': 'var(--border-gold)',
        'text-1': 'var(--text-1)', 'text-2': 'var(--text-2)', 'text-3': 'var(--text-3)',
        green: 'var(--green)', red: 'var(--red)', 'red-dim': 'var(--red-dim)', purple: 'var(--purple)',
      },
      fontFamily: { display: ['var(--font-display)'], body: ['var(--font-body)'] },
    },
  },
  plugins: [],
}
export default config
