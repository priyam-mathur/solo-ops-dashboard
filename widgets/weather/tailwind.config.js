const tokens = require('../../shared/design-tokens');

module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: tokens.colors.light.background,
          dark: tokens.colors.dark.background
        },
        surface: {
          light: tokens.colors.light.surface,
          dark: tokens.colors.dark.surface
        },
        surfaceHover: {
          light: tokens.colors.light.surfaceHover,
          dark: tokens.colors.dark.surfaceHover
        },
        border: {
          light: tokens.colors.light.border,
          dark: tokens.colors.dark.border
        },
        textPrimary: {
          light: tokens.colors.light.textPrimary,
          dark: tokens.colors.dark.textPrimary
        },
        textSecondary: {
          light: tokens.colors.light.textSecondary,
          dark: tokens.colors.dark.textSecondary
        },
        textMuted: {
          light: tokens.colors.light.textMuted,
          dark: tokens.colors.dark.textMuted
        },
        brandPrimary: tokens.colors.light.primary,
        brandSuccess: tokens.colors.light.success,
        brandWarning: tokens.colors.light.warning,
        brandDanger: tokens.colors.light.danger,
        brandAccent: tokens.colors.light.accent
      },
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.shadows
    }
  },
  plugins: []
};
