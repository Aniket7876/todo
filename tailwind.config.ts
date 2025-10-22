import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#05010f',
        indigo: {
          950: '#0b0426',
          glow: '#726dff',
        },
        fuchsia: {
          glow: '#ff6ad5',
        },
        aurora: '#1f153a',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-aurora': 'linear-gradient(135deg, rgba(120, 119, 198, 0.65), rgba(152, 115, 255, 0.35), rgba(242, 115, 255, 0.25))',
        'dawn-sky': 'linear-gradient(120deg, rgba(27, 44, 112, 0.95) 0%, rgba(99, 30, 132, 0.9) 40%, rgba(182, 72, 171, 0.9) 100%)',
      },
      boxShadow: {
        'glass-lg': '0 20px 45px -20px rgba(114, 109, 255, 0.55)',
        'glass-inner': 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
        neons: '0 8px 30px rgba(114, 109, 255, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
      borderRadius: {
        glass: '1.75rem',
      },
      backdropBlur: {
        xs: '2px',
        xl: '40px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-18px) scale(1.02)' },
        },
        aurora: {
          '0%': {
            transform: 'translate(-10%, -10%) rotate(0deg) scale(1) skewX(4deg)',
          },
          '50%': {
            transform: 'translate(10%, 10%) rotate(5deg) scale(1.1) skewX(-6deg)',
          },
          '100%': {
            transform: 'translate(-10%, -10%) rotate(0deg) scale(1) skewX(4deg)',
          },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', filter: 'blur(0px)' },
          '50%': { opacity: '0.75', filter: 'blur(3px)' },
        },
      },
      animation: {
        'float-slow': 'float 14s ease-in-out infinite',
        'float-delayed': 'float 18s ease-in-out infinite 2s',
        'aurora-drift': 'aurora 18s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 6s ease-in-out infinite',
      },
      screens: {
        '3xl': '1800px',
      },
    },
  },
  plugins: [],
};
export default config;
