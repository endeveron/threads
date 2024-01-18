/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    fontSize: {
      'heading1-bold': [
        '30px',
        {
          lineHeight: '1.5',
          fontWeight: '700',
        },
      ],
      'heading1-semibold': [
        '30px',
        {
          lineHeight: '1.5',
          fontWeight: '600',
        },
      ],
      'heading2-bold': [
        '24px',
        {
          lineHeight: '1.5',
          fontWeight: '700',
        },
      ],
      'heading2-semibold': [
        '24px',
        {
          lineHeight: '1.5',
          fontWeight: '600',
        },
      ],
      'heading3-bold': [
        '20px',
        {
          lineHeight: '1.5',
          fontWeight: '700',
        },
      ],
      'heading3-semibold': [
        '20px',
        {
          lineHeight: '1.5',
          fontWeight: '600',
        },
      ],
      'heading3-medium': [
        '20px',
        {
          lineHeight: '1.5',
          fontWeight: '500',
        },
      ],
      'heading4-bold': [
        '18px',
        {
          lineHeight: '1.5',
          fontWeight: '700',
        },
      ],
      'heading4-semibold': [
        '18px',
        {
          lineHeight: '1.5',
          fontWeight: '600',
        },
      ],
      'heading4-medium': [
        '18px',
        {
          lineHeight: '1.5',
          fontWeight: '500',
        },
      ],
      'base-regular': [
        '16px',
        {
          lineHeight: '1.5',
          fontWeight: '400',
        },
      ],
      'base-medium': [
        '16px',
        {
          lineHeight: '1.5',
          fontWeight: '500',
        },
      ],
      'base-semibold': [
        '16px',
        {
          lineHeight: '1.5',
          fontWeight: '600',
        },
      ],
      'small-regular': [
        '14px',
        {
          lineHeight: '1.75',
          fontWeight: '400',
        },
      ],
      'small-medium': [
        '14px',
        {
          lineHeight: '1.75',
          fontWeight: '500',
        },
      ],
      'subtle-medium': [
        '13px',
        {
          lineHeight: '1.5',
          fontWeight: '500',
        },
      ],
      // 'subtle-semibold': [
      //   '13px',
      //   {
      //     lineHeight: '1.5',
      //     fontWeight: '600',
      //   },
      // ],
      // 'tiny-medium': [
      //   '11px',
      //   {
      //     lineHeight: '1.5',
      //     fontWeight: '500',
      //   },
      // ],
      // 'x-small-semibold': [
      //   '7px',
      //   {
      //     lineHeight: '9.318px',
      //     fontWeight: '600',
      //   },
      // ],
    },
    extend: {
      colors: {
        'heading-1': 'var(--heading-1)', // h1
        'heading-2': 'var(--heading-2)', // h2, h3, h4

        main: 'var(--foreground)',
        secondary: 'var(--foreground-secondary)',
        tertiary: 'var(--foreground-tertiary)',
        accent: 'var(--accent)',

        background: 'var(--background)',
        'background-opac': 'var(--background-opac)',
        paper: 'var(--background-secondary)', // bar, tab, card
        'paper-hover': 'var(--background-secondary-hover)',
        'paper-blur': 'var(--background-secondary-opacity)',
        overlay: 'var(--background-overlay)',

        button: 'var(--button)',
        // 'button-secondary': 'var(--button-secondary)',

        border: 'var(--border)',

        danger: 'var(--danger)',
        'danger-foreground': 'var(--danger-foreground)',
      },
      boxShadow: {
        'count-badge': '0px 0px 6px 2px rgba(219, 188, 159, 0.30)',
        'groups-sidebar': '-30px 0px 60px 0px rgba(28, 28, 31, 0.50)',
      },
      screens: {
        xs: '450px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
