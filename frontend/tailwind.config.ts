import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        'primary-dim': 'var(--primary-dim)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.4)',
        md: '0 4px 16px rgba(0,0,0,0.5)',
        'glow-gold': '0 0 24px rgba(245,200,66,0.12)',
        'glow-blue': '0 0 24px rgba(79,142,247,0.12)',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '6px',
        card: '12px',
        modal: '16px',
      },
      spacing: {
        '4.5': '18px',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
      maxWidth: {
        dashboard: '1440px',
      },
      width: {
        sidebar: '64px',
        'sidebar-open': '240px',
      },
    },
  },
  plugins: [],
}

export default config
