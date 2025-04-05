/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D1226', // Dark blue (background)
        secondary: '#131A35', // Slightly lighter blue (cards)
        accent: '#3C5DFF', // Accent blue
        accentGradient: '#7A42FF', // Secondary gradient color
        text: '#FFFFFF',
        textSecondary: '#9CA3AF',
        border: '#2D3748',
        success: '#10B981', // Green for positive outcomes
        warning: '#F59E0B', // Orange for warnings
        danger: '#EF4444',  // Red for negative outcomes
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.25)',
        glow: '0 0 20px rgba(60, 93, 255, 0.5)',
      },
    },
  },
  plugins: [],
}