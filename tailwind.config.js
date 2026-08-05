/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './App.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        // 'DM Sans' (web, Google Fonts) + 'DMSans' (native, expo-font) — same face
        sans: ['DM Sans', 'DMSans', 'system-ui', 'sans-serif'],
        heading: ['Literata', 'Georgia', 'serif'],
        dyslexic: [
          'OpenDyslexic',
          'DM Sans',
          'DMSans',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'accent-muted': '#D1FAE5', // = light-mode hsl(var(--accent)); kept for native (no CSS vars)
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Warm-minimal neutrals (mirror src/theme/colors/core.ts gray scale)
        'secondary-text': '#1F2937',
        neutral: '#C4BFB7',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      fontSize: {
        // Match typography.ts token scale for NativeWind className usage
        tab: ['10px', { lineHeight: '12px', fontWeight: '500' }],
        caption: ['13px', { lineHeight: '18px', fontWeight: '500' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        body: ['17px', { lineHeight: '24px', fontWeight: '400' }],
        'heading-3': ['20px', { lineHeight: '26px', fontWeight: '600' }],
        'heading-2': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        display: ['34px', { lineHeight: '41px', fontWeight: '700' }],
      },
      // Full airy: radii bumped app-wide (mirrors src/theme/airyScale.ts).
      // Canonical (AIRY_SCALE=true) = chip 10 / button 14 / xl 16 / 2xl+card 24 / 3xl 28.
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        chip: '10px',
        button: '14px',
        card: '24px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '28px',
      },
    },
  },
  plugins: [],
};
