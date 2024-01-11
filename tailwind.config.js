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
        // 'primary-500': '#8b5cf6', // Violet 500
        // 'primary-800': '#4c1d95', // Violet 900
        // 'primary-900': '#2e1065', // Violet 950

        // 'primary-500': '#a855f7', // Purple 500
        // 'primary-800': '#581c87', // Purple 900
        // 'primary-900': '#3b0764', // Purple 950

        'primary-500': '#ec4899', // Pink 500
        'primary-800': '#9d174d', // Pink 800
        'primary-900': '#831843', // Pink 900

        'dark-1': '#0b0c0c', // bg-1 body
        'dark-2': '#121417', // bg-2 bar tab card
        'dark-2-active': '#1a1c1e',
        'dark-3': '#1F1F22', // border

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
        xs: '400px',
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
