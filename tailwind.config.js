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
        '36px',
        {
          lineHeight: '1.5',
          fontWeight: '700',
        },
      ],
      'heading1-semibold': [
        '36px',
        {
          lineHeight: '1.5',
          fontWeight: '600',
        },
      ],
      'heading2-bold': [
        '30px',
        {
          lineHeight: '1.5',
          fontWeight: '700',
        },
      ],
      'heading2-semibold': [
        '30px',
        {
          lineHeight: '1.5',
          fontWeight: '600',
        },
      ],
      'heading3-bold': [
        '22px',
        {
          lineHeight: '1.5',
          fontWeight: '700',
        },
      ],
      'heading3-medium': [
        '22px',
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
          lineHeight: '1.5',
          fontWeight: '400',
        },
      ],
      'small-medium': [
        '14px',
        {
          lineHeight: '1.5',
          fontWeight: '500',
        },
      ],
      // 'small-semibold': [
      //   '14px',
      //   {
      //     lineHeight: '1.5',
      //     fontWeight: '600',
      //   },
      // ],
      'subtle-medium': [
        '12px',
        {
          lineHeight: '1.5',
          fontWeight: '500',
        },
      ],
      // 'subtle-semibold': [
      //   '12px',
      //   {
      //     lineHeight: '1.5',
      //     fontWeight: '600',
      //   },
      // ],
      // 'tiny-medium': [
      //   '10px',
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
        danger: 'var(--danger)',
        'danger-foreground': 'var(--danger-foreground)',

        'primary-500': '#ec4899', // Pink 500
        'primary-800': '#9d174d', // Pink 800
        'primary-900': '#831843', // Pink 900

        main: '#0b0c0c', // body bg
        paper: '#121417', // bar, tab, card bg
        active: '#1a1c1e',
        border: '#1d1f21', // border
        'dark-blur': '#121417de', // 0.87 of paper, glassmorphism effect

        'light-1': '#FFFFFF',
        'light-2': '#cbd5e1', // Slate 300
        'light-3': '#64748b', // Slate 500
        'light-4': '#475569', // Slate 600
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
