/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#f6faff',
          dim: '#d2dbe4',
          bright: '#f6faff',
          container: {
            lowest: '#ffffff',
            low: '#ecf5fe',
            DEFAULT: '#e6eff8',
            high: '#e0e9f2',
            highest: '#dbe4ed',
          },
          variant: '#dbe4ed',
          tint: '#5d5c74',
        },
        'on-surface': {
          DEFAULT: '#141d23',
          variant: '#47464c',
        },
        primary: {
          DEFAULT: '#00000b',
          container: '#1a1a2e',
          fixed: { DEFAULT: '#e2e0fc', dim: '#c6c4df' },
        },
        'on-primary': {
          DEFAULT: '#ffffff',
          container: '#83829b',
          fixed: { DEFAULT: '#1a1a2e', variant: '#45455b' },
        },
        secondary: {
          DEFAULT: '#5c5f60',
          container: '#e1e3e4',
          fixed: { DEFAULT: '#e1e3e4', dim: '#c5c7c8' },
        },
        'on-secondary': {
          DEFAULT: '#ffffff',
          container: '#626566',
          fixed: { DEFAULT: '#191c1d', variant: '#454748' },
        },
        tertiary: {
          DEFAULT: '#695d3c',
          container: '#b9aa83',
          fixed: { DEFAULT: '#f2e1b7', dim: '#d5c59d' },
        },
        'on-tertiary': {
          DEFAULT: '#ffffff',
          container: '#493f20',
          fixed: { DEFAULT: '#231b02', variant: '#514627' },
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': {
          DEFAULT: '#ffffff',
          container: '#93000a',
        },
        outline: {
          DEFAULT: '#78767d',
          variant: '#c8c5cd',
        },
        inverse: {
          surface: '#293138',
          'on-surface': '#e9f2fb',
          primary: '#c6c4df',
        },
        background: '#f6faff',
        'on-background': '#141d23',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      spacing: {
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
        'section-gap': '64px',
        gutter: '24px',
        unit: '4px',
        'margin-mobile': '16px',
        'container-max': '1280px',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        h1: ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'chip-text': ['14px', { lineHeight: '1', fontWeight: '600' }],
        'label-caps': ['12px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '700' }],
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 24px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
