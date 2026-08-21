/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F8F8',
          100: '#E0EFEF',
          200: '#C1DFE0',
          300: '#95C5C7',
          400: '#64A5A8',
          500: '#42888B',
          600: '#326D70',
          700: '#2A585B',
          800: '#25494C',
          900: '#0F4C5C', // Deep Teal
          950: '#142C2F',
        },
        accent: {
          50: '#FEF6F1',
          100: '#FCEBE1',
          200: '#F8D0B7',
          300: '#F3AF87',
          400: '#ED8651',
          500: '#E36414', // Terracotta
          600: '#D54E0C',
          700: '#B13B0D',
          800: '#8D3010',
          900: '#722910',
          950: '#3E1206',
        },
        primary: {
          DEFAULT: '#0F4C5C',
          hover: '#2A585B',
          subtle: '#E0EFEF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8F9FA',
          elevated: '#FFFFFF',
          border: '#E2E8F0',
        },
        text: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
          inverse: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 24px -8px rgba(15, 23, 42, 0.12), 0 4px 8px -4px rgba(15, 23, 42, 0.04)',
        'elevated': '0 4px 20px -2px rgba(15, 23, 42, 0.1)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      maxWidth: {
        'container': '1280px',
      }
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
};