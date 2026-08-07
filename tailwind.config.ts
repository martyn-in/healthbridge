import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          500: '#1E3E62',
          700: '#0F2A4A',
          900: '#0B192C',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#0D9488',
          600: '#0D9488',
          700: '#0F766E',
          900: '#134E4A',
        },
        cyan: {
          50: '#ECFEFF',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        emergency: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        }
      },
      borderRadius: {
        'lg': '14px',
        'xl': '18px',
        '2xl': '24px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'soft': '0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 2px 4px -1px rgba(15, 23, 42, 0.02)',
        'card': '0 8px 24px -4px rgba(15, 23, 42, 0.06)',
        'dropdown': '0 12px 32px -4px rgba(15, 23, 42, 0.12)',
      }
    },
  },
  plugins: [],
};
export default config;
