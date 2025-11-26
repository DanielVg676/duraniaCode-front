/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: '#e2e8f0', // light
          dark: '#334155', // dark
        },
        input: {
          DEFAULT: '#f1f5f9',
          dark: '#1e293b',
        },
        ring: {
          DEFAULT: '#3b82f6',
          dark: '#60a5fa',
        },
        background: {
          DEFAULT: '#f8fafc', // light
          dark: '#0f172a', // dark
        },
        foreground: {
          DEFAULT: '#1e293b', // light
          dark: '#f1f5f9', // dark
        },
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f1f5f9',
          foreground: '#1e293b',
          dark: '#1e293b',
          'dark-foreground': '#f1f5f9',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
          dark: '#1e293b',
          'dark-foreground': '#94a3b8',
        },
        accent: {
          DEFAULT: '#dbeafe',
          foreground: '#1e40af',
          dark: '#1e293b',
          'dark-foreground': '#f1f5f9',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1e293b',
          dark: '#1e293b',
          'dark-foreground': '#f1f5f9',
        },
        emergency: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#1e293b',
        },
      },
    },
  },
  plugins: [],
}